import { WhatsAppTemplateResponse } from "./WhatsAppTemplateResponse";

export interface SendWhatsAppMsg{
    whatsAppTemplateResponse:WhatsAppTemplateResponse;
    numbers:string[];
    placeholders:string[];
}

export interface SendWhatsappSeparately{
    number:string
    placeholders:string[];
}

export interface SendIndivWhatsapp{
    whatsAppTemplateResponse:WhatsAppTemplateResponse|null;
    sendSeparatelyList:SendWhatsappSeparately[];
}