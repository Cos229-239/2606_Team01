import { useCallback, useState } from "react";
import { getConfirmBeforeDelete } from "../Data/generalSettings";

interface PendingConfirm {
    message: string;
    onConfirm: () => void;
}

// ── useConfirmDelete ────────────────────────────────────────────────────
// Wraps a destructive action so it respects the "Confirm before deleting"
// Notebook setting (Settings > Notebook). Usage:
//
//   const { requestDelete, confirmDialog } = useConfirmDelete();
//   ...
//   <button onClick={() => requestDelete("Delete this page?", () => onDeletePage(page.id))}>X</button>
//   ...
//   return <>{confirmDialog}{/* rest of component */}</>;
//
// The setting is read fresh on every call (not memoized) so a change made
// on the settings page while this component is mounted still takes effect.
export function useConfirmDelete() {
    const [pending, setPending] = useState<PendingConfirm | null>(null);

    const requestDelete = useCallback((message: string, onConfirm: () => void) => {
        if (!getConfirmBeforeDelete()) {
            onConfirm();
            return;
        }
        setPending({ message, onConfirm });
    }, []);

    function handleConfirm() {
        pending?.onConfirm();
        setPending(null);
    }

    function handleCancel() {
        setPending(null);
    }

    const confirmDialog = pending ? (
        <div className="popup-overlay" onClick={handleCancel}>
            <div
                className="glass-panel popup-window"
                style={{ width: "360px" }}
                onClick={(e) => e.stopPropagation()}
            >
                <h2>Delete</h2>
                <p style={{ margin: "0 0 4px", fontSize: "13px", color: "rgba(220,235,255,0.85)", lineHeight: 1.5 }}>
                    {pending.message}
                </p>
                <div className="popup-actions">
                    <button className="btn-primary" onClick={handleConfirm}>Delete</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </div>
        </div>
    ) : null;

    return { requestDelete, confirmDialog };
}
