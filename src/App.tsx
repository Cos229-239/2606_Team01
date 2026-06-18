import { Routes, Route } from "react-router-dom";
import FocusPage from "./pages/FocusPage";
import DashboardPage from "./pages/DashboardPage";
import TaskListPage from "./pages/TaskListPage";
import Sidebar from "./Components/Sidebar";
import CongruencePage from "./pages/CongruencePage";
import Toolbar from "./Components/Toolbar";
import PlanningPage from "./pages/PlanningPage";
import RechargePage from "./pages/RechargePage";
import SettingsPage from "./pages/SettingsPage";
import AppearancePage from "./pages/AppearancePage";
import "./Css/App.css";

function App() {
  return (
    <div className="app-shell">
      <Sidebar />
      <div className="main-content">
        <Toolbar />
        <div className="page-container">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/task" element={<TaskListPage />} />
            <Route path="/focus" element={<FocusPage />} />
            <Route path="/planning" element={<PlanningPage />} />
            <Route path="/recharge" element={<RechargePage />} />
            <Route path="/congruence" element={<CongruencePage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/settings/appearance" element={<AppearancePage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
