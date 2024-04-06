import  { useEffect, useState } from 'react'
import './Calendar.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import { useDeleteScheduledEmailMutation, useGetScheduledEmailsByUserMutation, useGetScheduledEmailsMutation } from '../../../../redux/services/emailApi';
import { toast } from 'sonner';
import { Button, Tooltip } from '@mui/material';
import { DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import ForwardToInbox from "@mui/icons-material/ForwardToInbox";
import Clear from "@mui/icons-material/Clear";
import Info from "@mui/icons-material/Info"
import styled from '@emotion/styled';
import { selectRole, selectUser } from '../../../../redux/state/authSlice';
import { useSelector } from 'react-redux';
import { Role } from '../../../../models/Role';
import { MDBBadge, MDBBtn, MDBCard, MDBCardBody, MDBCardFooter, MDBCardHeader, MDBCardText, MDBCardTitle, MDBModal, MDBModalBody, MDBModalContent, MDBModalDialog, MDBModalFooter, MDBModalHeader, MDBModalTitle } from 'mdb-react-ui-kit';
export const StyleWrapper = styled.div`
  .fc-button.fc-prev-button, .fc-button.fc-next-button, .fc-button.fc-button-primary{
    background:#54b4d3;
    border:none;
    background-image: none;
}
.fc-v-event{
  background:#C1C6F9;
  border:none;
}
.fc-scroller-harness{
  background:transparent;
}
.fc .fc-button-primary:not(:disabled).fc-button-active{
  background:#d59057;
}
`
const Calendar  : React.FC= () => {
const role = useSelector(selectRole);
const user=useSelector(selectUser)
const[getScheduledEmails]=useGetScheduledEmailsMutation()
const[getScheduledEmailsByUser]=useGetScheduledEmailsByUserMutation()
const[data,setData]=useState();
const [eventInfoBoxes, setEventInfoBoxes] = useState<{ [key: string]: boolean }>({});
const [basicModal, setBasicModal] = useState<boolean>(false);
const [update, setUpdate] = useState<boolean>(false);

const [id, setId] = useState<string>("");

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
      role === Role.ADMIN ? fetchDataAdmin() : fetchDataUser();
    }, [update]);
    
      const fetchDataAdmin = async () => {
        try {
          const response = await getScheduledEmails({}).unwrap();
          console.log("🚀 ~ fetchData ~ response:", response);
          populateDataAdmin(response);
          console.error("🚀 ~ error:", data);
        } catch (error) {
          toast.error("Error! Yikes");
          console.error("🚀 ~ error:", error);
        }
      };

      const fetchDataUser = async () => {
        if(user){
          try {
            const response = await getScheduledEmailsByUser(user.id).unwrap();
            console.log("🚀 ~ fetchData ~ response:", response);
            populateDataUser(response);
            console.error("🚀 ~ error:", data);
          } catch (error) {
            toast.error("Error! Yikes");
            console.error("🚀 ~ error:", error);
          }
        }
      };

      function populateDataAdmin(data:any) {
        const newData = data.map((e:any) => ({
          title:"Template " + e.templateName + " used by " + e.username,
          date:e.nextTimeFired,
          type:"Email",
          id:e.jobId,
          sentTo:"",

        }));
        setData(newData);
      }

      function populateDataUser(data:any) {
        const newData = data.map((e:any) => ({
          title:e.templateName ,
          sentTo:e.recipients,
          id:e.jobId,
          date:e.nextTimeFired,
          type:"Email",
          cc:e.cc,
          replyTo:e.replyTo
        }));
        setData(newData);
      }

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
        <div className='mt-5' style={{
          backgroundImage: "url('/assets/calender.jpg')",
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          width: "83%",
          marginLeft: "12%"
        }}>
    <StyleWrapper style={{marginTop:"8%"}}>
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
  
      )
}
const renderEventContent = (eventContent: EventContentArg, showInfoBox: boolean,role:any) => {
  const { start } = eventContent.event;
  const dayOfWeek = start?.getDay(); 
  console.log("Day of the week:", dayOfWeek); 
  const { title, extendedProps } = eventContent.event;
  const sentTo = extendedProps?.sentTo || []; 
  const cc = extendedProps?.cc || []; 
  const replyTo = extendedProps?.replyTo || ''; 

  const renderedSentTo = sentTo.map((email: string, index: number) => (
    <p key={index} style={{color:"black"}}>{email}</p>
  ));

  const renderedCC = cc.map((email: string, index: number) => (
    <p key={index} style={{color:"black"}}>{email}</p>
  ));
  const { view } = eventContent;
  console.log("🚀 ~ renderEventContent ~ view:", view)


    return (
      <>
        {role===Role.ADMIN && (
              <div >
              
              <Tooltip style={{color:"whitesmoke"}}   title={eventContent.event.title} className="color_baby_blue" >
                      <Button >
                      <ForwardToInbox style={{marginRight:"3px"}} />
                          {eventContent.timeText}
                        </Button>         
                </Tooltip >
              {role===Role.USER && (<Clear style={{marginLeft:"30%"}} color='error' />   )}                 

            </div>
        )}
 
      {role===Role.USER && showInfoBox && ( 

    <div style={{ position: 'absolute', zIndex: 999, bottom: 30, right: 30, maxHeight: "20vh", overflowY: "auto" }}>
    <MDBCard style={{ minHeight: "100px" }}>
        <MDBCardHeader>  
          <h6><Info style={{marginLeft:"8px"}}/> Informations <Info/></h6>
          <hr/>
          <MDBBadge color='info' pill>
            <b>TemplateName:</b>        
          </MDBBadge> <p style={{color:"black"}}> {title}</p>
          <MDBBadge color='secondary' pill>
          <b>Recipients:</b> 
          </MDBBadge> 
          <p style={{color:"black"}}>{renderedSentTo}</p> 
          <MDBBadge color='warning' pill>
            <b>CC:</b> 
          </MDBBadge> 
            <p style={{color:"black"}}>{renderedCC}</p> 
          <MDBBadge color='success' pill>
            <b>ReplyTo:</b> 
          </MDBBadge> 
            <p style={{color:"black"}}>{replyTo}</p> 
          </MDBCardHeader>
        </MDBCard>
        </div>
    )}
      </>
    )
  }


export default Calendar

