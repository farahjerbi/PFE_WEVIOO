import ModalDialog from '@mui/joy/ModalDialog';
import { DialogContent, DialogTitle, Modal } from '@mui/material';
import { MDBBtn, MDBInput } from 'mdb-react-ui-kit';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { useForgotPasswordMutation } from '../../redux/services/authApi';

interface Props{
    onClose: () => void;
    show:boolean;
}
const ForgetPasswordModal : React.FC<Props> = ({ onClose ,show }) => {
    const [open,setOpen]=useState<boolean>(show);
    const [emailForgotten,setEmailForgotten]=useState<string>("");
    const[forgotPassword]=useForgotPasswordMutation()
    useEffect(() => {
        setOpen(show); 
      }, [show]);
    
    const toggleOpen = () =>{
        onClose();
        setOpen(false);
      } 

    
  const forgotPasswordEmail = async () => {
    if(!emailForgotten){
      toast.error("Enter Email please");
      return
    }
    if (!/\S+@\S+\.\S+/.test(emailForgotten)){
      toast.error("Email format incorrect");
      return
    }
    try {
        setEmailForgotten("")
        await forgotPassword({email:emailForgotten});
        setOpen(!open)
        toast.success("Check your email to reset your password !");
    } catch (error) {
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);
    }
  };
  return (

    <Modal open={open} onClose={() => setOpen(false)}>
    <ModalDialog>
          <DialogTitle>Forgotten Password</DialogTitle>
        <DialogContent>
        <img src="../../../assets/fg.png" alt="" style={{width:"60%",marginLeft:"20%"}} />
          <MDBInput 
          label='Please Enter your email'
          name="email"
          type='email'
          value={emailForgotten}
          onChange={(e) => setEmailForgotten(e.target.value)}
          required />
        </DialogContent>
       
          <MDBBtn color='secondary' onClick={toggleOpen}>
            Close
          </MDBBtn>
        <MDBBtn color='info' onClick={()=>forgotPasswordEmail()}> Send Email ! </MDBBtn> 
    </ModalDialog>
  </Modal>  
    )
}

export default ForgetPasswordModal