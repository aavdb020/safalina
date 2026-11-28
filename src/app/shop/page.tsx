import Link from "next/link";
import {getProducts} from "@/lib/catalog";
import ShopCatalog from "@/components/shop-catalog";
export default async function ShopPage(){
 const products=await getProducts();
 return <>
  <header className="header shop-header">
   <Link className="brand" href="/">safalina<small>FEEL GOOD, EVERY DAY</small></Link>
   <nav className="nav"><Link href="/">Home</Link><Link href="/shop" aria-current="page">Shop</Link><Link href="/account">Account</Link></nav>
   <Link className="button" href="/">Terug naar home</Link>
  </header>
  <main className="section shop-page">
   <div className="section-head"><span className="kicker">De Safalina selectie</span><h2>Shop alle producten</h2><p>Ontdek de voorbeeldcollectie van Safalina. Alle producten en prijzen zijn fictief en uitsluitend bedoeld om de webshop te presenteren.</p></div>
   <ShopCatalog products={products}/>
  </main>
  <footer className="footer"><div className="footer-bottom"><span>© {new Date().getFullYear()} Safalina · Conceptdemo</span><span><Link href="/privacy">Privacy</Link> · <Link href="/voorwaarden">Voorwaarden</Link></span></div></footer>
 </>;
}
