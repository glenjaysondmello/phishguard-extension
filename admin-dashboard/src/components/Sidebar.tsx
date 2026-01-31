import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Shield, FileText, Ban, LogOut, ChevronLeft } from "lucide-react";
import { useAppDispatch } from "../app/hooks";
import { logout } from "../features/authSlice";
import { useEffect } from "react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Close sidebar on mobile when navigating
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname.includes(path);

  const navItemClass = (path: string) =>
    `relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group ${
      isActive(path)
        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
        : "text-slate-600 hover:bg-slate-50 hover:text-blue-600"
    } ${!sidebarOpen && "lg:justify-center"}`; // Center icons when collapsed

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-30 bg-white border-r border-slate-200 shadow-xl transition-all duration-300 ease-in-out flex flex-col h-screen
        lg:static lg:shadow-none
        ${sidebarOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0 lg:w-20"}
      `}
    >
      {/* --- Sidebar Header --- */}
      <div className={`flex items-center min-h-[88px] border-b border-slate-200 transition-all duration-300 ${sidebarOpen ? "px-6 justify-between" : "px-0 justify-center"}`}>
        
        {/* Logo Section */}
        {sidebarOpen ? (
          <div className="flex items-center gap-3 animate-in fade-in duration-300">
            <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-2 rounded-lg shadow-md shrink-0">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-lg font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate leading-tight">
                PhishGuard
              </h1>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Admin Panel
              </p>
            </div>
          </div>
        ) : (
          /* Collapsed Mode: Just show the toggle button (Menu) centered */
          <button
            onClick={() => setSidebarOpen(true)}
            className="hidden lg:flex p-3 hover:bg-slate-100 rounded-xl transition-colors text-slate-600"
            title="Expand Sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}

        {/* Desktop Toggle Button */}
        {sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(false)}
            className="hidden lg:flex p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Mobile Close Button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-600"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* --- Navigation --- */}
      <nav className={`flex-1 p-4 space-y-2 ${sidebarOpen ? "overflow-y-auto" : "overflow-visible"}`}>
        <Link to="/reports" className={navItemClass("reports")}>
          <FileText className={`w-5 h-5 shrink-0 ${!sidebarOpen && "lg:w-6 lg:h-6"}`} />
          
          <span className={`font-medium whitespace-nowrap transition-all duration-300 ${!sidebarOpen ? "lg:hidden lg:opacity-0" : "opacity-100"}`}>
            Reports
          </span>
          
          {/* Tooltip for collapsed state */}
          {!sidebarOpen && (
            <div className="hidden lg:block absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
              Reports
            </div>
          )}
        </Link>

        <Link to="/blacklist" className={navItemClass("blacklist")}>
          <Ban className={`w-5 h-5 shrink-0 ${!sidebarOpen && "lg:w-6 lg:h-6"}`} />
          
          <span className={`font-medium whitespace-nowrap transition-all duration-300 ${!sidebarOpen ? "lg:hidden lg:opacity-0" : "opacity-100"}`}>
            Blacklist
          </span>

          {!sidebarOpen && (
             <div className="hidden lg:block absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity z-50 whitespace-nowrap pointer-events-none">
              Blacklist
            </div>
          )}
        </Link>
      </nav>

      {/* --- Footer --- */}
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors ${!sidebarOpen && "lg:justify-center"}`}
          title={!sidebarOpen ? "Logout" : ""}
        >
          <LogOut className={`w-5 h-5 shrink-0 ${!sidebarOpen && "lg:w-6 lg:h-6"}`} />
          {sidebarOpen && (
            <span className="font-medium whitespace-nowrap animate-in fade-in">
              Logout
            </span>
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;