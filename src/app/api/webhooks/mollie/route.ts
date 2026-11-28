import {NextResponse} from "next/server";
import {createAdminClient} from "@/lib/supabase/admin";
export async function POST(request:Request){
 const form=await request.formData().catch(()=>null);const paymentId=form?.get("id");
 if(typeof paymentId!=="string"||!paymentId)return NextResponse.json({ok:true});
 const key=process.env.MOLLIE_API_KEY;if(!key)return NextResponse.json({error:"Payment provider not configured"},{status:503});
 const verified=await fetch("https://api.mollie.com/v2/payments/"+encodeURIComponent(paymentId),{headers:{Authorization:"Bearer "+key},cache:"no-store"});
 if(!verified.ok)return NextResponse.json({error:"Unable to verify payment"},{status:502});
 const payment=await verified.json();const orderId=payment.metadata?.order_id;if(!orderId)return NextResponse.json({ok:true});
 const status=payment.status==="paid"?"paid":["canceled","expired","failed"].includes(payment.status)?payment.status:"pending";
 const db=createAdminClient();const {data:order}=await db.from("orders").select("id,status").eq("id",orderId).eq("mollie_payment_id",paymentId).maybeSingle();
 if(!order||order.status===status||["paid","shipped","refunded"].includes(order.status))return NextResponse.json({ok:true});
 if(["canceled","expired","failed"].includes(status)){
  const {error}=await db.rpc("release_safalina_order_stock",{p_order_id:orderId,p_failure_status:status});
  if(error){console.error("Failed to release inventory for Mollie payment",error);return NextResponse.json({error:"Unable to update failed payment"},{status:500});}
 }else{
  const {error}=await db.from("orders").update({status}).eq("id",orderId).eq("mollie_payment_id",paymentId).eq("status",order.status);
  if(error){console.error("Failed to update Mollie payment status",error);return NextResponse.json({error:"Unable to update payment status"},{status:500});}
 }
 return NextResponse.json({ok:true});
}