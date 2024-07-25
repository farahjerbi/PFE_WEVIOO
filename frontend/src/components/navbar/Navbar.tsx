import { 
    MDBCollapse,
     MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarItem,
    MDBNavbarNav,
    } from 'mdb-react-ui-kit'
import './Navbar.css'
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/state/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { IconButton, Tooltip } from '@mui/material';
import { CONTACT, DASHBOARD, LIST_EMAIL_TEMPLATES, LIST_PUSH_TEMPLATES, LIST_SMS_TEMPLATES } from '../../routes/paths';
import { selectIsOpen, setIsOpen } from '../../redux/state/styleSlice';
import { useState } from 'react';

const Navbar = () => {
    const dispatch = useDispatch();
    const isOpen=useSelector(selectIsOpen);
    const navigate=useNavigate();
    const[query,setQuery]=useState<string>('')
    const handleLogout = () => {
      dispatch(logout());
      navigate('/authentication')
    };

    const handleIsOpen = () => {
      dispatch(setIsOpen({isOpen:true}))
    }
    const handleIsClose = () => {
      dispatch(setIsOpen({isOpen:false}))
    }
  return (
    <>
    <div className="navbar-container ">

          <MDBNavbar className="flexible-navbar" light expand="md" scrolling>
           {!isOpen && (<img onClick={handleIsOpen} src="../../../assets/isOpen.png" alt="isOpen" style={{width:"1.8%",marginLeft:"1%",cursor:"pointer"}} />)} 
           {isOpen && (<img onClick={handleIsClose} src="../../../assets/isOpen.png" alt="isOpen" style={{width:"1.8%",marginLeft:"10%",cursor:"pointer"}} />)} 
                <MDBNavbarBrand  href="https://www.wevioo.com/fr" target="_blanc">
                    {/* <img src="../../../assets/wevioo_logo.png" alt='logo' className='logo-navbar' /> */}
                    <strong className='navbar-brand' >WEVIOO</strong>
                </MDBNavbarBrand>
                <MDBCollapse  navbar>
                <div className="nav-content">
                  <ul className="navbar-nav mr-auto">
                        <li>
                            <Link className="menu-items" to={CONTACT}>Statistics</Link>
                        </li>
                        <li className='d-flex align-items-center'>
                        <Link className="menu-items" to={CONTACT}>Contacts</Link>
                        </li>
                    </ul>
                </div>
                    <MDBNavbarNav  className='justify-content-end' style={{marginLeft:"70%"}} >
                        <MDBNavbarItem >
                        <Tooltip title="Logout"  >
                        <IconButton onClick={()=>handleLogout()}>
                         <img src="../../../assets/sign-out.png" alt="logout" style={{width:"25%"}} />
                        </IconButton>
                        </Tooltip>
                     </MDBNavbarItem>
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBNavbar>
     </div>
    </>

   )
}

export default Navbar