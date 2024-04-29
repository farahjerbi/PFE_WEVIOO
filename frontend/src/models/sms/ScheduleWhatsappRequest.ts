export interface ScheduleWhatsappRequest {
    templateId:number;
    numbers:string[];
    placeholders:string[];
    userId:number;
    timeZone:string;
    dateTime:string
    name:String;
    language:String;

}