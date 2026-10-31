import {useEffect,useMemo,useState} from "react";
const TYPES={
 welcome:{n:"Welcome",s:["Welcome to {brand}, {first}","A welcome gift for you, {first}","A quick hello from {brand}","You're in! Here's what happens next","Start here: {brand} in 60 seconds"],pre:"Thanks for joining. A few things to know.",hook:"Thanks for joining {brand}. We're really glad you're here.",val:"{brand} makes {p}. Over the next few days we'll share how it works and how to get the most from it.",ps:"Just reply if you have any questions. A real person reads every email."},
 cart:{n:"Abandoned cart",s:["{first}, you left something behind","Still thinking about {p}?","Your cart is waiting, {first}","Saved for you: {p}","Need help deciding, {first}?"],pre:"We saved your cart so you can pick up where you left off.",hook:"You left {p} in your cart, so we saved it for you.",val:"If you had a question about {p}, just reply and we'll help. Otherwise it's ready when you are.",ps:"Your cart is saved, so there's no rush."},
 winback:{n:"Win-back",s:["We miss you, {first}","It's been a while, {first}","A little something to come back to","What's new at {brand}","{first}, still interested in {p}?"],pre:"A lot has changed since your last visit.",hook:"It's been a while since we've seen you at {brand}.",val:"We've added new things you might like, and we'd love to have you back.",ps:"Not interested anymore? You can unsubscribe at the bottom. No hard feelings."},
 launch:{n:"Product launch",s:["New: {p} is here","Meet {p}, {first}","It's finally here: {p}","First look: {p}","{first}, {p} just launched"],pre:"Be one of the first to try it.",hook:"We've been working on something new, and it's ready: {p}.",val:"{p} is made for people who want something simple that works. Here's what it does and why we built it.",ps:"Have a question about {p}? Just reply to this email."},
 promo:{n:"Promotion",s:["{o}, just for you","{first}, {o} starts now","Save on {p} this week","A little treat from {brand}","Your offer is inside"],pre:"Offer details inside. Terms apply.",hook:"We have something special for you: {o}.",val:"It's our way of saying thanks for being part of {brand}. Use it on {p} or anything else you like.",ps:"Please check the offer details for dates and exclusions."},
 news:{n:"Newsletter",s:["This month at {brand}","{first}, your {brand} update","3 things worth knowing","What we've been up to","Fresh from {brand}"],pre:"News, ideas and one thing we love.",hook:"Here's a quick update from {brand}.",val:"This month we're sharing what's new with {p}, one useful tip, and something we think you'll like.",ps:"Hit reply and tell us what you'd like to see next month."},
 review:{n:"Review request",s:["How is your {p}, {first}?","{first}, a quick favour?","Tell us what you think","Two minutes to share your thoughts","Did {p} work for you?"],pre:"Your feedback helps us and other customers.",hook:"We hope you're enjoying {p}.",val:"Would you share a quick review? It takes about two minutes, and it helps us improve and helps other people decide.",ps:"If something wasn't right, reply and we'll make it right."},
 event:{n:"Event invite",s:["You're invited, {first}","Join us: {p}","Save your spot, {first}","{brand} presents {p}","An invitation from {brand}"],pre:"Details and how to RSVP inside.",hook:"We'd love to see you at {p}.",val:"It's a relaxed, friendly session. You'll learn something useful and meet others. Save your spot below.",ps:"Can't make it? Reply and we'll share the notes afterwards."}};
