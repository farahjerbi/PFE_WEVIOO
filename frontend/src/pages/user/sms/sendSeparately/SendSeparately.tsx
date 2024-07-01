import React, { useEffect } from 'react'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBRow, MDBTable, MDBTableHead } from 'mdb-react-ui-kit'
import { ReactTyped } from 'react-typed'
import { useGetSMSTemplateByIdMutation } from '../../../../redux/services/smsApi'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { selectCurrentSms, setSelectedSms } from '../../../../redux/state/smsSlice'
import { useDispatch, useSelector } from 'react-redux'

const SendSeparately = () => {
    const[getSMSTemplateById]=useGetSMSTemplateByIdMutation();
    const dispatch=useDispatch()
    const template=useSelector(selectCurrentSms);
    console.log("🚀 ~ SendSeparately ~ template:", template)
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

  return (
    <>
    <BreadcrumSection/>
    <MDBContainer style={{width:"70%",marginLeft:"13.5%"}} fluid className=' p-4 mt-5'>

<MDBRow>

  <MDBCol style={{backgroundRepeat: "no-repeat",
    backgroundPosition: "center",backgroundImage:"url(../../../assets/worksheet.png)",backgroundSize:"90% 90%"}}
     md='6' className='text-center text-md-start d-flex flex-column justify-content-center mt-4 '>

    {/* <h1 className="my-5 display-3 fw-bold ls-tight px-3 ">
      The best way <br />
      <span className="text-primary">for your business</span>
    </h1> */}
      

   

  </MDBCol>

  <MDBCol md='6'>
  <form >
   <MDBCard className='my-5'>
   <MDBCardBody className='p-5'>
   <ReactTyped
                  className='px-3 mt-5' 
                    strings={[
                    "Please upload an Excel file that adheres to the following structure"
                      ]}
                    typeSpeed={70}
                    backSpeed={100}
                    loop
                    style={{color: 'hsl(217, 10%, 50.8%)'}}
                  />
   <MDBCard className='my-4'>
   <MDBCardBody className='p-5'>
   <MDBTable striped hover bordered>
    <MDBTableHead color="blue lighten-4">
      <tr style={{background:"rgb(141, 224, 198) "}}>
        <th>Phone Number</th>
        {template?.placeholders?.map((p)=>(
        <th>{p}</th>
        ))}
    </tr> 
    </MDBTableHead>
    </MDBTable>
          </MDBCardBody>
     </MDBCard>
     <MDBBtn className='w-60 mb-4 color_baby_bluee'>
        Upload
        </MDBBtn>
     <MDBBtn className='w-100 mb-4 color_green'  >Send</MDBBtn>

   </MDBCardBody>
 </MDBCard>
   </form>
  </MDBCol>

</MDBRow>

</MDBContainer>
    </>
  )
}

export default SendSeparately