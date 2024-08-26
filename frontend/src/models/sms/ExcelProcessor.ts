import { SmsTemplate } from "./SmsTemplate";
import { WhatsAppTemplateResponse } from "./WhatsAppTemplateResponse";

export interface ExcelProcessor {
    placeholderData: { [key: string]: string[] };
}

export interface SMSExcelProcessor extends ExcelProcessor{
    smsTemplate:SmsTemplate|null
}

export interface WhatsappExcelProcessor extends ExcelProcessor{
    whatsAppTemplateResponse:WhatsAppTemplateResponse|null
}