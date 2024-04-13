import { MDBCard, MDBCardBody, MDBIcon, MDBRow, MDBCol, MDBCardText } from 'mdb-react-ui-kit';
import './Section1.css'
import {  selectEmails } from '../../redux/state/emailSlice';
import {  useSelector } from 'react-redux';
import { selectUsers } from '../../redux/state/usersSlice';
const Section1 = () => {
  const emails = useSelector(selectEmails);
  const users=useSelector(selectUsers)
  return (
    <div className='section  '>
        <MDBRow className="mb-4 mt-5 ">
        <MDBCol xl="2" md="4" className="mb-r me-4 ms-3 mt-3">
        <MDBCard className="cascading-admin-card">
              <div className="admin-up">
              <MDBIcon icon="envelope" className="color_baby_bluee"/>
                <div className="data">
                  <h4>
                    <strong>Emails</strong>
                  </h4>
                </div>
              </div>
              <MDBCardBody>
                <div className="progress">
                <div aria-valuemax={100} aria-valuemin={0} aria-valuenow={emails?.length} className="progress-bar bg-primary" role="progressbar" style={{width: '25%'}}></div>
                </div>
                <MDBCardText>Count : <strong>{emails.length}</strong></MDBCardText>
              </MDBCardBody>
            </MDBCard>
        </MDBCol>  
        <MDBCol xl="2" md="4" className="mb-r me-4  mt-3">
        <MDBCard className="cascading-admin-card">
              <div className="admin-up">
              <MDBIcon icon="home" className="color_baby_blue"/>
                <div className="data">
                  <h4>
                    <strong>Dept</strong>
                  </h4>
                </div>
              </div>
              <MDBCardBody>
                <div className="progress">
                <div aria-valuemax={100} aria-valuemin={0} aria-valuenow={emails?.length} className="progress-bar bg-primary" role="progressbar" style={{width: '25%'}}></div>
                </div>
                <MDBCardText>Count : <strong>{emails?.length}</strong></MDBCardText>
              </MDBCardBody>
            </MDBCard>
        </MDBCol>  
        <MDBCol xl="2" md="4" className="mb-r me-4  mt-3">
          <MDBCard className="cascading-admin-card">
              <div className="admin-up">
              <MDBIcon icon="sms" className="color_blue"/>
                <div className="data">
                  <h4>
                    <strong>SMS</strong>
                  </h4>
                </div>
              </div>
              <MDBCardBody>
                <div className="progress">
                  <div aria-valuemax={100} aria-valuemin={0} aria-valuenow={25} className="progress-bar bg grey" role="progressbar"
                    style={{width: '25%'}}></div>
                </div>
                <MDBCardText>Count:</MDBCardText>
              </MDBCardBody>
            </MDBCard>
        </MDBCol>

        <MDBCol xl="2" md="4" className="mb-r me-4  mt-3">
          <MDBCard className="cascading-admin-card">
              <div className="admin-up">
              <MDBIcon icon="bell" className="color_white"/>
                <div className="data">
                  <h4>
                    <strong>Push</strong>
                  </h4>
                </div>
              </div>
              <MDBCardBody>
                <div className="progress">
                  <div aria-valuemax={100} aria-valuemin={0} aria-valuenow={25} className="progress-bar grey darken-2" role="progressbar"
                    style={{width: '75%'}}></div>
                </div>
                <MDBCardText>Count:</MDBCardText>
              </MDBCardBody>
            </MDBCard>
        </MDBCol>
        <MDBCol xl="2" md="4" className="mb-r me-4  mt-3">
          <MDBCard className="cascading-admin-card">
              <div className="admin-up">
              <MDBIcon icon="users" className="color_purple"/>
                <div className="data">
                  <h4>
                    <strong>Users</strong>
                  </h4>
                </div>
              </div>
              <MDBCardBody>
                <div className="progress">
                  <div aria-valuemax={100} aria-valuemin={0} aria-valuenow={users?.length} className="progress-bar bg grey" role="progressbar"
                    style={{width: '25%'}}></div>
                </div>
                <MDBCardText>Count : <strong>{users?.length}</strong></MDBCardText>
              </MDBCardBody>
            </MDBCard>
        </MDBCol>
      </MDBRow>

    </div>
  
    
  )
}

export default Section1;

