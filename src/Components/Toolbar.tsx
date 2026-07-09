import { Link, useNavigate } from "react-router-dom";

export default function Toolbar() {
  const navigate = useNavigate();
  return (
    <div className="toolbar">
      
      {/* back button */}
      <button onClick={() => navigate(-1)}>Back</button>
      {/* Dashboard Button */}
      <Link to="/">
        <button>Dashboard</button>
      </Link>
      <button  onClick = {() => window.electron.openTimer()}>
        Timer
      </button>
      {/* Profile tab */}
      <Link to="/profile">
        <button>Profile</button>
      </Link>
    </div>

  );
}
