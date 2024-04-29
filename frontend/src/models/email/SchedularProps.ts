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


  export interface SchedularSMSProps {
    onClose: () => void;
    show:boolean;
    numbers:string[];
    placeholdersValues:{ [key: string]: string };
    templateId:any
  }

  export interface SchedularWhatsappProps {
    onClose: () => void;
    show:boolean;
    numbers:string[];
    placeholders:string[];
    templateId:any;
    name:String;
    language:String;
  }