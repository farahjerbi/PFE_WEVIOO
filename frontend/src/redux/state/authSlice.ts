import {createSlice , PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../store"
import { IUser, UserPayload } from "../../models/User";
import { Role } from "../../models/Role";


export interface AuthState{
    user: IUser | null;
    isAuthorized: boolean;
    token: string | null;
    role: Role | null;
}


const initialState: AuthState={
    user:null,
    token: localStorage.getItem("token"),
    isAuthorized: true,
    role:null
}

export const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        setUser:(
            state, 
            action : PayloadAction<UserPayload>
            )=>{
            localStorage.setItem("user",JSON.stringify(action.payload.user));
            localStorage.setItem("token",JSON.stringify(action.payload.token));
            state.user=action.payload.user;
            state.token=action.payload.token;
            state.role=action.payload.user.role;
        },
        logout:(state)=>{
            localStorage.clear();
            state.user=null;
            state.role=null;
            state.token=null;
        }
    }
})


export const selectAuth = (state:RootState)=>state.auth;

export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectRole = (state: RootState) => state.auth.role;

export const {setUser,logout} = authSlice.actions

export default authSlice.reducer;