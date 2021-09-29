import React from 'react';
import { Select, MenuItem } from '@mui/material';

import PaginationUl from '../Pagination/style';

const Pagination = (props) => {
  const { page, rowsPerPage, data, handleChangePage, handleChangeRowsPerPage } = props;
  return (
    <div className='d-flex justify-content-between align-items-center'>
      <span>Show 1 to {rowsPerPage} of {data.count} entries</span>
      <div className='d-flex align-items-center'>
        <Select
          labelId="product-sort-label"
          id="product-sort"
          value={rowsPerPage}
          onChange={handleChangeRowsPerPage}
          className='bg-white select-sort-row-per-page border-thin-gray'
          variant="standard"
          disableUnderline
        >
          <MenuItem value={2}>2</MenuItem>
          <MenuItem value={5}>5</MenuItem>
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
        </Select>
        <PaginationUl
          className='pagination-custom'
          variant="outlined" shape="rounded"
          page={page} count={Math.ceil(data.count / rowsPerPage)}
          showFirstButton showLastButton
          onChange={handleChangePage}
          style={{ marginLeft: 20 }}
        />
      </div>
    </div>
  )
}

export default Pagination;
