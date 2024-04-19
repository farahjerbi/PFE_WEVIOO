import { EmailTemplate } from "./email/EmailTemplate";
import { SmsTemplate } from "./sms/SmsTemplate";
import { WhatsAppTemplateResponse } from "./sms/WhatsAppTemplateResponse";
import { Role } from "./user/Role";

export interface DeleteTemplateModalProps {
    id: number;
    onClose: () => void;
    show:boolean;
  }

  export interface DeleteTemplateSMSModalProps {
    id: number | string;
    onClose: () => void;
    show:boolean;
  }

export interface DeleteUserModalProps extends DeleteTemplateModalProps {
    typeUser:Role
  }

  export interface ViewTemplateModalProps {
    template: EmailTemplate;
    onClose: () => void;
    show:boolean;
    templateDesign:any
  }

  export interface ViewTemplateSMSModalProps {
    template: SmsTemplate | WhatsAppTemplateResponse;
    onClose: () => void;
    show:boolean;
  }

