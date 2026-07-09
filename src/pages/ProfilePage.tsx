import { useRef, useState } from "react";
import { getProfile, saveProfile } from "../Data/profileStorage";
import type { ProfileData } from "../Data/profileStorage";

// ── Default avatar icon shown when no photo has been set ──────────────────
function DefaultAvatarIcon() {
  return (
    <svg width="58%" height="58%" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="rgba(200,220,255,0.45)" strokeWidth="1.6" />
      <path
        d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6"
        stroke="rgba(200,220,255,0.45)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Avatar (photo or default icon), with edit-mode change/remove controls ─
function Avatar({
  photo,
  editing,
  onChangePhoto,
  onRemovePhoto,
}: {
  photo: string;
  editing: boolean;
  onChangePhoto: (dataUrl: string) => void;
  onRemovePhoto: () => void;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onChangePhoto(reader.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "14px" }}>
      <div
        style={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(255,255,255,0.05)",
          border: "1px solid var(--border-panel)",
          boxShadow: "0 0 0 5px rgba(120,160,255,0.08), var(--shadow-panel)",
          flexShrink: 0,
        }}
      >
        {photo ? (
          <img src={photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <DefaultAvatarIcon />
        )}
      </div>

      {editing && (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px", width: "100%" }}>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelected}
            style={{ display: "none" }}
          />
          <button type="button" onClick={() => fileInputRef.current?.click()}>
            ✎ Change Photo
          </button>
          {photo && (
            <button type="button" onClick={onRemovePhoto}>
              Remove Photo
            </button>
          )}
        </div>
      )}
    </div>
  );
}

// ── Editable chip list for secondary titles ────────────────────────────────
function TitleChips({
  titles,
  editing,
  onAdd,
  onRemove,
}: {
  titles: string[];
  editing: boolean;
  onAdd: (title: string) => void;
  onRemove: (index: number) => void;
}) {
  const [draft, setDraft] = useState("");

  function submit() {
    const trimmed = draft.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setDraft("");
  }

  return (
    <div style={{ marginTop: "10px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
        {titles.map((title, i) => (
          <span
            key={`${title}-${i}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "5px 10px",
              fontSize: "11px",
              letterSpacing: "0.04em",
              color: "rgba(210,228,255,0.85)",
              background: "rgba(120,160,255,0.14)",
              border: "1px solid rgba(160,190,255,0.30)",
              borderRadius: "20px",
            }}
          >
            {title}
            {editing && (
              <span
                onClick={() => onRemove(i)}
                style={{ cursor: "pointer", color: "rgba(255,255,255,0.5)", fontSize: "12px", lineHeight: 1 }}
              >
                ✕
              </span>
            )}
          </span>
        ))}
        {!editing && titles.length === 0 && (
          <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)" }}>No additional titles</span>
        )}
      </div>

      {editing && (
        <div style={{ display: "flex", gap: "8px", marginTop: "10px" }}>
          <input
            placeholder="Add a title, badge, or role…"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              }
            }}
          />
          <button type="button" onClick={submit} style={{ flexShrink: 0 }}>
            + Add
          </button>
        </div>
      )}
    </div>
  );
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData>(() => getProfile());
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<ProfileData>(profile);

  function startEditing() {
    setDraft(profile);
    setEditing(true);
  }

  function cancelEditing() {
    setDraft(profile);
    setEditing(false);
  }

  function handleSave() {
    saveProfile(draft);
    setProfile(draft);
    setEditing(false);
  }

  const active = editing ? draft : profile;

  return (
    <div>
      <div className="task-list-header">
        <h1>Profile</h1>
        {!editing ? (
          <button onClick={startEditing}>✎ Edit Profile</button>
        ) : (
          <div style={{ display: "flex", gap: "8px" }}>
            <button className="btn-primary" onClick={handleSave}>Save Changes</button>
            <button onClick={cancelEditing}>Cancel</button>
          </div>
        )}
      </div>

      <div
        className="glass-panel"
        style={{
          padding: "28px",
          marginTop: "24px",
          maxWidth: "700px",
          display: "flex",
          gap: "32px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <Avatar
          photo={active.photo}
          editing={editing}
          onChangePhoto={(dataUrl) => setDraft((d) => ({ ...d, photo: dataUrl }))}
          onRemovePhoto={() => setDraft((d) => ({ ...d, photo: "" }))}
        />

        <div style={{ flex: 1, minWidth: "260px" }}>
          {/* Name */}
          {editing ? (
            <div className="form-field" style={{ marginBottom: "12px" }}>
              <label>Name</label>
              <input
                value={draft.name}
                onChange={(e) => setDraft((d) => ({ ...d, name: e.target.value }))}
                placeholder="Your name"
                style={{ fontSize: "18px" }}
              />
            </div>
          ) : (
            <h1 style={{ marginBottom: "4px" }}>
              {profile.name || <span style={{ color: "rgba(255,255,255,0.3)" }}>Unnamed</span>}
            </h1>
          )}

          {/* Primary title */}
          {editing ? (
            <div className="form-field" style={{ marginBottom: "4px" }}>
              <label>Title</label>
              <input
                value={draft.primaryTitle}
                onChange={(e) => setDraft((d) => ({ ...d, primaryTitle: e.target.value }))}
                placeholder="e.g. Team Lead"
              />
            </div>
          ) : (
            profile.primaryTitle && (
              <p
                style={{
                  color: "rgba(160,190,255,0.85)",
                  fontSize: "13px",
                  fontWeight: 600,
                  letterSpacing: "0.04em",
                  marginBottom: "6px",
                }}
              >
                {profile.primaryTitle}
              </p>
            )
          )}

          {/* Secondary titles */}
          <TitleChips
            titles={active.titles}
            editing={editing}
            onAdd={(title) => setDraft((d) => ({ ...d, titles: [...d.titles, title] }))}
            onRemove={(i) => setDraft((d) => ({ ...d, titles: d.titles.filter((_, idx) => idx !== i) }))}
          />

          <hr style={{ margin: "18px 0" }} />

          {/* Bio */}
          <label style={{ display: "block", marginBottom: "6px" }}>Bio</label>
          {editing ? (
            <textarea
              rows={5}
              value={draft.bio}
              onChange={(e) => setDraft((d) => ({ ...d, bio: e.target.value }))}
              placeholder="Write a little about yourself…"
            />
          ) : (
            <p style={{ lineHeight: 1.7, color: "rgba(255,255,255,0.65)", fontStyle: profile.bio ? "italic" : "normal" }}>
              {profile.bio
                ? `"${profile.bio}"`
                : <span style={{ color: "rgba(255,255,255,0.3)", fontStyle: "normal" }}>No bio yet.</span>}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
