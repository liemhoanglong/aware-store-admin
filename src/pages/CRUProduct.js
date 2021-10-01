import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from "react-router-dom";
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
import Progress from '../components/Progress';
import config from '../constants/config';
import { sortSize, sortObjectSize } from '../utils/sortSize';

export default function CRUProduct(props) {
  const history = useHistory();
  const location = history.location;
  const isEdit = location.pathname.includes('edit-product');
  const [load, setLoad] = useState(false);

  const [progress, setProgress] = useState(-1);

  const [input, setInput] = useState({
    imageList: [],
    name: '',
    price: 0.00,
    size: [{ name: config.SIZE[0], quantity: 1 }],
    info: '',
  });
  const [inputEdit, setInputEdit] = useState({
    imageList: [],
    name: '',
    price: 0.00,
    size: [{ name: config.SIZE[0], quantity: 1 }],
    info: '',
  });

  const [catelistData, setCatelistData] = useState([{ _id: "6136342577e31326701a18fd", name: "Men" }, { _id: "6136343677e31326701a1901", name: "Ladies" }, { _id: "6136343b77e31326701a1903", name: "Girls" }, { _id: "6136346c9f814a47407fae2b", name: "Boys" }]);
  const [categroupData, setCategroupData] = useState([]);
  const [cateData, setCateData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [colorData, setColorData] = useState([]);
  const [sizeData, setSizeData] = useState(config.SIZE.slice(1));

  const [catelistValue, setCatelistValue] = useState([]);
  const [catelistValueEdit, setCatelistValueEdit] = useState([]);

  const [categroupValue, setCategroupValue] = useState([]);
  const [categroupValueEdit, setCategroupValueEdit] = useState([]);

  const [cateValue, setCateValue] = useState([]);
  const [cateValueEdit, setCateValueEdit] = useState([]);

  const [brandValue, setBrandValue] = useState(null);
  const [brandValueEdit, setBrandValueEdit] = useState(null);
  const [brandInputValue, setBrandInputValue] = useState(null);

  useEffect(() => {
    if (!brandValue) {
      setBrandInputValue(null);
      return;
    }
    if (brandInputValue && brandValue === brandInputValue.id) {
      return;
    }
    let temp = brandData.find((e) => brandValue === e._id);
    setBrandInputValue(temp);
  }, [brandValue]);

  const [colorValue, setColorValue] = useState([]);
  const [colorValueEdit, setColorValueEdit] = useState([]);

  const [imgIndex, setImgIndex] = useState(0);
  const [textFieldIamge, setTextFieldImage] = useState('');
  const [openUploadImg, setOpenUploadImg] = useState(false);
  const [openEditImg, setOpenEditImg] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);
  const [openMsg, setOpenMsg] = useState({ status: false, type: 'success', msg: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoad(true);
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
      } catch (err) {
        setLoad(false);
        console.log(err);
      }
      setLoad(false);
    }
    fetchData();
  }, [])

  const [soldValue, setSoldValue] = useState([])
  const [reset, setReset] = useState(false)
  useEffect(() => {
    const fetchData = async () => {
      if (isEdit) {
        let parsePathname = location.pathname.split('/');
        let productId = parsePathname[4];
        try {
          setLoad(true);
          let res = await CallAPI(`/product/admin/${productId}`, 'get', {});
          let product = res.data.data;
          setBrandValue(product.brand);
          setInput({
            imageList: product.imageList,
            name: product.name,
            price: product.price,
            size: product.size,
            info: product.info.replace(/<br>/g, '\r\n'),
          })
          setInputEdit({
            imageList: product.imageList,
            name: product.name,
            price: product.price,
            size: product.size,
            info: product.info.replace(/<br>/g, '\r\n'),
          })
          setCatelistValue(product.catelist);
          setCatelistValueEdit(product.catelist);
          setCategroupValue(product.categroup);
          setCategroupValueEdit(product.categroup);
          setCateValue(product.cate);
          setCateValueEdit(product.cate);
          setBrandValueEdit(product.brand);
          setColorValue(product.colors);
          setColorValueEdit(product.colors);
          let sizeDataTemp = config.SIZE;
          for (let i = 0; i < product.size.length; i++) {
            sizeDataTemp = sizeDataTemp.filter(e => e !== product.size[i].name);
          }
          setSizeData(sizeDataTemp)
          setSoldValue(product.sold)
        } catch (err) {
          setLoad(false);
          console.log(err)
        }
        setLoad(false);
      }
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
    setProgress(-1);
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
    info = info.replace(/\r?\n/g, '<br>');
    //create data to send to server
    let data = {
      ...input, size, sold, info,
      catelist: catelistValue,
      categroup: categroupValue,
      cate: cateValue,
      brand: brandValue,
      colors: colorValue,
    };
    console.log(data)
    try {
      setLoad(true);
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
      setLoad(false);
    }
    setLoad(false);
  }

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
    setSizeData(config.SIZE.slice(1));
  }

  const handleEditProduct = async (e) => {
    e.preventDefault();
    //cope size to sold and set default quantity = 0
    let size = [...input.size];
    size = sortObjectSize(size);
    let sold = []
    let soldIndex = -1;
    for (let i = 0; i < size.length; i++) {
      soldIndex = soldValue.findIndex(e => e.name === size[i].name);
      if (soldIndex > -1) {
        sold = [...sold, soldValue[soldIndex]];
      } else {
        sold = [...sold, { name: size[i].name, quantity: 0 }];
      }
    }
    //conver input.info breakline /r/n info to <br/> 
    let info = input.info;
    info = info.replace(/\r?\n/g, '<br>');
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
      setLoad(true);
      let parsePathname = location.pathname.split('/');
      let productId = parsePathname[4];
      let res = await CallAuthAPI('/product/' + productId, 'put', data);
      if (res.status === 200) {
        setOpenMsg({ status: true, type: 'success', msg: 'Update product successful' });
        setReset(!reset);
      }
    } catch (err) {
      if (err.response)
        setOpenMsg({ status: true, type: 'error', msg: err.response.data.err });
      else
        setOpenMsg({ status: true, type: 'error', msg: 'Connection to sever lost!' });
      console.log(err)
      setLoad(false);
    }
    setLoad(false);
  }

  const handleCancelEdit = () => {
    setInput(inputEdit)
    setCatelistValue(catelistValueEdit);
    setCategroupValue(categroupValueEdit);
    setCateValue(cateValueEdit);
    setBrandValue(brandValueEdit);
    setColorValue(colorValueEdit);
    let sizeDataTemp = config.SIZE;
    for (let i = 0; i < inputEdit.size.length; i++) {
      sizeDataTemp = sizeDataTemp.filter(e => e !== inputEdit.size[i].name);
    }
    setSizeData(sizeDataTemp)
  }

  const handleCloseAlert = () => {
    setOpenMsg({ status: false, type: 'success', msg: '' })
  }

  return (
    <form >
      <Progress isLoad={load} />
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
        progress={progress}
        setProgress={setProgress}
      />
      <PopupImage
        open={openUploadImg}
        textFieldIamge={textFieldIamge}
        setTextFieldImage={setTextFieldImage}
        handleClose={() => setOpenUploadImg(false)}
        handleSubmit={() => handleAddImage()}
        title={'Upload image'}
        progress={progress}
        setProgress={setProgress}
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
            value={catelistData.filter((e) => catelistValue.includes(e._id))}
            onChange={(event, newValue) => {
              if (newValue) {
                let temp = [];
                newValue.forEach((e) => {
                  if (typeof e === "string") temp.push(e);
                  else temp.push(e._id)
                });
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
            isOptionEqualToValue={(option, value) => {
              return option._id === value._id;
            }}
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
            value={categroupData.filter((e) => categroupValue.includes(e._id))}
            onChange={(event, newValue) => {
              if (newValue) {
                let temp = [];
                newValue.forEach((e) => {
                  if (typeof e === "string") temp.push(e);
                  else temp.push(e._id)
                });
                setCategroupValue(temp);
              }
            }}
            options={categroupData}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => {
              return option._id === value._id;
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip style={{ borderRadius: 4 }} label={option.name} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} placeholder='Tops' />
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
            value={cateData.filter((e) => cateValue.includes(e._id))}
            onChange={(event, newValue) => {
              if (newValue) {
                let temp = [];
                newValue.forEach((e) => {
                  if (typeof e === "string") temp.push(e);
                  else temp.push(e._id)
                });
                setCateValue(temp);
              }
            }}
            options={cateData}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => {
              return option._id === value._id;
            }}
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
          {/* {JSON.stringify(brandData.filter((e) => e._id === brandValue)[0])}
          <Autocomplete className='bg-white autocomplete-custom border-thin-gray' filterSelectedOptions
            value={brandData.filter((e) => e._id === brandValue)[0]}
            // value={{ _id: "6136e0acbaab7e1fccb62858", name: "H&M", __v: 0 }}
            onChange={(event, newValue) => {
              if (newValue) {
                setBrandValue(newValue._id);
              } else {
                setBrandValue("");
              }
            }}
            options={brandData}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => {
              return option.name === value.name;
            }}
            renderInput={(params) => (
              <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} placeholder='H&M' required />
            )}
          /> */}
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
                {isEdit && idx < soldValue.length ?
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
                    disabled
                  />
                  :
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
                }
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className='bg-white textfield-custom border-thin-gray'
                  value={each.quantity}
                  onChange={(event) => {
                    let temp = [...input.size];
                    temp[idx] = { ...temp[idx], quantity: Number(event.target.value > -1 ? event.target.value : 0) };
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
              {isEdit && idx < soldValue.length ?
                <Button
                  style={{ height: 46, borderRadius: 0, marginBottom: 1 }} variant="contained" color="error"
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
                  disabled
                >delete </Button>
                :
                <Button
                  style={{ height: 46, borderRadius: 0, marginBottom: 1 }} variant="contained" color="error"
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
              }
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
            value={colorData.filter((e) => colorValue.includes(e._id))}
            onChange={(event, newValue) => {
              if (newValue) {
                let temp = [];
                newValue.forEach((e) => {
                  if (typeof e === "string") temp.push(e);
                  else temp.push(e._id)
                });
                setColorValue(temp);
              }
            }}
            options={colorData}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (<div {...props}><FiberManualRecordIcon style={{ fill: option.code }} />{option.name}</div>)}
            isOptionEqualToValue={(option, value) => {
              return option._id === value._id;
            }}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip style={{ borderRadius: 4 }} label={option.name} {...getTagProps({ index })} avatar={<FiberManualRecordIcon style={{ fill: option.code }} />} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} placeholder='Brown' />
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
        {isEdit ?
          <Grid item lg={8} md={10} style={{ textAlign: 'right', marginBottom: 100 }}>
            <div style={{ width: '100%' }}>
              <Button onClick={handleCancelEdit} variant="contained" className='custom-button-outline' style={{ width: 180 }}>Cancel</Button>
              <Button onClick={(e) => handleEditProduct(e)} variant="contained" className='custom-button' style={{ marginLeft: 20, width: 180 }}>Save</Button>
            </div>
          </Grid>
          :
          <Grid item lg={8} md={10} style={{ textAlign: 'right', marginBottom: 100 }}>
            <div style={{ width: '100%' }}>
              <Button onClick={handleCancel} variant="contained" className='custom-button-outline' style={{ width: 180 }}>Cancel</Button>
              <Button onClick={(e) => handleAddProduct(e)} variant="contained" className='custom-button' style={{ marginLeft: 20, width: 180 }}>Complete</Button>
            </div>
          </Grid>
        }
      </Grid>
    </form >
  )
}