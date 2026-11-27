import { createServerClient } from "@supabase/ssr";
import { NextResponse,type NextRequest } from "next/server";
export async function middleware(request:NextRequest){
 let response=NextResponse.next({request});
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL,key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return response;
 const supabase=createServerClient(url,key,{cookies:{getAll:()=>request.cookies.getAll(),setAll(values){values.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});values.forEach(({name,value,options})=>response.cookies.set(name,value,options));}}});
 const {data:{user}}=await supabase.auth.getUser();
 if(request.nextUrl.pathname.startsWith("/account")&&!user){const target=request.nextUrl.clone();target.pathname="/login";target.searchParams.set("next",request.nextUrl.pathname);return NextResponse.redirect(target);}
 if(request.nextUrl.pathname.startsWith("/admin")&&!request.nextUrl.pathname.startsWith("/admin/login")){
  if(!user){const target=request.nextUrl.clone();target.pathname="/admin/login";return NextResponse.redirect(target);}
  const {data:profile}=await supabase.from("profiles").select("role").eq("id",user.id).maybeSingle();
  if(profile?.role!=="admin")return NextResponse.redirect(new URL("/",request.url));
 }
 return response;
}
export const config={matcher:["/account/:path*","/admin/:path*"]};
