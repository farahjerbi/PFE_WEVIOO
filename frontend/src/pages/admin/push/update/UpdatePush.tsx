import React, { FormEvent, useEffect, useState } from 'react'
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import AspectRatio from '@mui/joy/AspectRatio';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import { Button, Tooltip, styled } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useDispatch,  } from 'react-redux';
import { setPush, setUpdatePush } from '../../../../redux/state/pushSlice';
import { WebPushTemplate } from '../../../../models/push/WebPushTemplate';
import axios from 'axios';
import { toast } from 'sonner';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
  });
  interface Props{
    onClose: () => void;
    show:boolean;
    template:WebPushTemplate|undefined
    }

const UpdatePush :React.FC<Props> = ({onClose,show ,template}) => {

    const toggleOpen = () =>{
        onClose();
        setOpen(false);
      } 

    const initialState={
        title: template ? template.title : "",
        message: template ? template.message : "" ,
        clickTarget: template ? template.clickTarget : "" 
      }
    const [open, setOpen] = React.useState<boolean>(show);
    const [formData, setFormData] = useState(initialState);
    const {title,message,clickTarget}=formData;
    const [icon, setIcon] = useState<File | null>(null);
    const dispatch=useDispatch()
    const handleChange=(e: React.ChangeEvent<HTMLInputElement>)=>{
      setFormData({...formData,[e.target.name]:e.target.value})
    }

    const handleUpdate: (evt: FormEvent<HTMLFormElement>) => void = async (
      e: FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault();
    
      if (!title || !message || !clickTarget ) {
        toast.warning("Please fill in all fields ");
        return;
      }
      const formData = new FormData();
      formData.append('title', title);
      formData.append('message', message);
      formData.append('clickTarget', clickTarget);
   
      if (icon !== null) {
        formData.append('icon', icon);
      }

      try {
        const response = await axios.post(`http://localhost:8093/apiPush/updateTemplate/${template?.id}`, formData);
        
        if (response.status === 200) {
          const updatedTemplate= response.data;
          dispatch(setUpdatePush(updatedTemplate))
          toast.success("Template Updated Successfully !");
          toggleOpen()
        }
      } catch (err) {
        toast.error('Error!')
        console.error("Error updating user:", err);
      }
    }

    const handleAdd: (evt: FormEvent<HTMLFormElement>) => void = async (
      e: FormEvent<HTMLFormElement>
    ) => {
      e.preventDefault();
    
      if (!title || !message || !clickTarget ) {
        toast.warning("Please fill in all fields ");
        return;
      }
      const formData = new FormData();
      formData.append('title', title);
      formData.append('message', message);
      formData.append('clickTarget', clickTarget);
   
      if (icon !== null) {
        formData.append('icon', icon);
      }

      try {
        const response = await axios.post(`http://localhost:8093/apiPush/addTemplate`, formData);
        
        if (response.status === 200) {
          const addedTemplate= response.data;
          dispatch(setPush(addedTemplate))
          toast.success("Template added Successfully !");
          toggleOpen()
        }
      } catch (err) {
        toast.error('Error!')
        console.error("Error updating user:", err);
      }
    }

    const handleClick = (evt: FormEvent<HTMLFormElement>) => {
      evt.preventDefault();
      if (template) {
        handleUpdate(evt);
      } else {
        handleAdd(evt);
      }
    };
  return (
    <>
      <Modal open={open} onClose={toggleOpen}>
        <ModalDialog>
          <DialogTitle>{template?"Update Push Template":"Add Push Template"}</DialogTitle>
          <DialogContent>{template?"Change the information of the template.":"Add the information of the template."}</DialogContent>
          <form onSubmit={handleClick}>
          <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
            width: 500,
            '&:hover': { boxShadow: 'md', borderColor: 'neutral.outlinedHoverBorder' },
            }}
        >
     <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <AspectRatio ratio="1" sx={{ width: 90 }}>
                <img
                    src={`http://localhost:8093/uploads/${template?.icon}`}
                    loading="lazy"
                    alt=""
                />
            </AspectRatio>
            <Tooltip title="Upload Icon">
                <Button
                    className='mb-4'
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    color='info'
                    startIcon={<CloudUploadIcon />}
                    sx={{ marginTop: 2 }}  // Optional: Adjust spacing if needed
                >
                    <VisuallyHiddenInput accept="*/*" onChange={(e) => setIcon(e.target.files && e.target.files[0])}  type="file" />
                    Upload
                </Button>
            </Tooltip>
        </div>
            <CardContent>
            <FormControl>
                <FormLabel>Title</FormLabel>
                <Input name='title' value={title} onChange={handleChange}  required />
              </FormControl>
           <FormControl>  
            <FormLabel>Message</FormLabel>
                <Input name='message' value={message} onChange={handleChange} required />
              </FormControl>  
            <FormControl>
                <FormLabel>Click Target</FormLabel>
                <Input name='clickTarget' value={clickTarget} onChange={handleChange}  required />
              </FormControl>
            </CardContent>
        </Card>
        
              <Button type="submit">{template?"Update":"Add"}</Button>
          </form>
        </ModalDialog>
      </Modal>

    </>
        )
}

export default UpdatePush