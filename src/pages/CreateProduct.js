import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import {
  Grid, Button, TextField, Autocomplete, Chip, List, ListItem,
  Snackbar, Alert,
} from '@mui/material';

import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CloseIcon from '@mui/icons-material/Close';

import CallAuthAPI from '../services/CallAuthAPI';
import CallAPI from '../services/CallAPI';
import PopUpAlert from '../components/PopUpAlert';
import PopupImage from '../components/PopupImage';
import config from '../constants/config';
import { sortSize, sortObjectSize } from '../utils/sortSize';

// 'https://cdn.shopify.com/s/files/1/1414/2498/products/CS_ClassicWhite_06_800x.jpg?v=1614938767'
// 'https://assets.myntassets.com/h_1440,q_100,w_1080/v1/assets/images/1862801/2018/2/9/11518155061506-Roadster-Men-Maroon--Navy-Blue-Regular-Fit-Checked-Casual-Shirt-8861518155061131-1.jpg'
// 'https://revolutionclothing.cdn.vccloud.vn/wp-content/uploads/2021/06/z2536606508904_dabe1d43c33b3f0cab550eae587f349b-500x498.jpg'

export default function CreateProduct(props) {
  const [input, setInput] = useState({
    imageList: [],
    name: '',
    // catelist: [],
    // categroup: [],
    // cate: [],
    // brand: null,
    price: 0.00,
    size: [{ name: config.SIZE[0], quantity: 1 }],
    // colors: [],
    info: '',
  });

  const [catelistData, setCatelistData] = useState([{ _id: "6136342577e31326701a18fd", name: "Men" }, { _id: "6136343677e31326701a1901", name: "Ladies" }, { _id: "6136343b77e31326701a1903", name: "Girls" }, { _id: "6136346c9f814a47407fae2b", name: "Boys" }]);
  const [categroupData, setCategroupData] = useState([]);
  const [cateData, setCateData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [colorData, setColorData] = useState([]);
  const [sizeData, setSizeData] = useState(config.SIZE.slice(1));

  const [catelistValue, setCatelistValue] = useState([]);
  const [catelistInputValue, setCatelistInputValue] = useState([]);

  useEffect(() => {
    if (catelistValue.length === catelistInputValue.length) return;
    let temp = [...catelistData];
    temp = temp.filter((e) => catelistValue.includes(e._id));
    setCatelistInputValue(temp);
  }, [catelistValue]);

  const [categroupValue, setCategroupValue] = useState([]);
  const [categroupInputValue, setCategroupInputValue] = useState([]);

  useEffect(() => {
    if (categroupValue.length === categroupInputValue.length) return;
    let temp = [...categroupData];
    temp = temp.filter((e) => categroupValue.includes(e._id));
    setCategroupInputValue(temp);
  }, [categroupValue]);

  const [cateValue, setCateValue] = useState([]);
  const [cateInputValue, setCateInputValue] = useState([]);

  useEffect(() => {
    if (cateValue.length === cateInputValue.length) return;
    let temp = [...cateData];
    temp = temp.filter((e) => cateValue.includes(e._id));
    setCateInputValue(temp);
  }, [cateValue]);

  const [brandValue, setBrandValue] = useState(null);
  const [brandInputValue, setBrandInputValue] = useState(null);

  useEffect(() => {
    if (!brandValue) {
      setBrandInputValue(null);
      return;
    }
    if (brandValue === brandInputValue.id) {
      return;
    }
    let temp = brandData.find((e) => brandValue === e._id);
    setBrandInputValue(temp);
  }, [brandValue]);

  const [colorValue, setColorValue] = useState([]);
  const [colorInputValue, setColorInputValue] = useState([]);

  useEffect(() => {
    if (colorValue.length === colorInputValue.length) return;
    let temp = [...colorData];
    temp = temp.filter((e) => colorValue.includes(e._id));
    setColorInputValue(temp);
  }, [colorValue]);

  const [imgIndex, setImgIndex] = useState(0);
  const [textFieldIamge, setTextFieldImage] = useState('');
  const [openUploadImg, setOpenUploadImg] = useState(false);
  const [openEditImg, setOpenEditImg] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openMsg, setOpenMsg] = useState({ status: false, type: 'success', msg: '' });

  useEffect(() => {
    const fetchData = async () => {
      let callCategroup = CallAPI('/cate-group', 'get', {});
      let callCate = CallAPI('/cate', 'get', {});
      let callBrand = CallAPI('/brand', 'get', {});
      let callColor = CallAPI('/color', 'get', {});

      let resCategroup = await callCategroup;
      let resCate = await callCate;
      let resBrand = await callBrand;
      let resColor = await callColor;

      setCategroupData(resCategroup.data.data);
      setCateData(resCate.data.data);
      setBrandData(resBrand.data.data);
      setColorData(resColor.data.data);
    }
    fetchData();
  }, [])

  const handleOpenEditImage = (imgIdx) => {
    setOpenEditImg(true);
    setImgIndex(imgIdx);
    setTextFieldImage(input.imageList[imgIdx]);
  };

  const handleEditImage = () => {
    let temp = [...input.imageList];
    temp[imgIndex] = textFieldIamge;
    setInput(prevState => ({ ...prevState, imageList: [...temp] }))
    setOpenEditImg(false);
  };

  const handleOpenAddImage = () => {
    setOpenUploadImg(true);
    setTextFieldImage('');
  };

  const handleAddImage = () => {
    let temp = [...input.imageList];
    temp.push(textFieldIamge);
    setInput(prevState => ({ ...prevState, imageList: [...temp] }))
    setOpenUploadImg(false);
  };

  const handleOpenRemoveImage = (imgIdx) => {
    setOpenAlert(true);
    setImgIndex(imgIdx);
  };

  const handleRemoveImage = () => {
    let temp = [...input.imageList];
    temp.splice(imgIndex, 1);
    setInput(prevState => ({ ...prevState, imageList: [...temp] }))
    setOpenAlert(false);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    //cope size to sold and set default quantity = 0
    let size = [...input.size];
    size = sortObjectSize(size);
    let sold = []
    for (let i = 0; i < size.length; i++) {
      sold.push({ name: size[i].name, quantity: 0 });
    }
    //conver input.info breakline /r/n info to <br/> 
    let info = input.info;
    info = info.replace(/\r?\n/g, '<br />');
    //create data to send to server
    let data = {
      ...input, size, sold, info,
      catelist: catelistValue,
      categroup: categroupValue,
      cate: cateValue,
      brand: brandValue,
      colors: colorValue,
    };
    // console.log(data)
    try {
      let res = await CallAuthAPI('/product', 'post', data);
      if (res.status === 201) {
        setOpenMsg({ status: true, type: 'success', msg: 'Create product successful' });
        handleCancel();
      }
    } catch (err) {
      if (err.response)
        setOpenMsg({ status: true, type: 'error', msg: err.response.data.err });
      else
        setOpenMsg({ status: true, type: 'error', msg: 'Connection to sever lost!' });
      console.log(err)
    }
  }
  let a = 0;

  const handleCancel = () => {
    setInput({
      imageList: [],
      name: '',
      // catelist: [],
      // categroup: [],
      // cate: [],
      // brand: null,
      price: 0.00,
      size: [{ name: config.SIZE[0], quantity: 1 }],
      // colors: [],
      info: '',
    })
    setCatelistValue([]);
    setCategroupValue([]);
    setCateValue([]);
    setBrandValue('');
    setColorValue([]);
  }

  const handleCloseAlert = () => {
    setOpenMsg({ status: false, type: 'success', msg: '' })
  }

  return (
    <form onSubmit={(e) => handleAddProduct(e)}>
      <Snackbar
        open={openMsg.status}
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
      <PopUpAlert
        open={openAlert}
        handleClose={() => setOpenAlert(false)}
        handleSubmit={() => handleRemoveImage()}
        title={'Confirm'}
        content={'Are you sure to remove this img?'}
      />
      <PopupImage
        open={openEditImg}
        textFieldIamge={textFieldIamge}
        setTextFieldImage={setTextFieldImage}
        handleClose={() => setOpenEditImg(false)}
        handleSubmit={() => handleEditImage()}
        title={'Edit image'}
      />
      <PopupImage
        open={openUploadImg}
        textFieldIamge={textFieldIamge}
        setTextFieldImage={setTextFieldImage}
        handleClose={() => setOpenUploadImg(false)}
        handleSubmit={() => handleAddImage()}
        title={'Upload image'}
      />
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 50 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>photos</b></div>
        </Grid>
        <Grid item lg={8} md={10}>
          <List className='list-image' >
            {[0, 1, 2, 3, 4, 5, 6, 7].map((imgIdx) => (
              imgIdx < input.imageList.length ?
                <ListItem key={imgIdx} className='cursor-hover image-card' style={{ position: 'relative' }}>
                  <CloseIcon onClick={() => handleOpenRemoveImage(imgIdx)} className='image-remove' style={{ fill: '#acacac' }} />
                  <img key={imgIdx} onClick={() => handleOpenEditImage(imgIdx)} className='image-item' src={input.imageList[imgIdx]} alt={`img ${imgIdx}`} />
                </ListItem>
                : <ListItem key={imgIdx} onClick={handleOpenAddImage} className='cursor-hover image-card'><div className='image-add'><AddCircleIcon /><span>Add photo</span></div></ListItem>
            ))}
          </List>
          <p className='text-gray'>You can add up to 8 photos.The 1st photo will be set as cover (main photo).</p>
        </Grid>
      </Grid>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>Name</b></div>
        </Grid>
        <Grid item lg={8} md={10}>
          <TextField
            value={input.name}
            onChange={(e) => {
              setInput(prevState => ({
                ...prevState,
                name: e.target.value
              }))
            }}
            className='bg-white textfield-custom border-thin-gray'
            variant="standard"
            placeholder="Collete Stretch Linen Minidress"
            InputProps={{ disableUnderline: true }}
            required
          />
        </Grid>
      </Grid>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>categories list</b></div>
        </Grid>
        <Grid item lg={8} md={10}>
          <Autocomplete className='bg-white autocomplete-multi-custom border-thin-gray' multiple filterSelectedOptions
            value={catelistInputValue}
            onChange={(event, newValue) => {
              setCatelistInputValue(newValue);
              if (newValue) {
                let temp = [];
                newValue.forEach((e) => temp.push(e._id));
                setCatelistValue(temp);
              }
            }}
            options={catelistData}
            getOptionLabel={(option) => option.name}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip style={{ borderRadius: 4 }} label={option.name} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} placeholder='Men' />
            )}
          />
        </Grid>
      </Grid>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>categories group</b></div>
        </Grid>
        <Grid item lg={8} md={10}>
          <Autocomplete className='bg-white autocomplete-multi-custom border-thin-gray' multiple limitTags={7} filterSelectedOptions
            value={categroupInputValue}
            onChange={(event, newValue) => {
              setCategroupInputValue(newValue);
              if (newValue) {
                let temp = [];
                newValue.forEach((e) => temp.push(e._id));
                setCategroupValue(temp);
              }
            }}
            options={categroupData}
            getOptionLabel={(option) => option.name}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip style={{ borderRadius: 4 }} label={option.name} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} placeholder='T-shirt' />
            )}
          />
        </Grid>
      </Grid>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>categories</b></div>
        </Grid>
        <Grid item lg={8} md={10}>
          <Autocomplete className='bg-white autocomplete-multi-custom border-thin-gray' multiple limitTags={7} filterSelectedOptions
            value={cateInputValue}
            onChange={(event, newValue) => {
              setCateInputValue(newValue);
              if (newValue) {
                let temp = [];
                newValue.forEach((e) => temp.push(e._id));
                setCateValue(temp);
              }
            }}
            options={cateData}
            getOptionLabel={(option) => option.name}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip style={{ borderRadius: 4 }} label={option.name} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} placeholder='Casual' />
            )}
          />
        </Grid>
      </Grid>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>Brand</b></div>
        </Grid>
        <Grid item lg={8} md={10}>
          <Autocomplete className='bg-white autocomplete-custom border-thin-gray' filterSelectedOptions
            value={brandInputValue}
            onChange={(event, newValue) => {
              setBrandInputValue(newValue);
              if (newValue) {
                setBrandValue(newValue._id);
              } else {
                setBrandValue("");
              }
            }}
            options={brandData}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} placeholder='H&M' required />
            )}
          />
        </Grid>
      </Grid>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>Price ($)</b></div>
        </Grid>
        <Grid item lg={8} md={10}>
          <TextField
            value={input.price}
            onChange={(e) => {
              setInput(prevState => ({
                ...prevState,
                price: (Math.round(e.target.value * 100) / 100)
              }))
            }}
            className='bg-white textfield-custom border-thin-gray'
            variant="standard"
            placeholder="69.00"
            InputProps={{ disableUnderline: true }}
            type='number'
          />
        </Grid>
      </Grid>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>size - Quantity</b></div>
        </Grid>
        <Grid item container xs={8} spacing={2}>
          {input.size.map((each, idx) =>
            <React.Fragment key={each.name}>
              <Grid item xs={6}>
                <Autocomplete className='bg-white autocomplete-custom border-thin-gray'
                  value={each.name}
                  onChange={(event, newValue) => {
                    //find the index and replace
                    // console.log(newValue)
                    if (!newValue) return
                    let temp = [...sizeData];
                    let idxSize = sizeData.findIndex(e => e === newValue);
                    temp.splice(idxSize, 1, input.size[idx].name);
                    sortSize(temp);
                    setSizeData(temp)
                    //update input
                    temp = [...input.size];
                    temp[idx] = { ...temp[idx], name: newValue };
                    setInput(prevState => ({ ...prevState, size: temp }))
                  }}
                  options={sizeData}
                  getOptionLabel={(option) => option}
                  renderInput={(params) => (
                    <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} required />
                  )}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className='bg-white textfield-custom border-thin-gray'
                  value={each.quantity}
                  onChange={(event) => {
                    let temp = [...input.size];
                    temp[idx] = { ...temp[idx], quantity: Number(event.target.value) };
                    setInput(prevState => ({ ...prevState, size: temp }))
                  }}
                  variant="standard"
                  placeholder="200"
                  InputProps={{ disableUnderline: true }}
                  type='number' required
                />
              </Grid>
            </React.Fragment>
          )}
        </Grid>
        <Grid item container spacing={2} xs={1}>
          {input.size.length > 1 && input.size.map((each, idx) =>
            <Grid item key={idx}>
              <Button
                style={{ height: 46, borderRadius: 0 }} variant="contained" color="error"
                onClick={() => {
                  //add this value to sizedata
                  let temp = [...sizeData];
                  temp.push(input.size[idx].name);
                  sortSize(temp);
                  setSizeData(temp);
                  //remove this value in input
                  temp = [...input.size];
                  temp.splice(idx, 1)
                  setInput(prevState => ({ ...prevState, size: temp }))
                }}
              >delete </Button>
            </Grid>
          )}
        </Grid>
      </Grid >
      {input.size.length < 8 &&
        <Grid container>
          <Grid item xs={2}> </Grid >
          <Grid item xs={8}>
            <center>
              <Button variant="contained" color="primary" style={{ marginTop: 16, height: 46, width: 90, borderRadius: 0 }}
                onClick={() => {
                  let temp = [...input.size];
                  temp.push({ name: sizeData[0], quantity: 1 });
                  setInput(prevState => ({ ...prevState, size: temp }))
                  temp = [...sizeData];
                  temp.splice(0, 1);
                  setSizeData(temp)
                }}
              >add</Button>
            </center>
          </Grid >
        </Grid>
      }
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>Colors</b></div>
        </Grid>
        <Grid item lg={8} md={10}>
          <Autocomplete className='bg-white autocomplete-multi-custom border-thin-gray' multiple limitTags={7} filterSelectedOptions
            value={colorInputValue}
            onChange={(event, newValue) => {
              setColorInputValue(newValue);
              if (newValue) {
                let temp = [];
                newValue.forEach((e) => temp.push(e._id));
                setColorValue(temp);
              }
            }}
            options={colorData}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (<div {...props}><FiberManualRecordIcon style={{ fill: option.code }} />{option.name}</div>)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip style={{ borderRadius: 4 }} label={option.name} {...getTagProps({ index })} avatar={<FiberManualRecordIcon style={{ fill: option.code }} />} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} placeholder='brown' />
            )}
          />
        </Grid>
      </Grid>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>description</b></div>
        </Grid>
        <Grid item lg={8} md={10}>
          <TextField
            value={input.info}
            onChange={(e) => { setInput(prevState => ({ ...prevState, info: e.target.value })) }}
            className='bg-white textfield-area-custom border-thin-gray'
            variant="standard"
            placeholder="100% Cotton
            - Soft covered seams on neck and shoulders
            - Stitched hem"
            multiline
            rows={4}
            InputProps={{ disableUnderline: true }}
            required
          />
        </Grid>
      </Grid>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2}>
        </Grid>
        <Grid item lg={8} md={10} style={{ textAlign: 'right', marginBottom: 100 }}>
          <div style={{ width: '100%' }}>
            <Button onClick={handleCancel} variant="contained" className='custom-button-outline' style={{ width: 180 }}>Cancel</Button>
            <Button type='submit' variant="contained" className='custom-button' style={{ marginLeft: 20, width: 180 }}>Complete</Button>
          </div>
        </Grid>
      </Grid>
    </form >
  )
}