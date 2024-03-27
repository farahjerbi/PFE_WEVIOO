import React, { FormEvent, useEffect, useState } from 'react';
import './Register.css'
import {
  MDBBtn,
  MDBContainer,
  MDBInput,
  MDBCheckbox,
}
from 'mdb-react-ui-kit';
import {useRegisterUserMutation, useVerifyEmailMutation} from '../../redux/services/authApi';
import { toast } from 'sonner';
import Code from '../otp_code/Code';
import { useNavigate, useParams } from 'react-router-dom';
import ContactMail from "@mui/icons-material/ContactMail";
import { ReactTyped } from 'react-typed';
import { useActivateUserMutation } from '../../redux/services/usersApi';
const Register=()=> {
  const { emailUser } = useParams();
  const stage="register"
  const initialState={firstName: '',
                      lastName: '',
                      email: '',
                      password: '',
                      confirmPassword: '',
                      mfaEnabled: false
                    }
  const [formData, setFormData] = useState(initialState);
  const {firstName,lastName,email,password,confirmPassword,mfaEnabled}=formData;
  const [isMfaEnabled,setIsMfaEnabled]=useState<string>();
  const[registerUser] =useRegisterUserMutation();
  const[verifyEmail]=useVerifyEmailMutation();
  const[activateUser]=useActivateUserMutation();
  const[toBeContinued,setToBeContinued]=useState<boolean>(true);
  const[Continued,setContinued]=useState<boolean>(false);
  const navigate=useNavigate()
  useEffect(() => {
    if(emailUser){
      formData.email=emailUser
      setContinued(true)
    }
  }, []);

  const verifyEmailUser: (evt: FormEvent<HTMLFormElement>) => void = async (
    e: FormEvent<HTMLFormElement>
    ) => {
    e.preventDefault();
    try {
      setToBeContinued(false)
      toast.success("Please Verify Your Email !");
      const responseTemplate = await verifyEmail({email}).unwrap();
    } catch (error) {
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);
    }
  };
  
  const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const handleRegister: (evt: FormEvent<HTMLFormElement>) => void = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
     if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords don't match");
          }else{
      await registerUser({firstName,lastName,email,password,mfaEnabled})
      .unwrap()
      .then((userData: any) => {
          console.log("🚀 ~ .then ~ userData:", userData)
          setIsMfaEnabled(userData.secretImageUri)
          toast.success("User registed successfully !")
          if(!userData.mfaEnabled){
            navigate('/authentication')
          }
    })
  }

  }

  return (
    <>
      {!isMfaEnabled  && (
      <MDBContainer >
      {toBeContinued && !Continued && (
        <>
              <form onSubmit={verifyEmailUser} style={{marginTop:"25%"}} >
                <MDBInput name='email' value={email} onChange={handleChange} className='mb-4 mt-5' type='email' id='form8Example3' label='Email address' />
                <MDBBtn  type='submit' className='mb-4' block>
                  Sign up
                </MDBBtn>
              </form>

        </>
      )}
      
      {!toBeContinued && !Continued &&  (<>
      <img src="../../../assets/sendMail.png" alt="" style={{width:"40%",marginLeft:"30%"}} />
      <div>
          <ReactTyped
            strings={[
                "Please verify your email in order to continue the registration !"]}
            typeSpeed={50}
            backSpeed={100}
            loop
            style={{ color: '#6873C8', fontSize: '17px', fontWeight: 'bold' }}
          />
      </div>

      </>)}

      {Continued  && (

      <form onSubmit={handleRegister} >
        <MDBInput name='firstName' value={firstName} onChange={handleChange} className='mb-4' id='form8Example1' label='First name' />
        <MDBInput name='lastName' value={lastName} onChange={handleChange} className='mb-4' id='form8Example2' label='Last name' />
        <MDBInput name='password' value={password} onChange={handleChange} className='mb-4' type='password' id='form8Example4' label='Password' />
        <MDBInput name='confirmPassword' value={confirmPassword} onChange={handleChange} className='mb-4' type='password' id='form8Example5' label='Repeat password' />

        <MDBCheckbox
          wrapperClass='d-flex justify-content-center mb-4'
          id='form8Example6'
          label='I want to enable MFA'
          name='mfaEnabled'
          checked={mfaEnabled}
          onChange={(e) => setFormData({ ...formData, mfaEnabled: e.target.checked })}
        />
        <MDBBtn  type='submit' className='mb-4' block>
          Sign up
        </MDBBtn>
      </form>)}
    </MDBContainer>
    )}
   
    {isMfaEnabled && (
      <MDBContainer>
        <h5 className='title'>Set Up Two-Factor Authentication</h5>
        <img className='QRCode' src={isMfaEnabled} alt="QR Code" />
        <Code email={email} password={password} stage={stage}/>
      </MDBContainer>
    )}
    
    
    </>
  

  );
}

export default Register;