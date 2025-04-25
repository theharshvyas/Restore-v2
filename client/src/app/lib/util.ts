import { FieldValues, Path, UseFormSetError } from "react-hook-form";
import { PaymentSummary, ShippingAddress } from "../models/order";

export function currencyFormat(amount: number) {
    return '$' + (amount / 100).toFixed(2)
}

export function filterEmptyValues(values: object) {
    return Object.fromEntries(
        Object.entries(values).filter(
            ([, value]) => value !== '' && value !== null
                && value !== undefined && value.length !== 0
        )
    )
}

export function formatAddressString(address: ShippingAddress) {

    return `${address?.name}, ${address?.line1}, ${address?.city}, 
            ${address?.state}, ${address?.postal_code}, ${address?.country}`;
}

export function formatPaymentString(card: PaymentSummary) {

    return `${card?.brand.toUpperCase()}, **** **** **** ${card?.last4}, 
            Exp: ${card?.exp_month}/${card?.exp_year}`;
}

export function handleApiError<T extends FieldValues>(
    error: unknown,
    setError: UseFormSetError<T>,
    fieldNames: Path<T>[]
){
    const apiError = (error as {message: string}) || {};
    if(apiError.message && typeof apiError.message === 'string'){
        const errorArray = apiError.message.split(',');

        errorArray.forEach(e => {
            const matchedField = fieldNames.find(fieldNames => 
                e.toLowerCase().includes(fieldNames.toString().toLowerCase()));

            if(matchedField) setError(matchedField, {message: e.trim()});
        })
    }
}