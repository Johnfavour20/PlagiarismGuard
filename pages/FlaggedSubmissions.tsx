
import React from 'react';
import DashboardLayout from '../components/layout/DashboardLayout';

const FlaggedSubmissions: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-900">Flagged Submissions</h1>
        <p className="mt-4 text-gray-600">A list of submissions with high similarity scores will be displayed here for review.</p>
        <p className="mt-2 text-gray-500">This page is under construction.</p>
      </div>
    </DashboardLayout>
  );
};

export default FlaggedSubmissions;
