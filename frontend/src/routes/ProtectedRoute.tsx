import React from "react";
import { useDispatch,  } from "react-redux";
import {  isTokenExpired, setIsAuthorized } from "../redux/state/authSlice";
import Authentication from "../pages/authentication/Authentication";
import { AppDispatch } from "../redux/store";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const dispatch: AppDispatch = useDispatch(); 
    const token = localStorage.getItem("token");
    dispatch(setIsAuthorized(!isTokenExpired(token)));   
  return !isTokenExpired(token) ? <>{children}</> : <Authentication />;
};

export default ProtectedRoute;


