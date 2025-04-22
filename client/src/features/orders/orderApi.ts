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
            query: (id) => `orders/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'orders', id }]
        }),
        createOrder: builder.mutation<Order, CreateOrder>({
            query: (order) => ({
                url: 'orders',
                method: 'POST',
                body: order
            }),
            onQueryStarted: async (_, { dispatch, queryFulfilled }) => {
                const { data: createdOrder } = await queryFulfilled;

                // Invalidate the order list and the new order detail
                dispatch(orderApi.util.invalidateTags([
                    'orders',
                    { type: 'orders', id: createdOrder.id }
                ]));
            }
        })
    })
})

export const { useFetchOrdersQuery, useFetchOrderDetailsQuery, useCreateOrderMutation } = orderApi;