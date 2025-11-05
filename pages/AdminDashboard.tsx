import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.tsx';
import {
  DocumentTextIcon, CheckCircleIcon, ExclamationTriangleIcon, UserGroupIcon, ChartBarIcon,
  ArrowUpIcon, ArrowDownIcon, CubeTransparentIcon, FlagIcon
} from '@heroicons/react/24/outline';
import DashboardLayout from '../components/layout/DashboardLayout.tsx';
import { Submission, User } from '../types.ts';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDocuments: 0, verifiedDocuments: 0, flaggedDocuments: 0,
    totalUsers: 0, blockchainRecords: 0,
  });
  const [recentSubmissions, setRecentSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = () => {
      setLoading(true);
      try {
        const users = JSON.parse(localStorage.getItem('users') || '[]') as User[];
        const submissions = JSON.parse(localStorage.getItem('submissions') || '[]') as Submission[];

        setStats({
          totalDocuments: submissions.length,
          verifiedDocuments: submissions.filter(s => s.status === 'verified').length,
          flaggedDocuments: submissions.filter(s => s.status === 'flagged').length,
          totalUsers: users.length,
          blockchainRecords: submissions.length,
        });

        const sortedSubmissions = [...submissions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentSubmissions(sortedSubmissions.slice(0, 5));

      } catch (error) {
        console.error('Error fetching dashboard data from localStorage:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);
  
  const statCards = [
    { title: 'Total Documents', value: stats.totalDocuments, icon: <DocumentTextIcon className="h-8 w-8 text-blue-600" />, change: 12.5, color: 'blue' },
    { title: 'Verified Documents', value: stats.verifiedDocuments, icon: <CheckCircleIcon className="h-8 w-8 text-green-600" />, change: 8.2, color: 'green' },
    { title: 'Flagged Submissions', value: stats.flaggedDocuments, icon: <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />, change: -2.4, color: 'red' },
    { title: 'Active Users', value: stats.totalUsers, icon: <UserGroupIcon className="h-8 w-8 text-purple-600" />, change: 15.3, color: 'purple' }
  ];

  const getStatusBadge = (status: Submission['status']) => ({
    verified: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    flagged: 'bg-red-100 text-red-800'
  }[status] || 'bg-gray-100 text-gray-800');

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
            <p className="mt-1 text-sm text-gray-600">Here's what's happening on your platform today.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg bg-${card.color}-100`}>{card.icon}</div>
                <div className={`flex items-center text-sm font-medium ${card.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {card.change >= 0 ? <ArrowUpIcon className="h-4 w-4 mr-1" /> : <ArrowDownIcon className="h-4 w-4 mr-1" />}
                  <span>{card.change.toFixed(1)}%</span>
                </div>
              </div>
              <h3 className="text-gray-600 text-sm font-medium mb-1">{card.title}</h3>
              <p className="text-3xl font-bold text-gray-900">{card.value.toLocaleString()}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Recent Submissions</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Similarity</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentSubmissions.length === 0 ? (
                    <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">No recent submissions</td></tr>
                  ) : (
                    recentSubmissions.map((sub) => (
                      <tr key={sub._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm font-medium text-gray-900 truncate max-w-xs">{sub.title}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-gray-900">{sub.authorName}</div></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sub.similarityScore.toFixed(2)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(sub.status)}`}>{sub.status}</span></td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                           <Link to={`/report/${sub._id}`} className="text-primary-600 hover:text-primary-800">View</Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 rounded-lg bg-primary-100"><CubeTransparentIcon className="h-6 w-6 text-primary-600" /></div>
                <h3 className="ml-3 text-lg font-semibold text-gray-900">Blockchain Status</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-sm text-gray-600">Total Records</span><span className="text-sm font-semibold text-gray-900">{stats.blockchainRecords.toLocaleString()}</span></div>
                <div className="flex justify-between"><span className="text-sm text-gray-600">Network Status</span><span className="text-sm font-semibold text-green-600">Active (Simulated)</span></div>
              </div>
              <Link to="/blockchain/verify" className="mt-4 block w-full text-center bg-primary-50 text-primary-700 px-4 py-2 rounded-lg hover:bg-primary-100 transition text-sm font-medium">View Records</Link>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link to="/admin/flagged" className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition group">
                  <div className="flex items-center"><FlagIcon className="h-5 w-5 text-red-600 mr-3" /><span className="text-sm font-medium text-gray-700 group-hover:text-gray-900">Review Flagged</span></div>
                  <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded-full">{stats.flaggedDocuments}</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;