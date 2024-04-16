import { MDBBtn} from 'mdb-react-ui-kit'
import React, {  useState } from 'react'

import {  DialogContent, DialogTitle, Modal } from '@mui/material';
import ModalDialog from '@mui/joy/ModalDialog';
import './Instructions.css'
import Info from "@mui/icons-material/Info";
export interface ModalUserProps {
    onClose: () => void;
    show:boolean;
  }

const InstructionsUserModal : React.FC<ModalUserProps> = ({ onClose ,show }) => {
    const [open,setOpen]=useState<boolean>(show);
    const toggleOpen = () =>{
        onClose();
        setOpen(false);
      } 
  return (
    <Modal open={open} onClose={() => setOpen(false)}  >
    <ModalDialog minWidth={500} style={{height:"690px",overflow: 'auto'}}>
      <DialogTitle>
        <Info color='info' className='me-2'/>
        Instructions
        <Info color='info' className='ms-2'/>
        </DialogTitle>
      <DialogContent>
      <h6 >Before sending emails, it's essential to complete two steps in your profile settings. </h6>
        <div className='d-flex mb-4 mt-5'> 
            <img src="../../../assets/profileInfo.png" alt="" style={{height:"400px"}}/>
            <p><img src="../../../assets/step-1.png" alt="" style={{width:"18%"}} />
                <p>To enable sending, utilize an app password and activate 2-step verification on your account like Google then add the password in the email secret located in your profile.</p>
                <img src="../../../assets/step-2.png" alt="" style={{width:"22%"}} />
                <p>
                consider adding your personal electronic signature to your profile. This signature adds a professional touch to your emails and can be easily inserted whenever you need it, enhancing your email communication.</p>
                </p>
        </div>
        <div className='d-flex mt-5'>
         <p className='mt-5'>
         Indeed, you have the flexibility to either send your email separately to individual recipients or send the same email in bulk to multiple recipients. Sending emails individually allows for personalized communication tailored to each recipient, while sending in bulk is efficient for reaching a large audience with the same message. Choose the method that best fits your needs and the nature of your communication.
             </p>     
             <img src="../../../assets/sendType.png" alt="" style={{height:"120px",width:"300px" , marginTop:"10%"}}/>   
      </div>
           </DialogContent>
      <div className='d-felx'>
      <MDBBtn className='w-40 ms-1 me-4' color='secondary' onClick={toggleOpen}>
        skip
      </MDBBtn>
      </div> 
    </ModalDialog>
  </Modal>   )
}

export default InstructionsUserModal