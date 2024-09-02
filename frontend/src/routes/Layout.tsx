import { Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Sidebar from '../components/sidebar/Sidebar';
import { useSelector } from "react-redux";
import { selectIsAuth } from "../redux/state/authSlice";
const Layout = () => {
  const isAuth = useSelector(selectIsAuth);
  return (
    <>
          <Navbar/>
          <div >
          <Sidebar />
          </div>
          <div className='main-content' style={{position:"relative" ,zIndex:"20" , marginLeft:"5%"}}>
                    <Outlet />
                </div>    </>
 )
}

export default Layout

//docker exec -it db-postgres psql -U postgres
//\c CREATE DATABASE "Ms_PUSH_Notification";
//\c  Ms_Push_Notification;

