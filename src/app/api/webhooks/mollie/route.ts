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
 const {data:changed}=await db.from("orders").update({status}).eq("id",orderId).eq("mollie_payment_id",paymentId).eq("status",order.status).select("id").maybeSingle();
 if(changed&&["canceled","expired","failed"].includes(status)){
  const {data:lines}=await db.from("order_items").select("product_id,quantity").eq("order_id",orderId);
  for(const line of lines||[]){if(!line.product_id)continue;const {data:product}=await db.from("products").select("stock").eq("id",line.product_id).maybeSingle();if(product)await db.from("products").update({stock:product.stock+line.quantity}).eq("id",line.product_id);}
 }
 return NextResponse.json({ok:true});
}