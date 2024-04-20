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

    }),
 
})

export const {useGetSavedTemplatesSMSMutation,useToggleFavoriteSMSMutation,useUpdateSMSTemplateMutation,useAddTemplateSMSMutation,useDeleteSMSTemplateMutation,useGetAllSMSTemplatesMutation,useGetSMSTemplateByIdMutation}=smsApi;