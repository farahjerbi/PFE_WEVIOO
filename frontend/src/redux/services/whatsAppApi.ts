import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { WhatsAppTemplatePayload } from "../../models/sms/WhatsAppTemplatePayload";
import { SendIndivWhatsapp, SendWhatsAppMsg } from "../../models/sms/SendWhatsAppMsg";

export const whatsAppApi = createApi({
  reducerPath: 'whatsAppApi',
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:8099/apiWhatsApp",
    prepareHeaders: (headers) => {
      let token = localStorage.getItem('token');
      console.log("Token from localStorage:", token);
      if (token && token.startsWith('"') && token.endsWith('"')) {
        token = token.substring(1, token.length - 1);
      }
      if (token) {
        headers.set('Authorization', `Bearer ${token}`);
      }
      return headers;
    }
  }),
  endpoints: (builder) => ({
    addTemplateWhatsapp: builder.mutation({
      query: (body: WhatsAppTemplatePayload) => ({
        url: "/addWhatsAppTemplate",
        method: "POST",
        body,
      })
    }),
    getAllWhatsappTemplates: builder.mutation({
      query: () => ({
        url: "/getAll",
        method: "GET"
      })
    }),
    getWhatsappTemplateById: builder.mutation({
      query: (id) => ({
        url: `/${id}`,
        method: "GET",
      })
    }),
    deleteWhatsappTemplate: builder.mutation({
      query: (id: string) => ({
        url: `/delete/${id}`,
        method: "DELETE",
      })
    }),
    updateTemplateWhatsapp: builder.mutation({
      query: ({ smsTemplate, id }) => ({
        url: `/updateSmsTemplate/${id}`,
        method: "PUT",
        body: {
          smsTemplate
        },
      })
    }),
    sendWhatsapp: builder.mutation({
      query: (body: SendWhatsAppMsg) => ({
        url: "/sendWhatsAppSms",
        method: "POST",
        body,
      })
    }),
    getScheduledWhatsapp: builder.mutation({
      query: (id) => ({
        url: `/getScheduledWhatsappByUser/${id}`,
        method: "GET",
      })
    }),
    deleteScheduledWhatsapp: builder.mutation({
      query: (id: string) => ({
        url: `/deleteScheduledWhatsapp/${id}`,
        method: "DELETE",
      })
    }),
    sendSMSWhatsAppSeparately: builder.mutation({
      query: (body: SendIndivWhatsapp) => ({
        url: "/sendSMSWhatsAppSeparately",
        method: "POST",
        body,
      })
    }),
  })
});

export const {
  useSendWhatsappMutation,
  useAddTemplateWhatsappMutation,
  useDeleteWhatsappTemplateMutation,
  useGetAllWhatsappTemplatesMutation,
  useSendSMSWhatsAppSeparatelyMutation,
  useGetWhatsappTemplateByIdMutation,
  useGetScheduledWhatsappMutation,
  useDeleteScheduledWhatsappMutation
} = whatsAppApi;
