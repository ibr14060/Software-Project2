"Use client";
import React, { useState } from 'react';
import { MDBFooter, MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { FaFacebook , FaInstagram ,FaTwitter ,FaGoogle,FaHome ,FaEnvelope,FaFax,FaPhone } from 'react-icons/fa';
import { useSearchParams } from "next/navigation";
import "./globals.css";
import Link from 'next/link';
export default function Footer() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = searchParams.get("token") ?? "";

  
  return (
    <MDBFooter bgColor='light' className='Footer'>

        <div className='social-media'>
          <span>Get connected with us on social networks:</span>
<div className='social-media-icons'>
          <a href='https://www.instagram.com/ibr14060/' className='me-4 text-reset'>
            <FaInstagram className="instagram-icon" />
          </a>
          <a href='https://www.instagram.com/ibr14060/' className='me-4 text-reset'>
          <FaFacebook className="facebook-icon"/>
          </a>
          <a href='https://twitter.com/ibr14060' className='me-4 text-reset'>
            <FaTwitter className="twitter-icon" />
          </a>
          <a href='https://www.instagram.com/ibr14060/' className='me-4 text-reset'>
            <FaGoogle className='FaGoogle'/>
          </a>
</div>
        </div>


      <section className=''>
        <div className='mt-5'>
          <MDBRow className='mt-3'>
            <MDBCol className='col'>
              <h6>
                <MDBIcon icon="gem" className="me-3" />
                
              </h6>

            </MDBCol>

            <MDBCol className='col'>
              <h6 >Products</h6>
              <p>
              <Link href={`/category/3c019b6f-8787-46d2-b445-dcead15dd315/${token}`}>
          category1
        </Link>
              </p>
              <p>
              <Link href={`/category/3dcd7c7e-415a-4f30-8dbb-985d0dc923c4/${token}`}>
          category2
        </Link>
              </p>
              <p>
              <Link href={`/category/83d5155b-d2b3-4b36-829e-b2042476f76d/${token}`}>
          category3
        </Link>
              </p>

            </MDBCol>

            <MDBCol className='col'>
              <h6 >Useful links</h6>


              <p>
                <a href='#!' className='text-reset'>
                  Orders
                </a>
              </p>
              <p>
              <Link href={`/cart/${token}`}>
          Cart
        </Link>
              </p>
            </MDBCol>

            <MDBCol className='infocol'>
              <h6 >Contact</h6>
              <p>
                <FaHome/>
                <span> </span>
                cairo,egypt
              </p>
              <p>
                <FaEnvelope/>
                <span> </span>
                softwarepro753@gmail.com
              </p>
              <p>
              <FaPhone/>
                <span> </span>
                 +1(831)5827471
              </p>
              <p>
              <FaFax/>
                <span> </span>
                +1(831)5827471
              </p>
            </MDBCol>
          </MDBRow>
        </div>
      </section>

      <div className='p-4' style={{ backgroundColor: 'rgba(0, 0, 0, 0.05)' }}>
        © 2024 Copyright : <span> </span> <span> </span>
        <a className='text-reset fw-bold' href='https://github.com/BugDiggerz'>
          
        </a>
      </div>
    </MDBFooter>
  );
}