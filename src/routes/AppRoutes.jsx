import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminLayout from "../pages/admin/AdminLayout";
import AdminDashboard from "../pages/admin/AdminDashboard";
import YoutubeApi from "../pages/admin/YoutubeApi";
import AdminDetail from "../pages/admin/AdminDetail";
import Users from "../pages/admin/Users";
import Login from "../pages/public/Login";
import HomePage from "../pages/public/HomePage";
import RequireAuth from "../components/RequireAuth";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<Login />} />

      {/* Protected Admin Rotaları */}
      <Route element={<RequireAuth />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="youtube-api" element={<YoutubeApi />} />
          <Route path="file/:filename" element={<AdminDetail />} />
          <Route path="users" element={<Users />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
