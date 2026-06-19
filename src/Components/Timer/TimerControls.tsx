// ======================================================
// TimerControls.tsx
// ------------------------------------------------------
// Timer buttons and duration input.
// ======================================================


type TimerControlProps =
{
    minutes: number;
    seconds: number;

    isRunning: boolean;
    onMinutesChange: (Value: number) => void;
    onSecondsChange: (Value: number) => void;

    onStart: () => void;
    onPause: () => void;
    onReset: () => void;  
};

export default function TimerControls (
    {
        minutes,
        seconds,
        isRunning,

        onMinutesChange,
        onSecondsChange,

        onStart,
        onPause,
        onReset,
    }: TimerControlProps)
    {
        return  (
        <div className="timer-controls">

            <div className="arrow-row">

                <div className="arrow-group">
                    <button
                        className="timer-btn"
                        onClick={() => onMinutesChange(minutes + 1)}
                    >
                        ▲
                    </button>

                    <button
                        className="timer-btn"
                        onClick={() =>
                            onMinutesChange(Math.max(0, minutes - 1))
                        }
                    >
                        ▼
                    </button>
                </div>

                <div className="arrow-group">
                    <button
                        className="timer-btn"
                        onClick={() =>
                            onSecondsChange(Math.min(59, seconds + 1))
                        }
                    >
                        ▲
                    </button>

                    <button
                        className="timer-btn"
                        onClick={() =>
                            onSecondsChange(Math.max(0, seconds - 1))
                        }
                    >
                        ▼
                    </button>
                </div>

            </div>

            <div className="button-row">

                <button
                    className="timer-btn"
                    onClick={isRunning ? onPause : onStart}
                >
                    {isRunning ? "Pause" : "Start"}
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