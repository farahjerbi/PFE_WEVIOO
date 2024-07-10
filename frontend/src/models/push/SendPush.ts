import { WebPushSubscription } from "./WebPushSubscription";
import { WebPushTemplate } from "./WebPushTemplate";

export interface SendPush {
    webPushSubscriptions:WebPushSubscription;
    placeholderValues: { [key: string]: string };

}

export interface SendPushIndiv {
    webPushMessageTemplate:WebPushTemplate|null;
    sendSeparatelyList:SendPush[] ;

}