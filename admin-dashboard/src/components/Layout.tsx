import { useState } from 'react';
import { Outlet } from "react-router-dom";
import Sidebar from './Sidebar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 font-sans">
      {/* Sidebar Component */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto flex flex-col">
        {/* The Outlet renders ReportsPage or BlacklistPage*/}
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;