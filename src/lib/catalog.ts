export type Product={id:string;slug:string;name:string;description:string;price_cents:number;compare_at_cents:number|null;image_url:string;category:string;active:boolean;stock:number};
export const demoProducts:Product[]=[
{id:"11111111-1111-4111-8111-111111111111",slug:"the-daily-glow",name:"The Daily Glow",description:"Een verfijnde essential voor jouw dagelijkse verzorgingsritueel.",price_cents:2495,compare_at_cents:null,image_url:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",category:"Beauty & care",active:true,stock:20},
{id:"22222222-2222-4222-8222-222222222222",slug:"calm-ritual",name:"Calm Ritual",description:"Creëer thuis een rustig moment met deze zorgvuldig gekozen essential.",price_cents:1995,compare_at_cents:null,image_url:"https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=85",category:"Wellness",active:true,stock:20},
{id:"33333333-3333-4333-8333-333333333333",slug:"pure-balance",name:"Pure Balance",description:"Een eenvoudige toevoeging aan jouw dagelijkse routine.",price_cents:2995,compare_at_cents:null,image_url:"https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85",category:"Daily essentials",active:true,stock:20},
{id:"44444444-4444-4444-8444-444444444444",slug:"soft-radiance",name:"Soft Radiance",description:"Een zachte everyday essential, geselecteerd met aandacht.",price_cents:2250,compare_at_cents:null,image_url:"https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=85",category:"Beauty & care",active:true,stock:20}
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