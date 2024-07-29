import  { useEffect, useState } from 'react'
import './Scheduled.css'
import Calendar from '../admin/Email/calendar/Calendar'
import { useSelector } from 'react-redux'
import { selectRole, selectUser } from '../../redux/state/authSlice'
import {  useGetScheduledEmailsByUserMutation } from '../../redux/services/emailApi'
import BreadcrumSection from '../../components/BreadcrumSection/BreadcrumSection'
import { useGetScheduledWhatsappMutation } from '../../redux/services/whatsAppApi'
import { useGetScheduledSMSMutation } from '../../redux/services/smsApi'
import { ScheduledEmailResponse } from '../../models/email/ScheduledEmailRespose'
import ListScheduledEmails from '../../components/LlistScheduled/ListScheduledEmails'
import ListScheduled from '../../components/LlistScheduled/ListScheduled'
import { MDBContainer, MDBIcon } from 'mdb-react-ui-kit'
import { Button } from '@mui/material'
import { ScheduledSMSResponse } from '../../models/sms/ScheduledSMSResponse'
import { Role } from '../../models/user/Role'
import { useGetScheduledPushsByUserMutation } from '../../redux/services/pushApi'
import { NotificationType } from '../../models/NotificationType'
import ListScheduledPush from '../../components/LlistScheduled/ListScheduledPush'
import { ScheduledPushInfo } from '../../models/push/ScheduledPushInfo'
import CalendarMonth from '@mui/icons-material/CalendarMonth'
import SettingsSuggest from '@mui/icons-material/SettingsSuggest'

const Scheduled = () => {
    //PAGINATION
    const[emails,setEmails]=useState<ScheduledEmailResponse[]>();
    const[sms,setSMS]=useState<ScheduledSMSResponse[]>();
    const[whatsapp,setWhatsapp]=useState<ScheduledSMSResponse[]>();
    const[push,setPush]=useState<ScheduledPushInfo[]>();
    const[query,setQuery]=useState<string>("email")
    const[queryT,setQueryT]=useState<boolean>(true)

    //END PAGINATION
    const role = useSelector(selectRole);
    const user = useSelector(selectUser);
    const[getScheduledEmailsByUser]=useGetScheduledEmailsByUserMutation()
    const[getScheduledSMS]=useGetScheduledSMSMutation()
    const[getScheduledWhatsapp]=useGetScheduledWhatsappMutation()
    const[getScheduledPushsByUser]=useGetScheduledPushsByUserMutation()

    useEffect(() => {
      fetchDataUserEmail();
      fetchDataUserSMS();
      fetchDataUserWhatsapp();
      fetchDataUserPush();
     }, []);
    
    const fetchDataUserEmail = async () => {
        if(user){
          try {
            const response = await getScheduledEmailsByUser(user.id).unwrap();
            setEmails(response)
          } catch (error) {
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
            console.error("🚀 ~ error:", error);
          }
        }
      };

      const fetchDataUserPush= async () => {
        if(user){
          try {
            const response = await getScheduledPushsByUser(user.id).unwrap();
            setPush(response)
          } catch (error) {
            console.error("🚀 ~ error:", error);
          }
        }
      };

  return (
  <>
  <BreadcrumSection/>
  {
    role===Role.USER && (
      <div className='container-s'>
      <div className="buttons d-flex mt-5 me-5 ">
          <Button onClick={()=>setQueryT(true)} fullWidth className={queryT ? 'me-3 baby-bluee':'me-3'} >
              <CalendarMonth className='me-2'/>Calendar</Button>
          <Button onClick={()=>setQueryT(false)} fullWidth className={!queryT ? 'me-3 baby-bluee':'me-3'}> 
          <SettingsSuggest className='me-2'  /> More Details</Button>
      </div>
  </div>
    )
  }


  <div style={{ width: "80%", marginTop: role === Role.USER ? "2%" : "10%", marginLeft: "10%" }}>
    {
      queryT && 
        <Calendar  emails={emails} sms={sms} whatsapp={whatsapp} push={push}/>
      
    }
    </div>
    {role===Role.USER && !queryT && (
         <div className='ms-5'>
         <MDBContainer className="mt-5 ms-5 mb-4 d-flex"   >              
                   <Button onClick={()=>setQuery("email")} size="small" className={query==="email" ? 'baby-bluee':''}  >
                   <img src="../../../assets/mail-calendar.png" alt="" style={{width:"10%",borderRadius:"9px",marginRight:"2%"}}/>
                       Scheduled Emails
                   </Button>      
                   <Button  onClick={()=>setQuery("sms")} size="small" className={query===NotificationType.SMS ? 'baby-bluee':''}  >
                   <img  src="../../../assets/sms-calendar.png" alt="" style={{width:"10%",marginRight:"2%"}}  /> Scheduled SMS
                   </Button>
                   <Button onClick={()=>setQuery("whatsapp")} size="small" className={query===NotificationType.WHATSAPP? 'baby-bluee':''}  >
                   <img  src="../../../assets/whatsapp-calendar.png" alt="" style={{width:"10%",marginRight:"2%"}} /> Scheduled Whatsapp
                   </Button>
                   <Button onClick={()=>setQuery("push")} size="small" className={query===NotificationType.PUSH ? 'baby-bluee':''} >
                   <img  src="../../../assets/push-calendar.png" alt="" style={{width:"10%",marginRight:"2%"}} /> Scheduled Push
                   </Button>
                  
     
               </MDBContainer>
                <div className='ms-5' >
                     {emails && query==="email" &&(
                      <div className='ms-5'>
                           <ListScheduledEmails emails={emails}/>
                      </div>
     
                 )}
                 {sms && query===NotificationType.SMS &&(
                  <div style={{marginLeft:"15%"}}>
                       <ListScheduled type={NotificationType.SMS} sms={sms}/>

                  </div>
                 )}
               {whatsapp && query===NotificationType.WHATSAPP &&(
                <div style={{marginLeft:"15%"}}>
                     <ListScheduled type={NotificationType.WHATSAPP} sms={whatsapp}/>

                </div>
                     )}
        
        {push && query===NotificationType.PUSH &&(
          <div style={{marginLeft:"18.8%"}}>
             <ListScheduledPush push={push} />
          </div>
                     )}
               </div>
               
               
         
         </div>

    )}
 
  
  
   
  
  </>
  )
}

export default Scheduled