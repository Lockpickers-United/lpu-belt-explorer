import{j as e,a0 as Q,Q as X,U as M,al as Y,T as P,ah as Z,ad as ee,r as n,ae as V,R as w,b as se,G as S,I as y,K as ae,M as te,H as T,ap as ne,ar as oe,as as ie,at as O,W as I,J as L,B as H,a9 as le,aa as F,ak as B}from"./index-31ac1497.js";import{B as G}from"./BeltStripe-d5819e55.js";import{C as J}from"./EvidenceForm-686b7045.js";import{e as $}from"./entryName-4cc0d3e9.js";import{L as re}from"./ListItem-d15e8abc.js";import{d as ce}from"./ExpandMore-dd0d3017.js";import{F as b}from"./FieldValue-4cdd5254.js";import{B as U}from"./BeltIcon-80dc92cc.js";import{a as de,F as R}from"./InlineFilterDisplay-39ee254d.js";import{C as me,a as xe}from"./CopyEntryTextButton-28f01ab3.js";import{F as pe,D as W}from"./filterFields-dbed9748.js";import"./index-14620661.js";import{d as ue}from"./Link-67ed023a.js";import{A as he,a as fe,b as je}from"./AccordionSummary-fc1c9f37.js";import{M as q}from"./index-d1e23e9d.js";import{r as A}from"./index-6e465b00.js";import{A as ge}from"./AccordionActions-7a1fb846.js";import{d as z,a as _,b as be}from"./download-59939fda.js";import{d as ke}from"./List-5d31e3cc.js";import{d as ve}from"./ContentCopy-5019439b.js";function Xe({entries:s}){return e.jsxs(Q,{style:{maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0},children:[e.jsx(X,{dense:!0,style:{padding:0},children:s.map(a=>e.jsxs(re,{style:{minHeight:64,borderTop:"1px solid rgba(255, 255, 255, 0.12)"},children:[e.jsx(G,{value:a.belt}),e.jsx(M,{primary:$(a),primaryTypographyProps:{fontWeight:500},secondary:a.version,style:{padding:"0px 0px 0px 10px"}}),e.jsx(J,{id:a.id,dense:!0,exposed:!0})]},a.id))}),e.jsx(Y,{}),e.jsx(P,{feature:"compact"})]})}function Ce({belt:s}){const{danPoints:a}=Z[s],i=a===1?"Point":a>=10?"Pts":"Points",x=` (${a} Dan ${i})`,p={textDecoration:"none",color:"#fff"};return a===0||s==="Unranked"?null:e.jsx("a",{style:p,href:"/#/dans",children:x})}function we({entry:s}){const a=ee(),{filters:i,addFilter:x,removeFilters:p}=n.useContext(pe),c=n.useCallback(t=>{x("image",t,!0)},[x]),d=n.useCallback(()=>{p(["image"])},[p]),v=n.useCallback(()=>{const{image:t}=V.parse(a.search);return N(t,s)},[s,a]),f=n.useMemo(()=>i.image?+i.image:-1,[i]),k=N(f,s),u=s.media.sort((t,o)=>t.sequenceId-o.sequenceId),g=[...new Set(u==null?void 0:u.map(({label:t})=>t))].filter(t=>t),r=g.length>0?g.map(t=>({label:t,media:s.media.filter(({label:o})=>o===t)})):[{label:"allMedia",media:s.media}];g.length>0&&s.media.filter(t=>!t.label).length>0&&r.push({label:"Other",media:s.media.filter(t=>!t.label)});const j=s.media.sort((t,o)=>{var h;return((h=t.label)==null?void 0:h.localeCompare(o.label||""))||t.sequenceId-o.sequenceId});return e.jsx(w.Fragment,{children:r.map((t,o)=>e.jsx(w.Fragment,{children:e.jsxs("div",{children:[t.label!=="allMedia"&&e.jsx("div",{style:{borderBottom:"1px solid #bbb",marginLeft:0,fontWeight:500},children:t.label}),e.jsx(de,{media:t.media,allMedia:j,openIndex:f,initiallyOpen:k&&o===0,onOpenImage:c,onCloseImage:d,onBackButton:v,shareParams:{id:s.id,name:i.name}})]},o)},o))})}const N=(s,a)=>/\d+/.test(s)&&!!a.media.find(i=>i.sequenceId===s);function Ie({id:s,onExpand:a,entryId:i}){const{getEntryFromId:x}=n.useContext(W),p=n.useMemo(()=>x(s),[x,s]),c=se(),d=n.useCallback(async()=>{c(`/locks?id=${s}`),a(s)},[s,c,a]),v=s===i?{border:"1px solid #777"}:{},f=s===i;return e.jsx(S,{title:p.version,arrow:!0,disableFocusListener:!0,children:e.jsx("span",{children:e.jsx(y,{onClick:d,style:v,disabled:f,children:e.jsx(U,{value:p.belt,related:!0,disabled:f})})})})}var D={},Me=te;Object.defineProperty(D,"__esModule",{value:!0});var K=D.default=void 0,Se=Me(ae()),Ee=e;K=D.default=(0,Se.default)((0,Ee.jsx)("path",{d:"M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28M3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21m6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15m7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12M14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38"}),"Fingerprint");function Le({entry:s}){const a=n.useCallback(async()=>{await navigator.clipboard.writeText(s.id),T("ID copied to clipboard.")},[s.id]);return e.jsx(S,{title:"Copy Entry Id",arrow:!0,disableFocusListener:!0,children:e.jsx(y,{onClick:a,children:e.jsx(K,{color:"primary"})})})}function Fe({entry:s,nameType:a}){const i=n.useCallback(()=>{const p=$(s,a).replace(/[\s/]/g,"_").replace(/\W/g,""),c=`https://lpubelts.com/#/locks?tab=search&search=${s.id}&id=${s.id}&name=${p}`,d=window.open(c,"_blank","noopener,noreferrer");d&&(d.opener=null)},[s,a]);return e.jsx(S,{title:"Open Link to Entry in New Tab",arrow:!0,disableFocusListener:!0,children:e.jsx(y,{onClick:i,children:e.jsx(ue,{color:"primary"})})})}function Be({entry:s,expanded:a,onExpand:i}){var r,j,t,o,h;const{expandAll:x}=n.useContext(W),{userId:p}=ne(),[c,d]=n.useState(!1),v={maxWidth:700,marginLeft:"auto",marginRight:"auto"},f=n.useRef(null),k=[...new Set([...s.relatedIds||[],...oe(s.id)])].sort((l,m)=>ie(O[l].belt,O[m].belt)||l.localeCompare(m)),u=n.useCallback((l,m)=>{i&&i(m?s.id:!1)},[s.id,i]);n.useEffect(()=>{if(a&&f&&!c&&!x){const m=window.innerWidth<=600?70:74,{id:C}=V.parse(location.search),E=C===s.id;d(!0),setTimeout(()=>{window.scrollTo({left:0,top:f.current.offsetTop-m,behavior:E?"auto":"smooth"})},E?0:100)}else a||d(!1)},[a,s,c,x]);const g=n.useMemo(()=>{var l;return e.jsx(I,{direction:"column",spacing:0,sx:{flexWrap:"wrap"},children:(l=s.makeModels)==null?void 0:l.map(({make:m,model:C},E)=>e.jsx(L,{style:{fontWeight:500,fontSize:"1.07rem",lineHeight:1.25,marginBottom:"4px"},children:m&&m!==C?`${m} ${C}`:C},E))})},[s.makeModels]);return e.jsxs(he,{expanded:a,onChange:u,style:v,ref:f,children:[e.jsxs(fe,{expandIcon:e.jsx(ce,{}),children:[e.jsx(G,{value:s.belt}),e.jsxs("div",{style:{margin:"12px 0px 8px 8px",width:"55%",flexShrink:0,flexDirection:"column"},children:[e.jsx(b,{value:g,textStyle:s.belt==="Unranked"?{color:"#aaa",marginLeft:"0px"}:{marginLeft:"0px"},style:{marginBottom:"2px"}}),!!s.version&&e.jsx(b,{name:"Version",value:e.jsx(L,{style:{fontSize:"0.95rem",lineHeight:1.25},children:s.version}),textStyle:s.belt==="Unranked"?{color:"#aaa"}:{}})]}),e.jsx("div",{style:{margin:"8px 0px 0px 0px",width:"40%",flexShrink:0,flexDirection:"column"},children:((r=s.lockingMechanisms)==null?void 0:r.length)>0&&e.jsx(b,{value:e.jsx(I,{direction:"row",spacing:0,sx:{flexWrap:"wrap"},children:(j=s.lockingMechanisms)==null?void 0:j.map((l,m)=>e.jsx(R,{value:l,field:"lockingMechanisms"},m))})})})]}),a&&e.jsxs(w.Fragment,{children:[e.jsxs(je,{sx:{padding:"8px 16px 0px 16px"},children:[e.jsxs(I,{direction:"row",spacing:1,sx:{width:"100%",flexWrap:"wrap"},children:[e.jsx(b,{style:{width:"50%",marginLeft:"0px"},value:e.jsxs(w.Fragment,{children:[e.jsxs(L,{style:{marginLeft:"0px",fontSize:"1rem",lineHeight:1.25,fontWeight:500},children:[s.belt,e.jsx(Ce,{belt:s.belt})]}),e.jsx(U,{value:s.belt,style:{marginBottom:-10}})]})}),e.jsx("div",{style:{marginLeft:"auto"},children:e.jsx(J,{id:s.id,makeModels:s.makeModels})})]}),e.jsx(I,{direction:"row",spacing:1,sx:{width:"100%",flexWrap:"wrap"},children:!!s.notes&&e.jsx(b,{name:"Notes",value:e.jsx(L,{component:"div",style:{marginTop:-16},children:e.jsx(q,{rehypePlugins:[[A,{target:"_blank"}]],children:s.notes})})})}),!!((t=s.features)!=null&&t.length)&&e.jsx(b,{name:"Features",value:e.jsx(I,{direction:"row",spacing:0,sx:{flexWrap:"wrap"},children:s.features.map((l,m)=>e.jsx(R,{value:l,field:"features"},m))})}),(k==null?void 0:k.length)>1&&!p&&e.jsx(b,{name:"Other Versions",value:e.jsx(w.Fragment,{children:k.map(l=>e.jsx(Ie,{id:l,onExpand:i,entryId:s.id},l))})}),!!s.description&&e.jsx("div",{style:{margin:8},children:e.jsx(q,{rehypePlugins:[[A,{target:"_blank",rel:["nofollow","noopener","noreferrer"]}]],children:s.description})}),!!((o=s.media)!=null&&o.length)&&e.jsx(b,{value:e.jsx(we,{entry:s})}),!!((h=s.links)!=null&&h.length)&&e.jsx(b,{name:"Links",value:e.jsx(I,{direction:"row",spacing:1,sx:{flexWrap:"wrap"},children:s.links.map(({title:l,url:m},C)=>e.jsx(H,{href:m,target:"_blank",rel:"noopener noreferrer",color:"secondary",variant:"outlined",sx:{textTransform:"none"},style:{margin:4},children:l},C))})})]}),e.jsx(ge,{disableSpacing:!0,children:e.jsxs("div",{style:{display:"flex",width:"100%"},children:[e.jsxs("div",{style:{flexGrow:1,justifyItems:"left"},children:[!x&&e.jsx(P,{feature:"lock",id:s.id}),e.jsx(Le,{entry:s}),e.jsx(Fe,{entry:s})]}),e.jsxs("div",{style:{display:"flex"},children:[e.jsx(me,{entry:s}),e.jsx(xe,{entry:s})]})]})})]})]})}const Ye=w.memo(Be,(s,a)=>s.entry.id===a.entry.id&&s.expanded===a.expanded&&s.onExpand===a.onExpand);function Ze({text:s}){const[a,i]=n.useState(null),x=!!a,p=n.useCallback(u=>i(u.currentTarget),[]),c=n.useCallback(()=>i(null),[]),{visibleEntries:d}=n.useContext(W),v=n.useCallback(()=>{const u=JSON.stringify(d);c(),z("lpubeltsdata.json",u),T("Current lock entries downloaded as lpubeltsdata.json")},[c,d]),f=n.useCallback(()=>{const g=d.map(r=>({id:r.id,make:r.makeModels.map(j=>j.make).join(","),model:r.makeModels.map(j=>j.model).join(","),version:r.version,belt:r.belt,name:$(r),versionText:r.version?" ("+r.version+")":""})).map(r=>"* "+r.name+r.versionText).join(`
`);c(),navigator.clipboard.writeText(g),T("Current lock entries copied to clipboard.")},[c,d]),k=n.useCallback(()=>{const u=["id","name","version","belt"],g=d.map(o=>({id:o.id,make:o.makeModels.map(h=>h.make).join(","),model:o.makeModels.map(h=>h.model).join(","),version:o.version,belt:o.belt,name:$(o)})),r=u.join(","),j=g.map(o=>u.map(h=>o[h]).map(h=>{const l=`${h??""}`.replace(/"/g,'""');return/(\s|,|")/.test(l)?`"${l}"`:l}).join(",")).join(`
`),t=`${r}
${j}`;c(),z("lpubeltsdata.csv",t),T("Current lock entries downloaded as lpubeltsdata.csv")},[c,d]);return e.jsxs(w.Fragment,{children:[s?e.jsx(S,{title:"Export",arrow:!0,disableFocusListener:!0,children:e.jsx(H,{variant:"outlined",size:"small",onClick:p,style:{color:"#ddd",borderColor:"#aaa"},startIcon:e.jsx(_,{}),children:"Export"})}):e.jsx(S,{title:"Export",arrow:!0,disableFocusListener:!0,children:e.jsx(y,{onClick:p,children:e.jsx(_,{})})}),e.jsxs(le,{anchorEl:a,open:x,onClose:c,children:[!s&&e.jsxs(F,{disabled:!0,children:[e.jsx(B,{children:e.jsx(_,{fontSize:"small"})}),e.jsx(M,{children:"Export"})]}),e.jsxs(F,{onClick:f,children:[e.jsx(B,{children:e.jsx(ve,{fontSize:"small"})}),e.jsx(M,{children:"Copy to clipboard"})]}),e.jsxs(F,{onClick:k,children:[e.jsx(B,{children:e.jsx(ke,{fontSize:"small"})}),e.jsx(M,{children:"CSV"})]}),e.jsxs(F,{onClick:v,children:[e.jsx(B,{children:e.jsx(be,{fontSize:"small"})}),e.jsx(M,{children:"JSON"})]})]})]})}export{Xe as C,Ye as E,Ze as a};
