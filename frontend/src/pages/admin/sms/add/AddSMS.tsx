import {  MDBCard, MDBCardBody, MDBCardFooter, MDBCardImage, MDBCardText, MDBCardTitle, MDBCol, MDBRow } from 'mdb-react-ui-kit'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import './AddSMS.css'
import { useNavigate } from 'react-router-dom'
import PostAdd from "@mui/icons-material/PostAdd";
import { Button, Tooltip } from '@mui/material';
import { ADD_ADVANCED_EMAIL_TEMPLATE, CREATE_SMS_TEMPLATE, CREATE_WHATSAPP_TEMPLATE } from '../../../../routes/paths';

const AddSMS = () => {
    const navigate=useNavigate();

  return (
    <>
      <BreadcrumSection />
    <MDBRow className="add_sms_container d-flex justify-content-center pt-5 ">
    <MDBCol xl="5" >
      <MDBCard  >
      <div className="center-image">
      <MDBCardImage src="../assets/Chatting.gif" position="top" fluid className="size_img" />
         </div>
         <MDBCardBody>
          <MDBCardTitle className="font-bold mb-3">
            <strong className='ms-5'>SMS Template </strong>
          </MDBCardTitle>
          <MDBCardText>Some quick example text to build on the card title and make up the bulk of the card's content.</MDBCardText>
        </MDBCardBody>
        <MDBCardFooter className="links-light profile-card-footer">
         
        <Tooltip  style={{width:"100%"}} title="Add Simple Template" className="color_baby_blue" >
                          <Button  onClick={()=>navigate(CREATE_SMS_TEMPLATE)} >
                          <PostAdd style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>
        </MDBCardFooter>
      </MDBCard>
    </MDBCol>
    <MDBCol lg="6" xl="5" className="mb-3 ms-5">
      <MDBCard className="d-flex mb-5">
      <div className="center-image">
      <MDBCardImage src="../assets/Chatting2.gif" position="top" fluid className="size_img" /> 
         </div>
        <MDBCardBody>
          <MDBCardTitle className="font-bold mb-3">
            <strong className='ms-5'>WhatsApp Template</strong>
          </MDBCardTitle>
          <MDBCardText>Some quick example text to build on the card title and make up the bulk of the card's content.</MDBCardText>
        </MDBCardBody>
        <MDBCardFooter className="links-light profile-card-footer">
       
            <Tooltip  style={{width:"100%"}} title="Add Advanced Template" className="color_blue" >
                          <Button  onClick={()=>navigate(CREATE_WHATSAPP_TEMPLATE)} >
                          <PostAdd style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>
        </MDBCardFooter>
      </MDBCard>
    </MDBCol>
  </MDBRow>
    </>  )
}

export default AddSMS