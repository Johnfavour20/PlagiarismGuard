
import React, { useState, useEffect, useMemo } from 'react';
import DashboardLayout from '../components/layout/DashboardLayout.tsx';
import { User } from '../types.ts';
import { MagnifyingGlassIcon, TrashIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const ManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchUsers = () => {
    try {
      const storedUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
      setUsers(storedUsers);
    } catch (e) {
      console.error("Failed to load users", e);
      toast.error("Failed to load users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  
  const deleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        try {
            let storedUsers = JSON.parse(localStorage.getItem('users') || '[]') as User[];
            // Prevent deleting the main admin account for demo purposes
            const userToDelete = storedUsers.find(u => u._id === userId);
            if (userToDelete?.email === 'admin@uniport.edu.ng') {
                toast.warn("Cannot delete the primary administrator account.");
                return;
            }
            const updatedUsers = storedUsers.filter(user => user._id !== userId);
            localStorage.setItem('users', JSON.stringify(updatedUsers));
            setUsers(updatedUsers);
            toast.success("User deleted successfully.");
        } catch (e) {
            console.error("Failed to delete user", e);
            toast.error("Failed to delete user.");
        }
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [users, searchTerm]);

  const getRoleBadge = (role: User['role']) => {
    const styles = {
      admin: 'bg-red-100 text-red-800',
      lecturer: 'bg-blue-100 text-blue-800',
      student: 'bg-green-100 text-green-800',
    };
    return styles[role] || 'bg-gray-100 text-gray-800';
  };

  return (
    <DashboardLayout>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Manage Users</h1>
      <div className="bg-white rounded-xl shadow-md">
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">All Registered Users</h2>
          <div className="relative">
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute top-1/2 left-3 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-500">Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-8 text-center text-gray-500">No users found.</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                             <span className="text-lg font-semibold text-primary-600">{user.name.charAt(0).toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.university}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(user.role)} capitalize`}>{user.role}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => deleteUser(user._id)} className="text-red-600 hover:text-red-800 flex items-center">
                        <TrashIcon className="h-4 w-4 mr-1"/> Delete
                      </button>
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

export default ManageUsers;
