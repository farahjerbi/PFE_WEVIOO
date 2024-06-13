import { IContact } from "./Contact";
import { Role } from "./Role";
import { ITeam } from "./Team";

export interface IUser {
    id:number,
    firstName: string,
    lastName:string,
    email:string,
    role:Role
    enabled:string
    mfaEnabled:string
    signature:string
    emailSecret:string,
    members:IContact[],
    teams:ITeam[]
}

export type UserPayload = {
    user:IUser;
    token:string;
    role:Role
}

export interface CreateUser extends IUser {
    password: string
}