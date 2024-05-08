"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import "./globals.css";
import Link from 'next/link';
import Navbar from "../NavBar/page";
import FooterComponent from "../Footer/page";
const getProducts = async (token: string ) => {
  try {
    const res = await fetch('http://localhost:4000/products/getProducts', {
      headers: {
        'Authorization': `${token}`
      }
    
    });
    if (res.status === 401) {
      console.log("Unauthorized");
      return [];
    }
    if (!res.ok) {
      console.log("An error occurred");
      return [];
    }
    const data = await res.json();
    console.log("Data: ", data);
    return data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
}
const ProductCard = ({ product, isInWishlist ,token, toggleWishlist}: { product: any, isInWishlist: boolean, token : string , toggleWishlist: () => void }) => {
  

  const handlecart = async () => {
    try {
      const response = await fetch('http://localhost:4000/cart/editCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({products:[`${product.id}`,1] }),
      });

      // Handle response
      if (response.ok) {
        // Login successful
        const data = await response.json();
        console.log(data);
      } else {
        // Login failed
        console.error('adding failed');
      }
    } catch (error) {
      console.error('Error adding product to cart:', error);
    }
  };
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img className='product-image' src={product.ProductImage} alt={product.ProductName} />
        <Link href={`/product/${product.id}/${token}`} className="view-product-button">
          View Product
        </Link>
        <button
          className={`add-to-wishlist-button ${isInWishlist ? "selected" : ""}`}
          onClick={toggleWishlist}
        >
          {isInWishlist ? "★" : "☆"}
        </button>
      </div>
      <div className="product-details">
        <h2>{product.ProductName}</h2>
        <p className="price">${product.ProductPrice}</p>{" "}
        <div className="buttons-container">
          <button className="add-to-cart-button" onClick={handlecart}>Add to Cart</button>
        </div>
      </div>
    </div>
  );
};


const HomePage: React.FC = () => {
  const [products, setProducts] = useState([]);
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = searchParams.get("token") ?? "";
  const [wishlistData, setWishlistData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProducts(token);
      setProducts(data);
      setLoading(false);
    };

    fetchData();
  }, [token]);

  
  console.log("token: ", token);
  console.log("products: ", products);

  return (
    <div className="homepage">
      <Navbar setSearchQuery={setSearchQuery} isLoggedIn={false} token={token} />
    <div className="content">
      { (
        products.map((product: any) => (
          <ProductCard 
            key={product.id}
            product={product}
            isInWishlist={false}
            token={token} 
            toggleWishlist={() => ""}          />
        ))
      )}
    </div>
    <FooterComponent /> 

    </div>
);
};

export default HomePage;
