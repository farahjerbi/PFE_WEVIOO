import React from 'react'
import { MDBCol, MDBContainer, MDBRow, MDBCard, MDBCardText, MDBCardBody, MDBCardImage, MDBBtn, MDBTypography, MDBIcon, MDBBadge } from 'mdb-react-ui-kit';
import { useSelector } from 'react-redux';
import { selectTeamDetails, selectUser } from '../../redux/state/authSlice';
import { Avatar, AvatarGroup, Button, Tooltip } from '@mui/material';
import Update from '@mui/icons-material/Update';
import Delete from '@mui/icons-material/Delete';
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
    const user=useSelector(selectUser)
    console.log("🚀 ~ TeamDetails ~ user:", user)
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
          <MDBTypography tag="h4">{team?.name}</MDBTypography>
          <MDBCardText className="text-muted mb-4 mt-3">
            {team?.description}
          </MDBCardText>
          <div className="d-flex justify-content-center mb-4">
            <AvatarGroup max={4}>
              {team?.members?.map((m, index) => (
                <Avatar key={index} {...stringAvatar(m.fullName)} />
              ))}
            </AvatarGroup>
          </div>
          <div className="d-flex justify-content-center">
            <Tooltip title="Update" className="color_baby_bluee mt-3 me-4">
            <Button onClick={()=>onClose()} >
            <Update style={{ color: 'whitesmoke' }} />
              </Button>
            </Tooltip>
            <Tooltip title="Delete" className="color_blue mt-3 ms-5">
              <Button>
                <Delete style={{ color: 'whitesmoke' }} />
              </Button>
            </Tooltip>
          </div>
        </MDBCardBody>
      </MDBCard>
    </MDBCol>
  </MDBRow>
);
}

export default TeamDetails