import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
const schema=z.object({
 items:z.array(z.object({productId:z.string().uuid(),quantity:z.number().int().min(1).max(10)})).min(1).max(30),
 shipping:z.object({firstName:z.string().min(1).max(80),lastName:z.string().min(1).max(80),email:z.string().email(),phone:z.string().max(40).optional().default(""),street:z.string().min(2).max(120),houseNumber:z.string().min(1).max(20),postalCode:z.string().min(4).max(12),city:z.string().min(2).max(100),country:z.string().length(2).default("NL")}),
 notes:z.string().max(500).optional().default("")
});
export async function POST(request:Request){
 try{
  const parsed=schema.safeParse(await request.json());if(!parsed.success)return NextResponse.json({error:"Controleer je gegevens en winkelmandje."},{status:400});
  const auth=await createClient();const {data:{user}}=await auth.auth.getUser();if(!user)return NextResponse.json({error:"Log eerst in om af te rekenen."},{status:401});
  const key=process.env.MOLLIE_API_KEY;if(!key)return NextResponse.json({error:"Betalingen zijn nog niet geconfigureerd."},{status:503});
  const admin=createAdminClient();const {data:orderId,error:orderError}=await auth.rpc("create_safalina_order",{p_user_id:user.id,p_shipping:parsed.data.shipping,p_notes:parsed.data.notes,p_items:parsed.data.items});
  if(orderError||!orderId){console.error("Order creation failed",orderError);return NextResponse.json({error:"Bestelling niet aangemaakt. Controleer voorraad en probeer opnieuw."},{status:409});}
  const {data:order,error:readError}=await admin.from("orders").select("id,total_cents").eq("id",orderId).single();
  if(readError||!order)return NextResponse.json({error:"Bestelling aangemaakt, ophalen mislukt."},{status:500});
  const origin=process.env.NEXT_PUBLIC_SITE_URL||new URL(request.url).origin;
  const response=await fetch("https://api.mollie.com/v2/payments",{method:"POST",headers:{Authorization:"Bearer "+key,"Content-Type":"application/json"},body:JSON.stringify({amount:{currency:"EUR",value:(order.total_cents/100).toFixed(2)},description:"Safalina bestelling "+order.id.slice(0,8),redirectUrl:origin+"/checkout/bedankt?order="+order.id,webhookUrl:origin+"/api/webhooks/mollie",metadata:{order_id:order.id}})});
  const payment=await response.json();if(!response.ok||!payment?._links?.checkout?.href){await admin.from("orders").update({status:"payment_failed"}).eq("id",order.id);console.error("Mollie error",payment);return NextResponse.json({error:"Betalen is tijdelijk niet beschikbaar."},{status:502});}
  await admin.from("orders").update({mollie_payment_id:payment.id,status:"pending"}).eq("id",order.id);
  return NextResponse.json({checkoutUrl:payment._links.checkout.href});
 }catch(error){console.error("Checkout error",error);return NextResponse.json({error:"Er ging iets mis tijdens het afrekenen."},{status:500});}
}