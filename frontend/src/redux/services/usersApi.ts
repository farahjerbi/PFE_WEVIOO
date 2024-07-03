import {createApi , fetchBaseQuery} from "@reduxjs/toolkit/query/react"
import { IAddContact, IContact, UpdateContact } from "../../models/user/Contact";
import { IUpdateTeam, Team } from "../../models/user/Team";

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
        createMember : builder.mutation({
            query:(body:{contact:IAddContact,id:number|undefined})=>{
                return{
                    url:`/createMember/${body.id}`,
                    method:"POST",
                    body:body.contact
                };
            }
        }),
        createTeam : builder.mutation({
            query:(body:{team:Team,id:number|undefined})=>{
                return{
                    url:`/createTeam/${body.id}`,
                    method:"POST",
                    body:body.team
                };
            }
        }),
        updateMember : builder.mutation({
            query:(body:{contact:UpdateContact})=>{
                return{
                    url:`/updateMember`,
                    method:"POST",
                    body:body.contact
                };
            }
        }),
        deleteMember : builder.mutation({
            query:(id:number)=>{
                return{
                    url:`/deleteMember/${id}`,
                    method:"DELETE",
                };
            }
        }),
        deleteTeam : builder.mutation({
            query:(id:number)=>{
                return{
                    url:`/deleteTeam/${id}`,
                    method:"DELETE",
                };
            }
        }),
        updateTeam : builder.mutation({
            query:(body:{team:IUpdateTeam})=>{
                return{
                    url:`/updateTeam/${body.team?.id}`,
                    method:"PUT",
                    body:body.team
                };
            }
        }),
        addMembers : builder.mutation({
            query:(body:{contact:any[],id:number|undefined})=>{
                return{
                    url:`/${body.id}/members`,
                    method:"POST",
                    body:body.contact
                };
            }
        }),

    })
})

export const {useGetAllUsersMutation ,useResetPasswordMutation,useCreateMemberMutation,useCreateTeamMutation,
    useActivateUserMutation,useDesActivateUserMutation,useDeleteUserMutation,useChangePasswordMutation,
    useUpdateMemberMutation,useDeleteTeamMutation,useDeleteMemberMutation,useUpdateTeamMutation,useAddMembersMutation
}=usersApi;