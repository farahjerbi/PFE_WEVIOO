import React, { useState } from 'react'
import Visibility from '@mui/icons-material/Visibility';
import Update from '@mui/icons-material/Update';
import Delete from '@mui/icons-material/Delete';
import BookmarkRemoveOutlined from '@mui/icons-material/BookmarkRemoveOutlined';
import BookmarkAddedOutlined from '@mui/icons-material/BookmarkAddedOutlined';
import Send from '@mui/icons-material/Send';
import ScheduleSend from '@mui/icons-material/ScheduleSend';
import { MDBCard, MDBCardBody, MDBPagination, MDBPaginationItem, MDBPaginationLink, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import { Button, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { Role } from '../../models/user/Role';
import { SmsTemplate } from '../../models/sms/SmsTemplate';
import { IUser } from '../../models/user/User';
import './SMSCard.css'
import ViewSMSTemplate from '../modals/ViewSMSTemplate';
import DeleteSMSTemplate from '../modals/DeleteSMSTemplate';
import {  setSelectedSms, setUpdateSMSFav } from '../../redux/state/smsSlice';
import { CREATE_SMS_TEMPLATE, SEND_SMS, UPDATE_SMS_TEMPLATE } from '../../routes/paths';
import { useDispatch } from 'react-redux';
import { useToggleFavoriteSMSMutation } from '../../redux/services/smsApi';
import { toast } from 'sonner';
interface PropsSMS{
role:Role | null,
templates:SmsTemplate[] | null,
user:IUser | null
}
const SMSCard : React.FC<PropsSMS> = ({ role ,templates ,user }) => {
    const [basicModal, setBasicModal] = useState<boolean>(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
    const [selectedTemplate, setSelectedTemplate] = useState<SmsTemplate>();
    const [selectedId, setSelectedId] = useState<number>();
    const[toggleFavoriteSMS]=useToggleFavoriteSMSMutation()
    const dispatch=useDispatch()
    const navigate = useNavigate();
    const[query,setQuery]=useState<string>('')
       /*Pagination*/
       const [currentPage, setCurrentPage] = useState(1);
       const itemsPerPage = 3;
       const indexOfLastItem = currentPage * itemsPerPage;
       const indexOfFirstItem = indexOfLastItem - itemsPerPage;
       const currentItems = templates?.slice(indexOfFirstItem, indexOfLastItem);
       const handlePageChange = (page: any) => {
           setCurrentPage(page);
         };

         const toggleFavoriteSMSFunc=async(template:SmsTemplate)=>{
          try{
             await toggleFavoriteSMS({idTemplate:template.id,idUser:user?.id})
             if (user) {
              const isFavorite = template.userFavoriteSms?.includes(user.id);
              if(template.id){              
                dispatch(setUpdateSMSFav({id: template.id, idUser: user.id }));
              }
      
              const msg = isFavorite 
                  ? "Template removed from favorites successfully" 
                  : "Template added to favorites successfully";
      
              toast.success(msg);
          }
          }catch(error){
            toast.error("Error !!")
          }
        }
        
        

  return (
    <MDBCard className='ms-5 sms-card' >
<MDBCardBody>
  <div className='d-flex justify-content-between align-items-center mb-2'>
  {role===Role.ADMIN && (  <Button onClick={()=>navigate(CREATE_SMS_TEMPLATE)} style={{width:"20%"}} size="small" className="mb-2" >
                      <img  src="../../../assets/add.png" alt="" style={{width:"25%",marginRight:"3%"}} />Create
                      </Button>)}
                      <div className="d-flex align-items-center justify-content-end">
            <input
              type="text"
              className="search-hover"
              placeholder="Search here..."
              onChange={(e) => setQuery(e.target.value)}
              />
                    <img className='ms-3' src="../../../assets/speech-bubble.png" alt="search" style={{width:"3%"}} />

                      </div>
          
  </div>

  <MDBTable striped hover bordered>
    <MDBTableHead color="blue lighten-4">
      <tr>
        <th>Name</th>
        <th>Language</th>
        <th> View </th>
        {role===Role.ADMIN && ( <th> Update </th>)}
        {role===Role.ADMIN && ( <th> Delete </th>)}
        {role===Role.USER && 
        (<>
        <th>Save</th>
        <th> Send </th>
        </>)}

      </tr>
    </MDBTableHead>
    <MDBTableBody>
      {currentItems?.filter(
    (template:any)=>template.name.toLowerCase().includes(query)).map((template:any) => (
        <tr key={template.id}>
          <td>{template.name}</td>
          <td>{template.language}</td>
            <td>
              <Tooltip style={{marginRight:"5px"}} title="View" className="color_purple" >
              <Button onClick={()=>{setSelectedTemplate(template); setBasicModal(true)}}>
              <Visibility style={{color:"whitesmoke"}}  />
              </Button>                           
              </Tooltip>
            </td>
            {role===Role.ADMIN && (
              <>
              <td>
              <Tooltip style={{marginRight:"5px"}}  title="Update" className="color_white" >
              <Button 
              onClick={() =>
              {
                  dispatch(setSelectedSms(template));
                  navigate(`${UPDATE_SMS_TEMPLATE}`)
                }}
                >
              <Update style={{color:"whitesmoke"}}  />
              </Button>                           
              </Tooltip>
              </td>
                
                <td>
                <Tooltip title="Delete" className="color_pink" >
              <Button 
              onClick={() => { 
                setSelectedId(template.id)
                setDeleteModalOpen(true)
              }}
              >
              <Delete style={{color:"whitesmoke"}}  />
              </Button>                           
              </Tooltip>
                </td>
        

              </>
            )}
          
          {role===Role.USER && (
            <>
                      <td>
                      <Tooltip style={{marginRight:"5px"}} title={user && template.userFavoriteSms?.includes(user.id) ?"Remove Template":"Save Template"} className="color_pink" >
                        <Button  
                        onClick={() =>toggleFavoriteSMSFunc(template)}
                        >
                        {user && template.userFavoriteSms?.includes(user.id) ? (
                        <BookmarkRemoveOutlined style={{color:"whitesmoke"}}  /> ):<BookmarkAddedOutlined style={{color:"whitesmoke"}}  /> }
                        </Button>                           
                        </Tooltip>
                    </td>
          
         
             <td>
            <Tooltip style={{marginRight:"5px"}} title="Send" className="color_blue" >
              <Button  
                 onClick={() =>{navigate(`${SEND_SMS}/${template.id}`)}}
              >
              <Send style={{color:"whitesmoke"}}  />
              </Button>                           
              </Tooltip>
          </td>
            </>
          )}
         
        </tr>
      ))}
    </MDBTableBody>
  </MDBTable>
</MDBCardBody>
<nav aria-label="Page navigation example">
  <MDBPagination circle center className="mb-2">
    <MDBPaginationItem disabled={currentPage === 1}>
      <MDBPaginationLink
        onClick={() => handlePageChange(currentPage - 1)}
      >
        Previous
      </MDBPaginationLink>
    </MDBPaginationItem>
    {Array.from(
      { length: Math.ceil(2 / itemsPerPage) },
      (_, i) => (
        <MDBPaginationItem key={i} active={i + 1 === currentPage}>
          <MDBPaginationLink
            onClick={() => handlePageChange(i + 1)}
          >
            {i + 1}
          </MDBPaginationLink>
        </MDBPaginationItem>
      )
    )}
    <MDBPaginationItem
      disabled={
        currentPage === Math.ceil(2 / itemsPerPage)
      }
    >
      <MDBPaginationLink
        onClick={() => handlePageChange(currentPage + 1)}
      >
        Next
      </MDBPaginationLink>
    </MDBPaginationItem>
  </MDBPagination>
</nav>
{selectedTemplate && (<ViewSMSTemplate template={selectedTemplate} show={basicModal} onClose={()=>setBasicModal(false)}  />)}
{selectedId && ( <DeleteSMSTemplate id={selectedId} onClose={()=>setDeleteModalOpen(false)} show={deleteModalOpen} /> )}
</MDBCard> 

)
}

export default SMSCard