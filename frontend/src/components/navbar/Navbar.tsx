import { 
    MDBCollapse,
    MDBIcon,
    MDBListGroup, MDBListGroupItem, MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBNavbarNav,
    MDBNavbarToggler
    } from 'mdb-react-ui-kit'
import { useEffect, useState } from 'react';
import './Navbar.css'
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/state/authSlice';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
    const dispatch = useDispatch();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate=useNavigate();
    const handleLogout = () => {
      dispatch(logout());
      navigate('/authentication')
    };

    const handleToggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
  
    // useEffect(() => {
    //   const handleClickOutside = (event: MouseEvent) => {
    //     const dropdownList = document.getElementById('dropdown-list');
    //     if (dropdownList && !dropdownList.contains(event.target as Node)) {
    //       console.log('Clicked outside dropdown list');
    //       setIsDropdownOpen(false);
    //     }
    //   };
    //   document.addEventListener('mousedown', handleClickOutside);
    //   return () => {
    //     document.removeEventListener('mousedown', handleClickOutside);
    //   };
    // }, []);
    
  return (
    <>
          <MDBNavbar className="flexible-navbar" light expand="md" scrolling>
                <MDBNavbarBrand  href="https://www.wevioo.com/fr">
                    <strong className='navbar-brand' >WEVIOO</strong>
                </MDBNavbarBrand>
                <MDBNavbarToggler  />
                <MDBCollapse  navbar>
                    <MDBNavbarNav left>
                        <MDBNavbarItem active>
                            <MDBNavbarLink >Home</MDBNavbarLink>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <a rel="noopener noreferrer" className="nav-link Ripple-parent" href="https://mdbootstrap.com/docs/react/" target="_blank">Email </a>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <a rel="noopener noreferrer" className="nav-link Ripple-parent" href="https://mdbootstrap.com/docs/react/" target="_blank">SMS</a>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <a rel="noopener noreferrer" className="nav-link Ripple-parent" href="https://mdbootstrap.com/docs/react/getting-started/download/" target="_blank">Push </a>
                        </MDBNavbarItem>
                        <MDBNavbarItem>
                            <a rel="noopener noreferrer"  className="nav-link Ripple-parent" href="https://mdbootstrap.com/bootstrap-tutorial/" target="_blank">Free tutorials</a>
                        </MDBNavbarItem>
                    </MDBNavbarNav>
                    <MDBNavbarNav  className='justify-content-end' >
                    <MDBNavbarItem>
                            <a className="nav-link navbar-link" rel="noopener noreferrer" target="_blank" href="https://pl-pl.facebook.com/mdbootstrap/"><MDBIcon fab icon="github" /> Github</a>
                        </MDBNavbarItem>
                      <MDBNavbarItem>
                            <a className="nav-link navbar-link" rel="noopener noreferrer" target="_blank" href="https://twitter.com/mdbootstrap"><MDBIcon fab icon="twitter" /> twitter</a>
                        </MDBNavbarItem>
                        <div id='dropdown-list' style={{margin:"0 10px "}}>
                          <img
                          src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img(30).webp"
                          className="rounded-circle"
                          height="50"
                          alt="Avatar"
                          loading="lazy"
                          onClick={handleToggleDropdown}
                          style={{ cursor: 'pointer' }}
                        />
                      </div>
                    </MDBNavbarNav>
                </MDBCollapse>
            </MDBNavbar>
            {isDropdownOpen && ( 
              <MDBListGroup className='avatar-list' id="dropdown-list" >
                <MDBListGroupItem tag='a' href='#' action noBorders active aria-current='true' className='px-3'>
                  More actions
                </MDBListGroupItem>
                <MDBListGroupItem tag='a' href='#' action noBorders className='px-3'>
                  Profile
                </MDBListGroupItem>
                <MDBListGroupItem onClick={handleLogout} type="button" tag='button' action noBorders className='px-3'>
                  logOut
                </MDBListGroupItem>
                <MDBListGroupItem tag='a' href='#' action noBorders className='px-3'>
                  Desactivate Account
                </MDBListGroupItem>
              </MDBListGroup>   
            )}
    </>

   )
}

export default Navbar