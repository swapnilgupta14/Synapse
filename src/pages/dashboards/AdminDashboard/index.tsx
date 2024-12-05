import { Outlet } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  return (
    <div className='w-full max-h-screen'>
      <Outlet />
    </div>
  );
};

export default AdminDashboard;