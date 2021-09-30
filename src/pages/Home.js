import React, { useState, useEffect } from 'react';
import { Chart, ChartProfit } from '../components/Chart';
import { Grid, Paper } from '@mui/material';
import callAuthAPI from '../services/CallAuthAPI';

export default function Home(props) {
  const [rows, setRows] = useState([]);
  const [orderStatus, setOrderStatus] = useState({ comp: 0, pend: 0, deli: 0, can: 0 });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await callAuthAPI('/order', 'get', {});
        // console.log(res.data.data)
        setRows(res.data.data);
        let a = 0;
        let b = 0;
        let c = 0;
        let d = 0;
        for (let i = 0; i < res.data.data.length; i++) {
          if (res.data.data[i].status === 1)
            a++;
          else if (res.data.data[i].status === 0)
            b++;
          else if (res.data.data[i].status === 2)
            c++;
          else if (res.data.data[i].status === -1)
            d++;
        }
        setOrderStatus({ comp: a, pend: b, deli: c, can: d });
      } catch (error) {
        console.log('Failed to fetch: ', error);
      }
    }
    fetchAll();
  }, [])

  return (
    <Grid container spacing={3}>
      <Grid item lg={3} md={6}>
        <Paper style={{ height: 200, padding: 16, color: 'white', backgroundColor: '#3CD4A0' }}>
          <h2>Order Complete</h2>
          <center style={{ fontSize: 100 }}>{orderStatus.comp}</center>
        </Paper>
      </Grid>
      <Grid item lg={3} md={6}>
        <Paper style={{ height: 200, padding: 16, color: 'white', backgroundColor: '#FFC260' }}>
          <h2>Order Pending</h2>
          <center style={{ fontSize: 100 }}>{orderStatus.pend}</center>
        </Paper>
      </Grid>
      <Grid item lg={3} md={6}>
        <Paper style={{ height: 200, padding: 16, color: 'white', backgroundColor: '#536DFE' }}>
          <h2>Order Delivery</h2>
          <center style={{ fontSize: 100 }}>{orderStatus.deli}</center>
        </Paper>
      </Grid>
      <Grid item lg={3} md={6}>
        <Paper style={{ height: 200, padding: 16, color: 'white', backgroundColor: '#FF5C93' }}>
          <h2>Order Cancel</h2>
          <center style={{ fontSize: 100 }}>{orderStatus.can}</center>
        </Paper>
      </Grid>
      <Grid item lg={6} md={12}>
        <Paper style={{ height: 500, padding: 16 }}>
          <div style={{ height: 400 }}>
            <Chart rows={rows} />
          </div>
        </Paper>
      </Grid>
      <Grid item lg={6} md={12}>
        <Paper style={{ height: 500, padding: 16 }}>
          <div style={{ height: 400 }}>
            <ChartProfit rows={rows} />
          </div>
        </Paper>
      </Grid>
    </Grid>
  )
}