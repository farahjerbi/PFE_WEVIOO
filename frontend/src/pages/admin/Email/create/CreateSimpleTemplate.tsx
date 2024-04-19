import React, {  useEffect, useState } from 'react'
import './SimpleEmailTemplate.css'
import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader} from 'mdb-react-ui-kit'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import { useAddTemplateEmailMutation } from '../../../../redux/services/emailApi'
import { toast } from 'sonner'
import { EmailTemplate } from '../../../../models/email/EmailTemplate'
import { useLocation, useNavigate } from 'react-router-dom'
import { ADD_EMAIL_TEMPLATE, LIST_EMAIL_TEMPLATES, LIST_SMS_TEMPLATES } from '../../../../routes/paths'
import { Box, FormControl, InputAdornment, TextField, Typography } from '@mui/material'
import Textarea from '@mui/joy/Textarea';
import { useDispatch } from 'react-redux'
import { setEmail } from '../../../../redux/state/emailSlice'
import InstructionsModal from '../../../../components/modals/InstructionsModal'
import { useAddTemplateSMSMutation } from '../../../../redux/services/smsApi'
import { SmsTemplate } from '../../../../models/sms/SmsTemplate'
import { setAddSMS, setSMSs } from '../../../../redux/state/smsSlice'

const CreateSimpleEmail = () => {
  const location = useLocation();
  const[path,setPath]=useState<string>();
  useEffect(() => {
    const pathname = location.pathname;
    setPath(pathname)
    },[]);
    console.log("🚀 ~ CreateSimpleEmail ~ path:", path);

    function containsSMS(path:string) {
      return path.toLowerCase().includes('sms');
  }

  const initialState={
    name: '',
    language: '',
    subject:'',
    content:''
  }
  const [errors,setErrors] = useState(
    {
      name: '',
      language: '',
      subject:'',
      content:''
    }
)
const formValidation = () => {
        
  let etat = true ;
  let localError = {
    name: '',
    language: '',
    subject:'',
    content:''
  }
  if (!name.trim()) {
    localError.name = "Name Required" ;
     etat = false;}

   if(!content.trim() || content.length < 23  ){
      localError.content = " Content required and 23 caracters min" ;
      etat = false;
   }

   if(!language.trim() ){
      localError.language = " Language required" ;
      etat = false;
   }
 
   if(!subject.trim() ){
      localError.subject = " Subject required" ;
      etat = false;
   }
 
   setErrors(localError)
   return etat ; 
    
}

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({...formData, [e.target.name]: e.target.value})
  }

  const [formData, setFormData] = useState(initialState);
  const {name,language,subject,content}=formData;
  const[addTemplateEmail]=useAddTemplateEmailMutation();
  const[addTemplateSMS]=useAddTemplateSMSMutation();
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const [open,setOpen]=useState<boolean>(true);
  const handleAddTemplate: (evt: React.FormEvent<HTMLFormElement>) => void = async (e) => {
    e.preventDefault();
    const isFormValid = formValidation();
    if(isFormValid){
    try {
      if(path && containsSMS(path)){
        const smsTemplate: SmsTemplate = {
          name: formData.name,
          language: formData.language,
          subject: formData.subject,
          content: formData.content
          }
        
        const smsData = await addTemplateSMS(smsTemplate).unwrap();
        dispatch(setAddSMS(smsData))
        toast.success("Template added successfully");
        setFormData(initialState);
        navigate(LIST_SMS_TEMPLATES)
      }else{
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
        dispatch(setEmail(emailTemplate));
        console.log("🚀 ~ emailData:", userData);
        toast.success("Template added successfully");
        setFormData(initialState);
        navigate(LIST_EMAIL_TEMPLATES)
      }
      
    } catch (error) {
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);
    }}
  };

  return (
    <div>
        <InstructionsModal show={open} onClose={()=>setOpen(false)}  />
         <BreadcrumSection />
            <MDBCard className='CardContainer'>
            <MDBCardHeader className='header'>Create new template</MDBCardHeader>
            <MDBCardBody>
              <form onSubmit={handleAddTemplate}>
              <FormControl fullWidth sx={{ m: 1 }}>
              <TextField error={!!errors.name} name='name' value={name} onChange={handleChange}
               size="small" label={errors.name? `${errors.name}`:"Name"} variant="outlined"
                  InputProps={
                    errors.name
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
              <TextField error={!!errors.language} name='language' value={language} onChange={handleChange}
               size="small" label={errors.language? `${errors.language}`:"Language"} variant="outlined"
                  InputProps={
                    errors.language
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
              <TextField error={!!errors.subject} name='subject' value={subject} onChange={handleChange}
               size="small" label={errors.subject? `${errors.subject}`:"Subject"} variant="outlined"
                  InputProps={
                    errors.subject
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
              <Textarea
                  name='content'
                  value={content}
                  onChange={handleChange} 
                  minRows={2}
                  maxRows={4}
                  placeholder={errors.content? `${errors.content}`:"Add your Html content here ..."} 
                  error={!!errors.content}
                  startDecorator={
                    <Box sx={{ display: 'flex', gap: 114, flex: 1 }}>      
                    <img src="../../../assets/Mail sent.png" alt="" style={{width:"6%"}} />    
                    {errors.content && (      
                      <i  style={{ color: "red"  }} className="fas fa-exclamation-circle trailing"></i>
                                        )}     
                    </Box>
                  }
                  endDecorator={
                    <Typography sx={{ ml: 'auto' }}>
                        {content.length} character(s)
                      </Typography>
                  }
                  sx={{ minWidth: 300 }}
                  
                />
                </FormControl>

              <div style={{display:"flex" ,justifyContent:"space-between"}}>
              <MDBBtn color='info' type='button' onClick={()=>navigate(ADD_EMAIL_TEMPLATE)}>Go Back</MDBBtn>
              <MDBBtn  type='submit'>Add Template</MDBBtn>
              </div>
              </form>
            </MDBCardBody>
        </MDBCard>
    </div>
  )
}

export default CreateSimpleEmail