import React from 'react'
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBTypography, MDBIcon, MDBBtn } from 'mdb-react-ui-kit';
import './ContactDetails.css'
import { useSelector } from 'react-redux';
import { selectContactDetails, selectTeam } from '../../redux/state/authSlice';
import Avatar from 'react-avatar';
import { Button, Tooltip } from '@mui/material';
import Update from '@mui/icons-material/Update';
import Delete from '@mui/icons-material/Delete';
interface ContactDetailsProps {
  onClose: () => void;
}
const ContactDetails: React.FC<ContactDetailsProps> = ({ onClose }) => {
    const contact=useSelector(selectContactDetails)
    const teams=useSelector(selectTeam)
  return (
      <MDBRow className="justify-content-center align-items-center  ">
        <MDBCol className="mb-4 mb-lg-0">
          <MDBCard className="mb-3" style={{ borderRadius: '.5rem' }}>
            <MDBRow className="g-0">
              <MDBCol md="4" className="gradient-custom text-center text-white"
                style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                    <Avatar
                        color="#6873C8"
                        className='mt-4 mb-5'
                        name={contact?.fullName}
                        initials={() => (contact?.fullName ? contact.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : '')}
                        size={"100"}
                        round
                    />

                <MDBTypography tag="h5">{contact?.fullName}</MDBTypography>
                <MDBCardText >{contact?.email}</MDBCardText>
                <Tooltip style={{marginRight:"5px"}}  title="Update" className="color_baby_bluee mt-3" >
                          <Button onClick={()=>onClose()} >
                          <Update style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>

                          <Tooltip title="Delete" className="color_blue mt-3" >
                          <Button>
                          <Delete style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>

              </MDBCol>
              <MDBCol md="8">
                <MDBCardBody className="p-4">
                  <MDBTypography className='text-center mt-1 animated-text text-shadow hover-underline text-animation' tag="h6">Messages notification Informations</MDBTypography>
                  <hr className="mt-0 mb-4" />
                  <MDBRow className="pt-1">
                    <MDBCol size="6" className="mb-3">
                      <MDBTypography tag="h6">Whatsapp</MDBTypography>
                      <MDBCardText className="text-muted">{contact?.whatsapp}</MDBCardText>
                    </MDBCol>
                    <MDBCol size="6" className="mb-3">
                      <MDBTypography tag="h6">Phone</MDBTypography>
                      <MDBCardText className="text-muted">{contact?.phone}</MDBCardText>
                    </MDBCol>
                  </MDBRow>

                  <MDBTypography className='text-center mt-4 animated-text text-shadow hover-underline text-animation'   tag="h6">Push notification Informations</MDBTypography>
                  <hr className="mt-0 mb-4" />
                  <MDBRow className="pt-1">
                    <MDBCol className="mb-3 d-flex align-items-center">
                        <MDBTypography tag="h6" className="me-2 mb-0">Public Key:</MDBTypography>
                        <MDBCardText className="text-muted mb-0">{contact?.publicKey}</MDBCardText>
                    </MDBCol>
                    </MDBRow>
                    <MDBRow className="pt-1">
                    <MDBCol className="mb-3 d-flex align-items-center">
                        <MDBTypography tag="h6" className="me-2 mb-0">EndPoint:</MDBTypography>
                        <MDBCardText className="text-muted mb-0">{contact?.Endpoint}</MDBCardText>
                    </MDBCol>
                    </MDBRow>
                    <MDBRow className="pt-1">
                    <MDBCol className="mb-3 d-flex align-items-center">
                        <MDBTypography tag="h6" className="me-2 mb-0">Auth:</MDBTypography>
                        <MDBCardText className="text-muted mb-0">{contact?.auth}</MDBCardText>
                    </MDBCol>
                    </MDBRow>
                 
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>
      </MDBRow>
)
}

export default ContactDetails