import{r as t,A as w,ao as T,b as I,u as M,j as e,a3 as L,a4 as B,J as D,ai as R,B as $,H as g,d as z,R as N,G as A,I as J,X as W,Y as h,Z as p,U as j}from"./index-4924184b.js";import{m as _}from"./mycollection-0ec86312.js";import{B as F}from"./Box-41e6311c.js";import{d as v,a as y,b as O,c as P}from"./download-83603d8f.js";import{e as S}from"./entryName-760b6307.js";import{d as G}from"./ContentCopy-e30bac7f.js";import{D as H}from"./filterFields-09bea8e4.js";function Q({collectionType:l}){const{user:c}=t.useContext(w),{userId:u}=T(),d=I(),{isMobile:n}=M(),r=n?{marginTop:20,maxWidth:700,marginLeft:8,marginRight:8,borderRadius:0}:{marginTop:20,maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0},m=u===(c==null?void 0:c.uid),k=m?e.jsx("div",{style:{width:"100%",display:"flex",placeItems:"center"},children:e.jsxs("div",{style:{fontSize:"1.0rem",fontWeight:400,width:400,marginLeft:"auto",marginRight:"auto"},children:[e.jsx("strong",{children:"There are no locks in your Scorecard."}),e.jsx("br",{}),'Browse the site and use the "My Collection" button to track locks that you have picked and recorded.',e.jsx("br",{}),e.jsx("br",{}),e.jsx("img",{alt:"My Collection",src:_})]})}):"There are no locks in this collection.",f=m?l==="safelocks"?"Explore Safe Locks":"Explore Locks":"Go Home",a=t.useCallback(()=>{d(l==="safelocks"?"/safelocks":"/locks")},[d,l]);return e.jsx(F,{alignContent:"center",children:e.jsxs(L,{style:r,children:[e.jsx(B,{children:e.jsx(D,{variant:"h6",align:"center",children:k})}),e.jsxs(R,{children:[e.jsx("div",{style:{width:"100%"}}),e.jsx($,{variant:"outlined",color:"secondary",onClick:a,style:{whiteSpace:"nowrap",padding:"10px 30px",margin:10},children:f})]})]})})}function ee(){const[l,c]=t.useState(null),u=!!l,d=t.useCallback(a=>c(a.currentTarget),[]),n=t.useCallback(()=>c(null),[]),{visibleEntries:r=[]}=t.useContext(H),m=t.useCallback(()=>{const a=JSON.stringify(r);n(),v("scorecardData.json",a),g("Current Scorecard entries downloaded as scorecardData.json")},[n,r]),k=t.useCallback(()=>{const C=r.map(s=>({id:s.id,make:s.makeModels.map(x=>x.make).join(","),model:s.makeModels.map(x=>x.model).join(","),version:s.version,belt:s.belt,name:S(s),versionText:s.version?" ("+s.version+")":""})).map(s=>"* "+s.name+s.versionText).join(`
`);n(),navigator.clipboard.writeText(C),g("Current scorecard entries copied to clipboard.")},[n,r]),f=t.useCallback(()=>{const a=["id","name","version","belt","modifier","points","date","link"],C=r.map(o=>({id:o.matchId,make:o.makeModels.map(i=>i.make).join(","),model:o.makeModels.map(i=>i.model).join(","),version:o.version,belt:o.belt,link:o.link,modifier:o.evidenceModifier,points:o.points,date:o.date?z(o.date).format("L"):"",name:S(o)})),s=a.join(","),x=C.map(o=>a.map(i=>o[i]).map(i=>{const b=`${i??""}`.replace(/"/g,'""');return/(\s|,|")/.test(b)?`"${b}"`:b}).join(",")).join(`
`),E=`${s}
${x}`;n(),v("scorecardData.csv",E),g("Current Scorecard entries downloaded as scorecardData.csv")},[n,r]);return e.jsxs(N.Fragment,{children:[e.jsx(A,{title:"Export",arrow:!0,disableFocusListener:!0,children:e.jsx(J,{onClick:d,children:e.jsx(y,{})})}),e.jsxs(W,{anchorEl:l,open:u,onClose:n,children:[e.jsxs(h,{disabled:!0,children:[e.jsx(p,{children:e.jsx(y,{fontSize:"small"})}),e.jsx(j,{children:"Export"})]}),e.jsxs(h,{onClick:k,children:[e.jsx(p,{children:e.jsx(G,{fontSize:"small"})}),e.jsx(j,{children:"Copy to clipboard"})]}),e.jsxs(h,{onClick:f,children:[e.jsx(p,{children:e.jsx(O,{fontSize:"small"})}),e.jsx(j,{children:"CSV"})]}),e.jsxs(h,{onClick:m,children:[e.jsx(p,{children:e.jsx(P,{fontSize:"small"})}),e.jsx(j,{children:"JSON"})]})]})]})}export{ee as E,Q as N};