
import React, { useState, ReactNode } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.tsx';
import {
  ShieldCheckIcon, HomeIcon, DocumentTextIcon, FlagIcon, UserGroupIcon, ChartBarIcon,
  CogIcon, ArrowRightOnRectangleIcon, Bars3Icon, XMarkIcon, CubeTransparentIcon, BellIcon
} from '@heroicons/react/24/outline';

const DashboardLayout: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getNavigationItems = () => {
    const baseItems = [
      { name: 'Dashboard', href: `/${user?.role}/dashboard`, icon: <HomeIcon className="h-5 w-5" /> },
      { name: 'Upload Document', href: '/upload', icon: <DocumentTextIcon className="h-5 w-5" /> },
    ];

    if (user?.role === 'admin') {
      return [
        ...baseItems,
        { name: 'Flagged Submissions', href: '/admin/flagged', icon: <FlagIcon className="h-5 w-5" /> },
        { name: 'Manage Users', href: '/admin/users', icon: <UserGroupIcon className="h-5 w-5" /> },
        { name: 'Analytics', href: '/admin/analytics', icon: <ChartBarIcon className="h-5 w-5" /> },
        { name: 'Blockchain', href: '/blockchain/verify', icon: <CubeTransparentIcon className="h-5 w-5" /> },
      ];
    } else if (user?.role === 'lecturer') {
      return [
        ...baseItems,
        { name: 'All Submissions', href: '/lecturer/submissions', icon: <DocumentTextIcon className="h-5 w-5" /> },
        { name: 'Reports', href: '/lecturer/reports', icon: <ChartBarIcon className="h-5 w-5" /> },
      ];
    } else { // Student
      return [
        ...baseItems,
        { name: 'My Documents', href: '/student/documents', icon: <DocumentTextIcon className="h-5 w-5" /> },
      ];
    }
  };

  const navigationItems = getNavigationItems();
  const isActive = (href: string) => location.pathname === href;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {sidebarOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 z-40 lg:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <Link to="/" className="flex items-center">
            <ShieldCheckIcon className="h-8 w-8 text-primary-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">PlagiarismGuard</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-gray-500 hover:text-gray-700">
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-xl font-semibold text-primary-600">{user?.name?.charAt(0).toUpperCase()}</span>
              </div>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
          </div>
        </div>

        <nav className="px-4 py-6 space-y-1">
          {navigationItems.map((item) => (
            <Link key={item.name} to={item.href} className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition ${ isActive(item.href) ? 'bg-primary-50 text-primary-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 space-y-2">
          <Link to="/settings" className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition">
            <CogIcon className="h-5 w-5" />
            <span className="ml-3">Settings</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center px-4 py-3 text-sm font-medium text-red-700 hover:bg-red-50 rounded-lg transition">
            <ArrowRightOnRectangleIcon className="h-5 w-5" />
            <span className="ml-3">Logout</span>
          </button>
        </div>
      </div>

      <div className="lg:pl-64">
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-700">
              <Bars3Icon className="h-6 w-6" />
            </button>
            <div className="flex-1"></div>
            <div className="flex items-center space-x-4">
              <button className="relative p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 transition">
                <BellIcon className="h-6 w-6" />
                <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:block text-sm">
                <p className="text-gray-500">{user?.university}</p>
              </div>
            </div>
          </div>
        </div>
        <main className="p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
};

export default DashboardLayout;