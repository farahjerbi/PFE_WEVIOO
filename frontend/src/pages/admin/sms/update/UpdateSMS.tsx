import React, { useEffect, useState } from 'react'
import './UpdateSMS.css'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import { selectCurrentSms, setSelectedSms, setUpdateSMS } from '../../../../redux/state/smsSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBInput, MDBRow, MDBSpinner, MDBTextArea } from 'mdb-react-ui-kit'
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from '@mui/material'
import { Language, getLanguageName } from "../../../../models/sms/Language"
import Textarea from '@mui/joy/Textarea'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { useGetSMSTemplateByIdMutation, useUpdateSMSTemplateMutation } from '../../../../redux/services/smsApi'
import { toast } from 'sonner'
import { LIST_SMS_TEMPLATES } from '../../../../routes/paths'
const UpdateSMS = () => {
    const dispatch=useDispatch()
    const template=useSelector(selectCurrentSms)
    const navigate=useNavigate();
    const [getSMSTemplateById]=useGetSMSTemplateByIdMutation()
    const{id}=useParams();
    useEffect(() => {
      fetchData();
    },[]);
  
      
    const fetchData = async () => {
      try {
          const template = await getSMSTemplateById(Number(id)).unwrap();
          dispatch(setSelectedSms(template))
      } catch (error) {
        toast.error("Error! Yikes");
        console.error("🚀 ~ error:", error);
      }
    };
  
    const initialState={
        name: template?.name,
        language:getLanguageName(template?.language ?? "unknown"),
        content:template?.content,
        subject:template?.subject,
    }
    const [formData, setFormData] = useState(initialState);
    const {name,content,subject,language}=formData;
    const [loading, setLoading] = useState<boolean>(false);
    const [emojie,setEmojie]=useState<boolean>(false);
    const[updateSMSTemplate]=useUpdateSMSTemplateMutation()
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({...formData, [e.target.name]: e.target.value})
      }
      const handleChangeLanguage =  (event: SelectChangeEvent) => {
        setFormData({ ...formData, language: event.target.value   });
      };

      const handleUpdateTemplate: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        setLoading(true); 
      
        if (!template) {
          console.error('Template data is missing');
          return;
        }else{
            try {
                const emailTemplateWithId = {
                    id: typeof template.id === 'string' ? parseInt(template.id) : template.id,
                    name: formData.name || "",
                    language: formData.language || "",
                    subject: formData.subject || "",
                    content: formData.content || ""
                };
              await updateSMSTemplate({smsTemplate:formData,id:template.id});
              dispatch(setUpdateSMS(emailTemplateWithId));        
              toast.success("Template updated successfully");
      
              navigate(LIST_SMS_TEMPLATES)
            
            
          } catch (error) {
            console.error('Error updating template:', error);
          }finally {
            setLoading(false); 
        }
        }
  
      };
      
 
  return (
    <>
        <BreadcrumSection/>

            <div className='update_sms_container' >
            <div className="p-5 bg-image" style={{backgroundImage: 'url("../../../assets/updatee.png")', height: '300px'}}></div>
            <form onSubmit={handleUpdateTemplate} >
        <MDBCard className='mx-5 mb-5 p-5 shadow-5' style={{marginTop: '-40px', background: 'hsla(0, 0%, 100%, 0.8)', backdropFilter: 'blur(30px)'}}>
        <MDBCardBody className='p-5 text-center'>

            <h2 className="fw-bold mb-5">SMS Template</h2>

              <MDBRow>
              <MDBCol col='6'>
                  <MDBInput name='name' value={name} onChange={handleChange} wrapperClass='mb-4' label='Name' type='text'/>
              </MDBCol>
  
              <MDBCol col='6'>
              <FormControl  fullWidth sx={{ m:-1 }}>
                <InputLabel id="demo-simple-select-label">Language</InputLabel>
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
              </MDBCol>
              </MDBRow>
  
              <MDBInput  name='subject' value={subject} onChange={handleChange}  wrapperClass='mb-4' label='Subject' type='text'/>
              <FormControl fullWidth sx={{ m: 1 }}>
              <Textarea
                  name='content'
                  value={content}
                  onChange={handleChange} 
                  minRows={2}
                  maxRows={4}
                  placeholder="Add your content here ..."
                  startDecorator={
                    <Box sx={{ display: 'flex', gap: 114, flex: 1 }}>      
                    <img src="../../../assets/Mail sent.png" alt="" style={{width:"6%"}} />    
                    </Box>
                  }
                  endDecorator={
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
                                  {content?.length} character(s)
                              </Typography>
                            </>
                  
                }                
                
                  sx={{ minWidth: 300 }}
                  
                />
                </FormControl>
  

                {loading && (
                    <div className='d-flex justify-content-center mt-4'>
                    <MDBBtn disabled className='btn w-50 ' >
                    <MDBSpinner size='sm' role='status' tag='span' className='me-2' />
                        Loading...
                    </MDBBtn>
                    </div>

                )}
               {!loading && ( <MDBBtn className='w-100 mb-4 color_baby_bluee' type='submit' >Update</MDBBtn>)}

            
            </MDBCardBody>
        </MDBCard>
        </form>
        </div>
    </>

          )
}

export default UpdateSMS