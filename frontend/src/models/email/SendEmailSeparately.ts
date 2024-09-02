export interface SendEmailSeparately{
    recipient:string;
    replyTo:string;
    id?:number;
    addSignature:string;
    requestBody: Record<string, string>;
}