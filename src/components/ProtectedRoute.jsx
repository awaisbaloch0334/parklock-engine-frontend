import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // We will check localStorage for now. Later, this will hold a secure JWT token from Spring Boot.
  const isAuthenticated = localStorage.getItem('isAdminLoggedIn') === 'true';

  if (!isAuthenticated) {
    // Kick them back to the login page
    return <Navigate to="/admin/login" replace />;
  }

  // If authorized, render the requested page
  return children;
};

export default ProtectedRoute;