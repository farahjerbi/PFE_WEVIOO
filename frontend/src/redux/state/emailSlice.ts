import {createAsyncThunk, createSlice , PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../store"
import { EmailTemplate } from "../../models/email/EmailTemplate";
import axios from "axios";

export const getTemplatesEmail = createAsyncThunk<any| null, void>(
    "email/getTemplatesEmail",
    async (_, { rejectWithValue }) => {
      let token = localStorage.getItem("token");
      console.log("🚀 ~ token:", token)
      if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.substring(1, token.length - 1);
    }
      if (token) {
            try {
                const response = await axios.get<any>(
                    `http://localhost:8099/apiEmail/getAll`,
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

export interface EmailState{
    emails: any| null;
    email: EmailTemplate | null;
    savedEmailTemplates:EmailTemplate[]|null;
}
export interface UpdateFav{
    id: number|undefined;
    idUser: number|undefined;
}
const initialState: EmailState={
    emails:null,
    email:null,
    savedEmailTemplates:null
}

export const emailSlice = createSlice({
    name:"email",
    initialState,
    reducers:{
        setEmails:(
            state, 
            action : PayloadAction<EmailState>
            )=>{
            state.emails=action.payload.emails;
        },
        setSavedEmails:(
          state, 
          action : PayloadAction<EmailTemplate[]>
          )=>{
          state.savedEmailTemplates=action.payload;
      },
      setSelectedEmail:(
        state, 
        action : PayloadAction<EmailTemplate>
        )=>{
        state.email=action.payload;
    },
        setEmail(state, action: PayloadAction<EmailTemplate>) {
            if (state.emails) {
              state.emails.push(action.payload);
            }
          },
        setUpdateEmailFav(state, action: PayloadAction<UpdateFav>) {
            if (state.emails) {
              const index = state.emails.findIndex((email: EmailTemplate) => email.id === action.payload.id);
              if (index !== -1) {
                const userIdx = state.emails[index].userFavoriteEmails.indexOf(action.payload.idUser);
                if (userIdx !== -1) {
                  state.emails[index].userFavoriteEmails.splice(userIdx, 1);
                } else {
                  state.emails[index].userFavoriteEmails.push(action.payload.idUser);
                }
              }
            }
          }         
          ,
          setUpdateEmailFavList(state, action: PayloadAction<number|undefined>) {
            if (state.savedEmailTemplates) {
              state.savedEmailTemplates = state.savedEmailTemplates.filter(email => email.id !== action.payload)
            }
          } ,
        setUpdateEmail(state, action: PayloadAction<EmailTemplate>) {
            if (state.emails) {
              const index = state.emails.findIndex((email: EmailTemplate) => email.id === action.payload.id);
              if (index !== -1) {
                 state.emails[index]=action.payload
              }
            }
          } ,
          setDeleteEmail(state, action: PayloadAction<number>) {
            if (state.emails) {
              state.emails = state.emails.filter((email: EmailTemplate) => email.id !== action.payload);
            }
          }
          
          
    } ,
    extraReducers: (builder) => {
        builder.addCase(getTemplatesEmail.fulfilled, (state, action) => {
          state.emails = action.payload;         
        });
        builder.addCase(getTemplatesEmail.rejected, (state) => {
          state.emails = null;
        });
      },
})


export const selectEmailsInfo = (state:RootState)=>state.email;
export const selectEmails = (state: RootState) => state.email.emails;
export const selectEmail = (state: RootState) => state.email.email;
export const selectSavedEmails = (state: RootState) => state.email.savedEmailTemplates;
export const {setUpdateEmailFavList,setSelectedEmail,setEmails,setUpdateEmailFav,setDeleteEmail,setUpdateEmail,setEmail,setSavedEmails} = emailSlice.actions

export default emailSlice.reducer;