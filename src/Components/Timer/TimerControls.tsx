// ======================================================
// TimerControls.tsx
// ------------------------------------------------------
// The big countdown numbers AND their editing controls,
// built as one component so they can never drift out of
// alignment with each other (previously a separate big
// "display" element sat absolutely-positioned on top of a
// separately-laid-out small "controls" row, and the two
// would visibly mismatch).
//
// Layout: a single row of unit columns (H, :, M, :, S).
// Each real unit column stacks [up arrow] [big digits]
// [down arrow] [label]; the colon columns mirror that
// same stack with invisible (visibility:hidden, so they
// still take up space) placeholders standing in for the
// arrow/label so every colon lands exactly mid-digit no
// matter the column.
//
// The digits themselves are always visible at full size.
// The arrows, labels, presets, and Play/Reset buttons are
// "chrome" that fades in on hover (via the timer-chrome
// class), so the resting state is just a clean clock.
//
// Time is owned by the parent as a single `totalSeconds`
// number. Arrow increments/decrements work by adding or
// subtracting a fixed amount (1s / 1min / 1hr) from that
// total and re-deriving h/m/s — which is what gives "free"
// rollover in both directions, e.g. decrementing seconds
// at 30:00 borrows from the minutes to land on 29:59,
// rather than clamping at 30:00. The same carry is what
// makes the Hours column appear on its own once minutes
// roll past 59 — it's only rendered when hours > 0.
//
// Each unit can also be clicked to type a value in
// directly, and a row of presets (5/10/20/30 min, 1 hour)
// jumps straight to a duration.
// ======================================================

import { useState } from "react";

type TimerControlProps =
{
    totalSeconds: number;
    isRunning: boolean;

    onTimeChange: (totalSeconds: number) => void;

    onStart: () => void;
    onPause: () => void;
    onReset: () => void;
};

const PRESETS: { label: string; seconds: number }[] = [
    { label: "5m",  seconds: 5 * 60 },
    { label: "10m", seconds: 10 * 60 },
    { label: "20m", seconds: 20 * 60 },
    { label: "30m", seconds: 30 * 60 },
    { label: "1h",  seconds: 60 * 60 },
];

const MAX_TOTAL_SECONDS = 99 * 3600 + 59 * 60 + 59; // cap at 99:59:59

function clampTotal(totalSeconds: number): number
{
    return Math.min(MAX_TOTAL_SECONDS, Math.max(0, Math.round(totalSeconds)));
}

function splitTime(totalSeconds: number)
{
    const clamped = clampTotal(totalSeconds);
    return {
        hours: Math.floor(clamped / 3600),
        minutes: Math.floor((clamped % 3600) / 60),
        seconds: clamped % 60,
    };
}

type Unit = "hours" | "minutes" | "seconds";

// A spacer that mirrors the [arrow][value][arrow][label] stack of a real
// unit column but stays invisible — used to keep the colon's vertical
// position pixel-identical to its neighboring digits.
function GhostRung()
{
    return <span className="timer-btn timer-btn--arrow timer-ghost" aria-hidden="true">▲</span>;
}

export default function TimerControls(
    {
        totalSeconds,
        isRunning,

        onTimeChange,

        onStart,
        onPause,
        onReset,
    }: TimerControlProps)
    {
        const { hours, minutes, seconds } = splitTime(totalSeconds);
        const showHours = hours > 0;

        // Which unit (if any) is currently being typed into directly.
        const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
        const [draftValue, setDraftValue] = useState("");

        function step(amountSeconds: number)
        {
            onTimeChange(clampTotal(totalSeconds + amountSeconds));
        }

        function beginEdit(unit: Unit, currentValue: number)
        {
            setEditingUnit(unit);
            setDraftValue(String(currentValue));
        }

        function commitEdit()
        {
            if (editingUnit === null) return;

            const parsed = parseInt(draftValue, 10);
            const safeValue = Number.isNaN(parsed) ? 0 : Math.max(0, parsed);

            const next = { hours, minutes, seconds };
            if (editingUnit === "hours") {
                next.hours = Math.min(99, safeValue);
            } else if (editingUnit === "minutes") {
                next.minutes = Math.min(59, safeValue);
            } else {
                next.seconds = Math.min(59, safeValue);
            }

            onTimeChange(clampTotal(next.hours * 3600 + next.minutes * 60 + next.seconds));
            setEditingUnit(null);
        }

        function cancelEdit()
        {
            setEditingUnit(null);
        }

        function renderUnit(unit: Unit, value: number, label: string, stepAmount: number)
        {
            const isEditing = editingUnit === unit;

            return (
                <div className="arrow-group" key={unit}>
                    <button
                        className="timer-btn timer-btn--arrow timer-chrome"
                        onClick={() => step(stepAmount)}
                        aria-label={`Increase ${label}`}
                    >
                        ▲
                    </button>

                    {isEditing ? (
                        <input
                            className="timer-unit-input"
                            type="text"
                            inputMode="numeric"
                            autoFocus
                            value={draftValue}
                            onChange={(e) => setDraftValue(e.target.value.replace(/[^0-9]/g, ""))}
                            onBlur={commitEdit}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") commitEdit();
                                if (e.key === "Escape") cancelEdit();
                            }}
                            onFocus={(e) => e.target.select()}
                        />
                    ) : (
                        <span
                            className="timer-unit-value"
                            onClick={() => beginEdit(unit, value)}
                            title="Click to type a value"
                        >
                            {value.toString().padStart(2, "0")}
                        </span>
                    )}

                    <button
                        className="timer-btn timer-btn--arrow timer-chrome"
                        onClick={() => step(-stepAmount)}
                        aria-label={`Decrease ${label}`}
                    >
                        ▼
                    </button>

                    <span className="timer-unit-label timer-chrome">{label}</span>
                </div>
            );
        }

        function renderColon(key: string)
        {
            return (
                <div className="arrow-group timer-colon-group" key={key} aria-hidden="true">
                    <GhostRung />
                    <span className="timer-unit-value timer-colon">:</span>
                    <GhostRung />
                    <span className="timer-unit-label timer-ghost">&nbsp;</span>
                </div>
            );
        }

        return  (
        <div className="timer-controls">

            <div className="timer-presets timer-chrome">
                {PRESETS.map(preset => (
                    <button
                        key={preset.label}
                        className="timer-pill"
                        onClick={() => onTimeChange(preset.seconds)}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>

            <div className="arrow-row">
                {showHours && renderUnit("hours", hours, "H", 3600)}
                {showHours && renderColon("colon-h")}
                {renderUnit("minutes", minutes, "M", 60)}
                {renderColon("colon-m")}
                {renderUnit("seconds", seconds, "S", 1)}
            </div>

            <div className="button-row timer-chrome">

                <button
                    className="timer-btn"
                    onClick={isRunning ? onPause : onStart}
                >
                    {isRunning ? "Pause" : "Play"}
                </button>

                <button
                    className="timer-btn"
                    onClick={onReset}
                >
                    Reset
                </button>

            </div>

        </div>
    );
}
