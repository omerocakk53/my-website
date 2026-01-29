import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { LayoutDashboard, LogOut, Menu, Youtube } from "lucide-react";
import { Button } from "@/admin/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/admin/components/ui/sheet";

import { useAuth } from "../../context/AuthContext";
import { Users } from "lucide-react";

const SidebarContent = ({ isActive, user }) => (
  <div className="flex flex-col h-full bg-card">
    <div className="p-6 border-b border-border">
      <h1 className="text-2xl font-bold text-foreground tracking-tight">
        Admin Panel
      </h1>
      <p className="text-xs text-muted-foreground mt-1">Scraping Manager</p>
      {user && (
        <div className="mt-2 text-xs px-2 py-1 bg-primary/10 text-primary rounded inline-block font-semibold">
          {user.role === "superadmin" ? "Super Admin" : "Admin"}
        </div>
      )}
    </div>

    <nav className="flex-1 p-4 space-y-2">
      <Link to="/admin" className="block">
        <Button
          variant={isActive("/admin") ? "secondary" : "ghost"}
          className="w-full justify-start gap-3 h-11"
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </Button>
      </Link>

      <Link to="/admin/youtube-api" className="block">
        <Button
          variant={isActive("/admin/youtube-api") ? "secondary" : "ghost"}
          className="w-full justify-start gap-3 h-11"
        >
          <Youtube size={20} />
          <span>Youtube API</span>
        </Button>
      </Link>

      {user?.role === "superadmin" && (
        <Link to="/admin/users" className="block">
          <Button
            variant={isActive("/admin/users") ? "secondary" : "ghost"}
            className="w-full justify-start gap-3 h-11"
          >
            <Users size={20} />
            <span>Kullanıcılar</span>
          </Button>
        </Link>
      )}
    </nav>

    <div className="p-4 border-t border-border">
      <Link to="/" className="block">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-destructive hover:text-destructive hover:bg-destructive/10 h-11"
        >
          <LogOut size={20} />
          <span>Çıkış Yap</span>
        </Button>
      </Link>
    </div>
  </div>
);

const AdminLayout = () => {
  const { user } = useAuth();
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="flex h-screen bg-background text-foreground font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-card border-r border-border flex-col">
        <SidebarContent isActive={isActive} user={user} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-border bg-card flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu size={20} />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="p-0 border-r border-border w-64"
              >
                <SidebarContent isActive={isActive} user={user} />
              </SheetContent>
            </Sheet>
            <span className="font-bold text-lg">Admin Panel</span>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4 md:p-8 bg-background">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
