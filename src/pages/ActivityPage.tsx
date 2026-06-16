//imports
import { useEffect, useState } from "react";

//custom type
type ActivityPageProps = {
  activityName: string;
};

//function def
function ActivityPage({ activityName }: ActivityPageProps) {

  const storageKey = `activity-notes-${activityName}`;

  const [notes, setNotes] = useState("");

  // Load notes when the activity page opens
  useEffect(() => {
    const savedNotes = localStorage.getItem(storageKey);

    console.log("Loading from:", storageKey, savedNotes);

    if (savedNotes !== null) {
      setNotes(savedNotes);
    } else {
      setNotes("");
    }
  }, [storageKey]);

  // Save notes every time user types
  useEffect(() => {
    console.log("Saving to:", storageKey, notes);

    localStorage.setItem(storageKey, notes);
  }, [notes, storageKey]);

  //return statement
  return (
    <div className="activity-section">
      <h1>{activityName}</h1>
      <div className="session-label">Current Session</div>

      <textarea
        className="notes-textarea"
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        placeholder="Log your thoughts, progress, or session notes here."
        rows={10}
      />

      <p className="autosave-label">Notes Saved Automatically</p>

      <div className="activity-actions">
        <button>Start New Session</button>
        <button>View Old Sessions</button>
      </div>

      <p className="placeholder-text">Timer will go here later.</p>
      <p className="placeholder-text">Old session history will go here later.</p>
    </div>
  );
}

//export
export default ActivityPage;
