import React, { FormEvent, useEffect, useState } from 'react'
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import { MDBBtn,  MDBSpinner, MDBTable, MDBTableHead } from 'mdb-react-ui-kit'
import { useDispatch, useSelector } from 'react-redux';

import { toast } from 'sonner';
import { addContacts, selectUser } from '../../../redux/state/authSlice';
import { useAddMembersMutation } from '../../../redux/services/usersApi';
import ExcelButtonContacts from '../../button/ExcelButtonContacts';
import { TextField } from '@mui/material';
import { isBase64UrlEncoded, isValidUrl, validateEmail, validatePhone } from '../../../routes/Functions';
interface Props{
    onClose: () => void;
    show:boolean;
}
const AddContacts: React.FC<Props> = ({ onClose ,show }) => {
    const[open,setOpen]=useState<boolean>(show);
    const user=useSelector(selectUser)
    const dispatch=useDispatch()
    const[addMembers]=useAddMembersMutation()
    const [loading, setLoading] = useState<boolean>(false);
    const [contacts, setContacts] = useState<any[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [editContact, setEditContact] = useState<any>({});
    useEffect(() => {
        setOpen(show);
    }, [show]);
    const toggleOpen = () =>{
        onClose();
        setOpen(false)
    }
    const handleDataProcessed = (data: any[]) => {
        setContacts(data);
    };

    const handleSubmit: (evt: FormEvent<HTMLFormElement>) => void = async (
        e: FormEvent<HTMLFormElement>
      ) => {
        e.preventDefault();
        setLoading(true);
        for (let index = 0; index < contacts.length; index++) {
          const contact = contacts[index];
      
          if (!contact.fullName) {
              toast.warning(`Row ${index + 1}: Contact must have a full name.`);
              setLoading(false);
              return;
          }
      
          if (contact.auth === 'unknown' || contact.auth === '') {
              toast.warning(`Row ${index + 1}: Contact's 'auth' field cannot be 'unknown' or empty.`);
              setLoading(false);
              return;
          }
      
          if (contact.publicKey === 'unknown' || contact.publicKey === '' || !isBase64UrlEncoded(contact.publicKey)) {
              toast.warning(`Row ${index + 1}: Contact's public key is invalid. It must be properly base64url encoded and 65 bytes long.`);
              setLoading(false);
              return;
          }
      
          if (contact.endPoint === 'unknown' || contact.endPoint === '' || !isValidUrl(contact.endPoint)) {
              toast.warning(`Row ${index + 1}: Contact's endpoint is invalid. It must be a valid URL.`);
              setLoading(false);
              return;
          }
      
          if (contact.email && !validateEmail(contact.email)) {
              toast.warning(`Row ${index + 1}: Contact's email is invalid.`);
              setLoading(false);
              return;
          }
      
          if (contact.phone && !validatePhone(contact.phone)) {
              toast.warning(`Row ${index + 1}: Contact's phone number is invalid.`);
              setLoading(false);
              return;
          }
      
          if (contact.whatsapp && !validatePhone(contact.whatsapp)) {
              toast.warning(`Row ${index + 1}: Contact's WhatsApp number is invalid.`);
              setLoading(false);
              return;
          }
      }  
  
        if(user && user.id){
        try {
            const invalidContacts = contacts.filter(contact => !contact.fullName || !(contact.email || contact.phone || contact.whatsapp));
            if (invalidContacts.length > 0) {
                toast.warning("Each contact must have a full name and at least one of email, phone, or WhatsApp.");
                setLoading(false);
                return;
            }
            const response=await addMembers({contact:contacts,id:user.id}).unwrap();;
            dispatch(addContacts(response))
            toast.success("Contacts are added Successfully !");
            toggleOpen()
        }
        finally {
            setLoading(false); 
        }
      }
      }

    const handleEdit = (index: number) => {
        setEditIndex(index);
        setEditContact(contacts[index]);
    };

    const handleDelete = (index: number) => {
        const updatedContacts = contacts.filter((_, i) => i !== index);
        setContacts(updatedContacts);
    };

    const handleSaveEdit = () => {
        if (editIndex !== null) {
            const updatedContacts = [...contacts];
            updatedContacts[editIndex] = editContact;
            setContacts(updatedContacts);
            setEditIndex(null);
            setEditContact({});
        }
    };

    const handleAddRow = () => {
      const newContact = {
        fullName: '',
        email: '',
        phone: '',
        whatsapp: '',
        auth: '',
        publicKey: '',
        endPoint: '',
      };
      setContacts([...contacts, newContact]);
      setEditIndex(contacts.length);  
      setEditContact(newContact);
    };
      


  return (
    <Modal open={show} onClose={() => setOpen(false)}>
      <ModalDialog style={{ maxHeight: '90vh', overflowY: 'auto', padding: '16px' }}> 
        <form onSubmit={handleSubmit}>
            <DialogTitle >Add List of Contacts</DialogTitle>
            <DialogContent >
            <ExcelButtonContacts onDataProcessed={handleDataProcessed} />
            <MDBTable striped hover bordered className='mt-2'>
                        <MDBTableHead color='blue lighten-4'>
                          <tr style={{ background: 'rgb(141, 224, 198)' }}>
                            <th> FullName </th>
                            <th> Email </th>
                            <th> Phone </th>
                            <th> Whatsapp </th>
                            <th> Auth </th>
                            <th> PublicKey </th>
                            <th> EndPoint </th>
                            <th> Actions </th>
                          </tr>
                        </MDBTableHead>
                        <tbody style={{overflowY:"auto",maxHeight:"200px"}}>
                        {contacts.map((contact, index) => (
                                <tr key={index}>
                                    <td>{editIndex === index ? <TextField variant="outlined" size="small" fullWidth value={editContact.fullName} onChange={e => setEditContact({ ...editContact, fullName: e.target.value })} /> : contact.fullName}</td>
                                        <td>{editIndex === index ? <TextField variant="outlined" size="small" fullWidth value={editContact.email} onChange={e => setEditContact({ ...editContact, email: e.target.value })} /> : contact.email}</td>
                                        <td>{editIndex === index ? <TextField variant="outlined" size="small" fullWidth value={editContact.phone} onChange={e => setEditContact({ ...editContact, phone: e.target.value })} /> : contact.phone}</td>
                                        <td>{editIndex === index ? <TextField variant="outlined" size="small" fullWidth value={editContact.whatsapp} onChange={e => setEditContact({ ...editContact, whatsapp: e.target.value })} /> : contact.whatsapp}</td>
                                        <td>{editIndex === index ? <TextField variant="outlined" size="small" fullWidth value={editContact.auth} onChange={e => setEditContact({ ...editContact, auth: e.target.value })} /> : contact.auth}</td>
                                        <td>{editIndex === index ? <TextField variant="outlined" size="small" fullWidth value={editContact.publicKey} onChange={e => setEditContact({ ...editContact, publicKey: e.target.value })} /> : contact.publicKey}</td>
                                        <td>{editIndex === index ? <TextField variant="outlined" size="small" fullWidth value={editContact.endPoint} onChange={e => setEditContact({ ...editContact, endPoint: e.target.value })} /> : contact.endPoint}</td>
                                    <td>
                                            {editIndex === index ? (
                                                <div className='d-flex'>
                                                    <MDBBtn className='color_white me-2'  type='button' size='sm' onClick={handleSaveEdit}>Save</MDBBtn>
                                                    <MDBBtn type='button' className="color_pink" size='sm' color='danger' onClick={() => setEditIndex(null)}>Cancel</MDBBtn>
                                                </div>
                                            ) : (
                                                <div className='d-flex'>
                                                    <MDBBtn className='color_white me-2' type='button' size='sm' onClick={() => handleEdit(index)}>Edit</MDBBtn>
                                                    <MDBBtn type='button' className="color_pink" size='sm' color='danger' onClick={() => handleDelete(index)}>Delete</MDBBtn>
                                                </div>
                                            )}
                                        </td>
                                </tr>
                            ))}
                        </tbody>
                        {contacts.length>0 && (
                        <MDBBtn className='color_baby_blue mt-2 ' type='button' size='sm' onClick={handleAddRow}>
                          Add Contact
                        </MDBBtn>
                      )}   
                      </MDBTable>
                     
                         
            </DialogContent>
              <Stack spacing={1}>
   <MDBBtn color='secondary' type='button'  onClick={(e) => { e.preventDefault(); toggleOpen()}} >
              Close
            </MDBBtn>
            {!loading && (
            <MDBBtn type='submit'
              style={{ background: 'linear-gradient(90deg, rgba(106, 15, 255, 1) 0%, rgba(131, 89, 255, 1) 15%, rgba(168, 118, 230, 1) 35%, rgba(186, 155, 227, 1) 67%, rgba(234, 219, 247, 1) 100%)'}} className='w-100 mb-4' >
                Add List
                </MDBBtn>)}
                {loading && (
                  <div className='d-flex justify-content-center mt-4'>
                  <MDBBtn disabled className='btn w-50 ' >
                  <MDBSpinner size='sm' role='status' tag='span' className='me-2' />
                      Loading...
                  </MDBBtn>
                  </div>
              )}
                          </Stack>
                          </form>
          </ModalDialog>
        </Modal>  )
}

export default AddContacts