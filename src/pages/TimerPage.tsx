import { useState } from "react";

function TimerPage()
{

    const [ showControls, setShowControls ] = useState(false);

return(

    <div
        className = "timer-page"
        onMouseEnter ={() => setShowControls(true)}
        onMouseLeave = {() => setShowControls(false)}>

            {/* Center Display */}
            <div className = "timer-display">
                25:00
            </div>

            {/* Hover Controls */}
            { showControls && (
                <div className = "timer-controls">
                    <button className = "timer-btn"> Start </ button>

                    <button className = "timer-btn"> Reset </button>
                </div>
            )}
    </div>
);
}

export default TimerPage;