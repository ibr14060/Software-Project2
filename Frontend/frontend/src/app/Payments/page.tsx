"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import "./globals.css";
import Navbar from "../NavBar/page";
import FooterComponent from "../Footer/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faCcMastercard, faPaypal } from "@fortawesome/free-brands-svg-icons"
const Payment: React.FC = () => {
  const [profile, setProfile] = useState([]);
  const [Payment, setPayment] = useState<any[]>([]);
  const [newPayment, setNewPayment] = useState("");
  const searchParams = useSearchParams();
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = searchParams.get("token") ?? "";
  const [wishlistData, setWishlistData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const[isPaypal,setIsPaypal]=useState(false);
  const[isCreditCard,setIsCreditCard]=useState(true);
  const[isMasterCard,setIsMasterCard]=useState(false);
  const handlePaypal = () => {
    setIsPaypal(true);
    setIsCreditCard(false);
    setIsMasterCard(false);
  };
  const handleMastercard = () => {
    setIsMasterCard(true);
    setIsCreditCard(false);
    setIsPaypal(false);
  };
    const handleCreditcard = () => {
        setIsCreditCard(true);
        setIsMasterCard(false);
        setIsPaypal(false);
    };


  const handleEdit = async (PaymentIndex: number, newValue: string) => {
    try {
      const updatedPayment = [...Payment]; // Create a copy of the Payment array
      updatedPayment[PaymentIndex] = newValue; // Update the Payment at the specified index
      setPayment(updatedPayment); // Update the state with the new Payment array
  
      const requestBody = { "Payment": updatedPayment }; // Send the updated Payment array to the server
      const response = await fetch("http://localhost:4000/profile/editprofile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        console.error("Editing failed");
        if (response.status === 409) {
          // Handle conflict error
        }
      } else {
        const data = await response.json();
        console.log(data);
        window.location.reload();
      }
    } catch (error) {
      console.error("Error editing Payment:", error);
    }
  };
  
  const handleDelete = async (PaymentIndex: number, newValue: string) => {
    try {
      const updatedPayment = Payment.filter((Payment, index) => index !== PaymentIndex);
      const requestBody = { "Payment": updatedPayment };
  
      const response = await fetch(`http://localhost:4000/profile/editprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          Authorization: `${token}`
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        console.error("Editing failed");
        if (response.status === 409) {
          // Handle conflict error
        }
      } else {
        const data = await response.json();
        console.log(data);
        window.location.reload();
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }
  
  const handleAdd = async () => {
    try {
      // Get the new Payment value from the state
      const newPaymentValue = newPayment.trim();
  
      // If the new Payment is empty, do nothing
      if (!newPaymentValue) return;
  
      // Create a copy of the current Payment array
      const updatedPayment = [...Payment, newPaymentValue];
  
      // Send the updated Payment array to the server
      const requestBody = { "Payment": updatedPayment };
  
      const response = await fetch(`http://localhost:4000/profile/editprofile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          Authorization: `${token}`
        },
        body: JSON.stringify(requestBody),
      });
  
      if (!response.ok) {
        console.error("Adding Payment failed");
        if (response.status === 409) {
          // Handle conflict error
        }
      } else {
        const data = await response.json();
        console.log(data);
        window.location.reload();
        setPayment(updatedPayment);
        // Clear the new Payment input field
        setNewPayment("");
      }
    } catch (error) {
      console.error('Error adding Payment:', error);
    }
  } 
  

  useEffect(() => {
    fetch("http://localhost:4000/profile/getprofile", {
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
        setProfile(data);
        setPayment(data.Payment);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => setLoading(false));
  }, [token]);

  console.log("Payment", Payment);
  console.log("token: ", token);
  console.log("products: ", profile);

  const labels = ["Home", "Work", "Other" ,"Other","Other" ,"Other" ,"Other" ,"Other" ,"Other"]; // Add more labels as needed

  return (
    <div className="CartPage">
      <Navbar setSearchQuery={setSearchQuery} isLoggedIn={false} token={token} />
      <header></header>
      <nav></nav>
      {!isLoading && (
        <main className='cartmain'>
          <h1 className="title">Your Payment</h1>
          <table>
            <thead className="table-header">
              <tr>
                <th>Payment</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody>
              {Payment.map((ADD: any, index: number) => (
                <tr key={ADD._id} className="items">
                  <td>
                    <div className="product">
                      <p className="product-category"><strong>{labels[index]} : </strong>{ADD}</p>
                    </div>
                  </td>
                  <td>
                    <div className="quantsity">
                      <input className="email" type="email" id="email" name="email" placeholder="New Payment" onChange={(e) => setNewPayment(e.target.value)} />
                      <button className="edit-button" onClick={() => handleEdit(index, newPayment)}><FontAwesomeIcon icon={faEdit} /></button>
                    </div>
                  </td>
                  <td>
                    <div className="deletee">
                      <button className="edit-button" onClick={() => handleDelete(index, newPayment)}><FontAwesomeIcon icon={faTrash} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
                
        <div className="checkout">
<div className="paymentmethod">
<button className="credit" type="button" onClick={handleCreditcard}>Credit <FontAwesomeIcon icon={faCreditCard}/></button>
<button className="paypal" type="button" onClick={handlePaypal}>Paypal <FontAwesomeIcon icon={faPaypal}/></button>
<button className="Mastercard" type="button" onClick={handleMastercard}>MasterCard <FontAwesomeIcon icon={faCcMastercard}/></button>
</div>
{isCreditCard && (

<div className="creditcard">
<div className="creditcardinfo">
<h2>CreditCard info</h2>
  <input type="text" id="fname" className="cardholder" name="fname" placeholder="Name on Card"/>
  <div className="cardnumbeer">
    <input type="text" id="lname" className="cardnumber" name="lname" placeholder="Card Number"/>
    <p><FontAwesomeIcon className="creditcardd" icon={faCreditCard}/></p>
    </div>
    <div className="expiry-cvv">
    <input type="expirydate" id="lname" className="expiry" name="lname" placeholder="MM/YY"/>
    <input type="text" id="lname" className="cvv" name="lname" placeholder="CVV"/>
    </div>
    </div>
    </div>

)}
{isMasterCard && (

<div className="creditcard">
<div className="creditcardinfo">
<h2>CreditCard info</h2>
  <input type="text" id="fname" className="cardholder" name="fname" placeholder="Name on Card"/>
  <div className="cardnumbeer">
    <input type="text" id="lname" className="cardnumber" name="lname" placeholder="Card Number"/>
    <p><FontAwesomeIcon className="mastercard" icon={faCcMastercard}/></p>
    </div>
    <div className="expiry-cvv">
    <input type="expirydate" id="lname" className="expiry" name="lname" placeholder="MM/YY"/>
    <input type="text" id="lname" className="cvv" name="lname" placeholder="CVV"/>
    </div>
    </div>
    </div>

)}
{isPaypal && (

<div className="paypalhh">
<div className="paypalinfo">
<h2>Paypal account info</h2>
  <div className="cardnumbeer">
  <input type="email" id="fname" className="paypayaccount" name="fname" placeholder="Paypal Account "/>
    <p><FontAwesomeIcon className="paypalinon" icon={faPaypal}/></p>
    </div>
    <div className="expiry-cvv">
    <input type="text" id="lname" className="expiry" name="lname" placeholder="Account Type"/>
    </div>
    </div>
    </div>

)}

          <button className="checkoutbtnn" type="button" onClick={handleAdd}>Add <FontAwesomeIcon icon={faEdit}/></button>

        </div>
        </main>
      )}
      <FooterComponent />
    </div>
  );
}

export default Payment;
