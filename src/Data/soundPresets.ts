// ======================================================
// soundPresets.ts
// ------------------------------------------------------
// Notification sound presets, synthesized entirely with the
// Web Audio API. No external audio files -- avoids copyright
// concerns and keeps the app bundle small. Five short
// sci-fi / lo-fi flavored tones live here.
//
// Waveforms lean triangle/sine rather than square/pulse --
// square waves are what read as "chiptune" (hard, buzzy
// harmonics); triangle and sine are softer and rounder while
// still feeling synthetic. Everything is also gently lowpass
// filtered to knock the edge off, and most presets run
// through an echo or reverb send for a bit of space.
// ======================================================

export type NotificationSoundPreset = "pulse" | "chime" | "sweep" | "lofi-drift" | "cascade" | "collect";

export const PRESET_LIST: NotificationSoundPreset[] = ["pulse", "chime", "sweep", "lofi-drift", "cascade", "collect"];

// ── Shared audio context ──────────────────────────────────────────────────
// One AudioContext is reused for the life of the window rather than
// creating a new one per playback.
let sharedContext: AudioContext | null = null;

export function getAudioContext(): AudioContext {
    if (!sharedContext) {
        sharedContext = new AudioContext();
    }
    return sharedContext;
}

function makeMasterGain(ctx: AudioContext, volume: number): GainNode {
    const gain = ctx.createGain();
    gain.gain.value = Math.max(0, Math.min(1, volume));
    gain.connect(ctx.destination);
    return gain;
}

// ── Space effects (echo + reverb) ─────────────────────────────────────────
// Both return an "input" gain node. Presets connect their dry signal into
// that input; internally it feeds a wet (delayed or diffused) copy back
// into `dest` alongside the dry signal, which also passes straight through.

function createImpulseResponse(ctx: AudioContext, duration: number, decay: number): AudioBuffer {
    const length = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const impulse = ctx.createBuffer(2, length, ctx.sampleRate);
    for (let channel = 0; channel < 2; channel++) {
        const data = impulse.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, decay);
        }
    }
    return impulse;
}

// Diffuse, tail-style reverb -- good for the sustained/bell-like presets.
function addReverbSend(
    ctx: AudioContext,
    dest: AudioNode,
    opts: { wet?: number; duration?: number; decay?: number } = {}
): AudioNode {
    const { wet = 0.28, duration = 1.5, decay = 2.4 } = opts;

    const input = ctx.createGain();
    const convolver = ctx.createConvolver();
    convolver.buffer = createImpulseResponse(ctx, duration, decay);
    const wetGain = ctx.createGain();
    wetGain.gain.value = wet;

    input.connect(dest);
    input.connect(convolver);
    convolver.connect(wetGain);
    wetGain.connect(dest);

    return input;
}

// Discrete, tape-style echo (with feedback that darkens on each repeat) --
// good for the punchier, percussive presets.
function addEchoSend(
    ctx: AudioContext,
    dest: AudioNode,
    opts: { delayTime?: number; feedback?: number; wet?: number } = {}
): AudioNode {
    const { delayTime = 0.16, feedback = 0.32, wet = 0.28 } = opts;

    const input = ctx.createGain();
    const delay = ctx.createDelay(1.0);
    delay.delayTime.value = delayTime;
    const feedbackGain = ctx.createGain();
    feedbackGain.gain.value = feedback;
    const darken = ctx.createBiquadFilter();
    darken.type = "lowpass";
    darken.frequency.value = 3200;
    const wetGain = ctx.createGain();
    wetGain.gain.value = wet;

    input.connect(dest);
    input.connect(delay);
    delay.connect(darken);
    darken.connect(feedbackGain);
    feedbackGain.connect(delay); // feedback loop -- repeats decay naturally
    darken.connect(wetGain);
    wetGain.connect(dest);

    return input;
}

// ── Low-level scheduling helpers ──────────────────────────────────────────
function scheduleTone(
    ctx: AudioContext,
    dest: AudioNode,
    opts: { freq: number; start: number; duration: number; type?: OscillatorType; peak?: number; endFreq?: number; filterFreq?: number }
): void {
    const { freq, start, duration, type = "sine", peak = 0.9, endFreq, filterFreq } = opts;
    const now = ctx.currentTime + start;

    const osc = ctx.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);
    if (endFreq !== undefined) {
        osc.frequency.exponentialRampToValueAtTime(Math.max(1, endFreq), now + duration);
    }

    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(0.0001, now);
    envelope.gain.exponentialRampToValueAtTime(peak, now + Math.min(0.03, duration / 3));
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(envelope);

    // Optional gentle lowpass to round off harsher waveform harmonics --
    // this is most of what keeps triangle/saw tones from sounding "8-bit".
    if (filterFreq !== undefined) {
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.value = filterFreq;
        envelope.connect(filter);
        filter.connect(dest);
    } else {
        envelope.connect(dest);
    }

    osc.start(now);
    osc.stop(now + duration + 0.05);
}

