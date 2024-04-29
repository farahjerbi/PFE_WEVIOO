import { WhatsAppTemplatePayload } from "./WhatsAppTemplatePayload";

export interface WhatsAppTemplateResponse extends WhatsAppTemplatePayload{
    id:number,
    allowCategoryChange:boolean,
    businessAccountId:number,
    quality:string,
    status?:string,
    placeholders?:string[]


}