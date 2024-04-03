import React, { useEffect } from "react";
import { useSelector,  } from "react-redux";
import { decodeToken, selectIsAuth } from "../redux/state/authSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { Navigate } from "react-router-dom";
import { AUTHENTICATION } from "./paths";
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const isAuth = useSelector(selectIsAuth);
  console.log("🚀 ~ isAuth:", isAuth)
  if (!isAuth) {
    return <Navigate to={AUTHENTICATION} replace />;
  }

  return <>{children}</>;};

export default ProtectedRoute;


