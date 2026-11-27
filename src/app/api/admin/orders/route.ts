import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
export async function GET(){const db=await createClient();const {data:{user}}=await db.auth.getUser();if(!user)return NextResponse.json({error:"Niet ingelogd"},{status:401});const {data:profile}=await db.from("profiles").select("role").eq("id",user.id).maybeSingle();if(profile?.role!=="admin")return NextResponse.json({error:"Niet toegestaan"},{status:403});const {data,error}=await createAdminClient().from("orders").select("*,order_items(*)").order("created_at",{ascending:false}).limit(100);if(error)return NextResponse.json({error:"Bestellingen ophalen mislukt"},{status:500});return NextResponse.json({orders:data});}

export async function PATCH(request:Request){
 const db=await createClient();const {data:{user}}=await db.auth.getUser();if(!user)return NextResponse.json({error:"Niet ingelogd"},{status:401});
 const {data:profile}=await db.from("profiles").select("role").eq("id",user.id).maybeSingle();if(profile?.role!=="admin")return NextResponse.json({error:"Niet toegestaan"},{status:403});
 const body=await request.json().catch(()=>null);const allowed=["processing","shipped"];
 if(!body?.id||!allowed.includes(body.status))return NextResponse.json({error:"Ongeldige statuswijziging"},{status:400});
 const admin=createAdminClient();const {data:existing}=await admin.from("orders").select("status").eq("id",body.id).maybeSingle();if(!existing||!["paid","processing"].includes(existing.status)|| (body.status==="processing"&&existing.status!=="paid"))return NextResponse.json({error:"Alleen betaalde bestellingen kunnen worden verwerkt of verzonden."},{status:409});
 const {data,error}=await admin.from("orders").update({status:body.status}).eq("id",body.id).eq("status",existing.status).select("id,status").single();
 if(error)return NextResponse.json({error:"Bestelling bijwerken mislukt"},{status:400});
 return NextResponse.json({order:data});
}
