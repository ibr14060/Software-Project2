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
            <table>
          <thead className="table-header">
            <tr>
              <th>Info</th>
              <th>New Value</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {Profile && (
             <><tr className="items">
                                <td>
                                    <strong>Email: </strong> {(Profile as any).Email}
                                </td>
                                <td>
                                    <input className="email" type="email" id="email" name="email" placeholder="Email">
                                    </input>
                                </td>
                                <td>
                                    <button className="edit-button" onClick={() => { window.location.href = `/EditProfile?token=${token}`; } }><FontAwesomeIcon icon={faEdit} />
                                    </button>
                                </td>

                            </tr>
                            <tr className="spacer-row"></tr>

                            <tr className="items">
                                    <td>
                                        <strong>FirstName: </strong> {(Profile as any).First_Name} 
                                    </td>
                                    <td>
                                        <input className="email" type="email" id="email" name="email" placeholder="FirstName">
                                        </input>
                                    </td>
                                    <td>
                                        <button className="edit-button" onClick={() => { window.location.href = `/EditProfile?token=${token}`; } }><FontAwesomeIcon icon={faEdit} />
                                        </button>
                                    </td>
                                </tr>
                                <tr className="spacer-row"></tr>

                                <tr className="items">
                                    <td>
                                        <strong>LastName: </strong> {(Profile as any).Last_Name}
                                    </td>
                                    <td>
                                        <input className="email" type="email" id="email" name="email" placeholder="LastName">
                                        </input>
                                    </td>
                                    <td>
                                        <button className="edit-button" onClick={() => { window.location.href = `/EditProfile?token=${token}`; } }><FontAwesomeIcon icon={faEdit} />
                                        </button>
                                    </td>
                                </tr>
                                <tr className="spacer-row"></tr>

                                <tr className="items">
                                    <td>
                                        <strong>Password: </strong> {(Profile as any).password}
                                    </td>
                                    <td>
                                        <input className="email" type="email" id="email" name="email" placeholder="Password">
                                        </input>
                                    </td>
                                    <td>
                                        <button className="edit-button" onClick={() => { window.location.href = `/EditProfile?token=${token}`; } }><FontAwesomeIcon icon={faEdit} />
                                        </button>
                                    </td>
                                </tr>
                                <tr className="spacer-row"></tr>

                                <tr className="items">
                                    <td>
                                        <strong>Address: </strong> {(Profile as any).Address}
                                    </td>
                                    <td>
                                        <input className="email" type="email" id="email" name="email" placeholder="Address">
                                        </input>
                                    </td>
                                    <td>
                                        <button className="edit-button" onClick={() => { window.location.href = `/EditProfile?token=${token}`; } }><FontAwesomeIcon icon={faEdit} />
                                        </button>
                                    </td>
                                </tr>
                                </>
          )}
          </tbody>
          </table>
        </main>
        
      )}
      <FooterComponent />
    </div>
  );
  
}

export default Profile;
