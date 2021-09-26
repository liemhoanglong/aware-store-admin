import React, { useState } from 'react';
import { Link, Redirect } from "react-router-dom";
import {
  Grid, Button, TextField, Autocomplete, Chip
} from '@mui/material';

const top100Films = [
  { title: 'The Shawshank Redemption', year: 1994 },
  { title: 'The Godfather', year: 1972 },
  { title: 'The Godfather: Part II', year: 1974 },
  { title: 'The Dark Knight', year: 2008 },
  { title: '12 Angry Men', year: 1957 },
  { title: "Schindler's List", year: 1993 },
  { title: 'Pulp Fiction', year: 1994 }
]

export default function CreateProduct(props) {
  const [input, setInput] = useState({
    photo: [],
    name: '',
    categories: [],
    brand: '',
    price: 0,
  })
  return (
    <form>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 50 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>photos</b></div>
        </Grid>
        <Grid item lg={8} md={10}>
          <div style={{ height: '300px' }}>asd</div>
        </Grid>
      </Grid>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>Name</b></div>
        </Grid>
        <Grid item lg={8} md={10}>
          <TextField
            className='bg-white textfield-custom border-thin-gray'
            variant="standard"
            placeholder="Collete Stretch Linen Minidress"
            InputProps={{ disableUnderline: true }}
          />
        </Grid>
      </Grid>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>categories list</b></div>
        </Grid>
        <Grid item lg={8} md={10}>
          <Autocomplete
            className='bg-white autocomplete-multi-custom border-thin-gray'
            multiple limitTags={5} filterSelectedOptions
            options={top100Films.map((option) => option.title)}
            defaultValue={[top100Films[2].title]}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip style={{ borderRadius: 4 }} label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} />
            )}
          />
        </Grid>
      </Grid>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>categories group</b></div>
        </Grid>
        <Grid item lg={8} md={10}>
          <Autocomplete
            className='bg-white autocomplete-multi-custom border-thin-gray'
            multiple limitTags={5} filterSelectedOptions
            options={top100Films.map((option) => option.title)}
            defaultValue={[top100Films[2].title]}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip style={{ borderRadius: 4 }} label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} />
            )}
          />
        </Grid>
      </Grid>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>categories</b></div>
        </Grid>
        <Grid item lg={8} md={10}>
          <Autocomplete
            className='bg-white autocomplete-multi-custom border-thin-gray'
            multiple limitTags={5} filterSelectedOptions
            options={top100Films.map((option) => option.title)}
            defaultValue={[top100Films[2].title]}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip style={{ borderRadius: 4 }} label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} />
            )}
          />
        </Grid>
      </Grid>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>Brand</b></div>
        </Grid>
        <Grid item lg={8} md={10}>
          <Autocomplete
            className='bg-white autocomplete-custom border-thin-gray'
            filterSelectedOptions
            options={top100Films}
            getOptionLabel={(option) => option.title}
            defaultValue={top100Films[2]}
            renderInput={(params) => (
              <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} />
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
          {[0, 1, 2].map((each) =>
            <React.Fragment key={each}>
              <Grid item xs={6}>
                <TextField
                  className='bg-white textfield-custom border-thin-gray'
                  variant="standard"
                  placeholder="Search product"
                  InputProps={{ disableUnderline: true }}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  className='bg-white textfield-custom border-thin-gray'
                  variant="standard"
                  placeholder="200"
                  InputProps={{ disableUnderline: true }}
                />
              </Grid>

            </React.Fragment>
          )}
        </Grid>
        <Grid item container spacing={2} xs={1}>
          {[0, 1, 2].map((each) =>
            <Grid item >
              <Button style={{ height: 46 }} variant="contained" color="error">delete</Button>
            </Grid>
          )}
        </Grid>
      </Grid >
      <Grid container>
        <Grid item xs={2}> </Grid >
        <Grid item xs={8}>
          <center>
            <Button variant="contained" color="primary" style={{ marginTop: 20 }}>add</Button>
          </center>
        </Grid >
      </Grid>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2} style={{ textAlign: 'right' }}>
          <div className='text-12 text-up' style={{ marginRight: 4 }}><b>Colors</b></div>
        </Grid>
        <Grid item lg={8} md={10}>
          <Autocomplete
            className='bg-white autocomplete-multi-custom border-thin-gray'
            multiple limitTags={5} filterSelectedOptions
            options={top100Films.map((option) => option.title)}
            defaultValue={[top100Films[2].title]}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip style={{ borderRadius: 4 }} label={option} {...getTagProps({ index })} />
              ))
            }
            renderInput={(params) => (
              <TextField {...params} variant="standard" InputProps={{ ...params.InputProps, disableUnderline: true }} />
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
            className='bg-white textfield-area-custom border-thin-gray'
            variant="standard"
            placeholder="Model wearing size S
            - Chest: 36”
            - Length: 25.75”"
            multiline
            rows={4}
            InputProps={{ disableUnderline: true }}
          />
        </Grid>
      </Grid>
      <Grid container className='align-items-center' spacing={2} style={{ marginTop: 8 }}>
        <Grid item xs={2}>
        </Grid>
        <Grid item lg={8} md={10} style={{ textAlign: 'right', marginBottom: 100 }}>
          <div style={{ width: '100%' }}>
            <Button variant="contained" className='custom-button-outline' style={{ width: 180 }}>Cancel</Button>
            <Button variant="contained" className='custom-button' style={{ marginLeft: 20, width: 180 }}>Complete</Button>
          </div>
        </Grid>
      </Grid>
    </form >
  )
}