"use client";
import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import "./globals.css";
import Link from 'next/link';
import Navbar from "../NavBar/page";
import FooterComponent from "../Footer/page";



const Cart: React.FC = () => {
    const [products, setProducts] = useState<{ id: number; quantity: number; }[]>([]);
    const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = searchParams.get("token") ?? "";
  const [wishlistData, setWishlistData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
const handleDelete = async (id: number) => {
    try {
        console.log("called");
        console.log(id);
        const response = await fetch(`http://localhost:4000/cart/deleteCart?id=${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        if (response.status === 200) {
            setProducts(products.filter((product: { id: number }) => product.id !== id));
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}
  // Function to update quantity for a product
    const updateQuantity = async (id: number, quantity: number) => {
        try {
        const response = await fetch(`http://localhost:4000/cart/updateCart?id=${id}&quantity=${quantity}`, {
            method: "PUT",
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const updatedProducts = products.map((product: { id: number; quantity: number }) => {
            if (product.id === id) {
                return { ...product, quantity };
            }
            return product;
            });
            setProducts(updatedProducts);
        }
        } catch (error) {
        console.error("Error updating quantity:", error);
        }
    };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:4000/cart/getCart", {
          headers: {
            Authorization: `${token}`,
          },
        });
        if (res.status === 401) {
          console.log("Unauthorized");
          window.location.href = "/Login";
          return [];
        }
        if (!res.ok) {
          console.log("An error occurred");
          return [];
        }
        const data = await res.json();
        console.log("Data: ", data);
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  
  console.log("token: ", token);
  console.log("products: ", products);

  return (
    <body className="CartPage">
      <Navbar setSearchQuery={setSearchQuery} isLoggedIn={false} token={token} />
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
      <header></header>
      <nav></nav>
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
            {products.map((product) => (
              <tr key={product.id} className="items">
                <td>
                  <div className="product">
                    <img src={"product.image"} alt={"product.name"} className="product-img"></img>
                    <div className="product-info">
                      <p className="product-name">{"product.name"}</p>
                      <p className="product-price">{"product.price"} $</p>
                      <p className="product-category">{"product.category"}</p>
                    </div>
                  </div>
                </td>
                <td>
                  <div className="quantity">
                    <button className="btn-minus" onClick={() => updateQuantity(product.id, Math.max(1, product.quantity - 1))}>-</button>
                    <p>{product.quantity}</p>
                    <button className="btn-plus" onClick={() => updateQuantity(product.id, product.quantity + 1)}>+</button>
                  </div>
                  <button className="del"><i className="fa fa-trash" onClick={() => handleDelete(product.id)}></i></button>
                </td>
                <td>
                  <p className="total">{"product.price * product.quantity"} $</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="checkout">
          
          <button className="checkoutbtn" type="button" >Checkout</button>
        </div>
      </main>
      <FooterComponent 

      /> 
    </body>
  );
}

export default Cart;
