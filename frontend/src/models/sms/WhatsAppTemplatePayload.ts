import { Category } from "./Category";
import { Structure } from "./Structure";

export interface WhatsAppTemplatePayload{
    name: string,
    language:string,
    category:Category,
    structure:Structure
}