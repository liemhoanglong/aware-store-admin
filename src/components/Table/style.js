import { styled } from '@mui/material/styles';
import { TableCell, tableCellClasses, TableRow } from '@mui/material';
// import TableCell,  from '@mui/material/TableCell';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        color: '#acacac',
        textTransform: 'uppercase',
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(even)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
export { StyledTableCell, StyledTableRow };