import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useDeleteMemberMutation, useDeleteTeamMutation } from '../../redux/services/usersApi';
import { selectContactDetails, selectTeamDetails, setDeleteContact, setDeleteTeam } from '../../redux/state/authSlice';
import { toast } from 'sonner';
import { Button, DialogContent, DialogTitle, Modal } from '@mui/material';
import ModalDialog from '@mui/joy/ModalDialog';
import { MDBBtn } from 'mdb-react-ui-kit';
export interface ModalContactProps {
    onClose: () => void;
    show:boolean;
    isMember:boolean;
  }

const DeleteContact: React.FC<ModalContactProps> = ({  onClose ,show ,isMember}) => {
    const [open,setOpen]=useState<boolean>(show);
    const team= useSelector(selectTeamDetails);
    const contact=useSelector(selectContactDetails)
    const dispatch=useDispatch();
    const[deleteMember]=useDeleteMemberMutation()
    const[deleteTeam]=useDeleteTeamMutation()
      useEffect(() => {
        setOpen(show);
    }, [show]);

    
      const handleError = (error: unknown) => {
        toast.error("Error! Yikes");
        console.error("Error deleting contact or team:", error);
      };

      const handleDelete = async () => {
        try {
          if (isMember && contact?.id !== undefined) {
            await deleteMember(contact.id);
            dispatch(setDeleteContact(contact.id));
            toast.success("Contact Deleted Successfully!");
            onClose();
          } else if (!isMember && team?.id !== undefined) {
            await deleteTeam(team.id);
            dispatch(setDeleteTeam(team.id));
            toast.success("Team Deleted Successfully!");
            onClose();
          } else {
            handleError(new Error("Missing ID"));
          }
        } catch (error) {
          handleError(error);
        }
      };
      
      const toggleOpen = () =>{
        onClose();
        setOpen(false);
      } 
  return (
    <Modal open={open} onClose={toggleOpen}>
    <ModalDialog>
      <DialogTitle>{isMember?"Delete Contact":"DeleteTeam"}</DialogTitle>
      <DialogContent>Are you sure you want to delete this ?</DialogContent>
      <div className='d-flex'>
      <MDBBtn className='w-40 ms-1 me-4' color='secondary' onClick={toggleOpen}>
        Never mind ...
      </MDBBtn>
        <Button style={{width:"50%"}} type="submit" color='error' onClick={()=>handleDelete()}>YES!</Button>
      </div> 
    </ModalDialog>
  </Modal>  )
}

export default DeleteContact