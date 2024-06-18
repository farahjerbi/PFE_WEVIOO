import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectContact, selectTeamsWithContacts } from '../../redux/state/authSlice'
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import Stack from '@mui/joy/Stack';
import { MDBBtn } from 'mdb-react-ui-kit';
import { Button } from '@mui/material';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Checkbox from '@mui/material/Checkbox';
import Avatar from '@mui/material/Avatar';
import { ITeamWithContact } from '../../models/user/Team';
import { NotificationType } from '../../models/NotificationType';
export interface ModalContactProps {
    onClose: () => void;
    show:boolean;
    onSubmit: (checked: string[]) => void;
    type:NotificationType
  }

const ContactNumbersModal: React.FC<ModalContactProps> = ({ onClose, show,onSubmit,type }) => {
    const contacts = useSelector(selectContact);
    const [open, setOpen] = useState<boolean>(show);
    const [isGroup, setIsGroup] = useState<boolean>(true);
    const [checked, setChecked] = useState<string[]>([]);
    const [checkedTeam, setCheckedTeam] = useState<number[]>([]);
    const teams = useSelector(selectTeamsWithContacts);  

    const handleToggle = (value: string) => () => {
      const currentIndex = checked.indexOf(value);
      const newChecked = [...checked];
  
      if (currentIndex === -1) {
        newChecked.push(value);
      } else {
        newChecked.splice(currentIndex, 1);
      }
  
      setChecked(newChecked);
    };
  
    const handleToggleTeam = (team: ITeamWithContact) => () => {
        const currentIndex = checkedTeam.indexOf(team.id ?? -1);
        const newCheckedTeam = currentIndex === -1 ? [...checkedTeam, team.id!] : checkedTeam.filter(id => id !== team.id);
      
        let numbersToAdd: string[] = [];
        if (team.id !== undefined) {
          numbersToAdd = team.members.map((member) => type === NotificationType.SMS ? member.phone : member.whatsapp);
        }
      
        const updatedChecked = currentIndex === -1
          ? [...checked, ...numbersToAdd]
          : checked.filter(num => !numbersToAdd.includes(num));
      
        setChecked(updatedChecked);
        setCheckedTeam(newCheckedTeam);
      };

      
    useEffect(() => {
      setOpen(show);
    }, [show]);

    const handleSubmit = () => {
      const uniqueChecked = Array.from(new Set(checked)); 
      onSubmit(uniqueChecked);
      onClose();
    };
  return (
  <>
        <Modal open={show} onClose={onClose}>
          <ModalDialog  minWidth={500} maxWidth={600} style={{overflow: 'auto'}}>
            <Stack spacing={2}>
              <div className="container-sms ms-5">
                <div className="buttons d-flex mt-5 me-5">
                  <Button
                    onClick={() => setIsGroup(true)}
                    fullWidth
                    className={isGroup ? 'me-3 baby-bluee' : 'me-3'}
                  >
                    Contacts
                  </Button>
                  <Button
                    onClick={() => setIsGroup(false)}
                    fullWidth
                    className={!isGroup ? 'me-3 baby-bluee' : 'me-3'}
                  >
                    Group
                  </Button>
                </div>
              </div>
  
              {isGroup && (
                <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  {contacts?.map((value) => {
                    const labelId = `checkbox-list-secondary-label-${value.id}`;
                    return (
                      <ListItem key={value.id} disablePadding>
                        <ListItemButton>
                          <ListItemAvatar>
                            <Avatar>{/* Adjust avatar props as per your setup */}</Avatar>
                          </ListItemAvatar>
                          <ListItemText id={labelId} primary={value.fullName} />
                          <Checkbox
                            edge="end"
                            onChange={type===NotificationType.SMS ?handleToggle(value.phone):handleToggle(value.whatsapp)}
                            checked={(type===NotificationType.SMS ?checked.indexOf(value.phone):checked.indexOf(value.whatsapp)) !== -1}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              )}
  
              {!isGroup && (
                <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                  {teams?.map((value) => {
                    const labelId = `checkbox-list-secondary-label-${value.id}`;
                    return (
                      <ListItem key={value.id} disablePadding>
                        <ListItemButton>
                          <img
                            className="me-2"
                            style={{ width: '18%' }}
                            src={value?.avatar ?? ''}
                            alt={value?.avatar ?? ''}
                          />
                          <ListItemText id={labelId} primary={value.name} />
                          <Checkbox
                            edge="end"
                            onChange={handleToggleTeam(value)}
                            checked={
                              value.id !== undefined && checkedTeam.indexOf(value.id) !== -1
                            }
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </ListItemButton>
                      </ListItem>
                    );
                  })}
                </List>
              )}
  
              <Stack spacing={2}>
                <MDBBtn type='button' color="secondary" onClick={onClose}>Close</MDBBtn>
                <MDBBtn
                  onClick={handleSubmit}
                  style={{
                    background:
                      'linear-gradient(90deg, rgba(106, 15, 255, 1) 0%, rgba(131, 89, 255, 1) 15%, rgba(168, 118, 230, 1) 35%, rgba(186, 155, 227, 1) 67%, rgba(234, 219, 247, 1) 100%)',
                  }}
                  className="w-100 mb-4"
                >
                  Add
                </MDBBtn>
              </Stack>
            </Stack>
          </ModalDialog>
        </Modal>
      </>  )
}

export default ContactNumbersModal