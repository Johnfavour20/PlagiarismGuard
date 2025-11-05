
import React, { useMemo, useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout.tsx';
import { Submission } from '../types.ts';
import { ChartBarIcon, FlagIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';


const BarChart = ({ title, data }: { title: string, data: { label: string; value: number }[] }) => {
    const maxValue = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]); // Avoid division by zero
    const [rendered, setRendered] = useState(false);
    useEffect(() => {
        // Trigger animation on mount
        const timer = setTimeout(() => setRendered(true), 100);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="bg-white p-6 rounded-xl shadow-md">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            {data.length > 0 ? (
                 <div className="space-y-4">
                    {data.map(item => {
                        const percentage = maxValue > 0 ? (item.value / maxValue) * 100 : 0;
                        return (
                            <div key={item.label}>
                                <div className="flex justify-between items-center mb-1">
                                    <div className="text-sm font-medium text-gray-600 truncate pr-2">{item.label}</div>
                                    <div className="text-sm font-bold text-gray-800">{item.value}</div>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                                    <div 
                                        className="bg-primary-500 h-4 rounded-full transition-all duration-1000 ease-out" 
                                        style={{ width: rendered ? `${percentage}%` : '0%' }}
                                    ></div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : <p className="text-gray-500 text-sm">No data available.</p>}
        </div>
    );
};


const LecturerReports: React.FC = () => {
    const submissions = useMemo(() => JSON.parse(localStorage.getItem('submissions') || '[]') as Submission[], []);

    const reportStats = useMemo(() => {
        if (submissions.length === 0) {
            return { total: 0, flagged: 0, averageScore: 0 };
        }
        const total = submissions.length;
        const flagged = submissions.filter(s => s.status === 'flagged').length;
        const totalScore = submissions.reduce((sum, s) => sum + s.similarityScore, 0);
        const averageScore = total > 0 ? totalScore / total : 0;
        return { total, flagged, averageScore };
    }, [submissions]);

    const submissionsByCourse = useMemo(() => {
        const counts = submissions.reduce((acc, sub) => {
            const courseCode = sub.courseCode.toUpperCase() || 'N/A';
            acc[courseCode] = (acc[courseCode] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([label, value]) => ({ label, value })).sort((a,b) => b.value - a.value);
    }, [submissions]);

    const statCards = [
        { title: 'Total Submissions', value: reportStats.total.toLocaleString(), icon: <DocumentDuplicateIcon className="h-8 w-8 text-blue-600" /> },
        { title: 'Flagged Documents', value: reportStats.flagged.toLocaleString(), icon: <FlagIcon className="h-8 w-8 text-red-600" /> },
        { title: 'Avg. Similarity', value: `${reportStats.averageScore.toFixed(2)}%`, icon: <ChartBarIcon className="h-8 w-8 text-green-600" /> }
    ];

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Reports & Analytics</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                {statCards.map((card, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 rounded-lg bg-gray-100">{card.icon}</div>
                            <div className="ml-4">
                                <h3 className="text-gray-600 text-sm font-medium">{card.title}</h3>
                                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            <BarChart title="Submissions by Course Code" data={submissionsByCourse} />
        </DashboardLayout>
    );
};

export default LecturerReports;
