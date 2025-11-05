import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout.tsx';
import { Submission } from '../types.ts';
import { CubeTransparentIcon } from '@heroicons/react/24/outline';

const BlockchainVerification: React.FC = () => {
  const { txHash } = useParams<{ txHash?: string }>();
  const [records, setRecords] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const allSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]') as Submission[];
      const sorted = allSubmissions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      if (txHash) {
          setRecords(sorted.filter(s => s.merkleRoot === txHash));
      } else {
          setRecords(sorted);
      }
    } catch(e) {
      console.error("Failed to load blockchain records", e);
    } finally {
      setLoading(false);
    }
  }, [txHash]);

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Blockchain Records (Simulated)</h1>
      </div>
       <div className="bg-white rounded-xl shadow-md">
        <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
                {txHash ? `Details for Record: ${txHash.substring(0,12)}...` : 'All Verified Submissions'}
            </h2>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
             <div className="p-8 text-center text-gray-500">Loading records...</div>
          ) : records.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
                No blockchain records found.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Transaction Hash (Merkle Root)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Author</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {records.map((rec) => (
                  <tr key={rec._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-primary-600">
                        <Link to={`/report/${rec._id}`} title="View Details">{rec.merkleRoot.substring(0,24)}...</Link>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{rec.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{rec.authorName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(rec.createdAt).toLocaleString()}</td>
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

export default BlockchainVerification;