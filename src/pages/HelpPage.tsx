// ======================================================
// HelpPage.tsx
// ------------------------------------------------------
// Help & documentation.
// Shows a top-level overview of what the app does, followed
// by collapsible "chapters" that explain each area of the
// app in more detail. Follows the same page layout / panel
// conventions as SettingsPage.tsx / AppearancePage.tsx.
// ======================================================
import { useState } from "react";

// ── Chapter data ───────────────────────────────────────────────────────────
type Chapter = {
  id: string;
  title: string;
  icon: string;
  body: string[];
};

// NOTE: chapter body copy is intentionally left empty for now.
// Section headers and icons are in place; text to be written later.
const chapters: Chapter[] = [
  { id: "wip", title: "WIP", icon: "🚧", body: [] },
];

// ── Benefits shown in the About section ────────────────────────────────────
const benefits: string[] = [
  "One app instead of many. Tasks, notes, session tracking, and a focus timer all live together, so you're not juggling separate tools for each part of your workflow.",
  "Mood-aware organisation. Tasks and workspaces are grouped by Focused, Planning, and Recharge, so you always see the work that matches your current headspace.",
  "Visual feedback that matches your state. The animated background shifts with your chosen mood, so the app has some atmosphere instead of a static interface.",
  "Long-term tracking with Journey. Sessions build into a history over time, so progress on longer goals doesn't get lost between sittings.",
  "Built to be customised. Appearance, notification sounds, and general behaviour can all be adjusted from Settings.",
];

// ── Collapsible chapter row ─────────────────────────────────────────────────
function ChapterRow({ chapter, isOpen, onToggle }: {
  chapter: Chapter;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="glass-panel help-chapter">
      <div className="help-chapter-header" onClick={onToggle}>
        <span className="help-chapter-icon">{chapter.icon}</span>
        <h3>{chapter.title}</h3>
        <span className={`help-chapter-caret${isOpen ? " open" : ""}`}>›</span>
      </div>

      {isOpen && (
        <div className="help-chapter-body">
          {chapter.body.length > 0 ? (
            chapter.body.map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p className="help-chapter-placeholder">More on this coming soon.</p>
          )}
        </div>
      )}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────
export default function HelpPage() {
  const [openChapterId, setOpenChapterId] = useState<string | null>(null);

  function toggleChapter(id: string) {
    setOpenChapterId((current) => (current === id ? null : id));
  }

  return (
    <div className="help-page">
      <h1>Help</h1>

      <div className="glass-panel help-about">
        <div className="help-about-header">
          <h2 className="help-about-title">BetterEveryDay</h2>
          <p className="help-about-tagline">A task builder that reacts to your mood.</p>
        </div>

        <div className="help-about-section">
          <h3>The Goal</h3>
          <p>
            Better Every Day started from a frustration with productivity apps that pile on
            features until the actual work gets buried under menus, tabs, and settings you
            never asked for. This app is meant to stay simple: one workspace that adapts to
            how you're working, instead of one bloated app trying to do everything at once.
          </p>
          <p>
            Tasks, notes, session tracking, and a focus timer all live under one roof, and
            the app's look shifts with whichever mood you've chosen for the day.
          </p>
        </div>

        <div className="help-about-section">
          <h3>Benefits</h3>
          <ul className="help-about-benefits">
            {benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="help-chapters">
        {chapters.map((chapter) => (
          <ChapterRow
            key={chapter.id}
            chapter={chapter}
            isOpen={openChapterId === chapter.id}
            onToggle={() => toggleChapter(chapter.id)}
          />
        ))}
      </div>
    </div>
  );
}
