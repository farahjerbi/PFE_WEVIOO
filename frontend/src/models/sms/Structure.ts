import { Button } from "./Button";
import { Format } from "./Format";

export interface Structure{
    header: Format,
    body: Format,
    footer: Format,
    type:string,
    buttons?:Button[]
}