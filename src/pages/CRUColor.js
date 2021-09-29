import React, { useEffect, useState } from 'react';
import {
  Grid, Button, TextField,
  Snackbar, Alert, Paper,
  TableContainer, Table, TableBody, TableHead, TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';

import Progress from '../components/Progress';
import { StyledTableCell, StyledTableRow } from '../components/Table/style';
import CallAPI from '../services/CallAPI';
import callAuthAPI from '../services/CallAuthAPI';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const CRUColor = (props) => {
  const [load, setLoad] = useState(false);
  const [colorData, setColorData] = useState([]);
  const [resetColor, setResetColor] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [id, setId] = useState('');
  const [input, setInput] = useState({ name: '', code: '' });
  const [openMsg, setOpenMsg] = useState({ status: false, type: 'success', msg: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoad(true);
        let callColor = CallAPI('/color', 'get', {});
        let resColor = await callColor;
        setColorData(resColor.data.data);
      } catch (error) {
        setLoad(false);
        console.log(error)
      }
      setLoad(false);
    }
    fetchData();
  }, [resetColor])

  const handleCloseAlert = () => {
    setOpenMsg({ status: false, type: 'success', msg: '' })
  }

  const handleClickEdit = (id) => {
    setIsEdit(true);
    setId(id);
    setInput({ name: colorData[id].name, code: colorData[id].code });
  }

  const handleAdd = async () => {
    try {
      setLoad(true)
      let res = await callAuthAPI('/color', 'post', { name: input.name, code: input.code })
      setResetColor(!resetColor);
      setOpenMsg({ status: true, type: 'success', msg: 'Add color successful!' });
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
      let res = await callAuthAPI('/color/' + colorData[id]._id, 'put', { name: input.name, code: input.code })
      setResetColor(!resetColor);
      setOpenMsg({ status: true, type: 'success', msg: 'Update color successful!' });
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
              <h2 style={{ paddingLeft: 24 }}>Color</h2>
              <Button onClick={() => { setIsEdit(false); setInput({ name: '', code: '' }); }} className='custom-button' variant="contained" style={{ marginRight: 20 }} startIcon={<AddIcon className='text-white' />}>Add Brand</Button>
            </div>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="customized table" >
                <TableHead>
                  <TableRow sx={{ height: 64 }}>
                    <StyledTableCell sx={{ paddingLeft: '24px', fontSize: 12 }} >Name</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 12 }}>Code</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 12 }}>Sample</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 12 }}></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {colorData && colorData.map((color, index) => (
                    <StyledTableRow hover key={color._id}>
                      <StyledTableCell sx={{ padding: '12px 24px' }} scope="row">
                        {color.name}
                      </StyledTableCell>
                      <StyledTableCell>
                        {color.code}
                      </StyledTableCell>
                      <StyledTableCell>
                        <FiberManualRecordIcon style={{ fill: color.code }} />
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
            <h2>{isEdit ? 'Edit' : 'Add'} color</h2>
            <form>
              <p><b>Color name</b></p>
              <TextField
                value={input.name}
                onChange={(e) => setInput({ ...input, name: e.target.value })}
                className='bg-white textfield-custom border-thin-gray'
                variant="standard"
                placeholder="Red"
                InputProps={{ disableUnderline: true }}
                required
              />
              <p><b>Color code</b></p>
              <TextField
                value={input.code}
                onChange={(e) => setInput({ ...input, code: e.target.value })}
                className='bg-white textfield-custom border-thin-gray'
                variant="standard"
                placeholder="#FF0000"
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

export default CRUColor;
