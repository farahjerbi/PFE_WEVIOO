import React, { useEffect, useState } from 'react'
import { DeleteScheduledNotifProps } from '../../models/DeleteModels'
import { useDeleteScheduledEmailMutation } from '../../redux/services/emailApi'
import { useDispatch } from 'react-redux'
import { toast } from 'sonner';
import { Button, DialogContent, DialogTitle, Modal } from '@mui/material';
import ModalDialog from '@mui/joy/ModalDialog';
import { MDBBtn } from 'mdb-react-ui-kit';
import { useDeleteSMSTemplateMutation, useDeleteScheduledSMSMutation } from '../../redux/services/smsApi';
import { useDeleteScheduledWhatsappMutation } from '../../redux/services/whatsAppApi';
import { useDeleteScheduledPushMutation } from '../../redux/services/pushApi';
import { NotificationType } from '../../models/NotificationType';
const DeleteScheduledNotif: React.FC<DeleteScheduledNotifProps> = ({ id , onClose ,show,type }) => {
    
const[deleteScheduledEmail]=useDeleteScheduledEmailMutation()
const[deleteScheduledSMS]=useDeleteScheduledSMSMutation()
const[deleteScheduledWhatsapp]=useDeleteScheduledWhatsappMutation()
const[deleteScheduledPush]=useDeleteScheduledPushMutation()
const [open,setOpen]=useState<boolean>(show);

useEffect(() => {
  setOpen(show);
}, [show]);

const toggleOpen = () =>{
    onClose();
    setOpen(false);
  } 

  const deleteScheduled = async (id: string) => {
    try {
        const deleteFunctions: Record<NotificationType, (id: string) => Promise<any>> = {
            [NotificationType.EMAIL]: deleteScheduledEmail,
            [NotificationType.SMS]: deleteScheduledSMS,
            [NotificationType.WHATSAPP]: deleteScheduledWhatsapp,
            [NotificationType.PUSH]: deleteScheduledPush
          };

          const successMessages: Record<NotificationType, string> = {
            [NotificationType.EMAIL]: "Scheduled Email deleted successfully!",
            [NotificationType.SMS]: "Scheduled SMS deleted successfully!",
            [NotificationType.WHATSAPP]: "Scheduled WhatsApp message deleted successfully!",
            [NotificationType.PUSH]: "Scheduled Push notification deleted successfully!"
          };

          const deleteFunction = deleteFunctions[type];
          const successMessage = successMessages[type];
    
          if (deleteFunction && successMessage) {
            await deleteFunction(id)
            toggleOpen();
            window.location.reload();
            toast.success(successMessage);
          } else {
            throw new Error("Unknown deletion type");
          }
        } catch (error) {
          toast.error("Error! Yikes");
          console.error("🚀 ~ error:", error);
        }
      };

  return (
    <div>
    <Modal open={open} onClose={toggleOpen}>
        <ModalDialog>
            <DialogTitle>Delete Scheduled {type} </DialogTitle>
            <DialogContent>Are you sure you want to delete this scheduled {type} ?</DialogContent>
            <div className='d-felx'>
            <MDBBtn className='w-40 ms-1 me-4' color='secondary' onClick={toggleOpen}>
            Never mind ...
            </MDBBtn>
            {id && (  <Button style={{width:"50%"}} type="submit" color='error' onClick={()=>deleteScheduled(id)}>YES!</Button>)}
            </div> 
        </ModalDialog>
        </Modal>
</div>  )
}

export default DeleteScheduledNotif