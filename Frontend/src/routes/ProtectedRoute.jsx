import { Navigate } from 'react-router-dom';
import { useAuth } from '../shared/hooks/useAuth.jsx';
import { Loader } from '../shared/components/Loader';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};
