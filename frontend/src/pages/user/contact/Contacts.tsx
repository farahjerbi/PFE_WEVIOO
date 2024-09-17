import{ useState } from 'react'
import BreadcrumSection from '../../../components/BreadcrumSection/BreadcrumSection'
import { MDBBadge, MDBCard, MDBCardBody } from 'mdb-react-ui-kit'
import "./ContactStyle.css"
import { Button } from '@mui/material'
import AddContact from '../../../components/contacts/Contact'
import { useDispatch, useSelector } from 'react-redux'
import { selectContact, selectTeam, setContactDetails, setTeamDetails } from '../../../redux/state/authSlice'
import Team from '../../../components/contacts/Team'
import ContactDetails from '../../../components/contacts/ContactDetails'
import TeamDetails from '../../../components/contacts/TeamDetails'
import UpdateCnct from '../../../components/contacts/UpdateCnct'
import UpdateTeam from '../../../components/contacts/UpdateTeam'
import AddContacts from '../../../components/modals/contacts/AddContacts'
import { toast } from 'sonner'
const Contacts = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [openAddContacts, setOpenAddContacts] = useState<boolean>(false);
  const [openAddContact, setOpenAddContact] = useState<boolean>(false);
  const [openAddTeam, setOpenAddTeam] = useState<boolean>(false);
  const [openContactDetails, setOpenContactDetails] = useState<boolean>(false);
  const [openTeamDetails, setOpenTeamDetails] = useState<boolean>(false);
  const [openUpdateContact, setOpenUpdateContact] = useState<boolean>(false);
  const [openUpdateTeam, setOpenUpdateTeam] = useState<boolean>(false);
  const contactsUser=useSelector(selectContact)
  const teams=useSelector(selectTeam)
  const dispatch=useDispatch()


  const handleTeamDetailsUpdate = () => {
    setOpenTeamDetails(false);
    setOpenAddContact(false)
    setOpenContactDetails(false)
    setOpenUpdateContact(false)
    setOpenAddTeam(false)
    setOpenUpdateTeam(true)
  };

  const handleContactDetailsUpdate = () => {
    setOpenTeamDetails(false);
    setOpenAddContact(false)
    setOpenContactDetails(false)
    setOpenUpdateContact(false)
    setOpenAddTeam(false)
    setOpenUpdateTeam(false)
    setOpenUpdateContact(true)
  };

  const closeEverything=()=>{
    setOpen(false);
    setOpenAddTeam(false);
    setOpenContactDetails(false);
    setOpenTeamDetails(false)
    setOpenUpdateContact(false)
    setOpenUpdateTeam(false)
    dispatch(setContactDetails(null));
    dispatch(setTeamDetails(null))
    setOpenAddContact(false)
  }
  return (
    <>
        <BreadcrumSection/>
        <div className='d-flex'>
        <div className={open ? 'contact-container-open' : 'contact-container'}>
        <MDBCard className={open ? 'contact-card mb-5 me-5': 'contact-card mb-5 me-5 ms-5'}>
            <MDBCardBody>
              <div className='d-flex'>
              <Button
                onClick={()=>{
                  setOpenAddTeam(false);
                  setOpenContactDetails(false);
                  setOpenTeamDetails(false)
                  setOpenUpdateContact(false)
                  setOpenUpdateTeam(false)
                  dispatch(setContactDetails(null));
                  setOpen(true);
                  setOpenAddContact(true);}}
                className='mb-4 me-4'
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
                <Button
                onClick={()=>setOpenAddContacts(true)}
                className='mb-4'
                component="label"
                role={undefined}
                variant="contained"
                tabIndex={-1}
                color='inherit'
                style={{ display: 'flex', alignItems: 'center', gap: '3px' ,width:"40%"}} 
                >
                <img alt='img' src='../../../assets/office365.png' style={{ width: "19%" }} />
                <span>Upload Excel</span>
                </Button>
              </div>
          

                {contactsUser && contactsUser.map((c, index) => (
                  
                <MDBBadge onClick={()=>{{
                  dispatch(setContactDetails(c));
                  setOpenTeamDetails(false)
                  setOpenUpdateTeam(false)
                  setOpenUpdateContact(false)
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
                 onClick={()=>{
                  if(contactsUser && contactsUser?.length>0){
                    setOpenAddContact(false);
                    setOpenContactDetails(false);
                    setOpenUpdateContact(false)
                    setOpenUpdateTeam(false)
                    setOpenTeamDetails(false)
                    dispatch(setTeamDetails(null));
                    setOpen(true);
                    setOpenAddTeam(true);
                  }else{
                    toast.warning("Before you create a team you should add contacts.")
                  }
                 
                }}
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
                  onClick={()=>{{dispatch(
                    setTeamDetails(c));
                    setOpenContactDetails(false)
                    setOpenAddContact(false);
                    setOpenUpdateContact(false)
                    setOpenAddTeam(false);
                    setOpenUpdateTeam(false)
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
                  <AddContact onClose={closeEverything} />
              )}
              {openAddTeam && (
                  <Team onClose={closeEverything} />
              )}
              {openContactDetails && (
                <ContactDetails  onClose={handleContactDetailsUpdate} onCloseEverything={closeEverything}/>
              )}
              {openTeamDetails && (
                  <TeamDetails onClose={handleTeamDetailsUpdate} onCloseEverything={closeEverything} />
                )}
                    {openUpdateContact && (
                  <UpdateCnct onClose={closeEverything}  />
                )}
                  {openUpdateTeam && (
                  <UpdateTeam onClose={closeEverything}  />
                )}
            </MDBCardBody>
          </MDBCard>
        )}
     
        </div>
        {openAddContacts && (
                  <AddContacts onClose={()=>setOpenAddContacts(false)} show={openAddContacts} />
              )}
    </>
  )
}

export default Contacts