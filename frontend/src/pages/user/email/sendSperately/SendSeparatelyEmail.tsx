import { FormEvent, useEffect, useState } from 'react'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBRow, MDBSpinner, MDBTable, MDBTableHead } from 'mdb-react-ui-kit'
import { ReactTyped } from 'react-typed'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import ExcelSendButton from '../../../../components/button/ExcelSendButton'
import { useGetTemplateByIdMutation, useGetTemplatePlaceholdersMutation, useSendSeparateyEMAILMutation } from '../../../../redux/services/emailApi'
import { selectEmail, setSelectedEmail } from '../../../../redux/state/emailSlice'
import { SendEmailSeparately } from '../../../../models/email/SendEmailSeparately'
import { LIST_EMAIL_TEMPLATES } from '../../../../routes/paths'
import { selectUser } from '../../../../redux/state/authSlice'
const SendSeparatelyEmail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [basicModal, setBasicModal] = useState<boolean>(false);
  const [uploadedData, setUploadedData] = useState<Record<string, string[]>>({});
  const [placeholders, setPlaceholders] = useState<string[]>([]);
  const [sendSeparateyEMAIL] = useSendSeparateyEMAILMutation();
  const [getTemplatePlaceholders] = useGetTemplatePlaceholdersMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const template = useSelector(selectEmail);
  const user=useSelector(selectUser)
  const { id } = useParams();

  useEffect(() => {
    fetchDataPlaceholders();
  }, []);

  const fetchDataPlaceholders = async () => {
    try {
      const response = await getTemplatePlaceholders(id).unwrap();
      setPlaceholders(response.map((placeholder: string) => placeholder.trim()));
    } catch (error) {
      console.error('🚀 ~ error:', error);
    }
  };

  const handleExcelUpload = (data: Record<string, string[]>) => {
    setUploadedData(data);
  };

  const getPlaceholderData = () => {
    if (Object.keys(uploadedData).length === 0) {
      return {};
    }

    const normalizedUploadedData = Object.keys(uploadedData).reduce((acc, key) => {
      acc[key.toLowerCase()] = uploadedData[key];
      return acc;
    }, {} as Record<string, string[]>);

    const requiredPlaceholders = ['recipient', 'replyTo', 'addSignature'];
    const lowerCasePlaceholders = placeholders.map(p => p.toLowerCase());

    requiredPlaceholders.forEach(placeholder => {
      if (!lowerCasePlaceholders.includes(placeholder)) {
        lowerCasePlaceholders.push(placeholder);
      }
    });

    return normalizedUploadedData;
  };

  const placeholderData: Record<string, string[]> = getPlaceholderData();

  const generateSendSeparatelyList = (): SendEmailSeparately[] => {
    const placeholderData = getPlaceholderData();
    const rowCount = placeholderData[Object.keys(placeholderData)[0]]?.length || 0;

    const sendSeparatelyList: SendEmailSeparately[] = [];
    for (let i = 0; i < rowCount; i++) {
      const row: Record<string, string> = {};

      placeholders.forEach(placeholder => {
        const value = placeholderData[placeholder.toLowerCase()]?.[i] || '';
        row[placeholder] = value;
      });

      const recipient = placeholderData['recipient']?.[i] || '';
      const replyTo = placeholderData['replyto']?.[i] || '';
      const addSignature = placeholderData['addsignature']?.[i] || '';

      if (recipient && replyTo && addSignature) {
        sendSeparatelyList.push({
          recipient,
          replyTo,
          id: i,
          addSignature,
          requestBody: JSON.stringify(row),
        });
      }
    }

    return sendSeparatelyList;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const sendSeparatelyList = generateSendSeparatelyList();

    if (!sendSeparatelyList.length) {
      toast.warning('Invalid data.');
      setLoading(false);
      return;
    }

    try {
      await sendSeparateyEMAIL({email:sendSeparatelyList,userId:user?.id,id:id});
      toast.success("Emails sent successfully!");
      navigate(LIST_EMAIL_TEMPLATES); 
    } catch (error) {
      toast.error('Failed to send emails.');
      console.error('🚀 ~ error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BreadcrumSection />
      <MDBContainer style={{marginLeft: '13%' }} fluid className='p-4 mt-5'>
        <MDBRow>
          <MDBCol md='10'>
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
                    <MDBCardBody className='p-5' style={{ maxHeight: '170px', overflowY: 'auto' }}>
                      <MDBTable striped hover bordered>
                        <MDBTableHead color='blue lighten-4'>
                          <tr style={{ background: 'rgb(141, 224, 198)' }}>
                            <th>Recipient</th>
                            <th>ReplyTo</th>
                            <th>Add Signature</th>
                            {placeholders.map(placeholder => (
                              <th key={placeholder}>{placeholder}</th>
                            ))}
                          </tr>
                        </MDBTableHead>
                        <tbody>
                          {placeholderData[Object.keys(placeholderData)[0]]?.map((_, rowIndex) => (
                            <tr key={rowIndex}>
                              <td>{placeholderData['recipient']?.[rowIndex] || 'unknown'}</td>
                              <td>{placeholderData['replyto']?.[rowIndex] || 'unknown'}</td>
                              <td>{placeholderData['addsignature']?.[rowIndex] || 'unknown'}</td>
                              {placeholders.map(placeholder => (
                                <td key={`${placeholder}-${rowIndex}`}>
                                  {placeholderData[placeholder.toLowerCase()]?.[rowIndex] || 'unknown' }
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </MDBTable>
                    </MDBCardBody>
                  </MDBCard>
                  <ExcelSendButton onExcelUpload={handleExcelUpload} />
                  {loading && (
                    <div className='d-flex justify-content-center mt-4'>
                      <MDBBtn disabled className='btn w-50'>
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
    </>
  );
};

export default SendSeparatelyEmail;