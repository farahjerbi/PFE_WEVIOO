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
                    url:"/addTemplate",
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
        
        // getSMSTemplateById: builder.mutation({
        //     query: ( id ) => ({
        //         url: `/getById/${id}`,
        //         method: "GET",
        //     }),
        // }),

        // deleteSMSTemplate: builder.mutation({
        //     query: ( id: number ) => ({
        //         url: `/deleteTemplate/${id}`,
        //         method: "DELETE",
        //     }),
        // }),

        // getScheduledEmails: builder.mutation({
        //     query:  () => ({
        //         url: `/getScheduledEmails`,
        //         method: "GET",
        //     }),
        // }),
        
        // getScheduledEmailsByUser: builder.mutation({
        //     query:  (id:number) => ({
        //         url: `/getScheduledEmailsByUser/${id}`,
        //         method: "GET",
        //     }),
        // }),
        // updateTemplate: builder.mutation({
        //     query: ({ emailTemplate, jsonObject, id }) => ({
        //         url: `/updateTemplate/${id}`,
        //         method: "POST",
        //         body: {
        //             emailTemplate,
        //             jsonObject
        //         },
        //     }),
        // }),
        // deleteScheduledEmail: builder.mutation({
        //     query: ( id: string ) => ({
        //         url: `/deleteScheduledEmail/${id}`,
        //         method: "DELETE",
        //     }),
        // }),
        // toggleFavoriteEmail: builder.mutation({
        //     query: ( {idTemplate,idUser}) => ({
        //         url: `/toggleFavoriteEmail/${idTemplate}/${idUser}`,
        //         method: "PUT",
        //     }),
        // }),
        // getSavedTemplatesEamil: builder.mutation({
        //     query: ( id ) => ({
        //         url: `/likedByUser/${id}`,
        //         method: "GET",
        //     }),
        // }),
    }),
    
 
})