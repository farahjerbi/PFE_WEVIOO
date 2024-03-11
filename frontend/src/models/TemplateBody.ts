import { Image } from "./Image";

export interface TemplateBody{
    id?:number,
    subject: string,
    content:string,
    signature?:Image,
    logo?:Image
    design?:string;
}