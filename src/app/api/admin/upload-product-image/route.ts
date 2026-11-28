import {NextResponse} from "next/server";
import {createClient} from "@/lib/supabase/server";
import {createAdminClient} from "@/lib/supabase/admin";

export const runtime="nodejs";
const BUCKET="product-images";
const TYPES=new Set(["image/jpeg","image/png","image/webp","image/avif"]);
async function isAdmin(){
 const db=await createClient();
 const {data:{user}}=await db.auth.getUser();
 if(!user)return false;
 const {data}=await db.from("profiles").select("role").eq("id",user.id).maybeSingle();
 return data?.role==="admin";
}
export async function POST(request:Request){
 if(!(await isAdmin()))return NextResponse.json({error:"Je beheerderssessie is verlopen. Log opnieuw in."},{status:403});
 try{
  const data=await request.formData();
  const file=data.get("file");
  if(!(file instanceof File))return NextResponse.json({error:"Selecteer eerst een productfoto."},{status:400});
  if(!TYPES.has(file.type))return NextResponse.json({error:"Gebruik een JPG-, PNG-, WebP- of AVIF-afbeelding."},{status:400});
  if(file.size===0||file.size>8*1024*1024)return NextResponse.json({error:"De afbeelding moet kleiner zijn dan 8 MB."},{status:400});
  const ext=file.type==="image/jpeg"?"jpg":file.type.split("/")[1];
  const path=`products/${crypto.randomUUID()}.${ext}`;
  const admin=createAdminClient();
  const {error:bucketError}=await admin.storage.createBucket(BUCKET,{public:true,fileSizeLimit:8388608,allowedMimeTypes:[...TYPES]});
  if(bucketError&&!/already exists|duplicate/i.test(bucketError.message))throw bucketError;
  const {error}=await admin.storage.from(BUCKET).upload(path,Buffer.from(await file.arrayBuffer()),{contentType:file.type,upsert:false,cacheControl:"31536000"});
  if(error)throw error;
  const {data:{publicUrl}}=admin.storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({url:publicUrl});
 }catch(error){
  console.error("Product image upload failed:",error);
  return NextResponse.json({error:error instanceof Error?error.message:"Productfoto uploaden mislukt."},{status:500});
 }
}
