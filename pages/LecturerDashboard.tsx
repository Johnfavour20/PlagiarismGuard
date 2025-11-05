import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout.tsx';
import { Submission } from '../types.ts';
import { DocumentTextIcon } from '@heroicons/react/24/outline';

const LecturerDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const allSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]') as Submission[];
      const sorted = allSubmissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setSubmissions(sorted);
    } catch (e) {
      console.error("Failed to load submissions", e);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const getStatusBadge = (status: Submission['status']) => ({
    verified: 'bg-green-100 text-green-800',
    pending: 'bg-yellow-100 text-yellow-800',
    flagged: 'bg-red-100 text-red-800'
  }[status] || 'bg-gray-100 text-gray-800');

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Lecturer Dashboard</h1>
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">All Student Submissions</h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-8 text-center text-gray-500">Loading submissions...</div>
          ) : submissions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No documents have been submitted yet.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Similarity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Report</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {submissions.map((sub) => (
                  <tr key={sub._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{sub.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{sub.authorName}</td>
                    <td className={`px-6 py-4 whitespace-nowrap font-semibold ${sub.similarityScore > 25 ? 'text-red-600' : 'text-green-600'}`}>{sub.similarityScore.toFixed(2)}%</td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(sub.status)}`}>{sub.status}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(sub.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link to={`/report/${sub._id}`} className="text-primary-600 hover:text-primary-800">View Report</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LecturerDashboard;