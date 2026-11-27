import Link from "next/link";
import { ArrowLeft, LockKeyhole, Package, ShoppingBag, Users } from "lucide-react";

export default function AdminPage() {
  return <main style={{minHeight:"100vh",background:"#f6f1e9",padding:"48px 22px",color:"#30251f"}}>
    <div style={{maxWidth:920,margin:"0 auto"}}>
      <Link href="/" style={{display:"inline-flex",alignItems:"center",gap:8,color:"#965b40",fontSize:12}}><ArrowLeft size={15}/> Terug naar de webshop</Link>
      <div style={{marginTop:42,display:"flex",alignItems:"center",gap:14}}><div style={{width:48,height:48,borderRadius:16,background:"#493329",color:"#fff",display:"grid",placeItems:"center"}}><LockKeyhole/></div><div><p style={{margin:0,fontSize:10,letterSpacing:".2em",textTransform:"uppercase",color:"#965b40"}}>Safalina beheer</p><h1 style={{fontFamily:"Georgia,serif",fontSize:38,fontWeight:400,margin:"5px 0"}}>Admin dashboard</h1></div></div>
      <div style={{marginTop:28,background:"#fffdfa",border:"1px solid #e8dfd5",padding:24,borderRadius:18}}>
        <h2 style={{fontFamily:"Georgia,serif",fontSize:24,fontWeight:400,marginTop:0}}>Welkom in de beheeromgeving</h2>
        <p style={{color:"#88786d",fontSize:13,lineHeight:1.8}}>Dit is de eerste basis van het Safalina-dashboard. Productbeheer, bestellingen en klantbeheer worden aangesloten op de database zodra de beveiligde backend is ingericht.</p>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:12,marginTop:25}}>
          {[["Producten","Productcatalogus beheren",Package],["Bestellingen","Orders en verzending",ShoppingBag],["Klanten","Klantgegevens en accounts",Users]].map(([title,desc,Icon])=><div key={String(title)} style={{border:"1px solid #e8dfd5",borderRadius:14,padding:18,background:"#fcfaf6"}}><Icon size={20} color="#965b40"/><h3 style={{fontSize:14,margin:"15px 0 5px"}}>{String(title)}</h3><p style={{fontSize:11,color:"#88786d",margin:0}}>{String(desc)}</p><span style={{display:"inline-block",marginTop:14,fontSize:9,letterSpacing:".12em",textTransform:"uppercase",color:"#965b40"}}>Binnenkort beschikbaar</span></div>)}
        </div>
      </div>
      <p style={{fontSize:11,color:"#88786d",marginTop:18}}>Beveiliging wordt vóór livegang verplicht ingericht. Dit dashboard is momenteel alleen een visuele basis en bevat nog geen login of beheeracties.</p>
    </div>
  </main>;
}
