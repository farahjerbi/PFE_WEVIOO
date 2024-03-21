import React, { useEffect, useState } from 'react'
import './Calendar.css'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction"
import { useGetScheduledEmailsMutation } from '../../../../redux/services/emailApi';
import { toast } from 'sonner';
import { Button, Card, Tooltip } from '@mui/material';
import { DateSelectArg, EventClickArg, EventContentArg } from '@fullcalendar/core';
import { MDBBadge, MDBCard } from 'mdb-react-ui-kit';
import AutoAwesome from "@mui/icons-material/AutoAwesome";

const Calendar = () => {
const[getScheduledEmails]=useGetScheduledEmailsMutation()
const[data,setData]=useState();
    useEffect(() => {
        fetchData();
      }, []);
    
      const fetchData = async () => {
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
      function populateData(data:any) {
        const newData = data.map((e:any) => ({
          title:"Template " + e.templateName + " used by " + e.username,
          date:e.nextTimeFired,
        }));
        setData(newData);
      }


        const   handleEventClick = (clickInfo: EventClickArg) => {
            if (toast(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
            }
          }
      
  return (
    <div className='mt-5' style={{width:"80%",marginLeft:"18%"}}>
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
    </div>
  
      )
}
function renderEventContent(eventContent: EventContentArg) {
    return (
      <>
      <div >
      
        <Tooltip style={{color:"whitesmoke"}}   title={eventContent.event.title} className="color_blue" >
                <Button >
                <AutoAwesome />
                    {eventContent.timeText}
                 <AutoAwesome />
                  </Button>                           
         </Tooltip>
      </div>
     
      </>
    )
  }
export default Calendar

