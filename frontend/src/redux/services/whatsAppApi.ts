import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { WhatsAppTemplatePayload } from "../../models/sms/WhatsAppTemplatePayload";
import { SendWhatsAppMsg } from "../../models/sms/SendWhatsAppMsg";

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
                url: `/${id}`,
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
        sendWhatsapp : builder.mutation({
            query:(body:SendWhatsAppMsg)=>{
                return{
                    url:"/sendWhatsAppSms",
                    method:"POST",
                    body,
                };
            }
        }),

    }),
 
})

export const {useSendWhatsappMutation,useAddTemplateWhatsappMutation,useDeleteWhatsappTemplateMutation,useGetAllWhatsappTemplatesMutation,useGetWhatsappTemplateByIdMutation}=whatsAppApi;