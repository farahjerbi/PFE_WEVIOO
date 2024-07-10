import {createAsyncThunk, createSlice , PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../store"
import axios from "axios";
import { IUser } from "../../models/user/User";

export const getUsers = createAsyncThunk<any| null, void>(
    "users/getUsers",
    async (_, { rejectWithValue }) => {
      let token = localStorage.getItem("token");
      console.log("🚀 ~ token:", token)
      if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.substring(1, token.length - 1);
    }
          if (token) {
            try {
                const response = await axios.get<any>(
                    `http://localhost:8099/api/users/getAllUsers`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`, 
                      },
                    }
                );
                console.log("🚀 ~ response.data:", response.data)
                return response.data;
            } catch (error) {
                console.error("Error decoding token:", error);
                return rejectWithValue(null);
            }
        }
      }
);

export interface UsersState{
    users: IUser[]| null;
}

const initialState: UsersState={
    users:null,
}
export interface UpdateUser{
    email: string;
    enabled: string;
}

export const usersSlice = createSlice({
    name:"users",
    initialState,
    reducers:{
        setUsers:(
            state, 
            action : PayloadAction<IUser[]>
            )=>{
            state.users=action.payload;
        },
        setUser(state, action: PayloadAction<IUser>) {
            if (state.users) {
              state.users.push(action.payload);
            }
          },
          setUpdateUserEnabled(state, action: PayloadAction<UpdateUser>) {
            if (state.users) {
              const index = state.users.findIndex((user: IUser) => user.email === action.payload.email);
              if (index !== -1) {
                state.users[index].enabled = action.payload.enabled;
              }
            }
          }            
          ,
          setDeleteUser(state, action: PayloadAction<number>) {
            if (state.users) {
              state.users = state.users.filter((user: IUser) => user.id !== action.payload);
            }
          }
          
          
    } ,
    extraReducers: (builder) => {
        builder.addCase(getUsers.fulfilled, (state, action) => {
          state.users = action.payload;         
        });
        builder.addCase(getUsers.rejected, (state) => {
          state.users = null;
        });
      },
})


export const selectUsersInfo = (state:RootState)=>state.users;
export const selectUsers = (state: RootState) => state.users.users;
export const {setDeleteUser,setUpdateUserEnabled,setUser,setUsers} = usersSlice.actions

export default usersSlice.reducer;