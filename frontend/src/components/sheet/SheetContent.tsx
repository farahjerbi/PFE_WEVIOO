import React from 'react'
import { Button, Tooltip } from '@mui/material';
import Visibility from "@mui/icons-material/Visibility";
import ViewEmailTemplateSimple from '../modals/ViewEmailTemplateSimple';
import ScheduleSend from "@mui/icons-material/ScheduleSend";
import BookmarkRemoveOutlined from "@mui/icons-material/BookmarkRemoveOutlined";
import Send from "@mui/icons-material/Send";
import { useNavigate } from 'react-router-dom';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';

import { SEND_EMAIL, SEND_EMAIL_SCHEDULED } from '../../routes/paths';
import { EmailTemplate } from '../../models/EmailTemplate';
import { useGetDesignTemplateMutation, useToggleFavoriteEmailMutation } from '../../redux/services/emailApi';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedEmail, setUpdateEmailFavList } from '../../redux/state/emailSlice';
import { toast } from 'sonner';
import { selectUser } from '../../redux/state/authSlice';
interface SheetContentProps<T> {
    templates: T[];
    type: string;
}

  
const SheetContent: React.FC<SheetContentProps<EmailTemplate>> = ({ templates, type }) => {
    const [selectedTemplate, setSelectedTemplate] = React.useState<EmailTemplate>();
    const [templateDesign, setTemplateDesign] = React.useState<any>();
    const [getDesignTemplate] = useGetDesignTemplateMutation();
    const [basicModal, setBasicModal] = React.useState(false);
    const dispatch=useDispatch();
    const navigate=useNavigate();
    const user=useSelector(selectUser)
    const[toggleFavoriteEmail]=useToggleFavoriteEmailMutation();
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
                <Tooltip style={{marginRight:"5px"}} title="View" className="color_purple" >
                        <Button onClick={() => handleView(template)}>
                        <Visibility style={{color:"whitesmoke"}}  />
                        </Button>                           
                        </Tooltip>
              </td>
              <td>
              <Tooltip style={{marginRight:"5px"}} title="Send" className="color_blue" >
              <Button
                  onClick={() => {
                    dispatch(setSelectedEmail(template));
                    navigate(`${SEND_EMAIL}`);
                  }}
                >
              <Send style={{color:"whitesmoke"}}  />
              </Button>                           
              </Tooltip>
              </td>
              <td>
              <Tooltip style={{marginRight:"5px"}} title="ScheduleSend" className="color_baby_blue" >
              <Button
                  onClick={() => {
                    dispatch(setSelectedEmail(template));
                    navigate(`${SEND_EMAIL_SCHEDULED}`);
                  }}
                >
                        <ScheduleSend style={{color:"whitesmoke"}}  />
                        </Button>                           
                        </Tooltip>
              </td>
              <td>
              <Tooltip style={{marginRight:"5px"}} title="Remove Template" className="color_pink" >
                                  <Button  onClick={() =>toggleFavoriteEmailFunc(template)}>
                                  <BookmarkRemoveOutlined style={{color:"whitesmoke"}}  /> 
                                  </Button>                           
                                  </Tooltip>
              </td>
            </tr>
          ))}
        </tbody>
        </Table>
        {selectedTemplate && (
              <ViewEmailTemplateSimple templateDesign={templateDesign} template={selectedTemplate} show={basicModal} onClose={handleUpdate} />
      )}
</Sheet>
)
}

export default SheetContent