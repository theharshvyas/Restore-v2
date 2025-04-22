import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandeling } from "../../app/api/baseApi";
import { CreateOrder, Order } from "../../app/models/order";

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: baseQueryWithErrorHandeling,
    tagTypes: ['orders'],
    endpoints: (builder) => ({
        fetchOrders: builder.query<Order[], void>({
            query: () => 'orders',
            providesTags: ['orders']
        }),
        fetchOrderDetails: builder.query<Order, number>({
            query: (id) => `orders/${id}`
        }),
        createOrder: builder.mutation<Order, CreateOrder>({
            query: (order) => ({
                url: 'orders',
                method: 'POST',
                body: order
            }),
            onQueryStarted: async (_, {dispatch, queryFulfilled}) => {
                await queryFulfilled;
                dispatch(orderApi.util.invalidateTags(['orders']));
            }
        })
    })
})

export const {useFetchOrdersQuery, useFetchOrderDetailsQuery, useCreateOrderMutation} = orderApi;