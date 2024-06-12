import { MDBBtn, MDBBtnGroup, MDBCol, MDBInput, MDBRow } from 'mdb-react-ui-kit'
import React from 'react'
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css";
import './Contact.css'
const AddContact = () => {
  return (
    <div className='add-contact'>
        <div className='mt-5'>

        <div className='d-flex align-items-center mb-4'>
                <img className='me-2' src="../../../assets/user.png" style={{width:"6.3%"}} alt="" />
              <MDBInput label='FullName'  />
              </div>
              <div className='d-flex align-items-center mb-4'>
                <img className='me-2' src="../../../assets/gmail.png" style={{width:"6.3%"}} alt="" />
              <MDBInput label='Email'  />
              </div>
              <MDBRow>
                <MDBCol md='6'>
                <div className='d-flex align-items-center mb-3'>
                <img className='me-2' src="../../../assets/sms-calendar.png" style={{width:"15%"}} alt="" />
                    <PhoneInput country={'us'} containerClass='custom-phone-input' inputStyle={{ width: '100%' }} />
                </div>
                </MDBCol>

                <MDBCol md='6'>
                <div className='d-flex align-items-center'>
                <img className='me-2' src="../../../assets/whatsapp-calendar.png" style={{width:"15%"}} alt="" />
                    <PhoneInput country={'us'} containerClass='custom-phone-input' inputStyle={{ width: '100%' }} />
                </div>
                </MDBCol>
            </MDBRow>
    </div>
    <MDBBtn className='mt-4' >
        Create
    </MDBBtn>
    </div>
  )
}

export default AddContact