function scheduleNoiseBurst(
    ctx: AudioContext,
    dest: AudioNode,
    opts: { start: number; duration: number; filterFreq?: number; peak?: number }
): void {
    const { start, duration, filterFreq = 2000, peak = 0.4 } = opts;
    const now = ctx.currentTime + start;

    const bufferSize = Math.max(1, Math.floor(ctx.sampleRate * duration));
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = filterFreq;
    filter.Q.value = 1.2;

    const envelope = ctx.createGain();
    envelope.gain.setValueAtTime(peak, now);
    envelope.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    source.connect(filter);
    filter.connect(envelope);
    envelope.connect(dest);

    source.start(now);
    source.stop(now + duration + 0.02);
}

// A cheap sample-and-hold bitcrusher via a WaveShaper quantization curve --
// gives the lo-fi preset its dusty, stepped texture.
function makeBitcrusher(ctx: AudioContext, steps = 6): WaveShaperNode {
    const shaper = ctx.createWaveShaper();
    const curve = new Float32Array(1024);
    for (let i = 0; i < curve.length; i++) {
        const x = (i / (curve.length - 1)) * 2 - 1;
        curve[i] = Math.round(x * steps) / steps;
    }
    shaper.curve = curve;
    shaper.oversample = "none";
    return shaper;
}

// ── Preset definitions ────────────────────────────────────────────────────
interface PresetDef {
    label: string;
    play: (ctx: AudioContext, volume: number) => void;
}

