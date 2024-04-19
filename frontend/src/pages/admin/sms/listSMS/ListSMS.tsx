import  { useState } from 'react'
import "./ListSMS.css"
import { Button } from '@mui/material'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import MarkUnreadChatAlt from "@mui/icons-material/MarkUnreadChatAlt";
import { MDBCol, MDBIcon} from 'mdb-react-ui-kit';
import { selectSMSs, selectWhatsapp } from '../../../../redux/state/smsSlice';
import { useSelector } from 'react-redux';
import { selectRole, selectUser } from '../../../../redux/state/authSlice';
import { Role } from '../../../../models/user/Role';
import { useNavigate } from 'react-router-dom';
import SMSCard from '../../../../components/list-sms/SMSCard';
import WhatsAppCard from '../../../../components/list-whatsapp/WhatsAppCard';
import { ADD_SMS_TEMPLATE } from '../../../../routes/paths';

const ListSMS = () => {
    const[isSMS,setIsSMS]=useState<boolean>(true)
    const templates = useSelector(selectSMSs);
    const templatesWhatsapp = useSelector(selectWhatsapp);
    
    const role = useSelector(selectRole);
    const user=useSelector(selectUser)
    const navigate = useNavigate();
   
  return (
    <>
      <BreadcrumSection/>
            <div className='container-sms'>
                <div className="buttons d-flex mt-5 me-5">
                    <Button onClick={()=>setIsSMS(true)} fullWidth className={isSMS ? 'me-3 baby-bluee':'me-3'} >
                        <MarkUnreadChatAlt className='me-2'/>SMS</Button>
                    <Button onClick={()=>setIsSMS(false)} fullWidth className={!isSMS ? 'me-3 baby-bluee':'me-3'}> 
                    <MDBIcon fab icon="whatsapp-square" className='me-2' style={{fontSize:"1.5rem"}} /> WHATSAPP</Button>
                    {role===Role.ADMIN && (  <Button onClick={()=>navigate(ADD_SMS_TEMPLATE)} style={{width:"20%"}} size="small" className="mb-2" >
                      <img  src="../../../assets/add.png" alt="" style={{width:"25%",marginRight:"3%"}} />Create
                      </Button>)}
                </div>
            </div>

            <MDBCol
                md="10"
                className="ms-5 mt-5 mb-4 d-flex align-items-center"
                >
        {isSMS && (
          <div style={{marginLeft:"30%"}}><SMSCard templates={templates} user={user} role={role} /></div>
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