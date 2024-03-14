import React, { useEffect, useState } from 'react'
import './Profile.css'
import Avatar from 'react-avatar';
import BreadcrumSection from '../../../components/BreadcrumSection/BreadcrumSection'
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow } from 'mdb-react-ui-kit'
import DeleteUserModal from '../../../components/modals/DeleteUserModal';
import { Role } from '../../../models/Role';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ChangePassword from '../changePassword/ChangePassword';
const Profile = () => {
    const [updated, setUpdated] = useState<boolean>(false);
    useEffect(() => {

      }, [updated]);
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const name = user.firstName +' '+ user.lastName;
    const initialState={
        email: user.email,
        password:"",
        firstName:user.firstName,
        lastName:user.lastName 
      }
    const [formData, setFormData] = useState(initialState);
    const {email,password,firstName,lastName}=formData;
    const [idDelete, setIdDelete] = useState<number>();
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [resetPassword, setResetPassword] = useState<boolean>(false);

    const navigate=useNavigate();
    const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
      }
      const handleUpdate = () => {
        setUpdated(!updated); 
        setDeleteModalOpen(false)
            };


  return (
    <>
    <BreadcrumSection/>
    {!resetPassword && (
            <MDBContainer fluid className='p-4'>

            <MDBRow>
            
                    <MDBCol md='6' className='container_profile' >
                        <MDBCard className='text-center d-flex align-items-center mb-4'>
                                <Avatar
                                    color="#6873C8"
                                    className='mt-4'
                                    name={name}
                                    initials={(name) => name.split(' ').map((n) => n[0]).join('').toUpperCase()}
                                    size={"100"}
                                    round
                                    />
                        <MDBCardBody className='p-5'>
                            <h4 className="mb-4">{user.firstName} {user.lastName}</h4>
                            <hr />
                            <p className="dark-grey-text mt-4">
                                <MDBIcon fas icon="quote-left" className="pe-2" />
                                {user.role}
                            </p>
                            <MDBRow>
                            <MDBCol col='6'>
                                <MDBInput name='firstName' value={firstName} onChange={handleChange} wrapperClass='mb-4' label='First name' id='form1' type='text'/>
                            </MDBCol>
            
                            <MDBCol col='6'>
                                <MDBInput name='lastName' value={lastName} onChange={handleChange} wrapperClass='mb-4' label='Last name' id='form1' type='text'/>
                            </MDBCol>
                            </MDBRow>
            
                            <MDBInput name='email' value={email} onChange={handleChange} wrapperClass='mb-4' label='Email' id='form1' type='email'/>
                            <MDBInput name='password' value={password} onChange={handleChange}  wrapperClass='mb-4' label='Password' id='form1' type='password'/>
            
                            <div className='d-flex'>
                            <MDBBtn className='w-50 '>Update Profile</MDBBtn>
                            <MDBBtn className='w-50 ' color='info' onClick={()=>setResetPassword(true)}  >Change Password</MDBBtn>
                            <MDBBtn className='w-50 ' color='danger' onClick={() => { setDeleteModalOpen(true); setIdDelete(user.id)}}>Delete Profile</MDBBtn>
                            </div>
                        </MDBCardBody>
                        </MDBCard>
            
                    </MDBCol>
            
                    <MDBCol md='4' className='text-center text-md-start d-flex flex-column justify-content-center'>
                        <img src="../../../assets/profile.png" alt="" className='img-floating'/>
                    </MDBCol>
            
                    </MDBRow>
                    {idDelete && (
                     <DeleteUserModal typeUser={Role.USER} id={idDelete} show={deleteModalOpen}  onClose={handleUpdate}/> )}
                     
                    </MDBContainer>
                  )}


        {resetPassword && (
            <ChangePassword onClose={()=>setResetPassword(false)}/>
        )}

    </>
  )
}

export default Profile