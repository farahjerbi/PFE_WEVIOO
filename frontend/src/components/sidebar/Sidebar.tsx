import { MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react'
import './Sidebar.css'
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Role } from '../../models/Role';
import { selectRole } from '../../redux/state/authSlice';
import { useSelector } from 'react-redux';
import { ADD_EMAIL_TEMPLATE, CALENDAR, DASHBOARD, EMAILS_STATISTICS, LIST_EMAIL_TEMPLATES, LIST_PUSH_TEMPLATES, LIST_SMS_TEMPLATES, LIST_USERS, PROFILE, USERS_STATISTICS } from '../../routes/paths';
import { Tooltip } from '@mui/material';
const Sidebar = () => {
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

    return (
        <> 
         <div className="sidebar-fixed position-fixed sidebar-container">                  
        <MDBCol>
          <MDBCard className="testimonial-card">
            <div
              className="card-up"
            ></div>
            <MDBCardBody style={{marginLeft:0,paddingLeft:0,background:"white"}}>
                <div style={{display:"flex" ,justifyContent:"center",alignItems:"center",background:"white"}}>
                {/* <h4 className="">Notification Platform</h4> */}
                <img src="../../../assets/wevioo_logo.png" className='logoStyle' alt="" />
                </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
             
          <MDBListGroup className="list-group-flush">
                    <MDBListGroupItem className={dashboardName === "dashboard" ? 'sidebar-item-active ' : 'sidebar-item'} onClick={() => navigate(DASHBOARD)}>
                        <Tooltip  title="Dashboard"  >
                        <img src="../../../assets/dash-side.png" alt="sidebar-icon" className="sidebar-icon" />
                        </Tooltip>
                        {/* <MDBIcon icon="home" className='sidebar-icon '/> */}
                         {/* <span >Dashboard</span>  */}
                    </MDBListGroupItem>

                    <MDBListGroupItem  className={dashboardName === "profile" ? 'sidebar-item-active' : 'sidebar-item'}  onClick={()=>navigate(PROFILE)}>
                    <Tooltip  title="Profile"  >
                    <img src="../../../assets/profile-side.png" alt="sidebar-icon" className="sidebar-icon" />
                    </Tooltip>
                    {/* <MDBIcon icon="user" className='sidebar-icon '/> */}
                         {/* <span>Profile</span>  */}
                    </MDBListGroupItem>

                    <MDBListGroupItem  className={dashboardName === "calendar" ? 'sidebar-item-active' : 'sidebar-item'}  onClick={()=>navigate(CALENDAR)}>
                    {/* <MDBIcon icon="calendar" className='sidebar-icon '/> */}
                         {/* <span>My Calendar</span>  */}
                         <Tooltip  title="Calendar"  >
                         <img src="../../../assets/calendar-side.png" alt="sidebar-icon" className="sidebar-icon" />
                        </Tooltip>
                    </MDBListGroupItem>


        {role===Role.ADMIN && (<>
         <MDBListGroupItem className={dashboardName === "users/list" ? 'sidebar-item-active' : 'sidebar-item'}  onClick={()=>navigate(LIST_USERS)}>
            <Tooltip  title="Users"  >
            <img src="../../../assets/users-side.png" alt="sidebar-icon" className="sidebar-icon" />
            </Tooltip>
                        {/* <span>Users </span> */}
                        {/* {!showUsers? <MDBIcon style={{marginLeft:"5px" , color:"rgb(69, 75, 84)"}} icon="caret-down" /> :<MDBIcon style={{marginLeft:"5px" , color:"rgb(69, 75, 84)"}} icon="caret-up" />}  */}
                    </MDBListGroupItem>
                </>)}
                 


                    <MDBListGroupItem className={dashboardName === "email/list" ? 'sidebar-item-active' : 'sidebar-item'}  onClick={()=>navigate(LIST_EMAIL_TEMPLATES)}>
                    {/* <MDBIcon icon="envelope" className='sidebar-icon '/> */}
                    <Tooltip  title="Emails"  >
                    <img src="../../../assets/email-side.png" alt="sidebar-icon" className="sidebar-icon" />
                    </Tooltip>
                    {/* <span>Email Templates</span> */}
                    {/* {!showEmail? <MDBIcon style={{ color:"rgb(69, 75, 84)"}} icon="caret-down" /> :<MDBIcon style={{color:"rgb(69, 75, 84)"}} icon="caret-up" />}  */}
                    </MDBListGroupItem>
              
                    <MDBListGroupItem className={dashboardName === "sms/list" ? 'sidebar-item-active' : 'sidebar-item'}  onClick={()=>navigate(LIST_SMS_TEMPLATES)}>
                    {/* <MDBIcon icon="sms" className='sidebar-icon '/> */}
                    <Tooltip  title="SMS"  >
                    <img src="../../../assets/chatting.png" alt="sidebar-icon" className="sidebar-icon" />
                    </Tooltip>
                        {/* <span>SMS Templates</span> */}
                        {/* {!showSMS? <MDBIcon style={{marginLeft:"5px" , color:"rgb(69, 75, 84)"}} icon="caret-down" /> :<MDBIcon style={{marginLeft:"5px" , color:"rgb(69, 75, 84)"}} icon="caret-up" />}  */}
                    </MDBListGroupItem>

           
                    <MDBListGroupItem className={dashboardName === "push/list" ? 'sidebar-item-active' : 'sidebar-item'}  onClick={()=>navigate(LIST_PUSH_TEMPLATES)}>
                    {/* <MDBIcon icon="bell" className='sidebar-icon '/> */}
                    <Tooltip  title="Push"  >
                    <img src="../../../assets/bell-side.png" alt="sidebar-icon" className="sidebar-icon" />
                    </Tooltip>
                        {/* <span>Push Templates</span> */}
                        {/* {!showPush? <MDBIcon style={{marginLeft:"5px" , color:"rgb(69, 75, 84)"}} icon="caret-down" /> :<MDBIcon style={{marginLeft:"5px" , color:"rgb(69, 75, 84)"}} icon="caret-up" />}  */}
                    </MDBListGroupItem>
            
            </MDBListGroup>
    
        </div>

        </>
    
    );

}

export default Sidebar