export const PRESETS: Record<NotificationSoundPreset, PresetDef> = {
    pulse: {
        label: "Pulse",
        play(ctx, volume) {
            const master = makeMasterGain(ctx, volume);
            const space = addEchoSend(ctx, master, { delayTime: 0.15, feedback: 0.22, wet: 0.22 });
            scheduleTone(ctx, space, { freq: 480, start: 0,    duration: 0.13, type: "triangle", peak: 0.55, filterFreq: 2600 });
            scheduleTone(ctx, space, { freq: 610, start: 0.12, duration: 0.13, type: "triangle", peak: 0.55, filterFreq: 2600 });
            scheduleTone(ctx, space, { freq: 780, start: 0.24, duration: 0.19, type: "triangle", peak: 0.6,  filterFreq: 2800 });
        },
    },
    chime: {
        label: "Data Chime",
        play(ctx, volume) {
            const master = makeMasterGain(ctx, volume);
            const space = addReverbSend(ctx, master, { wet: 0.38, duration: 1.8, decay: 2.1 });
            scheduleTone(ctx, space, { freq: 1046.5, start: 0,    duration: 0.55, type: "sine",     peak: 0.5  });
            scheduleTone(ctx, space, { freq: 1568,   start: 0,    duration: 0.45, type: "triangle", peak: 0.22, filterFreq: 3500 });
            scheduleTone(ctx, space, { freq: 2093,   start: 0.05, duration: 0.4,  type: "sine",     peak: 0.12 });
        },
    },
    sweep: {
        label: "Sweep",
        play(ctx, volume) {
            const master = makeMasterGain(ctx, volume);
            const space = addEchoSend(ctx, master, { delayTime: 0.22, feedback: 0.25, wet: 0.2 });
            scheduleTone(ctx, space, { freq: 220, endFreq: 1200, start: 0, duration: 0.4, type: "triangle", peak: 0.42, filterFreq: 2200 });
            scheduleNoiseBurst(ctx, space, { start: 0.34, duration: 0.18, filterFreq: 2400, peak: 0.14 });
        },
    },
    "lofi-drift": {
        label: "Lo-Fi Drift",
        play(ctx, volume) {
            const master = makeMasterGain(ctx, volume);
            const space = addReverbSend(ctx, master, { wet: 0.32, duration: 1.7, decay: 2.6 });

            const crusher = makeBitcrusher(ctx, 5);
            const filter = ctx.createBiquadFilter();
            filter.type = "lowpass";
            filter.frequency.value = 1700;

            crusher.connect(filter);
            filter.connect(space);

            const notes = [261.6, 329.6, 392, 523.2];
            notes.forEach((freq, i) => {
                scheduleTone(ctx, crusher, { freq, start: i * 0.1, duration: 0.3, type: "triangle", peak: 0.48 });
            });
        },
    },
    cascade: {
        label: "Cascade",
        play(ctx, volume) {
            const master = makeMasterGain(ctx, volume);
            const space = addEchoSend(ctx, master, { delayTime: 0.13, feedback: 0.34, wet: 0.3 });
            const notes = [1100, 880, 700, 560];
            notes.forEach((freq, i) => {
                scheduleTone(ctx, space, { freq, start: i * 0.08, duration: 0.13, type: "triangle", peak: 0.45, filterFreq: 3200 });
            });
            scheduleNoiseBurst(ctx, space, { start: notes.length * 0.08, duration: 0.22, filterFreq: 1100, peak: 0.12 });
        },
    },
    // Rhodes-style FM electric-piano arpeggio -- six rising notes with a
    // hall reverb tail and a ping-pong echo. Ported from the "collecting a
    // shape/object/item" sound in the scavenger hunt game.
    collect: {
        label: "Marimba",
        play(ctx, volume) {
            const now = ctx.currentTime;

            const master = ctx.createGain();
            master.gain.value = Math.max(0, Math.min(1, volume)) * 0.78;
            master.connect(ctx.destination);

            // Lush convolution reverb (hall-style tail)
            const revLen = Math.floor(ctx.sampleRate * 3.2);
            const revBuf = ctx.createBuffer(2, revLen, ctx.sampleRate);
            for (let ch = 0; ch < 2; ch++) {
                const data = revBuf.getChannelData(ch);
                for (let i = 0; i < revLen; i++) {
                    const t = i / ctx.sampleRate;
                    const env = Math.pow(1 - i / revLen, 2.2) * Math.exp(-t * 1.1);
                    data[i] = (Math.random() * 2 - 1) * env;
                }
            }
            const conv = ctx.createConvolver();
            conv.buffer = revBuf;
            const revGain = ctx.createGain();
            revGain.gain.value = 0.55;
            conv.connect(revGain);
            revGain.connect(master);

            // Ping-pong style echo -- three repeats, 250ms apart, decaying
            const delayTimes = [0.25, 0.50, 0.75];
            const delayNodes = delayTimes.map(dt => {
                const d = ctx.createDelay(2.0);
                d.delayTime.value = dt;
                return d;
            });
            const delayGains = [0.38, 0.22, 0.12].map(g => {
                const n = ctx.createGain();
                n.gain.value = g;
                return n;
            });
            delayNodes.forEach((d, i) => {
                d.connect(delayGains[i]);
                delayGains[i].connect(master);
                delayGains[i].connect(conv);
            });

            // One Rhodes-style FM electric-piano note: sine carrier, sine
            // modulator at ~14x the carrier freq (gives the bell-like
            // overtone cluster), modulation index decays fast for a
            // percussive click that settles into a warm sustained tone.
            function epianoNote(t: number, freq: number, gainScale: number): void {
                const decayTime = 1.05;
                const attackTime = 0.008;

                const modFreqRatio = 14.0;
                const modulator = ctx.createOscillator();
                const modGain = ctx.createGain();
                modulator.type = "sine";
                modulator.frequency.value = freq * modFreqRatio;
                modGain.gain.setValueAtTime(freq * 5.0, t);
                modGain.gain.exponentialRampToValueAtTime(freq * 0.2, t + 0.08);
                modGain.gain.exponentialRampToValueAtTime(freq * 0.05, t + decayTime * 0.6);
                modulator.connect(modGain);

                const carrier = ctx.createOscillator();
                carrier.type = "sine";
                carrier.frequency.value = freq;
                modGain.connect(carrier.frequency);

                const ampEnv = ctx.createGain();
                ampEnv.gain.setValueAtTime(0.0001, t);
                ampEnv.gain.linearRampToValueAtTime(gainScale * 0.70, t + attackTime);
                ampEnv.gain.exponentialRampToValueAtTime(gainScale * 0.40, t + 0.12);
                ampEnv.gain.exponentialRampToValueAtTime(gainScale * 0.08, t + decayTime);
                ampEnv.gain.exponentialRampToValueAtTime(0.0001, t + decayTime * 1.8);

                carrier.connect(ampEnv);
                ampEnv.connect(master);
                ampEnv.connect(conv);
                ampEnv.connect(delayNodes[0]);

                // Subtle octave shimmer for a bit of Rhodes sparkle
                const shimmer = ctx.createOscillator();
                const shimGain = ctx.createGain();
                shimmer.type = "sine";
                shimmer.frequency.value = freq * 2;
                shimGain.gain.setValueAtTime(0.0001, t);
                shimGain.gain.linearRampToValueAtTime(gainScale * 0.10, t + attackTime);
                shimGain.gain.exponentialRampToValueAtTime(0.0001, t + decayTime * 0.5);
                shimmer.connect(shimGain);
                shimGain.connect(master);
                shimGain.connect(conv);

                const stopAt = t + decayTime * 2.2;
                modulator.start(t); modulator.stop(stopAt);
                carrier.start(t);   carrier.stop(stopAt);
                shimmer.start(t);   shimmer.stop(stopAt);
            }

            // Six rising notes
            const notes = [
                { t: 0.000, freq: 125, gain: 1.00 },
                { t: 0.250, freq: 163, gain: 0.93 },
                { t: 0.500, freq: 188, gain: 0.86 },
                { t: 0.750, freq: 213, gain: 0.79 },
                { t: 1.000, freq: 238, gain: 0.72 },
                { t: 1.250, freq: 300, gain: 0.65 },
            ];
            notes.forEach(n => epianoNote(now + n.t, n.freq, n.gain));
        },
    },
};

export function playPreset(preset: NotificationSoundPreset, volume: number): void {
    const def = PRESETS[preset] ?? PRESETS.pulse;
    const ctx = getAudioContext();
    if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
    }
    def.play(ctx, volume);
}
