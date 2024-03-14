import { FormEvent, useState } from 'react';
import './Login.css'
import {
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCheckbox,
  MDBIcon,
  MDBContainer,
}from 'mdb-react-ui-kit';
import { useLoginUserMutation } from '../../redux/services/authApi';
import { toast } from 'sonner';
import Code from '../otp_code/Code';
import { useNavigate } from 'react-router-dom';
import { setUser } from '../../redux/state/authSlice';
import { useDispatch } from 'react-redux';

const Login=()=> {
  const stage="login"
  const initialState={
        email: '',
        password: ''
      }
  const [formData, setFormData] = useState(initialState);
  const {email,password}=formData;
  const [isMfaEnabled,setIsMfaEnabled]=useState<boolean>();
  const [isEnabled,setIsEnabled]=useState<boolean>();
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const[loginUser]=useLoginUserMutation();

  const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const handleLogin: (evt: FormEvent<HTMLFormElement>) => void = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    try{
      await loginUser({email,password})
      .unwrap()
      .then((userData: any) => {
          console.log("🚀 ~ .then ~ userData:", userData)
          if(userData){
            setIsMfaEnabled(userData.mfaEnabled)
            setIsEnabled(userData.user.enabled)
            if(userData.user){
              dispatch(setUser({ user: userData.user, token: userData.token ,role:userData.user.role}));   
              toast.success("User logged In successfully !")
              navigate('/dashboard') 
            }
          }
    })
 
    }catch(error){ 
      toast.error("Error !")
      console.log("🚀 ~ Login ~ error:", error)
    }
  }



  
    return (
      <>
            {!isMfaEnabled  && (
              <MDBContainer >
                <form onSubmit={handleLogin}>
                  <div className='text-center mb-3'>
                    <p>Sign up with:</p>

                    <MDBBtn floating color="secondary" className='mx-1'>
                      <MDBIcon fab icon='facebook-f' />
                    </MDBBtn>

                    <MDBBtn floating color="secondary" className='mx-1'>
                      <MDBIcon fab icon='google' />
                    </MDBBtn>

                    <MDBBtn floating color="secondary" className='mx-1'>
                      <MDBIcon fab icon='twitter' />
                    </MDBBtn>

                    <MDBBtn floating color="secondary" className='mx-1'>
                      <MDBIcon fab icon='github' />
                    </MDBBtn>
                  </div>

                  <p className='text-center'>or:</p>

                  <MDBInput name='email' value={email} onChange={handleChange} className='mb-4' type='email' id='form7Example1' label='Email address' />
                  <MDBInput name='password' value={password} onChange={handleChange} className='mb-4' type='password' id='form7Example2' label='Password' />

                  <MDBRow className='mb-4'>
                    <MDBCol className='d-flex justify-content-center'>
                      <MDBCheckbox id='form7Example3' label='Remember me' defaultChecked />
                    </MDBCol>
                    <MDBCol>
                      <a href='#!'>Forgot password?</a>
                    </MDBCol>
                  </MDBRow>

                  <MDBBtn type='submit' className='mb-4' block>
                    Sign in
                  </MDBBtn>

                  <div className='text-center'>
                    <p>
                      Not a member? <a href='#!'>Register</a>
                    </p>
                  </div>
                </form>
              </MDBContainer>
              )}

      {isMfaEnabled  && (
                <>
                <h5 className='title'>Set Up Two-Factor Authentication</h5>
                <Code email={email} password={password} stage={stage} />
                </>
      )}

      </>

    
   )
}

export default Login