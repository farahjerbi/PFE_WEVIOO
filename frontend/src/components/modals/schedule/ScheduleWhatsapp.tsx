import { MDBBtn,  MDBSpinner } from 'mdb-react-ui-kit'
import React, { useEffect, useState } from 'react'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { PickersTimezone } from '@mui/x-date-pickers/models';
import {  ToggleButton, ToggleButtonGroup } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';

import { useDispatch, useSelector } from 'react-redux';
import { SchedularWhatsappProps } from '../../../models/email/SchedularProps';
import { ScheduleWhatsappRequest } from '../../../models/sms/ScheduleWhatsappRequest';
import { selectToken, selectUser } from '../../../redux/state/authSlice';
import { LIST_SMS_TEMPLATES } from '../../../routes/paths';


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

  const TIMEZONES: PickersTimezone[] = ['default', 'UTC',  'Europe/London','Africa/Tunis'];
const ScheduleWhatsapp: React.FC<SchedularWhatsappProps> = ({numbers,placeholders, onClose ,show ,templateId,name,language}) => {
    const [value, setValue] = React.useState<any | null>(dayjs());
    const[valueTime,setValueTime]=useState<string>('');
    const[open,setOpen]=useState<boolean>(show);
    const [currentTimezone, setCurrentTimezone] = React.useState<string>('UTC');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate=useNavigate();
    const dispatch=useDispatch()
    const user=useSelector(selectUser)
    const token=useSelector(selectToken)

      useEffect(() => {
        setOpen(show);
    }, [show]);
    const toggleOpen = () =>{
        onClose();
        setOpen(false)
    }
    
    const handleSubmitSchedule: () => void = async (
    ) => {

 
      if(user && user.id){
        const whatsappSend:ScheduleWhatsappRequest={
            templateId:Number(templateId),
            numbers:numbers,
            placeholders:placeholders,
            dateTime: value.format("YYYY-MM-DDTHH:mm:ss"),
            timeZone: currentTimezone,
            userId:user.id,
            name:name,
            language:language
          }
      
      try {
        let tokeen = token;
        if (token && token.startsWith('"') && token.endsWith('"')) {
            tokeen = token.substring(1, token.length - 1);
        }
        
        const config = {
          headers: {
            Authorization: `Bearer ${tokeen}`
          }
        };
        const response = await axios.post(`http://localhost:8099/apiWhatsApp/scheduleWhatsapp`,whatsappSend,config);
        if (response.status === 200) {
          toast.success("Whatsapp message scheduled successfully !");
          navigate(LIST_SMS_TEMPLATES)
        }
      } catch (err) {
        toast.error('Error!')
        console.error("Error updating user:", err);
      }
      finally {
          setLoading(false); 
      }

    }
    }
  return (
    <>
    <Modal open={show} onClose={() => setOpen(false)}>
          <ModalDialog>
            <DialogTitle>Schedule Your Whatsapp Message</DialogTitle>
            <DialogContent>
                 <LocalizationProvider dateAdapter={AdapterDayjs}>
          <ToggleButtonGroup
            value={currentTimezone}
            exclusive
            fullWidth
            onChange={(event, newTimezone) => {
              if (newTimezone != null) {
                setCurrentTimezone(newTimezone);
              }
            }}
          >
            {TIMEZONES.map((timezoneName) => (
              <ToggleButton key={timezoneName} value={timezoneName}>
                {timezoneName}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
          <DateTimePicker
            timezone={currentTimezone}
            value={value}
            onChange={setValue}
          />
          </LocalizationProvider>
            
            </DialogContent>
              <Stack spacing={2}>
   <MDBBtn color='secondary'  onClick={(e) => { e.preventDefault(); toggleOpen()}} >
              Close
            </MDBBtn>
            {!loading && (
            <MDBBtn onClick={(e) => { e.preventDefault();handleSubmitSchedule()}}
              style={{ background: 'linear-gradient(90deg, rgba(106, 15, 255, 1) 0%, rgba(131, 89, 255, 1) 15%, rgba(168, 118, 230, 1) 35%, rgba(186, 155, 227, 1) 67%, rgba(234, 219, 247, 1) 100%)'}} className='w-100 mb-4' >
                Schedule Message
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
          </ModalDialog>
        </Modal>
  
     </>
       )
}

export default ScheduleWhatsapp