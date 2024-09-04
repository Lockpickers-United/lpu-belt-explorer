import{j as e,V as q,F as O,z as U,y as N,a9 as G,P as z,ah as H,a5 as J,r as l,a6 as V,p as K,T as _,I as C,A as R,C as E,v as Q,R as j,af as X,ai as Y,aj as Z,ak as y,S as u,w as g,t as ee}from"./index-07cc147a.js";import{B as W,e as se,F as ae,D as te}from"./BeltStripe-f3441602.js";import{C as D}from"./CollectionButton-095fe441.js";import{L as ie}from"./ListItem-4e8d211d.js";import{d as ne,F as c}from"./FieldValue-81f6842a.js";import{a as le,F as T,C as re,b as oe}from"./InlineFilterDisplay-d3e2b3bb.js";import{A as ce,a as de,b as xe}from"./AccordionSummary-e16f5c07.js";import{M as ue}from"./index-84edf84f.js";import{r as me}from"./index-3ea9f138.js";import{A as pe}from"./AccordionActions-09ed896e.js";import{L as he}from"./LockListContext-cf201211.js";function We({entries:s}){return e.jsxs(q,{style:{maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0},children:[e.jsx(O,{dense:!0,style:{padding:0},children:s.map(a=>e.jsxs(ie,{style:{minHeight:64,borderTop:"1px solid rgba(255, 255, 255, 0.12)"},children:[e.jsx(W,{value:a.belt}),e.jsx(U,{primary:se(a),primaryTypographyProps:{fontWeight:500},secondary:a.version,style:{padding:"0px 0px 0px 10px"}}),e.jsx(N,{style:{minWidth:20,marginLeft:16},children:e.jsx(D,{id:a.id,dense:!0})})]},a.id))}),e.jsx(G,{}),e.jsx(z,{feature:"compact"})]})}function fe({belt:s}){const{danPoints:a}=H[s],t=a===1?"Point":a>=10?"Pts":"Points",n=` (${a} Dan ${t})`,o={textDecoration:"none",color:"#fff"};return a===0||s==="Unranked"?null:e.jsx("a",{style:o,href:"/#/dans",children:n})}function $({value:s,style:a}){const{color:t,lineColor:n="#010101"}=H[s];return s==="Unranked"?null:e.jsx("div",{style:{display:"inline-block",minWidth:32,height:32,...a},children:e.jsxs("svg",{x:"0",y:"0",viewBox:"0 -2 32 32",children:[e.jsx("path",{d:"M10.91 25.6c-.23 0-.46-.06-.65-.18l-4.47-2.73c-.6-.37-.79-1.15-.43-1.74l7.02-11.51c.23-.37.64-.6 1.08-.6.23 0 .46.06.65.18l4.48 2.73c.29.18.49.45.57.78s.03.67-.15.95l-7.02 11.51c-.23.38-.64.61-1.08.61z",fill:t}),e.jsx("path",{d:"M13.46 9.4c.12 0 .25.03.36.1l4.47 2.73c.33.2.43.63.23.96L11.5 24.7a.704.704 0 0 1-.96.23L6.07 22.2a.698.698 0 0 1-.23-.96l7.02-11.51a.73.73 0 0 1 .6-.33m0-1.13c-.63 0-1.23.33-1.56.87L4.88 20.65c-.25.42-.33.91-.22 1.38.11.47.41.88.82 1.13l4.47 2.73c.29.17.61.27.95.27.63 0 1.23-.33 1.56-.87l7.02-11.51c.25-.42.33-.91.22-1.38-.11-.47-.41-.88-.82-1.13l-4.47-2.73a1.75 1.75 0 0 0-.95-.27z",fill:n}),e.jsx("path",{d:"M17.57 22.37c-.48 0-.91-.26-1.12-.69L10.33 9.66c-.15-.3-.18-.64-.07-.96.1-.32.33-.58.63-.73l4.86-2.47a1.257 1.257 0 0 1 1.7.55l6.12 12.02c.31.62.07 1.38-.55 1.7l-4.86 2.47c-.19.08-.39.13-.59.13z",fill:t}),e.jsx("path",{d:"M16.31 5.92c.25 0 .5.14.62.38l6.12 12.02c.17.34.04.76-.3.94l-4.86 2.47c-.1.05-.21.08-.31.08-.25 0-.5-.14-.62-.38L10.84 9.41a.707.707 0 0 1 .3-.94L16 6c.1-.05.21-.08.31-.08m0-1.13c-.29 0-.57.07-.83.2l-4.86 2.47c-.43.22-.76.6-.91 1.06-.14.47-.1.96.12 1.4l6.12 12.02c.31.62.94 1 1.63 1 .29 0 .57-.07.83-.2l4.86-2.47a1.815 1.815 0 0 0 .8-2.45L17.94 5.79c-.31-.62-.94-1-1.63-1z",fill:n}),e.jsx("path",{d:"M2.57 13.38c-.7 0-1.26-.57-1.26-1.26V6.64c0-.69.57-1.26 1.26-1.26h26.92c.7 0 1.26.57 1.26 1.26v5.48c0 .69-.57 1.26-1.26 1.26H2.57z",fill:t}),e.jsx("path",{d:"M29.49 5.95c.38 0 .7.31.7.7v5.47c0 .38-.31.7-.7.7H2.57c-.38 0-.7-.31-.7-.7V6.64c0-.38.31-.7.7-.7h26.92m0-1.12H2.57c-1.01 0-1.83.82-1.83 1.83v5.47c0 1.01.82 1.83 1.83 1.83h26.92c1.01 0 1.83-.82 1.83-1.83V6.64c-.01-1-.83-1.82-1.83-1.82z",fill:n}),e.jsx("path",{d:"M10.35 14.36c-.69 0-1.26-.57-1.26-1.26V5.43c0-.7.57-1.26 1.26-1.26H21.6c.7 0 1.26.57 1.26 1.26v7.67c0 .7-.57 1.26-1.26 1.26H10.35z",fill:t}),e.jsx("path",{d:"M21.59 4.73c.38 0 .7.31.7.7v7.67c0 .38-.31.7-.7.7H10.35c-.38 0-.7-.31-.7-.7V5.43c0-.38.31-.7.7-.7h11.24m0-1.13H10.35c-1.01 0-1.83.82-1.83 1.83v7.67c0 1.01.82 1.83 1.83 1.83H21.6c1.01 0 1.83-.82 1.83-1.83V5.43a1.846 1.846 0 0 0-1.84-1.83z",fill:n})]})})}function ge({entry:s}){const a=J(),{filters:t,addFilter:n,removeFilters:o}=l.useContext(ae),x=l.useCallback(h=>{n("image",h+1,!0)},[n]),v=l.useCallback(()=>{o(["image"])},[o]),m=l.useCallback(()=>{const{image:h}=V.parse(a.search);return F(h,s)},[s,a]),p=l.useMemo(()=>t.image?+t.image-1:-1,[t]),k=F(p,s);return e.jsx(le,{media:s.media,openIndex:p,initiallyOpen:k,onOpenImage:x,onCloseImage:v,onBackButton:m,shareParams:{id:s.id,name:t.name}})}const F=(s,a)=>/\d+/.test(s)&&!!a.media[s];function je({id:s,onExpand:a}){const{getEntryFromId:t}=l.useContext(te),n=l.useMemo(()=>t(s),[t,s]),o=K(),x=l.useCallback(async()=>{o(`/locks?id=${s}`),a(s)},[s,o,a]);return e.jsx(_,{title:n.version,arrow:!0,disableFocusListener:!0,children:e.jsx(C,{onClick:x,children:e.jsx($,{value:n.belt})})})}var b={},ve=E;Object.defineProperty(b,"__esModule",{value:!0});var A=b.default=void 0,ke=ve(R()),Ce=e;A=b.default=(0,ke.default)((0,Ce.jsx)("path",{d:"M17.81 4.47c-.08 0-.16-.02-.23-.06C15.66 3.42 14 3 12.01 3c-1.98 0-3.86.47-5.57 1.41-.24.13-.54.04-.68-.2-.13-.24-.04-.55.2-.68C7.82 2.52 9.86 2 12.01 2c2.13 0 3.99.47 6.03 1.52.25.13.34.43.21.67-.09.18-.26.28-.44.28M3.5 9.72c-.1 0-.2-.03-.29-.09-.23-.16-.28-.47-.12-.7.99-1.4 2.25-2.5 3.75-3.27C9.98 4.04 14 4.03 17.15 5.65c1.5.77 2.76 1.86 3.75 3.25.16.22.11.54-.12.7-.23.16-.54.11-.7-.12-.9-1.26-2.04-2.25-3.39-2.94-2.87-1.47-6.54-1.47-9.4.01-1.36.7-2.5 1.7-3.4 2.96-.08.14-.23.21-.39.21m6.25 12.07c-.13 0-.26-.05-.35-.15-.87-.87-1.34-1.43-2.01-2.64-.69-1.23-1.05-2.73-1.05-4.34 0-2.97 2.54-5.39 5.66-5.39s5.66 2.42 5.66 5.39c0 .28-.22.5-.5.5s-.5-.22-.5-.5c0-2.42-2.09-4.39-4.66-4.39-2.57 0-4.66 1.97-4.66 4.39 0 1.44.32 2.77.93 3.85.64 1.15 1.08 1.64 1.85 2.42.19.2.19.51 0 .71-.11.1-.24.15-.37.15m7.17-1.85c-1.19 0-2.24-.3-3.1-.89-1.49-1.01-2.38-2.65-2.38-4.39 0-.28.22-.5.5-.5s.5.22.5.5c0 1.41.72 2.74 1.94 3.56.71.48 1.54.71 2.54.71.24 0 .64-.03 1.04-.1.27-.05.53.13.58.41.05.27-.13.53-.41.58-.57.11-1.07.12-1.21.12M14.91 22c-.04 0-.09-.01-.13-.02-1.59-.44-2.63-1.03-3.72-2.1-1.4-1.39-2.17-3.24-2.17-5.22 0-1.62 1.38-2.94 3.08-2.94 1.7 0 3.08 1.32 3.08 2.94 0 1.07.93 1.94 2.08 1.94s2.08-.87 2.08-1.94c0-3.77-3.25-6.83-7.25-6.83-2.84 0-5.44 1.58-6.61 4.03-.39.81-.59 1.76-.59 2.8 0 .78.07 2.01.67 3.61.1.26-.03.55-.29.64-.26.1-.55-.04-.64-.29-.49-1.31-.73-2.61-.73-3.96 0-1.2.23-2.29.68-3.24 1.33-2.79 4.28-4.6 7.51-4.6 4.55 0 8.25 3.51 8.25 7.83 0 1.62-1.38 2.94-3.08 2.94s-3.08-1.32-3.08-2.94c0-1.07-.93-1.94-2.08-1.94s-2.08.87-2.08 1.94c0 1.71.66 3.31 1.87 4.51.95.94 1.86 1.46 3.27 1.85.27.07.42.35.35.61-.05.23-.26.38-.47.38"}),"Fingerprint");function be({entry:s}){const a=l.useCallback(async()=>{await navigator.clipboard.writeText(s.id),Q("ID copied to clipboard.")},[s.id]);return e.jsx(C,{onClick:a,style:{marginRight:210},children:e.jsx(A,{color:"primary"})})}function Le({entry:s,expanded:a,onExpand:t}){var w,M,I,B,S;const{userId:n}=X(),[o,x]=l.useState(!1),v={maxWidth:700,marginLeft:"auto",marginRight:"auto"},m=l.useRef(null),p=[...new Set([...s.relatedIds||[],...Y(s.id)])].filter(i=>i!==s.id).sort((i,r)=>Z(y[i].belt,y[r].belt)),k=l.useCallback((i,r)=>{t&&t(r?s.id:!1)},[s.id,t]);l.useEffect(()=>{if(a&&m&&!o){const r=window.innerWidth<=600?70:74,{id:d}=V.parse(location.search),f=d===s.id;x(!0),setTimeout(()=>{window.scrollTo({left:0,top:m.current.offsetTop-r,behavior:f?"auto":"smooth"})},f?0:100)}else a||x(!1)},[a,s,o]);const h=l.useMemo(()=>{var i;return e.jsx(u,{direction:"column",spacing:0,sx:{flexWrap:"wrap"},children:(i=s.makeModels)==null?void 0:i.map(({make:r,model:d},f)=>e.jsx(g,{style:{fontWeight:500,fontSize:"1.07rem",lineHeight:1.25,marginBottom:"4px"},children:r&&r!==d?`${r} ${d}`:d},f))})},[s.makeModels]);return e.jsxs(ce,{expanded:a,onChange:k,style:v,ref:m,children:[e.jsxs(de,{expandIcon:e.jsx(ne,{}),children:[e.jsx(W,{value:s.belt}),e.jsxs("div",{style:{margin:"12px 0px 8px 8px",width:"55%",flexShrink:0,flexDirection:"column"},children:[e.jsx(c,{value:h,textStyle:s.belt==="Unranked"?{color:"#aaa",marginLeft:"0px"}:{marginLeft:"0px"},style:{marginBottom:"2px"}}),!!s.version&&e.jsx(c,{name:"Version",value:e.jsx(g,{style:{fontSize:"0.95rem",lineHeight:1.25},children:s.version}),textStyle:s.belt==="Unranked"?{color:"#aaa"}:{}})]}),e.jsx("div",{style:{margin:"8px 0px 0px 0px",width:"40%",flexShrink:0,flexDirection:"column"},children:((w=s.lockingMechanisms)==null?void 0:w.length)>0&&e.jsx(c,{value:e.jsx(u,{direction:"row",spacing:0,sx:{flexWrap:"wrap"},children:(M=s.lockingMechanisms)==null?void 0:M.map((i,r)=>e.jsx(T,{value:i,field:"lockingMechanisms"},r))})})})]}),a&&e.jsxs(j.Fragment,{children:[e.jsxs(xe,{sx:{padding:"8px 16px 0px 16px"},children:[e.jsxs(u,{direction:"row",spacing:1,sx:{width:"100%",flexWrap:"wrap"},children:[e.jsx(c,{style:{width:"50%",marginLeft:"0px"},value:e.jsxs(j.Fragment,{children:[e.jsxs(g,{style:{marginLeft:"0px",fontSize:"1rem",lineHeight:1.25,fontWeight:500},children:[s.belt,e.jsx(fe,{belt:s.belt})]}),e.jsx($,{value:s.belt,style:{marginBottom:-10}})]})}),e.jsx("div",{style:{marginLeft:"auto"},children:e.jsx(D,{id:s.id,makeModels:s.makeModels})})]}),e.jsx(u,{direction:"row",spacing:1,sx:{width:"100%",flexWrap:"wrap"},children:!!s.notes&&e.jsx(c,{name:"Notes",value:e.jsx(g,{component:"div",style:{marginTop:-16},children:e.jsx(ue,{rehypePlugins:[[me,{target:"_blank"}]],children:s.notes})})})}),!!((I=s.features)!=null&&I.length)&&e.jsx(c,{name:"Features",value:e.jsx(u,{direction:"row",spacing:0,sx:{flexWrap:"wrap"},children:s.features.map((i,r)=>e.jsx(T,{value:i,field:"features"},r))})}),!!p&&!n&&e.jsx(c,{name:"Other Versions",value:e.jsx(j.Fragment,{children:p.map(i=>e.jsx(je,{id:i,onExpand:t},i))})}),!!((B=s.media)!=null&&B.length)&&e.jsx(c,{value:e.jsx(ge,{entry:s})}),!!((S=s.links)!=null&&S.length)&&e.jsx(c,{name:"Links",value:e.jsx(u,{direction:"row",spacing:1,sx:{flexWrap:"wrap"},children:s.links.map(({title:i,url:r},d)=>e.jsx(ee,{href:r,target:"_blank",rel:"noopener noreferrer",color:"secondary",variant:"outlined",sx:{textTransform:"none"},style:{margin:4},children:i},d))})})]}),e.jsxs(pe,{disableSpacing:!0,children:[e.jsx(z,{feature:"lock",id:s.id}),e.jsx(be,{entry:s}),e.jsx(re,{entry:s}),e.jsx(oe,{entry:s})]})]})]})}const De=j.memo(Le,(s,a)=>s.entry.id===a.entry.id&&s.expanded===a.expanded&&s.onExpand===a.onExpand);var L={},we=E;Object.defineProperty(L,"__esModule",{value:!0});var P=L.default=void 0,Me=we(R()),Ie=e;P=L.default=(0,Me.default)((0,Ie.jsx)("path",{d:"M3 14h4v-4H3zm0 5h4v-4H3zM3 9h4V5H3zm5 5h13v-4H8zm0 5h13v-4H8zM8 5v4h13V5z"}),"ViewList");function $e(){const{compact:s,setCompact:a,setExpanded:t}=l.useContext(he),n=l.useCallback(()=>{a(!s),t(null)},[s,a,t]);return e.jsx(_,{title:"Toggle Compact View",arrow:!0,disableFocusListener:!0,children:e.jsx(C,{onClick:n,children:e.jsx(P,{color:s?"secondary":"inherit"})})})}export{$ as B,We as C,De as E,$e as T};
