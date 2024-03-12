import { 
  MDBBtn,
    MDBCollapse,
    MDBContainer,
    MDBIcon,
    MDBInputGroup,
    MDBListGroup, MDBListGroupItem, MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarItem,
    MDBNavbarLink,
    MDBNavbarNav,
    MDBNavbarToggler
    } from 'mdb-react-ui-kit'
import { useEffect, useState } from 'react';
import './Navbar.css'
const Navbar = () => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const handleToggleDropdown = () => {
      setIsDropdownOpen(!isDropdownOpen);
    };
  
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const dropdownList = document.getElementById('dropdown-list');
        if (dropdownList && !dropdownList.contains(event.target as Node)) {
          setIsDropdownOpen(false);
        }
      };
  
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);
  
  return (
    <>
    {/* <MDBNavbar className='navbar-size'>
    <MDBContainer fluid>
      <MDBNavbarBrand  >
      <h6 >Notification Platform</h6> 
      </MDBNavbarBrand>
      <MDBInputGroup tag="form" className='d-flex w-auto mb-3'>
          <input className='form-control' placeholder="Type query" aria-label="Search" type='Search' />
          <MDBBtn outline>Search</MDBBtn>
        </MDBInputGroup>
    <div id='dropdown-list'>
        <img
        src="https://mdbcdn.b-cdn.net/img/Photos/Avatars/img(31).webp"
        className="rounded-circle"
        height="50"
        alt="Avatar"
        loading="lazy"
        onClick={handleToggleDropdown}
        style={{ cursor: 'pointer' }}
      />
    </div>
    </MDBContainer>
  </MDBNavbar>
   {isDropdownOpen && ( 
    <MDBListGroup className='avatar-list' id="dropdown-list">
      <MDBListGroupItem tag='a' href='#' action noBorders active aria-current='true' className='px-3'>
        More actions
      </MDBListGroupItem>
      <MDBListGroupItem tag='a' href='#' action noBorders className='px-3'>
        Profile
      </MDBListGroupItem>
      <MDBListGroupItem tag='a' href='#' action noBorders className='px-3'>
        LogOut
      </MDBListGroupItem>
      <MDBListGroupItem tag='a' href='#' action noBorders className='px-3'>
        Desactivate Account
      </MDBListGroupItem>
    </MDBListGroup>   
  )} */}
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
                    {/* <MDBBtn  outline color="primary" className='btn me-2' type='button'> */}
                    <MDBNavbarItem>
                            <a className="nav-link navbar-link" rel="noopener noreferrer" target="_blank" href="https://pl-pl.facebook.com/mdbootstrap/"><MDBIcon fab icon="github" /> Github</a>
                        </MDBNavbarItem>
                      {/* </MDBBtn> */}
                      {/* <MDBBtn className='btn' outline color="info" size="sm" type='button'> */}
                      <MDBNavbarItem>
                            <a className="nav-link navbar-link" rel="noopener noreferrer" target="_blank" href="https://twitter.com/mdbootstrap"><MDBIcon fab icon="twitter" /> twitter</a>
                        </MDBNavbarItem>
                       {/* </MDBBtn> */}
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
              <MDBListGroup className='avatar-list' id="dropdown-list">
                <MDBListGroupItem tag='a' href='#' action noBorders active aria-current='true' className='px-3'>
                  More actions
                </MDBListGroupItem>
                <MDBListGroupItem tag='a' href='#' action noBorders className='px-3'>
                  Profile
                </MDBListGroupItem>
                <MDBListGroupItem tag='a' href='#' action noBorders className='px-3'>
                  LogOut
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