import { Role } from "./Role";

export interface IUser {
    id:number,
    firstName: string,
    lastName:string,
    email:string,
    role:Role
    enabled:string
    mfaEnabled:string
}

export type UserPayload = {
    user:IUser;
    token:string;
    role:Role
}

export interface CreateUser extends IUser {
    password: string
}