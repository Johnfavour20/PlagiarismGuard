
import React, { useMemo, useState, useEffect } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout.tsx';
import { User, Submission } from '../types.ts';
import { DocumentChartBarIcon, UserGroupIcon, BuildingLibraryIcon } from '@heroicons/react/24/outline';

// A simple component for bar charts
const BarChart = ({ title, data, colorClass = 'bg-primary-500' }: { title: string, data: { label: string; value: number }[], colorClass?: string }) => {
    const maxValue = useMemo(() => Math.max(...data.map(d => d.value), 1), [data]); // Avoid division by zero, use 1 as min
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
                                        className={`${colorClass} h-4 rounded-full transition-all duration-1000 ease-out`} 
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

const Analytics: React.FC = () => {
    const submissions = useMemo(() => JSON.parse(localStorage.getItem('submissions') || '[]') as Submission[], []);
    const users = useMemo(() => JSON.parse(localStorage.getItem('users') || '[]') as User[], []);

    const submissionsByUni = useMemo(() => {
        const counts = submissions.reduce((acc, sub) => {
            acc[sub.university] = (acc[sub.university] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([label, value]) => ({ label, value })).sort((a, b) => b.value - a.value);
    }, [submissions]);

    const usersByRole = useMemo(() => {
        const counts = users.reduce((acc, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        return Object.entries(counts).map(([label, value]) => ({ label: label.charAt(0).toUpperCase() + label.slice(1), value }));
    }, [users]);
    
    const submissionsByMonth = useMemo(() => {
        const counts = submissions.reduce((acc, sub) => {
            const month = new Date(sub.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' });
            acc[month] = (acc[month] || 0) + 1;
            return acc;
        }, {} as Record<string, number>);
        const sortedMonths = Object.entries(counts).sort((a,b) => new Date(a[0]).getTime() - new Date(b[0]).getTime());
        return sortedMonths.map(([label, value]) => ({ label, value }));
    }, [submissions]);

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Platform Analytics</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                 {/* Main Analytics Charts */}
                <div className="lg:col-span-2 xl:col-span-2 space-y-6">
                    <BarChart title="Submissions Over Time" data={submissionsByMonth} colorClass="bg-green-500" />
                    <BarChart title="Submissions by University" data={submissionsByUni} colorClass="bg-blue-500" />
                </div>
                {/* Side Stats */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">User Roles</h3>
                         {usersByRole.length > 0 ? (
                            <div className="space-y-2">
                                {usersByRole.map(item => (
                                    <div key={item.label} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg">
                                        <span className="text-sm font-medium text-gray-700">{item.label}s</span>
                                        <span className="text-lg font-bold text-primary-600">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                         ) : <p className="text-gray-500 text-sm">No user data.</p>}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Analytics;
