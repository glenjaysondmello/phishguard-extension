import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Menu } from "lucide-react";
import logo from "../assets/logo.png";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-50 font-sans overflow-hidden">
      {/* Mobile Overlay: visible only when sidebar is open on mobile */}
      <div
        className={`fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-20 lg:hidden transition-opacity duration-300 ${
          sidebarOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar Component */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto flex flex-col relative w-full">
        {/* Mobile Header: Visible only on small screens when sidebar is CLOSED */}
        {!sidebarOpen && (
          <div className="lg:hidden p-4 bg-white border-b border-slate-200 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full">
                <img
                  src={logo}
                  alt="PhishGuard Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-indigo-600">
                PhishGuard
              </h1>
            </div>
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-600"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        )}

        {/* Content Wrapper */}
        <div className="flex-1 w-full max-w-[1920px] mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
