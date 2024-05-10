"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import "./globals.css";
import Navbar from "../NavBar/page";
import FooterComponent from "../Footer/page";

const Cart: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [productinfo, setProductInfo] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const [isLoading, setLoading] = useState(true)
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

  const updateQuantity = async (id: number, quantity: number) => {
    /*
    try {
        const response = await fetch(`http://localhost:4000/cart/updateCart?id=${id}&quantity=${quantity}`, {
            method: "PUT",
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const updatedProducts = products.map((product: { id: number;  }) => {
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
    */
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
        console.log("Data: ", data);
        setProducts(data.products);
  
        // Fetch info for each product
        const productInfoRequests = data.products.map((product : any)  =>
          fetch(`http://localhost:4000/products/getProduct/${product[0]}`, {
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
            {productinfo.map((product: any) => (
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
                  <div className="quantity">
                    <button className="btn-minus" onClick={() => updateQuantity(product._id, Math.max(1, product.quantity - 1))}>-</button>
                    <p>{product.quantity}</p>
                    <button className="btn-plus" onClick={() => updateQuantity(product._id, product.quantity + 1)}>+</button>
                  </div>
                  <button className="del" onClick={() => handleDelete(product._id)}><i className="fa fa-trash"></i></button>
                </td>
                <td>
                  <p className="total">{product.price * product.quantity} $</p>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="checkout">
          <button className="checkoutbtn" type="button">Checkout</button>
        </div>
      </main>
    )}
    <FooterComponent />
  </div>
);
}

export default Cart;
