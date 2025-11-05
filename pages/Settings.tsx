
import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import { UserIcon, BuildingLibraryIcon, LockClosedIcon, EnvelopeIcon } from '@heroicons/react/24/outline';
import { toast } from 'react-toastify';

const Settings: React.FC = () => {
    const { user, updateProfile, changePassword } = useAuth();

    const profileValidationSchema = Yup.object({
        name: Yup.string().min(3, 'Name must be at least 3 characters').required('Full name is required'),
        university: Yup.string().required('University name is required'),
    });

    const passwordValidationSchema = Yup.object({
        currentPassword: Yup.string().required('Current password is required'),
        newPassword: Yup.string().min(8, 'Password must be at least 8 characters')
            .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
            .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
            .matches(/[0-9]/, 'Password must contain at least one number').required('New password is required'),
        confirmNewPassword: Yup.string().oneOf([Yup.ref('newPassword')], 'Passwords must match').required('Please confirm your new password'),
    });

    const profileFormik = useFormik({
        initialValues: {
            name: user?.name || '',
            university: user?.university || '',
        },
        validationSchema: profileValidationSchema,
        enableReinitialize: true,
        onSubmit: async (values, { setSubmitting }) => {
            await updateProfile(values);
            setSubmitting(false);
        },
    });

    const passwordFormik = useFormik({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            confirmNewPassword: '',
        },
        validationSchema: passwordValidationSchema,
        onSubmit: async (values, { setSubmitting, resetForm }) => {
            const result = await changePassword(values.currentPassword, values.newPassword);
            if (result.success) {
                resetForm();
            }
            setSubmitting(false);
        },
    });

    return (
        <DashboardLayout>
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Profile Card */}
                <div className="bg-white rounded-xl shadow-md">
                    <form onSubmit={profileFormik.handleSubmit}>
                        <div className="p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-1">Profile Information</h2>
                            <p className="text-sm text-gray-500 mb-6">Update your personal details here.</p>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                    <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon className="h-5 w-5 text-gray-400" /></div>
                                    <input id="name" type="text" {...profileFormik.getFieldProps('name')} className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${profileFormik.touched.name && profileFormik.errors.name ? 'border-red-300' : 'border-gray-300 focus:ring-primary-500'}`} /></div>
                                    {profileFormik.touched.name && profileFormik.errors.name && <p className="mt-1 text-sm text-red-600">{profileFormik.errors.name}</p>}
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                    <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><EnvelopeIcon className="h-5 w-5 text-gray-400" /></div>
                                    <input id="email" type="email" value={user?.email || ''} disabled className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" /></div>
                                </div>
                                <div>
                                    <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">University</label>
                                    <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><BuildingLibraryIcon className="h-5 w-5 text-gray-400" /></div>
                                    <input id="university" type="text" {...profileFormik.getFieldProps('university')} className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${profileFormik.touched.university && profileFormik.errors.university ? 'border-red-300' : 'border-gray-300 focus:ring-primary-500'}`} /></div>
                                    {profileFormik.touched.university && profileFormik.errors.university && <p className="mt-1 text-sm text-red-600">{profileFormik.errors.university}</p>}
                                </div>
                            </div>
                        </div>
                        <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end">
                            <button type="submit" disabled={profileFormik.isSubmitting} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 font-medium">Save Changes</button>
                        </div>
                    </form>
                </div>

                {/* Password Card */}
                <div className="bg-white rounded-xl shadow-md">
                    <form onSubmit={passwordFormik.handleSubmit}>
                        <div className="p-6">
                             <h2 className="text-xl font-semibold text-gray-800 mb-1">Change Password</h2>
                            <p className="text-sm text-gray-500 mb-6">Choose a strong, new password.</p>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                                    <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockClosedIcon className="h-5 w-5 text-gray-400" /></div>
                                    <input id="currentPassword" type="password" {...passwordFormik.getFieldProps('currentPassword')} className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword ? 'border-red-300' : 'border-gray-300 focus:ring-primary-500'}`} /></div>
                                    {passwordFormik.touched.currentPassword && passwordFormik.errors.currentPassword && <p className="mt-1 text-sm text-red-600">{passwordFormik.errors.currentPassword}</p>}
                                </div>
                                <div>
                                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                                    <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockClosedIcon className="h-5 w-5 text-gray-400" /></div>
                                    <input id="newPassword" type="password" {...passwordFormik.getFieldProps('newPassword')} className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${passwordFormik.touched.newPassword && passwordFormik.errors.newPassword ? 'border-red-300' : 'border-gray-300 focus:ring-primary-500'}`} /></div>
                                    {passwordFormik.touched.newPassword && passwordFormik.errors.newPassword && <p className="mt-1 text-sm text-red-600">{passwordFormik.errors.newPassword}</p>}
                                </div>
                                <div>
                                    <label htmlFor="confirmNewPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                                    <div className="relative"><div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockClosedIcon className="h-5 w-5 text-gray-400" /></div>
                                    <input id="confirmNewPassword" type="password" {...passwordFormik.getFieldProps('confirmNewPassword')} className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 transition ${passwordFormik.touched.confirmNewPassword && passwordFormik.errors.confirmNewPassword ? 'border-red-300' : 'border-gray-300 focus:ring-primary-500'}`} /></div>
                                    {passwordFormik.touched.confirmNewPassword && passwordFormik.errors.confirmNewPassword && <p className="mt-1 text-sm text-red-600">{passwordFormik.errors.confirmNewPassword}</p>}
                                </div>
                            </div>
                        </div>
                         <div className="px-6 py-4 bg-gray-50 rounded-b-xl flex justify-end">
                            <button type="submit" disabled={passwordFormik.isSubmitting} className="px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 font-medium">Update Password</button>
                        </div>
                    </form>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Settings;
