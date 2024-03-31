import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-react-ui-kit'
import './ChangePassword.css'
import { FormEvent, useState } from 'react';
import { useChangePasswordMutation } from '../../../redux/services/usersApi';
import { toast } from 'sonner';
import { useSelector } from 'react-redux';
import { selectUser } from '../../../redux/state/authSlice';
interface Close {
  onClose: () => void;
}
const ChangePassword:React.FC<Close> = ({ onClose })=> {
    const user=useSelector(selectUser)

    const initialState={
      email: user?.email,
      oldPassword:"",
      newPassword:"",
      confirmNewPassword:"" 
    }
    const [formData, setFormData] = useState(initialState);
    const {email,oldPassword,newPassword,confirmNewPassword}=formData;
    const[changePassword]=useChangePasswordMutation();

    const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
      setFormData({...formData,[e.target.name]:e.target.value})
    }

    const handleChangePassword: (evt: FormEvent<HTMLFormElement>) => void = async (
      e: FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault();
      try{
        if(email){
          await changePassword({email,newPassword,oldPassword,confirmNewPassword})   
          .unwrap()
          .then((userData: any) => {
            toast.success("Password Changed Successfully !")
            onClose()
          })
        }
      }catch(error){
        toast.error('Error!')
        console.log("🚀 ~ handleChangePassword ~ error:", error)
      }
    }

  return (
    <>
    <MDBContainer fluid className='changepassword-container my-5'>

    <MDBRow className='g-0 align-items-center'>
      <MDBCol col='6'>

      <MDBCard className='my-5 cascading-right' style={{
                background: 'hsla(0, 0%, 100%, 0.55)',
                backdropFilter: 'blur(30px)',
            }}>
        
              <MDBCardBody className='p-5 shadow-5 text-center'>
            <h2 className="fw-bold mb-5">Reset Password</h2>
            <form onSubmit={handleChangePassword}>

            <MDBInput name='oldPassword' value={oldPassword} onChange={handleChange} wrapperClass='mb-4' label='Old Password' id='form3' type='password'/>
            <MDBInput name='newPassword' value={newPassword} onChange={handleChange} wrapperClass='mb-4' label='New Password' id='form3' type='password'/>
            <MDBInput name='confirmNewPassword' value={confirmNewPassword} onChange={handleChange} wrapperClass='mb-4' label='Confirm New Password' id='form4' type='password'/>

          

            <MDBBtn type='submit'
            style={{ background: 'linear-gradient(90deg, rgba(106, 15, 255, 1) 0%, rgba(131, 89, 255, 1) 15%, rgba(168, 118, 230, 1) 35%, rgba(186, 155, 227, 1) 67%, rgba(234, 219, 247, 1) 100%)'}} className='w-100 mb-4' >
              Reset</MDBBtn>
            </form>
            <MDBBtn outline className='mx-2' color='secondary' onClick={()=>onClose()}>
              Go Back
            </MDBBtn>
          </MDBCardBody>
        </MDBCard>
      </MDBCol>

      <MDBCol col='6'>
        <img src="../../../assets/password.png" className="w-100 rounded-4 shadow-4"
          alt="" />
      </MDBCol>

    </MDBRow>

  </MDBContainer> 
    </>
 )
}

export default ChangePassword