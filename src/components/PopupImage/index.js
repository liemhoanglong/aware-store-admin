import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import axios from 'axios';
import LinearProgress from '@mui/material/LinearProgress';

import config from '../../constants/config';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const Input = styled('input')({
    display: 'none',
});

export default function PopupImage(props) {
    const [msg, setMsg] = React.useState('')
    const handleUploadFile = async (e) => {
        setMsg('');
        props.setProgress(0);
        if (e.target.files[0]) {
            try {
                const formData = new FormData();
                formData.append('product-image', e.target.files[0], e.target.files[0].name)
                let res = await axios.post(config.API_URL + '/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    },
                    onUploadProgress: data => {
                        //Set the progress value to show the progress bar
                        props.setProgress(Math.round((100 * data.loaded) / data.total));
                        console.log(Math.round((100 * data.loaded) / data.total));
                    },
                })
                console.log(res.data)
                props.setTextFieldImage(config.API_URL + res.data);
            } catch (error) {
                setMsg('Upload image failed');
                props.setProgress(-1);
                console.log(error);
            }
        }
    }

    return (
        <Dialog
            fullWidth
            open={props.open}
            TransitionComponent={Transition}
            maxWidth='sm'
            onClose={props.handleClose}
        >
            <DialogTitle>{props.title}</DialogTitle>
            <DialogContent>
                <center>
                    {msg && <p style={{ marginTop: 0, color: '#f05d62' }}>{msg}</p>}
                    <div>
                        <label htmlFor="contained-button-file">
                            <Input onChange={handleUploadFile} accept="image/*" id="contained-button-file" multiple type="file" />
                            <Button variant="contained" component="span" startIcon={<CloudUploadIcon />}>
                                Upload
                            </Button>
                        </label>
                        {props.progress > 0 && <LinearProgress variant="determinate" value={props.progress} style={{ marginTop: 20 }} />}
                    </div>
                    {props.textFieldIamge &&
                        <img src={props.textFieldIamge} height='200' style={{ marginTop: 20 }} />
                    }
                </center>
                <br />
                <DialogContentText>Maximum upload file 3MB</DialogContentText>
                <p><b>Link image</b></p>
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