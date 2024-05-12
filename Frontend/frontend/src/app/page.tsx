"use client";
import React, { useState, useEffect } from 'react';
import "./globals.css";
import { useSearchParams } from "next/navigation";
import Link from 'next/link';
import Navbar from './GuestNavBar/page';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css'
import slideImages from './slideshow.json';
import FooterComponent from './Footer/page';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faRightToBracket} from "@fortawesome/free-solid-svg-icons";
import { get } from 'http';
function LoginPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="popupmain">
      <div className="popuplogin-inner">
        <h2>Alert !</h2>
        <FontAwesomeIcon icon={faRightToBracket} className="faRightToBracket-icon" />
        <p>You need to be logged in first </p>
        <button className="close-btn" onClick={onClose}>Go to login</button>
      </div>
    </div>
  );
}
const ProductCard = ({ product }: { product: any }) => {
  const [isWishlistSelected, setWishlistSelected] = useState(false);
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
   const [showLoginPopup, setshowLoginPopup] = useState(false);
  const toggleWishlist = () => {
    setWishlistSelected(!isWishlistSelected);
  };
  const NavigateTologin = () => {
    setshowLoginPopup(true);
  }
  const closeLoginPopup = () => {
    setshowLoginPopup(false);
    window.location.href = '/login';
};

  return (
    <div className="mostsellingproduct-card">
      <div className="product-image-container">
        <img className='product-image' src={product.ProductImage} alt={product.ProductName} />
        <Link href={`/guestproduct/${product._id}`} className="view-product-button">
  View Product
</Link>
        <button
          className={`add-to-wishlist-button ${isWishlistSelected ? "selected" : ""}`}
          onClick={toggleWishlist}
        >
          {isWishlistSelected ? "★" : "☆"}
        </button>
      </div>
      <div className="product-details">
        <h2>{product.ProductName}</h2>
        <p>{product.category}</p>
        <p className="price">${product.ProductPrice}</p>{" "}
        <div className="buttons-container">
        <button className="add-to-cart-button" onClick={NavigateTologin}>Add to Cart</button>
        
        </div>
        {showLoginPopup && <LoginPopup onClose={closeLoginPopup} />}
      </div>
      
    </div>
  );
};


const FirstPage = () => {
  const [products, setProducts] = useState([]);
  const [slideshow,setslideshow] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = searchParams.get("token") ?? "";   
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
    },[] ); // Add token to dependency array to re-fetch data when token changes


  return (
    <div className="firstpage">
      <Navbar setSearchQuery={setSearchQuery} isLoggedIn={false} token={token} />
      <div className="firstpage-content">
       <div className="slide-container" id='slide-container'>
       <Slide >
        {slideImages.map((slideImage) => (
            <Link href={`/guestcategory/${slideImage.catid}` } style={{ textDecoration: 'none' }}>
            <div className="each-slide-effect" key={slideImage.id}>
              <div style={{ 'backgroundImage': `url(${slideImage.Image})` }}>
                <button className='slidebut'>{slideImage.category}</button>
              </div>
            </div>
          </Link>
        ))}

        </Slide>
        </div>
        <section id='about-us-section'>
        <h1>
            <span>T</span>
            <span>O</span>
            <span>Y</span>
            <span>S</span>
            <span> </span>
            <span>H</span>
            <span>U</span>
            <span>B</span>
        </h1>

<p><span className='welcome'>Welcome</span> to <span className="storename">Toys Hub</span>, your premier online destination for all things playful and delightful! Step into a world of wonder where imagination knows no bounds. Our curated collection features a delightful array of toys, captivating cartoons, vibrant stickers, trendy slippers, and charming keychains, ready to bring joy to children and the young at heart. Whether you're searching for the perfect gift or treating yourself to a whimsical indulgence, <span className="storename">Toys Hub</span> offers something special for every age and interest. Explore our treasure trove of fun-filled delights and embark on an adventure filled with laughter, creativity, and endless smiles. Experience the magic of <span className="storename">Toys Hub</span> today, where every moment is an opportunity for enchantment!</p>
</section>
<h2>Most Selling</h2>
<div className="mostselling-container-wrapper">
 <div className="mostselling-container">

 {products.map((toy: any) => (
          <ProductCard key={toy.id} product={toy} />
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
 <h2> Extra Sale</h2>
 <div className="mostselling-container-wrapper">
 <div className="mostselling-container">

        {products.map((toy: any) => (
          <ProductCard key={toy._id} product={toy} />
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
 <FooterComponent /> 

    </div>
  );
};

export default FirstPage;