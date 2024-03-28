import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar';
import { useSelector } from "react-redux";
import { selectIsAuth } from "../redux/state/authSlice";
const Layout = () => {
  const isAuth = useSelector(selectIsAuth);

  return (
    <>
    {isAuth && ( <>
      <Navbar/>
      <Sidebar />
    </> )}
    <Outlet />
    </>
 )
}

export default Layout