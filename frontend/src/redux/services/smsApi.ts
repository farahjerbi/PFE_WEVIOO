import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { SmsTemplate } from "../../models/sms/SmsTemplate";
import { SendIndiv, SendsSms } from "../../models/sms/SendsSms";

export const smsApi = createApi({
    reducerPath: 'smsApi',
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:8099/apiSms",
        prepareHeaders: (headers) => {
            let token = localStorage.getItem('token');
            if (token && token.startsWith('"') && token.endsWith('"')) {
                token = token.substring(1, token.length - 1);
                headers.set('Authorization', `Bearer ${token}`);
            }
            
            return headers;
          }
    }),
    endpoints:(builder)=>({
        addTemplateSMS : builder.mutation({
            query:(body:SmsTemplate)=>{
                return{
                    url:"/addSmsTemplate",
                    method:"POST",
                    body,
                };
            }
        }),

        getAllSMSTemplates : builder.mutation({
            query:()=>{
                return{
                    url:"/getAllTemplates",
                    method:"GET"
                 };
            }
        }),
        
        getSMSTemplateById: builder.mutation({
            query: ( id ) => ({
                url: `/getSMSTemplateById/${id}`,
                method: "GET",
            }),
        }),

        deleteSMSTemplate: builder.mutation({
            query: ( id: number ) => ({
                url: `/deleteSmsTemplate/${id}`,
                method: "DELETE",
            }),
        }),

        updateSMSTemplate: builder.mutation({
            query: (body:{ smsTemplate:any, id:any }) => ({
                url: `/updateSmsTemplate/${body.id}`,
                method: "PUT",
                body: body.smsTemplate
            }),
        }),
        toggleFavoriteSMS: builder.mutation({
            query: ( {idTemplate,idUser}) => ({
                url: `/toggleFavoriteSMS/${idTemplate}/${idUser}`,
                method: "PUT",
            }),
        }),

        getSavedTemplatesSMS: builder.mutation({
            query: ( id ) => ({
                url: `/likedByUser/${id}`,
                method: "GET",
            }),
        }),
        sendSMS : builder.mutation({
            query:(body:SendsSms)=>{
                return{
                    url:"/sendSMS",
                    method:"POST",
                    body,
                };
            }
        }),
        getScheduledSMS: builder.mutation({
            query: ( id ) => ({
                url: `/getScheduledSMSsByUser/${id}`,
                method: "GET",
            }),
        }),
        deleteScheduledSMS: builder.mutation({
            query: ( id: string ) => ({
                url: `/deleteScheduledSMS/${id}`,
                method: "DELETE",
            }),
    }),
    sendSMSSeprartely : builder.mutation({
        query:(body:SendIndiv)=>{
            return{
                url:"/sendSMSSeparately",
                method:"POST",
                body,
            };
        }
    }),

    }),
 
})

export const {useSendSMSMutation,useGetSavedTemplatesSMSMutation,useToggleFavoriteSMSMutation,useUpdateSMSTemplateMutation,
    useAddTemplateSMSMutation,useDeleteSMSTemplateMutation,useGetAllSMSTemplatesMutation,useGetSMSTemplateByIdMutation,
    useGetScheduledSMSMutation,useDeleteScheduledSMSMutation,useSendSMSSeprartelyMutation
}=smsApi;