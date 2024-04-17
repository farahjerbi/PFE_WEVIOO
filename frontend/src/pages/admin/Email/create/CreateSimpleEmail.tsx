import React, {  useState } from 'react'
import './SimpleEmailTemplate.css'
import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader} from 'mdb-react-ui-kit'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import { useAddTemplateEmailMutation } from '../../../../redux/services/emailApi'
import { toast } from 'sonner'
import { EmailTemplate } from '../../../../models/email/EmailTemplate'
import { useNavigate } from 'react-router-dom'
import { ADD_EMAIL_TEMPLATE, LIST_EMAIL_TEMPLATES } from '../../../../routes/paths'
import { Box, FormControl, InputAdornment, TextField, Typography } from '@mui/material'
import Textarea from '@mui/joy/Textarea';
import { useDispatch } from 'react-redux'
import { setEmail } from '../../../../redux/state/emailSlice'
import InstructionsModal from '../../../../components/modals/InstructionsModal'

const CreateSimpleEmail = () => {
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
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const [open,setOpen]=useState<boolean>(true);
  const handleAddTemplate: (evt: React.FormEvent<HTMLFormElement>) => void = async (e) => {
    e.preventDefault();
    const isFormValid = formValidation();
    if(isFormValid){
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
      dispatch(setEmail(emailTemplate));
      console.log("🚀 ~ emailData:", userData);
      toast.success("Template added successfully");
      setFormData(initialState);
      navigate(LIST_EMAIL_TEMPLATES)
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


              {/* <MDBTextArea  name='content' value={content} onChange={handleChange} 
               wrapperClass={`mb-4 ${errors.content ? "border-red-500" : ""}`} label='content' id='textAreaExample' rows={4} />
              {errors.content && <p className="text-red-500 text-sm mb-2">{errors.name}</p>} */}


              <div style={{display:"flex" ,justifyContent:"space-between"}}>
              <MDBBtn color='info' type='button' onClick={()=>navigate(ADD_EMAIL_TEMPLATE)}>Go Back</MDBBtn>
              <MDBBtn type='submit'>Add Template</MDBBtn>
              </div>
              </form>
            </MDBCardBody>
        </MDBCard>
    </div>
  )
}

export default CreateSimpleEmail