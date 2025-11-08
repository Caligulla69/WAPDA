
// ============================================
// FILE: src/App.jsx
// ============================================
import React, { useState } from 'react';
import Login from './components/login';
import { Route, Routes } from "react-router-dom";
import ShiftEngineerDashboard from './pages/SEDashboard';
import DepartmentDashboard from './pages/departmendDashboard';
import OEDepartmentDashboard from './pages/OEDashboard';
import ResidentEngineerDashboard from './pages/REDashboard';
import AdminDashboard from './pages/adminDashboard';

export default function App() {
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/adminDashboard" element={<AdminDashboard />} />
        <Route path="/shiftDashboard" element={<ShiftEngineerDashboard />} />
        <Route path="/depDashboard" element={<DepartmentDashboard />} />
        <Route path="/oeDashboard" element={<OEDepartmentDashboard />} />
        <Route path="/reDashboard" element={<ResidentEngineerDashboard />} />
   
      </Routes>
    </>
  );
}