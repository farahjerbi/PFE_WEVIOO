import { MDBBtn, MDBCol, MDBInput, MDBRow } from 'mdb-react-ui-kit'
import React, { FormEvent, useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css";
import './Contact.css'
import { useCreateMemberMutation } from '../../redux/services/usersApi';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { addContact, selectContactDetails, selectUser } from '../../redux/state/authSlice';
import { IAddContact, IContact } from '../../models/user/Contact';
import { isBase64UrlEncoded, isValidUrl, validateEmail, validatePhone } from '../../routes/Functions';

interface Props{
  onClose: () => void;
}
const Contact : React.FC<Props> = ({ onClose  }) => {
  const[createMember]=useCreateMemberMutation()
  const user=useSelector(selectUser)
  const contact=useSelector(selectContactDetails)
  const dispatch=useDispatch()
  const initialState={
    fullName:"" || contact?.fullName,
    email:"" || contact?.email ,
    phone:""  || contact?.phone ,
    whatsapp:""  || contact?.whatsapp,
    auth:"" || contact?.auth,
    endPoint:"" || contact?.endPoint,
    publicKey:"" || contact?.publicKey,
  }

  const [formData, setFormData] = useState(initialState);
  const {fullName,email,auth,phone,whatsapp,publicKey,endPoint}=formData;
  const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  const handleNumberChange = (name:string,value: string) => {
    setFormData({...formData,[name]:value})
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!fullName || !email || !phone || !auth || !publicKey || !endPoint || !whatsapp) {
      toast.warning("Please fill in all the form below!");
      return;
    }
   
    if ( fullName.length<=3 ) {
      toast.warning("FullName must have +3 caracters");
      return;
    }

    if (  auth === '') {
        toast.warning(`Contact's 'auth' field  empty.`);
        return;
    }

  if (publicKey === '' || !isBase64UrlEncoded(publicKey)) {
      toast.warning(` Contact's public key is invalid. It must be properly base64url encoded and 65 bytes long.`);
      return;
  }

  if (endPoint === '' || !isValidUrl(endPoint)) {
      toast.warning(`Contact's endpoint is invalid. It must be a valid URL.`);
      return;
  }

  if (email === '' || !validateEmail(email)) {
      toast.warning(`Contact's email is invalid.`);
      return;
  }

  if (phone === '' || !validatePhone(phone)) {
      toast.warning(` Contact's phone number is invalid.`);
      return;
  }

  if (whatsapp === '' || !validatePhone(whatsapp)) {
      toast.warning(`Contact's WhatsApp number is invalid.`);
      return;
  }
  
    const contactRes: IContact | IAddContact = {
      fullName,
      email,
      phone: phone || "",
      whatsapp: whatsapp || "",
      auth: auth || "",
      endPoint: endPoint || "",
      publicKey: publicKey || ""
    };
  
      await handleAddContact(contactRes as IAddContact);
  
    setFormData(initialState);
    onClose();
  };
  

  const handleAddContact = async (contactRes: IAddContact) => {
    try {
      const response = await createMember({ contact: contactRes, id: user?.id }).unwrap();
      dispatch(addContact(response));
      toast.success("Contact added successfully!");
    } catch (err) {
      toast.error('Error adding contact!');
      console.error("Error adding user:", err);
    }
  };
  

  
  return (
    
    <div className='add-contact'>
          <h4 className=''>Create a contact</h4>
            <form onSubmit={handleSubmit}>

        <div className='mt-3'>
        <div className='d-flex align-items-center mb-4'>
                <img className='me-2' src="../../../assets/who.png" style={{width:"6.3%"}} alt="" />
              <MDBInput label='FullName' name='fullName' value={fullName} onChange={(e) => handleChange(e)}/>
              </div>
              <div className='d-flex align-items-center mb-4'>
                <img className='me-2' src="../../../assets/gmail.png" style={{width:"6.3%"}} alt="" />
              <MDBInput name="email" label='Email' value={email} onChange={(e) => handleChange(e)} />
              </div>
              <MDBRow>
                <MDBCol md='6'>
                <div className='d-flex align-items-center mb-3'>
                <img className='me-2' src="../../../assets/sms-calendar.png" style={{width:"15%"}} alt="" />
                    <PhoneInput  country={'us'} value={phone}  onChange={(e) => handleNumberChange("phone", e)} containerClass='custom-phone-input' inputStyle={{ width: '100%' }} />
                </div>
                </MDBCol>

                <MDBCol md='6'>
                <div className='d-flex align-items-center'>
                <img className='me-2' src="../../../assets/whatsapp-calendar.png" style={{width:"15%"}} alt="" />
                    <PhoneInput country={'us'} value={whatsapp} onChange={(e) => handleNumberChange("whatsapp", e)} containerClass='custom-phone-input' inputStyle={{ width: '100%' }} />
                </div>
                </MDBCol>
            </MDBRow>
             <div className='d-flex align-items-center mb-4'>
                <img className='me-2' src="../../../assets/love.png" style={{width:"6.3%"}} alt="" />
              <MDBInput name='publicKey' label='Public Key' value={publicKey} onChange={(e) => handleChange(e)}  />
              </div>
               <div className='d-flex align-items-center mb-4'>
                <img className='me-2' src="../../../assets/locationn.png" style={{width:"6.3%"}} alt="" />
              <MDBInput name='endPoint' label='EndPoint' value={endPoint} onChange={(e) => handleChange(e)}  />
              </div>
               <div className='d-flex align-items-center mb-4'>
                <img className='me-2' src="../../../assets/padlock.png" style={{width:"6.3%"}} alt="" />
              <MDBInput name='auth' label='Auth' value={auth} onChange={(e) => handleChange(e)} />
              </div>
    </div>
    <MDBBtn type='submit' className='mt-4' >
        Create
    </MDBBtn>
    </form>
    </div>
  )
}

export default Contact

