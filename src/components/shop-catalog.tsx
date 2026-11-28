"use client";
import {useMemo,useState} from "react";
import Link from "next/link";
import {Search,SlidersHorizontal} from "lucide-react";
import type {Product} from "@/lib/catalog";
import {euro} from "@/lib/format";

export default function ShopCatalog({products}:{products:Product[]}){
 const [query,setQuery]=useState("");
 const [category,setCategory]=useState("Alles");
 const [sort,setSort]=useState("featured");
 const categories=["Alles",...Array.from(new Set(products.map(p=>p.category))).sort()];
 const visible=useMemo(()=>{
  const filtered=products.filter(p=>(category==="Alles"||p.category===category)&&[p.name,p.description,p.category].join(" ").toLowerCase().includes(query.trim().toLowerCase()));
  if(sort==="price-low")filtered.sort((a,b)=>a.price_cents-b.price_cents);
  if(sort==="price-high")filtered.sort((a,b)=>b.price_cents-a.price_cents);
  if(sort==="name")filtered.sort((a,b)=>a.name.localeCompare(b.name,"nl"));
  return filtered;
 },[products,category,query,sort]);
 return <>
  <div className="shop-tools">
   <label className="shop-search"><Search size={17}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Zoek in de collectie…" aria-label="Zoek producten"/></label>
   <label className="shop-sort"><SlidersHorizontal size={15}/><select value={sort} onChange={e=>setSort(e.target.value)} aria-label="Sorteer producten"><option value="featured">Aanbevolen</option><option value="price-low">Prijs: laag naar hoog</option><option value="price-high">Prijs: hoog naar laag</option><option value="name">Naam: A tot Z</option></select></label>
  </div>
  <div className="shop-categories" aria-label="Filter op categorie">{categories.map(item=><button type="button" key={item} className={category===item?"active":""} onClick={()=>setCategory(item)}>{item}</button>)}</div>
  <p className="shop-result-count">{visible.length} producten <span>· Ontdek de Safalina-collectie</span></p>
  <div className="product-grid">{visible.map(product=><Link className="product-card" href={"/product/"+product.slug} key={product.id}><div className="product-image"><img src={product.image_url} alt={product.name} loading="lazy"/><span className="product-tag">{product.category}</span></div><div className="product-info"><h3>{product.name}</h3><p>{product.description}</p><span className="product-price">{euro(product.price_cents)}</span></div></Link>)}</div>
  {visible.length===0&&<div className="shop-empty"><strong>Geen producten gevonden</strong><p>Pas je zoekopdracht of categorie aan.</p><button className="button" onClick={()=>{setQuery("");setCategory("Alles");}}>Wis filters</button></div>}
 </>;
}
