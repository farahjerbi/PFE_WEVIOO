import { MDBCard, MDBCardBody, MDBIcon, MDBRow, MDBCol, MDBCardText } from 'mdb-react-ui-kit';
import './Section1.css'
import { useEffect, useState } from 'react';
import { EmailTemplate } from '../../models/EmailTemplate';
import { useGetAllEmailTemplatesMutation } from '../../redux/services/emailApi';
import { toast } from 'sonner';
import { IUser } from '../../models/User';
import { useGetAllUsersMutation } from '../../redux/services/usersApi';
const Section1 = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [templates, setTemplates] = useState<EmailTemplate[]>([]);
  const [numberOfUsers, setNumberOfUsers] = useState<number>(0);
  const [numberOfTemplatesEmail, setNumberOfTemplatesEmail] = useState<number>(0);
  const[getAllEmailTemplates]=useGetAllEmailTemplatesMutation();
  const[getAllUsers]=useGetAllUsersMutation();
  useEffect(() => {
    fetchData(); 
    fetchDataUser();
  }, []);

  const fetchData = async () => {
    try {
      const response = await getAllEmailTemplates({}).unwrap();
      console.log("🚀 ~ fetchData ~ response:", response)
      setTemplates(response); 
      setNumberOfTemplatesEmail(response.length);
      console.error("🚀 ~ error:", templates);
    } catch (error) {
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);
    }
  };

  const fetchDataUser = async () => {
    try {
      const response = await getAllUsers({}).unwrap();
      console.log("🚀 ~ fetchData ~ response:", response)
      setUsers(response); 
      setNumberOfUsers(response.length);
      console.error("🚀 ~ error:", users);
    } catch (error) {
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);
    }
  };

  return (
    <div className='section '>
        <MDBRow className="mb-4 ">
        <MDBCol xl="2" md="4" className="mb-r me-4">
        <MDBCard className="cascading-admin-card">
              <div className="admin-up">
              <MDBIcon icon="sms" className="color_baby_blue"/>
                <div className="data">
                  <h4>
                    <strong>Emails</strong>
                  </h4>
                </div>
              </div>
              <MDBCardBody>
                <div className="progress">
                <div aria-valuemax={100} aria-valuemin={0} aria-valuenow={numberOfTemplatesEmail} className="progress-bar bg-primary" role="progressbar" style={{width: '25%'}}></div>
                </div>
                <MDBCardText>Count : <strong>{numberOfTemplatesEmail}</strong></MDBCardText>
              </MDBCardBody>
            </MDBCard>
        </MDBCol>  
        <MDBCol xl="2" md="4" className="mb-r me-4">
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
                <div aria-valuemax={100} aria-valuemin={0} aria-valuenow={numberOfTemplatesEmail} className="progress-bar bg-primary" role="progressbar" style={{width: '25%'}}></div>
                </div>
                <MDBCardText>Count : <strong>{numberOfTemplatesEmail}</strong></MDBCardText>
              </MDBCardBody>
            </MDBCard>
        </MDBCol>  
        <MDBCol xl="2" md="4" className="mb-r me-4">
          <MDBCard className="cascading-admin-card">
              <div className="admin-up">
              <MDBIcon icon="sms" className="color_orange"/>
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

        <MDBCol xl="2" md="4" className="mb-r me-4">
          <MDBCard className="cascading-admin-card">
              <div className="admin-up">
              <MDBIcon icon="bell" className="color_purple"/>
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
        <MDBCol xl="2" md="4" className="mb-r me-4">
          <MDBCard className="cascading-admin-card">
              <div className="admin-up">
              <MDBIcon icon="users" className="color_red"/>
                <div className="data">
                  <h4>
                    <strong>Users</strong>
                  </h4>
                </div>
              </div>
              <MDBCardBody>
                <div className="progress">
                  <div aria-valuemax={100} aria-valuemin={0} aria-valuenow={numberOfUsers} className="progress-bar bg grey" role="progressbar"
                    style={{width: '25%'}}></div>
                </div>
                <MDBCardText>Count : <strong>{numberOfUsers}</strong></MDBCardText>
              </MDBCardBody>
            </MDBCard>
        </MDBCol>
      </MDBRow>

    </div>
  
    
  )
}

export default Section1;

