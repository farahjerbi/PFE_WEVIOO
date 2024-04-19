import React, {  useEffect, useState } from 'react'
import './SimpleEmailTemplate.css'
import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader} from 'mdb-react-ui-kit'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import { useAddTemplateEmailMutation } from '../../../../redux/services/emailApi'
import { toast } from 'sonner'
import { EmailTemplate } from '../../../../models/email/EmailTemplate'
import { useLocation, useNavigate } from 'react-router-dom'
import { ADD_EMAIL_TEMPLATE, LIST_EMAIL_TEMPLATES, LIST_SMS_TEMPLATES } from '../../../../routes/paths'
import { Box, Button, FormControl, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from '@mui/material'
import Textarea from '@mui/joy/Textarea';
import { useDispatch } from 'react-redux'
import { setEmail } from '../../../../redux/state/emailSlice'
import InstructionsModal from '../../../../components/modals/InstructionsModal'
import { useAddTemplateSMSMutation } from '../../../../redux/services/smsApi'
import { SmsTemplate } from '../../../../models/sms/SmsTemplate'
import { setAddSMS, setSMSs } from '../../../../redux/state/smsSlice'
import { Language } from "../../../../models/sms/Language"
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
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
  const handleChangeLanguage =  (event: SelectChangeEvent) => {
    setFormData({ ...formData, language: event.target.value   });
  };
  

  const [formData, setFormData] = useState(initialState);
  const {name,language,subject,content}=formData;
  console.log("🚀 ~ CreateSimpleEmail ~ content:", content)
  const[addTemplateEmail]=useAddTemplateEmailMutation();
  const[addTemplateSMS]=useAddTemplateSMSMutation();
  const navigate = useNavigate();
  const dispatch=useDispatch();
  const [open,setOpen]=useState<boolean>(true);
  const [emojie,setEmojie]=useState<boolean>(false);
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

  const goBack=()=>{
    if(path && containsSMS(path)){
      navigate(LIST_SMS_TEMPLATES)
    }else{
      navigate(LIST_EMAIL_TEMPLATES)
    }
  }

  return (
    <div>
        <InstructionsModal show={open} onClose={()=>setOpen(false)}  />
         <BreadcrumSection />
            <MDBCard className='CardContainer mb-4'>
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
                <InputLabel error={!!errors.language} id="demo-simple-select-label">{errors.language? `${errors.language}`:"Language"}</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={language}
                  label="Language"
                  onChange={handleChangeLanguage}
                  variant="outlined"
                  >
               {Object.entries(Language).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                      {key}
                  </MenuItem>
              ))}
                              
                      </Select>
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
                  placeholder={errors.content? `${errors.content}`:"Add your content here ..."} 
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
                    path && containsSMS(path)  ? (
                      <>
                      <div className='d-flex flex-column'>
                      {emojie && ( 
                                                    <Picker data={data}  onEmojiSelect={(emoji: any) => { 
                                                      console.log("🚀 ~ CreateSimpleEmail ~ emoji:", emoji)
                                                      const syntheticEvent = {
                                                          target: {
                                                              name: 'content',
                                                              value: content + emoji?.native
                                                          }
                                                      };
                                                      handleChange(syntheticEvent as React.ChangeEvent<HTMLInputElement>); 
                                                  }} />
                      )}
                      <div className='d-flex'>
                      <img onClick={()=>setEmojie(!emojie)} src="../../../assets/emoji.png" style={{width:"10%",cursor:"pointer"}} alt="" /> 
                      <p className='ms-1 mt-3'>Choose emoji</p>
                      </div>

                      </div>
                 
                              <Typography sx={{ ml: 'auto' }}>
                                  {content.length} character(s)
                              </Typography>
                            </>
                  
                    ) : (
                        <>
                            <Typography sx={{ ml: 'auto' }}>
                                {content.length} character(s)
                            </Typography>
                        </>
                    )
                }                
                
                  sx={{ minWidth: 300 }}
                  
                />
                </FormControl>

              <div style={{display:"flex" ,justifyContent:"space-between"}}>
              <MDBBtn className='color_white' type='button' onClick={goBack}>Go Back</MDBBtn>
              <MDBBtn className='' type='submit'>Add Template</MDBBtn>
              </div>
              </form>
            </MDBCardBody>
        </MDBCard>
    </div>
  )
}

export default CreateSimpleEmail