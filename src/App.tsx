import { Routes, Route, Outlet } from "react-router-dom";
import FocusPage from "./pages/FocusPage";
import DashboardPage from "./pages/DashboardPage";
import TaskListPage from "./pages/TaskListPage";
import Sidebar from "./Components/Sidebar";
import CongruencePage from "./pages/CongruencePage";
import Toolbar from "./Components/Toolbar";
import PlanningPage from "./pages/PlanningPage";
import RechargePage from "./pages/RechargePage";
import TimerPage from "./pages/TimerPage";
import "./Css/App.css";

function MainLayout()
{
  return(
    <div className="app-shell">
      <Sidebar />

      <div className="main-content">
        <Toolbar />

        <div className="page-container">
          <Outlet/>
       
        </div>
      </div>
    </div>
  );
}


function App() {
  return (
 
          <Routes>

              {/* Main application */}
          <Route element={ <MainLayout />} >
            <Route path="/" element={<DashboardPage />} />
            <Route path="/task" element={<TaskListPage />} />
            <Route path="/focus" element={<FocusPage />} />
            <Route path="/planning" element={<PlanningPage />} />
            <Route path="/recharge" element={<RechargePage />} />
            <Route path="/congruence" element={<CongruencePage />} />
          </Route>

         
       <Route path="/timer" element= { <TimerPage />} />
       </Routes>
      
    
  );
}

export default App;
