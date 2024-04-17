import {createAsyncThunk, createSlice , PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../store"
import axios from "axios";
import { WhatsAppTemplateResponse } from "../../models/sms/WhatsAppTemplateResponse";
import { SmsTemplate } from "../../models/sms/SmsTemplate";

export const getTemplatesSms = createAsyncThunk<any| null, void>(
    "sms/getTemplatesSms",
    async (_, { rejectWithValue }) => {
            try {
                const response = await axios.get<any>(
                    `http://localhost:8099/apiSms/getAllTemplates`
                );
                console.log("🚀 ~ response.data:", response.data)
                return response.data;
            } catch (error) {
                console.error("Error decoding token:", error);
                return rejectWithValue(null);
            }
        }
);

export const getTemplatesWhatsapp = createAsyncThunk<any| null, void>(
    "sms/getTemplatesWhatsapp",
    async (_, { rejectWithValue }) => {
            try {
                const response = await axios.get<any>(
                    `http://localhost:8099/apiWhatsApp`
                );
                console.log("🚀 ~ response.data:", response.data)
                return response.data;
            } catch (error) {
                console.error("Error decoding token:", error);
                return rejectWithValue(null);
            }
        }
);


export interface SMSState{
    smsTemplates: SmsTemplate[] | null;
    whatsappTemplates: WhatsAppTemplateResponse[] | null;
    savedSmsTemplates:SmsTemplate[]|null;
    currentTemplate:WhatsAppTemplateResponse | SmsTemplate  |null;
}
export interface UpdateFav{
    id: number;
    idUser: number;
}
const initialState: SMSState={
    smsTemplates:null,
    whatsappTemplates:null,
    savedSmsTemplates:null,
    currentTemplate:null
}

export const smsSlice = createSlice({
    name:"sms",
    initialState,
    reducers:{
        setSMSs:(
            state, 
            action : PayloadAction<SmsTemplate[]>
            )=>{
            state.smsTemplates=action.payload;
        },
        setWhatsapps:(
            state, 
            action : PayloadAction<WhatsAppTemplateResponse[]>
            )=>{
            state.whatsappTemplates=action.payload;
        },
        setSavedSMSs:(
          state, 
          action : PayloadAction<SmsTemplate[]>
          )=>{
          state.savedSmsTemplates=action.payload;
      },
      setSelectedSms:(
        state, 
        action : PayloadAction<SmsTemplate | WhatsAppTemplateResponse>
        )=>{
        state.currentTemplate=action.payload;
    },
        addSMS(state, action: PayloadAction<SmsTemplate>) {
            if (state.smsTemplates && action.payload) {
              state.smsTemplates.push(action.payload);
            }
          },

        setUpdateSmsFav(state, action: PayloadAction<UpdateFav>) {
            if (state.smsTemplates) {
              const index = state.smsTemplates.findIndex((sms: SmsTemplate) => sms.id === action.payload.id);
              if (index !== -1 ) {
                const userIdx = state.smsTemplates[index].userFavoriteSms.indexOf(action.payload.idUser);
                if (userIdx !== -1) {
                  state.smsTemplates[index].userFavoriteSms.splice(userIdx, 1);
                } else {
                  state.smsTemplates[index].userFavoriteSms.push(action.payload.idUser);
                }
              }
            }
          }         
          ,
          setUpdateSmsFavList(state, action: PayloadAction<number|undefined>) {
            if (state.savedSmsTemplates) {
              state.savedSmsTemplates = state.savedSmsTemplates.filter(sms => sms.id !== action.payload)
            }
          } ,

        setUpdateSMS(state, action: PayloadAction<SmsTemplate>) {
            if (state.smsTemplates) {
              const index = state.smsTemplates.findIndex((sms: SmsTemplate) => sms.id === action.payload.id);
              if (index !== -1 ) {
                 state.smsTemplates[index]=action.payload
              }
            }
          } ,

          setDeleteSms(state, action: PayloadAction<number>) {
            if (state.smsTemplates) {
              state.smsTemplates = state.smsTemplates.filter((sms: SmsTemplate) => sms.id !== action.payload);
            }
          },
          setDeleteWhatsapp(state, action: PayloadAction<number>) {
            if (state.whatsappTemplates) {
              state.whatsappTemplates = state.whatsappTemplates.filter((sms: WhatsAppTemplateResponse) => sms.id !== action.payload);
            }
          }
          
          
    } ,
    extraReducers: (builder) => {
        builder.addCase(getTemplatesSms.fulfilled, (state, action) => {
          state.smsTemplates = action.payload;         
        });
        builder.addCase(getTemplatesSms.rejected, (state) => {
          state.smsTemplates = null;
        });
        builder.addCase(getTemplatesWhatsapp.fulfilled, (state, action) => {
            state.whatsappTemplates = action.payload;         
          });
          builder.addCase(getTemplatesWhatsapp.rejected, (state) => {
            state.whatsappTemplates = null;
          });
      },
})


export const selectSMSsInfo = (state:RootState)=>state.sms;
export const selectSMSs = (state: RootState) => state.sms.smsTemplates;
export const selectWhatsapp = (state: RootState) => state.sms.whatsappTemplates;
export const selectCurrentSms = (state: RootState) => state.sms.currentTemplate;
export const selectSavedSMSs = (state: RootState) => state.sms.savedSmsTemplates;
export const {setDeleteSms,setDeleteWhatsapp,setSMSs,setSavedSMSs,setSelectedSms,setUpdateSMS,setUpdateSmsFav,setUpdateSmsFavList,setWhatsapps} = smsSlice.actions

export default smsSlice.reducer;