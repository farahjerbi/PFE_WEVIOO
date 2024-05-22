export interface WebPushSubscription{
    id?:number;
    notificationEndPoint:string;
    publicKey:string;
    auth:string
    userId:number
}