export interface SmsTemplate{
    id?:number,
    name: string,
    language:string,
    subject:string,
    content:string,
    userFavoriteSms?: number[];
    placeholders?:string[];
}