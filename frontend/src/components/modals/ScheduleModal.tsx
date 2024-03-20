import { MDBBtn, MDBIcon, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle, MDBSpinner } from 'mdb-react-ui-kit'
import React, { FormEvent, useEffect, useState } from 'react'
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { StaticDatePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { PickersTimezone } from '@mui/x-date-pickers/models';
import { Button, ToggleButton, ToggleButtonGroup } from '@mui/material';
import dayjs, { Dayjs } from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import axios from 'axios';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/New_York');

interface SchedularProps {
    onClose: () => void;
    show:boolean;
    recipientEmails:string[];
    cc:string[];
    placeholdersValues:{ [key: string]: string };
    id:any;
    addSignature:boolean;
    replyTo:string;
    templateId:any
  }
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
        const response = await axios.post(`http://localhost:8088/api/email/scheduleEmail`,body);
        if (response.status === 200) {
          console.log("🚀 ~ Profile ~ response:", response);
          toast.success("Email scheduled successfully !");
          navigate('/listEmailTemplates')
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
   <MDBModal open={show} tabIndex='-1'>
    <MDBModalDialog>
      <MDBModalContent>
        <MDBModalHeader>
          <MDBModalTitle>
          <MDBIcon style={{marginRight:"10px"}} icon="calendar-check"/>
            Schedule Your Email
            </MDBModalTitle>
          <MDBBtn className='btn-close' color='none'  onClick={(e) => { e.preventDefault(); toggleOpen()}}></MDBBtn>
        </MDBModalHeader>
        <MDBModalBody>
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
        </MDBModalBody>
        <MDBModalFooter>
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
         </MDBModalFooter>
      </MDBModalContent>
    </MDBModalDialog>
  </MDBModal>  


   </>
        
          )
}

export default ScheduleModal