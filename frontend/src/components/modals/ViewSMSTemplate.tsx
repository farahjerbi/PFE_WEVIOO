import React, { useEffect, useState } from 'react'
import { ViewTemplateSMSModalProps } from '../../models/DeleteModels'
import { Modal } from '@mui/material';
import Button from '@mui/joy/Button';
import ModalDialog from '@mui/joy/ModalDialog';
import './ViewTemplate.css'
import { WhatsAppTemplateResponse } from '../../models/sms/WhatsAppTemplateResponse';
import { SmsTemplate } from '../../models/sms/SmsTemplate';
const ViewSMSTemplate: React.FC<ViewTemplateSMSModalProps> = ({template , onClose ,show }) => {
    const [open,setOpen]=useState<boolean>(show);
    useEffect(() => {
        setOpen(show);
    }, [show]);

    const isWhatsapp = (template: SmsTemplate | WhatsAppTemplateResponse): template is WhatsAppTemplateResponse => {
        return 'status' in template; 
    };

    const toggleOpen = () =>{
        onClose();
        setOpen(false);
      } 


  return (
    <>
        <Modal open={open} onClose={toggleOpen}>
        <ModalDialog >
            <div className='view-card '>
                <div className='content d-flex flex-column'>
                    <img src="../../../assets/userSMS.png" className='mb-4' style={{width:"8%" , marginLeft:"22%"}} alt="" />
                <Button
                className='mb-2'
                style={{maxWidth:"250px"}}
                    size="sm"
                    variant="soft"
                    color="primary"
                >
               {isWhatsapp(template) ? template.name : template.subject}


                </Button>
                <Button
                style={{maxWidth:"250px"}}
                    size="sm"
                    variant="soft"
                    color="success"
                >
                  {isWhatsapp(template) ? template.structure.body.text : template.content}


                </Button>
                </div>
            </div>
        </ModalDialog>
        </Modal>

    </>


)
}

export default ViewSMSTemplate