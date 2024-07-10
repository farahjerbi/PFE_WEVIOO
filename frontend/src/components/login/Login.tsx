import { FormEvent, useState } from 'react';
import './Login.css'
import {
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCheckbox,
  MDBContainer,
}from 'mdb-react-ui-kit';
import {  useLoginUserMutation } from '../../redux/services/authApi';
import { toast } from 'sonner';
import Code from '../otp_code/Code';
import { Link, useNavigate } from 'react-router-dom';
import {setUser } from '../../redux/state/authSlice';
import { useDispatch } from 'react-redux';
import { DASHBOARD } from '../../routes/paths';
import ForgetPasswordModal from '../modals/ForgetPasswordModal';
import { validateEmail } from '../../routes/Functions';

const Login=()=> {
  const stage="login"
  const initialState={
        email: '',
        password: ''
      }
  const [formData, setFormData] = useState(initialState);
  const {email,password}=formData;
  const [isMfaEnabled,setIsMfaEnabled]=useState<boolean>();
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const[loginUser]=useLoginUserMutation();
  const [basicModal, setBasicModal] = useState(false);
  const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }


  const handleLogin: (evt: FormEvent<HTMLFormElement>) => void = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if(!email){
      toast.error("Enter Email please");
      return
    }
    if(!password){
      toast.error("Enter Password please");
      return
    }
    if (!validateEmail(email)){
      toast.error("Email format incorrect");
      return
    }
    try{
      await loginUser({email,password})
      .unwrap()
      .then((userData: any) => {
          console.log("🚀 ~ .then ~ userData:", userData)
          if(userData){
            setIsMfaEnabled(userData.mfaEnabled)
            if(userData.user){
              dispatch(setUser({ user: userData.user, token: userData.token ,role:userData.user.role}));   
              toast.success("User logged In successfully !")
              navigate(DASHBOARD) 
            }
          }
    }) 
  } catch (error: any) {
    if (error && error.data) {
      toast.error(error.data.message);
      console.error("🚀 ~ error:", error.message);
    } else {
      toast.error("An unknown error occurred.");
      console.error("🚀 ~ error:", error);
    }
  }}
  
    return (
      <>
            {!isMfaEnabled  && (
              <MDBContainer className='mt-5' >
                <form onSubmit={handleLogin}>

                  <MDBInput  name='email' value={email} onChange={handleChange} className='mb-5' type='email' id='form7Example1' label='Email address' />
                  <MDBInput  name='password' value={password} onChange={handleChange} className='mb-5' type='password' id='form7Example2' label='Password' />

                  <MDBRow className='mb-4'>
                    <MDBCol className='d-flex justify-content-center'>
                      <MDBCheckbox id='form7Example3' label='Remember me' defaultChecked />
                    </MDBCol>
                    <MDBCol>
                      <Link to=""  onClick={()=>setBasicModal(true)}>Forgot password?</Link>
                    </MDBCol>
                  </MDBRow>

                  <MDBBtn type='submit' className='mb-4 mt-3' block>
                    Sign in
                  </MDBBtn>
                </form>
              </MDBContainer>
              )}

      {isMfaEnabled  && (
                <>
                <h5 className='title mb-5'>Set Up Two-Factor Authentication</h5>
                <Code email={email} password={password} stage={stage} />
                </>
      )}
      <ForgetPasswordModal show={basicModal} onClose={()=>setBasicModal(false)} />

      </>

    
   )
}

export default Login