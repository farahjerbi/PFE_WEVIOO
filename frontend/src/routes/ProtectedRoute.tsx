// ProtectedRouteWrapper.tsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { Role } from '../models/Role';
import { useVerifyTokenMutation } from '../redux/services/authApi';

interface ProtectedRouteWrapperProps {
  path:string,
  requiredRole: Role;
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteWrapperProps> =  ({  requiredRole, element }) => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const storedToken = localStorage.getItem('token');
  const token = storedToken ? JSON.parse(storedToken) : null;

  // const[verifyToken]=useVerifyTokenMutation()

  // const handleTokenVerification = async () => {
  //   try {
  //     const response = await verifyToken({ token });
  //     console.log('Token verified successfully:', response);
  //     return true;
  //   } catch (error) {
  //     console.error('Token verification failed:', error);
  //     return false;
  //   }
  // };
  // const resultat = handleTokenVerification();

  if (!token || ( user.role !== requiredRole) ) {
    return <Navigate to="/authentication" />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;

