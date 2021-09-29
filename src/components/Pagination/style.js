import { styled } from '@mui/material/styles';
import { Pagination } from '@mui/material';

const PaginationUl = styled(Pagination)(({ theme }) => ({
  "& .MuiPaginationItem-root": {
    border: 'solid 1px #ededed',
    "&:hover": {
      backgroundColor: "#ff9142",
    },
  },
  "& .MuiPaginationItem-root.Mui-selected": {
    border: 'solid 1px #ffa15f',
    backgroundColor: "#ffa15f",
  },
}));
export default PaginationUl