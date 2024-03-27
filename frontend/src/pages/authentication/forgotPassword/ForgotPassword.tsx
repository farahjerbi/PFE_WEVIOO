import { MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBInput, MDBRow } from 'mdb-react-ui-kit'
import { useState } from 'react'
import { useResetPasswordMutation } from '../../../redux/services/usersApi'
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';

const ForgotPassword = () => {
  const { email } = useParams();

  const[newPassword,setNewPassword]=useState<string>("")
  const[confirmNewPassword,setConfirmNewPassword]=useState<string>("")
  const[resetPassword]=useResetPasswordMutation()
  const navigate=useNavigate()
  const handleChangePassword = async()=> {
    try{
      if(newPassword!==confirmNewPassword){
        toast.warning("Passwords do not match !")
      }else{
        if(email){
          await resetPassword({email,newPassword,confirmNewPassword})
          .unwrap()
          .then((userData: any) => {
            toast.success("Password Changed Successfully !")
            navigate('/authentication')
          })
        }
      } 
    }catch(error){
      toast.error('Error!')
      console.log("🚀 ~ handleChangePassword ~ error:", error)
    }
  }
  return (
    <div className="container">
    <MDBCard className='my-5'  >
      <MDBRow>
        <MDBCol md="6">
          <MDBCardImage className='illustration' src="../assets/email.png" />
        </MDBCol>
        <MDBCol md="6">
          <MDBCardBody  >
            <img  className='logoo mb-4'  src="../assets/logo.png" alt=""  />
                <MDBInput 
                className='mb-4 mt-5'
                label='New Password'
                name="password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required />
                <MDBInput 
                 className='mb-4 mt-3'
                label='Confirm New Password'
                name="password"
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                required />
                <MDBBtn className='w-100 mb-4 color_blue' type='submit' onClick={()=>handleChangePassword()} >Reset Password</MDBBtn>
          </MDBCardBody>
        </MDBCol>
      </MDBRow>
    </MDBCard>
</div>  )
}

export default ForgotPassword