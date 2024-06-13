import React, { useState } from 'react'
import BreadcrumSection from '../../../components/BreadcrumSection/BreadcrumSection'
import { MDBBadge, MDBCard, MDBCardBody, MDBCardTitle } from 'mdb-react-ui-kit'
import "./ContactStyle.css"
import { Button } from '@mui/material'
import AddContact from '../../../components/contacts/Contact'
import { useSelector } from 'react-redux'
import { selectContact, selectTeam } from '../../../redux/state/authSlice'
import Team from '../../../components/contacts/Team'
const Contacts = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openAddContact, setOpenAddContact] = useState<boolean>(false);
  const [openAddTeam, setOpenAddTeam] = useState<boolean>(false);
  const contactsUser=useSelector(selectContact)
  const teams=useSelector(selectTeam)
  return (
    <>
        <BreadcrumSection/>
        <div className='d-flex'>
        <div className={open ? 'contact-container-open' : 'contact-container'}>
        <MDBCard className={open ? 'contact-card mb-5 me-5': 'contact-card mb-5 me-5 ms-5'}>
            <MDBCardBody>
            <Button
                onClick={()=>{setOpen(true);setOpenAddContact(true)}}
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
                {contactsUser && contactsUser.map((c, index) => (
                  
                <MDBBadge className='me-2' key={index} color='primary' pill style={{ fontSize: "0.7rem" ,cursor:"pointer"}}>
                 {c.fullName}
                </MDBBadge>
              ))}
               
            </MDBCardBody>
        </MDBCard>
        <MDBCard className='contact-card'>
        <MDBCardBody>
        <Button
                 onClick={()=>{setOpen(true);setOpenAddTeam(true)}}
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
                {teams && teams.map((c, index) => (
                  
                  <MDBBadge className='me-2' key={index} color='primary' pill style={{ fontSize: "0.7rem" ,cursor:"pointer"}}>
                   {c.name}
                  </MDBBadge>
                ))}
        </MDBCardBody>
        </MDBCard>
        </div>
        {open && (

          <MDBCard className='contact-card-details'>
          <MDBCardBody>
            {openAddContact && (
                 <AddContact onClose={()=>{setOpen(false);setOpenAddContact(false)}} />
            )}
             {openAddTeam && (
                 <Team onClose={()=>{setOpen(false);setOpenAddTeam(false)}} />
            )}
          </MDBCardBody>
          </MDBCard>
        )}
     
        </div>
    </>
  )
}

export default Contacts