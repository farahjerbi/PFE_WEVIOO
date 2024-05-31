import { WebPushSubscription } from "./WebPushSubscription";

export interface ScheduledPushInfo{
    subscriptions:WebPushSubscription[],
    jobId: string,
    templateId: number,
    userId:number,
    templateName: string,
    nextTimeFired:string,

}