import  { useEffect, useState } from 'react'
import './Calendar.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import { useGetScheduledEmailsByUserMutation, useGetScheduledEmailsMutation } from '../../../../redux/services/emailApi';
import { toast } from 'sonner';
import { Button, Tooltip } from '@mui/material';
import { DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import ForwardToInbox from "@mui/icons-material/ForwardToInbox";
import styled from '@emotion/styled';
export const StyleWrapper = styled.div`
  .fc-button.fc-prev-button, .fc-button.fc-next-button, .fc-button.fc-button-primary{
    background: #7EB4DA;
    border:none;
    background-image: none;
}
.fc-scroller-harness{
  background:transparent;
}
.fc .fc-button-primary:not(:disabled).fc-button-active{
  background:#377dbc;
}
`
const Calendar  : React.FC= () => {
const[getScheduledEmails]=useGetScheduledEmailsMutation()
const[getScheduledEmailsByUser]=useGetScheduledEmailsByUserMutation()
const[data,setData]=useState();

    useEffect(() => {
      fetchDataAdmin();
      }, []);
    
      const fetchDataAdmin = async () => {
        try {
          const response = await getScheduledEmails({}).unwrap();
          console.log("🚀 ~ fetchData ~ response:", response);
          populateData(response);
          console.error("🚀 ~ error:", data);
        } catch (error) {
          toast.error("Error! Yikes");
          console.error("🚀 ~ error:", error);
        }
      };

      // const fetchDataUser = async () => {
      //   try {
      //     const response = await getScheduledEmailsByUser({}).unwrap();
      //     console.log("🚀 ~ fetchData ~ response:", response);
      //     populateData(response);
      //     console.error("🚀 ~ error:", data);
      //   } catch (error) {
      //     toast.error("Error! Yikes");
      //     console.error("🚀 ~ error:", error);
      //   }
      // };

      function populateData(data:any) {
        const newData = data.map((e:any) => ({
          title:"Template " + e.templateName + " used by " + e.username,
          date:e.nextTimeFired,
          type:"Email"
        }));
        setData(newData);
      }


        const   handleEventClick = (clickInfo: EventClickArg) => {
            if (toast(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
            }
          }
      
  return (
        <div className='mt-5' style={{
          backgroundImage: "url('/assets/Schedule.gif')",
          backgroundPosition: "center",
          backgroundSize: "contain",
          backgroundRepeat: "no-repeat",
          width: "80%",
          marginLeft: "18%"
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
          eventContent={renderEventContent}
          eventClick={handleEventClick}

        />
            </StyleWrapper>
    </div>
  
      )
}
function renderEventContent(eventContent: EventContentArg) {
    return (
      <>
      <div >
      
        <Tooltip style={{color:"whitesmoke"}}   title={eventContent.event.title} className="color_baby_blue" >
                <Button >
                <ForwardToInbox style={{marginRight:"3px"}} />
                    {eventContent.timeText}
                  </Button>                           
         </Tooltip>
         
    

      </div>
     
      </>
    )
  }
export default Calendar

