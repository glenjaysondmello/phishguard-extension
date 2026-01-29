import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Shield, FileText, Ban, LogOut } from 'lucide-react';
import { useAppDispatch } from "../app/hooks"; 
import { logout } from '../features/authSlice';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isActive = (path: string) => location.pathname.includes(path);

  const navItemClass = (path: string) => 
    `w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
      isActive(path)
        ? 'bg-linear-to-r from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/30'
        : 'text-slate-700 hover:bg-slate-100'
    }`;

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <aside 
      className={`${sidebarOpen ? 'w-72' : 'w-20'} bg-white border-r border-slate-200 transition-all duration-300 ease-in-out shadow-xl flex flex-col z-20 h-screen`}
    >
      {/* Sidebar Header */}
      <div className="p-6 border-b border-slate-200 flex items-center justify-between">
        {sidebarOpen && (
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-blue-600 to-indigo-600 p-2.5 rounded-xl shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                PhishGuard
              </h1>
              <p className="text-xs text-slate-500">Admin Dashboard</p>
            </div>
          </div>
        )}
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)} 
          className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
        >
          {sidebarOpen ? <X className="w-5 h-5 text-slate-600" /> : <Menu className="w-5 h-5 text-slate-600" />}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-2">
        <Link to="/reports" className={navItemClass('reports')}>
          <FileText className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium">Reports</span>}
        </Link>
        <Link to="/blacklist" className={navItemClass('blacklist')}>
          <Ban className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium">Blacklist</span>}
        </Link>
      </nav>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-200">
        <button 
          onClick={handleLogout} 
          className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {sidebarOpen && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;