"use client";
import {useState} from "react";
import type {Product} from "@/lib/catalog";
type CartItem={id:string;name:string;price_cents:number;quantity:number;image_url?:string};
export default function ProductAddButton({product}:{product:Product}){
 const [message,setMessage]=useState("");
 function add(){
  try{
   const key="safalina-cart-v1";
   const saved=JSON.parse(localStorage.getItem(key)||"[]");
   const cart:CartItem[]=Array.isArray(saved)?saved.filter((item):item is CartItem=>item&&typeof item.id==="string"&&Number.isInteger(item.quantity)&&item.quantity>0):[];
   const found=cart.find(item=>item.id===product.id);
   if(found&&found.quantity>=Math.min(product.stock,10)){setMessage("Je hebt de maximale beschikbare voorraad bereikt.");return;}
   if(found){found.quantity+=1;found.name=product.name;found.price_cents=product.price_cents;found.image_url=product.image_url;}
   else cart.push({id:product.id,name:product.name,price_cents:product.price_cents,quantity:1,image_url:product.image_url});
   localStorage.setItem(key,JSON.stringify(cart));
   window.dispatchEvent(new Event("safalina-cart-updated"));
   setMessage("Toegevoegd aan je winkelmandje.");
  }catch{setMessage("Je winkelmandje kon niet worden bijgewerkt. Probeer het opnieuw.");}
 }
 return <div><button className="button" onClick={add} disabled={product.stock<1}>Voeg toe aan winkelmandje</button>{message&&<p className="form-success">{message} <a href="/checkout">Afrekenen</a></p>}</div>;
}