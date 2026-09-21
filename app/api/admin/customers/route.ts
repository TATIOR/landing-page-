import { NextResponse } from "next/server";
import { requireAdmin } from "../../../../lib/admin-auth";

export async function GET(){
 if(!(await requireAdmin()))return NextResponse.json({error:"Unauthorized"},{status:401});
 const url=process.env.SUPABASE_URL;
 const key=process.env.SUPABASE_SECRET_KEY;
 if(!url||!key)return NextResponse.json({error:"Supabase is not configured."},{status:503});
 const response=await fetch(`${url}/rest/v1/ita_users?select=id,name,email,phone,marketing_consent,marketing_consent_at,source,created_at&order=created_at.desc`,{
  headers:{apikey:key,Authorization:`Bearer ${key}`},
  cache:"no-store"
 });
 if(!response.ok)return NextResponse.json({error:"Could not load customers."},{status:500});
 const customers=await response.json();
 const consented=customers.filter((c:any)=>c.marketing_consent).length;
 const today=new Date();today.setHours(0,0,0,0);
 const todayCount=customers.filter((c:any)=>new Date(c.created_at)>=today).length;
 return NextResponse.json({customers,stats:{total:customers.length,consented,today:todayCount}});
}