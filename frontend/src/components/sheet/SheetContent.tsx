import React from 'react'
import { Button, Tooltip } from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import ScheduleSend from "@mui/icons-material/ScheduleSend";
import BookmarkRemoveOutlined from "@mui/icons-material/BookmarkRemoveOutlined";
import Send from "@mui/icons-material/Send";
import { useNavigate } from 'react-router-dom';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';

import { SEND_EMAIL, SEND_EMAIL_SCHEDULED, SEND_SMS } from '../../routes/paths';
import { EmailTemplate, isEmailTemplate } from '../../models/email/EmailTemplate';
import { useGetDesignTemplateMutation, useToggleFavoriteEmailMutation } from '../../redux/services/emailApi';
import { useDispatch, useSelector } from 'react-redux';
import {  setUpdateEmailFavList } from '../../redux/state/emailSlice';
import { toast } from 'sonner';
import { selectUser } from '../../redux/state/authSlice';
import { SmsTemplate } from '../../models/sms/SmsTemplate';
import ViewSMSTemplate from '../modals/view/ViewSMSTemplate';
import { useToggleFavoriteSMSMutation } from '../../redux/services/smsApi';
import { setUpdateSmsFavList } from '../../redux/state/smsSlice';
import ViewEmailTemplateSimple from '../modals/view/ViewEmailTemplateSimple';
interface SheetContentProps<T> {
    templates: T[];
    type: string;
}

  
const SheetContent: React.FC<SheetContentProps<EmailTemplate|SmsTemplate>> = ({ templates, type }) => {

    const [selectedTemplate, setSelectedTemplate] = React.useState<EmailTemplate|SmsTemplate>();
    const [templateDesign, setTemplateDesign] = React.useState<any>();
    const [getDesignTemplate] = useGetDesignTemplateMutation();
    const [basicModal, setBasicModal] = React.useState(false);
    const [smsModal, setSmsModal] = React.useState(false);

    const dispatch=useDispatch();
    const navigate=useNavigate();
    const user=useSelector(selectUser)
    const[toggleFavoriteEmail]=useToggleFavoriteEmailMutation();
    const[toggleFavoriteSMS]=useToggleFavoriteSMSMutation()


  const handleView = async (template: EmailTemplate) => {
    setSelectedTemplate(template);
    if (template.state === "COMPLEX") {
      if (template.id !== undefined) {
        const design = await getDesignTemplate(template.id).unwrap();
        setTemplateDesign(design);
      }
    }
    if (template.state === "SIMPLE") {
      setTemplateDesign(null);

    }
    setBasicModal(!basicModal);
  };

  const handleUpdate = () => {
    setBasicModal(false)
        };

        const toggleFavoriteEmailFunc=async(template:EmailTemplate)=>{
          try{
             await toggleFavoriteEmail({idTemplate:template.id,idUser:user?.id})
      
              dispatch(setUpdateEmailFavList(template.id));
      
              toast.success("Template removed from favorites successfully");
          
          }catch(error){
            toast.error("Error !!")
          }
        }

        const toggleFavoriteSMSFunc=async(template:SmsTemplate)=>{
          try{
             await toggleFavoriteSMS({idTemplate:template.id,idUser:user?.id})
                      
                dispatch(setUpdateSmsFavList(template.id));
              
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
              <td>{template.name}</td>
              <td>   
              <Tooltip style={{marginRight:"5px"}} title="View" className="color_purple">
                <Button onClick={() => {
                  if (isEmailTemplate(template)) {
                    handleView(template);
                  } else {
                    setSelectedTemplate(template);
                    setSmsModal(true);
                  }
                }}>
                  <Visibility style={{color:"whitesmoke"}} />
                </Button>
              </Tooltip>                 
            
              </td>
              <td>
              <Tooltip style={{marginRight:"5px"}} title="send" className="color_blue">
                <Button onClick={() => {
                  if (isEmailTemplate(template)) {
                    navigate(`${SEND_EMAIL}/${template.id}`);
                  } else {
                    navigate(`${SEND_SMS}/${template.id}`);
                  }
                }}>
                  <Send style={{color:"whitesmoke"}} />
                </Button>
              </Tooltip>       
              {/* {isEmailTemplate(template) && 

              <Tooltip style={{marginRight:"5px"}} title="Send" className="color_blue" >
              <Button
                  onClick={() => {
                    navigate(`${SEND_EMAIL}/${template.id}`);
                  }}
                >
              <Send style={{color:"whitesmoke"}}  />
              </Button>                           
              </Tooltip>} */}
              </td>
              <td>

              <Tooltip style={{marginRight:"5px"}} title="ScheduleSend" className="color_baby_blue" >
              <Button
                  onClick={() => {
                    if (isEmailTemplate(template)) {
                    navigate(`${SEND_EMAIL_SCHEDULED}/${template.id}`);
                  }else {
                    navigate(`${SEND_SMS}/${template.id}`);
                  }
                  }}
                >
                        <ScheduleSend style={{color:"whitesmoke"}}  />
                        </Button>                           
                        </Tooltip>
              </td>
              <td>
                <Tooltip style={{marginRight:"5px"}} title="Remove Template" className="color_pink">
                  <Button onClick={() => {
                    isEmailTemplate(template) ? toggleFavoriteEmailFunc(template) : toggleFavoriteSMSFunc(template);
                  }}>
                    <BookmarkRemoveOutlined style={{color:"whitesmoke"}} />
                  </Button>
                </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
        </Table>
        {selectedTemplate && isEmailTemplate(selectedTemplate) && (
              <ViewEmailTemplateSimple templateDesign={templateDesign} template={selectedTemplate} show={basicModal} onClose={handleUpdate} />
      )}
      {selectedTemplate && !isEmailTemplate(selectedTemplate) &&  (<ViewSMSTemplate template={selectedTemplate} show={smsModal} onClose={()=>setSmsModal(false)}  />)}

</Sheet>
)
}

export default SheetContent