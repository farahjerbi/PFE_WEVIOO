import React, { useState } from 'react'
import BreadcrumSection from '../../../components/BreadcrumSection/BreadcrumSection'
import { MDBCard, MDBCardBody, MDBCardTitle } from 'mdb-react-ui-kit'
import "./ContactStyle.css"
import { Button } from '@mui/material'
import AddContact from '../../../components/contacts/AddContact'
const Contact = () => {
  const [open, setOpen] = useState<boolean>(true);
  const [openAddContact, setOpenAddContact] = useState<boolean>(true);
  const [openAddTeam, setOpenAddTeam] = useState<boolean>(true);
  return (
    <>
        <BreadcrumSection/>
        <div className='d-flex'>
        <div className={open ? 'contact-container-open' : 'contact-container'}>
        <MDBCard className={open ? 'contact-card mb-5 me-5': 'contact-card mb-5 me-5 ms-5'}>
            <MDBCardBody>
            <Button
                className='mb-4'
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                color='inherit'
                style={{ display: 'flex', alignItems: 'center', gap: '3px' ,width:"40%"}} 
                >
                <img alt='img' src='../../../assets/add-contact.png' style={{ width: "19%" }} />
                <span>Add Contact</span>
                </Button>

            </MDBCardBody>
        </MDBCard>
        <MDBCard className='contact-card'>
        <MDBCardBody>
        <Button
                className='mb-4'
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                color='inherit'
                style={{ display: 'flex', alignItems: 'center', gap: '3px' ,width:"40%"}} 
                >
                <img alt='img' src='../../../assets/people.png' style={{ width: "20%" }} />
                <span>Add Group</span>
                </Button>
        </MDBCardBody>
        </MDBCard>
        </div>
        {open && (
          <MDBCard className='contact-card-details'>
          <MDBCardBody>
            <AddContact />
          </MDBCardBody>
          </MDBCard>
        )}
     
        </div>
    </>
  )
}

export default Contact