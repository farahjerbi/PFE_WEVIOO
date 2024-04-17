import { Category } from "./Category";
import { Structure } from "./Structure";

export interface WhatsAppTemplatePayload{
    name: string,
    language:string,
    state?:string,
    category:Category,
    structure:Structure
}