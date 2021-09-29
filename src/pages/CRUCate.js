import React, { useEffect, useState } from 'react';
import {
  Grid, Button, TextField, Autocomplete, Chip,
  Snackbar, Alert, Paper,
  TableContainer, Table, TableBody, TableHead, TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';

import Progress from '../components/Progress';
import { StyledTableCell, StyledTableRow } from '../components/Table/style';
import CallAPI from '../services/CallAPI';
import callAuthAPI from '../services/CallAuthAPI';

const CRUCate = (props) => {
  const [load, setLoad] = useState(false);
  const [catelistData, setCatelistData] = useState([{ _id: "6136342577e31326701a18fd", name: "Men" }, { _id: "6136343677e31326701a1901", name: "Ladies" }, { _id: "6136343b77e31326701a1903", name: "Girls" }, { _id: "6136346c9f814a47407fae2b", name: "Boys" }]);
  const [categroupData, setCategroupData] = useState([]);
  const [cateData, setCateData] = useState([]);
  const [resetCate, setResetCate] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [catelistInputValue, setCatelistInputValue] = useState([]);
  const [categroupInputValue, setCategroupInputValue] = useState([]);

  const [openMsg, setOpenMsg] = useState({ status: false, type: 'success', msg: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoad(true);
        let callCate = CallAPI('/cate/admin', 'get', {});
        let resCate = await callCate;
        setCateData(resCate.data.data);
      } catch (error) {
        setLoad(false);
        console.log(error)
      }
      setLoad(false);
    }
    fetchData();
  }, [resetCate])

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoad(true);
        let callCategroup = CallAPI('/cate-group/admin', 'get', {});
        let resCategroup = await callCategroup;
        setCategroupData(resCategroup.data.data);
      } catch (error) {
        setLoad(false);
        console.log(error)
      }
      setLoad(false);
    }
    fetchData();
  }, [])

  const handleCloseAlert = () => {
    setOpenMsg({ status: false, type: 'success', msg: '' })
  }

  const handleClickEdit = (id) => {
    setIsEdit(true);
    setId(id);
    setName(cateData[id].name);
    setCatelistInputValue(cateData[id].belongCatelist);
    setCategroupInputValue(cateData[id].belongCategroup);
  }

  const handleAdd = async () => {
    try {
      setLoad(true)
      let res = await callAuthAPI('/cate', 'post', { name, belongCatelist: catelistInputValue, belongCategroup: categroupInputValue })
      setResetCate(!resetCate);
      setOpenMsg({ status: true, type: 'success', msg: 'Add category successful!' });
    } catch (error) {
      setLoad(false);
      if (error.response)
        setOpenMsg({ status: true, type: 'error', msg: error.response.data.err });
      else
        setOpenMsg({ status: true, type: 'error', msg: 'Connection to sever lost!' });
      console.log(error)
    }
    setLoad(false)
  }

  const handleEdit = async () => {
    try {
      setLoad(true)
      let res = await callAuthAPI('/cate/' + cateData[id]._id, 'put', { name, belongCatelist: catelistInputValue, belongCategroup: categroupInputValue })
      setResetCate(!resetCate);
      setOpenMsg({ status: true, type: 'success', msg: 'Update category successful!' });
    } catch (error) {
      setLoad(false);
      if (error.response)
        setOpenMsg({ status: true, type: 'error', msg: error.response.data.err });
      else
        setOpenMsg({ status: true, type: 'error', msg: 'Connection to sever lost!' });
      console.log(error)
    }
    setLoad(false);
  }

  return (
    <>
      <Progress isLoad={load} />
      <Snackbar
        open={openMsg.status}
        onClose={(handleCloseAlert)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={openMsg.type}
          onClose={(handleCloseAlert)}
          sx={{ mb: 2 }}
        >
          {openMsg.msg}
        </Alert>
      </Snackbar>
      <Grid container spacing={3}>
        <Grid item md={6}>
          <Paper style={{ borderRadius: 0, marginBottom: 26, overflow: 'hidden' }}>
            <div className='d-flex justify-content-between align-items-center flex-wrap'>
              <h2 style={{ paddingLeft: 24 }}>Category</h2>
              <Button onClick={() => { setIsEdit(false); setName(''); setCatelistInputValue([]); setCategroupInputValue([]); }} className='custom-button' variant="contained" style={{ marginRight: 20 }} startIcon={<AddIcon className='text-white' />}>Add Brand</Button>
            </div>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="customized table" >
                <TableHead>
                  <TableRow sx={{ height: 64 }}>
                    <StyledTableCell sx={{ paddingLeft: '24px', fontSize: 12 }} >Name</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 12 }}>Category list</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 12 }}>Category group</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 12 }}></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {cateData && cateData.map((categroup, index) => (
                    <StyledTableRow hover key={categroup._id}>
                      <StyledTableCell sx={{ padding: '12px 24px' }} scope="row">
                        {categroup.name}
                      </StyledTableCell>
                      <StyledTableCell>
                        {categroup.belongCatelist.map((catelist, idx) => (
                          idx > 0 ? ', ' + catelist.name
                            : catelist.name
                        ))}
                      </StyledTableCell>
                      <StyledTableCell>
                        {categroup.belongCategroup.map((categroup, idx) => (
                          idx > 0 ? ', ' + categroup.name
                            : categroup.name
                        ))}
                      </StyledTableCell>
                      <StyledTableCell align="right">
                        <div className="dropdown" style={{ fontSize: 14 }}>
                          <div className="dropbtn-right d-flex align-items-center" style={{ padding: '10 0' }}>
                            <b>Actions</b>
                          </div>
                          <div className="dropdown-content-right">
                            <div onClick={() => handleClickEdit(index)} className='d-flex align-items-center cursor-hover'><CreateIcon style={{ fill: '#9b9b9b' }} /><span style={{ marginLeft: 12 }}>Edit</span></div>
                          </div>
                        </div>
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                  <tr style={{ height: 30 }}></tr>
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item md={6}>
          <Paper style={{ borderRadius: 0, padding: '0 26px', overflow: 'hidden' }}>
            <h2>{isEdit ? 'Edit' : 'Add'} category</h2>
            <form>
              <p><b>Category name</b></p>
              <TextField
                value={name}
                onChange={(e) => { setName(e.target.value) }}
                className='bg-white textfield-custom border-thin-gray'
                variant="standard"
                placeholder="Home"
                InputProps={{ disableUnderline: true }}
                required
              />
              <p><b>Belong to category list</b></p>
              <Autocomplete style={{ marginTop: 16 }} className='bg-white autocomplete-multi-custom border-thin-gray' multiple filterSelectedOptions
                value={catelistInputValue}
                onChange={(event, newValue) => setCatelistInputValue(newValue)}
                options={catelistData}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip style={{ borderRadius: 4 }} label={option.name} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} placeholder='Men' />
                )}
              />
              <p><b>Belong to category group</b></p>
              <Autocomplete style={{ marginTop: 16 }} className='bg-white autocomplete-multi-custom border-thin-gray' multiple filterSelectedOptions
                value={categroupInputValue}
                onChange={(event, newValue) => setCategroupInputValue(newValue)}
                options={categroupData}
                getOptionLabel={(option) => option.name}
                isOptionEqualToValue={(option, value) => option._id === value._id}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => (
                    <Chip style={{ borderRadius: 4 }} label={option.name} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} placeholder='Tops' />
                )}
              />
              <br />
              <div style={{ textAlign: 'center' }}>
                {isEdit ?
                  <Button onClick={handleEdit} className='custom-button' variant="contained" style={{ marginRight: 20 }} >Save</Button>
                  :
                  <Button onClick={handleAdd} className='custom-button' variant="contained" style={{ marginRight: 20 }} >Save</Button>
                }
              </div>
            </form>
            <br />
          </Paper>
        </Grid>
      </Grid>
    </>
  )
}

export default CRUCate;
