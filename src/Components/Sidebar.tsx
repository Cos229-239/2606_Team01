import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <Link to="/" className="sidebar-logo-link">
      <div className="sidebar-logo">BetterEveryDay</div>
      </Link>
      <nav className="sidebar-nav">
        <Link to="/"><button className="sidebar-btn">Dashboard</button></Link>
        <Link to="/task"><button className="sidebar-btn">Task List</button></Link>
        <Link to="/congruence"><button className="sidebar-btn">Congruence</button></Link>
        <Link to="/Notebook"><button className="sidebar-btn">Notebook</button></Link>
        <Link to="/Journey"><button className="sidebar-btn">Journey</button></Link>
        

      </nav>
      <Link to="/help">
        <button className="sidebar-btn">? Help</button>
      </Link>
      <Link to="/settings">
        <button className="sidebar-btn">⚙ Settings</button>
      </Link>
    </div>
  );
}
