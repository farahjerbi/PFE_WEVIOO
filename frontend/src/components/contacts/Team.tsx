import { MDBBtn, MDBInput } from 'mdb-react-ui-kit'
import React, { FormEvent, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner'
import { addTeam, addTeamIdToContacts, selectContact, selectUser } from '../../redux/state/authSlice';
import './Team.css'
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import { IContact } from '../../models/user/Contact';
import { useCreateTeamMutation } from '../../redux/services/usersApi';
function not(a: readonly IContact[], b: readonly IContact[]) {
    return a.filter((value) => b.indexOf(value) === -1);
  }
  
  function intersection(a: readonly IContact[], b: readonly IContact[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }
interface Props{
    onClose: () => void;
  }
  const avatars = [
    "https://img.icons8.com/?size=100&id=t-_II74Yqp8-&format=png&color=000000",
    "https://img.icons8.com/?size=100&id=ySbK7ezrZYf1&format=png&color=000000",
    "https://img.icons8.com/?size=100&id=R6vlOCKrni3x&format=png&color=000000",
    "https://img.icons8.com/?size=100&id=109684&format=png&color=000000",
    "https://img.icons8.com/?size=100&id=MgCG35YR9u2d&format=png&color=000000",
    "https://img.icons8.com/?size=100&id=sGS4d4aspYsb&format=png&color=000000",
    "https://img.icons8.com/?size=100&id=fN3JYnCtjLsT&format=png&color=000000",
    "https://img.icons8.com/?size=100&id=B30dYtoAGYUf&format=png&color=000000",
    "https://img.icons8.com/?size=100&id=hQvLWSMeYXa4&format=png&color=000000",
    "https://img.icons8.com/?size=100&id=ksEiuzzBUfiP&format=png&color=000000",
  ];
const Team : React.FC<Props> = ({ onClose }) => {
    const user=useSelector(selectUser)
    const contactsUser = useSelector(selectContact) ?? [];    
    const dispatch=useDispatch()
    const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
    const [previous, setPrevious] = useState<boolean>(false);
    const [createTeam]=useCreateTeamMutation();
    const handleAvatarClick = (src: string) => {
        setSelectedAvatar(src);
      };
    
    const initialState={
        name:"",
      description:"" ,
    }
  
    const [formData, setFormData] = useState(initialState);
    const {name,description}=formData;
    const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
      setFormData({...formData,[e.target.name]:e.target.value})
    }
  
    const handleAdd: (evt: FormEvent<HTMLFormElement>) => void = async (
      e: FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault();
    
      if (!name || !description  ) {
        toast.warning("Please fill in at least name and email ");
        return;
      }
        const contactRes={
            name:name,
            description:description,
            avatar:selectedAvatar,
            members:right.map(contact => contact.id)
          }
      try {
        if(user && user.id){
            const response = await createTeam({team:contactRes,id:user.id}).unwrap()
            dispatch(addTeamIdToContacts({ contactIds: right.map(contact => contact.id), teamId: response.id }))
            dispatch(addTeam(response))
        }
          setFormData(initialState)
          toast.success("Team added Successfully !");
          onClose();
      } catch (err) {
        console.error("Error updating user:", err);
      }
    }
  /// TRANSFER LIST ///
  const [checked, setChecked] = useState<readonly IContact[]>([]);
  const [left, setLeft] = useState<readonly IContact[]>(contactsUser);
  const [right, setRight] = useState<readonly IContact[]>([]);
  console.log("🚀 ~ right:", right)

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: IContact) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handleAllRight = () => {
    setRight(right.concat(left));
    setLeft([]);
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const handleAllLeft = () => {
    setLeft(left.concat(right));
    setRight([]);
  };

  const customList = (items: readonly IContact[]) => (
    <Paper sx={{ width: 200, height: 350, overflow: 'auto' }}>
      <List dense component="div" role="list">
        {items.map((value: IContact) => {
          const labelId = `transfer-list-item-${value.email}-label`;

          return (
            <ListItemButton
              key={value.email}
              role="listitem"
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.fullName}`} />
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
    return (
      <div className='add-contact'>
              <form onSubmit={handleAdd}>
       {
        !previous && (
<div className='mt-2'>
    <h4 className='mb-3'>Create a group</h4>
            <div className=' me-1 ms-5' >
            {avatars.map((avatar, index) => (
          <img
            key={index}
            className={`team-avatar ${selectedAvatar === avatar ? 'selected' : ''}`}
            src={avatar}
            alt={`Avatar ${index + 1}`}
            onClick={() => handleAvatarClick(avatar)}
          />
        ))}
        <p className='text-center mt-1 animated-text text-shadow hover-underline text-animation'> <b>Select an avatar</b> </p>
        </div>
          <div className='d-flex align-items-center mb-4'>
                  <img className='me-2' src="../../../assets/who.png" style={{width:"6.3%"}} alt="" />
                <MDBInput label='Name' name='name' value={name} onChange={(e) => handleChange(e)}/>
                </div>
                <div className='d-flex align-items-center mb-4'>
                  <img className='me-2' src="../../../assets/gmail.png" style={{width:"6.3%"}} alt="" />
                <MDBInput name="description" label='description' value={description} onChange={(e) => handleChange(e)} />
                </div>
                <MDBBtn color='secondary' type='button' onClick={()=>setPrevious(true)} className='mt-4' >
                    Next
                </MDBBtn>
                           
      </div>
        )
       }   
    {
        previous && (
            <>
             <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList(left)}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllRight}
            disabled={left.length === 0}
            aria-label="move all right"
          >
            ≫
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleAllLeft}
            disabled={right.length === 0}
            aria-label="move all left"
          >
            ≪
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList(right)}</Grid>
    </Grid>
    <div className='d-flex justify-content-between'>
    <MDBBtn type='button' onClick={()=>setPrevious(false)} color='secondary' className='mt-4' >
                previous
            </MDBBtn>
             <MDBBtn type='submit' className='mt-4 ' >
                Create
            </MDBBtn>
    </div>
            
            </>
           
        )
    }  
      </form>
      </div>
      )
}

export default Team