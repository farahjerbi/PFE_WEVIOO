import React, { FormEvent, useEffect, useState } from 'react'
import './Profile.css'
import Avatar from 'react-avatar';
import BreadcrumSection from '../../../components/BreadcrumSection/BreadcrumSection'
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow } from 'mdb-react-ui-kit'
import DeleteUserModal from '../../../components/modals/DeleteUserModal';
import { Role } from '../../../models/user/Role';
import ChangePassword from '../changePassword/ChangePassword';
import { toast } from 'sonner';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { selectUser, setUpdatedUser } from '../../../redux/state/authSlice';
import Button from '@mui/material/Button';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { Tooltip } from '@mui/material';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
const Profile = () => {
    const user = useSelector(selectUser);
    const dispatch=useDispatch();
    const [updated, setUpdated] = useState<boolean>(false);
    const [signatureInput, setSignatureInput] = useState<File | null>(null);
    const [formData, setFormData] = useState({
        email: user?.email ,
        emailSecret: user?.emailSecret ,
        firstName: user?.firstName,
        lastName: user?.lastName,
        signatureInput: user?.signature,

    });
    const { email, emailSecret, firstName, lastName } = formData;
    const [idDelete, setIdDelete] = useState<number>();
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [resetPassword, setResetPassword] = useState<boolean>(false);
    const [signatureUrl, setSignatureUrl] = useState<string>("");
    useEffect(() => {
      if (user && user.signature) {
        fetchSignatureImage();
      }
    }, [user]); 
    
    const fetchSignatureImage = async () => {
      try {
        if (user && user.signature) {
          setSignatureUrl(`http://localhost:8099/uploads/${user.signature}`);
        }
      } catch (error) {
        console.error('Error fetching signature image:', error);
      }
    };
    
    if (!user) {
      return <div>Loading user...</div>;
    }
   
    const name = user.firstName +' '+ user.lastName;
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
            
              if (!firstName || !lastName || !emailSecret) {
                console.error("Please fill in all fields and select a signature file.");
                return;
              }
              const formData = new FormData();
              formData.append('firstName', firstName);
              formData.append('lastName', lastName);
              formData.append('emailSecret', emailSecret);
              if (signatureInput !== null) {
                formData.append('signature', signatureInput);
              } else {
                if (signatureUrl) {
                  formData.append('signatureUrl', signatureUrl);
                } 
              }
              try {
                const response = await axios.post(`http://localhost:8099/api/users/updateProfile/${user?.id}`, formData);
                
                if (response.status === 200) {
                  const updatedUser = response.data;
                  dispatch(setUpdatedUser(updatedUser))
                  toast.success("Profile Updated Successfully !");
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
                            <Tooltip title="  Upload Electronic Signature">
                            <Button
                                className='mb-4'
                                component="label"
                                role={undefined}
                                variant="contained"
                                tabIndex={-1}
                                color='info'
                                startIcon={<CloudUploadIcon />}
                              >
                                <VisuallyHiddenInput accept="*/*" onChange={(e) => setSignatureInput(e.target.files && e.target.files[0])}  className='mb-4'  type="file" />
                              </Button>
                            </Tooltip>
                          {signatureInput && (<p>{signatureInput.name}</p>)}  
                            {signatureUrl && (
                                  <img src={signatureUrl} alt="Signature" style={{ maxWidth: '100px', height: 'auto' }} />

                            )}

                            <div className='d-flex '>
                            <MDBBtn className='w-50 me-2 color_baby_blue'>Update Profile</MDBBtn>                            
                            <MDBBtn className='w-50 me-2 color_baby_bluee'  onClick={()=>setResetPassword(true)}  >Change Password</MDBBtn>
                            <MDBBtn className='w-50 color_blue'  onClick={() => { setDeleteModalOpen(true); setIdDelete(user.id)}}>Delete Profile</MDBBtn>
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