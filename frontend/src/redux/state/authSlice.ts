import {createAsyncThunk, createSlice , PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../store"
import { IUser, UserPayload } from "../../models/User";
import { Role } from "../../models/Role";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';
import { DecodedToken } from "../../models/DecodedToken";


  export const decodeToken = createAsyncThunk<IUser | null, void>(
    "auth/decodeToken",
    async (_, { rejectWithValue }) => {
        const token = localStorage.getItem("token");
        if (token) {
            try {
                const decodedToken: DecodedToken = jwtDecode(token);
                const userEmail = decodedToken.sub;
                const response = await axios.get<IUser>(
                    `http://localhost:8099/api/users/getUserByEmail/${userEmail}`
                );
                console.log("🚀 ~ response.data:", response.data)
                return response.data;
            } catch (error) {
                console.error("Error decoding token:", error);
                return rejectWithValue(null);
            }
        }
        return null;
    }
);

export const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true;
    try {
      const decodedToken: DecodedToken = jwtDecode(token);
      console.log("🚀 ~ isTokenExpired ~ Date.now():", Date.now())
      console.log("🚀 ~ isTokenExpired ~ decodedToken.exp:", decodedToken.exp* 1000)
      return decodedToken.exp * 1000 < Date.now();
      
    } catch (error) {
      console.error('Error decoding token:', error);
      return true;
    }
  
  };



export interface AuthState{
    user: IUser | null;
    isAuthorized: boolean;
    token: string | null;
    role: Role | null;
}

const initialState: AuthState={
    user:null,
    token: localStorage.getItem("token"),
    isAuthorized: false,
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
            localStorage.setItem("token",JSON.stringify(action.payload.token));
            state.user=action.payload.user;
            state.token=action.payload.token;
            state.role=action.payload.user.role;
            state.isAuthorized=true;
        },
        logout:(state)=>{
            localStorage.clear();
            state.user=null;
            state.role=null;
            state.isAuthorized=false;
            state.token=null;
        },
        setIsAuthorized: (state, action: PayloadAction<boolean>) => {
          state.isAuthorized = action.payload;
        },
    }  ,
    extraReducers: (builder) => {
        builder.addCase(decodeToken.fulfilled, (state, action) => {
          state.user = action.payload;
          state.isAuthorized = !isTokenExpired(state.token);
        if (action.payload !== null) {
            state.role = action.payload.role; 
          }                
        });
        builder.addCase(decodeToken.rejected, (state) => {
          state.user = null;
          state.role = null;
          state.isAuthorized = false;
        });
      },
})


export const selectAuth = (state:RootState)=>state.auth;
export const selectIsAuth = (state: RootState) => state.auth.isAuthorized;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectRole = (state: RootState) => state.auth.role;
export const {setUser,logout,setIsAuthorized} = authSlice.actions

export default authSlice.reducer;