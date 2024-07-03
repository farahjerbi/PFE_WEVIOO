import React, { useState } from 'react'
import { ScheduledPushInfo } from '../../models/push/ScheduledPushInfo'
import { MDBBadge, MDBCard, MDBCardBody, MDBCol, MDBPagination, MDBPaginationItem, MDBPaginationLink, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit';
import { Button, Tooltip } from '@mui/material';
import Delete from '@mui/icons-material/Delete';
import { NotificationType } from '../../models/NotificationType';
import DeleteScheduledNotif from '../modals/delete/DeleteScheduledNotif';
interface Props{
    push:ScheduledPushInfo[] ,
    }
const ListScheduledPush : React.FC<Props> = ({ push  })=> {
        //PAGINATION
        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 4;
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = push?.slice(indexOfFirstItem, indexOfLastItem);
        const handlePageChange = (page: any) => {
            setCurrentPage(page);
          };
        //END PAGINATION
        const[query,setQuery]=useState<string>('')
        const[deleteModal,setDeleteModal]=useState<boolean>(false)
        const[selectedId,setSelectedId]=useState<string>('')
  return (
    <>
    <MDBCol
className="mb-4 d-flex align-items-center"
>
<MDBCard style={{ background: 'hsla(0, 0%, 100%, 0.55)',
      backdropFilter: 'blur(30px)'}} >
  <MDBCardBody >
    <MDBTable striped hover bordered>
      <MDBTableHead color="blue lighten-4">
      <tr>
          <th className='tab'>Name template</th>
          <th className='tab'>Type</th>
          <th className='tab'>Subscriptions</th>
          <th className='tab'>Time of Sent</th>
          <th className='tab'>unschedule</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {currentItems?.filter(
(template:any)=>template.templateName.toLowerCase().includes(query)).map((template:any) => (
          <tr key={template.templateId}>
            <td className='tab'>{template.templateName}</td>
           
              <td className='tab'>
                <MDBBadge color="warning" pill>
                   Web Push
                </MDBBadge>
              </td>
              <td className='tab'>{template.numbers}</td>
              <td className='tab'>{template.nextTimeFired}</td>
              <td>
              <Tooltip title="Delete" className="color_pink" >
                <Button 
                onClick={() => { 
                  setSelectedId(template.jobId)
                  setDeleteModal(true)
                }}
                >
                <Delete style={{color:"whitesmoke"}}  />
                </Button>                           
                </Tooltip>
                    </td>
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
      {push && Array.from(
        { length: Math.ceil(push?.length / itemsPerPage) },
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
      {push && (
          <MDBPaginationItem
          disabled={
              currentPage === Math.ceil(push?.length / itemsPerPage)
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
</MDBCard>
</MDBCol> 
{selectedId && (
<DeleteScheduledNotif id={selectedId} onClose={()=>{setDeleteModal(false);setSelectedId("")}} show={deleteModal} type={NotificationType.PUSH} />
)}
</>  )
}

export default ListScheduledPush