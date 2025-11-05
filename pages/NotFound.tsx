
import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheckIcon } from '@heroicons/react/24/outline';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center text-center px-4">
      <ShieldCheckIcon className="h-24 w-24 text-primary-300 mb-4" />
      <h1 className="text-6xl font-bold text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold text-gray-700 mt-2">Page Not Found</h2>
      <p className="text-gray-500 mt-4 max-w-md">
        Sorry, the page you are looking for does not exist. It might have been moved or deleted.
      </p>
      <Link
        to="/"
        className="mt-8 bg-primary-600 text-white px-8 py-3 rounded-lg hover:bg-primary-700 transition"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default NotFound;
