import React, { FormEvent, useEffect, useState } from 'react'
import './SendWhatsapp.css'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentWhatsappTemplate, setCurrentWhatsappTemplate } from '../../../../redux/state/smsSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetWhatsappTemplateByIdMutation, useSendWhatsappMutation } from '../../../../redux/services/whatsAppApi'
import { toast } from 'sonner'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBInput, MDBRow, MDBSpinner } from 'mdb-react-ui-kit'
import { ReactTyped } from 'react-typed'
import ViewSMSTemplate from '../../../../components/modals/ViewSMSTemplate'
import { SendWhatsAppMsg } from '../../../../models/sms/SendWhatsAppMsg'
import { LIST_SMS_TEMPLATES } from '../../../../routes/paths'
import ScheduleWhatsapp from '../../../../components/modals/ScheduleWhatsapp'
import NumberInput from '../../../../components/numberInput/NumberInput'
import { NotificationType } from '../../../../models/NotificationType'
const SendWhatsapp = () => {
    const template=useSelector(selectCurrentWhatsappTemplate)
    const dispatch=useDispatch()
    const[numbers,setNumbers]=useState<string[]>([]);
    const[placeholdersValues,setPlaceholdersValues]=useState<string[]>([]);
    const [next,setNext]=useState<boolean>(false)
    const [openSchedule,setOpenSchedule]=useState<boolean>(false)
    const [viewTemplate,setViewTemplate]=useState<boolean>(false)
    const [loading, setLoading] = useState<boolean>(false);
    const[getWhatsappTemplateById]=useGetWhatsappTemplateByIdMutation()
    const[sendWhatsapp]=useSendWhatsappMutation()
    const navigate=useNavigate()
    const {id}=useParams()
    useEffect(() => {
      fetchData();
    },[]);

  const fetchData = async () => {
      try {
        const response = await getWhatsappTemplateById(id).unwrap();
        dispatch(setCurrentWhatsappTemplate(response))
      } catch (error) {
        toast.error("Error! Yikes");
        console.error("🚀 ~ error:", error);
      }
    };


    const handleInputChange = (index: number, value: string) => {
        const newEmails = [...placeholdersValues];
        newEmails[index] = value;
        setPlaceholdersValues(newEmails);
      };


    const handleSubmit: (evt: FormEvent<HTMLFormElement>) => void = async (
        e: FormEvent<HTMLFormElement>
      ) => {
        e.preventDefault();
        setLoading(true);
        if(template){
          const sendWhatsAppMsg:SendWhatsAppMsg={
            numbers:numbers,
            placeholders:placeholdersValues,
            whatsAppTemplateResponse:template            
          }
          console.log("🚀 ~ SendWhatsapp ~ sendWhatsAppMsg:", sendWhatsAppMsg)
        try {
            await sendWhatsapp(sendWhatsAppMsg)
            toast.success("SMS sent Successfully !");
            navigate(LIST_SMS_TEMPLATES)
        }
        finally {
            setLoading(false); 
        }
      }
      }

  return (
    <>
    <BreadcrumSection/>
     <MDBContainer style={{width:"80%",marginLeft:"13.5%"}} fluid className=' p-4 mt-5'>

<MDBRow>

  <MDBCol style={{backgroundRepeat: "no-repeat",
    backgroundPosition: "center",backgroundImage:"url(../../../assets/addSMS.jpg)",backgroundSize:"130% 100%"}}
     md='6' className='text-center text-md-start d-flex flex-column justify-content-center mt-4 '>

    {/* <h1 className="my-5 display-3 fw-bold ls-tight px-3 ">
      The best way <br />
      <span className="text-primary">for your business</span>
    </h1> */}
        <ReactTyped
                  className='px-3 mt-5' 
                    strings={[
                    " Send a simple SMS text by defining destination numbers and setting placeholders values, or experiment with a rich set of features, including bulk sending."
                      ]}
                    typeSpeed={70}
                    backSpeed={100}
                    loop
                    style={{color: 'hsl(217, 10%, 50.8%)'}}
                  />

   

  </MDBCol>

  <MDBCol md='6'>
  <form onSubmit={handleSubmit}>
{!next && (
   <MDBCard className='my-5'>
   <MDBCardBody className='p-5'>
   <MDBCard className='my-5'>
   <MDBCardBody className='p-5'>
     <NumberInput type={NotificationType.WHATSAPP}  label="Numbers:" onChange={setNumbers}  />
     </MDBCardBody>
     </MDBCard>

     <MDBBtn className='w-100 mb-4' onClick={()=>setNext(true)} >Next</MDBBtn>

   </MDBCardBody>
 </MDBCard>
)}
{next && (
  <>
  {template?.placeholders && (
   <MDBCard className='my-5'>
   <MDBCardBody className='p-5'>
   <MDBCard className='my-5'>
   <MDBCardBody className='p-5'>
   {Object.keys(template?.placeholders).length > 0 && (
                  <h3 className='mt-4 ms-2 mb-5'>Dynamic Inputs Based on Placeholders</h3>
                )}
                {template?.placeholders.map((placeholder,index) => (
                    <div  key={index} >
                        <MDBInput
                            className='mb-3'
                            label={placeholder}
                            required
                            type="text"
                            onChange={(e) => handleInputChange(index, e.target.value)}
                        />
                    </div>
        ))}
                 <MDBBtn className='w-100 mb-4 me-5 color_white ' onClick={()=>setViewTemplate(true)} >View Template</MDBBtn>
     </MDBCardBody>
     </MDBCard>
     <MDBBtn className='w-60 mb-4' color='secondary' onClick={()=>setNext(false)}>Go back</MDBBtn>
     {loading && (
        <div className='d-flex justify-content-center mt-4'>
        <MDBBtn disabled className='btn w-50 ' >
        <MDBSpinner size='sm' role='status' tag='span' className='me-2' />
            Loading...
        </MDBBtn>
        </div>

    )}
     {!loading && (
      <div className='d-flex'>
         <MDBBtn className='w-100 mb-4 me-5 ' >Send</MDBBtn>
          <MDBBtn type='button' color='info' className='w-100 mb-4' onClick={()=>setOpenSchedule(true)}>Schedule</MDBBtn>
      </div>
    )}

    <ViewSMSTemplate onClose={()=>setViewTemplate(false)} show={viewTemplate} template={template}  />
    <ScheduleWhatsapp templateId={template.id} numbers={numbers} show={openSchedule} placeholders={placeholdersValues} language={template.language} name={template.name} onClose={()=>setOpenSchedule(false)}  />
   </MDBCardBody>
 </MDBCard>
  )}
  
  </>

)}
   
   
   </form>
  </MDBCol>

</MDBRow>

</MDBContainer>
    </>  )
}

export default SendWhatsapp