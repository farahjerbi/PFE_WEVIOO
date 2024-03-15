import React, { FormEvent, useEffect, useState } from 'react'
import './Profile.css'
import Avatar from 'react-avatar';
import BreadcrumSection from '../../../components/BreadcrumSection/BreadcrumSection'
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow } from 'mdb-react-ui-kit'
import DeleteUserModal from '../../../components/modals/DeleteUserModal';
import { Role } from '../../../models/Role';
import { useNavigate } from 'react-router-dom';
import ChangePassword from '../changePassword/ChangePassword';
import { toast } from 'sonner';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const Profile = () => {
    const [updated, setUpdated] = useState<boolean>(false);
    const [signatureInput, setSignatureInput] = useState<File | null>(null);
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    useEffect(() => {
      const fetchSignatureImage = async () => {
        try {
          setSignatureUrl(`http://localhost:8088/uploads/${user.signature}`); 
        } catch (error) {
          console.error('Error fetching signature image:', error);
        }
      };
  
      if (user && user.signature) {
        fetchSignatureImage();
      }
    }, [updated]);
   
    const name = user.firstName +' '+ user.lastName;
    const initialState={
        email: user.email,
        emailSecret:user.emailSecret || "",
        firstName:user.firstName,
        lastName:user.lastName,
      }
    const [formData, setFormData] = useState(initialState);
    const {email,emailSecret,firstName,lastName}=formData;
    const [idDelete, setIdDelete] = useState<number>();
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [resetPassword, setResetPassword] = useState<boolean>(false);
    const[signatureUrl,setSignatureUrl]=useState<string>("");
    const navigate=useNavigate();


    const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
        setFormData({...formData,[e.target.name]:e.target.value})
      }

      const handleUpdate = () => {
        setUpdated(!updated); 
        setDeleteModalOpen(false)
            };

            const handleSubmit: (evt: FormEvent<HTMLFormElement>) => void = async (
              e: FormEvent<HTMLFormElement>
            ) => {
              e.preventDefault();
            
              const id = user.id;
              if (!firstName || !lastName || !signatureInput || !emailSecret) {
                console.error("Please fill in all fields and select a signature file.");
                return;
              }
            
              const formData = new FormData();
              formData.append('signature', signatureInput);
              formData.append('firstName', firstName);
              formData.append('lastName', lastName);
              formData.append('emailSecret', emailSecret);
            
              try {
                const response = await axios.post(`http://localhost:8088/api/users/updateProfile/${id}`, formData);
                
                if (response.status === 200) {
                  console.log("🚀 ~ Profile ~ response:", response);
                  const updatedUser = response.data;
                  console.log("🚀 ~ Profile ~ updatedUser:", updatedUser);
                  toast.success("Profile Updated Successfully !");
                  localStorage.setItem("user", JSON.stringify(updatedUser));
                  setUpdated(!updated);
                  console.log("User updated successfully!");
                }
              } catch (err) {
                toast.error('Error!')
                console.error("Error updating user:", err);
              }
            }

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
                        <form encType="multipart/form-data" method='POST'  onSubmit={handleSubmit} >
                        <MDBCardBody className='p-5'>
                            <h4 className="mb-4">{user.firstName} {user.lastName}</h4>
                            <hr />
                            <p className="dark-grey-text mt-4">
                                <MDBIcon fas icon="quote-left" className="pe-2" />
                                {user.role}
                            </p>
                            <MDBRow>
                              <MDBCol col='6'>
                                <MDBInput name='firstName' value={firstName} onChange={handleChange} wrapperClass='mb-4' label='First name' type='text'/>
                             </MDBCol>
            
                            <MDBCol col='6'>
                                <MDBInput name='lastName' value={lastName} onChange={handleChange} wrapperClass='mb-4' label='Last name' type='text'/>
                            </MDBCol>
                            </MDBRow>
            
                            <MDBInput disabled name='email' value={email} onChange={handleChange} wrapperClass='mb-4' label='Email' type='email'/>
                            <MDBInput name='emailSecret' value={emailSecret} onChange={handleChange}  wrapperClass='mb-4' label='Email Secret' type='password'/>
                            <p>Electronic Signature : </p>
                            <input type='file'  accept="*/*" onChange={(e) => setSignatureInput(e.target.files && e.target.files[0])}  className='mb-4' />

                            {signatureUrl && (
                                  <img src={signatureUrl} alt="Signature" style={{ maxWidth: '40%', height: 'auto' }} />

                            )}

                            <div className='d-flex'>
                            <MDBBtn className='w-50 '>Update Profile</MDBBtn>                            
                            <MDBBtn className='w-50 ' color='info' onClick={()=>setResetPassword(true)}  >Change Password</MDBBtn>
                            <MDBBtn className='w-50 ' color='danger' onClick={() => { setDeleteModalOpen(true); setIdDelete(user.id)}}>Delete Profile</MDBBtn>
                            </div>
                            </MDBCardBody>
                            </form>
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