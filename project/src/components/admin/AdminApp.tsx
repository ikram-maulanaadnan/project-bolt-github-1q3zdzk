import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from './LoginForm';
import AdminLayout from './AdminLayout';
import Dashboard from './Dashboard';
import HeroContentManager from './HeroContentManager';
import FeaturesManager from './FeaturesManager';
import PackagesManager from './PackagesManager';
import TestimonialsManager from './TestimonialsManager';
import FAQsManager from './FAQsManager';
import SecuritySettings from './SecuritySettings';

const AdminApp: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <LoginForm />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'hero':
        return <HeroContentManager />;
      case 'features':
        return <FeaturesManager />;
      case 'packages':
        return <PackagesManager />;
      case 'testimonials':
        return <TestimonialsManager />;
      case 'faqs':
        return <FAQsManager />;
      case 'security':
        return <SecuritySettings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <AdminLayout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </AdminLayout>
  );
};

export default AdminApp;