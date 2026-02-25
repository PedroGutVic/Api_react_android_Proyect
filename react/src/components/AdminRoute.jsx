import { Navigate } from 'react-router-dom';
import authService from '../api/auth';

const AdminRoute = ({ children }) => {
  const isAuthenticated = authService.isAuthenticated();
  const user = authService.getUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'admin') {
    return <Navigate to="/videojuegos" replace />;
  }

  return children;
};

export default AdminRoute;
