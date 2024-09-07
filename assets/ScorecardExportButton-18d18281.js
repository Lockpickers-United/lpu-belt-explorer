import{r as t,U as E,ac as T,p as I,j as e,V as M,W as L,w as D,a8 as R,t as z,v as g,a1 as B,R as $,T as N,I as W,M as _,x as h,y as p,z as j}from"./index-5aed8077.js";import{m as A}from"./mycollection-0ec86312.js";import{u as F}from"./useWindowSize-e33788c7.js";import{B as J}from"./Box-821e937f.js";import{d as v,a as y,b as O,c as P}from"./download-909d6049.js";import{D as V,e as S}from"./index-4631fc0d.js";import{d as U}from"./ContentCopy-c322a910.js";function Z({collectionType:l}){const{user:c}=t.useContext(E),{userId:u}=T(),d=I(),{isMobile:n}=F(),r=n?{marginTop:20,maxWidth:700,marginLeft:8,marginRight:8,borderRadius:0}:{marginTop:20,maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0},m=u===(c==null?void 0:c.uid),k=m?e.jsx("div",{style:{width:"100%",display:"flex",placeItems:"center"},children:e.jsxs("div",{style:{fontSize:"1.0rem",fontWeight:400,width:400,marginLeft:"auto",marginRight:"auto"},children:[e.jsx("strong",{children:"There are no locks in your Scorecard."}),e.jsx("br",{}),'Browse the site and use the "My Collection" button to track locks that you have picked and recorded.',e.jsx("br",{}),e.jsx("br",{}),e.jsx("img",{alt:"My Collection",src:A})]})}):"There are no locks in this collection.",f=m?l==="safelocks"?"Explore Safe Locks":"Explore Locks":"Go Home",a=t.useCallback(()=>{d(l==="safelocks"?"/safelocks":"/locks")},[d,l]);return e.jsx(J,{alignContent:"center",children:e.jsxs(M,{style:r,children:[e.jsx(L,{children:e.jsx(D,{variant:"h6",align:"center",children:k})}),e.jsxs(R,{children:[e.jsx("div",{style:{width:"100%"}}),e.jsx(z,{variant:"outlined",color:"secondary",onClick:a,style:{whiteSpace:"nowrap",padding:"10px 30px",margin:10},children:f})]})]})})}function ee(){const[l,c]=t.useState(null),u=!!l,d=t.useCallback(a=>c(a.currentTarget),[]),n=t.useCallback(()=>c(null),[]),{visibleEntries:r=[]}=t.useContext(V),m=t.useCallback(()=>{const a=JSON.stringify(r);n(),v("scorecardData.json",a),g("Current Scorecard entries downloaded as scorecardData.json")},[n,r]),k=t.useCallback(()=>{const C=r.map(s=>({id:s.id,make:s.makeModels.map(x=>x.make).join(","),model:s.makeModels.map(x=>x.model).join(","),version:s.version,belt:s.belt,name:S(s),versionText:s.version?" ("+s.version+")":""})).map(s=>"* "+s.name+s.versionText).join(`
`);n(),navigator.clipboard.writeText(C),g("Current scorecard entries copied to clipboard.")},[n,r]),f=t.useCallback(()=>{const a=["id","name","version","belt","modifier","points","date","link"],C=r.map(o=>({id:o.matchId,make:o.makeModels.map(i=>i.make).join(","),model:o.makeModels.map(i=>i.model).join(","),version:o.version,belt:o.belt,link:o.link,modifier:o.modifier,points:o.points,date:o.date?B(o.date).format("L"):"",name:S(o)})),s=a.join(","),x=C.map(o=>a.map(i=>o[i]).map(i=>{const b=`${i??""}`.replace(/"/g,'""');return/(\s|,|")/.test(b)?`"${b}"`:b}).join(",")).join(`
`),w=`${s}
${x}`;n(),v("scorecardData.csv",w),g("Current Scorecard entries downloaded as scorecardData.csv")},[n,r]);return e.jsxs($.Fragment,{children:[e.jsx(N,{title:"Export",arrow:!0,disableFocusListener:!0,children:e.jsx(W,{onClick:d,children:e.jsx(y,{})})}),e.jsxs(_,{anchorEl:l,open:u,onClose:n,children:[e.jsxs(h,{disabled:!0,children:[e.jsx(p,{children:e.jsx(y,{fontSize:"small"})}),e.jsx(j,{children:"Export"})]}),e.jsxs(h,{onClick:k,children:[e.jsx(p,{children:e.jsx(U,{fontSize:"small"})}),e.jsx(j,{children:"Copy to clipboard"})]}),e.jsxs(h,{onClick:f,children:[e.jsx(p,{children:e.jsx(O,{fontSize:"small"})}),e.jsx(j,{children:"CSV"})]}),e.jsxs(h,{onClick:m,children:[e.jsx(p,{children:e.jsx(P,{fontSize:"small"})}),e.jsx(j,{children:"JSON"})]})]})]})}export{ee as E,Z as N};
