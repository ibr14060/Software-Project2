"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import "./globals.css";
import Navbar from "../NavBar/page";
import FooterComponent from "../Footer/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCreditCard, faTrash } from "@fortawesome/free-solid-svg-icons";
import { faCcMastercard, faPaypal } from "@fortawesome/free-brands-svg-icons";

const Cart: React.FC = () => {
  const [productdata, setProductData] = useState<any[]>([]);
  const searchParams = useSearchParams();
  const [isLoading, setLoading] = useState(true);
  const token = searchParams.get("token") ?? "";
  const coupon = searchParams.get("coupon") ?? "";
  const [discountedTotalPrice, setDiscountedTotalPrice] = useState<number | null>(null);
  const [couponApplied, setCouponApplied] = useState(false);
  const [tot, setTot] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [profile, setProfile] = useState([]);
  const [Address, setAddress] = useState<any[]>([]);
  const [Payment, setPayment] = useState<any[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<string>("");
  const [selectedAddress, setSelectedAddress] = useState<string>("");



  const calculateTotalforcustomizationPrice = () => {
    let totalPrice = 0;

    productdata.forEach((product) => {
      if (product.type === 'Customization') {
        let price = product.ProductPrice;

        // Apply logic based on color
        if (product.color) {
          price *= 1.3; // Multiply by 1.3 if there is a color
        }

        // Apply logic based on height
        if (product.height === '40') {
          price *= 1.2; // Multiply by 1.2 if height is 40
        } else if (product.height === '50') {
          price *= 1.5; // Multiply by 1.5 if height is 50
        }

        // Apply logic based on material
        switch (product.material) {
          case 'Wood':
            price *= 1.3; // Multiply by 1.3 if material is wood
            break;
          case 'Stainless steel':
            price *= 1.5; // Multiply by 1.5 if material is stainless steel
            break;
          default:
            break;
        }

        totalPrice += price * product.quantity;
      }
    });

    return Number(totalPrice.toFixed(2)); // Return totalPrice as a number
  };
console.log("calculateTotalforcustomizationPrice",calculateTotalforcustomizationPrice());
  const calculateTotalPrice = () => {
    let purchaseTotal = 0;
    let rentTotal = 0;
    let customizationTotal = 0;

    productdata.forEach((product) => {
      if (product.type === 'purchase') {
        purchaseTotal += product.ProductPrice * product.quantity;

      } else if (product.type === 'rent') {
        const days = (new Date(product.enddate).getTime() - new Date(product.startdate).getTime()) / (1000 * 60 * 60 * 24);
        rentTotal += days * (product.ProductPrice / 300);

      } else if (product.type === 'Customization') {
        customizationTotal = calculateTotalforcustomizationPrice(); // Calculate the total price for customization products
      }
    });
  setTot(Number(purchaseTotal + rentTotal + customizationTotal));
    return Number((purchaseTotal + rentTotal + customizationTotal).toFixed(2));
  };

  useEffect(() => {
   
    const totalPrice = tot;
    if (coupon) {
      handlecoupon();
    } else {
      setDiscountedTotalPrice(totalPrice);
    }
  }, [tot, coupon]);
  
  // Remove the calculation of total price from the handlecoupon function
  const handlecoupon = async () => {
    try {
      const response = await fetch(`http://localhost:4000/coupon/getCoupon/${coupon}`, {
        method: 'GET',
      });
  
      const responseData = await response.json();
      if (responseData.statusCode === 500) {
        console.log("Coupon wrong ");
      } else {
        if (!couponApplied) {
          const discountPercentage = responseData.value;
          const discountAmount = calculateTotalPrice() * (discountPercentage / 100);
          let totalPrice = tot;
          totalPrice -= discountAmount;
          totalPrice = Number(totalPrice.toFixed(2));
          setDiscountedTotalPrice(totalPrice);
          setCouponApplied(true);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
    console.log(discountedTotalPrice,'discountedTotalPrice');
console.log(couponApplied,'couponApplied');
  useEffect(() => {
    const items = JSON.parse(decodeURIComponent(searchParams.get("items") || "[]"));

    const fetchProductDetails = async (id: string) => {
      try {
        const response = await fetch(`http://localhost:4000/products/getProduct/${id}`, {
          headers: {
            Authorization: `${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Error fetching product");
        }

        return response.json();
      } catch (error) {
        console.error(`Error fetching product with id ${id}:`, error);
        return { status: "error", message: "Internal server error", id };
      }
    };

    const loadProducts = async () => {
      try {
        const productDetails = await Promise.all(items.map((item: any) => fetchProductDetails(item.id)));
        const combinedData = productDetails.map((info, index) => ({
          ...info,
          ...items[index],
        }));
        setProductData(combinedData);
      } catch (error) {
        console.error("Error fetching product info:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [token, searchParams]);


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
        setAddress(data.Address);
        setPayment(data.Payment);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      })
      .finally(() => setLoading(false));
  }, [token ,tot]);


  const labels = ["Home", "Work", "Other" ,"Other","Other" ,"Other" ,"Other" ,"Other" ,"Other"]; // Add more labels as needed
    
  
  const handleSelectAddress = (address: string) => {
        if(selectedAddress === address) {
            setSelectedAddress("");
            return;
        }
        setSelectedAddress(address);
    };
    const handleSelectPayment = (payment: string) => {
        if(selectedPayment === payment) {
            setSelectedPayment("");
            return;
        }
        setSelectedPayment(payment);
    };
    const handleCheckout = async () => {
        try {
          const orderData = {
            products: productdata.map(product => ({
              _id: product.id, 
              quantity: product.quantity
            })),
            Address: selectedAddress, // Assuming selectedAddress contains the chosen address
            Payment: selectedPayment, // Assuming selectedPayment contains the chosen payment method
            TotalPrice: discountedTotalPrice !== null ? discountedTotalPrice : calculateTotalPrice()
          };
      
          const response = await fetch("http://localhost:4000/Order/editOrder", {
            method: "POST",
            headers: {
                Authorization: `${token}`,
              },
            body: JSON.stringify(orderData)
          });
      
          if (!response.ok) {
            throw new Error("Error placing order");
          }
      
          // Assuming you want to redirect the user to a confirmation page after successful checkout
          // You can replace this with any desired behavior
          window.location.href = "/confirmation";
        } catch (error) {
          console.error("Error during checkout:", error);
          // Handle error, show error message, etc.
        }
      };
      
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
                <tr key={product.id} className="items">
                  <td>
                    <div className="product">
                      <img src={product.ProductImage || "/placeholder.png"} alt={product.ProductName || "No image available"} className="product-img" />
                      <div className="product-info">
                        <p className="product-name">{product.ProductName}</p>
                        <p className="product-price">{product.ProductPrice} $</p>
                        <p className="product-category">Specifications :{product.ProductSpecifications}</p>
                        {product.type === 'Customization' && (
                          <>
                            <p className="product-category">Material :{product.material}</p>
                            <div className="product-categoryss" style={{ backgroundColor: product.color, width: '20px', height: '20px' }}></div>
                            <p className="product-category">Size :{product.width}X{product.height}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </td>
                  <td>
                    {product.type === 'rent' && (
                      <div className="renttqutt">
                        <div className="startend">
                          <div className="start">
                            <p className="dates"><strong>Start Date:</strong> {new Date(product.startdate).toLocaleDateString()}</p>
                            <p className="dates"><strong>End Date:</strong> {new Date(product.enddate).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    )}
                    {product.type === 'purchase' && (
                      <div className="quantity">
                        <p>{product.quantity}</p>
                      </div>
                    )}
                    {product.type === 'Customization' && (
                      <div className="quantity">
                        <p>{product.quantity}</p>
                      </div>
                    )}
                  </td>
                  <td>
                    {product.type === 'purchase' && (
                      <p className="total">{product.ProductPrice * product.quantity} $</p>
                    )}
                    {product.type === 'rent' && (
                      <p className="total">
                        {(((new Date(product.enddate).getTime() - new Date(product.startdate).getTime()) / (1000 * 60 * 60 * 24)) * (product.ProductPrice / 300)).toFixed(2)} $
                      </p>
                    )}
                    {product.type === 'Customization' && (
                      <p className="total">{calculateTotalforcustomizationPrice()} $</p>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="Addressandpayment">
  <div className="address">
    <h3>Choose your delivery address</h3>
   
      {Address.map((ADD: any, index: number) => (
         <div
         className={`innerpayment ${selectedAddress === `${ADD}` ? "selected" : ""}`}
         onClick={() => handleSelectAddress(`${ADD}`)}
         >
        <div key={index} className="address-item">
          <p><strong>{labels[index]}: </strong> {ADD}</p>
        </div>
        </div>
      ))}
   
  </div>
  <div className="paymentt">
    <h3>Choose your payment method</h3>
      {Payment.map((PAY: any, index: number) => (
            <div  className={`inneraddress ${selectedPayment === `${PAY.type}` ? "selected" : ""}`}
            onClick={() => handleSelectPayment(`${PAY.type}`)}
           >

        <div key={index} className="payment-item">
          {PAY.type === "Paypal" && (
            <p className="product-d">
              <strong>Type: </strong> {PAY.type} 
              <FontAwesomeIcon className="creditcardd" icon={faPaypal}/>
            </p>
          )}
          {PAY.type === "MasterCard" && (
            <p className="product-d">
              <strong>Type: </strong> {PAY.type} 
              <FontAwesomeIcon className="creditcardd" icon={faCcMastercard}/>
            </p>
          )}
          {PAY.type === "Credit Card" && (
            <p className="product-d">
              <strong>Type: </strong> {PAY.type} 
              <FontAwesomeIcon className="creditcardd" icon={faCreditCard}/>
            </p>
          )}
          {PAY.type !== "Paypal" && (
            <>
              <p className="product-d"><strong>Name: </strong> {PAY.name}</p>
              <p className="product-d"><strong>Expiry Date: </strong> {PAY.expiry}</p>
              <p className="product-d"><strong>Number: </strong> {PAY.number}</p>
              <p className="product-d"><strong>CVV: </strong> {PAY.cvv}</p>
            </>
          )}
          {PAY.type === "Paypal" && (
            <>
              <p className="product-d"><strong>Account: </strong> {PAY.account}</p>
              <p className="product-d"><strong>Account Type: </strong> {PAY.accounttype}</p>
            </>
          )}
        </div>
        </div>
      ))}

  </div>
</div>

          <div className="checkout">
            <div className="total-price">
              <p>Total: {discountedTotalPrice !== null ? discountedTotalPrice : calculateTotalPrice()} $</p>
            </div>
            <button className="checkoutbtn" type="button">Checkout</button>
          </div>
        </main>
      )}
      <FooterComponent />
    </div>
  );
}

export default Cart;
