import Link from "next/link";
import {createClient} from "@/lib/supabase/server";
export default async function ThanksPage({searchParams}:{searchParams:Promise<{order?:string}>}){
 const {order}=await searchParams;const db=await createClient();const {data:{user}}=await db.auth.getUser();
 const {data}=order&&user?await db.from("orders").select("id,status").eq("id",order).eq("user_id",user.id).maybeSingle():{data:null};
 return <main className="account-page"><section className="auth-card"><span className="kicker">Safalina</span><h1>Bedankt voor je bestelling.</h1><p>{data?.status==="paid"?"Je betaling is ontvangen. We gaan met zorg aan de slag.":"Je bestelling is aangemaakt. De betaalstatus wordt gecontroleerd; je ontvangt een update zodra de betaling is bevestigd."}</p>{data&&<p className="muted">Bestelnummer: {data.id.slice(0,8).toUpperCase()}</p>}<Link className="button" href="/account">Bekijk mijn bestellingen</Link></section></main>;
}