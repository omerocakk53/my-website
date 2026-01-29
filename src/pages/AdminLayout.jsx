import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, PlusCircle, LogOut } from "lucide-react";

const AdminLayout = () => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-900 text-white font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 border-r border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-xs text-gray-400 mt-1">Scraping Manager</p>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              isActive("/admin")
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
          </Link>

          <Link
            to="/admin/new-scrape"
            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
              isActive("/admin/new-scrape")
                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50"
                : "text-gray-400 hover:bg-gray-700 hover:text-white"
            }`}
          >
            <PlusCircle size={20} />
            <span>Yeni Tarama</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-gray-700">
          <Link
            to="/"
            className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-gray-700/50 rounded-lg transition-all"
          >
            <LogOut size={20} />
            <span>Çıkış Yap</span>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-gray-900 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;
