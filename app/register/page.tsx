"use client";
import { FormEvent, useState } from "react";

export default function Register(){
 const [loading,setLoading]=useState(false),[msg,setMsg]=useState(""),[ok,setOk]=useState(false);
 async function submit(e:FormEvent<HTMLFormElement>){
  e.preventDefault();setLoading(true);setMsg("");setOk(false);
  const form=new FormData(e.currentTarget);const payload=Object.fromEntries(form.entries());
  if(payload.password!==payload.confirmPassword){setMsg("Passwords do not match.");setLoading(false);return;}
  try{const res=await fetch("/api/register",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});const data=await res.json();if(!res.ok)throw new Error(data.error||"Registration failed.");setOk(true);setMsg("Account created successfully.");e.currentTarget.reset();}
  catch(err:any){setMsg(err.message||"Registration failed.");}finally{setLoading(false)}
 }
 return <main className="register-page">
  <div className="register-shell">
   <a className="back-link register-back" href="/">← Back to Institutional Trading Academy</a>
   <div className="register-layout">
    <section className="register-intro">
     <div className="eyebrow">INSTITUTIONAL TRADING ACADEMY</div>
     <h1>Build your trading process.<span> Not your next impulse.</span></h1>
     <p>Create your free ITA account to access educational resources, academy updates and future programs.</p>
     <div className="register-points"><div><b>01</b><span>Structured education</span></div><div><b>02</b><span>Trading psychology & risk</span></div><div><b>03</b><span>Updates from the academy</span></div></div>
    </section>
    <section className="register-card">
     <div className="register-card-top"><div className="eyebrow">JOIN THE ACADEMY</div><h2>Create your account</h2><p>It takes less than a minute.</p></div>
     <form onSubmit={submit}>
      <div className="form-grid">
       <label>Full name<input name="name" required minLength={2} placeholder="Your name"/></label>
       <label>Email address<input type="email" name="email" required placeholder="you@example.com"/></label>
       <label>Phone number <span className="optional">(optional)</span><input type="tel" name="phone" placeholder="+237 …"/></label>
       <label>Password<input type="password" name="password" required minLength={8} placeholder="Minimum 8 characters"/></label>
       <label className="confirm-field">Confirm password<input type="password" name="confirmPassword" required minLength={8} placeholder="Repeat your password"/></label>
      </div>
      <label className="consent"><input type="checkbox" name="marketingConsent" value="true" required/><span>I agree to receive ITA educational and marketing communications. I understand I can unsubscribe later.</span></label>
      <button className="button primary full register-submit" disabled={loading}>{loading?"Creating account…":"Create Free Account"}</button>
     </form>
     {msg&&<p className={ok?"form-message":"form-error"}>{msg}</p>}
     <p className="privacy-note">Your password is never stored in plain text. Your contact information is used according to your consent and ITA's privacy policy.</p>
    </section>
   </div>
  </div>
 </main>
}