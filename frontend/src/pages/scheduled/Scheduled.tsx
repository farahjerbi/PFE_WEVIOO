import React, { useEffect, useState } from 'react'
import './Scheduled.css'
import Calendar from '../admin/Email/calendar/Calendar'
import { MDBBadge, MDBCard, MDBCardBody, MDBCol, MDBPagination, MDBPaginationItem, MDBPaginationLink, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit'
import { Role } from '../../models/user/Role'
import { Button, Tooltip } from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import { useSelector } from 'react-redux'
import { selectRole, selectUser } from '../../redux/state/authSlice'
import { useDeleteScheduledEmailMutation, useGetScheduledEmailsByUserMutation } from '../../redux/services/emailApi'
import { toast } from 'sonner'
import { EmailTemplate } from '../../models/email/EmailTemplate'
import BreadcrumSection from '../../components/BreadcrumSection/BreadcrumSection'
const Scheduled = () => {
    //PAGINATION
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4;
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const[emails,setEmails]=useState<EmailTemplate[]>();
    const currentItems = emails?.slice(indexOfFirstItem, indexOfLastItem);
    const handlePageChange = (page: any) => {
        setCurrentPage(page);
      };
    //END PAGINATION
    const[query,setQuery]=useState<string>('')
    const role = useSelector(selectRole);
    const user = useSelector(selectUser);
    const [basicModal, setBasicModal] = useState<boolean>(false);
    const toggleOpen = () => setBasicModal(!basicModal);
    const[deleteScheduledEmail]=useDeleteScheduledEmailMutation()
    const[getScheduledEmailsByUser]=useGetScheduledEmailsByUserMutation()

    const [idDelete, setIdDelete] = useState<number>();

    useEffect(() => {
        fetchDataUser();
     }, []);
    
    const fetchDataUser = async () => {
        if(user){
          try {
            const response = await getScheduledEmailsByUser(user.id).unwrap();
            setEmails(response)
            console.log("🚀 ~ fetchData ~ response:", response);
          } catch (error) {
            toast.error("Error! Yikes");
            console.error("🚀 ~ error:", error);
          }
        }
      };

  return (
  <>
  <BreadcrumSection/>
  <div className='d-flex'>
  <div className='me-5 ms-5' style={{width:"50%"}}>
        <Calendar/>
        </div>    
        <MDBCol
          className="mb-4 d-flex align-items-center"
        >
          <MDBCard style={{ background: 'hsla(0, 0%, 100%, 0.55)',
                backdropFilter: 'blur(30px)',}} >
            <MDBCardBody>
              <MDBTable striped hover bordered>
                <MDBTableHead color="blue lighten-4">
                <tr>
                    <th>Name template</th>
                    <th>recipients</th>
                    <th>Type</th>
                    <th>Time of sent</th>
                  </tr>
                </MDBTableHead>
                <MDBTableBody>
                  {currentItems?.filter(
          (template:EmailTemplate)=>template.name.toLowerCase().includes(query) ||
          template.state?.toString()===query).map((template:EmailTemplate) => (
                    <tr key={template.id}>
                      <td>{template.name}</td>
                      <td>{template.language}</td>
                     
                         {template.state === "SIMPLE" && (
                        <td>
                          <MDBBadge color="info" pill>
                            {template.state}
                          </MDBBadge>
                        </td>
                      )}
                      {template.state === "COMPLEX" && (
                        <td>
                          <MDBBadge color="primary" pill>
                            Advanced
                          </MDBBadge>
                        </td>
                      )}
                      
                
                      <td>
                        <div className="buttons">

                          <Tooltip style={{marginRight:"5px"}} title="View" className="color_purple" >
                          <Button >
                          <Visibility style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>
                  
                      
                        </div>
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
                {emails && Array.from(
                  { length: Math.ceil(emails.length / itemsPerPage) },
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
                {emails && (
                    <MDBPaginationItem
                    disabled={
                        currentPage === Math.ceil(emails.length / itemsPerPage)
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
  </div>
  
  </>
  )
}

export default Scheduled