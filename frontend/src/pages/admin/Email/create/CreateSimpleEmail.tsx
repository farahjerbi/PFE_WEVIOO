import React, { FormEvent, useState } from 'react'
import './SimpleEmailTemplate.css'
import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBInput, MDBTextArea } from 'mdb-react-ui-kit'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import { useAddTemplateEmailMutation } from '../../../../redux/services/emailApi'
import { toast } from 'sonner'
import { EmailTemplate } from '../../../../models/EmailTemplate'
import { useNavigate } from 'react-router-dom'
const CreateSimpleEmail = () => {
  const initialState={
    name: '',
    language: '',
    subject:'',
    content:''
  }
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const [formData, setFormData] = useState(initialState);
  const {name,language,subject,content}=formData;
  const[addTemplateEmail]=useAddTemplateEmailMutation();
  const navigate = useNavigate();
  const handleAddTemplate: (evt: React.FormEvent<HTMLFormElement>) => void = async (e) => {
    e.preventDefault();
    try {
      const emailTemplate: EmailTemplate = {
        name: formData.name,
        language: formData.language,
        state: 'SIMPLE',
        templateBody: {
          subject: formData.subject,
          content: formData.content
        }
      };
      
      const userData = await addTemplateEmail(emailTemplate).unwrap();
      console.log("🚀 ~ emailData:", userData);
      toast.success("Template added successfully");
      setFormData(initialState);
      navigate('/lisEmailTemplates')
    } catch (error) {
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);
    }
  };

  return (
    <div>
         <BreadcrumSection />
            <MDBCard className='CardContainer'>
            <MDBCardHeader className='header'>Create new template</MDBCardHeader>
            <MDBCardBody>
              <form onSubmit={handleAddTemplate}>
              <MDBInput  name='name' value={name} onChange={handleChange} wrapperClass='mb-4' label='Template Name' id='form1' type='text'/>
              <MDBInput  name='language' value={language} onChange={handleChange} wrapperClass='mb-4' label='Language' id='form1' type='text'/>
              <MDBInput  name='subject' value={subject} onChange={handleChange} wrapperClass='mb-4' label='Subject' id='form1' type='text'/>
              <MDBTextArea name='content' value={content} onChange={handleChange} wrapperClass='mb-4' label='content' id='textAreaExample' rows={4} />
              <div style={{display:"flex" ,justifyContent:"space-between"}}>
              <MDBBtn color='info'>View Template</MDBBtn>
              <MDBBtn type='submit'>Add Template</MDBBtn>
              </div>
              </form>
            </MDBCardBody>
        </MDBCard>
    </div>
  )
}

export default CreateSimpleEmail