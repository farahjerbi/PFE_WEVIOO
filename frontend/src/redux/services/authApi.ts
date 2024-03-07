import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:8088/api/auth"
    }),
    endpoints:(builder)=>({
        registerUser : builder.mutation({
            query:(body:{firstName:string,lastName:string,email:string,password:string,mfaEnabled:boolean})=>{
                return{
                    url:"/register",
                    method:"POST",
                    body,
                };
            }
        }),

        loginUser: builder.mutation({
            query: (body: { email: string, password: string }) => ({
                url: "/login",
                method: "POST",
                body,
            })
        }),

        verifyOTP: builder.mutation({
            query: (body: { email: string, password: string,code:string }) => ({
                url: "/verify",
                method: "POST",
                body,
            })
        }),
    })
})

export const {useRegisterUserMutation , useLoginUserMutation, useVerifyOTPMutation}=authApi;