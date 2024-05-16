"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import "./globals.css";
import Navbar from "../NavBar/page";
import FooterComponent from "../Footer/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Cart: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [productinfo, setProductInfo] = useState<any[]>([]);
  const [productdata, setProductData] = useState<any[]>([]);
  const [coupon, setCoupon] = useState("");
  const searchParams = useSearchParams();
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(null);
  const token = searchParams.get("token") ?? "";
  const [wishlistData, setWishlistData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [discountedTotalPrice, setDiscountedTotalPrice] = useState<number | null>(null);
  const [couponApplied, setCouponApplied] = useState(false);



  const handleDelete = async (id: string) => {
    
    try {
        console.log("called");
        console.log(id);
        const response = await fetch(`http://localhost:4000/cart/deleteCart/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `${token}`
            }
        });
        console.log(response.status);
        if (response.status === 200) {
          setProducts(products.filter((product: { id: string }) => product.id !== id));
window.location.reload();
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    
  }
  const handlecoupon = async () => {
    try {
        console.log("called");
        console.log("coupon");
        const response = await fetch(`http://localhost:4000/coupon/getCoupon/${coupon}`, {
          method: 'GET',
          headers: {
            Authorization: `${token}`
          }
        });
        console.log(response.status);
        console.log(response);
        const responseData = await response.json(); // Await the response.json() promise
        console.log(responseData);
        if (responseData.statusCode === 500) { // Access the statusCode property
          console.log("Coupon wrong ");
          alert("Coupon is wrong");
        } else {
          if(!couponApplied) {
          // Process the response data here
          let discountPercentage = responseData.value;
          let totalPrice: number = Number(calculateTotalPrice()); // Convert totalPrice to number
          let discountAmount = totalPrice * (discountPercentage / 100); // Calculate discount amount
          totalPrice -= discountAmount;
          totalPrice = Number(totalPrice.toFixed(2)); // Round totalPrice to 2 decimal places
          console.log(totalPrice, "sssdd");
          setDiscountedTotalPrice(totalPrice);
          setCouponApplied(true); // Set couponApplied to true after applying the coupon
          }
          else{
            alert("You have already applied a coupon");

          }
          // Set the updated total price to state or wherever needed
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
    
  }
  const updateQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      handleDelete(productId);
    } else {
      setProductData(productdata.map(product => {
        if (product._id === productId) {
          return { ...product, quantity: newQuantity };
        }
        return product;
      }));
    }
  };
  

  const calculateTotalPrice = () => {
    let purchaseTotal = 0;
    let rentTotal = 0;
  
    productdata.forEach(product => {
      if (product.type === 'purchase') {
        purchaseTotal += product.ProductPrice * product.quantity;
      } else if (product.type === 'rent') {
        const days = (new Date(product.enddate).getTime() - new Date(product.startdate).getTime()) / (1000 * 60 * 60 * 24);
        rentTotal += days * (product.ProductPrice / 300);
      }
    });
  
    return (purchaseTotal + rentTotal).toFixed(2);
  };
  
  
  

  useEffect(() => {
    fetch("http://localhost:4000/cart/getCart", {
      headers: {
        Authorization: `${token}`,
      },
    })
      .then((res) => {
        if (res.status === 401) {
          console.log("Unauthorized");
          window.location.href = "/Login";
          return [];
        }
        if (!res.ok) {
          console.log("An error occurred");
          return [];
        }
        return res.json();
      })
      .then((data) => {
        
        const { products } = data;
        const modifiedProducts = products.map((product: any) => {
          if (product.type === "purchase") {
            return { ...product, quantity: product.quantity ,type: "purchase"};
          }
          else if (product.type === "rent"){
            return { ...product, type: "rent", startdate: product.startdate, enddate: product.enddate ,quantity:0};
          }
          return product;
        });
        setProducts(modifiedProducts); // Update the products state with the products array
        
        console.log("Products: ", products)
       
        
        const productInfoRequests = products.map((product: any) =>
          fetch(`http://localhost:4000/products/getProduct/${product.id}`, {
            headers: {
              Authorization: `${token}`,
            },
          })
        );
  
        Promise.all(productInfoRequests)
          .then((responses) => Promise.all(responses.map((res) => res.json())))
          .then((productInfoData) => {
            console.log("Product Info Data: ", productInfoData);
            setProductInfo(productInfoData);
  
            // Combine product info and product data
            const combinedData = productInfoData.map((info, index) => ({
              ...info,
              
              quantity: parseInt(products[index].quantity),
              startdate: products[index].startdate,
              enddate: products[index].enddate,
              type: products[index].type
              
            }));
            setProductData(combinedData);
          })
          .catch((error) => {
            console.error("Error fetching product info:", error);
          });
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => setLoading(false));
  }, [token]);
  
 console.log("productdata: ", productdata); 
console.log("productinfos: ", productinfo);
  console.log("token: ", token);
  console.log("products: ", products);

  return (
    <div className="CartPage">
      <Navbar setSearchQuery={setSearchQuery} isLoggedIn={false} token={token} />
    <header></header>
    <nav></nav>
    {!isLoading && (
      <main className='cartmain'>
        <h1 className="title">Your Cart</h1>
        <table>
          <thead className="table-header">
            <tr>
              <th>Item</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {productdata.map((product: any) => (
              <tr key={product._id} className="items">
                <td>
                  <div className="product">
                    <img src={product.ProductImage} alt={product.ProductName} className="product-img" />
                    <div className="product-info">
                      <p className="product-name">{product.ProductName}</p>
                      <p className="product-price">{product.ProductPrice} $</p>
                      <p className="product-category">{product.ProductSpecifications}</p>
                    </div>
                  </div>
                </td>
                
                <td>
                {product.type === 'rent' && (
            <div className="renttqutt">
              <div className="startend">
                <div className="start">
              <p className="dates"> <strong>Start Date: </strong>{new Date(product.startdate).toLocaleDateString()}</p>
              <p className="dates"><strong>End Date:</strong> {new Date(product.enddate).toLocaleDateString()}</p>
              </div>
              <button className="dell" onClick={() => handleDelete(product._id)}><FontAwesomeIcon icon={faTrash} /></button>
              </div>
            </div>
          )}
           {product.type === 'purchase' && (
              <div className="quantity">
              <button className="btn-minus" onClick={() => updateQuantity(product._id, Math.max(1, product.quantity - 1))}>-</button>
              <p>{product.quantity}</p>
              <button className="btn-plus" onClick={() => updateQuantity(product._id, product.quantity + 1)}>+</button>
              <button className="del" onClick={() => handleDelete(product._id)}><FontAwesomeIcon icon={faTrash} /></button>

            </div>
          )}
                
                </td>
                <td>
                {product.type === 'purchase' && (
                  <p className="total">{product.ProductPrice * product.quantity} $</p>
                   )}
             {product.type === 'rent' && (
  <p className="total">
  ${
     (((new Date(product.enddate).getTime() - new Date(product.startdate).getTime()) / (1000 * 60 * 60 * 24)) * (product.ProductPrice / 300)).toFixed(2)
    } $
  </p>
)}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
       
        <div className="checkout">
        <div className="total-price">
        <p>Total: {discountedTotalPrice !== null ? discountedTotalPrice : calculateTotalPrice()} $</p>
        </div>

        <input type="text" placeholder="Enter Coupon Code" className="coupon"  onChange={(e) => setCoupon(e.target.value)}/>
        <button className="applybtn" type="button" onClick={handlecoupon}>Apply</button>

          <button className="checkoutbtn" type="button">Checkout</button>

        </div>
      </main>
    )}
    <FooterComponent />
  </div>
);
}

export default Cart;
