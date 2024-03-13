import { MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBListGroup, MDBListGroupItem } from 'mdb-react-ui-kit';
import { useState } from 'react'
import './Sidebar.css'
import { NavLink, useNavigate } from 'react-router-dom';
const Sidebar = () => {
    const [basicActive, setBasicActive] = useState('home');
    const [showEmail, setShowEmail] = useState(false);
    const [showSMS, setShowSMS] = useState(false);
    const [showPush, setShowPush] = useState(false);
    const [showUsers, setShowUsers] = useState(false);

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
                <img src="../assets/wevioo_logo.png" alt='logo' className='logo' />
                <h4 className="">Notification Platform</h4>
                </div>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
             
          <MDBListGroup className="list-group-flush">
                    <MDBListGroupItem  className='sidebar-item' onClick={()=>navigate('/dashboard')}>
                        <MDBIcon icon="chart-pie" className='sidebar-icon'/>
                         <span>Dashboard</span> 
                    </MDBListGroupItem>



                    <MDBListGroupItem  className='sidebar-item' onClick={handleUsers}>
                        <MDBIcon icon="users" className='sidebar-icon '/>
                        <span>Users Management </span>
                        {!showUsers? <MDBIcon style={{marginLeft:"5px" , color:"gray"}} icon="caret-down" /> :<MDBIcon style={{marginLeft:"5px" , color:"gray"}} icon="caret-up" />} 
                    </MDBListGroupItem>
                {showUsers && (
                    <>                        
                     <NavLink to="/listUsers" >
                              <MDBListGroupItem noBorders className='sidebar-item'>
                                  <MDBIcon icon="list-ol" className='sidebar-icon-secondary  '/>
                                  <span className='span-secondary'>List</span>
                              </MDBListGroupItem>
                          </NavLink>
                          <NavLink to="/usersStatistics" >
                              <MDBListGroupItem noBorders className='sidebar-item'>
                                  <MDBIcon icon="chart-bar" className='sidebar-icon-secondary '/>
                                  <span className='span-secondary'>Statistics</span>
                              </MDBListGroupItem>
                          </NavLink>
                </>)}


                    <MDBListGroupItem  className='sidebar-item' onClick={handleEmail}>
                        <MDBIcon icon="envelope" className='sidebar-icon ' />
                        <span>Email Templates</span>
                    {!showEmail? <MDBIcon style={{marginLeft:"5px" , color:"gray"}} icon="caret-down" /> :<MDBIcon style={{marginLeft:"5px" , color:"gray"}} icon="caret-up" />} 
                    </MDBListGroupItem>
                    {showEmail && (
                    <>
                         <NavLink to="/listEmailTemplates" >
                              <MDBListGroupItem noBorders className='sidebar-item'>
                                  <MDBIcon icon="list-ol" className='sidebar-icon-secondary '/>
                                  <span className='span-secondary'>List</span>
                              </MDBListGroupItem>
                          </NavLink>
                          <NavLink to="/addEmailTemplate" >
                              <MDBListGroupItem noBorders className='sidebar-item'>
                                  <MDBIcon icon="plus" className='sidebar-icon-secondary  '/>
                                  <span className='span-secondary'>Add </span>
                              </MDBListGroupItem>
                          </NavLink>
                          <NavLink to="/emailsStatistics" >
                              <MDBListGroupItem noBorders className='sidebar-item'>
                                  <MDBIcon icon="chart-bar" className='sidebar-icon-secondary  '/>
                                  <span className='span-secondary'>Statistics</span>
                              </MDBListGroupItem>
                          </NavLink>
                    </>           
                )}
              
                    <MDBListGroupItem  className='sidebar-item' onClick={handleSMS}>
                        <MDBIcon icon="comment" className='sidebar-icon '/>
                        <span>SMS Templates</span>
                        {!showSMS? <MDBIcon style={{marginLeft:"5px" , color:"gray"}} icon="caret-down" /> :<MDBIcon style={{marginLeft:"5px" , color:"gray"}} icon="caret-up" />} 
                    </MDBListGroupItem>
                {showSMS && (
                    <>                        
                     <NavLink to="/tables" >
                              <MDBListGroupItem noBorders className='sidebar-item'>
                                  <MDBIcon icon="list-ol" className='sidebar-icon-secondary  '/>
                                  <span className='span-secondary'>List</span>
                              </MDBListGroupItem>
                          </NavLink>
                          <NavLink to="/tables" >
                              <MDBListGroupItem noBorders className='sidebar-item'>
                                  <MDBIcon icon="plus" className='sidebar-icon-secondary '/>
                                  <span className='span-secondary'>Add </span>
                              </MDBListGroupItem>
                          </NavLink>
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
                        {!showPush? <MDBIcon style={{marginLeft:"5px" , color:"gray"}} icon="caret-down" /> :<MDBIcon style={{marginLeft:"5px" , color:"gray"}} icon="caret-up" />} 
                    </MDBListGroupItem>
                {showPush && (
                    <>     
                           <NavLink to="/tables" >
                              <MDBListGroupItem noBorders className='sidebar-item'>
                                  <MDBIcon icon="list-ol" className='sidebar-icon-secondary  '/>
                                  <span className='span-secondary'>List</span>
                              </MDBListGroupItem>
                          </NavLink>
                          <NavLink to="/tables" >
                              <MDBListGroupItem noBorders className='sidebar-item'>
                                  <MDBIcon icon="plus" className='sidebar-icon-secondary  '/>
                                  <span className='span-secondary'>Add </span>
                              </MDBListGroupItem>
                          </NavLink>
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