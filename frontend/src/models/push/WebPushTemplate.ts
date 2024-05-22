export interface WebPushTemplate{
    id?:number;
    message:string;
    title:string;
    icon:string;
    clickTarget:string;
    placeholders:string[];
    userFavoritePush:number[];
}