import { MDBCard, MDBCardBody, MDBIcon, MDBRow, MDBCol, MDBCardText } from 'mdb-react-ui-kit';
import './Section1.css'
const Section1 = () => {
  return (
    <MDBRow className="mb-4">
        <MDBCol xl="3" md="6" className="section mb-r">
          <MDBCard className="cascading-admin-card">
              <div className="admin-up" >
                <MDBIcon icon="mail-bulk" className='color_green'/>
                <div className="data">
                  <p>SALES</p>
                  <h4>
                    <strong>Emails</strong>
                  </h4>
                </div>
              </div>
              <MDBCardBody>
                <div className="progress">
                <div aria-valuemax={100} aria-valuemin={0} aria-valuenow={25} className="progress-bar bg-primary" role="progressbar" style={{width: '25%'}}></div>
                </div>
                <MDBCardText>Better than last week (25%)</MDBCardText>
              </MDBCardBody>
            </MDBCard>
        </MDBCol>  
        <MDBCol xl="3" md="6" className="mb-r">
          <MDBCard className="cascading-admin-card">
              <div className="admin-up">
              <MDBIcon icon="sms" className="color_orange"/>
                <div className="data">
                  <p>SUBSCRIPTIONS</p>
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
                <MDBCardText>Worse than last week (25%)</MDBCardText>
              </MDBCardBody>
            </MDBCard>
        </MDBCol>

        <MDBCol xl="3" md="6" className="mb-r">
          <MDBCard className="cascading-admin-card">
              <div className="admin-up">
              <MDBIcon icon="bell" className="color_purple"/>
                <div className="data">
                  <p>TRAFFIC</p>
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
                <MDBCardText>Worse than last week (75%)</MDBCardText>
              </MDBCardBody>
            </MDBCard>
        </MDBCol>
      </MDBRow>
  )
}

export default Section1;

