import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import QueryString from 'query-string';
import {
  Button, IconButton, InputAdornment, TextField, Paper,
  Table, TableBody, TableHead, TableRow,
  Alert, Snackbar
} from '@mui/material';

import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

import { StyledTableCell, StyledTableRow } from '../components/Table/style';
import Pagination from '../components/Pagination';
import Progress from '../components/Progress';
import PopUpAlert from '../components/PopUpAlert';
import CallAuthAPI from '../services/CallAuthAPI';
import parseDay from '../utils/parseDay';

export default function Order(props) {
  // console.log('order page------------------------')
  const history = useHistory();
  const location = history.location;

  const [openAlert, setOpenAlert] = useState(false);
  const [orderId, setOrderId] = useState(false);
  const [openMsg, setOpenMsg] = useState({ status: false, type: 'success', msg: '' });

  const [reset, setReset] = useState(true);
  const [load, setLoad] = useState(true);
  const [filter, setFilter] = useState({
    page: 1,
    rowsPerPage: 10,
    search: '',
    mindate: '2021-09-01',
    maxdate: (new Date()).toISOString().slice(0, 10),
    status: '',
  });
  const { page, rowsPerPage, search, mindate, maxdate } = filter
  const [searchInput, setSearchInput] = useState('');
  const [orderData, setOrderData] = useState();

  useEffect(() => {
    // console.log('order page fetch------------------------')
    setLoad(true);
    const fetchData = async () => {
      let queryObject = QueryString.parse(location.search);
      // console.log('----------------------------queryObject')
      // console.log(queryObject)
      queryObject.name = queryObject.name === undefined ? '' : queryObject.name;
      queryObject.page = queryObject.page === undefined ? 1 : queryObject.page;
      queryObject.limit = queryObject.limit === undefined ? 10 : queryObject.limit;
      queryObject.mindate = queryObject.mindate === undefined ? '2021-09-01' : queryObject.mindate;
      queryObject.maxdate = queryObject.maxdate === undefined ? (new Date()).toISOString().slice(0, 10) + '' : queryObject.maxdate;
      queryObject.status = queryObject.status === undefined ? '' : queryObject.status;
      setFilter(prevState => ({
        ...prevState,
        page: Number(queryObject.page),
        search: queryObject.name,
        rowsPerPage: queryObject.limit,
        mindate: queryObject.mindate,
        maxdate: queryObject.maxdate,
        status: queryObject.status,
      }));
      setSearchInput(queryObject.name);
      try {
        let res = await CallAuthAPI(`/order/admin-search?name=${queryObject.name}&mindate=${queryObject.mindate}&maxdate=${queryObject.maxdate}&status=${queryObject.status}&page=${queryObject.page}&limit=${queryObject.limit}`, 'get', {})
        setOrderData(res.data);
      } catch (err) {
        console.log(err)
        setLoad(false);
      }
      setLoad(false);
    }
    fetchData();
  }, [location.search, reset])

  const handleChangeFilter = (value) => {
    let queryObject = QueryString.parse(location.search);
    // console.log('query ' + '-----------' + value.brand);
    value.name != undefined && (queryObject.name = value.name);
    value.page != undefined && (queryObject.page = value.page);
    value.limit != undefined && (queryObject.limit = value.limit);
    value.mindate != undefined && (queryObject.mindate = value.mindate);
    value.maxdate != undefined && (queryObject.maxdate = value.maxdate);
    value.status != undefined && (queryObject.status = value.status);
    const keys = Object.keys(queryObject);
    let queryString = '';
    for (let i = 0; i < keys.length; i++) {
      if (queryObject[keys[i]])
        if (queryString === '') {
          queryString += `?${keys[i]}=${queryObject[keys[i]]}`;
        }
        else {
          queryString += `&${keys[i]}=${queryObject[keys[i]]}`;
        }
    }
    history.push({ search: queryString });
  }

  const handleChangePage = (e, newPage) => {
    handleChangeFilter({ page: newPage });
  };

  const handleChangeDate = (mindate, maxdate) => {
    handleChangeFilter({ mindate, maxdate });
  };

  const handleChangeRowsPerPage = (e) => {
    handleChangeFilter({ limit: e.target.value, page: 1 });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleChangeFilter({ name: searchInput, page: 1 });
  };

  const handleChangeStatus = async (status, id) => {
    // console.log(id ? id : orderId)
    // console.log(status)
    try {
      let res = await CallAuthAPI(`/order/update-status/${id ? id : orderId}`, 'put', { status })
      if (res.status === 200) {
        setOpenAlert(false);
        setOpenMsg({ status: true, type: 'success', msg: res.data.msg });
        // handleChangeFilter({ page: 1 });
        setReset(!reset);
      }
    } catch (err) {
      if (err.response)
        setOpenMsg({ status: true, type: 'error', msg: err.response.data.err });
      else
        setOpenMsg({ status: true, type: 'error', msg: 'Connection to sever lost!' });
      setOpenAlert(false);
      console.log(err);
    }
  }

  const handleCheckShowPopupWhenChangeStatus = (id, status) => {
    if (status === '-1') {// cancel show popup confirm
      setOpenMsg({ status: false, type: 'success', msg: '' });
      setOpenAlert(true);
      setOrderId(id);
      return;
    }
    handleChangeStatus(status, id);
  }

  const handleCloseAlert = () => {
    setOpenMsg({ status: false, type: 'success', msg: '' })
  }

  return (
    <>
      <Progress isLoad={load} />
      <PopUpAlert
        open={openAlert}
        handleClose={() => setOpenAlert(false)}
        handleSubmit={() => handleChangeStatus('-1')}
        title={'Confirm'}
        content={'Are you sure you want to cancel this order?'}
      />
      <Snackbar
        open={openMsg.status}
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={openMsg.type}
          onClose={handleCloseAlert}
          sx={{ mb: 2 }}
        >
          {openMsg.msg}
        </Alert>
      </Snackbar>

      <div className='d-flex justify-content-between align-items-center flex-wrap'>
        <div className='d-flex'>
          <p className='text-gray' style={{ marginRight: '20px' }}>ORDERED DATE</p>
          <input className='input-date-start' type="date" value={filter.mindate} onChange={e => { handleChangeDate(e.target.value > filter.maxdate ? filter.maxdate : e.target.value, filter.maxdate) }} />
          <input className='input-date-end' type="date" value={filter.maxdate} onChange={e => { handleChangeDate(filter.mindate, e.target.value < filter.mindate ? filter.mindate : e.target.value) }} />
          <Button onClick={() => { let date = new Date()().toISOString().slice(0, 10); handleChangeDate(date, date); }} className='custom-button-outline-2' variant="contained" style={{ marginLeft: 20 }}>Today</Button>
          <Button onClick={() => { let date = new Date()(); date.setDate(date.getDate() - 1); date = date.toISOString().slice(0, 10); handleChangeDate(date, date); }} className='custom-button-outline-2' variant="contained" style={{ marginLeft: 20 }}>Yesterday</Button>
        </div>
        <div className='d-flex flex-wrap'>
          <form onSubmit={handleSearch}>
            <TextField
              className='bg-white textfield-search border-thin-gray'
              value={searchInput}
              onChange={(e) =>
                setSearchInput(e.target.value)
              }
              variant="standard"
              placeholder="Search order"
              InputProps={{
                disableUnderline: true,
                startAdornment: (
                  <InputAdornment position="start">
                    <IconButton type='submit'>
                      <SearchIcon style={{ color: '#9B9B9B' }} />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </form>
          <Button className='custom-button-outline' variant="contained" style={{ marginLeft: 20 }} startIcon={<SaveAltOutlinedIcon />}>Export</Button>
        </div>
      </div>
      <Paper style={{ borderRadius: 0, marginTop: 32, marginBottom: 26 }}>
        <div style={{ padding: '0 24px' }}>
          <div style={{ minHeight: 550 }}>
            <Table stickyHeader aria-label="customized table" >
              <TableHead>
                <TableRow sx={{ height: 64 }}>
                  <StyledTableCell sx={{ paddingLeft: '24px', fontSize: 12 }} >Order ID</StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 12 }}>Ordered date</StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 12 }}>Detail</StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 12 }}>Total ($)</StyledTableCell>
                  <StyledTableCell >
                    <div className="dropdown" >
                      <div className="dropbtn-right d-flex align-items-center" style={{ padding: '10 0', fontSize: 12 }}> Status </div>
                      <div className="dropdown-content-right">
                        <div onClick={() => handleChangeStatus('0')} className='cursor-hover d-flex align-items-center'><FiberManualRecordIcon style={{ width: 15, height: 15, fill: '#fbba4e' }} /><span style={{ marginLeft: 12, fontSize: 12, textTransform: 'none' }}>Pending</span></div>
                        <div onClick={() => handleChangeStatus(1)} className='cursor-hover d-flex align-items-center'><FiberManualRecordIcon style={{ width: 15, height: 15, fill: '#82bf11' }} /><span style={{ marginLeft: 12, fontSize: 12, textTransform: 'none' }}>Completed</span></div>
                        <div onClick={() => handleChangeStatus(2)} className='cursor-hover d-flex align-items-center'><FiberManualRecordIcon style={{ width: 15, height: 15, fill: '#419BF9' }} /><span style={{ marginLeft: 12, fontSize: 12, textTransform: 'none' }}>Delivering</span></div>
                        <div onClick={() => handleChangeStatus(-1)} className='cursor-hover d-flex align-items-center'><FiberManualRecordIcon style={{ width: 15, height: 15, fill: '#f05d62' }} /><span style={{ marginLeft: 12, fontSize: 12, textTransform: 'none' }}>Canceled</span></div>
                        <div onClick={() => handleChangeStatus('')} className='cursor-hover d-flex align-items-center'><FiberManualRecordIcon style={{ width: 15, height: 15, fill: 'gray' }} /><span style={{ marginLeft: 12, fontSize: 12, textTransform: 'none' }}>All</span></div>
                      </div>
                    </div>
                  </StyledTableCell>
                  <StyledTableCell sx={{ fontSize: 12 }}></StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orderData && orderData.orders.map((order) => (
                  <StyledTableRow hover key={order._id}>
                    <StyledTableCell sx={{ padding: '12px 24px', textTransform: 'uppercase' }} scope="row">
                      {order.code}
                    </StyledTableCell>
                    <StyledTableCell>
                      {parseDay(order.orderedDate)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {order.items.map((item => (
                        <p key={order._id + item._id}>{`${item.productId.name} (${item.size}) - (${item.color.name}) x ${item.quantity}`}</p>
                      )))}
                    </StyledTableCell>
                    <StyledTableCell>
                      {(order.totalPrice).toLocaleString('en-US', {
                        style: 'currency',
                        currency: 'USD',
                      }).slice(1)}
                    </StyledTableCell>
                    <StyledTableCell>
                      {order.status === 0 ? <div className='order-status bg-yellow'>Pending</div>
                        : order.status === 1 ? <div className='order-status bg-green'>Completed</div>
                          : order.status === 2 ? <div className='order-status bg-blue'>Delivering</div>
                            : <div className='order-status bg-red'>Canceled</div>
                      }
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <div className="dropdown" style={{ fontSize: 14 }}>
                        <div className="dropbtn-right d-flex align-items-center" style={{ padding: '10 0' }}>
                          <b>Actions</b>
                        </div>
                        <div className="dropdown-content-right" style={{ width: 200 }}>
                          {order.status !== 1 &&
                            <div onClick={() => { handleCheckShowPopupWhenChangeStatus(order._id, '1') }} className='cursor-hover d-flex align-items-center'><FiberManualRecordIcon style={{ width: 15, height: 15, fill: '#82bf11' }} /><span style={{ marginLeft: 12 }}>Mark as Completed</span></div>
                          }
                          {order.status !== 0 &&
                            <div onClick={() => { handleCheckShowPopupWhenChangeStatus(order._id, '0') }} className='cursor-hover d-flex align-items-center'><FiberManualRecordIcon style={{ width: 15, height: 15, fill: '#fbba4e' }} /><span style={{ marginLeft: 12 }}>Mark as Pending</span></div>
                          }
                          {order.status !== 2 &&
                            <div onClick={() => { handleCheckShowPopupWhenChangeStatus(order._id, '2') }} className='cursor-hover d-flex align-items-center'><FiberManualRecordIcon style={{ width: 15, height: 15, fill: '#419BF9' }} /><span style={{ marginLeft: 12 }}>Mark as Delivering</span></div>
                          }
                          {order.status !== -1 &&
                            <div onClick={() => { handleCheckShowPopupWhenChangeStatus(order._id, '-1') }} className='cursor-hover d-flex align-items-center'><FiberManualRecordIcon style={{ width: 15, height: 15, fill: '#f05d62' }} /><span style={{ marginLeft: 12 }}>Mark as Canceled</span></div>
                          }
                        </div>
                      </div>
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <br />
          {orderData &&
            <Pagination
              page={page}
              rowsPerPage={rowsPerPage}
              data={orderData}
              handleChangePage={handleChangePage}
              handleChangeRowsPerPage={handleChangeRowsPerPage}
            />
          }
          <br />
          <br />
        </div>
      </Paper>
    </>
  )
}
