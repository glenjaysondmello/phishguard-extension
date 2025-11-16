import { NavLink } from 'react-router-dom';
import { useAppDispatch } from '../app/hooks';
import { logout } from '../features/authSlice';

const ReportIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const BlacklistIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>;
const LogoutIcon = () => <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;

const Sidebar = () => {
  const dispatch = useAppDispatch();
  
  const handleLogout = () => {
    dispatch(logout());
  };

  const linkClass = "flex items-center px-4 py-2 mt-2 text-gray-600 transition-colors duration-200 transform rounded-md hover:bg-gray-200 hover:text-gray-700";
  const activeLinkClass = "flex items-center px-4 py-2 mt-2 text-gray-700 bg-gray-200 rounded-md";

  return (
    <div className="flex flex-col w-64 h-screen px-4 py-8 bg-white border-r">
      <h2 className="text-3xl font-bold text-center text-gray-800">
        PhishGuard
      </h2>
      <div className="flex flex-col justify-between flex-1 mt-6">
        <nav>
          <NavLink
            to="/reports"
            className={({ isActive }) => isActive ? activeLinkClass : linkClass}
          >
            <ReportIcon />
            <span className="mx-4 font-medium">Reports</span>
          </NavLink>
          <NavLink
            to="/blacklist"
            className={({ isActive }) => isActive ? activeLinkClass : linkClass}
          >
            <BlacklistIcon />
            <span className="mx-4 font-medium">Blacklist</span>
          </NavLink>
        </nav>
        <button
          onClick={handleLogout}
          className={`${linkClass} text-red-600 hover:bg-red-100 hover:text-red-700`}
        >
          <LogoutIcon />
          <span className="mx-4 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;