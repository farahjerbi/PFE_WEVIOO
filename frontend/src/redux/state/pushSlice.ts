import {createAsyncThunk, createSlice , PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../store"
import { EmailTemplate } from "../../models/email/EmailTemplate";
import axios from "axios";
import { WebPushTemplate } from "../../models/push/WebPushTemplate";
import { ScheduledPushInfo } from "../../models/push/ScheduledPushInfo";

export const getTemplatesPush = createAsyncThunk<any| null, void>(
    "push/getTemplatesPush",
    async (_, { rejectWithValue }) => {
      let token = localStorage.getItem("token");
      console.log("🚀 ~ token:", token)
      if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.substring(1, token.length - 1);
    }
    if (token) {

            try {
                const response = await axios.get<any>(
                    `http://localhost:8099/apiPush/getAll`,
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
        return null;
      }
);

export interface PushState{
    pushs: WebPushTemplate[] | null;
    push: WebPushTemplate | null;
    pushAI: WebPushTemplate | null;
    savedPushedTemplates:WebPushTemplate[]|null;
    scheduledPushs:ScheduledPushInfo[]|undefined;

}
export interface UpdateFav{
    id: number
    idUser: number
}
const initialState: PushState={
    pushs:null,
    push:null,
    pushAI:null,
    savedPushedTemplates:null,
    scheduledPushs:undefined
}

export const pushSlice = createSlice({
    name:"push",
    initialState,
    reducers:{
        setPushs:(
            state, 
            action : PayloadAction<WebPushTemplate[]>
            )=>{
            state.pushs=action.payload;
        },
        setSavedPushs:(
          state, 
          action : PayloadAction<WebPushTemplate[]>
          )=>{
          state.savedPushedTemplates=action.payload;
      },
      setScheduledPushs:(
        state, 
        action : PayloadAction<ScheduledPushInfo[]>
        )=>{
        state.scheduledPushs=action.payload;
    },
    setDeleteScheduledPush(state, action: PayloadAction<string>) {
      if (state.scheduledPushs) {
        state.scheduledPushs = state.scheduledPushs.filter((push: ScheduledPushInfo) => push.jobId !== action.payload);
      }
    },
      setSelectedPush:(
        state, 
        action : PayloadAction<WebPushTemplate>
        )=>{
        state.push=action.payload;
    },
    setPushById: (state, action: PayloadAction<number>) => {
      if (state.pushs) {
          state.pushAI = state.pushs.find((email: WebPushTemplate) => email.id === action.payload) || null;
      } else {
          state.pushAI = null;
      }
  },
        setPush(state, action: PayloadAction<WebPushTemplate>) {
            if (state.pushs) {
              state.pushs.push(action.payload);
            }
          },
        setUpdatePushFav(state, action: PayloadAction<UpdateFav>) {
            if (state.pushs) {
              const index = state.pushs.findIndex((push: WebPushTemplate) => push.id === action.payload.id);
              if (index !== -1) {
                const userIdx = state.pushs[index].userFavoritePush.indexOf(action.payload.idUser);
                if (userIdx !== -1) {
                  state.pushs[index].userFavoritePush.splice(userIdx, 1);
                } else {
                  state.pushs[index].userFavoritePush.push(action.payload.idUser);
                }
              }
            }
          }         
          ,
          setUpdatePushFavList(state, action: PayloadAction<number|undefined>) {
            if (state.savedPushedTemplates) {
              state.savedPushedTemplates = state.savedPushedTemplates.filter(push => push.id !== action.payload)
            }
          } ,
        setUpdatePush(state, action: PayloadAction<WebPushTemplate>) {
            if (state.pushs) {
              const index = state.pushs.findIndex((push: WebPushTemplate) => push.id === action.payload.id);
              if (index !== -1) {
                 state.pushs[index]=action.payload
              }
            }
          } ,
          setDeletePush(state, action: PayloadAction<number>) {
            if (state.pushs) {
              state.pushs = state.pushs.filter((push: WebPushTemplate) => push.id !== action.payload);
            }
          }
          
          
    } ,
    extraReducers: (builder) => {
        builder.addCase(getTemplatesPush.fulfilled, (state, action) => {
          state.pushs = action.payload;         
        });
        builder.addCase(getTemplatesPush.rejected, (state) => {
          state.pushs = null;
        });
      },
})


export const selectPushsInfo = (state:RootState)=>state.push;
export const selectPushs = (state: RootState) => state.push.pushs;
export const selectPush = (state: RootState) => state.push.push;
export const selectSavedPushs = (state: RootState) => state.push.savedPushedTemplates;
export const selectScheduledPushs = (state: RootState) => state.push.scheduledPushs;
export const {setUpdatePushFavList,setSelectedPush,setPushs,setUpdatePushFav,setPushById,setDeleteScheduledPush,setScheduledPushs,
  setDeletePush,setUpdatePush,setPush,setSavedPushs} = pushSlice.actions

export default pushSlice.reducer;