
import React from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';

const BlockchainVerification: React.FC = () => {
  const { txHash } = useParams<{ txHash?: string }>();

  return (
    <DashboardLayout>
      <div className="bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-900">Blockchain Verification</h1>
        {txHash ? (
          <p className="mt-4 text-gray-600">Verifying transaction hash: <span className="font-mono bg-gray-100 p-1 rounded">{txHash}</span></p>
        ) : (
          <p className="mt-4 text-gray-600">View and verify blockchain records for all submissions.</p>
        )}
        <p className="mt-2 text-gray-500">This page is under construction.</p>
      </div>
    </DashboardLayout>
  );
};

export default BlockchainVerification;
