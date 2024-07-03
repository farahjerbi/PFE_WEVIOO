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
      


  return (
    <Modal open={show} onClose={() => setOpen(false)}>
          <ModalDialog>
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
                          </tr>
                        </MDBTableHead>
                        <tbody style={{overflowY:"auto",maxHeight:"200px"}}>
                        {contacts.map((contact, index) => (
                                <tr key={index}>
                                    <td>{contact.fullName}</td>
                                    <td>{contact.email}</td>
                                    <td>{contact.phone}</td>
                                    <td>{contact.whatsapp}</td>
                                    <td>{contact.auth}</td>
                                    <td>{contact.publicKey}</td>
                                    <td>{contact.endPoint}</td>
                                </tr>
                            ))}
                        </tbody>
                      </MDBTable>            
            </DialogContent>
              <Stack spacing={2}>
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