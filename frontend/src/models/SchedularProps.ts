export interface SchedularProps {
    onClose: () => void;
    show:boolean;
    recipientEmails:string[];
    cc:string[];
    placeholdersValues:{ [key: string]: string };
    id:any;
    addSignature:boolean;
    replyTo:string;
    templateId:any
  }