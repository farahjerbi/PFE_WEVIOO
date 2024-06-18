import React, { FormEvent, useEffect, useState } from 'react'
import './SendSMS.css'
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBInput, MDBRow, MDBSpinner } from 'mdb-react-ui-kit'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import { useNavigate, useParams } from 'react-router-dom'
import { useGetSMSTemplateByIdMutation, useSendSMSMutation } from '../../../../redux/services/smsApi'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentSms, setSelectedSms } from '../../../../redux/state/smsSlice'
import { toast } from 'sonner'
import { SendsSms } from '../../../../models/sms/SendsSms'
import { LIST_SMS_TEMPLATES } from '../../../../routes/paths'
import { ReactTyped } from 'react-typed'
import ScheduleSMS from '../../../../components/modals/ScheduleSMS'
import ViewSMSTemplate from '../../../../components/modals/ViewSMSTemplate'
import NumberInput from '../../../../components/numberInput/NumberInput'
import { NotificationType } from '../../../../models/NotificationType'
const SendSMS = () => {
  const[numbers,setNumbers]=useState<string[]>([]);
  const[getSMSTemplateById]=useGetSMSTemplateByIdMutation();
  const [viewTemplate,setViewTemplate]=useState<boolean>(false)
  const dispatch=useDispatch()
  const template=useSelector(selectCurrentSms);
  const [placeholdersValues, setPlaceholdersValues] = useState<{ [key: string]: string }>({});
  const [next,setNext]=useState<boolean>(false)
  const [openSchedule,setOpenSchedule]=useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false);
  const navigate=useNavigate()
  const[sendSMS]=useSendSMSMutation()
  const {id}=useParams()
      useEffect(() => {
        fetchData();
      },[]);

    const fetchData = async () => {
        try {
          const response = await getSMSTemplateById(id).unwrap();
          dispatch(setSelectedSms(response))
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


    const handleSubmit: (evt: FormEvent<HTMLFormElement>) => void = async (
      e: FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault();
      setLoading(true);
      if(id){
        const sendSms:SendsSms={
          idTemplate:Number(id),
          numbers:numbers,
          placeholderValues:placeholdersValues
        }
      try {
          await sendSMS(sendSms)
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
     <NumberInput type={NotificationType.SMS} label="Numbers:" onChange={setNumbers}  />
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
                {template?.placeholders.map((placeholder) => (
                    <div key={placeholder}>
                        <MDBInput
                            className='mb-3'
                            label={placeholder}
                            required
                            type="text"
                            onChange={(e) => handleInputChange(placeholder, e.target.value)}
                        />
                    </div>
        ))}
         <MDBBtn type='button' className='w-100 mb-4 me-5 color_pink ' onClick={()=>setViewTemplate(true)} >View Template</MDBBtn>
     </MDBCardBody>
     </MDBCard>
     <MDBBtn type='button' className='w-60 mb-4' color='secondary' onClick={()=>setNext(false)}>Go back</MDBBtn>
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
    <ScheduleSMS templateId={template.id} numbers={numbers} show={openSchedule} placeholdersValues={placeholdersValues} onClose={()=>setOpenSchedule(false)}  />
   </MDBCardBody>
 </MDBCard>
  )}
           {template && (<ViewSMSTemplate onClose={()=>setViewTemplate(false)} show={viewTemplate} template={template}  />)}   

  </>

)}
   
   
   </form>
  </MDBCol>

</MDBRow>

</MDBContainer>
    </>
     )
}

export default SendSMS