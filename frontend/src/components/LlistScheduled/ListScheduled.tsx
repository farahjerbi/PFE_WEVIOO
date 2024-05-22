import Visibility from '@mui/icons-material/Visibility'
import { Button, Tooltip } from '@mui/material'
import { MDBBadge, MDBCard, MDBCardBody, MDBCol, MDBPagination, MDBPaginationItem, MDBPaginationLink, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit'
import React, { useState } from 'react'
import { SchedularSMSProps } from '../../models/email/SchedularProps'
import { ScheduledSMSResponse } from '../../models/sms/ScheduledSMSResponse'
interface Props{
    sms:ScheduledSMSResponse[] ,
    type:string
    }
const ListScheduled: React.FC<Props> = ({ sms ,type })=> {
        //PAGINATION
        const [currentPage, setCurrentPage] = useState(1);
        const itemsPerPage = 4;
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        const currentItems = sms?.slice(indexOfFirstItem, indexOfLastItem);
        const handlePageChange = (page: any) => {
            setCurrentPage(page);
          };
        //END PAGINATION
        const[query,setQuery]=useState<string>('')

  return (
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
              <th className='tab'>Recipients Numbers</th>
              <th className='tab'>Time of Sent</th>
              <th>Delete</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            {currentItems?.filter(
    (template:any)=>template.templateName.toLowerCase().includes(query)).map((template:any) => (
              <tr key={template.templateId}>
                <td className='tab'>{template.templateName}</td>
               
                  <td className='tab'>
                    <MDBBadge color="primary" pill>
                      {type}
                    </MDBBadge>
                  </td>
                  <td className='tab'>{template.numbers}</td>
                  <td className='tab'>{template.nextTimeFired}</td>
                  <td>
                    delete
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
          {sms && Array.from(
            { length: Math.ceil(sms.length / itemsPerPage) },
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
          {sms && (
              <MDBPaginationItem
              disabled={
                  currentPage === Math.ceil(sms.length / itemsPerPage)
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
  )
}

export default ListScheduled