import React, { useState } from 'react'
import BreadcrumSection from '../../../components/BreadcrumSection/BreadcrumSection'
import { MDBBadge, MDBCard, MDBCardBody, MDBCardTitle } from 'mdb-react-ui-kit'
import "./ContactStyle.css"
import { Button } from '@mui/material'
import AddContact from '../../../components/contacts/Contact'
import { useDispatch, useSelector } from 'react-redux'
import { selectContact, selectContactDetails, selectTeam, setContactDetails, setTeamDetails } from '../../../redux/state/authSlice'
import Team from '../../../components/contacts/Team'
import ContactDetails from '../../../components/contacts/ContactDetails'
import TeamDetails from '../../../components/contacts/TeamDetails'
const Contacts = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openAddContact, setOpenAddContact] = useState<boolean>(false);
  const [openAddTeam, setOpenAddTeam] = useState<boolean>(false);
  const [openContactDetails, setOpenContactDetails] = useState<boolean>(false);
  const [openTeamDetails, setOpenTeamDetails] = useState<boolean>(false);
  const contactsUser=useSelector(selectContact)
  const teams=useSelector(selectTeam)
  const dispatch=useDispatch()
  const handleTeamDetailsClose = () => {
    setOpenTeamDetails(false);
    setOpenAddContact(false)
    setOpenContactDetails(false)
    setOpenAddTeam(true)
  };
  const handleContactDetailsClose = () => {
    setOpenTeamDetails(false);
    setOpenContactDetails(false)
    setOpenAddTeam(false)
    setOpenAddContact(true)

  };
  return (
    <>
        <BreadcrumSection/>
        <div className='d-flex'>
        <div className={open ? 'contact-container-open' : 'contact-container'}>
        <MDBCard className={open ? 'contact-card mb-5 me-5': 'contact-card mb-5 me-5 ms-5'}>
            <MDBCardBody>
            <Button
                onClick={()=>{setOpenAddTeam(false);setOpenContactDetails(false);setOpenTeamDetails(false)
                  dispatch(setContactDetails(null));setOpen(true);setOpenAddContact(true);}}
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
                  
                <MDBBadge onClick={()=>{{dispatch(setContactDetails(c));
                  setOpenTeamDetails(false)
                  setOpenAddContact(false);
                  setOpenAddTeam(false);
                  setOpen(true);
                  setOpenContactDetails(true);
                } }} 
                className='me-2' key={index} color='primary'
                 pill style={{ fontSize: "0.7rem" ,cursor:"pointer"}}>
                 {c.fullName}
                </MDBBadge>
              ))}
               
            </MDBCardBody>
        </MDBCard>
        <MDBCard className='contact-card'>
        <MDBCardBody>
        <Button
                 onClick={()=>{setOpenAddContact(false);setOpenContactDetails(false);setOpenTeamDetails(false)
                  dispatch(setTeamDetails(null));setOpen(true);setOpenAddTeam(true);}}
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
                  
                  <MDBBadge
                  onClick={()=>{{dispatch(setTeamDetails(c));
                    setOpenContactDetails(false)
                    setOpenAddContact(false);
                    setOpenAddTeam(false);
                    setOpen(true);
                    setOpenTeamDetails(true);} }} 
                  className='me-2' key={index} color='primary' pill style={{ fontSize: "0.7rem" ,cursor:"pointer"}}>
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
            {openContactDetails && (
              <ContactDetails  onClose={handleContactDetailsClose}/>
            )}
            {openTeamDetails && (
                <TeamDetails onClose={handleTeamDetailsClose} />
              )}
          </MDBCardBody>
          </MDBCard>
        )}
     
        </div>
    </>
  )
}

export default Contacts