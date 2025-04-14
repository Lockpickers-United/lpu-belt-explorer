import{b as O,r,j as e,R as F,a9 as G,aa as y,al as I,W as S,ap as A,aq as j,u as M,a0 as P,a1 as T}from"./index-71c5eed6.js";import{F as L}from"./DataContext-c1f23a1c.js";import{g as V}from"./glossary-db95354d.js";import{C as k}from"./Chip-94ee05c8.js";import{L as $}from"./Link-05057277.js";import{F as z}from"./FieldValue-7d20e0ca.js";import{f as R,C as E}from"./SearchBox-0179a0e5.js";import{F as N,I as U,S as q}from"./Select-5e37be19.js";function ee({field:o,value:l,label:c=l,mode:a,...d}){const f=O(),[p,n]=r.useState(!1),{filters:t,addFilter:h}=r.useContext(L),g=r.useCallback(s=>{s.preventDefault(),s.stopPropagation(),n(!1)},[]),C=r.useCallback(s=>{var m;s.preventDefault(),s.stopPropagation(),n(!1),(m=t[o])!=null&&m.includes(l)||h(o,l),window.scrollTo({top:0,behavior:"smooth"})},[h,o,t,l]),b=r.useCallback(s=>{s.preventDefault(),s.stopPropagation(),n(s.target)},[]),u=r.useCallback(s=>{s.stopPropagation(),n(!1);const m=encodeURI(l);setTimeout(()=>f(`/glossary?term=${m}`),0)},[f,l]),i=r.useMemo(()=>!!V.find(s=>s.term.toLowerCase()===l.toLowerCase()),[l]);return e.jsxs(F.Fragment,{children:[(!a||a==="full")&&i&&e.jsxs(F.Fragment,{children:[e.jsx(k,{clickable:!0,variant:"outlined",label:c,style:{marginRight:4,marginBottom:4},onClick:b,...d}),!!p&&e.jsxs(G,{open:!!p,anchorEl:p,anchorOrigin:{horizontal:"right",vertical:"bottom"},onClose:g,children:[e.jsxs(y,{disabled:!0,children:["Term: ",l]}),e.jsx(I,{}),e.jsx(y,{onClick:C,children:"Add Filter"}),e.jsx(y,{onClick:u,disabled:!i,children:"Go to Glossary"})]})]}),(a==="simple"||(!a||a==="full")&&!i)&&e.jsx(k,{clickable:!0,variant:"outlined",label:c,style:{marginRight:4,marginBottom:4},onClick:C,...d}),a==="text"&&e.jsx($,{style:{color:"#fff"},onClick:C,...d,children:c})]})}function v(){const{filters:o,filterCount:l,removeFilter:c,filterFieldsByFieldName:a}=r.useContext(L),d=r.useCallback((n,t)=>()=>{c(n,t)},[c]),f=r.useMemo(()=>{const{search:n,id:t,tab:h,name:g,sort:C,image:b,...u}=o;return Object.keys(u).map(i=>{const s=o[i];return Array.isArray(s)?s.map(m=>({key:i,value:m})):{key:i,value:s}}).flat()},[o]),p=r.useCallback((n,t)=>n==="Belt"?t==="Unranked"?n:t.includes("Black")?t.replace(/(Black)\s(\d+)/,"$1 Belt $2"):t+" Belt":n==="UL Group"?"Group "+t:n==="Wheels"?`${t} Wheels`:R[t]?R[t]:t,[]);return l===0?null:e.jsx(z,{name:"Current Filters",style:{marginBottom:0},value:e.jsx(S,{direction:"row",spacing:0,sx:{flexWrap:"wrap"},style:{marginRight:-24},children:f.map(({key:n,value:t},h)=>{var g;return e.jsx(k,{label:`${p((g=a[n])==null?void 0:g.label,t)}`,variant:"outlined",style:{marginRight:4,marginBottom:4},onDelete:d(n,t)},h)})})})}function te({profile:o={},collectionType:l}){const{userId:c}=A(),{filters:a,filterCount:d,addFilter:f}=r.useContext(L),[p,n]=F.useState(!1),t=j[l].labels,h=j[l].keyByLabel,g=j[l].getCollected(o)||[],{isMobile:C}=M(),b=C?{maxWidth:700,borderRadius:0}:{maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0},{collection:u=c&&d===0?"Any":null}=a,i=t.includes(u)&&d<2;let s="";u&&(typeof u=="string"?s=u:s="Any");const m=r.useCallback(()=>n(!1),[]),W=r.useCallback(()=>n(!0),[]),w=r.useCallback(x=>{f("collection",x.target.value,!0)},[f]);return!d&&!c?null:e.jsx(P,{style:b,sx:{paddingBottom:0,paddingTop:2},children:e.jsxs(T,{style:{paddingTop:0,paddingLeft:8},children:[i&&e.jsxs("div",{style:{display:"flex"},children:[e.jsxs(N,{fullWidth:!0,size:"small",color:"secondary",sx:{marginLeft:"8px",minWidth:80,maxWidth:300},children:[e.jsx(U,{id:"label",children:"Collection"}),e.jsx(q,{name:"collection-selector",label:"Collection",open:p,onClose:m,onOpen:W,value:s,onChange:w,style:{backgroundColor:"#222",fontSize:"1.1rem",fontWeight:500},color:"secondary",children:t.map((x,D)=>{var B;return e.jsxs(y,{value:x,children:[x," (",x==="Any"?g.length:((B=o[h[x]])==null?void 0:B.length)||0,")"]},D)})})]}),e.jsx("div",{style:{flexGrow:1,marginTop:2,marginLeft:15},children:e.jsx(E,{})})]}),!i&&e.jsx(v,{})]})})}export{ee as F,te as I};
