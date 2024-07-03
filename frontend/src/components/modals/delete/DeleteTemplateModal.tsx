import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import { Button, DialogContent, DialogTitle, Modal } from '@mui/material';
import ModalDialog from '@mui/joy/ModalDialog';
import { MDBBtn } from 'mdb-react-ui-kit';
import { useDispatch } from 'react-redux';
import { DeleteTemplateModalProps } from '../../../models/DeleteModels';
import { useDeleteTemplateMutation } from '../../../redux/services/emailApi';
import { setDeleteEmail } from '../../../redux/state/emailSlice';


const DeleteTemplateModal: React.FC<DeleteTemplateModalProps> = ({ id , onClose ,show }) => {
  const [deleteTemplate] = useDeleteTemplateMutation();
  const [open,setOpen]=useState<boolean>(show);
  const dispatch=useDispatch();
    useEffect(() => {
      setOpen(show);
  }, [show]);

  const deleteT= async (id:number) => {
    try {
      await deleteTemplate(id);
      dispatch(setDeleteEmail(id))
      toast.success("Template Deleted Successfully !");
      toggleOpen();
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
          <DialogTitle>Delete Template</DialogTitle>
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

export default DeleteTemplateModal