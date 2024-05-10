"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import "./globals.css";
import Navbar from "../NavBar/page";
import FooterComponent from "../Footer/page";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
const Profile: React.FC = () => {
  const [Profile, setProfile] = useState(null);

  const searchParams = useSearchParams();
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(null);
  const token = searchParams.get("token") ?? "";
  const [wishlistData, setWishlistData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");


  

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
          return null;
        }
        if (!res.ok) {
          console.log("An error occurred");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        console.log("data:", data);
        setProfile(data); // Update the profile state with the response data
      })
      .catch((error) => {
        console.error("Error fetching profile:", error);
      })
      .finally(() => setLoading(false));
  }, [token]);
  
  
console.log("nn",Profile)


return (
    <div className="CartPage">
      <Navbar setSearchQuery={setSearchQuery} isLoggedIn={false} token={token} />
      {!isLoading && (
        <main className='cartmain'>
            <div className="edit">
               <img src="https://www.transparentpng.com/thumb/user/green-user-profile-png-clipart-b8E37K.png" className="product-img" />
<button className="edit-button" onClick={() => {window.location.href = `/EditProfile?token=${token}`}}><FontAwesomeIcon icon={faEdit} />
</button>
               </div> 
          {Profile && (
            <div className="profile-info">
              <div>
                <strong>Username:</strong> {(Profile as any).username}
              </div>
              <div>
                <strong>Name:</strong> {(Profile as any).First_Name} {(Profile as any).Last_Name}
              </div>
              <div>
                <strong>Email:</strong> {(Profile as any).Email}
              </div>
              <div>
                <strong>Address:</strong> {(Profile as any).Address}
              </div>
              <div>
                <strong>Password:</strong> {(Profile as any).password}
              </div>
            </div>
          )}
        </main>
        
      )}
      <FooterComponent />
    </div>
  );
  
}

export default Profile;
