import  { useEffect, useState } from 'react'
import "./ListSMS.css"
import { Button } from '@mui/material'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import MarkUnreadChatAlt from "@mui/icons-material/MarkUnreadChatAlt";
import { MDBCol, MDBIcon} from 'mdb-react-ui-kit';
import { getTemplatesSms, getTemplatesWhatsapp, selectSMSs, selectWhatsapp } from '../../../../redux/state/smsSlice';
import { useDispatch, useSelector } from "react-redux";
import { selectRole, selectUser } from '../../../../redux/state/authSlice';
import SMSCard from '../../../../components/list-sms/SMSCard';
import WhatsAppCard from '../../../../components/list-whatsapp/WhatsAppCard';
import { AppDispatch } from '../../../../redux/store';

const ListSMS = () => {
  const dispatchApp: AppDispatch = useDispatch(); 
  useEffect(() => {
    dispatchApp(getTemplatesSms())
    dispatchApp(getTemplatesWhatsapp())
     }, []);
    const[isSMS,setIsSMS]=useState<boolean>(true)
    const templates = useSelector(selectSMSs);
    const templatesWhatsapp = useSelector(selectWhatsapp);
    
    const role = useSelector(selectRole);
    const user=useSelector(selectUser)
  
  
   
  return (
    <>
      <BreadcrumSection/>
            <div className='container-sms'>
                <div className="buttons d-flex mt-5 me-5">
                    <Button onClick={()=>setIsSMS(true)} fullWidth className={isSMS ? 'me-3 baby-bluee':'me-3'} >
                        <MarkUnreadChatAlt className='me-2'/>SMS</Button>
                    <Button onClick={()=>setIsSMS(false)} fullWidth className={!isSMS ? 'me-3 baby-bluee':'me-3'}> 
                    <MDBIcon fab icon="whatsapp-square" className='me-2' style={{fontSize:"1.5rem"}} /> WHATSAPP</Button>
                </div>
            </div>

            <MDBCol
                md="10"
                className="ms-5 mt-5 mb-4 d-flex align-items-center"
                >
        {isSMS && (
          <div style={{marginLeft:"21%"}}><SMSCard templates={templates} user={user} role={role} /></div>
        )}
        {!isSMS && templatesWhatsapp && ( 
          <div style={{marginLeft:"21%"}}>
             <WhatsAppCard templates={templatesWhatsapp} user={user} role={role} />
          </div>
        )}

        </MDBCol>

    </>
    
  )
}

export default ListSMS