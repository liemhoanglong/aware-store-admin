import React, { useEffect, useState } from 'react';
import {
  Grid, Button, TextField, Autocomplete,
  Snackbar, Alert, Paper,
  TableContainer, Table, TableBody, TableHead, TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';

import Progress from '../components/Progress';
import { StyledTableCell, StyledTableRow } from '../components/Table/style';
import CallAPI from '../services/CallAPI';
import callAuthAPI from '../services/CallAuthAPI';

const CRUBrand = (props) => {
  const [load, setLoad] = useState(false);
  const [brandData, setBrandData] = useState([]);
  const [resetBrand, setResetBrand] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [openMsg, setOpenMsg] = useState({ status: false, type: 'success', msg: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoad(true);
        let callBrand = CallAPI('/brand', 'get', {});
        let resBrand = await callBrand;
        setBrandData(resBrand.data.data);
      } catch (error) {
        setLoad(false);
        console.log(error)
      }
      setLoad(false);
    }
    fetchData();
  }, [resetBrand])

  const handleCloseAlert = () => {
    setOpenMsg({ status: false, type: 'success', msg: '' })
  }

  const handleClickEdit = (id) => {
    setIsEdit(true);
    setId(id);
    setName(brandData[id].name);
  }

  const handleAdd = async () => {
    try {
      setLoad(true)
      let res = await callAuthAPI('/brand', 'post', { name })
      setResetBrand(!resetBrand);
      setOpenMsg({ status: true, type: 'success', msg: 'Add brand successful!' });
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
      let res = await callAuthAPI('/brand/' + brandData[id]._id, 'put', { name })
      setResetBrand(!resetBrand);
      setOpenMsg({ status: true, type: 'success', msg: 'Update brand successful!' });
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
              <h2 style={{ paddingLeft: 24 }}>Brand</h2>
              <Button className='custom-button' variant="contained" style={{ marginRight: 20 }} startIcon={<AddIcon className='text-white' />}>Add Brand</Button>
            </div>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="customized table" >
                <TableHead>
                  <TableRow sx={{ height: 64 }}>
                    <StyledTableCell sx={{ paddingLeft: '24px', fontSize: 12 }} >Name</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 12 }}></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {brandData && brandData.map((brand, index) => (
                    <StyledTableRow hover key={brand._id}>
                      <StyledTableCell sx={{ padding: '12px 24px' }} scope="row">
                        {brand.name}
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
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
        <Grid item md={6}>
          <Paper style={{ borderRadius: 0, padding: '0 26px', overflow: 'hidden' }}>
            <h2>{isEdit ? 'Edit' : 'Add'} brand</h2>
            <form>
              <p><b>Brand name</b></p>
              <TextField
                value={name}
                onChange={(e) => setName(e.target.value)}
                className='bg-white textfield-custom border-thin-gray'
                variant="standard"
                placeholder="Polo"
                InputProps={{ disableUnderline: true }}
                required
              />
              <div style={{ textAlign: 'center', marginTop: 20 }}>
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

export default CRUBrand;
