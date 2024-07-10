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
import { useGetWhatsappTemplateByIdMutation, useSendSMSWhatsAppSeparatelyMutation } from '../../../../redux/services/whatsAppApi'
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
  const[sendSMSWhatsAppSeparately]=useSendSMSWhatsAppSeparatelyMutation()
  const[getWhatsappTemplateById]=useGetWhatsappTemplateByIdMutation()
  const navigate=useNavigate()
  const dispatch = useDispatch();
  const template = useSelector(selectCurrentSms);
  const templateWhatsapp=useSelector(selectCurrentWhatsappTemplate)
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

  const getSMSPlaceholderData = () => {
    const smsPlaceholderData: Record<string, string[]> = {};
    if (!template || !template.placeholders || Object.keys(uploadedData).length === 0) {
      smsPlaceholderData['phone'] = uploadedData['phone'] || [];
      return smsPlaceholderData;
    }
  
    const lowerCasePlaceholders = template.placeholders.map(p => p.toLowerCase());
    if (!lowerCasePlaceholders.includes('phone')) {
      lowerCasePlaceholders.push('phone');
    }
  
    lowerCasePlaceholders.forEach(placeholder => {
      smsPlaceholderData[placeholder] = uploadedData[placeholder] || [];
    });
  
    return smsPlaceholderData;
  };
  
  const getWhatsAppPlaceholderData = () => {
    const whatsappPlaceholderData: Record<string, string[]> = {};
    if (!templateWhatsapp || !templateWhatsapp.placeholders || Object.keys(uploadedData).length === 0) {
      whatsappPlaceholderData['whatsapp'] = uploadedData['whatsapp'] || [];
      return whatsappPlaceholderData;
    }
  
    const lowerCasePlaceholders = templateWhatsapp.placeholders.map(p => p.toLowerCase());
    if (!lowerCasePlaceholders.includes('whatsapp')) {
      lowerCasePlaceholders.push('whatsapp');
    }
  
    lowerCasePlaceholders.forEach(placeholder => {
      whatsappPlaceholderData[placeholder] = uploadedData[placeholder] || [];
    });
  
    return whatsappPlaceholderData;
  };
  

  const placeholderData: Record<string, string[]> = type === NotificationType.SMS ? getSMSPlaceholderData() : getWhatsAppPlaceholderData();
  console.log("🚀 ~ placeholderData:", placeholderData)

  const generateSendSeparatelyList = (): SendIndiv => {
    const placeholderData = getSMSPlaceholderData();
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

      if (!isUnknown) {
        sendSeparatelyList.push({
          number: number.toString(),
          placeholderValues: row,
        });
      }
    }

    return { idTemplate: Number(id), sendSeparatelyList };
  };

const generateSendSeparatelyListWhatsapp = (): SendIndivWhatsapp => {
    const placeholderData = getWhatsAppPlaceholderData();
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

      if (!isUnknown && type === NotificationType.SMS) {
        sendSeparatelyList.push({
          number: number.toString(),
          placeholders: Object.values(row),
        });
      }
    }

    return { whatsAppTemplateResponse: templateWhatsapp, sendSeparatelyList };
  };

  const sendSeparatelyList = generateSendSeparatelyList();
  const sendSeparatelyListWhatsapp = generateSendSeparatelyListWhatsapp();


  const handleSubmit: (evt: FormEvent<HTMLFormElement>) => void = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();
    setLoading(true);
  
    const isDataValid = Object.values(placeholderData).every(arr => {
      return arr.length > 0 && !arr.every(value => typeof value === 'string' && value.toLowerCase() === 'unknown');
    });
    
    if (!isDataValid) {
      toast.warning("Please fill all columns with valid data before sending!");
      setLoading(false);
      return;
    }
  
  
    try {
      if (id) {
        if (type === NotificationType.SMS) {
          const sendSms: SendIndiv = sendSeparatelyList;
          await sendSMSSeprartely(sendSms);
          toast.success("SMS sent Successfully !");
          navigate(LIST_SMS_TEMPLATES);
        } else if (type === NotificationType.WHATSAPP) {
          const sendWhatsapp: SendIndivWhatsapp = sendSeparatelyListWhatsapp;
          await sendSMSWhatsAppSeparately(sendWhatsapp);
          toast.success("WhatsApp message sent Successfully !");
          navigate(LIST_SMS_TEMPLATES);
        }
      }
    } catch (error) {
      toast.error("Failed to send notification. Please try again later.");
      console.error("Error sending notification:", error);
    } finally {
      setLoading(false);
    }
  };
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
                          {placeholderData[type === NotificationType.WHATSAPP ? 'whatsapp' : 'phone']?.map((phoneValue, rowIndex) => (
                            <tr key={rowIndex}>
                              <td>{phoneValue}</td>
                              {type === NotificationType.SMS && template?.placeholders?.map(placeholder => (
                                <td key={`${placeholder}-${rowIndex}`}>
                                  {placeholderData[placeholder.toLowerCase()]?.[rowIndex] || ''}
                                </td>
                              ))}
                              {type === NotificationType.WHATSAPP && templateWhatsapp?.placeholders?.map(placeholder => (
                                <td key={`whatsapp-${placeholder}-${rowIndex}`}>
                                  {placeholderData[placeholder.toLowerCase()]?.[rowIndex] || ''}
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
