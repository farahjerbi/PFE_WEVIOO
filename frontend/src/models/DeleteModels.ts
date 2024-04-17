import { EmailTemplate } from "./email/EmailTemplate";
import { Role } from "./user/Role";

export interface DeleteTemplateModalProps {
    id: number;
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

