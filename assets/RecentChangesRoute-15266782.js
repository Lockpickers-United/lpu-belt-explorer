import{b as C,r as p,j as e,R as h,U as v,H as y,G as R,B as T,D as F,d as c,Q as L,Z as f,N as $,F as E,T as S}from"./index-1f1e72e0.js";import{u as D}from"./usePageTitle-b5b364a4.js";import{B as N}from"./BeltStripe-8cf7159d.js";import{F as P}from"./FieldValue-e25ec505.js";import{L as B}from"./LockImageGallery-4b755f3d.js";import{e as g}from"./entryName-3810c848.js";import{L as M}from"./ListItem-5d6fd4c5.js";import{b as W,a as z}from"./setDeep-3cdc0a9f.js";import{d as I}from"./ContentCopy-9c73668c.js";import{L as x}from"./Link-aaf9c29d.js";import{a as A,l as H}from"./filterFields-1f3108b5.js";import{D as w}from"./LockDataProvider-c7a6db87.js";import"./useDocumentTitle-8d6a269d.js";import"./ImageGallery-07ce3626.js";import"./ImageViewer-636f890b.js";import"./Link-b8d64192.js";import"./Launch-b0394def.js";import"./Dialog-e0ef9d82.js";import"./LinearProgress-68533f9c.js";import"./DialogContent-8db5f6bb.js";import"./ImageListItem-fdbbe1f8.js";import"./index-8e842837.js";function U({entry:t}){var l;const i=C(),a=g(t).replace(/[\s/]/g,"_").replace(/\W/g,""),n=p.useCallback(o=>{o.preventDefault(),o.stopPropagation(),i(`/locks?id=${t.id}&name=${a}`)},[t.id,i,a]);return e.jsx(h.Fragment,{children:e.jsxs(M,{style:{minHeight:64,borderTop:"1px solid rgba(255, 255, 255, 0.12)",display:"block",margin:"20px 0px"},children:[e.jsxs("div",{style:{display:"flex",width:"100%",cursor:"pointer"},onClick:n,children:[e.jsx(N,{value:t.belt}),e.jsx(v,{primary:g(t),primaryTypographyProps:{fontWeight:500,fontSize:"1.1rem"},secondary:t.version,secondaryTypographyProps:{fontSize:"1rem"},style:{padding:"0px 0px 0px 10px"}})]}),!!((l=t.media)!=null&&l.length)&&e.jsx(P,{value:e.jsx(B,{entry:t})})]},t.id)})}function q({thanksText:t}){const i=p.useCallback(()=>{navigator.clipboard.writeText(t).then(),y("Thank you text copied to clipboard.")},[t]);return e.jsx(h.Fragment,{children:e.jsx(R,{title:"Export",arrow:!0,disableFocusListener:!0,children:e.jsx(T,{variant:"outlined",size:"small",onClick:i,style:{color:"#ddd",borderColor:"#ddd"},startIcon:e.jsx(I,{}),children:"Export"})})})}function G({allEntries:t}){const{adminRole:i}=p.useContext(F),s=14,[a,n]=p.useState(s*24),l=a===s*24?`${s} days`:`${a} hours`,{newImageEntries:o=[],newImageContributors:d=[]}=O({entries:t,recentHours:a});o==null||o.sort((r,m)=>Math.floor(c(m.lastUpdated).valueOf()/3600)-Math.floor(c(r.lastUpdated).valueOf()/3600)||`${r.makeModels[0].make}${r.makeModels[0].model}`.localeCompare(`${m.makeModels[0].make}${m.makeModels[0].model}`)),d==null||d.sort((r,m)=>r.localeCompare(m));const j=d.length>0?"Many thanks to @"+d.join(" @")+`!
`:`No new contributors found
`,k=o?o.map(r=>`https://lpubelts.com/#/locks?tab=search&search=${r.id}&id=${r.id}&name=${g(r,"safe")}`):[],b=[j,...k].join(`
- `)+`

See all recent additions at **https://lpubelts.com/#/recent**`,u=p.useCallback(r=>{n(r)},[]);return e.jsxs(h.Fragment,{children:[e.jsxs("div",{style:{padding:0,maxWidth:700,marginLeft:"auto",marginRight:"auto",marginTop:20,fontWeight:500,fontSize:"1.5rem"},children:["Recently added images (",l,")"]}),o.length>0?e.jsx(L,{style:{padding:0,maxWidth:700,marginLeft:"auto",marginRight:"auto"},children:o.map(r=>e.jsx(U,{entry:r},r.id))}):e.jsx("div",{style:{padding:0,maxWidth:700,marginLeft:"auto",marginRight:"auto",marginTop:20,fontSize:"1rem"},children:"None found"}),i&&e.jsxs("div",{style:{padding:0,maxWidth:700,margin:"30px auto",fontSize:"1rem",textAlign:"center"},children:["Last ",e.jsx(x,{onClick:()=>u(12),style:{color:a===12?"#de9c12":"#14a7c7"},children:"12"})," | ",e.jsx(x,{onClick:()=>u(24),style:{color:a===24?"#de9c12":"#14a7c7"},children:"24"})," | ",e.jsx(x,{onClick:()=>u(48),style:{color:a===48?"#de9c12":"#14a7c7"},children:"48"})," | ",e.jsx(x,{onClick:()=>u(s*24),style:{color:a===s*24?"#de9c12":"#14a7c7"},children:"all"})," hours",e.jsx("br",{}),e.jsx("br",{}),e.jsx(q,{thanksText:b})]})]})}function O({entries:t,recentHours:i}){return t.reduce((s,a)=>{var l;const n=(l=a==null?void 0:a.media)==null?void 0:l.filter(o=>c(o.dateAdded).isAfter(c().subtract(i,"hour"))).sort((o,d)=>(W(s,["newImageContributors"],o.title.replace("By: ","")),c(d.dateAdded).diff(c(o.dateAdded))));return(n==null?void 0:n.length)>0&&z(s,["newImageEntries"],{...a,media:n}),s},{})}function xe(){return D("Recent Changes"),e.jsx(A,{filterFields:H,children:e.jsx(w,{allEntries:f,profile:void 0,children:e.jsxs(h.Fragment,{children:[e.jsx($,{title:"Recent Changes"}),e.jsx(G,{allEntries:f}),e.jsx(E,{}),e.jsx(S,{feature:"recentChanges"})]})})})}export{xe as default};
