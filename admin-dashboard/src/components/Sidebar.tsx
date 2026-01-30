import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Shield, FileText, Ban, LogOut } from 'lucide-react';
import { useAppDispatch } from "../app/hooks"; 
import { logout } from '../features/authSlice';
import { useEffect } from "react";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // UX Fix: Automatically close sidebar on mobile when a link is clicked
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname.includes(path);

  const navItemClass = (path: string) => 
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive(path)
        ? 'bg-linear-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30'
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-30 bg-white border-r border-slate-200 shadow-xl transition-transform duration-300 ease-in-out flex flex-col h-screen
        lg:static lg:shadow-none
        ${sidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full lg:translate-x-0 lg:w-20'}
      `}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-200 flex items-center justify-between min-h-[88px]">
        {sidebarOpen ? (
          <div className="flex items-center gap-3 animate-in fade-in duration-300">
            <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg shrink-0">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="overflow-hidden">
              <h1 className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent truncate">
                PhishGuard
              </h1>
              <p className="text-xs text-slate-500 whitespace-nowrap">Admin Dashboard</p>
            </div>
          </div>
        ) : (
          <div className="mx-auto bg-linear-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg">
             <Shield className="w-6 h-6 text-white" />
          </div>
        )}
        
        {/* Toggle Button (Desktop Only) */}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="hidden lg:block p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {sidebarOpen ? <Menu className="w-5 h-5 text-slate-600" /> : null}
        </button>

        {/* Close Button (Mobile Only) */}
        <button 
          onClick={() => setSidebarOpen(false)} 
          className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        <Link to="/reports" className={navItemClass('reports')}>
          <FileText className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span className="font-medium whitespace-nowrap animate-in fade-in">Reports</span>}
        </Link>
        <Link to="/blacklist" className={navItemClass('blacklist')}>
          <Ban className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span className="font-medium whitespace-nowrap animate-in fade-in">Blacklist</span>}
        </Link>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors overflow-hidden"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {sidebarOpen && <span className="font-medium whitespace-nowrap animate-in fade-in">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;