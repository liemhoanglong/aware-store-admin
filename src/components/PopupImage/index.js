import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export default function PopupImage(props) {

    return (
        <Dialog
            fullWidth
            open={props.open}
            TransitionComponent={Transition}
            maxWidth='sm'
            onClose={props.handleClose}
        >
            <DialogTitle>{props.title}</DialogTitle>
            <br />
            <DialogContent>
                <TextField
                    fullWidth
                    variant="outlined"
                    label='Image link'
                    value={props.textFieldIamge}
                    onChange={e => props.setTextFieldImage(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={props.handleClose} variant="outlined" color="warning">Cancel</Button>
                <Button onClick={props.handleSubmit} variant="contained" color="primary">save</Button>
            </DialogActions>
        </Dialog>
    );
}