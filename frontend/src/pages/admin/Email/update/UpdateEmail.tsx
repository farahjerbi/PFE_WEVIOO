import React from 'react'
import './UpdateEmail.css'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBInput, MDBRow } from 'mdb-react-ui-kit'

const UpdateEmail = () => {
  return (
    <>
    <BreadcrumSection/>

    <div className='update_container' >

        <div className="p-5 bg-image" style={{backgroundImage: 'url(https://mdbootstrap.com/img/new/textures/full/171.jpg)', height: '300px'}}></div>

        <MDBCard className='mx-5 mb-5 p-5 shadow-5' style={{marginTop: '-100px', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)'}}>
        <MDBCardBody className='p-5 text-center'>

            <h2 className="fw-bold mb-5">Update Template</h2>

            <MDBRow>
            <MDBCol col='6'>
                <MDBInput wrapperClass='mb-4' label='First name' id='form1' type='text'/>
            </MDBCol>

            <MDBCol col='6'>
                <MDBInput wrapperClass='mb-4' label='Last name' id='form1' type='text'/>
            </MDBCol>
            </MDBRow>

            <MDBInput wrapperClass='mb-4' label='Email' id='form1' type='email'/>
            <MDBInput wrapperClass='mb-4' label='Password' id='form1' type='password'/>


            <MDBBtn className='w-100 mb-4' >sign up</MDBBtn>


        </MDBCardBody>
        </MDBCard>

        </div>
    
    </>
  )
}

export default UpdateEmail