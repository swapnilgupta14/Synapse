import React from 'react';
import { useAppSelector } from '../redux/store';
import AdminDashboard from '../component/dashboards/AdminDashboard';
import UserDashboard from '../component/dashboards/UserDashboard';
import OrganisationDashboard from '../component/dashboards/OrganisationDashboard';

const Dashboard: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  const renderDashboard = () => {
    switch (user?.role) {
      case 'Admin':
        return <AdminDashboard />;
      case 'Organisation':
        return <OrganisationDashboard />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-200">
      <div className="w-full overflow-x-hidden">
        {renderDashboard()}
      </div>
    </div>
  );
};

export default Dashboard;
