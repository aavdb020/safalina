import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
export async function requireUser(){const supabase=await createClient();const {data:{user}}=await supabase.auth.getUser();if(!user)redirect("/login?next=/account");return {supabase,user};}
export async function requireAdmin(){const result=await requireUser();const {data:profile}=await result.supabase.from("profiles").select("role").eq("id",result.user.id).maybeSingle();if(profile?.role!=="admin")redirect("/admin/login");return result;}