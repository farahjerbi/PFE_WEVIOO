import React, { FormEvent, useEffect, useState } from 'react';
import './Register.css'
import {
  MDBBtn,
  MDBContainer,
  MDBInput,
  MDBCheckbox,
}
from 'mdb-react-ui-kit';
import {useRegisterUserMutation, useVerifyEmailMutation, useVerifyUserExistMutation} from '../../redux/services/authApi';
import { toast } from 'sonner';
import Code from '../otp_code/Code';
import { useNavigate, useParams } from 'react-router-dom';
import { ReactTyped } from 'react-typed';
import { FormControl, InputAdornment, TextField } from '@mui/material';
import { jwtDecode } from 'jwt-decode';
import { DecodedToken } from '../../models/authentication/DecodedToken';
import { AUTHENTICATION } from '../../routes/paths';
import { validateEmail } from '../../routes/Functions';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
const Register=()=> {
  const { emailUser } = useParams();
  const stage="register"
  const initialState={
                      firstName: '',
                      lastName: '',
                      email: '',
                      password: '',
                      confirmPassword: '',
                      mfaEnabled: false
                    }
   const [errors,setErrors] = useState(
    {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
    }
)
const formValidation = () => {
        
  let etat = true ;
  let localError = {
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
  }
  if (!firstName.trim()) {
    localError.firstName = "FirstName Required" ;
     etat = false;}

   if(!lastName.trim() ){
      localError.lastName = " LastName Required " ;
      etat = false;
   }

   if (!password.trim() || password.length < 10 || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(password)) {
    localError.password = "Password required, minimum length is 10, and must be alphanumeric.";
    etat = false;
  }
   if(!confirmPassword.trim() || confirmPassword.length < 10 || !/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]+$/.test(password)){
      localError.confirmPassword = "Confirm password required and minLength is 10" ;
      etat = false;
   }
 
   setErrors(localError)
   return etat ; 
    
}

  const [formData, setFormData] = useState(initialState);
  const {firstName,lastName,email,password,confirmPassword,mfaEnabled}=formData;
  const [isMfaEnabled,setIsMfaEnabled]=useState<string>();
  const[registerUser] =useRegisterUserMutation();
  const[verifyEmail]=useVerifyEmailMutation();
  const[verifyUserExist]=useVerifyUserExistMutation()
  const[toBeContinued,setToBeContinued]=useState<boolean>(true);
  const[Continued,setContinued]=useState<boolean>(false);
  const [mail,setMail]=useState<string>("");
  const navigate=useNavigate()

  useEffect(() => {
    checkUserExistence();
  }, []);
  
  const checkUserExistence = async () => {
    if (emailUser) {
      try {
        const decodedToken: DecodedToken = jwtDecode(emailUser); 
        const userEmail = decodedToken.sub;

        const response = await verifyUserExist({ email: userEmail }).unwrap();

        if (response) {
          navigate(AUTHENTICATION);
          window.location.reload();
        } else {
          formData.email = emailUser; 
          setContinued(true);
        }
      } catch (error) {
        console.error('Failed to verify user existence:', error);
        navigate(AUTHENTICATION);
        window.location.reload();
      }
    }
  };

  const verifyEmailUser: (evt: FormEvent<HTMLFormElement>) => void = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    if(!email){
      toast.error("Enter Email please");
      return
    }
    if (!validateEmail(email)){
      toast.error("Email format incorrect");
      return
    }
    try {
      const response = await verifyEmail({ email }).unwrap(); 
      setToBeContinued(false);
      toast.success("Please Verify Your Email !");
      
    } catch (error: any) {
      if (error && error.data) {
        toast.error(error.data || "An unknown error occurred.");
      console.error("🚀 ~ error:", error);
    }
  };
}
  
    const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const isFormValid = formValidation();

    if (!isFormValid) {
      toast.error("Invalid Form");
      return;
    }

    try {
      const decodedToken: DecodedToken = jwtDecode(formData.email);
      const userEmail = decodedToken.sub;
      setMail(userEmail);

      const userData = await registerUser({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: userEmail,
        password: formData.password,
        mfaEnabled: formData.mfaEnabled
      }).unwrap();

      console.log("🚀 ~ userData:", userData);
      setIsMfaEnabled(userData.secretImageUri);
      toast.success("User registered successfully !");

      if (!userData.mfaEnabled) {
        setFormData(initialState);
        navigate(AUTHENTICATION);
        window.location.reload(); 
      }
    } catch (error: any) {
      if (error && error.data) {
        toast.error(error.data.message || "Registration failed.");
        console.error("🚀 ~ error:", error.message);
      } else {
        toast.error("An unknown error occurred.");
        console.error("🚀 ~ error:", error);
      }
    }
  };

  return (
    <>
      {!isMfaEnabled  && (
      <MDBContainer className='mt-5' >
      {toBeContinued && !Continued && (
        <>
           
              <form onSubmit={verifyEmailUser} style={{marginTop:"15%"}} >
              <ReactTyped
                    className='ms-5'
                    strings={[
                        "Let's Get Started ! First Step Enter your mail address"]}
                    typeSpeed={50}
                    backSpeed={100}
                    loop
                    style={{ color: '#6873C8', fontSize: '17px', fontWeight: 'bold' }}
                  />
                <MDBInput name='email'  value={email} onChange={handleChange} className='mb-4 mt-5' type='email' id='form8Example3' label='Email address' />
                <MDBBtn  type='submit' className='mb-4 mt-4' block>
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

        <FormControl fullWidth sx={{ m: 1 }}>
              <TextField error={!!errors.firstName} name='firstName' value={firstName} onChange={handleChange}
               size="small" label={errors.firstName? `${errors.firstName}`:"First name"} variant="outlined"
                  InputProps={
                    errors.firstName
                      ? {
                          endAdornment: (
                            <InputAdornment position='end'>
                              <i style={{ color: "red" }} className="fas fa-exclamation-circle trailing"></i>
                            </InputAdornment>
                          ),
                        }
                      : {}
                  }       
               >
              </TextField>
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }}>
              <TextField error={!!errors.lastName} name='lastName' value={lastName} onChange={handleChange}
               size="small" label={errors.lastName? `${errors.lastName}`:'Last name'} variant="outlined"
                  InputProps={
                    errors.lastName
                      ? {
                          endAdornment: (
                            <InputAdornment position='end'>
                              <i style={{ color: "red" }} className="fas fa-exclamation-circle trailing"></i>
                            </InputAdornment>
                          ),
                        }
                      : {}
                  }       
               >
              </TextField>
              </FormControl>
              <FormControl fullWidth sx={{ m: 1 }}>
              <TextField error={!!errors.password} name='password' value={password} onChange={handleChange} type='password'
               size="small" label={errors.password? `${errors.password}`:'Password'} variant="outlined"
                  InputProps={
                    errors.password
                      ? {
                          endAdornment: (
                            <InputAdornment position='end'>
                              <i style={{ color: "red" }} className="fas fa-exclamation-circle trailing"></i>
                            </InputAdornment>
                          ),
                        }
                      : {}
                  }       
               >
              </TextField>
              </FormControl>

              <FormControl fullWidth sx={{ m: 1 }}>
              <TextField error={!!errors.confirmPassword}  type='password' name='confirmPassword' value={confirmPassword} onChange={handleChange}
               size="small" label={errors.confirmPassword? `${errors.confirmPassword}`:'Repeat password' } variant="outlined"
                  InputProps={
                    errors.confirmPassword
                      ? {
                          endAdornment: (
                            <InputAdornment position='end'>
                              <i style={{ color: "red" }} className="fas fa-exclamation-circle trailing"></i>
                            </InputAdornment>
                          ),
                        }
                      : {}
                  }       
               >
              </TextField>
              </FormControl>
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
      <MDBContainer className='mb-4' style={{width:"80%"}} >
        <h5 className='title'>Set Up Two-Factor Authentication</h5>
        <img className='QRCode' src={isMfaEnabled} alt="QR Code" />
        <Code email={mail} password={password} stage={stage}/>
      </MDBContainer>
    )}
    
    
    </>
  

  );
}

export default Register;