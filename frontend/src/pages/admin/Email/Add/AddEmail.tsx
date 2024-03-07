import { MDBBtn, MDBCard, MDBCardBody, MDBCardFooter, MDBCardImage, MDBCardOverlay, MDBCardText, MDBCardTitle, MDBCol, MDBIcon, MDBRow } from 'mdb-react-ui-kit'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import './AddEmail.css'
import { useNavigate } from 'react-router-dom'
const AddEmail = () => {
    const navigate=useNavigate();
  return (
    <>
      <BreadcrumSection />
    <MDBRow className="add_email_container d-flex justify-content-center">
    <MDBCol xl="5" >
      <MDBCard >
      <div className="center-image">
      <MDBCardImage src="../assets/notification.png" position="top" fluid className="size_img" />
         </div>
         <MDBCardBody>
          <MDBCardTitle className="font-bold mb-3">
            <strong>Simple Template </strong>
          </MDBCardTitle>
          <MDBCardText>Some quick example text to build on the card title and make up the bulk of the card's content.</MDBCardText>
        </MDBCardBody>
        <MDBCardFooter className="links-light profile-card-footer">
          <span className="right">
            <MDBBtn type='submit' color='primary' className='mb-4' block onClick={()=>navigate('/addSimpleEmail')}>
            <MDBIcon icon="plus" className="ml-1" style={{marginRight:"4px"}}  />
                    Add now
            </MDBBtn>
            </span>
        </MDBCardFooter>
      </MDBCard>
    </MDBCol>
    <MDBCol lg="6" xl="5" className="mb-3">
      <MDBCard className="d-flex mb-5">
      <div className="center-image">
      <MDBCardImage src="../assets/emailcomplex.png" position="top" fluid className="size_img" />
         </div>
        <MDBCardBody>
          <MDBCardTitle className="font-bold mb-3">
            <strong>Complex Template</strong>
          </MDBCardTitle>
          <MDBCardText>Some quick example text to build on the card title and make up the bulk of the card's content.</MDBCardText>
        </MDBCardBody>
        <MDBCardFooter className="links-light profile-card-footer">
          <span className="right">
          <MDBBtn type='submit' color='success' className='button mb-4' block onClick={()=>navigate('/createTemplate')}>
            <MDBIcon icon="plus" className="ml-1" style={{marginRight:"4px"}}/>
                    Add now
            </MDBBtn>
          </span>
        </MDBCardFooter>
      </MDBCard>
    </MDBCol>
  </MDBRow>
    </>
    )
}

export default AddEmail