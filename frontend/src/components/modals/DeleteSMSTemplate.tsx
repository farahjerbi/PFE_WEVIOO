import React, { useEffect, useState } from 'react'
import {  DeleteTemplateSMSModalProps } from '../../models/DeleteModels'
import { useDeleteSMSTemplateMutation } from '../../redux/services/smsApi';
import { useDispatch } from 'react-redux';
import { setDeleteSms, setDeleteWhatsapp } from '../../redux/state/smsSlice';
import { toast } from 'sonner';
import { Button, DialogContent, DialogTitle, Modal } from '@mui/material';
import ModalDialog from '@mui/joy/ModalDialog';
import { MDBBtn } from 'mdb-react-ui-kit';
import { useDeleteWhatsappTemplateMutation } from '../../redux/services/whatsAppApi';

const DeleteSMSTemplate: React.FC<DeleteTemplateSMSModalProps> = ({ id , onClose ,show }) => {
  useEffect(() => {
    setOpen(show);
}, [show]);

    const [deleteSMSTemplate] = useDeleteSMSTemplateMutation();
    const [deleteWhatsappTemplate] = useDeleteWhatsappTemplateMutation();

    const [open,setOpen]=useState<boolean>(show);
    function isString(value: any): value is string {
        return typeof value === 'string';
    }
    const dispatch=useDispatch();
  

    const deleteT= async (id:number|string) => {
        try {
            if(!isString(id)){
                await deleteSMSTemplate(id);
                dispatch(setDeleteSms(id))
            }else if(isString(id)){
                await deleteWhatsappTemplate(id);
                dispatch(setDeleteWhatsapp(id))
            }
   
          toast.success("Template Deleted Successfully !");
          onClose();
        } catch (error) {
          toast.error("Error! Yikes");
          console.error("🚀 ~ error:", error);
        }
      };
      const toggleOpen = () =>{
        onClose();
        setOpen(false);
      } 
  
  return (
    <div>
    <Modal open={open} onClose={toggleOpen}>
   <ModalDialog>
     <DialogTitle>Delete Template SMS</DialogTitle>
     <DialogContent>Are you sure you want to delete this template ?</DialogContent>
     <div className='d-felx'>
     <MDBBtn className='w-40 ms-1 me-4' color='secondary' onClick={toggleOpen}>
       Never mind ...
     </MDBBtn>
       {id && (  <Button style={{width:"50%"}} type="submit" color='error' onClick={()=>deleteT(id)}>YES!</Button>)}
     </div> 
   </ModalDialog>
 </Modal>
</div>
  )
}

export default DeleteSMSTemplate