export interface ScheduleSMSRequest {
    templateId:number;
    numbers:string[];
    placeHolders: { [key: string]: string };
    userId:number;
    timeZone:string;
    dateTime:string

}