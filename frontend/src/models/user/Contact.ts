import { ITeam } from "./Team"

export interface IAddContact {
    fullName: string,
    phone:string,
    whatsapp:string,
    email:string
    auth:string
    Endpoint:string
    publicKey:string,
}

export interface IContact extends IAddContact {
    id:number,
    userId:number,
    teams:ITeam[]
}
export interface UpdateContact extends IAddContact {
    id:number,
    userId:number,
    teamId?:number[]
}
