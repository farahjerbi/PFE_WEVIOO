import  { useEffect, useState } from 'react'
import './Scheduled.css'
import Calendar from '../admin/Email/calendar/Calendar'
import { useSelector } from 'react-redux'
import { selectRole, selectUser } from '../../redux/state/authSlice'
import { useDeleteScheduledEmailMutation, useGetScheduledEmailsByUserMutation } from '../../redux/services/emailApi'
import { toast } from 'sonner'
import BreadcrumSection from '../../components/BreadcrumSection/BreadcrumSection'
import { useGetScheduledWhatsappMutation } from '../../redux/services/whatsAppApi'
import { useGetScheduledSMSMutation } from '../../redux/services/smsApi'
import { ScheduledEmailResponse } from '../../models/email/ScheduledEmailRespose'
import ListScheduledEmails from '../../components/LlistScheduled/ListScheduledEmails'
import ListScheduled from '../../components/LlistScheduled/ListScheduled'
import { MDBContainer } from 'mdb-react-ui-kit'
import { Button } from '@mui/material'
import { ScheduledSMSResponse } from '../../models/sms/ScheduledSMSResponse'
import { Role } from '../../models/user/Role'
const Scheduled = () => {
    //PAGINATION
    const[emails,setEmails]=useState<ScheduledEmailResponse[]>();
    const[sms,setSMS]=useState<ScheduledSMSResponse[]>();
    const[whatsapp,setWhatsapp]=useState<ScheduledSMSResponse[]>();
    const[query,setQuery]=useState<string>("email")

    //END PAGINATION
    const role = useSelector(selectRole);
    const user = useSelector(selectUser);
    const [basicModal, setBasicModal] = useState<boolean>(false);
    const toggleOpen = () => setBasicModal(!basicModal);
    const[deleteScheduledEmail]=useDeleteScheduledEmailMutation()
    const[getScheduledEmailsByUser]=useGetScheduledEmailsByUserMutation()
    const[getScheduledSMS]=useGetScheduledSMSMutation()
    const[getScheduledWhatsapp]=useGetScheduledWhatsappMutation()
    const [idDelete, setIdDelete] = useState<number>();

    useEffect(() => {
      fetchDataUserEmail();
      fetchDataUserSMS();
      fetchDataUserWhatsapp();
     }, []);
    
    const fetchDataUserEmail = async () => {
        if(user){
          try {
            const response = await getScheduledEmailsByUser(user.id).unwrap();
            setEmails(response)
          } catch (error) {
            toast.error("Error! Yikes");
            console.error("🚀 ~ error:", error);
          }
        }
      };

      const fetchDataUserSMS = async () => {
        if(user){
          try {
            const response = await getScheduledSMS(user.id).unwrap();
            setSMS(response)
            console.log("🚀 ~ fetchData ~ response SMS:", response);
          } catch (error) {
            toast.error("Error! Yikes");
            console.error("🚀 ~ error:", error);
          }
        }
      };
      const fetchDataUserWhatsapp = async () => {
        if(user){
          try {
            const response = await getScheduledWhatsapp(user.id).unwrap();
            setWhatsapp(response)
          } catch (error) {
            toast.error("Error! Yikes");
            console.error("🚀 ~ error:", error);
          }
        }
      };

  return (
  <>
  <BreadcrumSection/>
    <div style={{width:"80%" , marginTop:"7%",marginLeft:"10%"}}>
    {emails && sms && whatsapp && (
        <Calendar  emails={emails} sms={sms} whatsapp={whatsapp}/>
    )}
    </div>
    {role===Role.USER && (
         <div>
         <MDBContainer className="mt-5 ms-5 mb-4 d-flex"   >              
                   <Button  onClick={()=>setQuery("email")} size="small"  >
                   <img src="../../../assets/users-search.png" alt="" style={{width:"5%",borderRadius:"9px",marginRight:"2%"}}/>
                       Scheduled Emails
                   </Button>      
                   <Button  onClick={()=>setQuery("sms")} size="small"  >
                   <img  src="../../../assets/add-friend.png" alt="" style={{width:"5%",marginRight:"2%"}}  /> Scheduled SMS
                   </Button>
                   <Button onClick={()=>setQuery("whatsapp")} size="small"  >
                   <img  src="../../../assets/unfollow.png" alt="" style={{width:"5%"}} /> Scheduled Whatsapp
                   </Button>
                  
     
               </MDBContainer>
               <div style={{marginLeft:"14%"}}>
                     {emails && query==="email" &&(
                     <ListScheduledEmails emails={emails}/>
     
                 )}
                 {sms && query==="sms" &&(
                   <ListScheduled type={"sms"} sms={sms}/>
                 )}
               {whatsapp && query==="whatsapp" &&(
                       <ListScheduled type={"whatsapp"} sms={whatsapp}/>
                     )}
        
               </div>
         
         </div>

    )}
 
  
  
   
  
  </>
  )
}

export default Scheduled