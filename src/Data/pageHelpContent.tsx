// ======================================================
// pageHelpContent.tsx
// ------------------------------------------------------
// Single source of truth for the help text that appears
// in two places:
//   1. The full Help page (HelpPage.tsx), under each
//      section (Congruence, Journey, Notebook).
//   2. The contextual (?) help popup shown in the
//      toolbar, which reuses the exact same content for
//      whichever page the user is currently on.
//
// Keying this by route means the popup can look up
// "what does the Help page say about this page" without
// duplicating any copy. If the wording ever changes here,
// both places update together.
//
// Only routes with a real counterpart section on the Help
// page belong in this map. Any route left out simply won't
// get a (?) button — see ContextHelpButton.tsx.
// ======================================================
import type { ReactNode } from "react";

export interface PageHelpEntry {
  // Matches the corresponding <section id="..."> on HelpPage,
  // used for anchor consistency, not for navigation.
  anchorId: string;
  icon: string;
  title: string;
  subtitle: string;
  body: ReactNode;
}

const congruenceBody: ReactNode = (
  <>
    <p>
      Congruence is the alignment between the work you're doing and the energy you
      actually have for it. Rather than showing you one big, undifferentiated task
      list, it groups and surfaces tasks based on your current mindset, so what you
      see always fits how you're feeling right now.
    </p>

    <div className="help-subsection">
      <h3>How it works</h3>
      <ol className="help-steps">
        <li>
          <span className="help-step-index">1</span>
          <span>Open Congruence and choose the mood that matches how you're showing up today.</span>
        </li>
        <li>
          <span className="help-step-index">2</span>
          <span>BetterEveryDay surfaces the tasks that suit that mindset, and the background theme shifts to match.</span>
        </li>
        <li>
          <span className="help-step-index">3</span>
          <span>Work from that filtered list until you're ready to switch moods. You can pick a new one any time.</span>
        </li>
      </ol>
    </div>

    <div className="help-subsection">
      <h3>The three moods</h3>
      <div className="help-mood-cards">
        <div className="help-mood-card help-mood-focus">
          <span className="help-mood-icon">🎯</span>
          <h4>Focused</h4>
          <p>For deep work and high-concentration tasks that need your full attention.</p>
        </div>
        <div className="help-mood-card help-mood-planning">
          <span className="help-mood-icon">🗂️</span>
          <h4>Planning</h4>
          <p>For organising, scheduling, and preparing future work before you dive in.</p>
        </div>
        <div className="help-mood-card help-mood-recharge">
          <span className="help-mood-icon">🌙</span>
          <h4>Recharge</h4>
          <p>For low-energy moments, breaks, or lighter tasks that don't need deep focus.</p>
        </div>
      </div>
    </div>

    <div className="help-callout help-callout-tip">
      <span className="help-callout-icon">💡</span>
      <div className="help-callout-body">
        <strong className="help-callout-title">Revisit your mood as your day changes</strong>
        <div className="help-callout-text">
          <p>
            Your energy isn't fixed from morning to night, so your task list shouldn't be
            either. Jumping back into Congruence to re-pick your mood whenever your focus
            shifts keeps you working on the right thing at the right time, instead of
            forcing deep work when you're running low on energy.
          </p>
        </div>
      </div>
    </div>
  </>
);

const journeyBody: ReactNode = (
  <>
    <p>
      A Journey is a dedicated space for a longer-running project or goal. Each Journey
      gets its own notebook, so the plan, the notes, and the history of everything you've
      worked on for that project live in one place instead of scattered across separate
      tasks and pages.
    </p>

    <div className="help-subsection">
      <h3>Starting a session</h3>
      <p>
        Work inside a Journey happens in timed <strong>sessions</strong>, and each session
        follows a clear path from start to finish:
      </p>
      <ol className="help-steps">
        <li>
          <span className="help-step-index">1</span>
          <span>
            From the Journey page, select <strong>+ New Journey</strong> (or an existing
            one), then choose or create a page for the work you're about to do.
          </span>
        </li>
        <li>
          <span className="help-step-index">2</span>
          <span>
            Click <strong>Plan Session</strong> and fill in the reason for the session,
            your planned duration in minutes, the mood you'll be working in, and a goal
            for what you want to accomplish.
          </span>
        </li>
        <li>
          <span className="help-step-index">3</span>
          <span>
            When you're ready to begin, click <strong>Start Session</strong>. This is the
            moment Journey records as the actual start time.
          </span>
        </li>
        <li>
          <span className="help-step-index">4</span>
          <span>
            When you're done, click <strong>End Session</strong>. Journey records the end
            time and calculates exactly how long the session actually took.
          </span>
        </li>
      </ol>
    </div>

    <div className="help-subsection">
      <h3>Planned time vs. actual time</h3>
      <p>
        Every session keeps both numbers side by side: the <strong>planned duration</strong>{" "}
        you set before starting, and the <strong>actual duration</strong> Journey measures
        from your real start and end times. Once a session is completed, its overview panel
        shows both figures together along with the full timeline (created, started, and
        ended timestamps), so it's easy to see at a glance whether a task ran short, long,
        or right on schedule.
      </p>
      <p>
        Zoom out to the Journey Overview and you'll also find running totals for the whole
        project: total sessions, completed sessions, total time logged, and how many days
        the Journey has been alive. There's also an optional Journey Plan where you can set
        a purpose and a target number of sessions per week to work towards.
      </p>
    </div>

    <div className="help-callout help-callout-tip">
      <span className="help-callout-icon">💡</span>
      <div className="help-callout-body">
        <strong className="help-callout-title">Use Journey to get better at estimating your own time</strong>
        <div className="help-callout-text">
          <p>
            The gap between planned and actual duration is the most useful number Journey gives
            you. The first few sessions on a new kind of task might run over or under, and
            that's expected. Keep logging sessions and comparing the two numbers, and your
            planning estimates will get sharper with every session. Make Journey a regular
            habit, not a one-off, and it'll pay off over time.
          </p>
        </div>
      </div>
    </div>

    <div className="help-callout help-callout-note">
      <span className="help-callout-icon">📌</span>
      <div className="help-callout-body">
        <strong className="help-callout-title">Sessions live on pages</strong>
        <div className="help-callout-text">
          <p>
            A session is always tied to a specific page inside the Journey's notebook, so you
            need a page selected before <strong>Plan Session</strong> becomes available.{" "}
            <strong>Edit Session</strong> lets you adjust the plan later, and the action
            buttons disable themselves automatically to match the session's current stage:
            Planning, Active, or Completed.
          </p>
        </div>
      </div>
    </div>
  </>
);

