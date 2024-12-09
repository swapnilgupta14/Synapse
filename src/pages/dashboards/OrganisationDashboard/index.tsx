import { Outlet } from 'react-router-dom';

const OrganisationDashboard: React.FC = () => {
  return (
    <div className='w-full max-h-screen'>
      <Outlet />
    </div>
  );
};

export default OrganisationDashboard;