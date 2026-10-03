"use client";
import { useState, type FormEvent } from "react";
type P={name:string;category:string;brand:string;price:string;oldPrice:string;stock:string;condition:string;image:string;description:string;specs:string};
const blank:P={name:"",category:"Laptops",brand:"",price:"",oldPrice:"",stock:"",condition:"New",image:"",description:"",specs:""};
export default function Admin(){
 const[p,setP]=useState<P>(blank),[saved,setSaved]=useState(false);
 const set=(k:keyof P,v:string)=>setP({...p,[k]:v});
 function save(e: FormEvent<HTMLFormElement>){e.preventDefault();setSaved(true);setTimeout(()=>setSaved(false),2500)}
 return <main className="admin-page"><div className="admin-shell">
  <div className="admin-head"><div><div className="kicker">TATIOR · ADMIN</div><h1>Catalogue manager</h1><p>Add products, prices, stock and photos. This panel is the foundation for the live catalogue.</p></div><a className="btn outline" href="/">View TATIOR</a></div>
  <section className="admin-section"><h2>New product</h2><form onSubmit={save}>
   <div className="admin-grid"><label>Product name<input value={p.name} onChange={e=>set("name",e.target.value)} required/></label><label>Brand<input value={p.brand} onChange={e=>set("brand",e.target.value)}/></label><label>Category<select value={p.category} onChange={e=>set("category",e.target.value)}><option>Laptops</option><option>Desktop</option><option>Monitors</option><option>Phones</option><option>Accessories</option><option>Networking</option><option>Gaming</option><option>Printers</option></select></label><label>Condition<select value={p.condition} onChange={e=>set("condition",e.target.value)}><option>New</option><option>Refurbished</option><option>Used</option><option>Available on request</option></select></label><label>Price (FCFA)<input value={p.price} onChange={e=>set("price",e.target.value)} inputMode="numeric"/></label><label>Old price (FCFA)<input value={p.oldPrice} onChange={e=>set("oldPrice",e.target.value)} inputMode="numeric"/></label><label>Stock<input value={p.stock} onChange={e=>set("stock",e.target.value)} inputMode="numeric"/></label><label>Image URL<input value={p.image} onChange={e=>set("image",e.target.value)} placeholder="https://..."/></label></div>
   <label>Description<textarea value={p.description} onChange={e=>set("description",e.target.value)}/></label><label>Specifications<textarea value={p.specs} onChange={e=>set("specs",e.target.value)} placeholder="Core i5&#10;8GB RAM&#10;256GB SSD"/></label>
   <button className="btn gold" type="submit">Save product</button>{saved&&<p className="save-msg">Product form saved locally for this session. Database integration comes next.</p>}
  </form></section>
  <section className="admin-section"><h2>Store settings</h2><div className="admin-grid"><label>Store name<input value="TATIOR" readOnly/></label><label>WhatsApp number<input placeholder="Configure your business number"/></label></div><p className="security-note">The public storefront currently uses a placeholder WhatsApp number. Replace it with your real business number before launch.</p></section>
 </div></main>
}