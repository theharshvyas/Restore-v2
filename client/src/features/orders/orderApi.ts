import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandeling } from "../../app/api/baseApi";
import { CreateOrder, Order } from "../../app/models/order";

export const orderApi = createApi({
    reducerPath: 'orderApi',
    baseQuery: baseQueryWithErrorHandeling,
    endpoints: (builder) => ({
        fetchOrders: builder.query<Order[], void>({
            query: () => 'orders'
        }),
        fetchOrderDetails: builder.query<Order, number>({
            query: (id) => `orders/${id}`
        }),
        createOrder: builder.mutation<Order, CreateOrder>({
            query: (order) => ({
                url: 'orders',
                method: 'POST',
                body: order
            })
        })
    })
})

export const {useFetchOrdersQuery, useFetchOrderDetailsQuery, useCreateOrderMutation} = orderApi;