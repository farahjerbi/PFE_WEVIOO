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
import { useNavigate } from 'react-router-dom';
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
                <MDBNavbarBrand  href="https://www.wevioo.com/fr">
                    <strong className='navbar-brand' >WEVIOO</strong>
                </MDBNavbarBrand>
                <MDBCollapse  navbar>
                <div className="nav-content">
                  <ul className="navbar-nav mr-auto">
                        <li>
                            <a className="menu-items" onClick={()=>navigate('dashboard')} >Dashboard</a>
                        </li>
                        <li>
                            <a className="menu-items" onClick={()=>navigate('listEmailTemplates')}>Email</a>
                        </li>
                        <li>
                            <a className="menu-items">SMS</a>
                        </li>
                        <li>
                            <a className="menu-items">Push</a>
                        </li>
                    </ul>
                </div>
                    <MDBNavbarNav  className='justify-content-end' style={{marginRight:"2%"}} >
                    <MDBNavbarItem>
                            <a className="nav-link navbar-link" rel="noopener noreferrer" target="_blank" href="https://pl-pl.facebook.com/mdbootstrap/"><MDBIcon fab icon="github" /> Github</a>
                        </MDBNavbarItem>
                      <MDBNavbarItem>
                            <a className="nav-link navbar-link" rel="noopener noreferrer" target="_blank" href="https://twitter.com/mdbootstrap"><MDBIcon fab icon="twitter" /> twitter</a>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                        <MDBBtn onClick={()=>handleLogout()}
                         style={{ background: 'linear-gradient(90deg, rgba(106, 15, 255, 1) 0%, rgba(131, 89, 255, 1) 15%, rgba(131, 118, 230, 1) 35%, rgba(186, 155, 227, 1) 67%, rgba(234, 219, 255, 1) 100%)'}} >
                        Log Out
                      </MDBBtn>
                                      </MDBNavbarItem>
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBNavbar>
     
    </>

   )
}

export default Navbar