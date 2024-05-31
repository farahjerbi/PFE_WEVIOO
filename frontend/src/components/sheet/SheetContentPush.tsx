import React, { useState } from 'react'
import { WebPushTemplate } from '../../models/push/WebPushTemplate';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { selectUser } from '../../redux/state/authSlice';
import { useToggleFavoritePushMutation } from '../../redux/services/pushApi';
import { setUpdatePushFavList } from '../../redux/state/pushSlice';
import { toast } from 'sonner';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import { Button, Tooltip } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import ScheduleSend from '@mui/icons-material/ScheduleSend';
import BookmarkRemoveOutlined from '@mui/icons-material/BookmarkRemoveOutlined';
import Send from '@mui/icons-material/Send';
interface SheetContentProps<T> {
    templates: WebPushTemplate[];
}

const SheetContentPush: React.FC<SheetContentProps<WebPushTemplate>> = ({ templates }) => {
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const user=useSelector(selectUser)
    const [toggleFavoritePush]=useToggleFavoritePushMutation()
    const[view,setView]=useState<boolean>(false)
    const toggleFavoritePushFunc=async(template:WebPushTemplate)=>{
        try{
           await toggleFavoritePush({idTemplate:template.id,idUser:user?.id})
    
            dispatch(setUpdatePushFavList(template.id));
    
            toast.success("Template removed from favorites successfully");
        
        }catch(error){
          toast.error("Error !!")
        }
      }

    
  return (
    <Sheet
    sx={{
    height: "72vh",
    overflow: 'auto',
    background: (
      theme,
    ) => `linear-gradient(${theme.vars.palette.background.surface} 30%, rgba(255, 255, 255, 0)),
      linear-gradient(rgba(255, 255, 255, 0), ${theme.vars.palette.background.surface} 70%) 0 100%,
      radial-gradient(
        farthest-side at 50% 0,
        rgba(0, 0, 0, 0.12),
        rgba(0, 0, 0, 0)
      ),
      radial-gradient(
          farthest-side at 50% 100%,
          rgba(0, 0, 0, 0.12),
          rgba(0, 0, 0, 0)
        )
        0 100%`,
    backgroundSize: '100% 40px, 100% 40px, 100% 14px, 100% 14px',
    backgroundRepeat: 'no-repeat',
    backgroundAttachment: 'local, local, scroll, scroll',
    backgroundPosition:
      '0 var(--TableHeader-height), 0 100%, 0 var(--TableHeader-height), 0 100%',
    backgroundColor: 'background.surface',
    }}
    >
  <Table stickyHeader>
        <thead>
          <tr>
            <th>Name</th>
            <th>View</th>
            <th>Send</th>
            <th>Schedule</th>
            <th>Unsave</th>
          </tr>
        </thead>
        <tbody>
          {templates?.map((template) => (
            <tr key={template.id}>
              <td>{template.title}</td>
              <td>   
              <Tooltip style={{marginRight:"5px"}} title="View" className="color_purple">
                <Button onClick={() => {setView(true)}}>
                  <Visibility style={{color:"whitesmoke"}} />
                </Button>
              </Tooltip>                 
            
              </td>
              <td>
              <Tooltip style={{marginRight:"5px"}} title="send" className="color_blue">
                <Button onClick={() => {}}>
                  <Send style={{color:"whitesmoke"}} />
                </Button>
              </Tooltip>       
               
              </td>
              <td>

              <Tooltip style={{marginRight:"5px"}} title="ScheduleSend" className="color_baby_blue" >
              <Button
                  onClick={() => {}}>
                        <ScheduleSend style={{color:"whitesmoke"}}  />
                        </Button>                           
                        </Tooltip>
              </td>
              <td>
                <Tooltip style={{marginRight:"5px"}} title="Remove Template" className="color_pink">
                  <Button onClick={() => {
                   toggleFavoritePushFunc(template) 
                  }}>
                    <BookmarkRemoveOutlined style={{color:"whitesmoke"}} />
                  </Button>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
        </Table>
</Sheet>
  )
}

export default SheetContentPush