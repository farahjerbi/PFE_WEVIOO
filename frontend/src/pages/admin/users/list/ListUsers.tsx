import { MDBBadge, MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCardText, MDBCardTitle, MDBCol, MDBContainer, MDBInput, MDBPagination, MDBPaginationItem, MDBPaginationLink, MDBRow, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit'
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
import {  Badge, Button, Tooltip } from '@mui/material';
import Avatar from 'react-avatar';

const ListUsers = () => {
  /*https://www.freepik.com/free-vector/isometric-phone-with-chat-concept_5230451.htm#fromView=search&page=7&position=20&uuid=6b51443b-8949-4d75-8835-87cf4d3d5bd5 */
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
      const[query,setQuery]=useState<string>('')


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
        {users.filter(
          (e)=>e.firstName.toLowerCase().includes(query) ||
           e.lastName.toLowerCase().includes(query) ||
           e.email.toLowerCase().includes(query)||
           e.enabled.toString()===query

        ).map(user => (

        <MDBCol key={user.id} xl="3" md="6" className="mb-r me-4 mt-4">
            <MDBCard style={{borderRadius:"none"}}>
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
                                        Unenabled 
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
                                      <Tooltip  style={{width:"60%"}} title="Desactivate Account" className="color_baby_blue" >
                                      <Button  onClick={()=>desactivate(user.email)}  >
                                      <PersonOff style={{color:"whitesmoke"}}  />
                                      </Button>                           
                                      </Tooltip>
                                 )}                           
                                  <Tooltip title="Delete" className="color_red" style={{marginLeft:"3%"}}>
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
        {idDelete && (
         <DeleteUserModal typeUser={Role.ADMIN} id={idDelete} show={deleteModalOpen}  onClose={handleUpdate}/> )}
    </>
   
  )
}

export default ListUsers