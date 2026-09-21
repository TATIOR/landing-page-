import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";

const EMAIL="admin@institutionaltradingacademy.com";
function sign(value:string,secret:string){return createHmac("sha256",secret).update(value).digest("hex");}

export async function POST(req:Request){
 try{
  const {email,password}=await req.json();
  const expectedPassword=process.env.ITA_ADMIN_PASSWORD;
  const secret=process.env.ITA_ADMIN_SESSION_SECRET;
  if(!expectedPassword||!secret)return NextResponse.json({error:"Admin authentication is not configured."},{status:503});
  if(email!==EMAIL||password!==expectedPassword)return NextResponse.json({error:"Invalid admin credentials."},{status:401});
  const value=Buffer.from(JSON.stringify({email,exp:Date.now()+8*60*60*1000})).toString("base64url");
  const token=value+"."+sign(value,secret);
  const res=NextResponse.json({ok:true});
  res.cookies.set("ita_admin_session",token,{httpOnly:true,secure:true,sameSite:"lax",path:"/",maxAge:8*60*60});
  return res;
 }catch{return NextResponse.json({error:"Invalid request."},{status:400});}
}