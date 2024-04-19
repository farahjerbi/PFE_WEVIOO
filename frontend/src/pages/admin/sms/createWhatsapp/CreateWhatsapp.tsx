import { useState } from "react"
import BreadcrumSection from "../../../../components/BreadcrumSection/BreadcrumSection"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader} from 'mdb-react-ui-kit'
import { Box, FormControl, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, TextField, Typography } from "@mui/material"
import Textarea from "@mui/joy/Textarea"
import { ADD_SMS_TEMPLATE, LIST_SMS_TEMPLATES } from "../../../../routes/paths"
import './CreateWhatsapp.css'
import { Category } from "../../../../models/sms/Category"
import { useAddTemplateWhatsappMutation } from "../../../../redux/services/whatsAppApi"
import { WhatsAppTemplatePayload } from "../../../../models/sms/WhatsAppTemplatePayload"
import { toast } from "sonner"
import { Language } from "../../../../models/sms/Language"
import { getTemplatesWhatsapp } from "../../../../redux/state/smsSlice"
import { AppDispatch } from "../../../../redux/store"
const CreateWhatsapp = () => {
  const initialState={
    name: '',
    language: '',
    subject:'',
    header:"",
    footer:"",
    body:"",
    category:Category.MARKETING
  }
  const [errors,setErrors] = useState(
    {
      name: '',
      subject:'',
      body:'',
      header:"",
      footer:"",
    }
)

const formValidation = () => {
        
  let etat = true ;
  let localError = {
    name: '',
    subject:'',
    body:'',
    header:"",
    footer:"",
  }
  if (!name.trim()) {
    localError.name = "Name Required" ;
     etat = false;}

   if(!body.trim() || body.length < 15  ){
      localError.body = " Content required and 23 caracters min" ;
      etat = false;
   }

   setErrors(localError)
   return etat ; 
    
}

const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  setFormData({...formData, [e.target.name]: e.target.value})
}
// const handleChangeLanguage =  (event: SelectChangeEvent) => {
//   setFormData({ ...formData, language: event.target.value   });
// };


const [formData, setFormData] = useState(initialState);
const {name,language,body,header,footer,category}=formData;
const navigate = useNavigate();
const dispatch: AppDispatch = useDispatch(); 
const[addTemplateWhatsapp]=useAddTemplateWhatsappMutation();

const handleAddTemplate: (evt: React.FormEvent<HTMLFormElement>) => void = async (e) => {
  e.preventDefault();
  console.log("Handle Add Template Called");
  const isFormValid = formValidation();
  if(isFormValid){
    const whatsappTemplate: WhatsAppTemplatePayload = {
      name: formData.name,
      language: formData.language,
      category:formData.category,
      structure:{
        body:{
          text:formData.body,
          format:"TEXT"
        },
        header:{
          text:formData.header,
          format:"TEXT"
        },    
        footer:{
          text:formData.footer,
          format:"TEXT"
        },
        type:"TEXT"
      }
      }
      console.log("🚀 ~ consthandleAddTemplate: ~ whatsappTemplate: WhatsAppTemplatePayload.formData:",formData)
    console.log("🚀 ~ consthandleAddTemplate: ~ whatsappTemplate:", whatsappTemplate)
  try {
        const smsData = await addTemplateWhatsapp(whatsappTemplate).unwrap();
        dispatch(getTemplatesWhatsapp())
      toast.success("Template added successfully");
      setFormData(initialState);
      navigate(LIST_SMS_TEMPLATES)
  } catch (error) {
    toast.error("Error! Yikes");
    console.error("🚀 ~ error:", error);
  }}
};
  return (
    <>
            <BreadcrumSection />
            <MDBCard className='CardContainer'>
            <MDBCardHeader className='header'>Create new template</MDBCardHeader>
            <MDBCardBody>
              <form onSubmit={handleAddTemplate} >
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
              <TextField  name='category' value={category}
               size="small" label="Category : MARKETING" variant="outlined" disabled     
               ></TextField>
              </FormControl>

              <FormControl fullWidth sx={{ m: 1 }}>
                <InputLabel id="demo-simple-select-label">Language</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={language}
                  label="Language"
                  // onChange={handleChangeLanguage}
                  >
               {Object.entries(Language).map(([key, value]) => (
                  <MenuItem key={value} value={value}>
                      {key}
                  </MenuItem>
              ))}
                              
                      </Select>
              </FormControl>
             

              <FormControl fullWidth sx={{ m: 1 }}>
              <TextField error={!!errors.header} name='header' value={header} onChange={handleChange}
               size="small" label={errors.header? `${errors.subject}`:"Header"} variant="outlined"
                  InputProps={
                    errors.header
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
                  name='body'
                  value={body}
                  onChange={handleChange} 
                  minRows={2}
                  maxRows={4}
                  placeholder={errors.body? `${errors.body}`:"Add your message content here ..."} 
                  error={!!errors.body}
                  startDecorator={
                    <Box sx={{ display: 'flex', gap: 114, flex: 1 }}>      
                    <img src="../../../assets/Mail sent.png" alt="" style={{width:"6%"}} />    
                    {errors.body && (      
                      <i  style={{ color: "red"  }} className="fas fa-exclamation-circle trailing"></i>
                                        )}     
                    </Box>
                  }
                  endDecorator={
                    <Typography sx={{ ml: 'auto' }}>
                        {body.length} character(s)
                      </Typography>
                  }
                  sx={{ minWidth: 300 }}
                  
                />
                </FormControl>

                <FormControl fullWidth sx={{ m: 1 }}>
              <TextField error={!!errors.footer} name='footer' value={footer} onChange={handleChange}
               size="small" label={errors.footer? `${errors.subject}`:"Footer"} variant="outlined"
                  InputProps={
                    errors.footer
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


              <div style={{display:"flex" ,justifyContent:"space-between"}}>
              <MDBBtn  color='secondary' type='button' onClick={()=>navigate(ADD_SMS_TEMPLATE)}>Go Back</MDBBtn>
              <MDBBtn className='color_white' type='submit'>Add Template</MDBBtn>
              </div>
              </form>
            </MDBCardBody>
        </MDBCard>
    </>
  )
}

export default CreateWhatsapp