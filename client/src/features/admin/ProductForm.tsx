import { FieldValues, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Box, Button, Grid2, Paper, Typography } from "@mui/material"
import { createProductSchema, CreateProductSchema } from "../../app/lib/schemas/createProductSchema"
import AppTextInput from "../../app/shared/components/AppTextInput"
import { useFetchFiltersQuery } from "../catalog/catalogApi"
import AppSelectInput from "../../app/shared/components/AppSelectInput"
import AppDropZone from "../../app/shared/components/AppDropZone"
import { Product } from "../../app/models/product"
import { useEffect } from "react"
import { useCreateProductMutation, useUpdateProductMutation } from "./adminApi"
import { handleApiError } from "../../app/lib/util"

type Props = {
    setEditMode: (value: boolean) => void;
    product: Product | null;
    refetch: () => void;
    setSelectedProduct: (value: Product) => void;
}

export default function ProductForm({setEditMode, product, refetch, setSelectedProduct}: Props) {
    const {control, handleSubmit, watch, reset, formState: {isSubmitting}, setError} = useForm<CreateProductSchema>({
        mode: 'onTouched',
        resolver: zodResolver(createProductSchema)
    })
    const [createProduct] = useCreateProductMutation();
    const [updateProduct] = useUpdateProductMutation();
    const watchFile = watch('file')

    useEffect(() => {
        if(product) reset(product);
        
        return () => {
            if(watchFile) URL.revokeObjectURL(watchFile.preview)
        }
    },[product, reset, watchFile])

    const createFormData = (items: FieldValues) => {
        const formData = new FormData();
        for(const key in items){
            formData.append(key, items[key])
        }

        return formData;
    }

    const onSubmit = async (data: CreateProductSchema) => {
        try {
            const formData = createFormData(data);

            if(watchFile) formData.append('file', watchFile);

            if(product) await updateProduct({id: product.id, data: formData}).unwrap();
            else await createProduct(formData).unwrap();
            setEditMode(false);
            setSelectedProduct(null);
            refetch();
        } catch (error) {
            console.log(error);
            handleApiError<CreateProductSchema>(error, setError, 
                ['brand','description','file','name','pictureUrl','price','quantityInStock','type']);
        }
    }

    const {data} = useFetchFiltersQuery();
      
    return (
        <Box component={Paper} sx={{p: 4, maxWidth: 'lg', mx: 'auto'}}>
            <Typography variant="h4" sx={{mb: 4}}>Product Details</Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid2 container spacing={3}>
                    <Grid2 size={12}>
                        <AppTextInput control={control} name="name" label='Product name' />
                    </Grid2>
                    <Grid2 size={6}>
                        {data?.brands && 
                        <AppSelectInput items={data.brands} control={control} name="brand" label='Brand' />}
                    </Grid2>
                    <Grid2 size={6}>
                    {data?.types && 
                        <AppSelectInput items={data.types} control={control} name="type" label='Type' />}
                    </Grid2>
                    <Grid2 size={6}>
                        <AppTextInput type="number" control={control} name="price" label='Price in cents' />
                    </Grid2>
                    <Grid2 size={6}>
                        <AppTextInput type="number" control={control} name="quantityInStock" label='Quantity in stock' />
                    </Grid2>
                    <Grid2 size={12}>
                        <AppTextInput 
                            control={control} 
                            name="description" 
                            label='Description' 
                            multiline
                            rows={4}
                        />
                    </Grid2>
                    <Grid2 size={12} display='flex' justifyContent='space-between' alignItems='center'>
                        <AppDropZone name="file" control={control} />
                        {watchFile?.preview ? (
                            <img src={watchFile.preview} 
                                alt='preview of image' 
                                style={{maxHeight: 200}}
                            />
                        ): product?.pictureUrl ? (
                            <img src={product?.pictureUrl} 
                            alt='preview of image' 
                            style={{maxHeight: 200}}
                            />
                        ) : null}
                    </Grid2>
                </Grid2>
                <Box display='flex' justifyContent='space-between' sx={{mt: 3}}>
                    <Button variant='contained' color='inherit' onClick={() => setEditMode(false)}>Cancel</Button>
                    <Button variant='contained' color='success' type='submit' loading={isSubmitting}>Submit</Button>
                </Box>
            </form>
        </Box>
    )
}