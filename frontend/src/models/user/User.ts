import { Contact } from "./Contact";
import { Role } from "./Role";

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
    members:Contact[]
}

export type UserPayload = {
    user:IUser;
    token:string;
    role:Role
}

export interface CreateUser extends IUser {
    password: string
}