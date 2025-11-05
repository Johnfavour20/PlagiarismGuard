import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuth } from '../context/AuthContext.tsx';
import { ShieldCheckIcon, UserIcon, EnvelopeIcon, LockClosedIcon, BuildingLibraryIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const universities = [
    'University of Port Harcourt', 'University of Lagos', 'University of Ibadan',
    'Obafemi Awolowo University', 'Ahmadu Bello University', 'University of Nigeria, Nsukka', 'Other'
  ];

  const validationSchema = Yup.object({
    name: Yup.string().min(3, 'Name must be at least 3 characters').required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    university: Yup.string().required('Please select your university'),
    role: Yup.string().oneOf(['student', 'lecturer'], 'Please select a valid role').required('Role is required'),
    password: Yup.string().min(8, 'Password must be at least 8 characters')
      .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
      .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
      .matches(/[0-9]/, 'Password must contain at least one number').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password')], 'Passwords must match').required('Please confirm your password'),
    acceptTerms: Yup.boolean().oneOf([true], 'You must accept the terms and conditions')
  });

  const formik = useFormik({
    initialValues: { name: '', email: '', university: '', role: 'student', password: '', confirmPassword: '', acceptTerms: false },
    validationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      const { name, email, university, role, password } = values;
      const result = await register({ name, email, university, role, password });
      setSubmitting(false);
      if (result.success && result.user) {
        if (result.user.role === 'admin') navigate('/admin/dashboard');
        else if (result.user.role === 'lecturer') navigate('/lecturer/dashboard');
        else navigate('/student/dashboard');
      }
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center justify-center mb-6">
            <ShieldCheckIcon className="h-12 w-12 text-primary-600" />
            <span className="ml-2 text-2xl font-bold text-gray-900">PlagiarismGuard</span>
          </Link>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h2>
          <p className="text-gray-600">Join the fight against plagiarism in Nigerian universities</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Form fields here, similar structure to LoginPage, adapted for Register fields */}
             <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><UserIcon className="h-5 w-5 text-gray-400" /></div>
                <input id="name" type="text" {...formik.getFieldProps('name')} className={`block w-full pl-10 pr-3 py-3 border ${ formik.touched.name && formik.errors.name ? 'border-red-300' : 'border-gray-300' } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition`} placeholder="Enter your full name" />
              </div>
              {formik.touched.name && formik.errors.name ? <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p> : null}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><EnvelopeIcon className="h-5 w-5 text-gray-400" /></div>
                <input id="email" type="email" {...formik.getFieldProps('email')} className={`block w-full pl-10 pr-3 py-3 border ${ formik.touched.email && formik.errors.email ? 'border-red-300' : 'border-gray-300' } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition`} placeholder="your.email@university.edu.ng" />
              </div>
              {formik.touched.email && formik.errors.email ? <p className="mt-1 text-sm text-red-600">{formik.errors.email}</p> : null}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="university" className="block text-sm font-medium text-gray-700 mb-2">University</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><BuildingLibraryIcon className="h-5 w-5 text-gray-400" /></div>
                  <select id="university" {...formik.getFieldProps('university')} className={`block w-full pl-10 pr-3 py-3 border ${ formik.touched.university && formik.errors.university ? 'border-red-300' : 'border-gray-300' } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition`}>
                    <option value="">Select University</option>
                    {universities.map((uni) => <option key={uni} value={uni}>{uni}</option>)}
                  </select>
                </div>
                {formik.touched.university && formik.errors.university ? <p className="mt-1 text-sm text-red-600">{formik.errors.university}</p> : null}
              </div>
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">I am a...</label>
                <select id="role" {...formik.getFieldProps('role')} className={`block w-full px-3 py-3 border ${ formik.touched.role && formik.errors.role ? 'border-red-300' : 'border-gray-300' } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition`}>
                  <option value="student">Student</option>
                  <option value="lecturer">Lecturer</option>
                </select>
                {formik.touched.role && formik.errors.role ? <p className="mt-1 text-sm text-red-600">{formik.errors.role}</p> : null}
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockClosedIcon className="h-5 w-5 text-gray-400" /></div>
                <input id="password" type={showPassword ? 'text' : 'password'} {...formik.getFieldProps('password')} className={`block w-full pl-10 pr-10 py-3 border ${ formik.touched.password && formik.errors.password ? 'border-red-300' : 'border-gray-300' } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition`} placeholder="Create a strong password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}</button>
              </div>
              {formik.touched.password && formik.errors.password ? <p className="mt-1 text-sm text-red-600">{formik.errors.password}</p> : null}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><LockClosedIcon className="h-5 w-5 text-gray-400" /></div>
                <input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} {...formik.getFieldProps('confirmPassword')} className={`block w-full pl-10 pr-10 py-3 border ${ formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-300' : 'border-gray-300' } rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition`} placeholder="Confirm your password" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">{showConfirmPassword ? <EyeSlashIcon className="h-5 w-5 text-gray-400" /> : <EyeIcon className="h-5 w-5 text-gray-400" />}</button>
              </div>
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? <p className="mt-1 text-sm text-red-600">{formik.errors.confirmPassword}</p> : null}
            </div>
            
            <div className="flex items-start">
              <input id="acceptTerms" type="checkbox" {...formik.getFieldProps('acceptTerms')} className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded mt-1" />
              <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">I agree to the <a href="#" className="text-primary-600 hover:text-primary-500">Terms and Conditions</a> and <a href="#" className="text-primary-600 hover:text-primary-500">Privacy Policy</a></label>
            </div>
            {formik.touched.acceptTerms && formik.errors.acceptTerms ? <p className="text-sm text-red-600">{formik.errors.acceptTerms}</p> : null}

            <button type="submit" disabled={formik.isSubmitting} className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition">
                {formik.isSubmitting ? <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Already have an account? <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">Sign in here</Link></p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link to="/" className="text-sm text-gray-600 hover:text-gray-900 flex items-center justify-center">
            <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;