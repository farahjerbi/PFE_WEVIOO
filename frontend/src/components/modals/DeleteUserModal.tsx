import { MDBBtn} from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import { useDeleteUserMutation } from '../../redux/services/usersApi';
import { toast } from 'sonner';
import { Role } from '../../models/user/Role';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/state/authSlice';
import { useNavigate } from 'react-router-dom';
import { Button, DialogContent, DialogTitle, Modal } from '@mui/material';
import ModalDialog from '@mui/joy/ModalDialog';
import { DeleteUserModalProps } from '../../models/DeleteModels';
import { setDeleteUser } from '../../redux/state/usersSlice';

  const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ id , onClose ,show ,typeUser}) => {
    const[deleteUser]=useDeleteUserMutation();
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const [open,setOpen]=useState<boolean>(show);
    useEffect(() => {
        setOpen(show);
    }, [show]);
    const deleteU = async (id:number) => {
        try {
          await deleteUser(id);
          toast.success("User Deleted Successfully !");
          dispatch(setDeleteUser(id))
          onClose();
          if(typeUser===Role.USER){
            dispatch(logout());
            navigate('/authentication')
          }
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
    <>
     <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Delete User</DialogTitle>
          <DialogContent>Are you sure you want to delete this account ?</DialogContent>
          <div className='d-felx'>
          <MDBBtn className='w-40 ms-1 me-4' color='secondary' onClick={toggleOpen}>
            Never mind ...
          </MDBBtn>
            {id && (  <Button style={{width:"50%"}} type="submit" color='error' onClick={()=>deleteU(id)}>YES!</Button>)}
          </div> 
        </ModalDialog>
      </Modal>
    </>


  )
}

export default DeleteUserModal