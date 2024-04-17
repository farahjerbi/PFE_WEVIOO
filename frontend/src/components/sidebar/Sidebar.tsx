import { MDBCard, MDBCardBody, MDBCol, MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';
import { useEffect, useState } from 'react'
import './Sidebar.css'
import {  useLocation, useNavigate } from 'react-router-dom';
import { Role } from '../../models/user/Role';
import { selectRole } from '../../redux/state/authSlice';
import { useSelector } from 'react-redux';
import {  CALENDAR, DASHBOARD, LIST_EMAIL_TEMPLATES, LIST_PUSH_TEMPLATES, LIST_SMS_TEMPLATES, LIST_USERS, PROFILE, SAVEDTEMPLATES } from '../../routes/paths';
import { Tooltip } from '@mui/material';
import { selectIsOpen } from '../../redux/state/styleSlice';
const Sidebar = () => {
    const location = useLocation();
    const [dashboardName, setDashboardName] = useState('');
    const role = useSelector(selectRole);
    const isOpen=useSelector(selectIsOpen);

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
         <div className={isOpen?"sidebar-fixed position-fixed sidebar-container-open":"sidebar-fixed position-fixed sidebar-container"}>                  
        <MDBCol>
          <MDBCard className="testimonial-card">
            <div
              className="card-up"
            ></div>
            <MDBCardBody style={{marginLeft:0,paddingLeft:0,background:"white"}}>
                <div style={{display:"flex" ,justifyContent:"center",alignItems:"center",background:"white"}}>
                {/* <h4 className="">Notification Platform</h4> */}
                <img src="../../../assets/wevioo_logo.png" className={isOpen?"logoStyleOpen":"logoStyle"}  alt="" />
                </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
             
          <MDBListGroup className="list-group-flush">
                    <MDBListGroupItem className={dashboardName === "dashboard" ? 'sidebar-item-active ' : 'sidebar-item'} onClick={() => navigate(DASHBOARD)}>
                        <Tooltip  title="Dashboard"  >
                        <img src="../../../assets/dash-side.png" alt="sidebar-icon" className={isOpen?"sidebar-icon-open":"sidebar-icon"}/>
                        </Tooltip>
                        {isOpen && ( <span>Dashboard</span> )}
                    </MDBListGroupItem>

                    <MDBListGroupItem  className={dashboardName === "profile" ? 'sidebar-item-active' : 'sidebar-item'}  onClick={()=>navigate(PROFILE)}>
                    <Tooltip  title="Profile"  >
                    <img src="../../../assets/profile-side.png" alt="sidebar-icon" className={isOpen?"sidebar-icon-open":"sidebar-icon"} />
                    </Tooltip>
                    {isOpen && ( <span>Profile</span> )}

                    </MDBListGroupItem>

                    <MDBListGroupItem  className={dashboardName === "calendar" ? 'sidebar-item-active' : 'sidebar-item'}  onClick={()=>navigate(CALENDAR)}>
                         <Tooltip  title="Calendar"  >
                         <img src="../../../assets/calendar-side.png" alt="sidebar-icon" className={isOpen?"sidebar-icon-open":"sidebar-icon"} />
                        </Tooltip>
                        {isOpen && ( <span>My Calendar</span> )}
                    </MDBListGroupItem>


        {role===Role.ADMIN && (<>
         <MDBListGroupItem className={dashboardName === "users/list" ? 'sidebar-item-active' : 'sidebar-item'}  onClick={()=>navigate(LIST_USERS)}>
            <Tooltip  title="Users"  >
            <img src="../../../assets/users-side.png" alt="sidebar-icon" className={isOpen?"sidebar-icon-open":"sidebar-icon"} />
            </Tooltip>
              {isOpen && ( <span>Users</span> )}
                    </MDBListGroupItem>
                </>)}
                 


                    <MDBListGroupItem className={dashboardName === "email/list" ? 'sidebar-item-active' : 'sidebar-item'}  onClick={()=>navigate(LIST_EMAIL_TEMPLATES)}>
                    <Tooltip  title="Emails"  >
                    <img src="../../../assets/email-side.png" alt="sidebar-icon" className={isOpen?"sidebar-icon-open":"sidebar-icon"}/>
                    </Tooltip>
                    {isOpen && ( <span>Email Templates</span> )}
                    </MDBListGroupItem>
              
                    <MDBListGroupItem className={dashboardName === "sms/list" ? 'sidebar-item-active' : 'sidebar-item'}  onClick={()=>navigate(LIST_SMS_TEMPLATES)}>
                    <Tooltip  title="SMS"  >
                    <img src="../../../assets/chatting.png" alt="sidebar-icon" className={isOpen?"sidebar-icon-open":"sidebar-icon"} />
                    </Tooltip>
                    {isOpen && ( <span>SMS Templates</span> )}

                    </MDBListGroupItem>

           
                    <MDBListGroupItem className={dashboardName === "push/list" ? 'sidebar-item-active' : 'sidebar-item'}  onClick={()=>navigate(LIST_PUSH_TEMPLATES)}>
                    <Tooltip  title="Push"  >
                    <img src="../../../assets/bell-side.png" alt="sidebar-icon" className={isOpen?"sidebar-icon-open":"sidebar-icon"} />
                    </Tooltip>
                    {isOpen && ( <span>Push Templates</span> )}
                    </MDBListGroupItem>

              {role===Role.USER && (
                   <MDBListGroupItem className={dashboardName === "saved-templates" ? 'sidebar-item-active' : 'sidebar-item'}  onClick={()=>navigate(SAVEDTEMPLATES)}>
                   <Tooltip  title="saved templates"  >
                   <img src="../../../assets/bookmark.png" alt="sidebar-icon" className={isOpen?"sidebar-icon-open-":"sidebar-icon-"} />
                   </Tooltip>
                   {isOpen && ( <span>Saved Templates</span> )}
                   </MDBListGroupItem>
              )}      
                 
            </MDBListGroup>
    
        </div>

        </>
    
    );

}

export default Sidebar