import { WhatsAppTemplateResponse } from "./WhatsAppTemplateResponse";

export interface SendWhatsAppMsg{
    whatsAppTemplateResponse:WhatsAppTemplateResponse;
    numbers:string[];
    placeholders:string[];
}