import{r as o,p as c,ar as g,j as r,R as d,z as u,y as f,I as h,J as j,K as v,N as y,O as C,P as k}from"./index-5aed8077.js";import{D as F,e as p,a as I,l as b}from"./index-4631fc0d.js";import{u as L}from"./usePageTitle-06703a65.js";import{a as E}from"./LockListContext-5759b955.js";import{D as P}from"./LockDataProvider-beef3350.js";import{B as T}from"./BeltStripe-daf1d474.js";import{d as R}from"./Link-ffdbe88c.js";import{I as D}from"./IntroCopy-2df69996.js";import{L as N}from"./ListItem-e44c43d5.js";import"./useDocumentTitle-b5454e3e.js";import"./Link-281d4d9e.js";function U(){const{allEntries:a=[]}=o.useContext(F),l=o.useCallback(t=>a.find(e=>e.id===t),[a]),i=c(),m=o.useCallback(t=>()=>{i(`/locks?id=${t.id}`)},[i]),x=g.map(t=>t.map(e=>l(e)).filter(e=>e)).filter(t=>t.length>0).sort((t,e)=>p(t[0]).localeCompare(p(e[0]))),n={maxWidth:700,marginLeft:"auto",marginRight:"auto"};return r.jsx(d.Fragment,{children:r.jsxs("div",{style:{margin:8,padding:"20px 0px"},children:[r.jsx(D,{pageName:"upgrades"}),x.map((t,e)=>r.jsxs(d.Fragment,{children:[r.jsx("div",{style:{...n,borderTop:"1px solid #666",height:0}}),t.map(s=>r.jsx(d.Fragment,{children:r.jsxs(N,{style:{...n,minHeight:64,borderTop:"1px solid rgba(255, 255, 255, 0.12)",borderRight:"1px solid #666"},children:[r.jsx(T,{value:s.belt}),r.jsx(u,{primary:p(s),primaryTypographyProps:{fontWeight:500},secondary:s.version,style:{padding:"0px 0px 0px 10px"}}),r.jsx(f,{style:{minWidth:20,marginLeft:16},children:r.jsx(h,{onClick:m(s),children:r.jsx(R,{})})})]},s.id)},s.id)),r.jsx("div",{style:{...n,borderTop:"1px solid #666",height:20}})]},e))]})})}function w(){const{lockCollection:a}=o.useContext(j);L("Upgrades");const l=null,i=null;return r.jsx(I,{filterFields:b,children:r.jsx(P,{allEntries:v,profile:a,children:r.jsxs(E,{children:[r.jsx(y,{title:"Upgrades",extras:l}),r.jsx(U,{profile:a}),r.jsx(C,{extras:i}),r.jsx(k,{feature:"upgrades"})]})})})}export{w as default};
