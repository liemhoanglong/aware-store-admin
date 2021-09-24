import React from 'react';

const CardProduct = (props) => {
  let { product } = props;

  return (
    <div className='d-flex' title={product.name}>
      <img className='img-cover' width={30} height={40} src={product.imageList[0]} alt={product.name} style={{ marginRight: 16 }} />
      <div >
        <p className='card-product-name m-0'>{product.name}</p>
        <p className='m-0 text-gray'>{product.catelist[0].name}, {product.categroup[0].name}</p>
      </div>
    </div>
  )
}

export default CardProduct;
