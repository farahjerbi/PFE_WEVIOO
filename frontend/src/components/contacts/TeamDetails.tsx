import React, { useState } from 'react'
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon, MDBBadge } from 'mdb-react-ui-kit';
import { useSelector } from 'react-redux';
import { selectContactsByTeamId, selectTeamDetails, selectUser } from '../../redux/state/authSlice';
import { Avatar, AvatarGroup, Button, Pagination, Tooltip } from '@mui/material';
import Update from '@mui/icons-material/Update';
import Delete from '@mui/icons-material/Delete';
import DeleteContact from '../modals/delete/DeleteContact';
function stringToPastelColor(string: string) {
    let hash = 0;
    let i;
  
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = ((hash >> (i * 8)) & 0xff) + 128;
      color += `00${(value & 0xff).toString(16)}`.slice(-2);
    }  
    return color;
  }
  
function stringAvatar(name: string) {
    return {
      sx: {
        bgcolor: stringToPastelColor(name),
      },
      children: `${name.split(' ')[0][0]}${name.split(' ')[1][0]}`,
    };
  }
  interface TeamDetailsProps {
    onClose: () => void;
  }
const TeamDetails : React.FC<TeamDetailsProps> = ({ onClose }) => {
    const team=useSelector(selectTeamDetails)
    console.log("🚀 ~ team:", team)
    const [openDelete,setOpenDelete]=useState<boolean>(false);
    const [page, setPage] = useState(1);
    const itemsPerPage = 1;
    const contacts = useSelector(selectContactsByTeamId(team?.id));

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
      setPage(value);
    };
  
    const totalPages = Math.ceil((contacts.length || 0) / itemsPerPage);
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentMembers = contacts.slice(startIndex, endIndex) || [];
  
  
  return (
    <MDBRow className="justify-content-center align-items-center">
    <MDBCol>
      <MDBCard style={{ borderRadius: '15px' }}>
        <MDBCardBody className="text-center">
          <div className="mt-3 mb-4">
            {team?.avatar && (
              <MDBCardImage
                src={team?.avatar}
                className="rounded-circle"
                fluid
                style={{ width: '100px' }}
              />
            )}
          </div>
            <MDBBadge color="info" tag="h6">{team?.name}</MDBBadge>
          <MDBCardText className="text-muted mb-2 mt-2">
            {team?.description}
          </MDBCardText>
          
             {/* <AvatarGroup max={4}>
                        {team?.members?.map((m, index) => (
                          <Avatar key={index} {...stringAvatar(m.fullName)} />
                        ))}
                      </AvatarGroup> */}
          {currentMembers.map((m, index) => (
              <MDBCard className="mb-4" key={index} style={{backgroundColor:"beige"}} >
                <MDBCardBody>
                  <MDBRow className="align-items-center">
                    <MDBCol sm="3" className="text-center">
                      <Avatar {...stringAvatar(m.fullName)} style={{ width: '30px', height: '30px' }} />
                    </MDBCol>
                    <MDBCol sm="9">
                      <MDBCardText className="text-muted">{m.fullName}</MDBCardText>
                    </MDBCol>
                  </MDBRow>
                </MDBCardBody>
              </MDBCard>
            ))}
      <div className="d-flex justify-content-center mt-3">
              <Pagination count={totalPages} variant="outlined" color="primary" page={page} onChange={handleChange} />
            </div>

          <div className="d-flex justify-content-center">
            <Tooltip title="Update" className="color_baby_bluee mt-3 me-4">
            <Button onClick={()=>onClose()} >
            <Update style={{ color: 'whitesmoke' }} />
              </Button>
            </Tooltip>
            <Tooltip title="Delete" className="color_blue mt-3 ms-5">
              <Button onClick={()=>setOpenDelete(true)} >
                <Delete style={{ color: 'whitesmoke' }} />
              </Button>
            </Tooltip>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
    <DeleteContact isMember={false} onClose={()=>setOpenDelete(false)} show={openDelete} />
  </MDBRow>

);
}

export default TeamDetails