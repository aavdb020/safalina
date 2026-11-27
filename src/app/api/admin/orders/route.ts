import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
export async function GET(){const db=await createClient();const {data:{user}}=await db.auth.getUser();if(!user)return NextResponse.json({error:"Niet ingelogd"},{status:401});const {data:profile}=await db.from("profiles").select("role").eq("id",user.id).maybeSingle();if(profile?.role!=="admin")return NextResponse.json({error:"Niet toegestaan"},{status:403});const {data,error}=await createAdminClient().from("orders").select("*,order_items(*)").order("created_at",{ascending:false}).limit(100);if(error)return NextResponse.json({error:"Bestellingen ophalen mislukt"},{status:500});return NextResponse.json({orders:data});}
