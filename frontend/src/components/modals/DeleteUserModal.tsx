import { MDBBtn, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import { useDeleteUserMutation } from '../../redux/services/usersApi';
import { toast } from 'sonner';
import { Role } from '../../models/Role';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/state/authSlice';
import { useNavigate } from 'react-router-dom';
interface DeleteUserModalProps {
    id: number;
    onClose: () => void;
    show:boolean;
    typeUser:Role
  }
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
    <MDBModal open={open} tabIndex='-1'>
    <MDBModalDialog>
      <MDBModalContent>
        <MDBModalHeader>
          <MDBModalTitle>Delete User</MDBModalTitle>
          <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
        </MDBModalHeader>
        <MDBModalBody>Are you sure you want to delete this user ?</MDBModalBody>
        <MDBModalFooter>
          <MDBBtn color='secondary' onClick={toggleOpen}>
            Close
          </MDBBtn>
          {id && ( <MDBBtn color='danger' onClick={()=>deleteU(id)}> Yes ! </MDBBtn> )}
        </MDBModalFooter>
      </MDBModalContent>
    </MDBModalDialog>
  </MDBModal>  
  )
}

export default DeleteUserModal