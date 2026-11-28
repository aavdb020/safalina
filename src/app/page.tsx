import Storefront from "@/components/storefront";
import {getProducts} from "@/lib/catalog";
import {getSiteSettings} from "@/lib/site-settings";
export default async function Home(){const [products,settings]=await Promise.all([getProducts(),getSiteSettings()]);return <Storefront products={products} settings={settings}/>;}
