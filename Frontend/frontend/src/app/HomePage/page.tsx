"use client";
import React from "react";
import {Button} from "@nextui-org/react";
import { useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import "./globals.css";
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
type Repo = {
  name: string
  stargazers_count: number
}

export const getServerSideProps = (async () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const res = await fetch('http://localhost:4000/products/getProducts', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });  const repo: Repo = await res.json()
  // Pass data to the page via props
  return { props: { repo } }
}) satisfies GetServerSideProps<{ repo: Repo }>


export default function HomePage({
  repo,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
 
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
console.log("token: ", token);


return (
  <div className='b'>
   <div className="verify">

   <p>Click the button below to verify your email</p>
   <Button color="success" className="buttonsuccess" >
      Success
   </Button> 
   </div> 
    </div>
);
}
