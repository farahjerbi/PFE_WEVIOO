import React, { useState } from 'react'
import { MDBCol, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBTypography } from 'mdb-react-ui-kit';
import './ContactDetails.css'
import { useSelector } from 'react-redux';
import { selectContactDetails } from '../../redux/state/authSlice';
import Avatar from 'react-avatar';
import { Button, Tooltip } from '@mui/material';
import Update from '@mui/icons-material/Update';
import Delete from '@mui/icons-material/Delete';
import DeleteContact from '../modals/delete/DeleteContact';
import { truncateText } from '../../routes/Functions';
interface ContactDetailsProps {
  onClose: () => void;
  onCloseEverything: () => void;
}
const ContactDetails: React.FC<ContactDetailsProps> = ({ onClose,onCloseEverything }) => {
    const contact=useSelector(selectContactDetails)
    const [openDelete,setOpenDelete]=useState<boolean>(false);

  return (
      <MDBRow className="justify-content-center align-items-center  ">
        <MDBCol className="mb-4 mb-lg-0">
            <MDBRow className="g-0">
              <MDBCol md="4" className="gradient-custom text-center text-white"
                style={{ borderTopLeftRadius: '.5rem', borderBottomLeftRadius: '.5rem' }}>
                    <Avatar
                        color="rgb(39, 26, 182) "
                        className='mt-5 mb-5'
                        name={contact?.fullName}
                        initials={() => (contact?.fullName ? contact.fullName.split(' ').map(n => n[0]).join('').toUpperCase() : '')}
                        size={"100"}
                        round
                    />

                <MDBTypography tag="h5" className='mt-2'>{contact?.fullName}</MDBTypography>
                <MDBCardText >{contact?.email}</MDBCardText>

              </MDBCol>
              <MDBCol md="8">
                <MDBCardBody className="p-4">
                  <MDBTypography className='text-center animated-text text-shadow hover-underline text-animation' tag="h6">Messages notification Informations</MDBTypography>
                  <hr className="mt-0 mb-4" />
                  <MDBRow className="pt-1">
                    <MDBCol size="6" className="mb-3 ">
                      <MDBTypography tag="h6">Whatsapp</MDBTypography>
                      <MDBCardText className="text-muted">{contact?.whatsapp}</MDBCardText>
                    </MDBCol>
                    <MDBCol size="6" className="mb-3">
                      <MDBTypography tag="h6">Phone</MDBTypography>
                      <MDBCardText className="text-muted">{contact?.phone}</MDBCardText>
                    </MDBCol>
                  </MDBRow>

                  <MDBTypography className='text-center mt-2 animated-text text-shadow hover-underline text-animation ' tag="h6">Push notification Informations</MDBTypography>
                  <hr className="mt-0 mb-4" />
                  <MDBRow className="pt-1 ">
                  <MDBCol className="mb-3 d-flex align-items-center">
                <MDBTypography  tag="h6" className="me-2 mb-0">
                    PublicKey:
                </MDBTypography>
                <MDBCardText className="text-muted mb-0">
                    {truncateText(contact?.publicKey, 25)}
                </MDBCardText>
            </MDBCol> 
                    </MDBRow>
                    <MDBRow className="pt-1">
                    <MDBCol className="mb-3 d-flex align-items-center">
                        <MDBTypography tag="h6" className="me-2 mb-0">EndPoint:</MDBTypography>
                        <MDBCardText className="text-muted mb-0">
                        {truncateText(contact?.endPoint, 30)}</MDBCardText>
                    </MDBCol>
                    </MDBRow>
                    <MDBRow className="pt-1">
                    <MDBCol className="mb-3 d-flex align-items-center">
                        <MDBTypography tag="h6" className="me-2 mb-0">Auth:</MDBTypography>
                        <MDBCardText className="text-muted mb-0">{truncateText(contact?.auth, 30)}</MDBCardText>
                    </MDBCol>
                    </MDBRow>
            
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
        </MDBCol>
        <Tooltip style={{marginRight:"5px"}}  title="Update" className="color_baby_bluee mt-3" >
                          <Button onClick={()=>onClose()} >
                          <Update style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>

                          <Tooltip title="Delete" className="color_blue mt-3" >
                          <Button  onClick={()=>{setOpenDelete(true)}}>
                          <Delete style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>
        <DeleteContact isMember={true} onClose={()=>{setOpenDelete(false);onCloseEverything()}} show={openDelete} />
      </MDBRow>
)
}

export default ContactDetails