"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import "./globals.css";
import Link from 'next/link';
import Navbar from "../GuestNavBar/page";
import FooterComponent from "../Footer/page";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


const TopOffersCard = ({ product, isInWishlist ,isInFavItems,token, toggleWishlist ,toggleFavItems}: { product: any, isInWishlist: boolean,isInFavItems:boolean, token : string , toggleWishlist: () => void ,toggleFavItems :() => void}) => {
  

  const handlecart = async () => {
    try {
      console.log("product id: ", product._id);
      const response = await fetch('http://localhost:4000/cart/editCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({ products: [`${product._id}`, 1] }), 
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
  const handlewishlist = async () => {
    try {
      console.log("product id: ", product._id);
      const response = await fetch('http://localhost:4000/Wishlist/editWishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({ products: [`${product._id}`] }), 
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
  const handleRent = async () => {
    window.location.href = `/Rent?id=${product._id}&token=${token}`;
  }
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img className='product-image' src={product.TopOffersImage} alt={product.TopOffersName} />
        <Link href={`/Product?id=${product._id}&token=${token}`} className="view-product-button">
          View Product
        </Link>
        <div className="Actionns">

        <button
          className={`add-to-wishlist-button ${isInWishlist ? "selected" : ""}`}
          onClick={toggleWishlist}
        >
          {isInWishlist ? "★" : "☆"}
        </button>
        </div>
      </div>
      <div className="product-details">
        <h2>{product.TopOffersName}</h2>
        <p className="price">${product.TopOffersPrice}</p>{" "}
        <p className="category">{product.TopOffersCategory}</p>{""}
        <div className="offerval">
        <p className="category">{product.TopOffersDiscount}</p>{""}
        <p className="category">{product.TopOffersPeriod}</p>{""}
        </div>
        <div className="buttons-container">
          <button className="add-to-cart-button" onClick={handlecart}>Add to Cart</button>
          <button className="rent-button" onClick={handleRent}>Rent</button>
        </div>
      </div>
    </div>
  );
};


const ProductCard = ({ product, isInWishlist ,token, toggleWishlist}: { product: any, isInWishlist: boolean, token : string , toggleWishlist: () => void }) => {
  

  const handlecart = async () => {
    try {
      console.log("product id: ", product._id);
      const response = await fetch('http://localhost:4000/cart/editCart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`
        },
        body: JSON.stringify({ products: [`${product._id}`, 1] }), 
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
  const handleRent = async () => {
    window.location.href = `/Rent?id=${product._id}&token=${token}`;
  }
  const stars =["★★★★★","★★★★","★★★","★★★★★","★★★","★★","★","★★★★★","★★★★"]
 const numreview =[12,98,34,33,56,75,43,26,78,66,54,78,67,254,109]
  return (
    <div className="product-card">
      <div className="product-image-container">
        <img className='product-image' src={product.ProductImage} alt={product.ProductName} />
        <Link href={`/GuestProduct?id=${product._id}`} className="view-product-button">
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
        <p className="category">{product.ProductCategory}</p>{""}
        <div className="buttons-container">
          <button className="add-to-cart-button" onClick={handlecart}>Add to Cart</button>
          <button className="rent-button" onClick={handleRent}>Rent</button>
        </div>
        <div className="rating">
            <span className="stars">{stars[Math.floor(Math.random() * stars.length)]}</span>
            <span className="num-reviews">({numreview[Math.floor(Math.random() * numreview.length)]})</span>
        </div>

      </div>
    </div>
  );
};


const HomePage: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [TopOffers, setTopOffers] = useState([]);
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = searchParams.get("token") ?? "";
  const [wishlistData, setWishlistData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  useEffect(() => {
    fetch("http://localhost:4000/topOffers/getGuestTopOffers", {

    })
      .then((res) => {
        if (res.status === 401) {
          console.log("Unauthorized");
          window.location.href = "/Login";
          return [];
        }
        if(!res.ok) {
          console.error("Error fetching data");
          return [];
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);

        setTopOffers(data);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      });
  }, []);
  useEffect(() => {
    fetch("http://localhost:4000/products/getGuestProducts", {

    })
      .then((res) => {
        if (res.status === 401) {
          console.log("Unauthorized");
          window.location.href = "/Login";
          return [];
        }
        if(!res.ok) {
          console.error("Error fetching data");
          return [];
        }
        return res.json();
      })
      .then((data) => {
        console.log(data);

        setProducts(data);

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setError(error);
        setLoading(false);
      });
  }, []);
  const filteredTopOffers = TopOffers.filter((toy: any) =>
    toy.TopOffersName.toLowerCase().includes(searchQuery.toLowerCase())
);
const filteredProducts = products.filter((toy: any) =>
    toy.ProductName.toLowerCase().includes(searchQuery.toLowerCase())
);

console.log("token: ", token);
  console.log("products: ", products);

  return (
    <div className="homepage">
      <Navbar setSearchQuery={setSearchQuery} isLoggedIn={false} token={token} />
      <div className="mostselling">
    <h2> Extra Sale</h2>
 <div className="mostselling-container-wrapper">
 <div className="mostselling-container">

        {filteredTopOffers.map((product: any) => (
           <TopOffersCard 
           key={product.id}
           product={product}
           isInWishlist={false}
           isInFavItems={false}  // Check if product is in wishlist
           token={token} 
           toggleWishlist={() => ""} 
           toggleFavItems={() => ""} 
                 />
        ))}
            <div className="exploremore-container">
      <ul>
        <li>
          <a href="/GuestPage" className="animated-arrow">
            <span className="main">
              <span className="text">Explore More</span>
              <span className="the-arrow -right">
                <span className="shaft"></span>
              </span>
            </span>
            <span className="the-arrow -left">
              <span className="shaft"></span>
            </span>
          </a>
        </li>
      </ul>
    </div>
      </div>
      </div>
 </div>
    <div className="content">
      { (
        filteredProducts.map((product: any) => (
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
