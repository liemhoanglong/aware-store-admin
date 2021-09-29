import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

import parseDay from '../../utils/parseDay';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function PopUpOrderDetail(props) {
  return (
    <Dialog
      open={props.open}
      TransitionComponent={Transition}
      keepMounted
      onClose={props.handleClose}
      aria-describedby="Pop-up-order-detail-dialog-slide-description"
      maxWidth='md'
      fullWidth={true}
      scroll={'paper'}
    >
      {props.orderDetail &&
        <>
          <DialogTitle>{props.orderDetail._id}</DialogTitle>
          <DialogContent>
            <h3>🧭 Delivery Details</h3>
            <DialogContentText>Order date: {parseDay(props.orderDetail.orderedDate)}</DialogContentText>
            <DialogContentText>Address: {props.orderDetail.address}</DialogContentText>
            <DialogContentText>Phone number: {props.orderDetail.phone}</DialogContentText>
            <DialogContentText>Note: {props.orderDetail.note}</DialogContentText>
            <h3>🧾 Order Details</h3>
            <hr />
            {props.orderDetail.items.map((item) => (
              <div key={item._id} >
                <div className='d-flex align-items-center' style={{ marginTop: 10 }}>
                  <img src={item.productId.imageList[0]} width="100px" height="100px" style={{ objectFit: 'cover' }} />
                  <div style={{ marginLeft: 20 }}>
                    <DialogContentText style={{ color: 'black' }}>{item.productId.name + ' - ' + item.size + ' - ' + item.color.name}</DialogContentText>
                    <DialogContentText >{item.productId.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</DialogContentText>
                    <DialogContentText style={{ color: '#f05d62' }}>Quantity: {item.quantity}pcs</DialogContentText>
                  </div>
                </div>
                <hr />
              </div>
            ))}
            <div style={{ textAlign: 'right' }}>
              <DialogContentText>Subtotal: {(props.orderDetail.totalPrice - props.orderDetail.feeShipping).toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</DialogContentText>
              <DialogContentText>Fee Shipping: {props.orderDetail.feeShipping === 0 ? 'Free' : props.orderDetail.feeShipping.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</DialogContentText>
              <DialogContentText style={{ color: '#f05d62' }}><b>Total:  {props.orderDetail.totalPrice.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</b></DialogContentText>
            </div>
          </DialogContent>
        </>
      }
      <DialogActions>
        <Button onClick={props.handleClose} variant="outlined" color="warning">Close</Button>
      </DialogActions>
    </Dialog>
  );
}