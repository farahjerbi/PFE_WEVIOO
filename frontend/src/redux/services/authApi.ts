import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery:fetchBaseQuery({
        baseUrl:"http://localhost:8099/api/auth"
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
        verifyToken: builder.mutation({
            query: (body: { token:any }) => ({
                url: "/verifyToken",
                method: "POST",
                body:body.token,
            })
        }),
        verifyEmail: builder.mutation({
            query: (body: { email:string }) => ({
                url: "/verifyEmail",
                method: "POST",
                body:body.email,
            })
        }),
        forgotPassword: builder.mutation({
            query: (body: { email:string }) => ({
                url: "/sendEmailForgotPassword",
                method: "POST",
                body:body.email,
            })
        }),
    })
})

export const {useRegisterUserMutation , useLoginUserMutation, useVerifyOTPMutation,
    useVerifyTokenMutation,useVerifyEmailMutation ,useForgotPasswordMutation}=authApi;