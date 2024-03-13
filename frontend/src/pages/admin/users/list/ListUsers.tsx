import { MDBBadge, MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBPagination, MDBPaginationItem, MDBPaginationLink, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit'
import  { useEffect, useState } from 'react'
import { useActivateUserMutation, useDeleteUserMutation, useDesActivateUserMutation, useGetAllUsersMutation } from '../../../../redux/services/usersApi';
import { toast } from 'sonner';
import { User } from '../../../../models/User';
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection';
import './ListUsers.css'
const ListUsers = () => {
  const [updated, setUpdated] = useState<boolean>(false);
    useEffect(() => {
        fetchData(); 
      }, [updated]);
      const [users, setUsers] = useState<User[]>([]);
      const [idDelete, setIdDelete] = useState<number>();
      console.log("🚀 ~ ListUsers ~ idDelete:", idDelete)
      const[getAllUsers]=useGetAllUsersMutation();
      const[desActivateUser]=useDesActivateUserMutation();
      const[activateUser]=useActivateUserMutation();
      const[deleteUser]=useDeleteUserMutation();
      const [basicModal, setBasicModal] = useState(false);

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
      const toggleOpen = () => setBasicModal(!basicModal);
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
          setUpdated(true)
        } catch (error) {
          toast.error("Error! Yikes");
          console.error("🚀 ~ error:", error);
        }
      };

      const desactivate = async (email:string) => {
        try {
          await desActivateUser(email);
          toast.success("User DesActivated !");
          setUpdated(true)
        } catch (error) {
          toast.error("Error! Yikes");
          console.error("🚀 ~ error:", error);
        }
      };

      const deleteU = async (id:number) => {
        try {
          await deleteUser(id);
          toast.success("User Deleted Successfully !");
          setBasicModal(!basicModal)
          setUpdated(true)
        } catch (error) {
          toast.error("Error! Yikes");
          console.error("🚀 ~ error:", error);
        }
      };

  return (
    <div className='users_container'>
       <BreadcrumSection />
        <MDBCol md="10" className="list_container mb-4 d-flex align-items-center mt-5">
                <MDBCard>
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
                            {user.enabled ==="false"&& ( <MDBBtn className='btn' color='primary' onClick={()=>activate(user.email)} >Activate </MDBBtn>  )}
                            {user.enabled ==="true"&& ( <MDBBtn className='btn' color='info' onClick={()=>desactivate(user.email)} >Desactivate </MDBBtn>  )}                            </div>
                            </td>
                            <td>
                            <MDBBtn className='btn' color='danger' onClick={() => {toggleOpen(); setIdDelete(user.id)}}>Delete</MDBBtn>
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

        <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Delete User</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>Are you sure you want to delete this user ?</MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleOpen}>
                Close
              </MDBBtn>
              {idDelete && ( <MDBBtn color='danger' onClick={()=>deleteU(idDelete)}> Yes ! </MDBBtn> )}
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </div>
  )
}

export default ListUsers