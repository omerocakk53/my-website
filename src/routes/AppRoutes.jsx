import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/AdminLayout";
import AdminDashboard from "../pages/AdminDashboard";
import AdminRequest from "../pages/AdminRequest";
import AdminDetail from "../pages/AdminDetail";
import Login from "../pages/Login";
import RequireAuth from "../components/RequireAuth";
import BackgroundAnimation from "../components/background-animation";

// Ana Sayfa Bileşeni
const HomePage = () => (
  <div className="bg-bg flex flex-col items-center justify-center h-screen relative overflow-hidden">
    <BackgroundAnimation />
    <div className="relative z-10 flex flex-col items-center text-center space-y-4">
      <img src="/logo.png" alt="logo" className="w-12 h-12 mx-auto" />
      <h1 className="text-2xl text-text font-bold">
        Bu Site Arka Planda Veri Kazıyor...
      </h1>
      <p className="text-lg font-medium text-text">Ömer Ocak - Founder</p>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Rotaları */}
      <Route element={<RequireAuth />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="new-scrape" element={<AdminRequest />} />
          <Route path="file/:filename" element={<AdminDetail />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