const SEG={general:["Everyone",""],new:["First-time customer","Since you're new, we'll keep things simple."],vip:["Loyal customer","As one of our best customers, you always hear first."],lapsed:["Lapsed customer","We know life gets busy."]};
const TONE={friendly:["Hi {first},","Warmly,"],professional:["Hello {first},","Best regards,"],playful:["Hey {first}!","Cheers,"]};
const ESP={generic:["Generic","{{first_name}}"],klaviyo:["Klaviyo","{{ first_name|default:'there' }}"],mailchimp:["Mailchimp","*|FNAME|*"]};
const SPAM=["free","act now","urgent","guarantee","winner","cash","click here","limited time","buy now","100%","risk-free","no obligation","$$$","!!!"];
const SAMPLE={brand:"Hanari Matcha (fictional)",p:"the Starter Kit",o:"10% off your first order",c:"Shop the Starter Kit",type:"welcome",seg:"new",tone:"friendly",len:"medium",sender:"Mina"};
const EMPTY={brand:"",p:"",o:"",c:"",type:"welcome",seg:"general",tone:"friendly",len:"medium",sender:""};
const T0="{{first_name}}";
const cap=s=>s?s.charAt(0).toUpperCase()+s.slice(1):s;
const fix=s=>s.replace(/\s+([.,?!:])/g,"$1").replace(/[ \t]+/g," ").replace(/ \n/g,"\n").trim();
function sub(t,b){const v={first:T0,brand:b.brand||"our team",p:b.p||"our products",o:b.o||"",c:b.c||"Learn more"};
 if(/\{o\}/.test(t)&&!v.o)return null;return fix(t.replace(/\{(\w+)\}/g,(_,k)=>v[k]))}
