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
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
}from 'mdb-react-ui-kit';
import { useForgotPasswordMutation, useLoginUserMutation } from '../../redux/services/authApi';
import { toast } from 'sonner';
import Code from '../otp_code/Code';
import { Link, useNavigate } from 'react-router-dom';
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
  const [emailForgotten,setEmailForgotten]=useState<string>("");
  const navigate=useNavigate();
  const dispatch = useDispatch();
  const[loginUser]=useLoginUserMutation();
  const [basicModal, setBasicModal] = useState(false);
  const toggleOpen = () => setBasicModal(!basicModal);
  const[forgotPassword]=useForgotPasswordMutation()
  const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const forgotPasswordEmail = async () => {
    try {
        setBasicModal(!basicModal)
        setEmailForgotten("")
        await forgotPassword({email:emailForgotten});
        toast.success("Check your email to reset your password !");
    } catch (error) {
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);
    }
  };

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
              <MDBContainer className='mt-5' >
                <form onSubmit={handleLogin}>

                  <MDBInput name='email' value={email} onChange={handleChange} className='mb-4' type='email' id='form7Example1' label='Email address' />
                  <MDBInput name='password' value={password} onChange={handleChange} className='mb-4' type='password' id='form7Example2' label='Password' />

                  <MDBRow className='mb-4'>
                    <MDBCol className='d-flex justify-content-center'>
                      <MDBCheckbox id='form7Example3' label='Remember me' defaultChecked />
                    </MDBCol>
                    <MDBCol>
                      <Link to='' onClick={()=>setBasicModal(!basicModal)}>Forgot password?</Link>
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

      <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex='-1'>
          <MDBModalDialog>
            <MDBModalContent>
              <MDBModalHeader>
                <MDBModalTitle>Forgotten Password</MDBModalTitle>
                <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
              </MDBModalHeader>
              <MDBModalBody>
              <img src="../../../assets/fg.png" alt="" style={{width:"70%",marginLeft:"20%"}} />
                <MDBInput 
                label='Please Enter your email'
                name="email"
                type="text"
                value={emailForgotten}
                onChange={(e) => setEmailForgotten(e.target.value)}
                required />
              </MDBModalBody>
              <MDBModalFooter>
                <MDBBtn color='secondary' onClick={toggleOpen}>
                  Close
                </MDBBtn>
              <MDBBtn color='info' onClick={()=>forgotPasswordEmail()}> Send Email ! </MDBBtn> 
              </MDBModalFooter>
            </MDBModalContent>
          </MDBModalDialog>
        </MDBModal>  

      </>

    
   )
}

export default Login