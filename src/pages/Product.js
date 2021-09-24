import React, { useState, useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import QueryString from 'query-string';
import {
  Select, MenuItem, Button, IconButton, InputAdornment, TextField, Paper,
  Table, TableBody, TableHead, TableRow,
  Alert, Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveAltOutlinedIcon from '@mui/icons-material/SaveAltOutlined';
import SearchIcon from '@mui/icons-material/Search';
import CreateIcon from '@mui/icons-material/Create';
import DeleteIcon from '@mui/icons-material/Delete';
import CloseIcon from '@mui/icons-material/Close';

import { StyledTableCell, StyledTableRow } from '../components/Table/style';
import Pagination from '../components/Pagination';
import CardProduct from '../components/CardProduct';
import Progress from '../components/Progress';
import PopUpAlert from '../components/PopUpAlert';
import CallAPI from '../services/CallAPI';
import CallAuthAPI from '../services/CallAuthAPI';
import parseDay from '../utils/parseDay';

export default function Product(props) {
  const location = useHistory().location;
  const history = useHistory();

  const [openAlert, setOpenAlert] = useState(false);
  const [productId, setProductId] = useState(false);
  const [openMsg, setOpenMsg] = useState({ status: false, type: 'success', msg: '' });

  const [load, setLoad] = useState(true);
  const [filter, setFilter] = useState({
    sort: '0',
    page: 1,
    rowsPerPage: 10,
    search: ''
  });
  const { sort, page, rowsPerPage, search } = filter
  const [searchInput, setSearchInput] = useState('');
  const [productData, setProductData] = useState();

  useEffect(() => {
    setLoad(true);
    const fetchData = async () => {
      let queryObject = QueryString.parse(location.search);
      // console.log('----------------------------queryObject')
      // console.log(queryObject)
      queryObject.sort = queryObject.sort === undefined ? '0' : queryObject.sort;
      queryObject.name = queryObject.name === undefined ? '' : queryObject.name;
      queryObject.page = queryObject.page === undefined ? 1 : queryObject.page;
      queryObject.limit = queryObject.limit === undefined ? 10 : queryObject.limit;
      setFilter(prevState => ({
        ...prevState,
        sort: queryObject.sort,
        page: Number(queryObject.page),
        search: queryObject.name,
        rowsPerPage: queryObject.limit,
      }));
      setSearchInput(queryObject.name);
      try {
        let res = await CallAPI(`/product/admin-search?name=${queryObject.name}&sort=${queryObject.sort}&page=${queryObject.page}&limit=${queryObject.limit}`, 'get', {})
        setProductData(res.data);
      } catch (err) {
        console.log(err)
        setLoad(false);
      }
      setLoad(false);
    }
    fetchData();
  }, [location.search])

  const handleChangeFilter = (value) => {
    let queryObject = QueryString.parse(location.search);
    // console.log('query ' + '-----------' + value.brand);
    value.sort != undefined && (queryObject.sort = value.sort);
    value.name != undefined && (queryObject.name = value.name);
    value.page != undefined && (queryObject.page = value.page);
    value.limit != undefined && (queryObject.limit = value.limit);
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

  const handleChangeSort = (e) => {
    handleChangeFilter({ sort: e.target.value });
  };

  const handleChangePage = (e, newPage) => {
    handleChangeFilter({ page: newPage });
  };

  const handleChangeRowsPerPage = (e) => {
    handleChangeFilter({ limit: e.target.value, page: 1 });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    handleChangeFilter({ name: searchInput, page: 1 });
  };

  const handleRemoveProduct = async () => {
    try {
      let res = await CallAuthAPI(`/product/${productId}`, 'delete', {})
      if (res.status === 200) {
        setOpenAlert(false);
        setOpenMsg({ status: true, type: 'success', msg: res.data.msg });
        handleChangeFilter({ page: 1 });
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

  const handleAlertRemoveProduct = (id) => {
    setOpenMsg({ status: false, type: 'success', msg: '' });
    setOpenAlert(true);
    setProductId(id);
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
        handleSubmit={handleRemoveProduct}
        title={'Confirm'}
        content={'Are you sure to delete this product?'}
      />
      <Snackbar
        open={openMsg.status}
        autoHideDuration={5000}
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
          <p className='text-gray' style={{ marginRight: '20px' }}>SORT BY</p>
          <Select
            labelId="product-sort-label"
            id="product-sort"
            value={sort}
            onChange={handleChangeSort}
            className='bg-white select-custom select-sort-product border-thin-gray'
            variant="standard"
            disableUnderline
          >
            <MenuItem value={'0'}>Date added</MenuItem>
            <MenuItem value={'1'}>Name: A -&gt; Z</MenuItem>
            <MenuItem value={'2'}>Price: Asc</MenuItem>
            <MenuItem value={'3'}>Price: Desc</MenuItem>
          </Select>
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
              placeholder="Search product"
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
          <Link to='/app/products/add-product' className='link-custom'><Button className='custom-button' variant="contained" style={{ marginLeft: 20 }} startIcon={<AddIcon className='text-white' />}>Add product</Button></Link>
          <Button className='custom-button-outline' variant="contained" style={{ marginLeft: 20 }} startIcon={<SaveAltOutlinedIcon />}>Export</Button>
        </div>
      </div>
      <Paper style={{ borderRadius: 0, marginTop: 32, marginBottom: 26 }}>
        <div style={{ padding: '0 24px' }}>
          <Table stickyHeader aria-label="customized table" >
            <TableHead>
              <TableRow>
                <StyledTableCell sx={{ paddingLeft: '24px', width: '50%' }} >Products</StyledTableCell>
                <StyledTableCell>Sold</StyledTableCell>
                <StyledTableCell>Date added</StyledTableCell>
                <StyledTableCell>profit ($)</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {productData && productData.products.map((product) => (
                <StyledTableRow hover key={product._id}>
                  <StyledTableCell sx={{ padding: '12px 24px' }} scope="row">
                    <CardProduct product={product} />
                  </StyledTableCell>
                  <StyledTableCell>
                    {`${product.sold[0].quantity + product.sold[1].quantity + product.sold[2].quantity}/${product.size[0].quantity + product.size[1].quantity + product.size[2].quantity}`}
                  </StyledTableCell>
                  <StyledTableCell>
                    {parseDay(product.postedDate)}
                  </StyledTableCell>
                  <StyledTableCell>
                    {(product.price * (product.sold[0].quantity + product.sold[1].quantity + product.sold[2].quantity)).toLocaleString('en-US', { style: 'currency', currency: 'USD' }).slice(1)}
                  </StyledTableCell>
                  <StyledTableCell align="right">
                    <div className="dropdown" style={{ fontSize: 14 }}>
                      <div className="dropbtn-right d-flex align-items-center" style={{ padding: '10 0' }}>
                        <b>Actions</b>
                      </div>
                      <div className="dropdown-content-right">
                        <Link to={`/app/products/edit-product/${product._id}`} className='d-flex align-items-center'><CreateIcon style={{ fill: '#9b9b9b' }} /><span style={{ marginLeft: 12 }}>Edit</span></Link>
                        <div onClick={() => handleAlertRemoveProduct(product._id)} className='cursor-hover d-flex align-items-center'><DeleteIcon style={{ fill: '#9b9b9b' }} /><span style={{ marginLeft: 12 }}>Remove</span></div>
                      </div>
                    </div>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
          <br />
          {productData &&
            <Pagination
              page={page}
              rowsPerPage={rowsPerPage}
              productData={productData}
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
