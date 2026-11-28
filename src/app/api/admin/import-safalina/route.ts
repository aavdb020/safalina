import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {createAdminClient} from "@/lib/supabase/admin";

export const maxDuration=300;
const SOURCE="https://safalina.nl/products.json?limit=250";
const BUCKET="product-images";

async function isAdmin(){
  const db=await createClient();
  const {data:{user}}=await db.auth.getUser();
  if(!user)return false;
  const {data}=await db.from("profiles").select("role").eq("id",user.id).maybeSingle();
  return data?.role==="admin";
}
function cleanHtml(value:string){
  return value.replace(/<\/(p|div|li|h[1-6])>/gi,"\n").replace(/<br\s*\/?\s*>/gi,"\n").replace(/<[^>]*>/g," ").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/\s+/g," ").trim().slice(0,5000);
}
function category(tags:string[]){
  const map:[RegExp,string][]=[
    [/beauty|hair|skin|biotin|collagen/i,"Beauty & Hair"],
    [/kids/i,"Kids"],
    [/vitamin|mineral|immune/i,"Vitamins & Minerals"],
    [/fitness|recovery|performance|active/i,"Active Lifestyle"],
    [/herbal|traditional|shilajit/i,"Herbal Supplements"],
    [/wellness|daily|energy/i,"Daily Wellness"],
  ];
  for(const [pattern,label] of map){if(tags.some(tag=>pattern.test(tag)))return label;}
  return tags[0]||"Supplements";
}
export async function POST(){
  if(!(await isAdmin()))return NextResponse.json({error:"Niet toegestaan"},{status:403});
  try{
    const response=await fetch(SOURCE,{cache:"no-store",headers:{"Accept":"application/json","User-Agent":"Mozilla/5.0 (compatible; SafalinaDemoImporter/1.0)"},signal:AbortSignal.timeout(20000)});
    if(!response.ok){
      const blocked=response.status===403||response.headers.has("cf-mitigated");
      throw new Error(blocked?"Safalina.nl blokkeert de automatische catalogusimport met Cloudflare (HTTP 403). De productfeed is niet toegankelijk vanaf de server. Gebruik een Shopify-productexport (CSV) of laat de bronwebsite de feed vrijgeven.":"Safalina productfeed kon niet worden geladen (HTTP "+response.status+").");
    }
    const contentType=response.headers.get("content-type")||"";
    if(!contentType.includes("json"))throw new Error("De productfeed gaf geen JSON terug. De bronwebsite blokkeert waarschijnlijk automatische toegang.");
    const payload=await response.json();
    const sourceProducts=Array.isArray(payload.products)?payload.products:[];
    if(!sourceProducts.length)throw new Error("Geen producten gevonden op de bronwebsite.");
    const admin=createAdminClient();
    const {error:bucketError}=await admin.storage.createBucket(BUCKET,{public:true,fileSizeLimit:12582912,allowedMimeTypes:["image/jpeg","image/png","image/webp","image/avif"]});
    if(bucketError&&!/already exists|duplicate/i.test(bucketError.message))throw bucketError;
    const imported=[];
    const failures:string[]=[];
    for(const product of sourceProducts){
      const variant=product.variants?.[0]||{};
      const imageUrl=product.images?.[0]?.src||product.image?.src;
      if(!product.handle||!product.title||!imageUrl){failures.push(product.title||"Onbekend product");continue;}
      try{
        const imageResponse=await fetch(imageUrl,{signal:AbortSignal.timeout(25000)});
        if(!imageResponse.ok)throw new Error("Afbeelding downloaden mislukt");
        const contentType=(imageResponse.headers.get("content-type")||"image/jpeg").split(";")[0];
        if(!["image/jpeg","image/png","image/webp","image/avif"].includes(contentType))throw new Error("Ongeldig afbeeldingsformaat");
        const bytes=Buffer.from(await imageResponse.arrayBuffer());
        if(bytes.length>12*1024*1024)throw new Error("Afbeelding is te groot");
        const ext=contentType==="image/png"?"png":contentType==="image/webp"?"webp":contentType==="image/avif"?"avif":"jpg";
        const path=product.handle+"."+ext;
        const {error:uploadError}=await admin.storage.from(BUCKET).upload(path,bytes,{contentType,upsert:true,cacheControl:"31536000"});
        if(uploadError)throw uploadError;
        const {data:{publicUrl}}=admin.storage.from(BUCKET).getPublicUrl(path);
        const price=Math.round(Number(variant.price||0)*100);
        if(!Number.isFinite(price)||price<=0)throw new Error("Ongeldige productprijs");
        imported.push({
          slug:product.handle,
          name:product.title,
          description:cleanHtml(product.body_html||""),
          price_cents:price,
          compare_at_cents:variant.compare_at_price?Math.round(Number(variant.compare_at_price)*100):null,
          image_url:publicUrl,
          category:category(product.tags||[]),
          stock:typeof variant.inventory_quantity==="number"?Math.max(0,variant.inventory_quantity):20,
          active:true,
          updated_at:new Date().toISOString()
        });
      }catch(error){failures.push(product.title+": "+(error instanceof Error?error.message:"import mislukt"));}
    }
    if(!imported.length)throw new Error("Geen producten konden worden geïmporteerd. "+failures.join("; "));
    const {error:hideError}=await admin.from("products").update({active:false}).eq("active",true);
    if(hideError)throw hideError;
    const {error:upsertError}=await admin.from("products").upsert(imported,{onConflict:"slug"});
    if(upsertError)throw upsertError;
    return NextResponse.json({ok:true,imported:imported.length,total:sourceProducts.length,failed:failures});
  }catch(error){
    return NextResponse.json({error:error instanceof Error?error.message:"Importeren mislukt."},{status:500});
  }
}
