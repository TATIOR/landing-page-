import { NextResponse } from "next/server";
import { randomBytes, scryptSync } from "crypto";

function hashPassword(password:string){const salt=randomBytes(16).toString("hex");const hash=scryptSync(password,salt,64).toString("hex");return `${salt}:${hash}`;}
function validEmail(email:string){return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);}
export async function POST(req:Request){
 try{
  const body=await req.json(); const name=String(body.name||"").trim(); const email=String(body.email||"").trim().toLowerCase(); const phone=String(body.phone||"").trim(); const password=String(body.password||""); const marketingConsent=body.marketingConsent===true||body.marketingConsent==="true";
  if(name.length<2||!validEmail(email)||password.length<8||!marketingConsent)return NextResponse.json({error:"Please complete all required fields and accept the communication consent."},{status:400});
  const url=process.env.SUPABASE_URL, key=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url||!key)return NextResponse.json({error:"Registration database is not configured yet."},{status:503});
  const password_hash=hashPassword(password); const user={name,email,phone:phone||null,password_hash,marketing_consent:marketingConsent,marketing_consent_at:new Date().toISOString(),source:"tatior.com"};
  const response=await fetch(`${url}/rest/v1/ita_users`,{method:"POST",headers:{apikey:key,Authorization:`Bearer ${key}`,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify(user)});
  if(response.status===409)return NextResponse.json({error:"An account with this email already exists."},{status:409});
  if(!response.ok){const detail=await response.text();console.error("Supabase registration error",detail);return NextResponse.json({error:"Could not create the account."},{status:500});}
  return NextResponse.json({ok:true},{status:201});
 }catch{ return NextResponse.json({error:"Invalid registration request."},{status:400}); }
}