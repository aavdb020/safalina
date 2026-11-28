import {requireAdmin} from "@/lib/auth";
import SiteEditor from "@/components/site-editor";
export default async function EditorPage(){await requireAdmin();return <SiteEditor/>;}