const notebookBody: ReactNode = (
  <>
    <p>
      The Notebook is where free-form writing happens. Notebooks contain pages, and each
      page is built out of individual <strong>blocks</strong>, small self-contained
      pieces of content that can be mixed and rearranged as you write.
    </p>

    <div className="help-subsection">
      <h3>Block types</h3>
      <div className="help-block-grid">
        <div className="help-block-card">
          <span className="help-block-icon">📝</span>
          <h4>Text</h4>
          <p>A plain paragraph of text. This is the default block you start typing into.</p>
        </div>
        <div className="help-block-card">
          <span className="help-block-icon">🔠</span>
          <h4>Heading</h4>
          <p>A larger, bold line for titling a section of the page.</p>
        </div>
        <div className="help-block-card">
          <span className="help-block-icon">•</span>
          <h4>List</h4>
          <p>A bulleted list. Press Enter within it to add another bullet on a new line.</p>
        </div>
        <div className="help-block-card">
          <span className="help-block-icon">━</span>
          <h4>Divider</h4>
          <p>A horizontal rule that visually separates two parts of a page.</p>
        </div>
        <div className="help-block-card">
          <span className="help-block-icon">✅</span>
          <h4>Task</h4>
          <p>An embedded, live task card. Edit or complete the task right from the page.</p>
        </div>
      </div>
    </div>

    <div className="help-subsection">
      <h3>Creating and converting blocks</h3>
      <p>
        Every block has a small <strong>+</strong> button beside it. Click it, or type{" "}
        <span className="help-kbd">/</span> at the start of a block, to open the block
        menu, then pick <strong>Heading</strong>, <strong>List</strong>,{" "}
        <strong>Divider</strong>, or <strong>Text</strong> to convert the current block on
        the fly. Keep typing after the slash to filter the menu down to the command you
        want.
      </p>
      <p>
        Task blocks work a little differently: use the <strong>+ Create New Task</strong>{" "}
        or <strong>+ Add Task Block</strong> buttons at the top of a notebook page to insert
        a live task card, rather than the slash menu.
      </p>
    </div>

    <div className="help-subsection">
      <h3>Shortcuts</h3>
      <div className="help-shortcut-list">
        <div className="help-shortcut-row">
          <span className="help-kbd">Shift</span>
          <span className="help-shortcut-plus">+</span>
          <span className="help-kbd">Enter</span>
          <span className="help-shortcut-desc">Create a new block right after this one.</span>
        </div>
        <div className="help-shortcut-row">
          <span className="help-kbd">Backspace</span>
          <span className="help-shortcut-desc">On an empty block, deletes that block.</span>
        </div>
        <div className="help-shortcut-row">
          <span className="help-kbd">/</span>
          <span className="help-shortcut-desc">Opens the block menu to convert or insert a block.</span>
        </div>
        <div className="help-shortcut-row">
          <span className="help-kbd">Click below content</span>
          <span className="help-shortcut-desc">Clicking anywhere in the empty space of a page adds a new block at the end.</span>
        </div>
      </div>
    </div>

    <div className="help-callout help-callout-warning">
      <span className="help-callout-icon">⚠️</span>
      <div className="help-callout-body">
        <strong className="help-callout-title">Dividers don't respond to Backspace</strong>
        <div className="help-callout-text">
          <p>
            A Divider has no text to delete, so Backspace won't remove it. Hover over a divider
            instead and use the small <strong>✕</strong> button that appears to delete it.
            You'll be asked to confirm before it's removed.
          </p>
        </div>
      </div>
    </div>
  </>
);

// ── Route → help section map ────────────────────────────────────────────────
// Keys are lowercased pathnames. Only pages with a genuine counterpart
// section on the Help page appear here.
export const pageHelpContent: Record<string, PageHelpEntry> = {
  "/congruence": {
    anchorId: "congruence",
    icon: "🧭",
    title: "Congruence",
    subtitle: "Match your work to your current mindset",
    body: congruenceBody,
  },
  "/journey": {
    anchorId: "journey",
    icon: "🚀",
    title: "Journey",
    subtitle: "Track a project from planning through to completion",
    body: journeyBody,
  },
  "/notebook": {
    anchorId: "notebook",
    icon: "📓",
    title: "Notebook",
    subtitle: "A block-based editor for notes, lists, and structure",
    body: notebookBody,
  },
};

// Looks up help content for a given pathname, case-insensitively, and
// ignoring any trailing slash so "/journey/" still matches "/journey".
export function getPageHelp(pathname: string): PageHelpEntry | undefined {
  const normalized = pathname.toLowerCase().replace(/\/+$/, "") || "/";
  return pageHelpContent[normalized];
}
