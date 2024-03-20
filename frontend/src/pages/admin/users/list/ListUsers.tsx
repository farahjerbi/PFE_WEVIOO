import { MDBBadge, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBPagination, MDBPaginationItem, MDBPaginationLink, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit'
import  { useEffect, useState } from 'react'
import { useActivateUserMutation, useDesActivateUserMutation, useGetAllUsersMutation } from '../../../../redux/services/usersApi';
import { toast } from 'sonner';
import { IUser } from '../../../../models/User';
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection';
import './ListUsers.css'
import DeleteUserModal from '../../../../components/modals/DeleteUserModal';
import { Role } from '../../../../models/Role';
import Delete from '@mui/icons-material/Delete';
import PersonOff from '@mui/icons-material/PersonOff';
import PersonOutline from '@mui/icons-material/PersonOutline';
import { Button, Tooltip } from '@mui/material';

const ListUsers = () => {
  const [updated, setUpdated] = useState<boolean>(false);
    useEffect(() => {
        fetchData(); 
      }, [updated]);
      const [users, setUsers] = useState<IUser[]>([]);
      const [idDelete, setIdDelete] = useState<number>();
      const[getAllUsers]=useGetAllUsersMutation();
      const[desActivateUser]=useDesActivateUserMutation();
      const[activateUser]=useActivateUserMutation();
      const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
      //Pagination 
      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 4; 
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = users.slice(indexOfFirstItem, indexOfLastItem);
    
      const handlePageChange = (page:any) => {
        setCurrentPage(page);
      };

      //endPagination

      const fetchData = async () => {
        try {
          const response = await getAllUsers({}).unwrap();
          console.log("🚀 ~ fetchData ~ response:", response)
          setUsers(response); 
          console.error("🚀 ~ error:", users);
        } catch (error) {
          toast.error("Error! Yikes");
          console.error("🚀 ~ error:", error);
        }
      };

      const activate = async (email:string) => {
        try {
          await activateUser(email);
          toast.success("User Activated !");
          setUpdated(!updated)
        } catch (error) {
          toast.error("Error! Yikes");
          console.error("🚀 ~ error:", error);
        }
      };

      const desactivate = async (email:string) => {
        try {
          await desActivateUser(email);
          toast.success("User DesActivated !");
          setUpdated(!updated)
        } catch (error) {
          toast.error("Error! Yikes");
          console.error("🚀 ~ error:", error);
        }
      };

      const handleUpdate = () => {
        setUpdated(!updated); 
        setDeleteModalOpen(false)
            };

  return (
    <div className='users_container'>
       <BreadcrumSection />
        <MDBCol md="10" className="list_container mb-4 d-flex align-items-center ">
                <MDBCard style={{marginTop:"7%" , marginLeft:'4%'}} >
                    <MDBCardBody>
                    <MDBTable striped hover bordered >
                        <MDBTableHead color="blue lighten-4">
                        <tr>
                            <th>#id</th>
                            <th>FirstName</th>
                            <th>LastName</th>
                            <th>Email</th>
                            <th>Status</th>
                            <th> Activate / Desactivate </th>
                            <th>Delete</th>
                        </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                        {currentItems.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.email}</td>
                            {user.enabled ==="true"  && (
                                    <td>
                                    <MDBBadge color='primary' pill>
                                        Enabled
                                </MDBBadge>
                                </td>
                            )}
                                {user.enabled ==="false"&& (
                                    <td>
                                    <MDBBadge color='info' pill>
                                        Unenabled 
                                </MDBBadge>
                                </td>
                            )}
                            <td>
                            <div className='buttons'>
                            {user.enabled ==="false"&& ( 
                               <Tooltip  style={{width:"100%"}} title="Activate Account" className="color_blue" >
                               <Button  onClick={()=>activate(user.email)} >
                               <PersonOutline style={{color:"whitesmoke"}}  />
                               </Button>                           
                               </Tooltip>
                            )}
                            {user.enabled ==="true"&& (
                                      <Tooltip  style={{width:"100%"}} title="Desactivate Account" className="color_baby_blue" >
                                      <Button  onClick={()=>desactivate(user.email)}  >
                                      <PersonOff style={{color:"whitesmoke"}}  />
                                      </Button>                           
                                      </Tooltip>
                                 )}                           
                                 
                                
                             </div>
                            </td>
                            <td>
                              
                          <Tooltip title="Delete" className="color_red" >
                          <Button  onClick={() => { setDeleteModalOpen(true); setIdDelete(user.id)}}>
                          <Delete style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>
                            </td>
                        </tr>
                        ))}
                        </MDBTableBody>
                    </MDBTable>
                    </MDBCardBody>
                    <nav aria-label='Page navigation example'>
                    <MDBPagination circle center className='mb-2'>
                      <MDBPaginationItem disabled={currentPage === 1}>
                        <MDBPaginationLink onClick={() => handlePageChange(currentPage - 1)}>Previous</MDBPaginationLink>
                      </MDBPaginationItem>
                      {Array.from({ length: Math.ceil(users.length / itemsPerPage) }, (_, i) => (
                        <MDBPaginationItem key={i} active={i + 1 === currentPage}>
                          <MDBPaginationLink onClick={() => handlePageChange(i + 1)}>{i + 1}</MDBPaginationLink>
                        </MDBPaginationItem>
                      ))}
                      <MDBPaginationItem disabled={currentPage === Math.ceil(users.length / itemsPerPage)}>
                        <MDBPaginationLink onClick={() => handlePageChange(currentPage + 1)}>Next</MDBPaginationLink>
                      </MDBPaginationItem>
                    </MDBPagination>
                  </nav>
                </MDBCard>
            </MDBCol> 
      {idDelete && (
         <DeleteUserModal typeUser={Role.ADMIN} id={idDelete} show={deleteModalOpen}  onClose={handleUpdate}/> )}

    </div>
  )
}

export default ListUsers