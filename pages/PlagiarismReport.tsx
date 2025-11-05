import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout.tsx';
import { Submission } from '../types.ts';
import { CheckCircleIcon, ExclamationTriangleIcon, DocumentTextIcon, CubeTransparentIcon } from '@heroicons/react/24/outline';

const PlagiarismReport: React.FC = () => {
  const { submissionId } = useParams<{ submissionId: string }>();
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (submissionId) {
      try {
        const allSubmissions = JSON.parse(localStorage.getItem('submissions') || '[]') as Submission[];
        const found = allSubmissions.find(s => s._id === submissionId);
        setSubmission(found || null);
      } catch(e) {
        console.error("Failed to load submission", e);
      } finally {
        setLoading(false);
      }
    }
  }, [submissionId]);

  const getStatusInfo = () => {
    if (!submission) return { color: 'gray', icon: null, text: '' };
    if (submission.status === 'flagged') {
      return { color: 'red', icon: <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />, text: 'High Similarity Detected' };
    }
    return { color: 'green', icon: <CheckCircleIcon className="h-8 w-8 text-green-600" />, text: 'Originality Verified' };
  };

  const statusInfo = getStatusInfo();

  if (loading) {
    return <DashboardLayout><div className="text-center p-8">Loading report...</div></DashboardLayout>;
  }

  if (!submission) {
    return (
      <DashboardLayout>
        <div className="text-center p-8 bg-white rounded-xl shadow-md">
            <h2 className="text-2xl font-bold text-gray-800">Report Not Found</h2>
            <p className="text-gray-600 mt-2">Could not find a submission with the ID: {submissionId}</p>
            <Link to="/student/dashboard" className="mt-6 inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition">
              Back to Dashboard
            </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{submission.title}</h1>
          <p className="text-gray-500">Submitted by {submission.authorName} on {new Date(submission.createdAt).toLocaleDateString()}</p>
        </div>

        {/* Summary */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className={`p-6 rounded-xl shadow-md bg-white border-l-4 border-${statusInfo.color}-500`}>
            <div className="flex items-center">
              {statusInfo.icon}
              <div className="ml-4">
                <p className="text-sm text-gray-500">Status</p>
                <p className="text-xl font-bold text-gray-800">{statusInfo.text}</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl shadow-md bg-white">
             <div className="flex items-center">
              <div className={`text-5xl font-bold ${submission.similarityScore > 25 ? 'text-red-500' : 'text-green-500'}`}>
                {submission.similarityScore.toFixed(2)}%
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Similarity Score</p>
                <p className="text-lg font-semibold text-gray-800">Overall Match</p>
              </div>
            </div>
          </div>
          <div className="p-6 rounded-xl shadow-md bg-white">
             <div className="flex items-center">
              <CubeTransparentIcon className="h-8 w-8 text-primary-600"/>
              <div className="ml-4">
                <p className="text-sm text-gray-500">Blockchain Record</p>
                <p className="text-lg font-bold text-gray-800 truncate" title={submission.merkleRoot}>
                  {submission.merkleRoot.substring(0, 20)}...
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Report Details */}
        <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Document Text</h2>
                <div className="prose max-w-none prose-sm rounded-lg border bg-gray-50 p-4 h-96 overflow-y-auto">
                    {submission.paragraphs.map((p, index) => (
                        <p key={index} className={p.isPlagiarized ? `bg-red-100 p-1 rounded` : ''} title={p.isPlagiarized ? `Matched from Document ID: ${p.sourceDocumentId}` : 'Original content'}>
                            {p.text}
                        </p>
                    ))}
                </div>
            </div>
            <div className="bg-white rounded-xl shadow-md p-6">
                 <h2 className="text-xl font-semibold text-gray-800 mb-4">Matched Sources</h2>
                 {submission.plagiarismSources.length > 0 ? (
                     <ul className="space-y-4">
                         {submission.plagiarismSources.map(source => (
                             <li key={source.documentId} className="border p-3 rounded-lg bg-gray-50">
                                 <div className="font-semibold text-primary-700 flex items-center">
                                     <DocumentTextIcon className="h-5 w-5 mr-2"/>
                                     {source.documentTitle}
                                 </div>
                                 <p className="text-sm text-gray-600">by {source.authorName}</p>
                                 <div className="mt-2 flex items-center justify-between">
                                    <span className="text-sm text-red-600 font-bold">{source.similarity.toFixed(2)}% Match</span>
                                    <Link to={`/report/${source.documentId}`} className="text-xs text-primary-600 hover:underline">View Source</Link>
                                 </div>
                             </li>
                         ))}
                     </ul>
                 ) : (
                     <div className="text-center text-gray-500 py-8">
                        <CheckCircleIcon className="h-12 w-12 text-green-400 mx-auto mb-2"/>
                        <p>No matching sources found.</p>
                     </div>
                 )}
            </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PlagiarismReport;