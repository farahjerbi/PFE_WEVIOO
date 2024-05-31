import { WebPushSubscription } from "./WebPushSubscription";

export interface SchedulePushRequest {
    templateId:number;
    webPushSubscriptions:WebPushSubscription[];
    placeholders: { [key: string]: string };
    userId:number;
    timeZone:string;
    dateTime:string;
    name:string
    isAdmin:boolean
}