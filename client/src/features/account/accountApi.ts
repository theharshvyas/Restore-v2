import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandeling } from "../../app/api/baseApi";
import { User } from "../../app/models/user";
import { LoginSchema } from "../../app/lib/schemas/loginSchema";
import { router } from "../../app/routes/Routes";
import { toast } from "react-toastify";

export const accountApi = createApi({
    reducerPath: 'accountApi',
    baseQuery: baseQueryWithErrorHandeling,
    tagTypes:['UserInfo'],
    endpoints: (builder) => ({
        login: builder.mutation<void, LoginSchema>({
            query: (creds) => {
                return {
                    url: 'login?useCookies=true',
                    method: 'POST',
                    body: creds
                }
            },
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                try {
                    await queryFulfilled;
                    dispatch(accountApi.util.invalidateTags(['UserInfo']))
                } catch (error) {
                    console.log(error);
                }
            },
            //invalidatesTags: ['UserInfo']
        }),
        register: builder.mutation<void, object>({
            query: (creds) => {
                return {
                    url: 'account/register',
                    method: 'POST',
                    body: creds
                }
            },
            async onQueryStarted(_, {queryFulfilled}) {
                try {
                    await queryFulfilled;
                    toast.success('Registration successful - you can now sign in!')
                    router.navigate('/login');
                } catch (error) {
                    console.log(error);
                    throw error;
                }
                
            },
            //invalidatesTags: ['UserInfo']
        }),
        userInfo: builder.query<User, void>({
            query: () => {
                return {
                    url: 'account/user-info'
                }
            },
            providesTags: ['UserInfo']
        }),
        logout: builder.mutation({
            query: () => ({
                url: 'account/logout',
                method: 'POST'
            }),
            async onQueryStarted(_, {dispatch, queryFulfilled}) {
                await queryFulfilled;
                dispatch(accountApi.util.invalidateTags(['UserInfo']));
                router.navigate('/');
            },
            //invalidatesTags: ['UserInfo']
        })
    })
})

export const {useLoginMutation, useRegisterMutation, useUserInfoQuery, useLazyUserInfoQuery, useLogoutMutation} = accountApi;