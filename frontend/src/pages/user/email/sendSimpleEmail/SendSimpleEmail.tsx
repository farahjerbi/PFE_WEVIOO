import { MDBBtn, MDBCard, MDBCardBody, MDBCheckbox, MDBContainer, MDBIcon, MDBInput, MDBRow, MDBSpinner} from 'mdb-react-ui-kit'
import './SendSimpleEmail.css'
import EmailInput from '../../../../components/emailInput/EmailInput'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import {  useGetAllEmailTemplatesMutation, useGetTemplateByIdMutation, useGetTemplatePlaceholdersMutation } from '../../../../redux/services/emailApi';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import ScheduleModal from '../../../../components/modals/ScheduleModal';
import { selectUser } from '../../../../redux/state/authSlice';
import { useDispatch, useSelector } from 'react-redux';
import { LIST_EMAIL_TEMPLATES } from '../../../../routes/paths';
import { Button, styled } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection';
import { selectEmail, setSelectedEmail } from '../../../../redux/state/emailSlice';
import InstructionsUserModal from '../../../../components/modals/InstructionsUserModal';
import React from 'react';
const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});
interface SendSimpleEmailProps {
  isScheduled: boolean;
}
const SendSimpleEmail : React.FC<SendSimpleEmailProps> = ({isScheduled }) => {
    const user=useSelector(selectUser)
    const {id}=useParams()
    const dispatch=useDispatch()
    const [isSignatureEnabled, setIsSignatureEnabled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [schedularModal, setSchedularModal] = useState<boolean>(false);
    const [recipientEmails, setRecipientEmails] = useState<string[]>([]);
    const [ccEmails, setCCEmails] = useState<string[]>([]);
    const[placeholders,setPlaceholders]= useState<string[]>([]);
    const[page,setPage]=useState<boolean>(false)
    const [placeholdersValues, setPlaceholdersValues] = useState<{ [key: string]: string }>({});
    const [fileInput, setFileInput] = useState<File | null>(null);
    const [replyTo,setReplyTo]=useState<string>('');
    const[isSentSeparately,setIsSentSeparately]=useState<boolean>(false);
    const navigate=useNavigate()
    const[getTemplatePlaceholders]=useGetTemplatePlaceholdersMutation()
    const[getTemplateById]=useGetTemplateByIdMutation()
    const template=useSelector(selectEmail)
    const [openInstruction, setOpenInstruction] = React.useState<boolean>(true);
    useEffect(() => {
        fetchDataTemplate();
        fetchData();
      },[]);

    const fetchData = async () => {
        try {
          const response = await getTemplatePlaceholders(id).unwrap();
          setPlaceholders(response); 
          console.error("🚀 ~ error:", placeholders);
        } catch (error) {
          toast.error("Error! Yikes");
          console.error("🚀 ~ error:", error);
        }
      };

      const fetchDataTemplate = async () => {
        try {
          const response = await getTemplateById(id).unwrap();
          dispatch(setSelectedEmail(response))
          console.error("🚀 ~ error:", placeholders);
        } catch (error) {
          toast.error("Error! Yikes");
          console.error("🚀 ~ error:", error);
        }
      };

      const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        setIsSignatureEnabled(event.target.checked);
    };


      const handleInputChange = (key: string, value: string ) => {
        setPlaceholdersValues((prevPlaceholders) => ({
            ...prevPlaceholders,
            [key]: value.toString()
        }));
    };

    const handleSubmit: (evt: FormEvent<HTMLFormElement>) => void = async (
        e: FormEvent<HTMLFormElement>
      ) => {
        e.preventDefault();
        setLoading(true); 
        const formData = new FormData();
        recipientEmails.forEach(email => formData.append('recipients', email));
        ccEmails.forEach(email => formData.append('cc', email));
        formData.append('replyTo', replyTo);
        if (fileInput) {
            formData.append('attachment', fileInput);
        }
        formData.append('requestBody',JSON.stringify(placeholdersValues))
        formData.append('id',String(user?.id))
        formData.append('addSignature',String(isSignatureEnabled))
        formData.append('isSentSeparately',String(isSentSeparately))
        try {
          const response = await axios.post(`http://localhost:8099/apiEmail/sendEmail/${template?.id}`, formData);
          
          if (response.status === 200) {
            console.log("🚀 ~ Profile ~ response:", response);
            toast.success("Email sent Successfully !");
            navigate(LIST_EMAIL_TEMPLATES)
          }
        } catch (err) {
          toast.error('Error!')
          console.error("Error updating user:", err);
        }
        finally {
            setLoading(false); 
        }

      }

    
      const handleUpdate = () => {
        setSchedularModal(false)
            };

  return (
    <>
          <BreadcrumSection/>
          <InstructionsUserModal show={openInstruction} onClose={()=>setOpenInstruction(false)}  />

          <MDBContainer className="my-5 gradient-form ">
    <MDBRow className='d-flex'>
        <MDBCard className='mt-5 mb-5 ' style={{width:"55%",height:"104vh",
                background: 'hsla(0, 0%, 100%, 0.55)',
                backdropFilter: 'blur(30px)',
            }}>
          <MDBCardBody>
          <div className="text-center">
            <img src="../../../assets/Mail sent.png"
            style={{width: '185px'}} alt="logo" />
            <h2>Send Email</h2>
        </div>
        <form  onSubmit={handleSubmit} >

{!page && (<>
    <EmailInput label="To:" onChange={setRecipientEmails} />
    <EmailInput label="CC:" onChange={setCCEmails} />
    <MDBInput value={replyTo} onChange={(e)=>setReplyTo(e.target.value)} wrapperClass='mb-4 mt-4' label='Reply To' name="email" type="text"/>
    <div className='d-flex'>
      <div className='text-center'>
          <MDBCheckbox
          wrapperClass='d-flex mb-3 mt-4'
          label='Add my signature'
          name='isSignatureEnabled'
          checked={isSignatureEnabled}
          onChange={handleCheckboxChange}
          />
          <p>(if exists)</p>
      </div>
      {!isScheduled && (
        <div className='text-center mt-4' style={{marginLeft:"30%"}}>
               <Button
                        className='mb-4 '
                        component="label"
                        role={undefined}
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                      >
                        Upload File
                        <VisuallyHiddenInput accept="*/*" onChange={(e) => setFileInput(e.target.files && e.target.files[0])} className='mb-4'  type="file" />
                      </Button>
        </div>
      )}  
    </div>
    <MDBBtn onClick={()=>setPage(!page)} className='btn mt-5 mb-2' color='secondary' >Next <MDBIcon  icon="arrow-right" style={{marginLeft:"5px"}} /> </MDBBtn> 
    </>
)}

{page && (<> 


            <div>
            {Object.keys(placeholders).length > 0 && (
                  <h3>Dynamic Inputs Based on Placeholders</h3>
                )}
                {placeholders.map((placeholder) => (
                    <div key={placeholder}>
                        <label>{placeholder}</label>
                        <MDBInput
                            required
                            type="text"
                            onChange={(e) => handleInputChange(placeholder, e.target.value)}
                        />
                    </div>
        ))}
    </div>
    {loading && (
        <div className='d-flex justify-content-center mt-4'>
        <MDBBtn disabled className='btn w-50 ' >
        <MDBSpinner size='sm' role='status' tag='span' className='me-2' />
            Loading...
        </MDBBtn>
        </div>

    )}
    {!loading && (
    <div className='d-flex justify-content-between mt-4'>
    {!isScheduled && (
      <>
      {!template?.templateBody.tags && (<>
            <MDBBtn className='btn w-30 ' color='primary' type='submit' onClick={()=>setIsSentSeparately(false)}> 
            <MDBIcon  icon="mail-bulk" style={{marginRight:"5px"}} /> Send Bulk </MDBBtn>  
          </> )}
        <MDBBtn className='btn w-30 ' color='info' type='submit'onClick={()=>setIsSentSeparately(true)}> 
         <MDBIcon  icon="envelope" style={{marginRight:"5px"}} /> Send Separately </MDBBtn>  
        <MDBBtn className='btn ' color='secondary' onClick={()=>setPage(!page)} > <MDBIcon  icon="arrow-left" style={{marginRight:"5px"}} /> Previous  </MDBBtn>

      </>
    )}
      {isScheduled && (
        <>  
        <MDBBtn onClick={(e) => { e.preventDefault(); setSchedularModal(true)}} className='btn w-50 ' color='primary' > 
        <MDBIcon  icon="envelope" style={{marginRight:"5px"}} /> Schedule  </MDBBtn>  
        <MDBBtn className='btn ' color='secondary' onClick={()=>setPage(!page)} > <MDBIcon  icon="arrow-left" style={{marginRight:"5px"}} /> Previous  </MDBBtn>
          </>
    
    )}
    </div>
    
     )}
      <ScheduleModal templateId={template?.id} recipientEmails={recipientEmails} cc={ccEmails} id={user?.id} replyTo={replyTo}
      addSignature={isSignatureEnabled} show={schedularModal} placeholdersValues={placeholdersValues} 
        onClose={handleUpdate} /> 

    </>
    )}

</form>
          </MDBCardBody>

   
      
        </MDBCard>

        <img src="../../../assets/mails.png" alt="" className='mt-5' style={{width:"60%",height:"104vh",marginLeft:"-180px"}}/>


    </MDBRow>

    </MDBContainer>  
    </>

)
}

export default SendSimpleEmail