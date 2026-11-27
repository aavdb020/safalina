import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
export async function createClient() {
  const store=await cookies();
  const url=process.env.NEXT_PUBLIC_SUPABASE_URL, key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if(!url||!key) throw new Error("Supabase is not configured.");
  return createServerClient(url,key,{cookies:{getAll:()=>store.getAll(),setAll(values: {name:string;value:string;options:any}[]){try{values.forEach(({name,value,options})=>store.set(name,value,options));}catch{/* Middleware refreshes cookies when server components cannot write. */}}}});
}