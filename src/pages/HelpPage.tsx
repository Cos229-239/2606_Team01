// ======================================================
// HelpPage.tsx
// ------------------------------------------------------
// Help & documentation.
// A full walkthrough of BetterEveryDay's core systems:
// Congruence, Journey, and the Notebook editor, presented
// as scannable, professionally formatted documentation
// rather than a plain wall of text. Follows the same page
// layout / glass-panel conventions as SettingsPage.tsx /
// AppearancePage.tsx, extended with callouts, a quick-nav,
// and small reference cards.
// ======================================================
import type { ReactNode } from "react";
import { useSmoothScroll } from "../Data/useSmoothScroll";

// ── Benefits shown in the About section ────────────────────────────────────
const benefits: string[] = [
  "One app instead of many. Tasks, notes, session tracking, and a focus timer all live together, so you're not juggling separate tools for each part of your workflow.",
  "Mood-aware organisation. Tasks and workspaces are grouped by Focused, Planning, and Recharge, so you always see the work that matches your current headspace.",
  "Visual feedback that matches your state. The animated background shifts with your chosen mood, so the app has some atmosphere instead of a static interface.",
  "Long-term tracking with Journey. Sessions build into a history over time, so progress on longer goals doesn't get lost between sittings.",
  "Built to be customised. Appearance, notification sounds, and general behaviour can all be adjusted from Settings.",
];

// ── Quick-nav entries ───────────────────────────────────────────────────────
const tocEntries = [
  { id: "overview", icon: "✨", label: "Overview" },
  { id: "congruence", icon: "🧭", label: "Congruence" },
  { id: "journey", icon: "🚀", label: "Journey" },
  { id: "notebook", icon: "📓", label: "Notebook" },
  { id: "tips", icon: "💡", label: "Tips & Shortcuts" },
];

// ── Small reusable pieces ───────────────────────────────────────────────────

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="help-section-header">
      <span className="help-section-icon">{icon}</span>
      <div>
        <h2 className="help-section-title">{title}</h2>
        <p className="help-section-subtitle">{subtitle}</p>
      </div>
    </div>
  );
}

function Callout({
  kind,
  title,
  children,
}: {
  kind: "tip" | "warning" | "note";
  title: string;
  children: ReactNode;
}) {
  const icon = kind === "tip" ? "💡" : kind === "warning" ? "⚠️" : "📌";
  return (
    <div className={`help-callout help-callout-${kind}`}>
      <span className="help-callout-icon">{icon}</span>
      <div className="help-callout-body">
        <strong className="help-callout-title">{title}</strong>
        <div className="help-callout-text">{children}</div>
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────
export default function HelpPage() {
  const smoothScroll = useSmoothScroll();

  // Quick-nav links keep their normal href (so middle-click / open-in-new-tab
  // still works), but on a regular click we intercept and scroll manually so
  // we can control whether the motion is instant or animated based on the
  // "Smooth scrolling" setting in Settings > General.
  function handleTocClick(event: React.MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id);
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: smoothScroll ? "smooth" : "auto" });
  }

  return (
    <div className="help-page">
      <h1>Help</h1>
      <p className="help-page-intro">
        Everything you need to get comfortable with BetterEveryDay: how the app is organised,
        and how to use each of its core systems.
      </p>

      {/* ── Quick nav ──────────────────────────────────────────────────── */}
      <nav className="help-toc" aria-label="On this page">
        {tocEntries.map((entry) => (
          <a
            key={entry.id}
            href={`#${entry.id}`}
            className="help-toc-link"
            onClick={(event) => handleTocClick(event, entry.id)}
          >
            <span className="help-toc-icon">{entry.icon}</span>
            {entry.label}
          </a>
        ))}
      </nav>

      {/* ── Overview / About ───────────────────────────────────────────── */}
      <section id="overview" className="glass-panel help-about">
        <div className="help-about-header">
          <h2 className="help-about-title">BetterEveryDay</h2>
          <p className="help-about-tagline">A task builder that reacts to your mood.</p>
        </div>

        <div className="help-about-section">
          <h3>The Goal</h3>
          <p>
            BetterEveryDay started from a frustration with productivity apps that pile on
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
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CONGRUENCE
          ══════════════════════════════════════════════════════════════ */}
      <section id="congruence" className="glass-panel help-section">
        <SectionHeader
          icon="🧭"
          title="Congruence"
          subtitle="Match your work to your current mindset"
        />

        <div className="help-section-body">
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

          <Callout kind="tip" title="Revisit your mood as your day changes">
            <p>
              Your energy isn't fixed from morning to night, so your task list shouldn't be
              either. Jumping back into Congruence to re-pick your mood whenever your focus
              shifts keeps you working on the right thing at the right time, instead of
              forcing deep work when you're running low on energy.
            </p>
          </Callout>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          JOURNEY
          ══════════════════════════════════════════════════════════════ */}
      <section id="journey" className="glass-panel help-section">
        <SectionHeader
          icon="🚀"
          title="Journey"
          subtitle="Track a project from planning through to completion"
        />

        <div className="help-section-body">
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

          <Callout kind="tip" title="Use Journey to get better at estimating your own time">
            <p>
              The gap between planned and actual duration is the most useful number Journey gives
              you. The first few sessions on a new kind of task might run over or under, and
              that's expected. Keep logging sessions and comparing the two numbers, and your
              planning estimates will get sharper with every session. Make Journey a regular
              habit, not a one-off, and it'll pay off over time.
            </p>
          </Callout>

          <Callout kind="note" title="Sessions live on pages">
            <p>
              A session is always tied to a specific page inside the Journey's notebook, so you
              need a page selected before <strong>Plan Session</strong> becomes available.{" "}
              <strong>Edit Session</strong> lets you adjust the plan later, and the action
              buttons disable themselves automatically to match the session's current stage:
              Planning, Active, or Completed.
            </p>
          </Callout>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          NOTEBOOK
          ══════════════════════════════════════════════════════════════ */}
      <section id="notebook" className="glass-panel help-section">
        <SectionHeader
          icon="📓"
          title="Notebook"
          subtitle="A block-based editor for notes, lists, and structure"
        />

        <div className="help-section-body">
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

          <Callout kind="warning" title="Dividers don't respond to Backspace">
            <p>
              A Divider has no text to delete, so Backspace won't remove it. Hover over a divider
              instead and use the small <strong>✕</strong> button that appears to delete it.
              You'll be asked to confirm before it's removed.
            </p>
          </Callout>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          TIPS & BEST PRACTICES
          ══════════════════════════════════════════════════════════════ */}
      <section id="tips" className="glass-panel help-section">
        <SectionHeader
          icon="💡"
          title="Tips & Best Practices"
          subtitle="Small habits that make the app work harder for you"
        />

        <div className="help-section-body">
          <Callout kind="tip" title="Start every project as a Journey">
            <p>
              Even loosely-defined goals benefit from having their own notebook and session
              history. It costs nothing to create one, and you'll thank yourself later when you
              can look back at exactly how a project unfolded.
            </p>
          </Callout>

          <Callout kind="tip" title="Pick a mood before you pick a task">
            <p>
              Let Congruence filter the list for you first. Choosing from a shorter, mood-matched
              list is faster, and more honest about what you'll actually get done, than scanning
              every task you own.
            </p>
          </Callout>

          <Callout kind="note" title="Everything is local">
            <p>
              Tasks, notebooks, sessions, and settings are all stored on this device. Nothing is
              required to sync or sign in for the app's core features to work.
            </p>
          </Callout>
        </div>
      </section>
    </div>
  );
}
