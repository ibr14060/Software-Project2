"use client";
import { useSearchParams } from "next/navigation";

import React, { useState, useEffect } from 'react';
import "./globals.css";
import Navbar from "../GuestNavBar/page";
import FooterComponent from '../Footer/page';
const ProductPage = () => {
 
  const [product, setProduct] = useState<any[]>([]);
  const [productinfo, setProductInfo] = useState<any[]>([]);
  const [category, setcategory] = useState(null);
  const [CategoryName, setCategoryName] = useState(null);
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = searchParams.get("token") ?? "";
  const  id  = searchParams.get("id") ?? ""; 
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log(id);
        const response = await fetch(`http://localhost:4000/products/getGuestProduct/${id}`,{

        });
        if (!response.ok) {
          throw new Error('Failed to fetch product data');
        }
        const productData = await response.json();
        setProduct(productData);
        console.log("asas" ,productData);
      } catch (error) {
        console.error('Error fetching product data:', error);
      }
    };
const fetchcategoryData = async () => {

};

    fetchData();
    fetchcategoryData();
  }, [id,token]);

  const NavigateToCart = () => {
    window.location.href = "/Cart";
  };
  const handlecart = async () => {
    try {
      console.log("product id: ", id);
      const response = await fetch('http://localhost:4000/cart/editCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({ products: [`${id}`, 1] }), 
      });
  
      // Handle response
      if (!response.ok) {
        console.error('Adding failed');
        if(response.status === 409) {
        //  window.location.href = '/Login';
        }
      } else {
        const data = await response.json();
        console.log(data);
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };

  return (
    <div className="ProductPage">
      <Navbar setSearchQuery={setSearchQuery} isLoggedIn={false} token={token} />
      <div className="ProductBoody">
        {product ? (
            <div className="productboddy">
                <h1 className="ProductTitle">{(product as any).ProductName}</h1>
                <div className="ProductContainer">
                    <img alt={(product as any).ProductName} src={(product as any).ProductImage} className="ProductImage"/>
                    <div className="ProductInfo">
                        <p className="ProductCategory"> <span><b>Category : </b></span>{(product as any).ProductCategory}</p>
                        <p className="ProductDescribtion"><span><b>Description : </b></span> {(product as any).ProductDescription}</p>
                        <p className="ProductPrice"> <span><b>Price : </b></span> {(product as any).ProductPrice}<span>$ </span></p>
                        <p className="ProductSpecifications"> <span><b>Specifications : </b></span> {(product as any).ProductSpecifications}</p>
                        <p className="ProductRating"> <span><b>Rating : </b></span> {(product as any).ProductCategory}</p>
                        <p className="ProductAvailability"> <span><b>Stock : </b></span> {(product as any).ProductAvailability}</p>
                
                        <button className="add-to-cart-button" onClick={handlecart}>Add to Cart</button>
                    </div>
                </div>
            </div>
        ) : (
          <p>No product found</p>
        )}
      </div>
      <FooterComponent /> 
    </div>
  );
};

export default ProductPage;