import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export async function requireAdmin(){
 const secret=process.env.ITA_ADMIN_SESSION_SECRET;
 if(!secret)return false;
 const token=(await cookies()).get("ita_admin_session")?.value;
 if(!token)return false;
 const [value,signature]=token.split(".");
 if(!value||!signature)return false;
 const expected=createHmac("sha256",secret).update(value).digest("hex");
 try{
  if(!timingSafeEqual(Buffer.from(signature),Buffer.from(expected)))return false;
  const data=JSON.parse(Buffer.from(value,"base64url").toString("utf8"));
  return data.email==="admin@institutionaltradingacademy.com"&&Number(data.exp)>Date.now();
 }catch{return false;}
}