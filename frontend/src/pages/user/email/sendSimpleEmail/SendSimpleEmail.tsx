import {MDBCheckbox, MDBCol, MDBContainer, MDBInput, MDBRow } from 'mdb-react-ui-kit'
import './SendSimpleEmail.css'
import EmailInput from '../../../../components/emailInput/EmailInput'
import { useEffect, useState } from 'react';
import { useGetTemplatePlaceholdersMutation } from '../../../../redux/services/emailApi';
import { toast } from 'sonner';
import { useParams } from 'react-router-dom';
const SendSimpleEmail = () => {
    const [recipientEmails, setRecipientEmails] = useState<string[]>([]);
    console.log("🚀 ~ SendSimpleEmail ~ recipientEmails:", recipientEmails)
    const [ccEmails, setCCEmails] = useState<string[]>([]);
    console.log("🚀 ~ SendSimpleEmail ~ ccEmails:", ccEmails)
    const [bccEmails, setBCCEmails] = useState<string[]>([]);
    console.log("🚀 ~ SendSimpleEmail ~ bccEmails:", bccEmails)
    const[placeholders,setPlaceholders]= useState<string[]>([]);
    const [placeholdersValues, setPlaceholdersValues] = useState<{ [key: string]: string }>({});
    console.log("🚀 ~ SendSimpleEmail ~ placeholdersValues:", placeholdersValues)
    const { id } = useParams();
    const [fileInput, setFileInput] = useState<File | null>(null);


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

      const handleInputChange = (key: string, value: string ) => {
        setPlaceholdersValues((prevPlaceholders) => ({
            ...prevPlaceholders,
            [key]: value.toString()
        }));
    };

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

        <EmailInput label="To:" onChange={setRecipientEmails} />
        <EmailInput label="CC:" onChange={setCCEmails} />
        <EmailInput label="BCC:" onChange={setBCCEmails} />
        <div className='d-flex'>
            <div className='text-center'>
                <MDBCheckbox
                wrapperClass='d-flex mb-3 mt-4'
                label='Add my signature'
                name='mfaEnabled'
                />
                <p>(if exists)</p>
            </div>
        <div className='text-center mt-4' style={{marginLeft:"60px"}}>
        <p>Add Attachement : </p>
        <input type='file'  accept="*/*" onChange={(e) => setFileInput(e.target.files && e.target.files[0])}  className='mb-4' />
        </div>
       
        </div>
    

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