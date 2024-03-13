import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { EmailTemplate } from "../../models/EmailTemplate";

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:8088/api/users"
    }),
    endpoints:(builder)=>({
        activateUser : builder.mutation({
            query:(email:string)=>{
                return{
                    url:`/enableUser/${email}`,
                    method:"PUT",
                };
            }
        }),

        getAllUsers : builder.mutation({
            query:()=>{
                return{
                    url:"/getAllUsers",
                    method:"GET"
                 };
            }
        }),

        desActivateUser : builder.mutation({
            query:(email:string)=>{
                return{
                    url:`/deactivateUser/${email}`,
                    method:"PUT",
                };
            }
        }),

        deleteUser : builder.mutation({
            query:(id:number)=>{
                return{
                    url:`/deleteProfile/${id}`,
                    method:"DELETE",
                };
            }
        }),

    })
})

export const {useGetAllUsersMutation ,useActivateUserMutation,useDesActivateUserMutation,useDeleteUserMutation}=usersApi;