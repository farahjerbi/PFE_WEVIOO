import { 
  MDBBtn,
    MDBCollapse,
    MDBIcon,
     MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarItem,
    MDBNavbarNav,
    } from 'mdb-react-ui-kit'
import { useState } from 'react';
import './Navbar.css'
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/state/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import LogOut from '@mui/icons-material/Logout';
import { DASHBOARD, LIST_EMAIL_TEMPLATES, LIST_PUSH_TEMPLATES, LIST_SMS_TEMPLATES } from '../../routes/paths';

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const handleLogout = () => {
      dispatch(logout());
      navigate('/authentication')
    };
  return (
    <>
          <MDBNavbar className="flexible-navbar" light expand="md" scrolling>
                <MDBNavbarBrand  href="https://www.wevioo.com/fr" target="_blanc">
                    <strong className='navbar-brand' >WEVIOO</strong>
                </MDBNavbarBrand>
                <MDBCollapse  navbar>
                <div className="nav-content">
                  <ul className="navbar-nav mr-auto">
                        <li>
                            <Link className="menu-items" to={DASHBOARD}>Dashboard</Link>
                        </li>
                        <li>
                            <Link className="menu-items" to={LIST_EMAIL_TEMPLATES}>Email</Link>
                        </li>
                        <li>
                             <Link className="menu-items" to={LIST_SMS_TEMPLATES}>SMS</Link>
                        </li>
                        <li>
                             <Link className="menu-items" to={LIST_PUSH_TEMPLATES}>Push</Link>
                        </li>
                    </ul>
                </div>
                    <MDBNavbarNav  className='justify-content-end' style={{marginRight:"2%"}} >
                        <MDBNavbarItem >
                        <Tooltip title="Logout"  >
                        <IconButton onClick={()=>handleLogout()}>
                            <LogOut style={{color:"#6873C8"}}  />
                        </IconButton>
                        </Tooltip>
                     </MDBNavbarItem>
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBNavbar>
     
    </>

   )
}

export default Navbar