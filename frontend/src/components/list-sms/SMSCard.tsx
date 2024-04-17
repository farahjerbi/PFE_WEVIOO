import React, { useState } from 'react'
import Visibility from '@mui/icons-material/Visibility';
import Update from '@mui/icons-material/Update';
import Delete from '@mui/icons-material/Delete';
import BookmarkRemoveOutlined from '@mui/icons-material/BookmarkRemoveOutlined';
import BookmarkAddedOutlined from '@mui/icons-material/BookmarkAddedOutlined';
import Send from '@mui/icons-material/Send';
import ScheduleSend from '@mui/icons-material/ScheduleSend';
import { MDBBadge, MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBIcon, MDBPagination, MDBPaginationItem, MDBPaginationLink, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import { Button, Tooltip } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { Role } from '../../models/user/Role';
import { SmsTemplate } from '../../models/sms/SmsTemplate';
import { IUser } from '../../models/user/User';
import './SMSCard.css'
interface PropsSMS{
role:Role | null,
templates:SmsTemplate[] | null,
user:IUser | null
}
const SMSCard : React.FC<PropsSMS> = ({ role ,templates ,user }) => {
    const navigate = useNavigate();
    const[query,setQuery]=useState<string>('')
       /*Pagination*/
       const [currentPage, setCurrentPage] = useState(1);
       const itemsPerPage = 4;
       const indexOfLastItem = currentPage * itemsPerPage;
       const indexOfFirstItem = indexOfLastItem - itemsPerPage;
       const currentItems = templates?.slice(indexOfFirstItem, indexOfLastItem);
       const handlePageChange = (page: any) => {
           setCurrentPage(page);
         };
       

  return (
    <MDBCard className='ms-5 sms-card' >
<MDBCardBody>
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
        <th> Send Immediatly </th>
        <th> Schedule </th>
        </>)}

      </tr>
    </MDBTableHead>
    <MDBTableBody>
      {currentItems?.filter(
(template:any)=>template.name.toLowerCase().includes(query) ||
template.state?.toString()===query).map((template:any) => (
        <tr key={template.id}>
          <td>{template.name}</td>
          <td>{template.language}</td>
            <td>
              <Tooltip style={{marginRight:"5px"}} title="View" className="color_purple" >
              <Button >
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
            //   onClick={() => { setDeleteModalOpen(true); setIdDelete(template.id)}}
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
</MDBCard> )
}

export default SMSCard