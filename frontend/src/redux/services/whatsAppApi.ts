import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { WhatsAppTemplatePayload } from "../../models/sms/WhatsAppTemplatePayload";

export const whatsAppApi = createApi({
    reducerPath: 'whatsAppApi',
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:8099/apiWhatsApp"
    }),
    endpoints:(builder)=>({
        addTemplateWhatsapp : builder.mutation({
            query:(body:WhatsAppTemplatePayload)=>{
                return{
                    url:"/addWhatsAppTemplate",
                    method:"POST",
                    body,
                };
            }
        }),

        getAllWhatsappTemplates : builder.mutation({
            query:()=>{
                return{
                    url:"/getAll",
                    method:"GET"
                 };
            }
        }),
        
        getWhatsappTemplateById: builder.mutation({
            query: ( id ) => ({
                url: `/getById/${id}`,
                method: "GET",
            }),
        }),

        deleteWhatsappTemplate: builder.mutation({
            query: ( id: string ) => ({
                url: `/delete/${id}`,
                method: "DELETE",
            }),
        }),


    
        updateTemplateWhatsapp: builder.mutation({
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

export const {useAddTemplateWhatsappMutation,useDeleteWhatsappTemplateMutation,useGetAllWhatsappTemplatesMutation,useGetWhatsappTemplateByIdMutation}=whatsAppApi;