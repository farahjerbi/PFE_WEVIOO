import { SmsTemplate } from "../sms/SmsTemplate";
import { TemplateBody } from "./TemplateBody";

export interface EmailTemplate{
    id?:number,
    name: string,
    language:string,
    state?:string,
    templateBody:TemplateBody
    userFavoriteEmails?: number[];
}

export function isEmailTemplate(template: EmailTemplate | SmsTemplate): template is EmailTemplate {
    return (template as EmailTemplate).state !== undefined;
  }