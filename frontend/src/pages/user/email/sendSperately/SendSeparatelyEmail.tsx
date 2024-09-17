import { FormEvent, useEffect, useState } from 'react'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBRow, MDBSpinner, MDBTable, MDBTableHead } from 'mdb-react-ui-kit'
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
import { useProcessPushExcelMutation } from '../../../../redux/services/pushApi'
import { Button, TextField, Tooltip } from '@mui/material'
import Save from '@mui/icons-material/Save'
import Update from '@mui/icons-material/Update'
import Add from '@mui/icons-material/Add'
import Delete from '@mui/icons-material/Delete'
import { validateEmail } from '../../../../routes/Functions'
interface ValidationResult {
  isValid: boolean;
  errorMessage: string | null;
}
const SendSeparatelyEmail = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [basicModal, setBasicModal] = useState<boolean>(false);
  const [placeholderData, setPlaceholderData] = useState<Record<string, string[]>>({});
  const [editMode, setEditMode] = useState<boolean[]>(Array(Object.keys(placeholderData)[0]?.length).fill(false));
  const [newRowData, setNewRowData] = useState<Record<string, string>>({});
  const[processPushExcel]=useProcessPushExcelMutation()
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

  const handleExcelUpload = async (file: File) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('requiredPlaceholders',JSON.stringify(placeholders)); 
        const response = await processPushExcel(formData).unwrap();
        console.log('Data processed successfully:', response);
        setPlaceholderData(response)
    } catch (error) {
        console.error('Error processing data:', error);
    }
};

  const generateSendSeparatelyList = (): SendEmailSeparately[] => {
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
          addSignature,
          requestBody: row,
        });
      }
    }

    return sendSeparatelyList;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

   
    const sendSeparatelyList = generateSendSeparatelyList();
    const result = validateSendSeparatelyList(sendSeparatelyList);
    if (!result.isValid) {
      toast.error(result.errorMessage);
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

  const handleInputChange = (key: string, rowIndex: number, value: string) => {
    setPlaceholderData(prevData => {
      const updatedData = { ...prevData };
      updatedData[key] = [...(prevData[key] || [])];
      updatedData[key][rowIndex] = value;
      return updatedData;
    });
  };

  const handleDeleteRow = (rowIndex: number) => {
    setPlaceholderData(prevData => {
      const updatedData: Record<string, string[]> = {};
      Object.keys(prevData).forEach(key => {
        updatedData[key] = prevData[key].filter((_, index) => index !== rowIndex);
      });
      return updatedData;
    });
  };

  const toggleEditMode = (rowIndex: number) => {
    setEditMode(prevState => {
      const updatedEditMode = [...prevState];
      updatedEditMode[rowIndex] = !updatedEditMode[rowIndex];
      return updatedEditMode;
    });
  };


  const handleNewRowChange = (key: string, value: string) => {
    setNewRowData(prevData => ({
      ...prevData,
      [key]: value,
    }));
  };
  
  const handleAddNewRow = () => {
    setPlaceholderData(prevData => {
      const updatedData: { [key: string]: string[] } = {};
  
      Object.keys(prevData).forEach(key => {
        updatedData[key] = prevData[key] ? [...prevData[key]] : [];
        updatedData[key].push(newRowData[key] || 'unknown');
      });
  
      const maxLength = Math.max(...Object.values(updatedData).map(list => list.length));
  
      Object.keys(updatedData).forEach(key => {
        while (updatedData[key].length < maxLength) {
          updatedData[key].push('unknown');
        }
      });
  
      return updatedData;
    });
  
    setNewRowData({});
  };

  const validateSendSeparatelyList = (sendSeparatelyList: SendEmailSeparately[]): ValidationResult => {
    for (const item of sendSeparatelyList) {
      const { recipient, replyTo, addSignature, requestBody } = item;
  
      if (!validateEmail(recipient)) {
        return { isValid: false, errorMessage: `Invalid email for recipient: ${recipient}` };
      }
  
      if (!validateEmail(replyTo)) {
        return { isValid: false, errorMessage: `Invalid email for replyTo: ${replyTo}` };
      }
  
      if (addSignature !== 'true' && addSignature !== 'false') {
        return { isValid: false, errorMessage: `addSignature must be 'true' or 'false'. Found: ${addSignature}` };
      }
  
      for (const key in requestBody) {
        if (!requestBody[key] || requestBody[key] === 'unknown') {
          return { isValid: false, errorMessage: `Field ${key} is empty or unknown.` };
        }
      }
    }
  
    return { isValid: true, errorMessage: null };
  };
  
  return (
    <>
      <BreadcrumSection />
      <MDBContainer style={{marginLeft: '13%',width:"89%" }} fluid className='p-2 mt-4'>
        <MDBRow>
          <MDBCol md='10'>
            <form onSubmit={handleSubmit}>
              <MDBCard className='my-5 ms-5 '>
                <MDBCardBody className='p-4 mt-2'>
                  <ReactTyped
                    className='px-3 '
                    strings={['Please upload an Excel file with these columns']}
                    typeSpeed={70}
                    backSpeed={100}
                    loop
                    style={{ color: 'hsl(217, 10%, 50.8%)' }}
                  />
                     <img src="../../../assets/worksheet.png" alt="worksheet" width={35} />
                  <div className='mt-4 ms-3' style={{maxHeight:"300px", minWidth: "900px", maxWidth: "900px", overflow: "auto" }}>
                      <MDBTable striped hover bordered>
                        <MDBTableHead color='blue lighten-4'>
                          <tr style={{ background: 'rgb(141, 224, 198)' }}>
                            <th>Recipient</th>
                            <th>ReplyTo</th>
                            <th>Add Signature</th>
                            {placeholders.map(placeholder => (
                              <th key={placeholder}>{placeholder}</th>
                            ))}
                            <th>Actions</th>
                          </tr>
                        </MDBTableHead>
                        <tbody>
                          {Object.keys(placeholderData).length > 0 &&
                            placeholderData[Object.keys(placeholderData)[0]].map((_, rowIndex) => (
                              <tr key={rowIndex}>
                                <td>
                                  {editMode[rowIndex] ? (
                                    <TextField
                                      variant="outlined"
                                      size="small"
                                      value={placeholderData['recipient']?.[rowIndex] || 'unknown'}
                                      onChange={(e) => handleInputChange('recipient', rowIndex, e.target.value)}
                                      fullWidth
                                    />
                                  ) : (
                                    <span>{placeholderData['recipient']?.[rowIndex] || 'unknown'}</span>
                                  )}
                                </td>
                                <td>
                                  {editMode[rowIndex] ? (
                                    <TextField
                                      variant="outlined"
                                      size="small"
                                      value={placeholderData['replyto']?.[rowIndex] || 'unknown'}
                                      onChange={(e) => handleInputChange('replyto', rowIndex, e.target.value)}
                                      fullWidth
                                    />
                                  ) : (
                                    <span>{placeholderData['replyto']?.[rowIndex] || 'unknown'}</span>
                                  )}
                                </td>
                                <td>
                                  {editMode[rowIndex] ? (
                                    <TextField
                                      variant="outlined"
                                      size="small"
                                      value={placeholderData['addsignature']?.[rowIndex] || 'unknown'}
                                      onChange={(e) => handleInputChange('addsignature', rowIndex, e.target.value)}
                                      fullWidth
                                    />
                                  ) : (
                                    <span>{placeholderData['addsignature']?.[rowIndex] || 'unknown'}</span>
                                  )}
                                </td>
                                {placeholders.map(placeholder => (
                                  <td key={`${placeholder}-${rowIndex}`}>
                                    {editMode[rowIndex] ? (
                                      <TextField
                                        variant="outlined"
                                        size="small"
                                        value={placeholderData[placeholder.toLowerCase()]?.[rowIndex] || 'unknown'}
                                        onChange={(e) => handleInputChange(placeholder.toLowerCase(), rowIndex, e.target.value)}
                                        fullWidth
                                      />
                                    ) : (
                                      <span>{placeholderData[placeholder.toLowerCase()]?.[rowIndex] || 'unknown'}</span>
                                    )}
                                  </td>
                                ))}
                                <td className='d-flex'>
                                  <Tooltip title={editMode[rowIndex] ? 'Save' : 'Edit'} className="color_white">
                                    <Button className='me-2' type="button" onClick={() => toggleEditMode(rowIndex)} >
                                      {editMode[rowIndex] ? <Save style={{ color: "whitesmoke" }} /> : <Update style={{ color: "whitesmoke" }} />}
                                    </Button>
                                  </Tooltip>
                                  <Tooltip title="Delete" className="color_pink">
                                    <Button type="button" onClick={() => handleDeleteRow(rowIndex)}>
                                      <Delete style={{ color: "whitesmoke" }} />
                                    </Button>
                                  </Tooltip>
                                </td>
                              </tr>
                            ))
                          }
                        {Object.keys(placeholderData).length > 0  && (
                            <tr>
                            <td>
                              <TextField
                                variant="outlined"
                                size="small"
                                value={newRowData['recipient'] || ''}
                                onChange={(e) => handleNewRowChange('recipient', e.target.value)}
                                fullWidth
                                placeholder="Recipient"
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                size="small"
                                value={newRowData['replyto'] || ''}
                                onChange={(e) => handleNewRowChange('replyto', e.target.value)}
                                fullWidth
                                placeholder="ReplyTo"
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                size="small"
                                value={newRowData['addsignature'] || ''}
                                onChange={(e) => handleNewRowChange('addsignature', e.target.value)}
                                fullWidth
                                placeholder="Add Signature"
                              />
                            </td>
                            {placeholders.map(placeholder => (
                              <td key={`new-${placeholder}`}>
                                <TextField
                                  variant="outlined"
                                  size="small"
                                  value={newRowData[placeholder.toLowerCase()] || ''}
                                  onChange={(e) => handleNewRowChange(placeholder.toLowerCase(), e.target.value)}
                                  fullWidth
                                  placeholder={placeholder}
                                />
                              </td>
                            ))}
                            <td>
                            <Tooltip title='Add Row' className="color_blue">
                                      <Button className='me-2' type="button"  onClick={handleAddNewRow}>
                                        <Add style={{ color: "whitesmoke" }} /> 
                                      </Button>
                                    </Tooltip>
                            </td>
                          </tr>
                        )}                    
                        </tbody>

                      </MDBTable>
                   </div>
                  <MDBBtn type="button" className='ms-5 w-60 mb-4 color_baby_bluee me-5 mt-3'>
                    <input
                      type="file"
                      accept=".xlsx, .xls"
                      onChange={(e) => {
                        const file = e.target.files?.[0]; 
                        if (file) {
                          handleExcelUpload(file); 
                        }
                      }}
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                    />
                    <MDBIcon icon="file-excel" style={{ marginRight: '3px' }} />
                    Upload Excel
                  </MDBBtn>      
                             {loading && (
                    <div className='d-flex justify-content-center mt-4'>
                      <MDBBtn disabled className='btn w-50'>
                        <MDBSpinner size='sm' role='status' tag='span' className='me-2' />
                        Loading...
                      </MDBBtn>
                    </div>
                  )}
                  {!loading && (
                    <MDBBtn className='w-100  color_green'>Send</MDBBtn>
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