import axios from 'axios';
import React, { useState } from 'react'
import BreadcrumSection from '../BreadcrumSection/BreadcrumSection';
import "./SearchAI.css"
import { MDBBtn, MDBCard, MDBCardBody, MDBContainer, MDBInput } from 'mdb-react-ui-kit';
import { useSelector } from 'react-redux';
import { selectToken } from '../../redux/state/authSlice';
interface Template {
    id: number;
    type: string;
    name: string;
    subject: string;
    body?: string;
    language: string;
  }
const SearchAI = () => {
    const [userDescription, setUserDescription] = useState('');
    const [matchedTemplates, setMatchedTemplates] = useState<Template[]>([]);
    const token=useSelector(selectToken)
    const handleSearch = async () => {
        try {
          if (token && token.startsWith('"') && token.endsWith('"')) {
            let tokeen = token.substring(1, token.length - 1);
            console.log("🚀 ~ handleSearch ~ tokeen:", tokeen)
        
        const response = await axios.post(
          'http://localhost:5000/api/search', 
          { description: userDescription }, 
          { headers: { 'Authorization': `Bearer ${tokeen}` } }
      );
      setMatchedTemplates(response.data);
    }
        } catch (error) {
            console.error('Error fetching template:', error);
        }
    };
  return (
    <>
    <BreadcrumSection/>
    <div className='container-search '>
    <MDBContainer fluid style={{width:"80%"}}>

      <div className="p-5 bg-image" style={{backgroundImage:`url('../../../assets/aiseacrh.jpg')`, height: '300px'}}></div>

      <MDBCard className='mx-5 mb-5 p-5 shadow-5' style={{marginTop: '-100px', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)'}}>
        <MDBCardBody className='p-5 text-center'>

          <MDBInput value={userDescription} onChange={(e) => setUserDescription(e.target.value)} wrapperClass='mb-4' label='Enter a description for the wished template' />
        
          <MDBBtn className='w-100 mb-4 color_blue'  onClick={handleSearch}>Search Template</MDBBtn>

        </MDBCardBody>
      </MDBCard>

      </MDBContainer>
            {matchedTemplates.length > 0 ? (
                    <div>
                        <h3>Matched Templates:</h3>
                        {matchedTemplates.map((template, index) => (
                            <div key={index}>
                                <p>ID: {template.id}</p>
                                <p>Type: {template.type}</p>
                                <hr />
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No matching templates found.</p>
                )}
        </div>     
    </>

  )
}

export default SearchAI