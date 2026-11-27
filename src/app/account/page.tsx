import Link from "next/link";
import {redirect} from "next/navigation";
import {createClient} from "@/lib/supabase/server";
import {euro} from "@/lib/catalog";
export default async function AccountPage(){
 const db=await createClient();const {data:{user}}=await db.auth.getUser();if(!user)redirect("/login?next=/account");
 const {data:profile}=await db.from("profiles").select("full_name").eq("id",user.id).maybeSingle();
 const {data:orders}=await db.from("orders").select("id,status,total_cents,created_at").eq("user_id",user.id).order("created_at",{ascending:false});
 return <main className="account-page"><div className="account-wrap"><Link className="back-link" href="/">← Safalina</Link><span className="kicker">Mijn Safalina</span><h1>Welkom{profile?.full_name?", "+profile.full_name:""}.</h1><p className="muted">{user.email}</p><section className="account-panel"><div className="panel-title"><h2>Mijn bestellingen</h2><span>{orders?.length||0} bestellingen</span></div>{orders?.length?orders.map(order=><div className="order-row" key={order.id}><div><strong>#{order.id.slice(0,8).toUpperCase()}</strong><small>{new Date(order.created_at).toLocaleDateString("nl-NL")}</small></div><span className="status">{order.status}</span><strong>{euro(order.total_cents)}</strong></div>):<p className="muted">Je hebt nog geen bestellingen geplaatst.</p>}</section><form action="/api/auth/signout" method="post"><button className="button">Uitloggen</button></form></div></main>;
}