import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { selectContact, selectTeamsWithContacts } from '../../../redux/state/authSlice'
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
import { ITeamWithContact } from '../../../models/user/Team';
import { IAddContact } from '../../../models/user/Contact';
export interface ModalContactProps {
  onClose: () => void;
  show: boolean;
  onSubmit: (checked: { notificationEndPoint: string; publicKey: string; auth: string }[]) => void;
}

const ContactPushModal: React.FC<ModalContactProps> = ({ onClose, show, onSubmit }) => {
  const contacts = useSelector(selectContact);
  const teams = useSelector(selectTeamsWithContacts);
  const [open, setOpen] = useState<boolean>(show);
  const [isGroup, setIsGroup] = useState<boolean>(true);
  const [checked, setChecked] = useState<string[]>([]);
  const [checkedTeam, setCheckedTeam] = useState<number[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<{ notificationEndPoint: string; publicKey: string; auth: string }[]>([]);

  const handleToggle = (email: string, contact: IAddContact) => () => {
    const currentIndex = checked.indexOf(email);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(email);
      setSelectedContacts(prevState => [
        ...prevState,
        {
          notificationEndPoint: contact.endPoint,
          publicKey: contact.publicKey,
          auth: contact.auth,
        },
      ]);
    } else {
      newChecked.splice(currentIndex, 1);
      setSelectedContacts(prevState => prevState.filter(c => c.notificationEndPoint !== contact.endPoint));
    }

    setChecked(newChecked);
  };

  const handleToggleTeam = (team: ITeamWithContact) => () => {
    const currentIndex = checkedTeam.indexOf(team.id ?? -1);
    const newCheckedTeam = [...checkedTeam];

    if (currentIndex === -1 && team.id !== undefined) {
      newCheckedTeam.push(team.id);
      const emails: string[] = team.members.map((member) => member.email);
      setChecked([...checked, ...emails]);
      setSelectedContacts(prevState => [
        ...prevState,
        ...team.members.map(member => ({
          notificationEndPoint: member.endPoint,
          publicKey: member.publicKey,
          auth: member.auth,
        })),
      ]);
    } else {
      newCheckedTeam.splice(currentIndex, 1);
      const emailsToRemove: string[] = team.members.map((member) => member.email);
      const filteredChecked = checked.filter((email) => !emailsToRemove.includes(email));
      setChecked(filteredChecked);
      setSelectedContacts(prevState => prevState.filter(contact => !emailsToRemove.includes(contact.notificationEndPoint)));
    }

    setCheckedTeam(newCheckedTeam);
  };

  useEffect(() => {
    setOpen(show);
  }, [show]);

  const handleSubmit = () => {
    const uniqueChecked = Array.from(new Set(selectedContacts.map(contact => contact.notificationEndPoint)))
      .map(endpoint => selectedContacts.find(contact => contact.notificationEndPoint === endpoint))
      .filter(contact => !!contact) as { notificationEndPoint: string; publicKey: string; auth: string }[];

    onSubmit(uniqueChecked);
    onClose();
  };

  return (
    <>
      <Modal open={show} onClose={onClose}>
        <ModalDialog minWidth={500} maxWidth={600} style={{ overflow: 'auto' }}>
          <Stack spacing={2}>
            <div className="container-sms ms-5">
              <div className="buttons d-flex mt-5 me-5">
                <Button onClick={() => setIsGroup(true)} fullWidth className={isGroup ? 'me-3 baby-bluee' : 'me-3'}>
                  Contacts
                </Button>
                <Button onClick={() => setIsGroup(false)} fullWidth className={!isGroup ? 'me-3 baby-bluee' : 'me-3'}>
                  Group
                </Button>
              </div>
            </div>

            {isGroup && (
              <List dense sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                {contacts?.map(contact => {
                  const labelId = `checkbox-list-secondary-label-${contact.id}`;
                  return (
                    <ListItem key={contact.id} disablePadding>
                      <ListItemButton>
                        <ListItemAvatar>
                          <Avatar>{/* Adjust avatar props as per your setup */}</Avatar>
                        </ListItemAvatar>
                        <ListItemText id={labelId} primary={contact.fullName} />
                        <Checkbox
                          edge="end"
                          onChange={handleToggle(contact.email, contact)}
                          checked={checked.includes(contact.email)}
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
                {teams?.map(team => {
                  const labelId = `checkbox-list-secondary-label-${team.id}`;
                  return (
                    <ListItem key={team.id} disablePadding>
                      <ListItemButton>
                        <img className="me-2" style={{ width: '18%' }} src={team?.avatar ?? ''} alt={team?.avatar ?? ''} />
                        <ListItemText id={labelId} primary={team.name} />
                        <Checkbox
                          edge="end"
                          onChange={handleToggleTeam(team)}
                          checked={team.id !== undefined && checkedTeam.includes(team.id)}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </ListItemButton>
                    </ListItem>
                  );
                })}
              </List>
            )}

            <Stack spacing={2}>
              <MDBBtn type="button" color="secondary" onClick={onClose}>
                Close
              </MDBBtn>
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
    </>
  );
};

export default ContactPushModal;

  