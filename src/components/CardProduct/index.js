import React from 'react';
import { Link } from "react-router-dom";

const CardProduct = (props) => {
  let { product } = props;

  return (
    <div className='d-flex' title={product.name}>
      <Link to={`/app/products/edit-product/${product._id}`} className='link-custom'>
        <img className='img-cover' width={30} height={40} src={product.imageList[0]} style={{ marginRight: 16 }} />
      </Link>
      <div>
        <Link to={`/app/products/edit-product/${product._id}`} className='link-custom'>
          <p className='card-product-name m-0'>{product.name}</p>
        </Link>
        <p className='m-0 text-gray'>{product.catelist[0].name}, {product.categroup[0].name}</p>
      </div>
    </div>
  )
}

export default CardProduct;
