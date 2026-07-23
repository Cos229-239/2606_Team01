import { useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { getPageHelp } from "../Data/pageHelpContent";
import Tooltip from "./Tooltip";

// ── ContextHelpButton ───────────────────────────────────────────────────
// Small (?) button that sits next to the Timer button in the toolbar.
// Looks up help content for the current route from the same data the
// full Help page reads from, and shows it in a popup without navigating
// anywhere. Renders nothing when:
//   - the current page has no counterpart section on the Help page, or
//   - the user is already on the Help page itself.
export default function ContextHelpButton() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const entry = getPageHelp(location.pathname);
  const onHelpPage = location.pathname.toLowerCase().replace(/\/+$/, "") === "/help";

  if (!entry || onHelpPage) {
    return null;
  }

  return (
    <>
      {/* Uses the app's own Tooltip component (same as Back/Dashboard/
          Timer) instead of a native `title` attribute. The native
          tooltip has its own ~1s hover delay and renders at the OS/
          Chromium layer, so it can visually spill over the Timer
          button next to it regardless of our z-index/layout. */}
      <Tooltip text={`Help for ${entry.title}`}>
        <button
          className="context-help-btn"
          aria-label={`Help for ${entry.title}`}
          onClick={() => setOpen(true)}
        >
          ?
        </button>
      </Tooltip>

      {/* Rendered via portal straight into document.body. The toolbar
          has `backdrop-filter` on it, which (like `transform`/`filter`)
          creates a new containing block for `position: fixed`
          descendants — so without the portal, this overlay was being
          sized/centered against the toolbar instead of the viewport,
          which is why it could render off-center or run off-screen. */}
      {open && createPortal(
        <div className="popup-overlay" onClick={() => setOpen(false)}>
          <div
            className="glass-panel context-help-popup"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="context-help-popup-header">
              <div className="help-section-header" style={{ marginBottom: 0 }}>
                <span className="help-section-icon">{entry.icon}</span>
                <div>
                  <h2 className="help-section-title">{entry.title}</h2>
                  <p className="help-section-subtitle">{entry.subtitle}</p>
                </div>
              </div>
              <button
                className="context-help-popup-close"
                aria-label="Close"
                title="Close"
                onClick={() => setOpen(false)}
              >
                ✕
              </button>
            </div>

            <div className="context-help-popup-body help-section-body">
              {entry.body}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
