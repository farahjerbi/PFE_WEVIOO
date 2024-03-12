import { MDBBadge, MDBBtn, MDBCard, MDBCardBody, MDBCardImage, MDBCol, MDBTable, MDBTableBody, MDBTableHead } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import { useActivateUserMutation, useDesActivateUserMutation, useGetAllUsersMutation } from '../../../../redux/services/usersApi';
import { toast } from 'sonner';
import { User } from '../../../../models/User';
import { disconnect } from 'process';
import BreadcrumSection from '../../../../components/BreadcrumSection/BreadcrumSection';
import './ListUsers.css'
const ListUsers = () => {
  const [updated, setUpdated] = useState<boolean>(false);
    useEffect(() => {
        fetchData(); 
      }, [updated]);
      const [users, setUsers] = useState<User[]>([]);
      const[getAllUsers]=useGetAllUsersMutation();
      const[desActivateUser]=useDesActivateUserMutation();
      const[activateUser]=useActivateUserMutation();
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
          await desActivateUser(email);
          toast.success("User DesActivated !");
          setUpdated(true)
      };

  return (
    <div>
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
                        </tr>
                        </MDBTableHead>
                        <MDBTableBody>
                        {users.map(user => (
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
                                    <MDBBadge color='danger' pill>
                                        Unenabled 
                                </MDBBadge>
                                </td>
                            )}
                            <td>
                            <div className='buttons'>
                            {user.enabled ==="false"&& ( <MDBBtn className='btn' color='primary' onClick={()=>activate(user.email)} >Activate </MDBBtn>  )}
                            {user.enabled ==="true"&& ( <MDBBtn className='btn' color='danger' onClick={()=>desactivate(user.email)} >Desactivate </MDBBtn>  )}                            </div>
                            </td>
                        </tr>
                        ))}
                        </MDBTableBody>
                    </MDBTable>
                    </MDBCardBody>
                </MDBCard>
                <MDBCardImage src="../assets/users.gif" position="top" fluid className="size_img_users" />
            </MDBCol> 
    </div>
  )
}

export default ListUsers