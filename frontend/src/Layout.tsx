import { Outlet } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Sidebar from './components/sidebar/Sidebar';

const Layout = () => {
  return (
    <>
    <Navbar/>
    <Sidebar />
    <Outlet />
    </>
 )
}

export default Layout