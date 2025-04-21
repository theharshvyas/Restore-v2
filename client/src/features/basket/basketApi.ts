import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithErrorHandeling } from "../../app/api/baseApi";
import { Basket, Item } from "../../app/models/basket";
import { Product } from "../../app/models/product";
import Cookies from "js-cookie";

function isBaksetItem(product: Product | Item): product is Item{
    return (product as Item).quantity != undefined;
}

export const basketApi = createApi({
    reducerPath: 'basketApi',
    baseQuery: baseQueryWithErrorHandeling,
    tagTypes: ['Basket'],
    endpoints: (builder) => ({
        fetchBasket: builder.query<Basket, void>({
            query: () => 'basket',
            providesTags: ['Basket'],
        }),
        addBasketItem: builder.mutation<Basket, {product: Product | Item, quantity: number}>({
            query: ({product, quantity}) => {
                const productId = isBaksetItem(product) ? product.productId : product.id;
                return {
                    url: `basket?productId=${productId}&quantity=${quantity}`,
                    method: 'POST',
                }
            },
            onQueryStarted: async ({product, quantity}, {dispatch, queryFulfilled}) => {
                let isNewBasket = false;
                const patchResult = dispatch(
                    basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                        const productId = isBaksetItem(product) ? product.productId : product.id;

                        if(!draft?.baseketId) isNewBasket = true;

                        if(!isNewBasket){
                            const existingItem = draft.items.find(item => item.productId === productId);
                            if(existingItem) existingItem.quantity += quantity;
                            else draft.items.push(isBaksetItem(product) ? product : {...product, productId: product.id, quantity});
                        }
                    })
                )
                try {
                    await queryFulfilled;
                    if(isNewBasket) dispatch(basketApi.util.invalidateTags(['Basket']));
                } catch (error) {
                    console.log(error);
                    patchResult.undo();
                }
            },
            //invalidatesTags: ['Basket']
        }),
        removeBasketItem: builder.mutation<void, { productId: number, quantity: number }>({
            query: ({ productId, quantity }) => ({
                url: `basket?productId=${productId}&quantity=${quantity}`,
                method: 'DELETE'
            }),
            onQueryStarted: async ({productId, quantity}, {dispatch, queryFulfilled}) => {
                const patchResult = dispatch(
                    basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                        const itemIndex = draft.items.findIndex(item => item.productId === productId);
                        if(itemIndex >= 0){
                            draft.items[itemIndex].quantity -= quantity;
                            if(draft.items[itemIndex].quantity <= 0){
                                draft.items.splice(itemIndex, 1);
                            }
                        }
                    })
                )

                try {
                    await queryFulfilled;
                } catch (error) {
                    console.log(error);
                    patchResult.undo();
                }
            }
            //invalidatesTags: ['Basket'],
        }),
        clearBakset: builder.mutation<void, void>({
            queryFn: () => ({data: undefined}),
            onQueryStarted: async (_, {dispatch}) => {
                dispatch(
                    basketApi.util.updateQueryData('fetchBasket', undefined, (draft) => {
                        draft.items = [];
                        draft.baseketId = '';
                    })
                );
                Cookies.remove('basketId');
            }
        })
    })
})

export const {
    useFetchBasketQuery,
    useAddBasketItemMutation,
    useRemoveBasketItemMutation,
    useClearBaksetMutation
} = basketApi;