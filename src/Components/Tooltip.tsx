import { useState, type ReactNode } from "react";

interface TooltipProps {
  text: string;
  children: ReactNode;
  // Where the bubble opens relative to the trigger. Defaults to below,
  // since that's clear of the toolbar and most button rows in the app.
  side?: "top" | "bottom" | "left" | "right";
}

// ── Tooltip ──────────────────────────────────────────────────────────────
// Lightweight hover/focus tooltip. Wraps a single child (usually a button)
// and shows a small glass-styled bubble near it. Doesn't rely on the
// native `title` attribute so it can match the rest of the app's visual
// language and show up instantly rather than after the browser's delay.
export default function Tooltip({ text, children, side = "bottom" }: TooltipProps) {
  const [visible, setVisible] = useState(false);

  return (
    <span
      className="tooltip-wrapper"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}
      onBlur={() => setVisible(false)}
    >
      {children}
      {visible && (
        <span className={`tooltip-bubble tooltip-${side}`} role="tooltip">
          {text}
        </span>
      )}
    </span>
  );
}
