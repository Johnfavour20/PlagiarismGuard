
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';

const PlagiarismReport: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();

  return (
    <DashboardLayout>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-900">Plagiarism Report</h1>
        <p className="mt-4 text-gray-600">Displaying report for submission ID: <span className="font-mono bg-gray-100 p-1 rounded">{submissionId}</span></p>
        <p className="mt-2 text-gray-500">This page is under construction. A detailed report with similarity analysis and blockchain verification details will be shown here.</p>
        <Link to="/upload" className="mt-6 inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
          Upload another document
        </Link>
      </div>
    </DashboardLayout>
  );
};

export default PlagiarismReport;
