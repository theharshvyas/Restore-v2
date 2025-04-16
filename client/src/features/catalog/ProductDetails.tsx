import { useParams } from "react-router-dom"
import { Button, Divider, Grid2, Table, TableBody, TableCell, TableContainer, TableRow, TextField, Typography } from "@mui/material";
import { useFetchProductDetailsQuery } from "./catalogApi";
import { useAddBasketItemMutation, useFetchBasketQuery, useRemoveBasketItemMutation } from "../basket/basketApi";
import { ChangeEvent, useEffect, useState } from "react";

export default function ProductDetails() {
  const {id} = useParams();
  const {data: product, isLoading: loadingProduct} = useFetchProductDetailsQuery(id ? +id : 0);
  const {data: basket} = useFetchBasketQuery();
  const [addBasketItem] = useAddBasketItemMutation();
  const [removeBasketItem] = useRemoveBasketItemMutation();    
  const item = basket?.items.find(x => x.productId === +id!);
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    if(item) setQuantity(item.quantity);
  }, [item]);

  if(!product || loadingProduct) return <div>Loading...</div>

  const handleUpdateBasket = () => {
    const updatedQuantity = item ? Math.abs(quantity - item.quantity) : quantity;
    if(!item || quantity > item.quantity) {
      addBasketItem({product, quantity: updatedQuantity})
    }
    else{
      removeBasketItem({productId: product.id, quantity: updatedQuantity});
    }
  }

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const value = +event.currentTarget.value;
    if(value >= 0) setQuantity(value);
  }

  const productDetails = [
    {label: 'Name', value: product.name},
    {label: 'Description', value: product.description},
    {label: 'Type', value: product.type},
    {label: 'Brand', value: product.brand},
    {label: 'Quantity in stock', value: product.quantityInStock},
  ]

  return (
    <Grid2 container spacing={6} maxWidth='lg' sx={{mx: 'auto'}}>
      <Grid2 size={6}>
        <img src={product?.pictureUrl} alt="" style={{width: '100%'}} />
      </Grid2>
      <Grid2 size={6}>
        <Typography variant='h3' color="text.primary">{product.name}</Typography>
        <Divider sx={{mb: 2}} />
        <Typography variant='h4' color='secondary'>${(product.price / 100).toFixed(2)}</Typography>
        <TableContainer>
          <Table sx={{
            '& td': {fontSize: '1rem'}
          }}>
            <TableBody>              
                {productDetails.map((detail, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{fontWeight: 'bold'}}>{detail.label}</TableCell>
                    <TableCell>{detail.value}</TableCell>
                  </TableRow>
                ))}              
            </TableBody>
          </Table>
        </TableContainer>
        <Grid2 container spacing={2} marginTop={3}>
          <Grid2 size={6}>
            <TextField 
              variant='outlined'
              type='number'
              label='Quantity in basket'
              fullWidth                           
              value={quantity}
              onChange={handleInputChange}
              // onChange={(e) => {
              //   const value = Math.max(1, Number(e.target.value));
              //   setQuantity(value);
              // }}
              // onBlur={(e) => {
              //   if(Number(e.target.value) < 1){
              //     setQuantity(1);
              //   }
              // }}
            />
          </Grid2>
          <Grid2 size={6}>
            <Button
              sx={{
                height: '55px'
              }}
              color='primary'
              size='large'
              variant='contained'
              fullWidth
              onClick={handleUpdateBasket}
              disabled={quantity === item?.quantity || !item && quantity === 0}
            >
              {item ? 'Update quantity' : 'Add to basket'}
            </Button>
          </Grid2>
        </Grid2>
      </Grid2>
    </Grid2>
  )
}