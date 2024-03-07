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
    })
})

export const {useAddTemplateEmailMutation }=emailApi;