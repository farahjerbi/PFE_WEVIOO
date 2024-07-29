import { FormEvent, useEffect, useState } from 'react'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBRow, MDBSpinner, MDBTable, MDBTableHead } from 'mdb-react-ui-kit'
import { ReactTyped } from 'react-typed'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import ExcelSendButton from '../../../../components/button/ExcelSendButton'
import { LIST_PUSH_TEMPLATES } from '../../../../routes/paths'
import { selectPush, setSelectedPush } from '../../../../redux/state/pushSlice'
import { SendPush, SendPushIndiv } from '../../../../models/push/SendPush'
import UpdatePush from '../update/UpdatePush'
import { useGetPushByIdMutation, useSendPushSeprartelyMutation } from '../../../../redux/services/pushApi'
import { selectToken } from '../../../../redux/state/authSlice'
const SendPushSeparately = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [basicModal, setBasicModal] = useState<boolean>(false);
    const [uploadedData, setUploadedData] = useState<Record<string, string[]>>({});
    const[sendPushSeprartely]=useSendPushSeprartelyMutation()
    const navigate=useNavigate()
    const dispatch = useDispatch();
    const template = useSelector(selectPush);
    console.log("🚀 ~ SendPushSeparately ~ template:", template)
    const[getPushById]=useGetPushByIdMutation()
    const { id } = useParams();
    const token=useSelector(selectToken)
    useEffect(() => {
      fetchData()
    }, []);
    const handleExcelUpload = (data: Record<string, string[]>) => {
        setUploadedData(data);
      };
      const fetchData = async () => {
        try {
          const response = await getPushById(id).unwrap();
          dispatch(setSelectedPush(response));
        } catch (error) {
          toast.error('Error! Yikes');
          console.error('🚀 ~ error:', error);
        }
      };

      const getPlaceholderData = () => {
        if (!template || !template.placeholders || Object.keys(uploadedData).length === 0) {
          return {};
        }
      
        const normalizedUploadedData = Object.keys(uploadedData).reduce((acc, key) => {
          acc[key.toLowerCase()] = uploadedData[key];
          return acc;
        }, {} as Record<string, string[]>);
      
        const requiredPlaceholders = ['notificationendpoint', 'publickey', 'auth'];
        const lowerCasePlaceholders = template.placeholders.map(p => p.toLowerCase());
      
        requiredPlaceholders.forEach(placeholder => {
          if (!lowerCasePlaceholders.includes(placeholder)) {
            lowerCasePlaceholders.push(placeholder);
          }
        });
      
        const rowCount = normalizedUploadedData[Object.keys(normalizedUploadedData)[0]]?.length || 0;
        const placeholderData = lowerCasePlaceholders.reduce((acc, placeholder) => {
          acc[placeholder] = normalizedUploadedData[placeholder] || Array(rowCount).fill('unknown');
          return acc;
        }, {} as Record<string, string[]>);

        return placeholderData;
      };
      
      
      const placeholderData: Record<string, string[]> = getPlaceholderData();
      console.log("🚀 ~ SendPushSeparately ~ placeholderData:", placeholderData)

      const generateSendSeparatelyList = (): SendPushIndiv => {
        const placeholderData = getPlaceholderData();
        const rowCount = placeholderData[Object.keys(placeholderData)[0]]?.length || 0;
      
        const sendSeparatelyList: SendPush[] = [];
        for (let i = 0; i < rowCount; i++) {
          const row: Record<string, string> = {};
          let isUnknown = false;
      
          template?.placeholders?.forEach(placeholder => {
            const value = placeholderData[placeholder.toLowerCase()]?.[i] || 'unknown';
            row[placeholder] = value;
            if (value.toLowerCase() === 'unknown') {
              isUnknown = true;
            }
          });
      
          const notificationEndPoint = placeholderData['notificationendpoint']?.[i] || 'unknown';
          const publicKey = placeholderData['publickey']?.[i] || 'unknown';
          const auth = placeholderData['auth']?.[i] || 'unknown';
      
          if (isUnknown) {
            continue;
          }
      
          sendSeparatelyList.push({
            webPushSubscriptions: { notificationEndPoint, publicKey, auth },
            placeholderValues: row
          });
        }
      
        return { webPushMessageTemplate: template, sendSeparatelyList };
      };
      
      const isRowInvalidPush = (placeholderData: Record<string, string[]>, index: number): boolean => {
        const placeholders = template?.placeholders || [];
        for (const placeholder of placeholders) {
          const value = placeholderData[placeholder.toLowerCase()]?.[index] || '';
          if (value.toLowerCase() === 'unknown' || value.trim() === '') {
            return true;
          }
        }
        const notificationEndPoint = placeholderData['notificationendpoint']?.[index] || '';
        const publicKey = placeholderData['publickey']?.[index] || '';
        const auth = placeholderData['auth']?.[index] || '';
      
        return [
          notificationEndPoint,
          publicKey,
          auth,
        ].some(value => value.toLowerCase() === 'unknown' || value.trim() === '');
      };
      const isDataInvalidPush = (placeholderData: Record<string, string[]>, rowCount: number): boolean => {
        for (let i = 0; i < rowCount; i++) {
          if (isRowInvalidPush(placeholderData, i)) {
            return true;
          }
        }
        return false;
      };



      const handleSubmit: (evt: FormEvent<HTMLFormElement>) => void = async (
        e: FormEvent<HTMLFormElement>
      ) => {
        e.preventDefault();
        setLoading(true);
              if (!placeholderData) {
          toast.warning('Invalid placeholder data.');
          setLoading(false);
          return;
        }
      
        const rowCount = placeholderData[Object.keys(placeholderData)[0]]?.length || 0;
        if (isDataInvalidPush(placeholderData, rowCount)) {
          toast.warning('Please ensure all fields are filled correctly without "unknown" or empty values.');
          setLoading(false);
          return;
        }
      
        const sendPush: SendPushIndiv = generateSendSeparatelyList();
        try {
          await sendPushSeprartely(sendPush);
          toast.success("Push Notifications sent Successfully!");
          navigate(LIST_PUSH_TEMPLATES);
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
                            <th> NotificationEndPoint </th>
                            <th> PublicKey </th>
                            <th> Auth </th>
                            { template?.placeholders?.map(placeholder => (
                              <th key={placeholder}>{placeholder}</th>
                            ))}
                             
                          </tr>
                        </MDBTableHead>
                        <tbody>
                          {placeholderData[Object.keys(placeholderData)[0]]?.map((_, rowIndex) => (
                            <tr key={rowIndex}>
                              <td>  {placeholderData["notificationendpoint"]?.[rowIndex] || 'unknown'} </td>
                              <td>  {placeholderData["publickey"]?.[rowIndex] || 'unknown'} </td>
                              <td>  {placeholderData["auth"]?.[rowIndex] || 'unknown'} </td>
                              {template?.placeholders?.map(placeholder => (
                                <td key={`${placeholder}-${rowIndex}`}>
                                  {placeholderData[placeholder.toLowerCase()]?.[rowIndex] || 'unknown'}
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
        {template && ( 
            <UpdatePush view={true} template={template} show={basicModal} onClose={()=>setBasicModal(false)}  />
    )}    
      </MDBContainer>
  

    </>  )
}

export default SendPushSeparately