import { MDBBtn, MDBCol, MDBInput, MDBRow } from 'mdb-react-ui-kit'
import React, { FormEvent, useState } from 'react'
import PhoneInput from 'react-phone-input-2'
import "react-phone-input-2/lib/style.css";
import './Contact.css'
import { useCreateMemberMutation, useUpdateMemberMutation } from '../../redux/services/usersApi';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { addContact, selectContactDetails, selectTeam, selectUser, setContactDetails, updateContact } from '../../redux/state/authSlice';
import { IAddContact, IContact, UpdateContact } from '../../models/user/Contact';
import { Button, Checkbox, Grid, List, ListItemButton, ListItemIcon, ListItemText, Paper } from '@mui/material';
import { ITeam } from '../../models/user/Team';
import { setIsOpen } from '../../redux/state/styleSlice';
function not(a: readonly ITeam[], b: readonly ITeam[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly ITeam[], b: readonly ITeam[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}
interface Props{
  onClose: () => void;
}
const UpdateCnct: React.FC<Props> = ({ onClose  }) => {
  const[updateMember]=useUpdateMemberMutation()
  const user=useSelector(selectUser)
  const contact=useSelector(selectContactDetails)
  const dispatch=useDispatch()
  const initialState={
    fullName:"" || contact?.fullName,
    email:"" || contact?.email ,
    phone:""  || contact?.phone ,
    whatsapp:""  || contact?.whatsapp,
    auth:"" || contact?.auth,
    endPoint:"" || contact?.Endpoint,
    publicKey:"" || contact?.publicKey,
  }

  const [formData, setFormData] = useState(initialState);
  const {fullName,email,auth,phone,whatsapp,publicKey,endPoint}=formData;
  const [previous, setPrevious] = useState<boolean>(false);
  const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
    setFormData({...formData,[e.target.name]:e.target.value})
  }
  const handleNumberChange = (name:string,value: string) => {
    setFormData({...formData,[name]:value})
  };

  const handleUpdateContact = async (contactRes: UpdateContact) => {
    try {
      const res=await updateMember({ contact: contactRes }).unwrap();
      dispatch(updateContact(res));
      dispatch(setContactDetails(null));
      toast.success("Contact updated successfully!");
    } catch (err) {
      toast.error('Error updating contact!');
      console.error("Error updating user:", err);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!fullName || !email) {
      toast.warning("Please fill in at least name and email");
      return;
    }
  

    if (contact && user ) {
      const contactRes: UpdateContact  = {
        fullName,
        email,
        phone: phone || "",
        whatsapp: whatsapp || "",
        auth: auth || "",
        Endpoint: endPoint || "",
        publicKey: publicKey || "",
        id: contact.id,
        teamId: right.map(contact => contact.id).filter((id): id is number => id !== undefined),
        userId: user.id
      };
    await handleUpdateContact(contactRes)
    }
    setFormData(initialState);
    onClose();
  };

    /// TRANSFER LIST ///
    const teamsUser = useSelector(selectTeam) ?? [];    
    const [checked, setChecked] = useState<readonly ITeam[]>([]);
    const contactTeams = contact?.teams ?? [];
    const filteredTeamsUser = teamsUser.filter(
      (team) => !contactTeams.some((contactTeam) => contactTeam.id === team.id)
    );
    const [left, setLeft] = useState<readonly ITeam[]>(filteredTeamsUser);
    const [right, setRight] = useState<ITeam[]>(contactTeams);
    const leftChecked = intersection(checked, left);
    const rightChecked = intersection(checked, right);
  
    const handleToggle = (value: ITeam) => () => {
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
  
    const customList = (items: readonly ITeam[]) => (
      <Paper sx={{ width: 200, height: 350, overflow: 'auto' }}>
        <List dense component="div" role="list">
          {items.map((value: ITeam) => {
            const labelId = `transfer-list-item-${value.name}-label`;
  
            return (
              <ListItemButton
                key={value.name}
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
                <ListItemText id={labelId} primary={`${value.name}`} />
              </ListItemButton>
            );
          })}
        </List>
      </Paper>
    );
  return (
    <div className='add-contact'>
    <h4 className=''>Update a contact</h4>
    
      <form onSubmit={handleSubmit}>
      {
        !previous && (
          <>
            <div className='mt-3'>
  <div className='d-flex align-items-center mb-4'>
          <img className='me-2' src="../../../assets/who.png" style={{width:"6.3%"}} alt="" />
        <MDBInput label='FullName' name='fullName' value={fullName} onChange={(e) => handleChange(e)}/>
        </div>
        <div className='d-flex align-items-center mb-4'>
          <img className='me-2' src="../../../assets/gmail.png" style={{width:"6.3%"}} alt="" />
        <MDBInput name="email" label='Email' value={email} onChange={(e) => handleChange(e)} />
        </div>
        <MDBRow>
          <MDBCol md='6'>
          <div className='d-flex align-items-center mb-3'>
          <img className='me-2' src="../../../assets/sms-calendar.png" style={{width:"15%"}} alt="" />
              <PhoneInput  country={'us'} value={phone}  onChange={(e) => handleNumberChange("phone", e)} containerClass='custom-phone-input' inputStyle={{ width: '100%' }} />
          </div>
          </MDBCol>

          <MDBCol md='6'>
          <div className='d-flex align-items-center'>
          <img className='me-2' src="../../../assets/whatsapp-calendar.png" style={{width:"15%"}} alt="" />
              <PhoneInput country={'us'} value={whatsapp} onChange={(e) => handleNumberChange("whatsapp", e)} containerClass='custom-phone-input' inputStyle={{ width: '100%' }} />
          </div>
          </MDBCol>
      </MDBRow>
       <div className='d-flex align-items-center mb-4'>
          <img className='me-2' src="../../../assets/love.png" style={{width:"6.3%"}} alt="" />
        <MDBInput name='publicKey' label='Public Key' value={publicKey} onChange={(e) => handleChange(e)}  />
        </div>
         <div className='d-flex align-items-center mb-4'>
          <img className='me-2' src="../../../assets/locationn.png" style={{width:"6.3%"}} alt="" />
        <MDBInput name='endPoint' label='EndPoint' value={endPoint} onChange={(e) => handleChange(e)}  />
        </div>
         <div className='d-flex align-items-center mb-4'>
          <img className='me-2' src="../../../assets/padlock.png" style={{width:"6.3%"}} alt="" />
        <MDBInput name='auth' label='Auth' value={auth} onChange={(e) => handleChange(e)} />
        </div>
</div>
      <MDBBtn onClick={()=>setPrevious(true)} type='button' color='secondary' className='mt-4' >
        Next
      </MDBBtn>
          </>

)}
{previous && (
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
     Update
 </MDBBtn>
</div>
 
 </>
)}
</form>
</div>
  )
}

export default UpdateCnct