import React, { useEffect, useState } from 'react';
import {
  Grid, Button, TextField, Autocomplete, Chip, List, ListItem,
  Snackbar, Alert, Paper,
  TableContainer, Table, TableBody, TableHead, TableRow,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CreateIcon from '@mui/icons-material/Create';

import Progress from '../components/Progress';
import { StyledTableCell, StyledTableRow } from '../components/Table/style';
import CallAPI from '../services/CallAPI';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';

const CRUTag = (props) => {
  const [load, setLoad] = useState(false);
  const [catelistData, setCatelistData] = useState([{ _id: "6136342577e31326701a18fd", name: "Men" }, { _id: "6136343677e31326701a1901", name: "Ladies" }, { _id: "6136343b77e31326701a1903", name: "Girls" }, { _id: "6136346c9f814a47407fae2b", name: "Boys" }]);
  const [categroupData, setCategroupData] = useState([]);
  const [resetCategroup, setResetCategroup] = useState(false);
  const [showCategroup, setShowCategroup] = useState(false);

  const [id, setId] = useState('');
  const [openMsg, setOpenMsg] = useState({ status: false, type: 'success', msg: '' });

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
  }, [resetCategroup])

  const handleCloseAlert = () => {
    setOpenMsg({ status: false, type: 'success', msg: '' })
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
        <Grid item md={12}>
          <Paper style={{ borderRadius: 0, marginBottom: 26, overflow: 'hidden' }}>
            <div className='d-flex justify-content-between align-items-center flex-wrap'>
              <h2 style={{ paddingLeft: 24 }}>Category group</h2>
              <Button className='custom-button' variant="contained" style={{ marginRight: 20 }} startIcon={<AddIcon className='text-white' />}>Add Category group</Button>
            </div>
            <TableContainer sx={{ maxHeight: 500 }}>
              <Table stickyHeader aria-label="customized table" >
                <TableHead>
                  <TableRow sx={{ height: 64 }}>
                    <StyledTableCell sx={{ paddingLeft: '24px', fontSize: 12 }} >Name</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 12 }}>Category list</StyledTableCell>
                    <StyledTableCell sx={{ fontSize: 12 }}></StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {categroupData && categroupData.map((categroup) => (
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
                      <StyledTableCell align="right">
                        <div className="dropdown" style={{ fontSize: 14 }}>
                          <div className="dropbtn-right d-flex align-items-center" style={{ padding: '10 0' }}>
                            <b>Actions</b>
                          </div>
                          <div className="dropdown-content-right">
                            <div className='d-flex align-items-center cursor-hover'><CreateIcon style={{ fill: '#9b9b9b' }} /><span style={{ marginLeft: 12 }}>Edit</span></div>
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
      </Grid>
    </>
  )
}

export default CRUTag;
