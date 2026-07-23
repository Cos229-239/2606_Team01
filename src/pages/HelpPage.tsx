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
import { pageHelpContent } from "../Data/pageHelpContent";

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
          {pageHelpContent["/congruence"].body}
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
          {pageHelpContent["/journey"].body}
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
          {pageHelpContent["/notebook"].body}
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
