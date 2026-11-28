export type Product={id:string;slug:string;name:string;description:string;price_cents:number;compare_at_cents:number|null;image_url:string;category:string;active:boolean;stock:number};
export const demoProducts:Product[]=[
{id:"11111111-1111-4111-8111-111111111111",slug:"the-daily-glow",name:"Glow Cleanser",description:"Een zachte dagelijkse reiniger voor een fris en comfortabel huidgevoel. Fictief demo-product.",price_cents:2495,compare_at_cents:null,image_url:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",category:"Gezichtsverzorging",active:true,stock:20},
{id:"22222222-2222-4222-8222-222222222222",slug:"calm-ritual",name:"The Calm Body Oil",description:"Een verzorgende body oil voor een rustig self-care moment na het douchen. Fictief demo-product.",price_cents:1995,compare_at_cents:null,image_url:"https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=85",category:"Body & bath",active:true,stock:20},
{id:"33333333-3333-4333-8333-333333333333",slug:"pure-balance",name:"Daily Hydration Cream",description:"Een rijke, dagelijkse crème die past in een eenvoudige verzorgingsroutine. Fictief demo-product.",price_cents:2995,compare_at_cents:null,image_url:"https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85",category:"Gezichtsverzorging",active:true,stock:20},
{id:"44444444-4444-4444-8444-444444444444",slug:"soft-radiance",name:"Soft Glow Serum",description:"Een lichte serum-textuur als verfijnde stap in je avondroutine. Fictief demo-product.",price_cents:2250,compare_at_cents:null,image_url:"https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=85",category:"Gezichtsverzorging",active:true,stock:20},
{id:"55555555-5555-4555-8555-555555555555",slug:"silk-hand-cream",name:"Silk Hand Cream",description:"Een compacte handcrème voor onderweg en op je nachtkastje. Fictief demo-product.",price_cents:1495,compare_at_cents:null,image_url:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",category:"Body & bath",active:true,stock:20},
{id:"66666666-6666-4666-8666-666666666666",slug:"evening-candle",name:"Evening Ritual Candle",description:"Een warme geurkaars voor een ontspannen avond thuis. Fictief demo-product.",price_cents:1895,compare_at_cents:null,image_url:"https://images.unsplash.com/photo-1603006905003-be475563bc59?auto=format&fit=crop&w=900&q=85",category:"Home rituals",active:true,stock:20},
{id:"77777777-7777-4777-8777-777777777777",slug:"soft-touch-towel",name:"Soft Touch Towel",description:"Een zachte accessoire voor je dagelijkse badkamer routine. Fictief demo-product.",price_cents:1695,compare_at_cents:null,image_url:"https://images.unsplash.com/photo-1600369671236-e74521d4b6ad?auto=format&fit=crop&w=900&q=85",category:"Home rituals",active:true,stock:20},
{id:"88888888-8888-4888-8888-888888888888",slug:"nourish-lip-balm",name:"Nourish Lip Balm",description:"Een verzorgende lip balm als kleine essential voor iedere dag. Fictief demo-product.",price_cents:995,compare_at_cents:null,image_url:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",category:"Body & bath",active:true,stock:20}
];
export async function getProducts():Promise<Product[]> {
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return demoProducts;
 const {createClient}=await import("@/lib/supabase/server");
 const db=await createClient();
 const {data,error}=await db.from("products").select("*").eq("active",true).order("created_at",{ascending:false});
 if(error){console.error("Safalina product catalogue could not be loaded:",error.message);return demoProducts;}
 return (data??[]) as Product[];
}
export const euro=(cents:number)=>new Intl.NumberFormat("nl-NL",{style:"currency",currency:"EUR"}).format(cents/100);
