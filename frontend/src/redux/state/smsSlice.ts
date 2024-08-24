import {createAsyncThunk, createSlice , PayloadAction} from "@reduxjs/toolkit"
import {RootState} from "../store"
import axios from "axios";
import { WhatsAppTemplateResponse } from "../../models/sms/WhatsAppTemplateResponse";
import { SmsTemplate } from "../../models/sms/SmsTemplate";
import { ScheduledSMSResponse } from "../../models/sms/ScheduledSMSResponse";

export const getTemplatesSms = createAsyncThunk<any| null, void>(
    "sms/getTemplatesSms",
    async (_, { rejectWithValue }) => {
      let token = localStorage.getItem("token");
      console.log("🚀 ~ token:", token)
      if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.substring(1, token.length - 1);
    }
    if (token) {
            try {
                const response = await axios.get<any>(
                    `http://localhost:8099/apiSms/getAllTemplates`,
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
      return null
      }
);

export const getTemplatesWhatsapp = createAsyncThunk<any| null, void>(
    "sms/getTemplatesWhatsapp",
    async (_, { rejectWithValue }) => {
      let token = localStorage.getItem("token");
      console.log("🚀 ~ token:", token)
      if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.substring(1, token.length - 1);
    }
    if (token) {
            try {
                const response = await axios.get<any>(
                    `http://localhost:8099/apiWhatsApp/getAll`,
                    {
                      headers: {
                        Authorization: `Bearer ${token}`,
                      },}
                );
                const textTemplates = response.data.templates.filter((template:any )=> template.structure.type === "TEXT");
                console.log("🚀 ~ response.data:", textTemplates)
                return  textTemplates;
              } catch (error) {
                console.error("Error decoding token:", error);
                return rejectWithValue(null);
            }
        }
        return null
      }
);


export interface SMSState{
    smsTemplates: SmsTemplate[] | null;
    whatsappTemplates: WhatsAppTemplateResponse[] | null;
    savedSmsTemplates:SmsTemplate[]|null;
    currentTemplate: SmsTemplate | null;
    smsAI: SmsTemplate | null;
    currentWhatsappTemplate:WhatsAppTemplateResponse|null;
    scheduledSMSs:ScheduledSMSResponse[]|undefined;
    scheduledWhatsapps:ScheduledSMSResponse[]|undefined;

}
export interface UpdateFav{
    id: number;
    idUser: number;
}
const initialState: SMSState={
    smsTemplates:null,
    whatsappTemplates:null,
    savedSmsTemplates:null,
    currentTemplate:null,
    smsAI:null,
    currentWhatsappTemplate:null,
    scheduledSMSs:undefined,
    scheduledWhatsapps:undefined
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
      setScheduledSMSs:(
        state, 
        action : PayloadAction<ScheduledSMSResponse[]>
        )=>{
        state.scheduledSMSs=action.payload;
    },
    setDeleteScheduledSms(state, action: PayloadAction<string>) {
      if (state.scheduledSMSs) {
        state.scheduledSMSs = state.scheduledSMSs.filter((sms: ScheduledSMSResponse) => sms.jobId !== action.payload);
      }
    },
      setScheduledWhatapps:(
        state, 
        action : PayloadAction<ScheduledSMSResponse[]>
        )=>{
        state.scheduledWhatsapps=action.payload;
    },
    setDeleteScheduledWhatsapp(state, action: PayloadAction<string>) {
      if (state.scheduledWhatsapps) {
        state.scheduledWhatsapps = state.scheduledWhatsapps.filter((sms: ScheduledSMSResponse) => sms.jobId !== action.payload);
      }
    },
      setSelectedSms:(
        state, 
        action : PayloadAction<SmsTemplate >
        )=>{
        state.currentTemplate=action.payload;
    },
    setSMSById: (state, action: PayloadAction<number>) => {
      if (state.smsTemplates) {
          state.smsAI = state.smsTemplates.find((email: SmsTemplate) => email.id === action.payload) || null;
      } else {
          state.smsAI = null;
      }
  },
    
      setCurrentWhatsappTemplate:(
        state, 
        action : PayloadAction<WhatsAppTemplateResponse >
        )=>{
        state.currentWhatsappTemplate=action.payload;
    },
        setAddSMS(state, action: PayloadAction<SmsTemplate>) {
            if (state.smsTemplates) {
              state.smsTemplates.push(action.payload);
            }
          },
          setAddWhatsapp(state, action: PayloadAction<WhatsAppTemplateResponse>) {
            if (state.whatsappTemplates) {
              state.whatsappTemplates.push(action.payload);
            }
          },
          setUpdateSMSFav(state, action: PayloadAction<UpdateFav>) {
            if (state.smsTemplates) {
                const index = state.smsTemplates.findIndex((sms: SmsTemplate) => sms.id === action.payload.id);
                if (index !== -1) {
                    const userFavoriteSms = state.smsTemplates[index].userFavoriteSms;
                    if (userFavoriteSms) {
                        const userIdx = userFavoriteSms.indexOf(action.payload.idUser);
                        if (userIdx !== -1) {
                            const updatedUserFavoriteSms = userFavoriteSms.filter(id => id !== action.payload.idUser);
                            state.smsTemplates[index].userFavoriteSms = updatedUserFavoriteSms;
                        } else {
                            if (!state.smsTemplates[index].userFavoriteSms) {
                                state.smsTemplates[index].userFavoriteSms = [];
                            }
                            state.smsTemplates[index].userFavoriteSms!.push(action.payload.idUser);
                        }
                    } else {
                        state.smsTemplates[index].userFavoriteSms = [action.payload.idUser];
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
          setDeleteWhatsapp(state, action: PayloadAction<string>) {
            if (state.whatsappTemplates) {
              state.whatsappTemplates = state.whatsappTemplates.filter((sms: WhatsAppTemplateResponse) => sms.name !== action.payload);
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
export const selectScheduledSMSs = (state: RootState) => state.sms.scheduledSMSs;
export const selectScheduledWhatsapps = (state: RootState) => state.sms.scheduledWhatsapps;
export const selectCurrentWhatsappTemplate = (state: RootState) => state.sms.currentWhatsappTemplate;
export const {setCurrentWhatsappTemplate,setUpdateSMSFav,setAddSMS, setDeleteSms,setDeleteWhatsapp,setSMSById,
  setScheduledSMSs,setDeleteScheduledSms,setDeleteScheduledWhatsapp,setScheduledWhatapps,
  setSMSs,setSavedSMSs,setSelectedSms,setUpdateSMS,setUpdateSmsFavList,setWhatsapps} = smsSlice.actions

export default smsSlice.reducer;