import{j as e,a0 as U,Q as G,U as C,ai as K,T as A,ap as Q,ad as X,r as n,ae as O,b as Y,G as L,I as $,K as Z,M as ee,H as T,R as w,an as se,aq as ae,ak as te,ar as D,W as k,J as E,B as q,a9 as ne,aa as I,as as B}from"./index-a08903d0.js";import{B as P}from"./BeltStripe-74f2ce5c.js";import{C as V,B as H}from"./BeltIcon-1953899b.js";import{e as y}from"./entryName-6a27208f.js";import{L as oe}from"./ListItem-afcecb18.js";import{d as ie,F as j}from"./FieldValue-121cb983.js";import{a as re,F as W}from"./InlineFilterDisplay-c0a15047.js";import{C as le,a as ce}from"./CopyEntryTextButton-709f6b68.js";import{F as de,D as N}from"./filterFields-36782c27.js";import{A as xe,a as me,b as ue}from"./AccordionSummary-fa0a3389.js";import{M as pe}from"./index-e21761a5.js";import{r as he}from"./index-9ca0c98a.js";import{A as je}from"./AccordionActions-d71d572b.js";import{d as R,a as F,b as fe,c as ge}from"./download-27602913.js";import{d as be}from"./ContentCopy-3b79d818.js";function Ve({entries:s}){return e.jsxs(U,{style:{maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0},children:[e.jsx(G,{dense:!0,style:{padding:0},children:s.map(a=>e.jsxs(oe,{style:{minHeight:64,borderTop:"1px solid rgba(255, 255, 255, 0.12)"},children:[e.jsx(P,{value:a.belt}),e.jsx(C,{primary:y(a),primaryTypographyProps:{fontWeight:500},secondary:a.version,style:{padding:"0px 0px 0px 10px"}}),e.jsx(V,{id:a.id,dense:!0,exposed:!0})]},a.id))}),e.jsx(K,{}),e.jsx(A,{feature:"compact"})]})}function ke({belt:s}){const{danPoints:a}=Q[s],i=a===1?"Point":a>=10?"Pts":"Points",u=` (${a} Dan ${i})`,c={textDecoration:"none",color:"#fff"};return a===0||s==="Unranked"?null:e.jsx("a",{style:c,href:"/#/dans",children:u})}function ve({entry:s}){const a=X(),{filters:i,addFilter:u,removeFilters:c}=n.useContext(de),l=n.useCallback(d=>{u("image",d+1,!0)},[u]),x=n.useCallback(()=>{c(["image"])},[c]),h=n.useCallback(()=>{const{image:d}=O.parse(a.search);return z(d,s)},[s,a]),m=n.useMemo(()=>i.image?+i.image-1:-1,[i]),v=z(m,s);return e.jsx(re,{media:s.media,openIndex:m,initiallyOpen:v,onOpenImage:l,onCloseImage:x,onBackButton:h,shareParams:{id:s.id,name:i.name}})}const z=(s,a)=>/\d+/.test(s)&&!!a.media[s];function Ce({id:s,onExpand:a,entryId:i}){const{getEntryFromId:u}=n.useContext(N),c=n.useMemo(()=>u(s),[u,s]),l=Y(),x=n.useCallback(async()=>{l(`/locks?id=${s}`),a(s)},[s,l,a]),h=s===i?{border:"1px solid #777"}:{},m=s===i;return e.jsx(L,{title:c.version,arrow:!0,disableFocusListener:!0,children:e.jsx("span",{children:e.jsx($,{onClick:x,style:h,disabled:m,children:e.jsx(H,{value:c.belt,related:!0,disabled:m})})})})}var _={},we=ee;Object.defineProperty(_,"__esModule",{value:!0});var J=_.default=void 0,Se=we(Z()),Me=e;J=_.default=(0,Se.default)((0,Me.jsx)("path",{d:"M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28M3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21m6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15m7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12M14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38"}),"Fingerprint");function Ee({entry:s}){const a=n.useCallback(async()=>{await navigator.clipboard.writeText(s.id),T("ID copied to clipboard.")},[s.id]);return e.jsx($,{onClick:a,style:{marginRight:210},children:e.jsx(J,{color:"primary"})})}function Ie({entry:s,expanded:a,onExpand:i}){var b,r,f,S,p;const{userId:u}=se(),[c,l]=n.useState(!1),x={maxWidth:700,marginLeft:"auto",marginRight:"auto"},h=n.useRef(null),m=[...new Set([...s.relatedIds||[],...ae(s.id)])].sort((t,o)=>te(D[t].belt,D[o].belt)||t.localeCompare(o)),v=n.useCallback((t,o)=>{i&&i(o?s.id:!1)},[s.id,i]);n.useEffect(()=>{if(a&&h&&!c){const o=window.innerWidth<=600?70:74,{id:g}=O.parse(location.search),M=g===s.id;l(!0),setTimeout(()=>{window.scrollTo({left:0,top:h.current.offsetTop-o,behavior:M?"auto":"smooth"})},M?0:100)}else a||l(!1)},[a,s,c]);const d=n.useMemo(()=>{var t;return e.jsx(k,{direction:"column",spacing:0,sx:{flexWrap:"wrap"},children:(t=s.makeModels)==null?void 0:t.map(({make:o,model:g},M)=>e.jsx(E,{style:{fontWeight:500,fontSize:"1.07rem",lineHeight:1.25,marginBottom:"4px"},children:o&&o!==g?`${o} ${g}`:g},M))})},[s.makeModels]);return e.jsxs(xe,{expanded:a,onChange:v,style:x,ref:h,children:[e.jsxs(me,{expandIcon:e.jsx(ie,{}),children:[e.jsx(P,{value:s.belt}),e.jsxs("div",{style:{margin:"12px 0px 8px 8px",width:"55%",flexShrink:0,flexDirection:"column"},children:[e.jsx(j,{value:d,textStyle:s.belt==="Unranked"?{color:"#aaa",marginLeft:"0px"}:{marginLeft:"0px"},style:{marginBottom:"2px"}}),!!s.version&&e.jsx(j,{name:"Version",value:e.jsx(E,{style:{fontSize:"0.95rem",lineHeight:1.25},children:s.version}),textStyle:s.belt==="Unranked"?{color:"#aaa"}:{}})]}),e.jsx("div",{style:{margin:"8px 0px 0px 0px",width:"40%",flexShrink:0,flexDirection:"column"},children:((b=s.lockingMechanisms)==null?void 0:b.length)>0&&e.jsx(j,{value:e.jsx(k,{direction:"row",spacing:0,sx:{flexWrap:"wrap"},children:(r=s.lockingMechanisms)==null?void 0:r.map((t,o)=>e.jsx(W,{value:t,field:"lockingMechanisms"},o))})})})]}),a&&e.jsxs(w.Fragment,{children:[e.jsxs(ue,{sx:{padding:"8px 16px 0px 16px"},children:[e.jsxs(k,{direction:"row",spacing:1,sx:{width:"100%",flexWrap:"wrap"},children:[e.jsx(j,{style:{width:"50%",marginLeft:"0px"},value:e.jsxs(w.Fragment,{children:[e.jsxs(E,{style:{marginLeft:"0px",fontSize:"1rem",lineHeight:1.25,fontWeight:500},children:[s.belt,e.jsx(ke,{belt:s.belt})]}),e.jsx(H,{value:s.belt,style:{marginBottom:-10}})]})}),e.jsx("div",{style:{marginLeft:"auto"},children:e.jsx(V,{id:s.id,makeModels:s.makeModels})})]}),e.jsx(k,{direction:"row",spacing:1,sx:{width:"100%",flexWrap:"wrap"},children:!!s.notes&&e.jsx(j,{name:"Notes",value:e.jsx(E,{component:"div",style:{marginTop:-16},children:e.jsx(pe,{rehypePlugins:[[he,{target:"_blank"}]],children:s.notes})})})}),!!((f=s.features)!=null&&f.length)&&e.jsx(j,{name:"Features",value:e.jsx(k,{direction:"row",spacing:0,sx:{flexWrap:"wrap"},children:s.features.map((t,o)=>e.jsx(W,{value:t,field:"features"},o))})}),(m==null?void 0:m.length)>1&&!u&&e.jsx(j,{name:"Other Versions",value:e.jsx(w.Fragment,{children:m.map(t=>e.jsx(Ce,{id:t,onExpand:i,entryId:s.id},t))})}),!!((S=s.media)!=null&&S.length)&&e.jsx(j,{value:e.jsx(ve,{entry:s})}),!!((p=s.links)!=null&&p.length)&&e.jsx(j,{name:"Links",value:e.jsx(k,{direction:"row",spacing:1,sx:{flexWrap:"wrap"},children:s.links.map(({title:t,url:o},g)=>e.jsx(q,{href:o,target:"_blank",rel:"noopener noreferrer",color:"secondary",variant:"outlined",sx:{textTransform:"none"},style:{margin:4},children:t},g))})})]}),e.jsxs(je,{disableSpacing:!0,children:[e.jsx(A,{feature:"lock",id:s.id}),e.jsx(Ee,{entry:s}),e.jsx(le,{entry:s}),e.jsx(ce,{entry:s})]})]})]})}const He=w.memo(Ie,(s,a)=>s.entry.id===a.entry.id&&s.expanded===a.expanded&&s.onExpand===a.onExpand);function Ne({text:s}){const[a,i]=n.useState(null),u=!!a,c=n.useCallback(d=>i(d.currentTarget),[]),l=n.useCallback(()=>i(null),[]),{visibleEntries:x}=n.useContext(N),h=n.useCallback(()=>{const d=JSON.stringify(x);l(),R("lpubeltsdata.json",d),T("Current lock entries downloaded as lpubeltsdata.json")},[l,x]),m=n.useCallback(()=>{const b=x.map(r=>({id:r.id,make:r.makeModels.map(f=>f.make).join(","),model:r.makeModels.map(f=>f.model).join(","),version:r.version,belt:r.belt,name:y(r),versionText:r.version?" ("+r.version+")":""})).map(r=>"* "+r.name+r.versionText).join(`
`);l(),navigator.clipboard.writeText(b),T("Current lock entries copied to clipboard.")},[l,x]),v=n.useCallback(()=>{const d=["id","name","version","belt"],b=x.map(p=>({id:p.id,make:p.makeModels.map(t=>t.make).join(","),model:p.makeModels.map(t=>t.model).join(","),version:p.version,belt:p.belt,name:y(p)})),r=d.join(","),f=b.map(p=>d.map(t=>p[t]).map(t=>{const o=`${t??""}`.replace(/"/g,'""');return/(\s|,|")/.test(o)?`"${o}"`:o}).join(",")).join(`
`),S=`${r}
${f}`;l(),R("lpubeltsdata.csv",S),T("Current lock entries downloaded as lpubeltsdata.csv")},[l,x]);return e.jsxs(w.Fragment,{children:[s?e.jsx(L,{title:"Export",arrow:!0,disableFocusListener:!0,children:e.jsx(q,{variant:"outlined",size:"small",onClick:c,style:{color:"#ddd",borderColor:"#aaa"},startIcon:e.jsx(F,{}),children:"Export"})}):e.jsx(L,{title:"Export",arrow:!0,disableFocusListener:!0,children:e.jsx($,{onClick:c,children:e.jsx(F,{})})}),e.jsxs(ne,{anchorEl:a,open:u,onClose:l,children:[!s&&e.jsxs(I,{disabled:!0,children:[e.jsx(B,{children:e.jsx(F,{fontSize:"small"})}),e.jsx(C,{children:"Export"})]}),e.jsxs(I,{onClick:m,children:[e.jsx(B,{children:e.jsx(be,{fontSize:"small"})}),e.jsx(C,{children:"Copy to clipboard"})]}),e.jsxs(I,{onClick:v,children:[e.jsx(B,{children:e.jsx(fe,{fontSize:"small"})}),e.jsx(C,{children:"CSV"})]}),e.jsxs(I,{onClick:h,children:[e.jsx(B,{children:e.jsx(ge,{fontSize:"small"})}),e.jsx(C,{children:"JSON"})]})]})]})}export{Ve as C,He as E,Ne as a};
