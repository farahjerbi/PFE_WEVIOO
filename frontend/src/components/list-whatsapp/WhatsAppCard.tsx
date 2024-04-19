import React, { useState } from 'react'
import Visibility from '@mui/icons-material/Visibility';
import Update from '@mui/icons-material/Update';
import Delete from '@mui/icons-material/Delete';
import BookmarkRemoveOutlined from '@mui/icons-material/BookmarkRemoveOutlined';
import BookmarkAddedOutlined from '@mui/icons-material/BookmarkAddedOutlined';
import Send from '@mui/icons-material/Send';
import ScheduleSend from '@mui/icons-material/ScheduleSend';
import { MDBBadge, MDBCard, MDBCardBody, MDBPagination, MDBPaginationItem, MDBPaginationLink, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import { Button, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { Role } from '../../models/user/Role';
import { IUser } from '../../models/user/User';
import './WhatsAppCard.css'
import { WhatsAppTemplateResponse } from '../../models/sms/WhatsAppTemplateResponse';
import ViewSMSTemplate from '../modals/ViewSMSTemplate';
import DeleteSMSTemplate from '../modals/DeleteSMSTemplate';
interface PropsWhatsapp{
    role:Role | null,
    templates:WhatsAppTemplateResponse[] ,
    user:IUser | null
    }
const WhatsAppCard : React.FC<PropsWhatsapp> = ({ role ,templates ,user }) => {
  const [basicModal, setBasicModal] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [selectedTemplate, setSelectedTemplate] = useState<WhatsAppTemplateResponse>();
  const [selectedId, setSelectedId] = useState<string>();

    const navigate = useNavigate();
    const[query,setQuery]=useState<string>('')
       /*Pagination*/
       const [currentPage, setCurrentPage] = useState(1);
       const itemsPerPage = 4;
       const indexOfLastItem = currentPage * itemsPerPage;
       const indexOfFirstItem = indexOfLastItem - itemsPerPage;
       const currentItems = templates.slice(indexOfFirstItem, indexOfLastItem);
       const handlePageChange = (page: any) => {
           setCurrentPage(page);
         };
       
  return (
    <MDBCard className='ms-5 whatsapp-card' >
<MDBCardBody>
  <MDBTable striped hover bordered>
    <MDBTableHead color="blue lighten-4">
      <tr>
        <th>Name</th>
        <th>Language</th>
        <th>State</th>
        <th> View </th>
        {role===Role.ADMIN && ( <th> Update </th>)}
        {role===Role.ADMIN && ( <th> Delete </th>)}
        {role===Role.USER && 
        (<>
        <th>Save</th>
        <th> Send Immediatly </th>
        <th> Schedule </th>
        </>)}

      </tr>
    </MDBTableHead>
    <MDBTableBody>
      {currentItems?.map((template:any) => (
        <tr key={template.id}>
          <td>{template.name}</td>
          <td>{template.language}</td>
         
             {template.status === "APPROVED" && (
            <td>
              <MDBBadge color="info" pill>
                Approved
              </MDBBadge>
            </td>
          )}
          {template.status === "REJECTED" && (
            <td>
              <MDBBadge color="danger" pill>
                Rejected
              </MDBBadge>
            </td>
          )}
          
    
            <td>
              <Tooltip style={{marginRight:"5px"}} title="View" className="color_purple" >
              <Button onClick={()=>{setSelectedTemplate(template);setBasicModal(true)}}>
              <Visibility style={{color:"whitesmoke"}}  />
              </Button>                           
              </Tooltip>
            </td>
            {role===Role.ADMIN && (
              <>
              <td>
              <Tooltip style={{marginRight:"5px"}}  title="Update" className="color_white" >
              <Button 
            //   onClick={() =>
            //   {
            //       dispatch(setSelectedEmail(template));
            //       navigate(`${EDIT_EMAIL_TEMPLATE}`)
            //     }}
                >
              <Update style={{color:"whitesmoke"}}  />
              </Button>                           
              </Tooltip>
              </td>
                
                <td>
                <Tooltip title="Delete" className="color_pink" >
              <Button 
              onClick={() => { setDeleteModalOpen(true); setSelectedId(template.name)}}
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
                      <Tooltip style={{marginRight:"5px"}} title={user && template.userFavoriteEmails?.includes(user.id) ?"Remove Template":"Save Template"} className="color_pink" >
                        <Button  
                        // onClick={() =>toggleFavoriteEmailFunc(template)}
                        >
                        {user && template.userFavoriteEmails?.includes(user.id) ? (
                        <BookmarkRemoveOutlined style={{color:"whitesmoke"}}  /> ):<BookmarkAddedOutlined style={{color:"whitesmoke"}}  /> }
                        </Button>                           
                        </Tooltip>
                    </td>
          
         
             <td>
            <Tooltip style={{marginRight:"5px"}} title="Send" className="color_blue" >
              <Button  
            //      onClick={() =>
            //   {
            //     dispatch(setSelectedEmail(template));
            //     navigate(`${SEND_EMAIL}`)
            //   }
            //   }
              >
              <Send style={{color:"whitesmoke"}}  />
              </Button>                           
              </Tooltip>
          </td>
          <td>
            <Tooltip style={{marginRight:"5px"}} title="ScheduleSend" className="color_baby_blue" >
              <Button   
            //   onClick={() =>
            //   {                           
            //      dispatch(setSelectedEmail(template));
            //      navigate(`${SEND_EMAIL_SCHEDULED}`)     
            //   }
            //                           }
                                      >
              <ScheduleSend style={{color:"whitesmoke"}}  />
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
    {templates && Array.from(
      { length: Math.ceil(templates?.length / itemsPerPage) },
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
    {templates && (
          <MDBPaginationItem
          disabled={
            currentPage === Math.ceil(templates?.length/ itemsPerPage)
          }
        >
          <MDBPaginationLink
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Next
          </MDBPaginationLink>
        </MDBPaginationItem>
    )}

  </MDBPagination>
</nav>
{selectedTemplate && (<ViewSMSTemplate template={selectedTemplate} show={basicModal} onClose={()=>setBasicModal(false)}  />)}
{selectedId && ( <DeleteSMSTemplate id={selectedId} onClose={()=>setDeleteModalOpen(false)} show={deleteModalOpen} /> )}

</MDBCard>    )
}

export default WhatsAppCard