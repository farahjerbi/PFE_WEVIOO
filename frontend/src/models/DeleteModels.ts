import { EmailTemplate } from "./EmailTemplate";
import { Role } from "./Role";

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

