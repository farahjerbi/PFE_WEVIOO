import { IContact } from "./Contact"

export interface Team {
    id?:number,
    name: string,
    description:string,
    avatar:string|null,
    members?:number[]
}

export interface ITeam {
    id?:number,
    name: string,
    description:string,
    avatar:string|null,
    members?:IContact[]
}