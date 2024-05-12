"Use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import "./globals.css";
import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { faBars } from '@fortawesome/free-solid-svg-icons';
import logo from '../Pics/logo4.png';
import { faCartShopping, faStar } from "@fortawesome/free-solid-svg-icons";
import { faRegistered } from "@fortawesome/free-solid-svg-icons/faRegistered";

const GuestNavBar = ({ isLoggedIn, setSearchQuery ,token }: { isLoggedIn: boolean, setSearchQuery: Function ,token :string}) => {
    const [dropdownVisible, setDropdownVisible] = useState(false);
  const [categories, setCategories] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
 

useEffect(() => {
  const fetchCategories = async () => {
    /*
    try {
      const response = await fetch('https://backendtoyshub-dev.onrender.com/guest/category');
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      const categoryData = await response.json();
      setCategories(categoryData.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
    */
  };
  fetchCategories();
}, []);


  return (
    <nav className="navbar">
 
    <div
        className="formobile"
        onMouseEnter={() => setDropdownVisible(true)}
        onMouseLeave={() => setDropdownVisible(false)}
      >
        <FontAwesomeIcon icon={faBars} className="mobileinnav" />
        Menu
        {dropdownVisible && categories && (
          <ul className="dropdown-menuu">
            <li>
              <Link
                href={"/Login"}
              
              >
                <FontAwesomeIcon icon={faUser} className="profile-icon" />
              </Link>
            </li>
            
            

          </ul>
        )}
      </div>


      

      <div className="nav-items">
      <div className="search-bar">
      <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
        />
  </div>

   



  <Link
    href={"/Login"}
  >
    <FontAwesomeIcon icon={faUser} className="profile-icon" />
  </Link>
  <Link
    href={"/Signup"}
  >
    <FontAwesomeIcon icon={faRegistered} className="profile-icon" />
  </Link>
  <Link className="guestt"
    href={"/GuestPage"}
  >
    Continue as guest
  </Link>
        

</div>

    </nav>
  );
};

export default GuestNavBar;