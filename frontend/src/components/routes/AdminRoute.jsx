import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import LoadingSpinner from '../ui/LoadingSpinner/LoadingSpinner';

const AdminRoute = ({ redirectPath = '/' }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="full-page-loading">
        <LoadingSpinner size="large" />
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};

export default AdminRoute;