import  { useEffect, useState } from 'react'
import './Calendar.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import { useDeleteScheduledEmailMutation, useGetScheduledEmailsByUserMutation, useGetScheduledEmailsMutation } from '../../../../redux/services/emailApi';
import { toast } from 'sonner';
import { Button, Tooltip } from '@mui/material';
import { EventClickArg, EventContentArg } from '@fullcalendar/core';
import ForwardToInbox from "@mui/icons-material/ForwardToInbox";
import PermPhoneMsgOutlined from "@mui/icons-material/PermPhoneMsgOutlined";
import ChatBubbleOutline from "@mui/icons-material/ChatBubbleOutline";

import Clear from "@mui/icons-material/Clear";
import Info from "@mui/icons-material/Info"
import styled from '@emotion/styled';
import { selectRole, selectUser } from '../../../../redux/state/authSlice';
import { useSelector } from 'react-redux';
import { Role } from '../../../../models/user/Role';
import { MDBBadge, MDBBtn, MDBCard, MDBCardHeader, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle } from 'mdb-react-ui-kit';
import { useLocation } from 'react-router-dom';
import { ScheduledSMSResponse } from '../../../../models/sms/ScheduledSMSResponse';
import { ScheduledEmailResponse } from '../../../../models/email/ScheduledEmailRespose';
export const StyleWrapper = styled.div`
  .fc-button.fc-prev-button, .fc-button.fc-next-button, .fc-button.fc-button-primary{
    background:white;
    border:none;
    background-image: none;
    color:blue;
}
.fc-v-event{
  background:#C1C6F9;
  border:none;
}
.fc-scroller-harness{
  background:transparent;
}
.fc .fc-button-primary:not(:disabled).fc-button-active{
  background:rgb(56, 18, 226);
  color:white;
}
`
interface Props{
  emails:ScheduledEmailResponse[] | undefined,
  sms:ScheduledSMSResponse[] | undefined,
  whatsapp:ScheduledSMSResponse[] | undefined
  }
const Calendar  : React.FC<Props> = ({ emails ,sms,whatsapp })=> {
const role = useSelector(selectRole);
const [data, setData] = useState<any[]>([]);
const [eventInfoBoxes, setEventInfoBoxes] = useState<{ [key: string]: boolean }>({});
const [basicModal, setBasicModal] = useState<boolean>(false);
const [update, setUpdate] = useState<boolean>(false);

const [id, setId] = useState<string>("");
const location = useLocation();
const [dashboardName, setDashboardName] = useState('');


const toggleOpen = () => setBasicModal(!basicModal);
const[deleteScheduledEmail]=useDeleteScheduledEmailMutation()
const handleEventMouseEnter = (eventId: string) => {
  setEventInfoBoxes((prevBoxes) => ({
    ...prevBoxes,
    [eventId]: true,
  }));
};

const handleEventMouseLeave = (eventId: string) => {
  setEventInfoBoxes((prevBoxes) => ({
    ...prevBoxes,
    [eventId]: false,
  }));
};

    useEffect(() => {
       const pathname = location.pathname;
  const dashboardNameFromPath = pathname.split('/');
  const formattedDashboardName =dashboardNameFromPath.slice(1).join('/');
  setDashboardName(formattedDashboardName);
  console.log("🚀 ~ useEffect ~ formattedDashboardName:", formattedDashboardName)
  
  populateDataEmail(emails);
  populateDataSMS(sms);
  populateDataWhatsapp(whatsapp);

    }, [update]);
    

      function populateDataEmail(data:any) {
        const newData = data.map((e:any) => ({
          title:e.templateName ,
          sentTo:e.recipients,
          id:e.jobId,
          date:e.nextTimeFired,
          type:"email",
          cc:e.cc,
          replyTo:e.replyTo
        }));
        setData(newData);
      }

      function populateDataSMS(data:any) {
        const newData = data.map((e:any) => ({
          title:e.templateName ,
          numbers:e.numbers,
          id:e.jobId,
          date:e.nextTimeFired,
          type:"sms",
        }));
        setData(prevData => [...prevData, ...newData]);       }

      function populateDataWhatsapp(data:any) {
        const newData = data.map((e:any) => ({
          title:e.templateName ,
          numbers:e.numbers,
          id:e.jobId,
          date:e.nextTimeFired,
          type:"whatsapp",
        }));
        setData(prevData => [...prevData, ...newData]);       }

      const handleDelete=async()=>{
          await deleteScheduledEmail(id).unwrap()
          setUpdate(!update)
          toast.success("Scheduled Email deleted successfully!")
          toggleOpen()

      }

        const   handleEventClick = (clickInfo: EventClickArg) => {
          if(role===Role.USER){
            const {id} = clickInfo.event;
            setId(id)
            toggleOpen()
          }
          }
      
  return (
    <MDBCard className='mt-5'  style={{marginLeft:"7%" }}>
      <div className={dashboardName==="dashboard"? "mt-5 mb-5 dashboard" :"mt-5 mb-5 calendar"} style={{
          width: "83%",
          marginLeft: "8%"
        }}>
    <StyleWrapper>
      <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin]}
          initialView={"dayGridMonth"}
          headerToolbar={{
            start: "today prev,next", 
            center: "title",
            end: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          editable={true}
          selectable={true}
          selectMirror={true}
          height={"80vh"}
          events={data}
          eventContent={(eventContent) => renderEventContent(eventContent, eventInfoBoxes[eventContent.event.id || ''],role)}
          eventClick={handleEventClick}
          eventMouseEnter={(info) => handleEventMouseEnter(info.event.id || '')}
          eventMouseLeave={(info) => handleEventMouseLeave(info.event.id || '')}
        />
            </StyleWrapper>
            <>
      <MDBModal open={basicModal} setOpen={setBasicModal} tabIndex='-1'>
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Delete Your Scheduled Email</MDBModalTitle>
              <MDBBtn className='btn-close' color='none' onClick={toggleOpen}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <p>Are you sure you want to delete this scheduled email ?</p>
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={toggleOpen}>
                Close
              </MDBBtn>
              <MDBBtn color='danger' onClick={handleDelete} >Yes!</MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
  </>
    </div>
    </MDBCard>

  
      )
}
const renderEventContent = (eventContent: EventContentArg, showInfoBox: boolean,role:any) => {
  const { title, extendedProps } = eventContent.event;
  const type = extendedProps?.type || ''; 

    return (
      <>
      {type==="email" && (
        <>
        <Button className="color_baby_bluee" style={{color:"white"}} >
                      
                      <ForwardToInbox style={{marginRight:"3px"}} />
                          {eventContent.timeText}
                        </Button>   
        </>
             
      )}

      {type==="sms" && (
              <>
              <Button className="color_blue" style={{color:"white"}} >    
                            <PermPhoneMsgOutlined style={{marginRight:"3px",width:"50%"}} />
                                {eventContent.timeText}
                              </Button>   
              </>
                  
            )}

      {type==="whatsapp" && (
              <>
              <Button className="color_white" style={{color:"white"}} >
                            
                            <ChatBubbleOutline style={{marginRight:"3px"}} />
                                {eventContent.timeText}
                              </Button>   
              </>
                  
            )}

                          

      </>
    )
  }


export default Calendar

