import { SendPushIndiv } from "./SendPush";
import { WebPushTemplate } from "./WebPushTemplate";

export interface WebPushExcelProcessor {
    template:WebPushTemplate;
    placeholderData: { [key: string]: string[] };
}
