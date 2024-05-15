"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import "./globals.css";
import Navbar from "../NavBar/page";
import FooterComponent from "../Footer/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";

const Cart: React.FC = () => {
  const [products, setProducts] = useState([]);
  const [productinfo, setProductInfo] = useState<any[]>([]);
  const [productdata, setProductData] = useState<any[]>([]);
  const [newReview, setNewReview] = useState(''); // Add this line
  const searchParams = useSearchParams();
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(null);
  const token = searchParams.get("token") ?? "";
  const [wishlistData, setWishlistData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:4000/products/deleteReview/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `${token}`
        }
      });
      if (response.status === 200) {
        // Remove the deleted product from the state
        setProducts(prevProducts => prevProducts.filter((product: { _id: string }) => product._id !== id));
      } else {
        console.error('Failed to delete review:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  }
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:4000/products/getUserReviews", {
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
        const { products } = data; // Access the products array correctly
        setProducts(data); // Update the products state with the products array
                 console.log("efdsfsdf" ,data.ProductsReview)
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [token]);
  
  const handleEdit = async (productId: string,  newReview: string) => {
    try {
        const response = await fetch(`http://localhost:4000/products/editReview/${productId}}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `${token}`
            },
            body: JSON.stringify({ review: newReview })
        });
        if (response.status === 200) {
            // Handle success
            console.log("Review edited successfully");
            // You may want to update the state or display a message to indicate success
        } else {
            // Handle other status codes
            console.error("Failed to edit review:", response.statusText);
        }
    } catch (error) {
        console.error('Error editing review:', error);
    }
};

  
 console.log("productdata: ", productdata); 
console.log("productinfos: ", productinfo);
  console.log("token: ", token);
  console.log("products: ", products);
  console.log("products:products ", products);

  return (
    <div className="CartPage">
      <Navbar setSearchQuery={setSearchQuery} isLoggedIn={false} token={token} />
    <header></header>
    <nav></nav>
    {!isLoading && (
      <main className='cartmain'>
        <h1 className="title">Your Reviews</h1>
        <table>
          <thead className="table-header">
            <tr>
              <th>Item</th>
              <th>Review</th>
              <th>Delete</th>
              <th>Edit</th>

            </tr>
          </thead>
          <tbody>
            {products.map((product: any) => (
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
                {product.ProductsReview.map((review: any, index: number) => (
          <p key={index} className="product-review">{review.review}</p>
        ))}                </td>
                <td>
                  <button className="del" onClick={() => handleDelete(product._id)}><FontAwesomeIcon icon={faTrash} /></button>

                </td>
                <td>
                    <div className="editrev">
                        <input type="text" 
                        placeholder="Edit Review" 
                        onChange={(e) => setNewReview(e.target.value)}
                        />
                        <button className="del" onClick={() => handleEdit(product._id, newReview)}><FontAwesomeIcon icon={faEdit} /></button>
                    </div>
                </td>
               
              </tr>
            ))}
          </tbody>
        </table>
       
     
      </main>
    )}
    <FooterComponent />
  </div>
);
}

export default Cart;
