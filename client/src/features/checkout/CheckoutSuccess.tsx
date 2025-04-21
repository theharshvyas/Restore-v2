import { Box, Button, Container, Divider, Paper, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import { Order } from "../../app/models/order";
import { currencyFormat, formatAddressString, formatPaymentString } from "../../app/lib/util";
import { format } from "date-fns";

export default function CheckoutSuccess() {
  const {state} = useLocation();
  
  if(!state) return <Typography>Problem accessing the order</Typography>

  const order = state.data as Order;

  if(!order) return <Typography>Problem accessing the order</Typography>

  return (
    <Container maxWidth='md'>
      <>
        <Typography gutterBottom variant="h4" fontWeight='bold'>
          Thank you for your fake order!
        </Typography>
        <Typography variant="body1" gutterBottom color='textSecondary'>
          Your order <strong>#{order.id}</strong> will never be processd as this is a fake shop.          
        </Typography>

        <Paper elevation={1} sx={{p:2, mb: 2, display:'flex', flexDirection: 'column', gap: 1}}>
          <Box display='flex' justifyContent='space-between'>
            <Typography variant="body2" color='textSecondary'>
              Order date
            </Typography>
            <Typography variant="body2" fontWeight='bold'>
            {format(order.orderDate, 'dd MMM yyyy')}
            </Typography>
          </Box>
          <Divider />
          <Box display='flex' justifyContent='space-between'>
            <Typography variant="body2" color='textSecondary'>
              Payment method
            </Typography>
            <Typography variant="body2" fontWeight='bold'>
              {formatPaymentString(order.paymentSummary)}
            </Typography>
          </Box>
          <Divider />
          <Box display='flex' justifyContent='space-between'>
            <Typography variant="body2" color='textSecondary'>
              Shipping address
            </Typography>
            <Typography variant="body2" fontWeight='bold'>
              {formatAddressString(order.shippingAddress)}
            </Typography>
          </Box>
          <Divider />
          <Box display='flex' justifyContent='space-between'>
            <Typography variant="body2" color='textSecondary'>
              Amount
            </Typography>
            <Typography variant="body2" fontWeight='bold'>
              {currencyFormat(order.total)}
            </Typography>
          </Box>          
        </Paper>

        <Box display='flex' justifyContent='flex-start' gap={2}>
          <Button variant="contained" color="primary" component={Link} to={`/orders/${order.id}`}>
            View your order
          </Button>
          <Button component={Link} to='/catalog' variant="outlined" color='primary'>
            Continue shopping
          </Button>
        </Box>
      </>
    </Container>
  )
}