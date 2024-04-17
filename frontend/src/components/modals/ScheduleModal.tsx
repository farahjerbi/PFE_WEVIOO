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
import { LIST_EMAIL_TEMPLATES } from '../../routes/paths';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import DialogTitle from '@mui/joy/DialogTitle';
import DialogContent from '@mui/joy/DialogContent';
import Stack from '@mui/joy/Stack';
import { SchedularProps } from '../../models/email/SchedularProps';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

  const TIMEZONES: PickersTimezone[] = ['default', 'UTC',  'Europe/London','Africa/Tunis'];
  
  const ScheduleModal: React.FC<SchedularProps> = ({replyTo, recipientEmails,cc,placeholdersValues,id, addSignature, onClose ,show ,templateId}) => {
    console.log("🚀 ~ placeholdersValues:", placeholdersValues)
    const [value, setValue] = React.useState<any | null>(dayjs());
    console.log("🚀 ~ value:", value)
    const[valueTime,setValueTime]=useState<string>('');
    console.log("🚀 ~ valueTime:", valueTime)
    const[open,setOpen]=useState<boolean>(show);
    console.log("🚀 ~ value:", value)
    const [currentTimezone, setCurrentTimezone] = React.useState<string>('UTC');
    const [loading, setLoading] = useState<boolean>(false);
    const navigate=useNavigate();
      console.log("🚀 ~ currentTimezone:", currentTimezone)
      useEffect(() => {
        setOpen(show);
    }, [show]);
    const toggleOpen = () =>{
        onClose();
        setOpen(false)
    } 



    const handleSubmitSchedule: () => void = async (
    ) => {
      const convertedPlaceholders: { [key: string]: string } = {};

      for (const key in placeholdersValues) {
          if (Object.prototype.hasOwnProperty.call(placeholdersValues, key)) {
              convertedPlaceholders[key] = placeholdersValues[key];
          }
      }
          const body = {
        "recipients": recipientEmails,
        "cc": cc,
        "replyTo": replyTo,
        "templateId": Number(templateId),
        "placeHolders":  convertedPlaceholders, 
        "userId": id,
        "addSignature": String(addSignature),
        "dateTime": value.format("YYYY-MM-DDTHH:mm:ss"),
        "timeZone": currentTimezone
      };
      console.log("🚀 ~ body:", body)

      
      try {
        const response = await axios.post(`http://localhost:8099/apiEmail/scheduleEmail`,body);
        if (response.status === 200) {
          console.log("🚀 ~ Profile ~ response:", response);
          toast.success("Email scheduled successfully !");
          navigate(LIST_EMAIL_TEMPLATES)
        }
      } catch (err) {
        toast.error('Error!')
        console.error("Error updating user:", err);
      }
      finally {
          setLoading(false); 
      }

    }

    
    return (
   <>
  <Modal open={show} onClose={() => setOpen(false)}>
        <ModalDialog>
          <DialogTitle>Schedule Your Email</DialogTitle>
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
              Schedule Email
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

export default ScheduleModal