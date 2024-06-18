import { IAddContact } from "./Contact"

export interface Team {
    id?:number,
    name: string,
    description:string,
    avatar:string|null,
}

export interface ITeam {
    id?:number,
    name: string,
    description:string,
    avatar:string|null|undefined,
}

export interface IUpdateTeam extends ITeam{
    members:number[]
} 

export interface ITeamWithContact extends ITeam{
    members:IAddContact[]
} 