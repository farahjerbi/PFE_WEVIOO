import { MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react'
import './Sidebar.css'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Role } from '../../models/Role';
import { selectRole } from '../../redux/state/authSlice';
import { useSelector } from 'react-redux';
import { ADD_EMAIL_TEMPLATE, CALENDAR, DASHBOARD, EMAILS_STATISTICS, LIST_EMAIL_TEMPLATES, LIST_USERS, PROFILE, USERS_STATISTICS } from '../../routes/paths';
const Sidebar = () => {
    const [basicActive, setBasicActive] = useState('home');
    const [showEmail, setShowEmail] = useState(false);
    const [showSMS, setShowSMS] = useState(false);
    const [showPush, setShowPush] = useState(false);
    const [showUsers, setShowUsers] = useState(false);
    const location = useLocation();
    const [dashboardName, setDashboardName] = useState('');
    const role = useSelector(selectRole);

    useEffect(() => {
      const pathname = location.pathname;
      const dashboardNameFromPath = pathname.split('/');
      const formattedDashboardName =dashboardNameFromPath.slice(1).join('/');
      setDashboardName(formattedDashboardName);
      console.log("🚀 ~ useEffect ~ formattedDashboardName:", formattedDashboardName)

    }, [location.pathname]);
    
    const navigate=useNavigate();
    const handleEmail=()=>{
        setShowEmail(!showEmail)
        setShowPush(false)
        setShowSMS(false)
        setShowUsers(false)
    }
    const handleSMS=()=>{
        setShowSMS(!showSMS)
        setShowEmail(false)
        setShowPush(false)
        setShowUsers(false)

    }
    const handlePush=()=>{
        setShowPush(!showPush)
        setShowEmail(false)
        setShowSMS(false)
        setShowUsers(false)

    }
    const handleUsers=()=>{
        setShowUsers(!showUsers)
        setShowPush(false)
        setShowEmail(false)
        setShowSMS(false)
    }



        const handleBasicClick = (value: string) => {
            if (value === basicActive) return;

            setBasicActive(value);
        }

        

    return (
        <> 
         <div className="sidebar-fixed position-fixed sidebar-container">                  
        <MDBCol>
          <MDBCard className="testimonial-card">
            <div
              className="card-up"
            ></div>
            <MDBCardBody style={{marginLeft:0,paddingLeft:0}}>
                <div style={{display:"flex" ,justifyContent:"center",alignItems:"center"}}>
                <img src="../../../assets/wevioo_logo.png" alt='logo' className='logo-sidebar' />
                <h4 className="">Notification Platform</h4>
                </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
             
          <MDBListGroup className="list-group-flush">
                    <MDBListGroupItem className={dashboardName === "dashboard" ? 'sidebar-item-active' : 'sidebar-item'} onClick={() => navigate(DASHBOARD)}>
                        <MDBIcon icon="chart-pie" className='sidebar-icon'/>
                         <span>Dashboard</span> 
                    </MDBListGroupItem>

                    <MDBListGroupItem  className={dashboardName === "profile" ? 'sidebar-item-active' : 'sidebar-item'}  onClick={()=>navigate(PROFILE)}>
                        <MDBIcon icon="book-reader" className='sidebar-icon'/>
                         <span>Profile</span> 
                    </MDBListGroupItem>

                    <MDBListGroupItem  className={dashboardName === "calendar" ? 'sidebar-item-active' : 'sidebar-item'}  onClick={()=>navigate(CALENDAR)}>
                        <MDBIcon icon="book-reader" className='sidebar-icon'/>
                         <span>My Calendar</span> 
                    </MDBListGroupItem>


        {role===Role.ADMIN && (<>
         <MDBListGroupItem  className='sidebar-item' onClick={handleUsers}>
                        <MDBIcon icon="users" className='sidebar-icon '/>
                        <span>Users Management </span>
                        {!showUsers? <MDBIcon style={{marginLeft:"5px" , color:"rgb(231, 233, 236)"}} icon="caret-down" /> :<MDBIcon style={{marginLeft:"5px" , color:"rgb(231, 233, 236)"}} icon="caret-up" />} 
                    </MDBListGroupItem>
                {showUsers && (
                    <>                        
                     <NavLink to={LIST_USERS}>
                              <MDBListGroupItem noBorders className={dashboardName === "listUsers" ? 'sidebar-item-active' : 'sidebar-item'} >
                                  <MDBIcon icon="list-ol" className='sidebar-icon-secondary  '/>
                                  <span className='span-secondary'>List</span>
                              </MDBListGroupItem>
                          </NavLink>
                          <NavLink to={USERS_STATISTICS}>
                              <MDBListGroupItem noBorders className={dashboardName === "usersStatistics" ? 'sidebar-item-active' : 'sidebar-item'}>
                                  <MDBIcon icon="chart-bar" className='sidebar-icon-secondary '/>
                                  <span className='span-secondary'>Statistics</span>
                              </MDBListGroupItem>
                          </NavLink>
                </>)}
                </>)}
                 


                    <MDBListGroupItem  className='sidebar-item' onClick={handleEmail}>
                        <MDBIcon icon="envelope" className='sidebar-icon ' />
                        <span>Email Templates</span>
                    {!showEmail? <MDBIcon style={{marginLeft:"5px" , color:"rgb(231, 233, 236)"}} icon="caret-down" /> :<MDBIcon style={{marginLeft:"5px" , color:"rgb(231, 233, 236)"}} icon="caret-up" />} 
                    </MDBListGroupItem>
                    {showEmail && (
                    <>
                         <NavLink to={LIST_EMAIL_TEMPLATES} >
                              <MDBListGroupItem noBorders className={dashboardName === "email/list" ? 'sidebar-item-active' : 'sidebar-item'}>
                                  <MDBIcon icon="list-ol" className='sidebar-icon-secondary '/>
                                  <span className='span-secondary'>List</span>
                              </MDBListGroupItem>
                          </NavLink>
                          {role===Role.ADMIN && ( 
                                <NavLink to={ADD_EMAIL_TEMPLATE} >
                                <MDBListGroupItem noBorders className={dashboardName === "email/add" ? 'sidebar-item-active' : 'sidebar-item'}>
                                    <MDBIcon icon="plus" className='sidebar-icon-secondary  '/>
                                    <span className='span-secondary'>Add </span>
                                </MDBListGroupItem>
                            </NavLink>
                          )}             
                          <NavLink to={EMAILS_STATISTICS}>
                              <MDBListGroupItem noBorders  className={dashboardName === "email/statistics" ? 'sidebar-item-active' : 'sidebar-item'}>
                                  <MDBIcon icon="chart-bar" className='sidebar-icon-secondary  '/>
                                  <span className='span-secondary'>Statistics</span>
                              </MDBListGroupItem>
                          </NavLink>
                    </>           
                )}
              
                    <MDBListGroupItem  className='sidebar-item' onClick={handleSMS}>
                        <MDBIcon icon="comment" className='sidebar-icon '/>
                        <span>SMS Templates</span>
                        {!showSMS? <MDBIcon style={{marginLeft:"5px" , color:"rgb(231, 233, 236)"}} icon="caret-down" /> :<MDBIcon style={{marginLeft:"5px" , color:"rgb(231, 233, 236)"}} icon="caret-up" />} 
                    </MDBListGroupItem>
                {showSMS && (
                    <>                        
                     <NavLink to="/tables" >
                              <MDBListGroupItem noBorders className='sidebar-item'>
                                  <MDBIcon icon="list-ol" className='sidebar-icon-secondary  '/>
                                  <span className='span-secondary'>List</span>
                              </MDBListGroupItem>
                          </NavLink>
                          {role===Role.ADMIN && ( 

                          <NavLink to="/tables" >
                              <MDBListGroupItem noBorders className='sidebar-item'>
                                  <MDBIcon icon="plus" className='sidebar-icon-secondary '/>
                                  <span className='span-secondary'>Add </span>
                              </MDBListGroupItem>
                          </NavLink>)}
                          <NavLink to="/tables" >
                              <MDBListGroupItem noBorders className='sidebar-item'>
                                  <MDBIcon icon="chart-bar" className='sidebar-icon-secondary '/>
                                  <span className='span-secondary'>Statistics</span>
                              </MDBListGroupItem>
                          </NavLink>
                </>)}
                    <MDBListGroupItem  className='sidebar-item' onClick={handlePush}>
                        <MDBIcon icon="bell" className='sidebar-icon '/>
                        <span>Push Templates</span>
                        {!showPush? <MDBIcon style={{marginLeft:"5px" , color:"rgb(231, 233, 236)"}} icon="caret-down" /> :<MDBIcon style={{marginLeft:"5px" , color:"rgb(231, 233, 236)"}} icon="caret-up" />} 
                    </MDBListGroupItem>
                {showPush && (
                    <>     
                           <NavLink to="/tables" >
                              <MDBListGroupItem noBorders className='sidebar-item'>
                                  <MDBIcon icon="list-ol" className='sidebar-icon-secondary  '/>
                                  <span className='span-secondary'>List</span>
                              </MDBListGroupItem>
                          </NavLink>
                          {role===Role.ADMIN && ( 
                          <NavLink to="/tables" >
                              <MDBListGroupItem noBorders className='sidebar-item'>
                                  <MDBIcon icon="plus" className='sidebar-icon-secondary  '/>
                                  <span className='span-secondary'>Add </span>
                              </MDBListGroupItem>
                          </NavLink>)}
                          <NavLink to="/tables" >
                              <MDBListGroupItem noBorders className='sidebar-item'>
                                  <MDBIcon icon="chart-bar" className='sidebar-icon-secondary  '/>
                                  <span className='span-secondary'>Statistics</span>
                              </MDBListGroupItem>
                          </NavLink>
                </>)}
            </MDBListGroup>
             {/* <a href="#!" className="logo-wrapper waves-effect">
             <div className="sidebar-header">
            <div className="sidebar-header-bg"></div>
        </div>     
                    </a>  */}
        </div>

        </>
    
    );

}

export default Sidebar