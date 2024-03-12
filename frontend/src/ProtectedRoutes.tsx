import React from 'react'
import { Outlet, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/admin/dashboard/Dashboard';
import AddEmail from './pages/admin/Email/Add/AddEmail';
import Home from './pages/admin/home/Home';
import Sidebar from './components/sidebar/Sidebar';
import Navbar from './components/navbar/Navbar';

const ProtectedRoutes = () => {
    return (
       
       <>
      <Navbar />
      <Sidebar />
      <Outlet />
     </>
        
      );  
}

export default ProtectedRoutes