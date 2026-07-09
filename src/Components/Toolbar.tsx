import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getProfile } from "../Data/profileStorage";

// ── Default person icon shown when no profile photo has been set ─────────
function DefaultAvatarIcon() {
  return (
    <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="rgba(200,220,255,0.6)" strokeWidth="1.6" />
      <path
        d="M4 20c0-3.6 3.6-6 8-6s8 2.4 8 6"
        stroke="rgba(200,220,255,0.6)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

// ── Profile button: circular avatar (photo or default icon), links to /profile ─
function ProfileButton() {
  const [photo, setPhoto] = useState("");

  useEffect(() => {
    let cancelled = false;

    function refresh() {
      getProfile().then((profile) => {
        if (!cancelled) setPhoto(profile.photo);
      });
    }

    refresh();
    window.addEventListener("profile-update", refresh);
    return () => {
      cancelled = true;
      window.removeEventListener("profile-update", refresh);
    };
  }, []);

  return (
    <Link to="/profile" aria-label="Profile" title="Profile">
      <button
        className="toolbar-profile-btn"
        style={{
          width: "34px",
          height: "34px",
          borderRadius: "50%",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {photo ? (
          <img
            src={photo}
            alt="Profile"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <DefaultAvatarIcon />
        )}
      </button>
    </Link>
  );
}

export default function Toolbar() {
  const navigate = useNavigate();
  return (
    <div className="toolbar">

      {/* Profile button */}
      <ProfileButton />

      {/* back button */}
      <button onClick={() => navigate(-1)}>Back</button>
      {/* Dashboard Button */}
      <Link to="/">
        <button>Dashboard</button>
      </Link>
      <button  onClick = {() => window.electron.openTimer()}>
        Timer
      </button>
    </div>

  );
}
