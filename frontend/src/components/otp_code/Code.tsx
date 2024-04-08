import { MDBBtn, MDBInput } from 'mdb-react-ui-kit'
import { FormEvent, useState } from 'react'
import './Code.css'
import { OtpProps } from '../../models/OtpProps';
import { useVerifyOTPMutation } from '../../redux/services/authApi';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/state/authSlice';
import { AUTHENTICATION, DASHBOARD } from '../../routes/paths';

const Code= ({ email, password ,stage}: OtpProps) => {
    const [otp, setOTP] = useState(['', '', '', '', '', '']);
    const navigate =useNavigate();
    const dispatch = useDispatch();

    const[verifyOTP]=useVerifyOTPMutation();

    const handleInputChange = (index: number, value: string) => {
      const newOTP = [...otp];
      newOTP[index] = value;
      setOTP(newOTP);
    };
  
    const handleVerifyOTP : (evt: FormEvent<HTMLFormElement>) => void = async (
      e: FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault();
      const code = otp.join('');
      await verifyOTP({email,password,code})
      .unwrap()
      .then((userData: any) => {
      if(userData && stage==="register"){
        toast.success("OTP verified successfully")
        navigate(AUTHENTICATION)
      }
      if(userData && stage==="login"){
        dispatch(setUser({ user: userData.user, token: userData.token,role:userData.user.role}));
        toast.success("User logged In successfully !")
        navigate(DASHBOARD)
      }
    })
  }
  
    const isOTPComplete = () => {
      return otp.every((digit) => digit !== '');
    };
    
  return (
          <form onSubmit={handleVerifyOTP}>
          <label className='title-code mb-2'> Enter 6 digits Validation Code Generated by the app:</label>
          <div style={{ display: 'flex', justifyContent: 'center' ,marginBottom:'15px' }}>
          {otp.map((digit, index) => (
            <div key={index} style={{width:"60px", marginRight:'6px'}}>
              <MDBInput
                pattern="[0-9]*"
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                className='otp-input mb-5'
              />
            </div>
          ))}
          </div>
          {isOTPComplete() ? <MDBBtn type='submit' className='mb-4' block>
          Validate Code
        </MDBBtn> : <MDBBtn type='submit' disabled className='mb-4' block>
          Validate Code
        </MDBBtn>}
        
        </form>
   )
}

export default Code