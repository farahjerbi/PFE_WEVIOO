import { MDBBtn} from 'mdb-react-ui-kit'
import React, {  useState } from 'react'

import {  DialogContent, DialogTitle, Modal } from '@mui/material';
import ModalDialog from '@mui/joy/ModalDialog';
import './Instructions.css'
import Info from "@mui/icons-material/Info";

export interface ModalProps {
    onClose: () => void;
    show:boolean;
  }


const InstructionsModal: React.FC<ModalProps> = ({ onClose ,show }) => {
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
        <h6 >By utilizing these special tags and dynamic inputs, you can create versatile and customizable email templates that cater to the individual needs and preferences of your users, enhancing the effectiveness and personalization of your email communication.</h6>
        <div className='d-flex mb-4 mt-5'> 
            <img src="../../../assets/instruction1.gif" alt="" style={{height:"300px"}}/>
            <p>When creating Email Templates, you have the flexibility to include special tags like <b>@username</b>, <b>@email</b>,<b>@firstname</b> , and <b>@lastname</b>. 
            These tags act as placeholders that will be dynamically replaced with actual user information when the email is sent. 
            For example, if you include @username in your template, it will be replaced with the recipient's username when the email is generated.
             Similarly, @email, @firstname, and @lastname will be replaced with the recipient's email address, first name, and last name respectively.</p>
        </div>
        <div className='d-flex mt-5'>
         <p className='mt-5'>
        Additionally, anything enclosed within double curly braces <code>{`{{}}`}</code> is considered a dynamic input. This means that the content inside these braces will change based on the preferences or specific details provided by the user when they use the template. For instance, if you include <code>{`{{ product_name }}`}</code> in your template, the actual product name will be inserted into the email when it is sent, allowing for personalized and tailored communication with the recipients.
             </p>     
             <img src="../../../assets/instruction2.png" alt="" style={{height:"300px",width:"300px"}}/>   
      </div>
           </DialogContent>
      <div className='d-felx'>
      <MDBBtn className='w-40 ms-1 me-4' color='secondary' onClick={toggleOpen}>
        skip
      </MDBBtn>
      </div> 
    </ModalDialog>
  </Modal>  )
}

export default InstructionsModal