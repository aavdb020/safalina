import {createClient} from "@/lib/supabase/server";
import {defaultSiteSettings,type SiteSettings} from "@/lib/site-settings-shared";
export {defaultSiteSettings};
export type {SiteSettings};
export async function getSiteSettings():Promise<SiteSettings>{try{const db=await createClient();const {data,error}=await db.from("site_settings").select("settings").eq("id","default").maybeSingle();if(error||!data?.settings)return defaultSiteSettings;return {...defaultSiteSettings,...data.settings};}catch{return defaultSiteSettings;}}
