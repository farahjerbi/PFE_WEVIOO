import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { WebPushSubscription } from "../../models/push/WebPushSubscription";
import { SendPushIndiv } from "../../models/push/SendPush";
import { WebPushExcelProcessor } from "../../models/push/WebPushExcelProcessor";

export const pushApi = createApi({
    reducerPath: 'pushApi',
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:8099/apiPush",
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
            query: ( id: any ) => ({
                url: `/getById/${id}`,
                method: "GET",
            }),
        }),
        deleteScheduledPush: builder.mutation({
            query: ( id: string ) => ({
                url: `/deleteScheduledWhatsapp/${id}`,
                method: "DELETE",
            }),
    }),
    getScheduledPushsByUser: builder.mutation({
        query:  (id:number) => ({
            url: `/getScheduledPushesByUser/${id}`,
            method: "GET",
        }),
    }),
    toggleFavoritePush: builder.mutation({
        query: ( {idTemplate,idUser}) => ({
            url: `/toggleFavoritePush/${idTemplate}/${idUser}`,
            method: "PUT",
        }),
    }),
    getSavedTemplatesPush: builder.mutation({
        query: ( id ) => ({
            url: `/likedByUser/${id}`,
            method: "GET",
        }),
    }),
    sendPushSeprartely : builder.mutation({
        query:(body:WebPushExcelProcessor)=>{
            return{
                url:"/notifySeparately",
                method:"POST",
                body,
            };
        }
    }),
    processPushExcel: builder.mutation({
        query: (formData: FormData) => ({
            url: "/process",
            method: "POST",
            body: formData,
        }),
    }),
    
}),
})

export const {useGetPushByIdMutation,useSubscribeMutation,useDeletePushTemplateMutation, useDeleteScheduledPushMutation
    ,useGetScheduledPushsByUserMutation,useToggleFavoritePushMutation,useGetSavedTemplatesPushMutation,useSendPushSeprartelyMutation,
    useProcessPushExcelMutation
}=pushApi;