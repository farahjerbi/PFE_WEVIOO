import { TemplateBody } from "./TemplateBody";

export interface EmailTemplate{
    id?:number,
    name: string,
    language:string,
    state?:string,
    templateBody:TemplateBody
    userFavoriteEmails?: number[];
}