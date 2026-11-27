export type Product={id:string;slug:string;name:string;description:string;price_cents:number;compare_at_cents:number|null;image_url:string;category:string;active:boolean;stock:number};
export const demoProducts:Product[]=[
{id:"demo-1",slug:"the-daily-glow",name:"The Daily Glow",description:"Een verfijnde essential voor jouw dagelijkse verzorgingsritueel.",price_cents:2495,compare_at_cents:null,image_url:"https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?auto=format&fit=crop&w=900&q=85",category:"Beauty & care",active:true,stock:20},
{id:"demo-2",slug:"calm-ritual",name:"Calm Ritual",description:"Creëer thuis een rustig moment met deze zorgvuldig gekozen essential.",price_cents:1995,compare_at_cents:null,image_url:"https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?auto=format&fit=crop&w=900&q=85",category:"Wellness",active:true,stock:20},
{id:"demo-3",slug:"pure-balance",name:"Pure Balance",description:"Een eenvoudige toevoeging aan jouw dagelijkse routine.",price_cents:2995,compare_at_cents:null,image_url:"https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?auto=format&fit=crop&w=900&q=85",category:"Daily essentials",active:true,stock:20},
{id:"demo-4",slug:"soft-radiance",name:"Soft Radiance",description:"Een zachte everyday essential, geselecteerd met aandacht.",price_cents:2250,compare_at_cents:null,image_url:"https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?auto=format&fit=crop&w=900&q=85",category:"Beauty & care",active:true,stock:20}
];
export async function getProducts():Promise<Product[]> {
 try { const {createClient}=await import("@/lib/supabase/server");const db=await createClient();const {data,error}=await db.from("products").select("*").eq("active",true).order("created_at",{ascending:false});if(!error&&data?.length)return data as Product[]; } catch {/* preview remains available before Supabase setup */ }
 return demoProducts;
}
export const euro=(cents:number)=>new Intl.NumberFormat("nl-NL",{style:"currency",currency:"EUR"}).format(cents/100);