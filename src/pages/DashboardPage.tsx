
import { Outlet } from "react-router-dom";
import FocusTabs from "../Components/Dashboard/FocusTabs";

export default function DashboardPage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <hr />
     <FocusTabs />

      <div className="dashboard-grid">
        <Outlet />
      </div>

      <hr />
    </div>
  );
}