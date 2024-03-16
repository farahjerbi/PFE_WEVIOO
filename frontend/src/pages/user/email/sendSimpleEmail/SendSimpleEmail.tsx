import {MDBBtn, MDBCheckbox, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow, MDBSpinner } from 'mdb-react-ui-kit'
import './SendSimpleEmail.css'
import EmailInput from '../../../../components/emailInput/EmailInput'
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';
import { useGetTemplatePlaceholdersMutation } from '../../../../redux/services/emailApi';
import { toast } from 'sonner';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
const SendSimpleEmail = () => {
    const { id } = useParams();
    const storedUser = localStorage.getItem('user');
    const user = storedUser ? JSON.parse(storedUser) : null;
    const [isSignatureEnabled, setIsSignatureEnabled] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [recipientEmails, setRecipientEmails] = useState<string[]>([]);
    const [ccEmails, setCCEmails] = useState<string[]>([]);
    const[placeholders,setPlaceholders]= useState<string[]>([]);
    const[page,setPage]=useState<boolean>(false)
    const [placeholdersValues, setPlaceholdersValues] = useState<{ [key: string]: string }>({});
    const [fileInput, setFileInput] = useState<File | null>(null);
    const [replyTo,setReplyTo]=useState<string>('');
    const navigate=useNavigate()
    const[getTemplatePlaceholders]=useGetTemplatePlaceholdersMutation()

    useEffect(() => {
        fetchData();
      }, []);

    const fetchData = async () => {
        try {
          const response = await getTemplatePlaceholders(id).unwrap();
          console.log("🚀 ~ fetchData ~ response:", response)
          setPlaceholders(response); 
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
    

  return (
    
    <MDBContainer className="my-5 gradient-form">

    <MDBRow>

    <MDBCol col='6' className="mb-5">
        <div className="d-flex flex-column ms-5">

        <div className="text-center">
            <img src="../../../assets/sendMail.png"
            style={{width: '185px'}} alt="logo" />
            <h2>Send Simple Email</h2>
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
            <div className='text-center mt-4' style={{marginLeft:"60px"}}>
            <p>Add Attachement : </p>
            <input type='file'  accept="*/*" onChange={(e) => setFileInput(e.target.files && e.target.files[0])}  className='mb-4' />
            </div>
        
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

            <MDBBtn className='btn w-50 ' color='primary' type='submit'> <MDBIcon  icon="envelope" style={{marginRight:"5px"}} /> Send  </MDBBtn>  
            <MDBBtn className='btn ' color='secondary' onClick={()=>setPage(!page)} > <MDBIcon  icon="arrow-left" style={{marginRight:"5px"}} /> Previous  </MDBBtn>
            </div>
            
             )}
           
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
            <h4 className="mb-4">We are more than just a company</h4>
            <p className="small mb-0">Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </p>
        </div>

        </div>

    </MDBCol>

    </MDBRow>

    </MDBContainer>  
)
}

export default SendSimpleEmail