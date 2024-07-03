import { FormEvent, useEffect, useState } from 'react'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBRow, MDBSpinner, MDBTable, MDBTableHead } from 'mdb-react-ui-kit'
import { ReactTyped } from 'react-typed'
import { useGetSMSTemplateByIdMutation, useSendSMSSeprartelyMutation } from '../../../../redux/services/smsApi'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { selectCurrentSms, selectCurrentWhatsappTemplate, setCurrentWhatsappTemplate, setSelectedSms } from '../../../../redux/state/smsSlice'
import { useDispatch, useSelector } from 'react-redux'
import ExcelSendButton from '../../../../components/button/ExcelSendButton'
import { SendIndiv, SendSeperately } from '../../../../models/sms/SendsSms'
import { LIST_SMS_TEMPLATES } from '../../../../routes/paths'
import ViewSMSTemplate from '../../../../components/modals/view/ViewSMSTemplate'
import { NotificationType } from '../../../../models/NotificationType'
import { useGetWhatsappTemplateByIdMutation } from '../../../../redux/services/whatsAppApi'
import { SendIndivWhatsapp, SendWhatsappSeparately } from '../../../../models/sms/SendWhatsAppMsg'
interface Props{
    type:NotificationType
  }
const SendSeparately : React.FC<Props> = ({ type}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [basicModal, setBasicModal] = useState<boolean>(false);
  const [uploadedData, setUploadedData] = useState<Record<string, string[]>>({});
  const [getSMSTemplateById] = useGetSMSTemplateByIdMutation();
  const[sendSMSSeprartely]=useSendSMSSeprartelyMutation()
  const[getWhatsappTemplateById]=useGetWhatsappTemplateByIdMutation()
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const template = useSelector(selectCurrentSms);
  const templateWhatsapp=useSelector(selectCurrentWhatsappTemplate)
  console.log("🚀 ~ templateWhatsapp:", templateWhatsapp)
  const { id } = useParams();

  useEffect(() => {
    type===NotificationType.SMS?fetchData():fetchDataWhatsapp()
  }, []);

  const fetchData = async () => {
    try {
      const response = await getSMSTemplateById(id).unwrap();
      dispatch(setSelectedSms(response));
    } catch (error) {
      toast.error('Error! Yikes');
      console.error('🚀 ~ error:', error);
    }
  };
  const fetchDataWhatsapp = async () => {
    try {
      const response = await getWhatsappTemplateById(id).unwrap();
      dispatch(setCurrentWhatsappTemplate(response))
    } catch (error) {
      toast.error("Error! Yikes");
      console.error("🚀 ~ error:", error);
    }
  };



  const handleExcelUpload = (data: Record<string, string[]>) => {
    setUploadedData(data);
  };

  const getPlaceholderData = () => {
    if (!templateWhatsapp || !templateWhatsapp.placeholders|| !template || !template.placeholders || Object.keys(uploadedData).length === 0) {
      return {};
    }
  
    const lowerCasePlaceholders = type===NotificationType.SMS? template.placeholders.map(p => p.toLowerCase()):templateWhatsapp.placeholders.map(p => p.toLowerCase());
    if (!lowerCasePlaceholders.includes('phone') && type===NotificationType.SMS) {
      lowerCasePlaceholders.push('phone');
    }else if(!lowerCasePlaceholders.includes('whatsapp') && type===NotificationType.WHATSAPP){
      lowerCasePlaceholders.push('whatsapp');
    }
  
    const rowCount = uploadedData[Object.keys(uploadedData)[0]]?.length || 0;
    const placeholderData = lowerCasePlaceholders.reduce((acc, placeholder) => {
      acc[placeholder] = uploadedData[placeholder] || Array(rowCount).fill('unknown');
      return acc;
    }, {} as Record<string, string[]>);
  
    return placeholderData;
  };
  
  

const placeholderData: Record<string, string[]> = getPlaceholderData();
console.log("🚀 ~ placeholderData:", placeholderData)

const generateSendSeparatelyList = (): SendIndiv => {
  const placeholderData = getPlaceholderData();
  const rowCount = placeholderData[Object.keys(placeholderData)[0]]?.length || 0;

  const sendSeparatelyList: SendSeperately[] = [];
  for (let i = 0; i < rowCount; i++) {
    const row: Record<string, string> = {};
    let isUnknown = false;
    template?.placeholders?.forEach(placeholder => {
      const value = placeholderData[placeholder.toLowerCase()]?.[i] || '';
      row[placeholder] = value;
      if (typeof value === 'string' && value.toLowerCase() === 'unknown') {
        isUnknown = true;
      }
    });

    const number = placeholderData['phone']?.[i] || '';
    if (typeof number === 'string' && number.toLowerCase() === 'unknown') {
      isUnknown = true;
    }

    if (!isUnknown ) {
      sendSeparatelyList.push({
        number: number.toString(), 
        placeholderValues: row,
      });
    }
  }

    return { idTemplate: Number(id), sendSeparatelyList }

};

const generateSendSeparatelyListWhatsapp = (): SendIndivWhatsapp => {
  const placeholderData = getPlaceholderData();
  const rowCount = placeholderData[Object.keys(placeholderData)[0]]?.length || 0;

  const sendSeparatelyList: SendWhatsappSeparately[] = [];
  for (let i = 0; i < rowCount; i++) {
    const row: Record<string, string> = {};
    let isUnknown = false;
    templateWhatsapp?.placeholders?.forEach(placeholder => {
      const value = placeholderData[placeholder.toLowerCase()]?.[i] || '';
      row[placeholder] = value;
      if (typeof value === 'string' && value.toLowerCase() === 'unknown') {
        isUnknown = true;
      }
    });

    const number = placeholderData['whatsapp']?.[i] || '';
    if (typeof number === 'string' && number.toLowerCase() === 'unknown') {
      isUnknown = true;
    }

    if (!isUnknown && type===NotificationType.SMS ) {
      sendSeparatelyList.push({
        number: number.toString(), 
        placeholders:Object.values(row),
      });
    }
  }

    return { whatsAppTemplateResponse:templateWhatsapp, sendSeparatelyList }

};


const sendSeparatelyList = type===NotificationType.SMS?generateSendSeparatelyList():generateSendSeparatelyListWhatsapp();


const handleSubmit: (evt: FormEvent<HTMLFormElement>) => void = async (
  e: FormEvent<HTMLFormElement>
) => {
  e.preventDefault();
  setLoading(true);
  if(id){
    const sendSms:SendIndiv=generateSendSeparatelyList();
  try {
      await sendSMSSeprartely(sendSms)
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
      <BreadcrumSection />
      <MDBContainer style={{ width: '83%', marginLeft: '13.5%' }} fluid className='p-4 mt-5'>
        <MDBRow>
          <MDBCol
            style={{
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundImage: 'url(../../../assets/worksheet.png)',
              backgroundSize: '90% 70%',
            }}
            md='4'
            className='text-center text-md-start d-flex flex-column justify-content-center mt-4'
          >

          </MDBCol>

          <MDBCol md='8'>
            <form onSubmit={handleSubmit}>
              <MDBCard className='my-5'>
                <MDBCardBody className='p-5'>
                  <ReactTyped
                    className='px-3 mt-5'
                    strings={['Please upload an Excel file with these columns']}
                    typeSpeed={70}
                    backSpeed={100}
                    loop
                    style={{ color: 'hsl(217, 10%, 50.8%)' }}
                  />
                  <MDBCard className='my-4'>
                    <MDBCardBody className='p-5 ' style={{ maxHeight: '170px', overflowY: 'auto' }}>
                      <MDBTable striped hover bordered>
                        <MDBTableHead color='blue lighten-4'>
                          <tr style={{ background: 'rgb(141, 224, 198)' }}>
                            <th> {type===NotificationType.SMS?"Phone":"Whatsapp"} </th>
                            {type===NotificationType.SMS && template?.placeholders?.map(placeholder => (
                              <th key={placeholder}>{placeholder}</th>
                            ))}
                              {type===NotificationType.WHATSAPP && templateWhatsapp?.placeholders?.map(placeholder => (
                              <th key={placeholder}>{placeholder}</th>
                            ))}
                          </tr>
                        </MDBTableHead>
                        <tbody>
                          {placeholderData[Object.keys(placeholderData)[0]]?.map((_, rowIndex) => (
                            <tr key={rowIndex}>
                              <td> {type===NotificationType.SMS? placeholderData["phone"]?.[rowIndex] || '': placeholderData["whatsapp"]?.[rowIndex] || ''} </td>
                              {type===NotificationType.SMS && template?.placeholders?.map(placeholder => (
                                <td key={`${placeholder}-${rowIndex}`}>
                                  {placeholderData[placeholder]?.[rowIndex] || ''}
                                </td>
                              ))}
                               {type===NotificationType.WHATSAPP && templateWhatsapp?.placeholders?.map(placeholder => (
                                <td key={`${placeholder}-${rowIndex}`}>
                                  {placeholderData[placeholder]?.[rowIndex] || ''}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </MDBTable>
                    </MDBCardBody>
                  </MDBCard>
                  <ExcelSendButton onExcelUpload={handleExcelUpload} />
                  <MDBBtn type="button" className='ms-5 w-60 mb-4 color_baby_blue' onClick={()=>setBasicModal(true)}> View template</MDBBtn> 
                  {loading && (
                        <div className='d-flex justify-content-center mt-4'>
                        <MDBBtn disabled className='btn w-50 ' >
                        <MDBSpinner size='sm' role='status' tag='span' className='me-2' />
                            Loading...
                        </MDBBtn>
                        </div>
                    )}
                                      {!loading && (
                  <MDBBtn className='w-100 mb-4 color_green'>Send</MDBBtn>
                )}

                </MDBCardBody>
              </MDBCard>
            </form>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
   {type===NotificationType.SMS &&template && (<ViewSMSTemplate template={template} show={basicModal} onClose={()=>setBasicModal(false)}  />)}
   {type===NotificationType.WHATSAPP&&templateWhatsapp && (<ViewSMSTemplate template={templateWhatsapp} show={basicModal} onClose={()=>setBasicModal(false)}  />)}

    </>
  );
};

export default SendSeparately;
