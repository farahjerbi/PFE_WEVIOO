import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { WebPushSubscription } from "../../models/push/WebPushSubscription";

export const pushApi = createApi({
    reducerPath: 'pushApi',
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:8093/apiPush"
    }),
    endpoints:(builder)=>({
        subscribe : builder.mutation({
            query:(body:WebPushSubscription)=>{
                return{
                    url:"/subscribe",
                    method:"POST",
                    body,
                };
            }
        }),
        getALLPushTemplates : builder.mutation({
            query:()=>{
                return{
                    url:"/getAll",
                    method:"GET",
                };
            }
        }),
        deletePushTemplate: builder.mutation({
            query: ( id: number ) => ({
                url: `/deleteTemplate/${id}`,
                method: "DELETE",
            }),
        }),
        getPushById: builder.mutation({
            query: ( id: number ) => ({
                url: `/getById/${id}`,
                method: "GET",
            }),
        }),


    }),
    
 
})

export const {useGetPushByIdMutation,useSubscribeMutation,useDeletePushTemplateMutation}=pushApi;