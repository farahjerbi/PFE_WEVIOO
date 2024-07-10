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
    const [errors,setErrors] = useState(
      {
        oldPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      }
  )

  const formValidation = () => {
        
    let etat = true ;
    let localError = {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    }
    if (!oldPassword.trim()) {
      localError.oldPassword = "oldPassword Required" ;
       etat = false;}
  
     if (!newPassword.trim() || newPassword.length < 10 || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(newPassword)) {
      localError.newPassword = "New password required, minimum length is 10, and must be alphanumeric.";
      etat = false;
    }
     if(!confirmNewPassword.trim() || confirmNewPassword.length < 10 || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(confirmNewPassword)){
        localError.confirmNewPassword = "Confirm password required , minimum length is 10, and must be alphanumeric." ;
        etat = false;
     }
   
     setErrors(localError)
     return etat ; 
      
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
      const isFormValid = formValidation();
      if (!isFormValid) {
        toast.error("Invalid Form");
        return;
      }

      try{
        if(email){
          await changePassword({email,newPassword,oldPassword,confirmNewPassword})   
          .unwrap()
          .then((userData: any) => {
            toast.success("Password Changed Successfully !")
            onClose()
          })
        }
      } catch (error: any) {
        if (error && error.data) {
          toast.error(error.data.message);
          console.error("🚀 ~ error:", error.message);
        } else {
          toast.error("An unknown error occurred.");
          console.error("🚀 ~ error:", error);
        }
      }
    }

  return (
    <>
    <MDBContainer fluid className='changepassword-container  my-5'>

    <MDBRow className='g-0 align-items-center '>
      <MDBCol col='6'>

      <MDBCard className='my-5 cascading-right  ' style={{
                background: 'hsla(0, 0%, 100%, 0.55)',
                backdropFilter: 'blur(30px)',
            }}>
                    <form onSubmit={handleChangePassword}>

              <MDBCardBody className='p-5 shadow-5 text-center'>
            <h2 className="fw-bold mb-5">Reset Password</h2>

            <MDBInput name='oldPassword' value={oldPassword} onChange={handleChange} wrapperClass={errors.oldPassword ?'mb-1':'mb-4'} label='Old Password' type='password'/>
            {errors.oldPassword && (<>
              <i style={{ color: "red" }} className="fas fa-exclamation-circle trailing"></i>
              <b  style={{fontSize:"0.8rem",color:"red"}}> {errors.oldPassword }</b>
              
            </>)}
            <MDBInput name='newPassword' value={newPassword} onChange={handleChange} wrapperClass={errors.newPassword ?'mb-1':'mb-4'} label='New Password' type='password'/>
            {errors.newPassword && (<>
              <i style={{ color: "red" }} className="fas fa-exclamation-circle trailing"></i>
              <b  style={{fontSize:"0.8rem",color:"red"}}> {errors.newPassword }</b>
              
            </>)}
            <MDBInput name='confirmNewPassword' value={confirmNewPassword} onChange={handleChange} wrapperClass={errors.confirmNewPassword ?'mb-1':'mb-4'}  label='Confirm New Password' id='form4' type='password'/>
            {errors.newPassword && (<>
              <i style={{ color: "red" }} className="fas fa-exclamation-circle trailing"></i>
              <b  style={{fontSize:"0.8rem",color:"red"}}> {errors.confirmNewPassword }</b>
              
            </>)}
        
            <MDBBtn type='submit'
            style={{ background: 'linear-gradient(90deg, rgba(106, 15, 255, 1) 0%, rgba(131, 89, 255, 1) 15%, rgba(168, 118, 230, 1) 35%, rgba(186, 155, 227, 1) 67%, rgba(234, 219, 247, 1) 100%)'}} className='w-100 mb-4' >
              Reset</MDBBtn>
            <MDBBtn type='button' outline className='mx-2' color='secondary' onClick={()=>onClose()}>
              Go Back
            </MDBBtn>
          </MDBCardBody>
          </form>
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