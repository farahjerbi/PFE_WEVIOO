import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { UpdatedUser } from "../../models/user/UpdatedUser";

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:8099/api/users"
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
        changePassword : builder.mutation({
            query:(body:{oldPassword:string,newPassword:string,confirmNewPassword:string,email:string})=>{
                return{
                    url:`/changePassword`,
                    method:"POST",
                    body
                };
            }
        }),
        resetPassword : builder.mutation({
            query:(body:{newPassword:string,confirmNewPassword:string,email:string})=>{
                return{
                    url:`/forgotPassword`,
                    method:"POST",
                    body
                };
            }
        }),

    })
})

export const {useGetAllUsersMutation ,useResetPasswordMutation,
    useActivateUserMutation,useDesActivateUserMutation,useDeleteUserMutation,useChangePasswordMutation}=usersApi;