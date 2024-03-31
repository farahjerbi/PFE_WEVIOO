import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { EmailTemplate } from "../../models/EmailTemplate";

export const emailApi = createApi({
    reducerPath: 'emailApi',
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:8088/api/email"
    }),
    endpoints:(builder)=>({
        addTemplateEmail : builder.mutation({
            query:(body:EmailTemplate)=>{
                return{
                    url:"/addTemplate",
                    method:"POST",
                    body,
                };
            }
        }),

        getAllEmailTemplates : builder.mutation({
            query:()=>{
                return{
                    url:"/getAll",
                    method:"GET"
                 };
            }
        }),

        addDesignTemplate: builder.mutation({
            query: (data: { jsonObject: any; id: number }) => ({
                url: `/addDesignTemplate/${data.id}`,
                method: "POST",
                body: data.jsonObject,
            }),
        }),

        getDesignTemplate: builder.mutation({
            query: ( id: number ) => ({
                url: `/getDesignTemplate/${id}`,
                method: "GET",
            }),
        }),
        
        getTemplatePlaceholders: builder.mutation({
            query: ( id ) => ({
                url: `/getTemplatePlaceholders/${id}`,
                method: "GET",
            }),
        }),
        getTemplateById: builder.mutation({
            query: ( id ) => ({
                url: `/getById/${id}`,
                method: "GET",
            }),
        }),

        deleteTemplate: builder.mutation({
            query: ( id: number ) => ({
                url: `/deleteTemplate/${id}`,
                method: "DELETE",
            }),
        }),
        getScheduledEmails: builder.mutation({
            query:  () => ({
                url: `/getScheduledEmails`,
                method: "GET",
            }),
        }),
        getScheduledEmailsByUser: builder.mutation({
            query:  (id:number) => ({
                url: `/getScheduledEmailsByUser/${id}`,
                method: "GET",
            }),
        }),
        updateTemplate: builder.mutation({
            query: ({ emailTemplate, jsonObject, id }) => ({
                url: `/updateTemplate/${id}`,
                method: "POST",
                body: {
                    emailTemplate,
                    jsonObject
                },
            }),
        }),
        deleteScheduledEmail: builder.mutation({
            query: ( id: string ) => ({
                url: `/deleteScheduledEmail/${id}`,
                method: "DELETE",
            }),
        }),
    }),
 
})

export const {useAddTemplateEmailMutation,useGetAllEmailTemplatesMutation,useGetTemplatePlaceholdersMutation,
                useAddDesignTemplateMutation,useGetDesignTemplateMutation,useDeleteTemplateMutation,useGetTemplateByIdMutation,
                useGetScheduledEmailsMutation,useGetScheduledEmailsByUserMutation,useUpdateTemplateMutation,
                useDeleteScheduledEmailMutation
            }=emailApi;