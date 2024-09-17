import { MDBBtn, MDBInput} from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import { useDeleteUserMutation } from '../../../redux/services/usersApi';
import { toast } from 'sonner';
import { Role } from '../../../models/user/Role';
import { useDispatch } from 'react-redux';
import { logout } from '../../../redux/state/authSlice';
import { useNavigate } from 'react-router-dom';
import { Button, DialogContent, DialogTitle, Modal } from '@mui/material';
import ModalDialog from '@mui/joy/ModalDialog';
import { DeleteUserModalProps } from '../../../models/DeleteModels';
import { setDeleteUser } from '../../../redux/state/usersSlice';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
interface ErrorResponse {
  message: string;
  status: number;
  timestamp: number;
}
  const DeleteUserModal: React.FC<DeleteUserModalProps> = ({ id , onClose ,show ,typeUser}) => {
    const[deleteUser]=useDeleteUserMutation();
    const dispatch = useDispatch();
    const navigate=useNavigate();
    const [open,setOpen]=useState<boolean>(show);
    const[password,setPassword]=useState<string>("")
    useEffect(() => {
        setOpen(show);
    }, [show]);

    const deleteU = async () => {
      try {
        const isAdmin: boolean = typeUser === Role.ADMIN;
        await deleteUser({ id, password, isAdmin }).unwrap();
          toast.success("User Deleted successfully!");
          dispatch(setDeleteUser(id));
          onClose();
    
          if (typeUser === Role.USER) {
            dispatch(logout());
            navigate('/authentication');
          }
        
      } catch (error: any) {
        if (error && error.data) {
          toast.error(error.data.message || "Delete failed.");
          console.error("🚀 ~ error:", error.message);
        } else {
          toast.error("An unknown error occurred.");
          console.error("🚀 ~ error:", error);
        }
      }
    };
    
      const toggleOpen = () =>{
          onClose();
          setOpen(false);
        } 

  return (
    <>
     <Modal open={open} onClose={toggleOpen}>
        <ModalDialog>
          <DialogTitle>Delete User</DialogTitle>
          <MDBInput label="Please enter your password" name='password' onChange={(e)=>setPassword(e.target.value)} type='password'  ></MDBInput>
          <DialogContent>Are you sure you want to delete this account ?</DialogContent>
          <div className='d-felx'>
          <MDBBtn className='w-40 ms-1 me-4' color='secondary' onClick={toggleOpen}>
            Never mind ...
          </MDBBtn>
            {id && (  <Button style={{width:"50%"}} type="submit" color='error' onClick={deleteU}>YES!</Button>)}
          </div> 
        </ModalDialog>
      </Modal>
    </>


  )
}

export default DeleteUserModal