function tmpl(b,seed){
 const T=TYPES[b.type],all=T.s.map(s=>sub(s,b)).filter(Boolean).map(cap),k=seed%all.length,subjects=[...all.slice(k),...all.slice(0,k)].slice(0,5);
 const [g,so]=TONE[b.tone],segL=SEG[b.seg][1],P=[sub(g,b),sub(T.hook,b)];
 if(b.len!=="short"){if(segL)P.push(segL);P.push(sub(T.val,b));if(b.o&&b.type!=="promo"&&b.type!=="welcome")P.push("Here's a little something: "+b.o+".")}
 if(b.len==="detailed")P.push("If you have a question, just reply to this email. We read every message and we're happy to help.");
 P.push("[[CTA]]");P.push(sub(so,b)+"\n"+(b.sender||"The "+(b.brand||"team")+" team"));
 if(b.len!=="short")P.push("P.S. "+sub(T.ps,b));
 return{subjects,pre:sub(T.pre,b),body:P.join("\n\n"),cta:b.c||"Learn more"};
}
async function ai(b,key){
 const prompt=`Write a ${TYPES[b.type].n} marketing email.\nBrand: ${b.brand||"n/a"}\nProduct/topic: ${b.p||"n/a"}\nOffer: ${b.o||"none"}\nAudience: ${SEG[b.seg][0]}\nTone: ${b.tone}\nLength: ${b.len}\nCall to action button text: ${b.c||"Learn more"}\nSender name: ${b.sender||"the team"}\n\nRules: no false urgency, no invented statistics or reviews, no health claims. Use the exact merge tag {{first_name}} for the recipient's first name. In the body, put the line [[CTA]] where the button goes. Separate paragraphs with a blank line.\nReturn ONLY JSON: {"subjects":[5 strings under 55 characters],"preview":"string under 90 characters","body":"string"}`;
 const r=await fetch("https://api.anthropic.com/v1/messages",{method:"POST",headers:{"content-type":"application/json","x-api-key":key,"anthropic-version":"2023-06-01","anthropic-dangerous-direct-browser-access":"true"},body:JSON.stringify({model:"claude-sonnet-5-5",max_tokens:1500,messages:[{role:"user",content:prompt}]})});
 const d=await r.json();if(!r.ok)throw new Error(d?.error?.message||"Request failed ("+r.status+")");
 const j=JSON.parse(d.content.filter(x=>x.type==="text").map(x=>x.text).join("").replace(/```json|```/g,"").trim());
 if(!Array.isArray(j.subjects)||!j.body)throw new Error("Unexpected reply format");
 return{subjects:j.subjects.slice(0,5),pre:j.preview||"",body:j.body,cta:b.c||"Learn more"};
}
const words=s=>(s.match(/[\w'’]+/g)||[]).length;
const load=(k,d)=>{try{const s=JSON.parse(localStorage.getItem(k));if(s)return s}catch{}return d};
const esc=s=>s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

export default function App(){
 const [b,setB]=useState(()=>load("mc-brief",EMPTY)),[res,setRes]=useState(()=>load("mc-res",null)),[si,setSi]=useState(0),[seed,setSeed]=useState(0);
 const [name,setName]=useState("Sam"),[esp,setEsp]=useState("generic"),[dev,setDev]=useState("phone"),[mode,setMode]=useState("template"),[key,setKey]=useState("");
 const [busy,setBusy]=useState(false),[err,setErr]=useState(""),[msg,setMsg]=useState(""),[drafts,setDrafts]=useState(()=>load("mc-drafts",[]));
 useEffect(()=>{try{localStorage.setItem("mc-brief",JSON.stringify(b));localStorage.setItem("mc-res",JSON.stringify(res));localStorage.setItem("mc-drafts",JSON.stringify(drafts))}catch{}},[b,res,drafts]);
 useEffect(()=>{if(!msg)return;const t=setTimeout(()=>setMsg(""),1800);return()=>clearTimeout(t)},[msg]);
 const ready=(b.p.trim()||b.brand.trim());
 const fill=(s,mode2="preview")=>s.split(T0).join(mode2==="preview"?name||"there":ESP[esp][1]);
 const gen=async()=>{setErr("");setSi(0);if(mode==="template"){const n=seed+1;setSeed(n);setRes(tmpl(b,n));return}
  if(!key.trim()){setErr("Paste your API key to use Live AI mode, or switch to Template mode.");return}
  setBusy(true);try{setRes(await ai(b,key.trim()))}catch(e){setErr("Live AI failed: "+e.message)}setBusy(false)};
 const subj=res?res.subjects[si]||"":"";
 const checks=useMemo(()=>{if(!res)return[];const body=res.body,all=(subj+" "+res.pre+" "+body).toLowerCase(),hits=SPAM.filter(w=>all.includes(w)),caps=/\b[A-Z]{4,}\b/.test(subj+body),ex=((subj+body).match(/!/g)||[]).length,ctas=(body.match(/\[\[CTA\]\]/g)||[]).length,w=words(body);
  return[[subj.length<=50,"Subject length",subj.length+" characters. About 40 show on most phones; under 50 is safest."],
   [res.pre.length>=40&&res.pre.length<=100,"Preview text",res.pre.length+" characters. Aim for 40 to 90 so it adds to the subject."],
   [!hits.length,"Filter-risk words",hits.length?"Consider changing: "+hits.join(", ")+".":"No common trigger words found."],
   [!caps&&ex<=1,"Tone of voice",caps?"Avoid ALL CAPS words.":ex>1?"Use one exclamation mark at most.":"Calm and readable."],
   [ctas===1,"One clear call to action",ctas===1?"One button, as recommended.":ctas?"Use a single button.":"Add a [[CTA]] line for the button."],
   [body.includes(T0),"Personalization","Uses the first-name merge tag."+(body.includes(T0)?"":" Add one.")],
   [w<=200,"Length",w+" words, about "+Math.max(1,Math.round(w/200))+" min read. Under 200 is easiest to act on."]]},[res,subj]);
 const pass=checks.filter(c=>c[0]).length;
 const paras=res?fill(res.body).split(/\n\s*\n/):[];
 const html=()=>`<!doctype html><html><body style="margin:0;background:#f4eee8"><div style="max-width:600px;margin:0 auto;background:#fff;padding:32px;font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.6;color:#2a1b15">${res.body.split(/\n\s*\n/).map(p=>p.trim()==="[[CTA]]"?`<p style="margin:24px 0"><a href="https://example.com" style="background:#c8645a;color:#fff;text-decoration:none;padding:14px 26px;border-radius:6px;display:inline-block;font-weight:bold">${esc(res.cta)}</a></p>`:`<p style="margin:0 0 16px">${esc(fill(p,"export")).replace(/\n/g,"<br>")}</p>`).join("")}</div></body></html>`;
 const plain=()=>"Subject: "+fill(subj,"export")+"\nPreview: "+fill(res.pre,"export")+"\n\n"+fill(res.body,"export").replace("[[CTA]]","[ "+res.cta+" ]");
 const copy=async(t,m)=>{try{await navigator.clipboard.writeText(t);setMsg(m)}catch{setMsg("Copy failed")}};
 const dl=()=>{const u=URL.createObjectURL(new Blob([html()],{type:"text/html"}));const a=document.createElement("a");a.href=u;a.download="email.html";a.click();URL.revokeObjectURL(u)};
 const save=()=>{setDrafts([{id:Date.now(),name:(b.brand||"Draft")+" · "+TYPES[b.type].n,b,res,si},...drafts].slice(0,12));setMsg("Draft saved")};
 const set=(k,v)=>setB({...b,[k]:v});
 const fld=(k,l,ph)=><label className="fld">{l}<input value={b[k]} placeholder={ph} onChange={e=>set(k,e.target.value)}/></label>;
 const sel=(k,l,o)=><label className="fld">{l}<select value={b[k]} onChange={e=>set(k,e.target.value)}>{Object.entries(o).map(([v,x])=><option key={v} value={v}>{Array.isArray(x)?x[0]:x.n||x}</option>)}</select></label>;
 return <div className="app">
  <header><span className="tag">V2 · Inbox preview, checks and export</span><h1>MailCraft<span>AI</span></h1><p>Personalized email copy that is ready for Klaviyo, Mailchimp or any sender.</p></header>
  <div className="layout">
   <section className="panel form"><div className="th"><h2>The brief</h2><button className="link" onClick={()=>setB(SAMPLE)}>Load sample</button></div>
    <div className="mode" role="group" aria-label="Mode">{[["template","Template mode"],["ai","Live AI mode"]].map(([k,l])=><button key={k} className={mode===k?"on":""} aria-pressed={mode===k} onClick={()=>setMode(k)}>{l}</button>)}</div>
    {mode==="ai"&&<label className="fld">Your Anthropic API key <em>kept in memory only, never saved</em><input type="password" autoComplete="off" value={key} onChange={e=>setKey(e.target.value)} placeholder="sk-ant-..."/></label>}
    {sel("type","Email type",TYPES)}{fld("brand","Brand","e.g. Hanari Matcha")}{fld("p","Product or topic","e.g. the Starter Kit")}{fld("o","Offer (optional)","e.g. 10% off your first order")}{fld("c","Button text","e.g. Shop the Starter Kit")}{fld("sender","Sender first name","e.g. Mina")}
    <div className="two">{sel("seg","Audience",SEG)}{sel("tone","Tone",{friendly:"Friendly",professional:"Professional",playful:"Playful"})}</div>
    <div className="fld">Length<div className="chips" role="group" aria-label="Length">{["short","medium","detailed"].map(l=><button key={l} className={b.len===l?"on":""} aria-pressed={b.len===l} onClick={()=>set("len",l)}>{cap(l)}</button>)}</div></div>
    <button className="btn big" disabled={!ready||busy} onClick={gen}>{busy?"Writing...":res?"Write a new version":"Write my email"}</button>
    {err&&<p className="err" role="alert">{err}</p>}
   </section>
   <section className="res">
    {!res?<div className="empty big2"><h2>Your email will appear here</h2><p>Add a brand or product, or tap <strong>Load sample</strong>, then write your email. Template mode needs no account.</p></div>:<>
    <div className="panel"><div className="th"><h2>Subject lines</h2><span className="small">Tap one to preview it</span></div>
     <ul className="subs">{res.subjects.map((s,i)=><li key={i}><button className={si===i?"on":""} onClick={()=>setSi(i)} aria-pressed={si===i}><span>{fill(s)}</span><em className={s.length>50?"over":""}>{fill(s).length}</em></button></li>)}</ul>
     <label className="fld">Preview text<input value={res.pre} onChange={e=>setRes({...res,pre:e.target.value})}/></label></div>
    <div className="cols2">
     <div className="panel"><div className="th"><h2>Edit the email</h2></div><textarea rows="15" value={res.body} onChange={e=>setRes({...res,body:e.target.value})} aria-label="Email body"/><p className="small">{words(res.body)} words. <code>{T0}</code> becomes the first name and <code>[[CTA]]</code> becomes the button.</p>
      <label className="fld">Button text<input value={res.cta} onChange={e=>setRes({...res,cta:e.target.value})}/></label></div>
     <div className="panel"><div className="th"><h2>Inbox check</h2><b className="big">{pass}/{checks.length}</b></div>
      <ul className="checks">{checks.map(([ok,h,d])=><li key={h} className={ok?"y":"n"}><span aria-hidden="true">{ok?"✓":"!"}</span><div><strong>{h}</strong><small>{d}</small></div></li>)}</ul></div></div>
    <div className="panel"><div className="th"><h2>Preview</h2><div className="hb"><label className="inl">Recipient <input value={name} onChange={e=>setName(e.target.value)} aria-label="Preview first name"/></label>
      <div className="chips">{["phone","desktop"].map(d=><button key={d} className={dev===d?"on":""} onClick={()=>setDev(d)}>{cap(d)}</button>)}</div></div></div>
     <div className="inbox"><i/><div><b>{b.sender?b.sender+" from ":""}{b.brand||"Your brand"}</b><strong>{dev==="phone"&&fill(subj).length>40?fill(subj).slice(0,38)+"…":fill(subj)}</strong><span>{fill(res.pre)}</span></div></div>
     <div className={"mail "+dev}><div className="mb">{paras.map((p,i)=>p.trim()==="[[CTA]]"?<p key={i}><span className="cta">{res.cta}</span></p>:<p key={i}>{p.split("\n").map((l,j)=><span key={j}>{l}<br/></span>)}</p>)}</div></div></div>
    <div className="panel"><div className="th"><h2>Export</h2><label className="inl">Merge tags for <select value={esp} onChange={e=>setEsp(e.target.value)}>{Object.entries(ESP).map(([k,v])=><option key={k} value={k}>{v[0]}</option>)}</select></label></div>
     <div className="hb"><button className="btn sm" onClick={()=>copy(plain(),"Copied text")}>Copy text</button><button className="btn sm" onClick={()=>copy(html(),"Copied HTML")}>Copy HTML</button><button className="btn sm ghost" onClick={dl}>Download .html</button><button className="btn sm ghost" onClick={save}>Save draft</button></div></div></>}
    <p className="msg" role="status">{msg}</p>
   </section>
  </div>
  {drafts.length>0&&<section className="panel dr"><h2>Saved drafts</h2><ul>{drafts.map(d=><li key={d.id}><span>{d.name}</span><div className="hb"><button className="btn sm ghost" onClick={()=>{setB(d.b);setRes(d.res);setSi(d.si||0);window.scrollTo({top:0,behavior:"smooth"})}}>Open</button><button className="del" aria-label="Delete draft" onClick={()=>setDrafts(drafts.filter(x=>x.id!==d.id))}>×</button></div></li>)}</ul></section>}
  <footer>Checks are guidelines, not a guarantee of inbox placement. Always include an unsubscribe link and your business address when you send. Drafts are saved in this browser only.</footer>
 </div>;
}
