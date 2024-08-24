import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Button, DialogContent, DialogTitle, Modal } from '@mui/material';
import ModalDialog from '@mui/joy/ModalDialog';
import { MDBBtn } from 'mdb-react-ui-kit';
import { DeleteScheduledNotifProps } from '../../../models/DeleteModels';
import { NotificationType } from '../../../models/NotificationType';
import { useDeleteScheduledEmailMutation } from '../../../redux/services/emailApi';
import { useDeleteScheduledPushMutation } from '../../../redux/services/pushApi';
import { useDeleteScheduledSMSMutation } from '../../../redux/services/smsApi';
import { useDeleteScheduledWhatsappMutation } from '../../../redux/services/whatsAppApi';
import { setDeleteScheduledEmail } from '../../../redux/state/emailSlice';
import { useDispatch } from 'react-redux';
import { setDeleteScheduledSms, setDeleteScheduledWhatsapp } from '../../../redux/state/smsSlice';
import { setDeleteScheduledPush } from '../../../redux/state/pushSlice';

const DeleteScheduledNotif: React.FC<DeleteScheduledNotifProps> = ({ id , onClose ,show,type }) => {
    
const[deleteScheduledEmail]=useDeleteScheduledEmailMutation()
const[deleteScheduledSMS]=useDeleteScheduledSMSMutation()
const[deleteScheduledWhatsapp]=useDeleteScheduledWhatsappMutation()
const[deleteScheduledPush]=useDeleteScheduledPushMutation()
const dispatch=useDispatch()
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

          const updateStateActions: Record<NotificationType, (id: string) => void> = {
            [NotificationType.EMAIL]: (id: string) => dispatch(setDeleteScheduledEmail(id)),
            [NotificationType.SMS]: (id: string) => dispatch(setDeleteScheduledSms(id)),
            [NotificationType.WHATSAPP]: (id: string) => dispatch(setDeleteScheduledWhatsapp(id)),
            [NotificationType.PUSH]: (id: string) => dispatch(setDeleteScheduledPush(id))
          };

          const deleteFunction = deleteFunctions[type];
          const successMessage = successMessages[type];
          const updateStateAction = updateStateActions[type];
    
          if (deleteFunction && successMessage) {
            await deleteFunction(id)
            updateStateAction(id);
            toggleOpen();
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