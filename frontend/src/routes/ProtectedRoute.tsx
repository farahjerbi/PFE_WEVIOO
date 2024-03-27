// ProtectedRouteWrapper.tsx
import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Role } from '../models/Role';
import { useVerifyTokenMutation } from '../redux/services/authApi';

interface ProtectedRouteWrapperProps {
  path:string,
  requiredRole: Role[];
  element: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteWrapperProps> =  ({  requiredRole, element }) => {
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;

  const storedToken = localStorage.getItem('token');
  const token = storedToken ? storedToken.substring(1, storedToken.length - 1) : null;


  const navigate = useNavigate();

  const[isVerified,setIsVerified]=useState<boolean>()
  const [verifyToken] = useVerifyTokenMutation();

  useEffect(() => {
    if(token){
      verifyTokenAndNavigate();
    }
  }, []);

  const verifyTokenAndNavigate = async () => {
    if (token) {
      try {
        const res=await verifyToken({token}).unwrap();
        console.log("🚀 ~ verifyTokenAndNavigate ~ res:", res)
        setIsVerified(res)
      } 
      catch (error) {
        navigate('/authentication');
      }
    } 
  };
  if (!token || ( !requiredRole.includes(user.role) || isVerified===false) ) {
    console.log("🚀 ~ isVerified:", isVerified)
    return <Navigate to="/authentication" />;
  }

  return <>{element}</>;
};

export default ProtectedRoute;

