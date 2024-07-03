import { MDBBadge, MDBCard, MDBCardBody, MDBCardText, MDBCardTitle, MDBCol, MDBContainer, MDBPagination, MDBPaginationItem, MDBPaginationLink, MDBRow } from 'mdb-react-ui-kit'
import  { useEffect, useState } from 'react'
import { useActivateUserMutation, useDesActivateUserMutation } from '../../../../redux/services/usersApi';
import { toast } from 'sonner';
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection';
import './ListUsers.css'
import DeleteUserModal from '../../../../components/modals/delete/DeleteUserModal';
import { Role } from '../../../../models/user/Role';
import Delete from '@mui/icons-material/Delete';
import PersonOff from '@mui/icons-material/PersonOff';
import PersonOutline from '@mui/icons-material/PersonOutline';
import {  Button, Tooltip } from '@mui/material';
import Avatar from 'react-avatar';
import { useDispatch, useSelector } from 'react-redux';
import { getUsers, selectUsers, setUpdateUserEnabled } from '../../../../redux/state/usersSlice';
import { AppDispatch } from '../../../../redux/store';

const ListUsers = () => {
      const dispatchAction: AppDispatch = useDispatch(); 
      const [idDelete, setIdDelete] = useState<number>();
      const dispatch=useDispatch();
      const users=useSelector(selectUsers)
      const[desActivateUser]=useDesActivateUserMutation();
      const[activateUser]=useActivateUserMutation();
      const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
      const[query,setQuery]=useState<string>('')
      //Pagination 
      const [currentPage, setCurrentPage] = useState(1);
      const itemsPerPage = 6; 
      const indexOfLastItem = currentPage * itemsPerPage;
      const indexOfFirstItem = indexOfLastItem - itemsPerPage;
      const currentItems = users?.slice(indexOfFirstItem, indexOfLastItem);
      useEffect(() => {
        dispatchAction(getUsers());
        });
      const handlePageChange = (page:any) => {
        setCurrentPage(page);
      };


      const activate = async (email:string) => {
        try {
          await activateUser(email);
          dispatch(setUpdateUserEnabled({email:email,enabled:"true"}))
          toast.success("User Activated !");
        } catch (error) {
          toast.error("Error! Yikes");
          console.error("🚀 ~ error:", error);
        }
      };

      const desactivate = async (email:string) => {
        try {
          await desActivateUser(email);
          dispatch(setUpdateUserEnabled({email:email,enabled:"false"}))
          toast.success("User DesActivated !");
        } catch (error) {
          toast.error("Error! Yikes");
          console.error("🚀 ~ error:", error);
        }
      };

      const handleUpdate = () => {
        setDeleteModalOpen(false)
            };

  return (
    <>
           <BreadcrumSection />      
        <MDBRow style={{marginLeft:"12%"}}  >
        <MDBContainer className="mt-5 d-flex mb-3" style={{width:"80%",paddingTop:"3%"}} >
          <img src="../../../assets/search .png" alt="search" style={{width:"3%"}} />
            <input
              type="text"
              className="search-hover"
              placeholder="Search here..."
              onChange={(e) => setQuery(e.target.value)}
              />
              
              <Button  onClick={()=>setQuery("")} size="small"  >
              <img src="../../../assets/users-search.png" alt="" style={{width:"9%",borderRadius:"5px",marginRight:"2%"}}/>
                  All Users
              </Button>      
              <Button  onClick={()=>setQuery("true")} size="small"  >
              <img  src="../../../assets/add-friend.png" alt="" style={{width:"9%",marginRight:"2%"}}  /> Enabled Users
              </Button>
              <Button onClick={()=>setQuery("false")} size="small"  >
              <img  src="../../../assets/unfollow.png" alt="" style={{width:"9%",marginRight:"2%"}} /> Disabled Users
              </Button>
             

          </MDBContainer>
        {currentItems?.filter(
          (e)=>e.firstName.toLowerCase().includes(query) ||
           e.lastName.toLowerCase().includes(query) ||
           e.email.toLowerCase().includes(query)||
           e.enabled.toString()===query

        ).map(user => (

        <MDBCol key={user.id} xl="3" md="6" className="mb-r me-4 mt-4 ms-5">
            <MDBCard style={{borderRadius:"none",minHeight:"230px"}}>
              <MDBCardBody >
                <div className="d-flex text-black">
                  <div className="flex-grow-1">
                  <div className='d-flex' style={{ alignItems: "center", justifyContent: "start" }}>
    <Avatar
        color="linear-gradient(90deg, rgba(216, 233, 249, 1) 0%, rgba(171, 201, 255, 1) 51%, rgba(171, 181, 255, 1) 100%)"
        name={user.firstName}
        initials={user.firstName.charAt(0).toUpperCase()}
        size={"30"}
        round
    />
    <div style={{ marginLeft: "10px",marginTop:"3%" }}>
        <MDBCardTitle>{user.firstName} {user.lastName} </MDBCardTitle>
          </div>
          {user.enabled ==="true"  && (
                                    <td>
                                    <MDBBadge color='primary' pill style={{fontSize:"0.7rem"}}>
                                        Enabled
                                </MDBBadge>
                                </td>
                            )}
                                {user.enabled ==="false"&& (
                                    <td>
                                    <MDBBadge color='info' pill>
                                        Disabled 
                                </MDBBadge>
                                </td>
                            )}
      </div>
                    <MDBCardText className='mt-3'>
                      <div className='d-flex' style={{alignItems: "center"}}>
                      <span> {user.email}</span>
                      </div>
              
                        </MDBCardText>
                
                    <div className="d-flex pt-1">
                      {user.enabled ==="false"&& ( 
                               <Tooltip  style={{width:"60%"}} title="Activate Account" className="color_blue" >
                               <Button  onClick={()=>activate(user.email)} >
                               <PersonOutline style={{color:"whitesmoke"}}  />
                               </Button>                           
                               </Tooltip>
                            )}
                            {user.enabled ==="true"&& (
                                      <Tooltip  style={{width:"60%"}} title="Desactivate Account" className="color_white" >
                                      <Button  onClick={()=>desactivate(user.email)}  >
                                      <PersonOff style={{color:"whitesmoke"}}  />
                                      </Button>                           
                                      </Tooltip>
                                 )}                           
                                  <Tooltip title="Delete" className="color_pink" style={{marginLeft:"3%"}}>
                          <Button  onClick={() => { setDeleteModalOpen(true); setIdDelete(user.id)}}>
                          <Delete style={{color:"whitesmoke"}}  />
                          </Button>                           
                          </Tooltip>
                      </div>
                 
                    </div>
                  </div>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>))} 
      
          
        </MDBRow>
        {users && (
            <nav aria-label='Page navigation example '>
            <MDBPagination circle center className='mb-2 mt-4'>
              <MDBPaginationItem disabled={currentPage === 1}>
                <MDBPaginationLink  onClick={() => handlePageChange(currentPage - 1)}>Previous</MDBPaginationLink>
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
        )}
      
        {idDelete && (
         <DeleteUserModal typeUser={Role.ADMIN} id={idDelete} show={deleteModalOpen}  onClose={handleUpdate}/> )}
    </>
   
  )
}

export default ListUsers