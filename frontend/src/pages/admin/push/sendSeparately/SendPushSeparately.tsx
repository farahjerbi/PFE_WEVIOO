import { FormEvent, useEffect, useState } from 'react'
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection'
import { MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBRow, MDBSpinner, MDBTable, MDBTableHead } from 'mdb-react-ui-kit'
import { ReactTyped } from 'react-typed'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { LIST_PUSH_TEMPLATES } from '../../../../routes/paths'
import { selectPush, setSelectedPush } from '../../../../redux/state/pushSlice'
import UpdatePush from '../update/UpdatePush'
import { useGetPushByIdMutation, useProcessPushExcelMutation, useSendPushSeprartelyMutation } from '../../../../redux/services/pushApi'
import { WebPushExcelProcessor } from '../../../../models/push/WebPushExcelProcessor'
import Tooltip from '@mui/material/Tooltip'
import Button from '@mui/material/Button'
import Update from '@mui/icons-material/Update'
import Delete from '@mui/icons-material/Delete'
import { TextField } from '@mui/material'
import Add from '@mui/icons-material/Add'
const SendPushSeparately = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [basicModal, setBasicModal] = useState<boolean>(false);
    const [placeholderData, setPlaceholderData] = useState<Record<string, string[]>>({});
    console.log("🚀 ~ SendPushSeparately ~ placeholderData:", placeholderData)
    const [editMode, setEditMode] = useState<boolean[]>(Array(Object.keys(placeholderData)[0]?.length).fill(false));
    const [newRowData, setNewRowData] = useState<Record<string, string>>({});
    const[sendPushSeprartely]=useSendPushSeprartelyMutation()
    const navigate=useNavigate()
    const dispatch = useDispatch();
    const template = useSelector(selectPush);
    const[getPushById]=useGetPushByIdMutation()
    const[processPushExcel]=useProcessPushExcelMutation()
    const { id } = useParams();
    useEffect(() => {
      fetchData()
    }, []);

    const handleExcelUpload = async (file: File) => {
      try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('requiredPlaceholders', JSON.stringify(template?.placeholders)); 

          const response = await processPushExcel(formData).unwrap();
          console.log('Data processed successfully:', response);
          setPlaceholderData(response)
      } catch (error) {
          console.error('Error processing data:', error);
      }
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
        try {
          if(template){
            const sendPush:WebPushExcelProcessor = {
              template: {
                id: 1,
                title: "Important Update",
                message: "Please check the latest updates.",
                icon: "https://example.com/icon.png",
                clickTarget: "https://example.com",
                placeholders: ["user"],
                userFavoritePush: [101, 102],
              },
              placeholderData: placeholderData,
            };
        
            const response = await sendPushSeprartely(sendPush).unwrap();
            console.log("🚀 ~ SendPushSeparately ~ response:", response)
            toast.success("Push Notifications sent Successfully!");
            navigate(LIST_PUSH_TEMPLATES);
          }
         
        } catch (error: any) {
          if (error && error.data) {
            toast.error(error.data || "An unknown error occurred.");
          console.error("🚀 ~ error:", error);
        }
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

  return (
    <>
      <BreadcrumSection />
      <MDBContainer style={{ width: '88%', marginLeft: '10%' }} fluid className='p-4 mt-5'>
        <MDBRow>
          {/* <MDBCol
            style={{
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'center',
              backgroundImage: 'url(../../../assets/worksheet.png)',
              backgroundSize: '60% 50%',
            }}
            md='4'
            className='text-center text-md-start d-flex flex-column justify-content-center mt-4'
          >

          </MDBCol> */}

          <MDBCol md='14'>
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
                  <img src="../../../assets/worksheet.png" alt="worksheet" width={35} />
                  <MDBCard className='my-4'>
                  <MDBCardBody className='p-5' style={{ maxHeight: '170px', overflowY: 'auto' }}>
                    <MDBTable
                      striped
                      hover
                      bordered
                      style={{ width: '100%', tableLayout: 'fixed' }}
                    >
                      <MDBTableHead color='blue lighten-4'>
                        <tr style={{ background: 'rgb(141, 224, 198)' }}>
                          <th style={{ minWidth: '120px' }}>NotificationEndPoint</th>
                          <th style={{ minWidth: '120px' }}>PublicKey</th>
                          <th style={{ minWidth: '120px' }}>Auth</th>
                          {template?.placeholders.map(placeholder => (
                            <th key={placeholder} style={{ minWidth: '120px' }}>{placeholder}</th>
                          ))}
                          <th style={{ minWidth: '120px' }}>Actions</th>
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
                                    value={placeholderData["notificationendpoint"]?.[rowIndex] || 'unknown'}
                                    onChange={(e) => handleInputChange("notificationendpoint", rowIndex, e.target.value)}
                                    fullWidth
                                  />
                                ) : (
                                  <span>{placeholderData["notificationendpoint"]?.[rowIndex] || 'unknown'}</span>
                                )}
                              </td>
                              <td>
                                {editMode[rowIndex] ? (
                                  <TextField
                                    variant="outlined"
                                    size="small"
                                    value={placeholderData["publickey"]?.[rowIndex] || 'unknown'}
                                    onChange={(e) => handleInputChange("publickey", rowIndex, e.target.value)}
                                    fullWidth
                                  />
                                ) : (
                                  <span>{placeholderData["publickey"]?.[rowIndex] || 'unknown'}</span>
                                )}
                              </td>
                              <td>
                                {editMode[rowIndex] ? (
                                  <TextField
                                    variant="outlined"
                                    size="small"
                                    value={placeholderData["auth"]?.[rowIndex] || 'unknown'}
                                    onChange={(e) => handleInputChange("auth", rowIndex, e.target.value)}
                                    fullWidth
                                  />
                                ) : (
                                  <span>{placeholderData["auth"]?.[rowIndex] || 'unknown'}</span>
                                )}
                              </td>
                              {template?.placeholders.map(placeholder => (
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
                                    <Update style={{ color: "whitesmoke" }} />
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
                                value={newRowData['notificationendpoint'] || ''}
                                onChange={(e) => handleNewRowChange('notificationendpoint', e.target.value)}
                                fullWidth
                                placeholder="notificationendpoint"
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                size="small"
                                value={newRowData['publickey'] || ''}
                                onChange={(e) => handleNewRowChange('publickey', e.target.value)}
                                fullWidth
                                placeholder="publickey"
                              />
                            </td>
                            <td>
                              <TextField
                                variant="outlined"
                                size="small"
                                value={newRowData['auth'] || ''}
                                onChange={(e) => handleNewRowChange('auth', e.target.value)}
                                fullWidth
                                placeholder="auth"
                              />
                            </td>
                            {template?.placeholders.map(placeholder => (
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
                  </MDBCardBody>

                  </MDBCard>

                  <MDBBtn type="button" className='ms-5 w-60 mb-4 color_baby_bluee me-5'>
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