import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { SmsTemplate } from "../../models/sms/SmsTemplate";

export const smsApi = createApi({
    reducerPath: 'smsApi',
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:8099/apiSms"
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
                    url:"/getAll",
                    method:"GET"
                 };
            }
        }),
        
        getSMSTemplateById: builder.mutation({
            query: ( id ) => ({
                url: `/getById/${id}`,
                method: "GET",
            }),
        }),

        deleteSMSTemplate: builder.mutation({
            query: ( id: number ) => ({
                url: `/deleteSmsTemplate/${id}`,
                method: "DELETE",
            }),
        }),


    
        updateTemplate: builder.mutation({
            query: ({ smsTemplate, id }) => ({
                url: `/updateSmsTemplate/${id}`,
                method: "PUT",
                body: {
                    smsTemplate
                },
            }),
        }),

    }),
 
})

export const {useAddTemplateSMSMutation,useDeleteSMSTemplateMutation,useGetAllSMSTemplatesMutation,useGetSMSTemplateByIdMutation}=smsApi;