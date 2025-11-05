
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext.tsx';

import LandingPage from './pages/LandingPage.tsx';
import LoginPage from './pages/LoginPage.tsx';
import RegisterPage from './pages/RegisterPage.tsx';
import AdminDashboard from './pages/AdminDashboard.tsx';
import LecturerDashboard from './pages/LecturerDashboard.tsx';
import StudentDashboard from './pages/StudentDashboard.tsx';
import UploadDocument from './pages/UploadDocument.tsx';
import PlagiarismReport from './pages/PlagiarismReport.tsx';
import FlaggedSubmissions from './pages/FlaggedSubmissions.tsx';
import BlockchainVerification from './pages/BlockchainVerification.tsx';
import NotFound from './pages/NotFound.tsx';
import PrivateRoute from './components/common/PrivateRoute.tsx';
import Settings from './pages/Settings.tsx';
import ManageUsers from './pages/ManageUsers.tsx';
import Analytics from './pages/Analytics.tsx';
import LecturerReports from './pages/LecturerReports.tsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App min-h-screen bg-gray-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Protected Routes - Admin */}
            <Route path="/admin/dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
            <Route path="/admin/flagged" element={<PrivateRoute role="admin"><FlaggedSubmissions /></PrivateRoute>} />
            <Route path="/admin/users" element={<PrivateRoute role="admin"><ManageUsers /></PrivateRoute>} />
            <Route path="/admin/analytics" element={<PrivateRoute role="admin"><Analytics /></PrivateRoute>} />

            {/* Protected Routes - Lecturer */}
            <Route path="/lecturer/dashboard" element={<PrivateRoute role="lecturer"><LecturerDashboard /></PrivateRoute>} />
            <Route path="/lecturer/submissions" element={<PrivateRoute role="lecturer"><LecturerDashboard /></PrivateRoute>} />
            <Route path="/lecturer/reports" element={<PrivateRoute role="lecturer"><LecturerReports /></PrivateRoute>} />
           
            {/* Protected Routes - Student */}
            <Route path="/student/dashboard" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />
            <Route path="/student/documents" element={<PrivateRoute role="student"><StudentDashboard /></PrivateRoute>} />


            {/* Shared Protected Routes */}
            <Route path="/upload" element={<PrivateRoute><UploadDocument /></PrivateRoute>} />
            <Route path="/report/:submissionId" element={<PrivateRoute><PlagiarismReport /></PrivateRoute>} />
            <Route path="/blockchain/verify/:txHash?" element={<PrivateRoute><BlockchainVerification /></PrivateRoute>} />
            <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />

            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;