"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { ArrowRight, Check, ChevronRight, Heart, Menu, Minus, Plus, Search, ShoppingBag, Sparkles, Truck, X } from "lucide-react";

type Product = { id: number; name: string; subtitle: string; price: number; image: string; tag?: string };
const products: Product[] = [
  { id: 1, name: "The Daily Glow", subtitle: "Daily beauty essential", price: 24.95, image: "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=800&q=85", tag: "Bestseller" },
  { id: 2, name: "Calm Ritual", subtitle: "A moment for yourself", price: 19.95, image: "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85", tag: "Nieuw" },
  { id: 3, name: "Pure Balance", subtitle: "Your everyday ritual", price: 29.95, image: "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=800&q=85" },
  { id: 4, name: "Soft Radiance", subtitle: "Care made simple", price: 22.50, image: "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=85" }
];
type CartItem = { product: Product; quantity: number };
const money = (n: number) => new Intl.NumberFormat("nl-NL", { style: "currency", currency: "EUR" }).format(n);

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const visibleProducts = useMemo(() => products.filter(p => (p.name + " " + p.subtitle).toLowerCase().includes(search.toLowerCase())), [search]);

  function notify(message: string) { setToast(message); window.setTimeout(() => setToast(""), 2200); }
  function add(product: Product) {
    setCart(current => {
      const found = current.find(item => item.product.id === product.id);
      return found ? current.map(item => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...current, { product, quantity: 1 }];
    });
    notify(product.name + " toegevoegd aan je winkelmandje");
  }
  function change(id: number, delta: number) {
    setCart(current => current.map(item => item.product.id === id ? { ...item, quantity: item.quantity + delta } : item).filter(item => item.quantity > 0));
  }
  function subscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email.includes("@")) return;
    setSubscribed(true);
  }

  return <>
    <div className="announcement">Een beetje extra aandacht voor jezelf — ontdek Safalina</div>
    <header className="header">
      <button className="icon-btn mobile-menu" aria-label="Menu" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X size={20}/> : <Menu size={20}/>}</button>
      <nav className="nav" aria-label="Hoofdnavigatie">
        <a href="#shop">Shop</a><a href="#collecties">Collecties</a><a href="#verhaal">Ons verhaal</a>
      </nav>
      <a className="brand" href="#" aria-label="Safalina home">safalina<small>FEEL GOOD, EVERY DAY</small></a>
      <div className="header-actions">
        <button className="icon-btn search-btn" aria-label="Zoeken" onClick={() => setSearchOpen(!searchOpen)}><Search size={19}/></button>
        <button className="icon-btn" aria-label="Winkelmandje" onClick={() => setCartOpen(true)}><ShoppingBag size={20}/>{count > 0 && <span className="cart-count">{count}</span>}</button>
      </div>
      {menuOpen && <div style={{position:"absolute",top:"100%",left:0,right:0,background:"var(--paper)",padding:"22px",display:"grid",gap:18,borderBottom:"1px solid var(--line)"}}><a href="#shop" onClick={()=>setMenuOpen(false)}>Shop</a><a href="#collecties" onClick={()=>setMenuOpen(false)}>Collecties</a><a href="#verhaal" onClick={()=>setMenuOpen(false)}>Ons verhaal</a></div>}
    </header>
    {searchOpen && <div style={{padding:"15px 7vw",background:"var(--cream)",display:"flex",gap:12,alignItems:"center"}}><Search size={18}/><input autoFocus value={search} onChange={e=>setSearch(e.target.value)} placeholder="Waar ben je naar op zoek?" style={{flex:1,border:0,outline:0,background:"transparent",padding:8,color:"var(--ink)"}}/><button className="icon-btn" onClick={()=>{setSearchOpen(false);setSearch("")}}><X size={18}/></button></div>}
    <main>
      <section className="hero">
        <div className="hero-image"/>
        <div className="hero-content"><span className="eyebrow">Jouw moment. Jouw routine.</span><h1>Feel good,<br/>every day.</h1><p>Kleine rituelen, bewuste keuzes en fijne essentials. Ontdek wat bij jou past en maak van elke dag een moment voor jezelf.</p><a className="button button-light" href="#shop">Ontdek de collectie <ArrowRight size={15}/></a></div>
      </section>
      <section className="trust-strip">
        <div className="trust-item"><Truck size={17}/> Zorgvuldig verzonden</div><div className="trust-item"><Heart size={17}/> Met aandacht geselecteerd</div><div className="trust-item"><Sparkles size={17}/> Jouw dagelijkse moment</div>
      </section>
      <section className="section" id="shop">
        <div className="section-head"><span className="kicker">De Safalina selectie</span><h2>Jouw nieuwe favorieten</h2><p>Ontdek onze selectie essentials die jouw dagelijkse routine nét een beetje mooier maken.</p></div>
        <div className="product-grid">
          {visibleProducts.map(product=><article className="product-card" key={product.id}>
            <div className="product-image"><img src={product.image} alt={product.name}/>{product.tag && <span className="product-tag">{product.tag}</span>}<button className="quick-add" onClick={()=>add(product)}>Voeg toe aan winkelmandje <Plus size={13} style={{verticalAlign:"middle"}}/></button></div>
            <div className="product-info"><h3>{product.name}</h3><p>{product.subtitle}</p><span className="product-price">{money(product.price)}</span></div>
          </article>)}
        </div>
        {visibleProducts.length===0 && <p style={{textAlign:"center",color:"var(--muted)",padding:30}}>Geen producten gevonden voor “{search}”.</p>}
        <div style={{textAlign:"center",marginTop:35}}><a className="button" href="#collecties">Bekijk de collectie <ArrowRight size={14}/></a></div>
      </section>
      <section className="section" id="collecties" style={{paddingTop:20}}>
        <div className="section-head"><span className="kicker">Vind jouw favoriet</span><h2>Shop op jouw manier</h2><p>Een fijne routine begint met wat bij jou past.</p></div>
        <div className="categories">
          <a className="category" href="#shop"><img src="https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=1000&q=85" alt="Beauty collectie"/><div className="category-label"><span>Ontdek</span><h3>Beauty & care</h3></div></a>
          <a className="category" href="#shop"><img src="https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=800&q=85" alt="Wellness collectie"/><div className="category-label"><span>Ontdek</span><h3>Wellness</h3></div></a>
          <a className="category" href="#shop"><img src="https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=800&q=85" alt="Daily essentials"/><div className="category-label"><span>Ontdek</span><h3>Daily essentials</h3></div></a>
        </div>
      </section>
      <section className="story" id="verhaal">
        <div className="story-image" role="img" aria-label="Verzorgingsproducten in warm daglicht"/>
        <div className="story-copy"><span className="kicker">A little more you</span><h2>Goed voor jezelf zorgen, op jouw manier.</h2><p>Bij Safalina geloven we dat welzijn niet ingewikkeld hoeft te zijn. Het zit in kleine keuzes, fijne producten en momenten waarop je even bewust stilstaat bij jezelf.</p><a className="button" href="#shop">Ontdek Safalina <ArrowRight size={14}/></a></div>
      </section>
      <section className="newsletter">
        <span className="eyebrow">Een beetje Safalina in je inbox</span><h2>Stay in the know.</h2><p>Ontvang als eerste nieuws, inspiratie en updates uit onze collectie.</p>
        {subscribed ? <p style={{color:"#f5d9c6",display:"flex",justifyContent:"center",gap:8,alignItems:"center"}}><Check size={16}/> Bedankt! Je staat op de lijst.</p> : <form className="newsletter-form" onSubmit={subscribe}><input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="Jouw e-mailadres"/><button type="submit">Aanmelden <ArrowRight size={13} style={{verticalAlign:"middle"}}/></button></form>}
      </section>
    </main>
    <footer className="footer">
      <div className="footer-top"><div><a className="brand" href="#">safalina<small style={{color:"#b9a99c"}}>FEEL GOOD, EVERY DAY</small></a><p>Een bewustere routine begint met kleine momenten. Ontdek de wereld van Safalina.</p></div><div className="footer-col"><h4>Ontdek</h4><a href="#shop">Shop alles</a><a href="#collecties">Collecties</a><a href="#verhaal">Ons verhaal</a></div><div className="footer-col"><h4>Service</h4><a href="mailto:hello@safalina.nl">Contact</a><a href="#verhaal">Veelgestelde vragen</a><a href="#verhaal">Verzending & retour</a></div><div className="footer-col"><h4>Volg ons</h4><a href="https://instagram.com" target="_blank" rel="noreferrer">Instagram <ChevronRight size={12} style={{verticalAlign:"middle"}}/></a><a href="https://tiktok.com" target="_blank" rel="noreferrer">TikTok <ChevronRight size={12} style={{verticalAlign:"middle"}}/></a></div></div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Safalina. Alle rechten voorbehouden.</span><span>Met aandacht gemaakt.</span></div>
    </footer>
    <div className={"drawer-backdrop"+(cartOpen?" open":"")} onClick={()=>setCartOpen(false)}/>
    <aside className={"cart-drawer"+(cartOpen?" open":"")} aria-label="Winkelmandje" aria-hidden={!cartOpen}>
      <div className="drawer-head"><h2>Jouw winkelmandje ({count})</h2><button className="icon-btn" onClick={()=>setCartOpen(false)} aria-label="Sluiten"><X/></button></div>
      <div className="cart-lines">{cart.length===0 ? <div className="empty-cart"><ShoppingBag size={30}/><p>Je winkelmandje is nog leeg.<br/>Tijd om iets moois te ontdekken.</p><button className="button" onClick={()=>setCartOpen(false)}>Verder winkelen</button></div> : cart.map(item=><div className="cart-line" key={item.product.id}><img src={item.product.image} alt={item.product.name}/><div><h3>{item.product.name}</h3><p>{money(item.product.price)}</p><div className="qty"><button onClick={()=>change(item.product.id,-1)} aria-label="Verlaag aantal"><Minus size={12}/></button><span>{item.quantity}</span><button onClick={()=>change(item.product.id,1)} aria-label="Verhoog aantal"><Plus size={12}/></button></div></div><strong style={{fontSize:12}}>{money(item.product.price*item.quantity)}</strong></div>)}</div>}
      {cart.length>0 && <div className="cart-total"><div><span>Subtotaal</span><strong>{money(total)}</strong></div><small>Verzendkosten worden berekend bij het afrekenen.</small><button className="button" onClick={()=>notify("Checkout wordt aangesloten zodra betalingen zijn ingesteld.")}>Verder naar afrekenen <ArrowRight size={14}/></button></div>}
    </aside>
    <div className={"toast"+(toast?" show":"")}>{toast}</div>
  </>;
}
