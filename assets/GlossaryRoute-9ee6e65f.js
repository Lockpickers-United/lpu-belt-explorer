import{P as v,r as o,j as t,R as h,a0 as b,e as S,Y as T,Z as I,u as R,T as L,I as W,$ as G,N as E,K as P,O as B}from"./index-63cc4998.js";import{u as x}from"./useWindowSize-87022201.js";import{I as F,g as k}from"./ImageViewer-efdef525.js";import{M as y}from"./index-4219300d.js";import{d as g,I as M}from"./Search-b5f830ce.js";import{A}from"./Autocomplete-e3e1573a.js";import{T as $}from"./TextField-4069c683.js";import"./Link-5e44a200.js";import"./LinearProgress-b4d06b8a.js";import"./InputLabel-ad798557.js";import"./Chip-876c4dc0.js";function O({entry:e,highlighted:r}){const[s,n]=v(),{width:p}=x(),d=p<500?110:150,{term:m,media:{thumbnailUrl:u}={}}=e,[l,i]=o.useState(()=>s.get("image")==="1"&&r),a=o.useCallback(()=>{i(!0),s.set("image","1"),s.set("term",m),n(s)},[s,n,m]),f=o.useCallback(()=>{i(!1),s.delete("image"),n(s)},[s,n]);return u?t.jsxs(h.Fragment,{children:[t.jsx("div",{style:{margin:"6px 0px 12px 20px",float:"right",textAlign:"center",fontSize:"0.85rem"},children:t.jsx("img",{alt:m,src:u,style:{width:d,cursor:"pointer"},onClick:a})}),l&&t.jsx(F,{media:[e.media],openIndex:0,onClose:f,shareParams:{term:e.term}})]}):null}function z({entry:e,highlighted:r}){const s=o.useRef(),[n,p]=o.useState(!1),c={maxWidth:700,marginLeft:"auto",marginRight:"auto",padding:"0px 20px",borderRadius:0,backgroundColor:r?"#222":void 0};o.useEffect(()=>{r&&s&&!n&&setTimeout(()=>{p(!0),window.scrollTo({left:0,top:s.current.offsetTop-74})},0)},[r,e,n]);const d=o.useMemo(()=>{var i;let l=`\`${e.term}\`. ${e.definition}`;if((i=e.media)!=null&&i.title){const a=e.media.title.charAt(0).toLowerCase()+(e==null?void 0:e.media.title.slice(1));l+=` (Photo ${a})`}return l},[e]),u={code:({children:l})=>{const a=`https://share.lpubelts.com/?term=${encodeURI(l)}`,f=o.useCallback(async w=>{w.preventDefault(),await navigator.clipboard.writeText(a),S("Link copied to clipboard.")},[a]),C={fontWeight:700,fontSize:"1.1rem",marginBottom:4,color:"#fff",cursor:"pointer",textDecoration:"none"};return t.jsx("a",{style:C,onClick:f,href:a,children:l})}};return t.jsx(b,{style:c,ref:s,children:t.jsxs("div",{style:{color:"#ddd"},children:[t.jsx(O,{entry:e,highlighted:r}),t.jsx(y,{components:u,children:d})]})})}const D="Definitions can be tricky, and this is certainly true when it comes to locks. We've done our best to come up with accurate, concise definitions for terms **as they are generally used in Lock Pickers United contexts**. Many terms have multiple meanings and connotations. Regional differences, between Europe and the US for example, can be significant. We've had spirited debates involving very experienced locksport enthusiasts and locksmiths over seemingly simple definitions ... language is evolving and some of the terminology here is still being settled. &nbsp; &nbsp; *Enjoy!*";function U(){const e={maxWidth:700,marginLeft:"auto",marginRight:"auto",padding:"6px 20px",borderBottom:"1px solid #333",borderTop:"1px solid #333",borderRadius:0};return t.jsx(b,{style:e,children:t.jsx(y,{children:D})})}function N(){const e=T(),r=o.useMemo(()=>{const{term:s}=I.parse(e.search);return s&&s.toLowerCase()},[e.search]);return t.jsxs("div",{style:{margin:8,paddingBottom:32,marginLeft:"auto",marginRight:"auto",marginTop:16,marginButtom:16},children:[t.jsx(U,{}),q.map((s,n)=>t.jsx(z,{entry:s,highlighted:r===s.termLowerCased},n))]})}const q=k.map(e=>({...e,termLowerCased:e.term.toLowerCase()}));function K(){const{isMobile:e}=x(),r={maxWidth:450},s=R(),n=o.useRef(),p=o.useCallback((i,a)=>{a?j.includes(a)&&s(`/glossary?term=${a}`):s("/glossary")},[s]),[c,d]=o.useState(!1),m=o.useCallback(()=>{d(!0),setTimeout(()=>n.current.focus(),15)},[]),u=o.useCallback(()=>d(!1),[]),l=c&&e?{width:"auto",position:"fixed",left:60,right:0,paddingRight:16,maxWidth:"unset",zIndex:9999999,backgroundColor:"#272727"}:{};return t.jsxs(h.Fragment,{children:[!c&&e&&t.jsx(L,{title:"Search",arrow:!0,disableFocusListener:!0,children:t.jsx(W,{color:"inherit",onClick:m,children:t.jsx(g,{})})}),(c||!e)&&t.jsx(A,{selectOnFocus:!0,clearOnEscape:!0,handleHomeEndKeys:!0,fullWidth:!0,style:{...r,...l},options:j,onChange:p,renderInput:i=>t.jsx($,{...i,placeholder:"Search Glossary",variant:"standard",color:"secondary",inputRef:n,InputProps:{...i.InputProps,startAdornment:t.jsx(M,{position:"start",children:t.jsx(g,{})})}})}),t.jsx(G,{invisible:!0,open:c&&e,onClick:u})]})}const j=[...new Set(k.map(e=>e.term))];function oe(){const{isMobile:e}=x(),r=t.jsxs(h.Fragment,{children:[t.jsx(K,{}),!e&&t.jsx("div",{style:{flexGrow:1}})]});return t.jsxs(h.Fragment,{children:[t.jsx(E,{title:"Glossary",extras:r}),t.jsx(N,{}),t.jsx(P,{}),t.jsx(B,{feature:"glossary"})]})}export{oe as default};
