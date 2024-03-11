import React, { FormEvent, useState } from 'react';
import './Register.css'
import {
  MDBBtn,
  MDBContainer,
  MDBInput,
  MDBCheckbox,
  
}
from 'mdb-react-ui-kit';
import {useRegisterUserMutation} from '../../redux/services/authApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import Code from '../otp_code/Code';
const Register=()=> {
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
  const navigate =useNavigate();
  const[registerUser,{data,isSuccess,isError,error}] =useRegisterUserMutation();

  
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
       
    })
  }

  }

  return (
    <>
      {!isMfaEnabled  && (
      <MDBContainer >
      <form onSubmit={handleRegister} >
        <MDBInput name='firstName' value={firstName} onChange={handleChange} className='mb-4' id='form8Example1' label='FirstName' />
        <MDBInput name='lastName' value={lastName} onChange={handleChange} className='mb-4' id='form8Example2' label='LastName' />
        <MDBInput name='email' value={email} onChange={handleChange} className='mb-4' type='email' id='form8Example3' label='Email address' />
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
      </form>
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