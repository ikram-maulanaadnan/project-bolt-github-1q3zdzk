import React from 'react';
import { useContent } from '../../contexts/ContentContext';
import { useAuth } from '../../contexts/AuthContext';
import { Settings, Package, MessageSquare, HelpCircle, Home, Shield, Loader2 } from 'lucide-react';

// Define the props type for the StatCard component
interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  count: number;
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

// StatCard component to display statistics
const StatCard: React.FC<StatCardProps> = ({ icon, title, count, color }) => {
  const colorClasses = {
    blue: 'from-blue-500 to-teal-500',
    green: 'from-green-500 to-emerald-500',
    yellow: 'from-yellow-500 to-amber-500',
    purple: 'from-purple-500 to-violet-500',
  };

  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20`}>
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-300 text-sm">{title}</p>
          <p className="text-2xl font-bold text-white">{count}</p>
        </div>
      </div>
    </div>
  );
};

// Main Dashboard component
const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { features, packages, testimonials, faqs, isLoading } = useContent();

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">
          Welcome, {user?.username || 'Admin'}!
        </h1>
        <p className="text-gray-300">
          This is the control center for your Trading Crypto Academy website.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={<Settings className="w-6 h-6 text-white"/>} 
          title="Total Features" 
          count={features.length}
          color="blue"
        />
        <StatCard 
          icon={<Package className="w-6 h-6 text-white"/>} 
          title="Course Packages" 
          count={packages.length}
          color="green"
        />
        <StatCard 
          icon={<MessageSquare className="w-6 h-6 text-white"/>} 
          title="Testimonials" 
          count={testimonials.length}
          color="yellow"
        />
        <StatCard 
          icon={<HelpCircle className="w-6 h-6 text-white"/>} 
          title="Total FAQs" 
          count={faqs.length}
          color="purple"
        />
      </div>

      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h2 className="text-xl font-semibold text-white mb-4">Quick Access</h2>
        <p className="text-gray-300 mb-6">
          Use the navigation menu on the left to manage the different content sections of your website.
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <li className="flex items-center gap-3"><Home className="w-5 h-5 text-blue-400"/> <span className="text-gray-200">Hero Content</span></li>
          <li className="flex items-center gap-3"><Settings className="w-5 h-5 text-blue-400"/> <span className="text-gray-200">Course Features</span></li>
          <li className="flex items-center gap-3"><Package className="w-5 h-5 text-blue-400"/> <span className="text-gray-200">Price Packages</span></li>
          <li className="flex items-center gap-3"><MessageSquare className="w-5 h-5 text-blue-400"/> <span className="text-gray-200">Member Testimonials</span></li>
          <li className="flex items-center gap-3"><HelpCircle className="w-5 h-5 text-blue-400"/> <span className="text-gray-200">FAQs</span></li>
          <li className="flex items-center gap-3"><Shield className="w-5 h-5 text-blue-400"/> <span className="text-gray-200">Security Settings</span></li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
