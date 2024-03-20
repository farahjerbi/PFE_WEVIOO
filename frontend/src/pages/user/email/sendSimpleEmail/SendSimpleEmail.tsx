import {MDBBadge, MDBBtn, MDBCard, MDBCardBody, MDBCheckbox, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow, MDBSpinner, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit'
import './SendSimpleEmail.css'
import EmailInput from '../../../../components/emailInput/EmailInput'
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { useGetDesignTemplateMutation, useGetTemplateByIdMutation, useGetTemplatePlaceholdersMutation } from '../../../../redux/services/emailApi';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { EmailTemplate } from '../../../../models/EmailTemplate';
import EmailEditor ,{EmailEditorProps,EditorRef} from 'react-email-editor';
import ScheduleModal from '../../../../components/modals/ScheduleModal';
interface SendSimpleEmailProps {
  isScheduled: boolean;
}
const SendSimpleEmail : React.FC<SendSimpleEmailProps> = ({isScheduled }) => {
    const { id } = useParams();
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
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
    const[template,setTemplate]=useState<EmailTemplate>();
    const emailEditorRef = useRef<EditorRef|null>(null); 
    const [templateDesign,setTemplateDesign]= useState<any>();
    const navigate=useNavigate()
    const[getTemplatePlaceholders]=useGetTemplatePlaceholdersMutation()
    const[getTemplateById]=useGetTemplateByIdMutation()
    const[getDesignTemplate]=useGetDesignTemplateMutation();

    useEffect(() => {
        fetchData();
      }, []);

    const fetchData = async () => {
        try {
          const response = await getTemplatePlaceholders(id).unwrap();
          const responseTemplate = await getTemplateById(id).unwrap();
          setPlaceholders(response); 
          setTemplate(responseTemplate)
          if(responseTemplate.state ==="COMPLEX"){
            const design = await getDesignTemplate(Number(id)).unwrap();
            setTemplateDesign(design);
          }
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
        formData.append('id',user.id)
        formData.append('addSignature',String(isSignatureEnabled))
        try {
          const response = await axios.post(`http://localhost:8088/api/email/sendEmail/${id}`, formData);
          
          if (response.status === 200) {
            console.log("🚀 ~ Profile ~ response:", response);
            toast.success("Email sent Successfully !");
            navigate('/listEmailTemplates')
          }
        } catch (err) {
          toast.error('Error!')
          console.error("Error updating user:", err);
        }
        finally {
            setLoading(false); 
        }

      }

     
      const onLoad: EmailEditorProps['onLoad'] = (unlayer) => {
        console.log('onLoad', unlayer);
        unlayer.loadDesign(templateDesign);
        unlayer?.showPreview('desktop');
      };
    
      const handleUpdate = () => {
        setSchedularModal(false)
            };

  return (
    
    <MDBContainer className="my-5 gradient-form">
    <MDBRow>
    {templateDesign && (
              <MDBCard className='mb-4' >
              <MDBCardBody>
            <div style={{ width: "30%" }} className='d-flex flex-column align-items-center'>
              <div className="email-editor-wrapper">
              <EmailEditor
                  ref={emailEditorRef}
                  onLoad={onLoad}
                  minHeight={"70vh"}
              />
          </div>
            </div>
            </MDBCardBody>
            </MDBCard>
        )}
    <MDBCol col='6' className="mb-5">
        <div className="d-flex flex-column ms-5">

        <div className="text-center">
            <img src="../../../assets/sendMail.png"
            style={{width: '185px'}} alt="logo" />
            <h2>Send Email</h2>
        </div>
        <form encType="multipart/form-data" method='POST'  onSubmit={handleSubmit} >

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
              {isScheduled && (
                <div className='text-center mt-4' style={{marginLeft:"60px"}}>
                <p>Add Attachement : </p>
                <input type='file'  accept="*/*" onChange={(e) => setFileInput(e.target.files && e.target.files[0])}  className='mb-4' />
                </div>
              )}  
            </div>
            <MDBBtn onClick={()=>setPage(!page)} className='btn' color='secondary' >Next <MDBIcon  icon="arrow-right" style={{marginLeft:"5px"}} /> </MDBBtn> 
            </>
        )}

        {page && (<> 


                    <div>
                        <h2>Dynamic Inputs Based on Placeholders</h2>
                        {placeholders.map((placeholder) => (
                            <div key={placeholder}>
                                <label>{placeholder}</label>
                                <MDBInput
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
            {isScheduled && (
              <>
                <MDBBtn className='btn w-50 ' color='primary' type='submit'> <MDBIcon  icon="envelope" style={{marginRight:"5px"}} /> Send  </MDBBtn>  
                <MDBBtn className='btn ' color='secondary' onClick={()=>setPage(!page)} > <MDBIcon  icon="arrow-left" style={{marginRight:"5px"}} /> Previous  </MDBBtn>

              </>
            )}
              {!isScheduled && (
                <>  
                <MDBBtn onClick={(e) => { e.preventDefault(); setSchedularModal(true)}} className='btn w-50 ' color='primary' > 
                <MDBIcon  icon="envelope" style={{marginRight:"5px"}} /> Schedule  </MDBBtn>  
                <MDBBtn className='btn ' color='secondary' onClick={()=>setPage(!page)} > <MDBIcon  icon="arrow-left" style={{marginRight:"5px"}} /> Previous  </MDBBtn>
                  </>
            
            )}
            </div>
            
             )}
              <ScheduleModal templateId={id} recipientEmails={recipientEmails} cc={ccEmails} id={user.id} replyTo={replyTo}
              addSignature={isSignatureEnabled} show={schedularModal} placeholdersValues={placeholdersValues} 
                onClose={handleUpdate} /> 

            </>
            )}

        </form>

        <div className="text-center pt-1 mb-5 pb-1">
        </div>

        <div className="d-flex flex-row align-items-center justify-content-center pb-4 mb-4">
        </div>

        </div>

    </MDBCol>

    <MDBCol col='6' className="mb-5">
        <div className="d-flex flex-column  justify-content-center gradient-custom-2 h-100 mb-4">
        <div className="text-white px-3 py-4 p-md-5 mx-md-4">
            <h4 className="mb-4">Email Template Here !</h4>
            <p>Below is a customizable email template. Any content enclosed within double curly braces (<code>{"{{" + "}}"}</code>) is a dynamic input that you can customize it based on  your preferences.</p>
        </div>
    
        {template?.state==="SIMPLE" &&(
                 <MDBCard style={{width:"70%",marginLeft:"19%"}}>
                 <MDBCardBody>
                   <MDBTable striped hover bordered >
                     <MDBTableHead color="blue lighten-4">
                     </MDBTableHead>
                     <MDBTableBody>
                       <tr>
                         <td>   
                           <div className='mb-4'>
                           <MDBBadge color='secondary' pill style={{marginRight:"20px"}}>
                                   Subject : 
                           </MDBBadge>
                           {template.templateBody.subject }
                           </div>
                           <div className='mb-4'>
                           <MDBBadge color='danger'  pill style={{marginRight:"20px"}}>
                                   Email Content : 
                           </MDBBadge>
                           </div>
                        
                           <p>
                           {template.templateBody.content}
                           </p>
                         </td>
                        
                       </tr>
              
                     </MDBTableBody>
                   </MDBTable>
                 </MDBCardBody>
             </MDBCard>
        )}
        </div>



    </MDBCol>

    </MDBRow>

    </MDBContainer>  
)
}

export default SendSimpleEmail