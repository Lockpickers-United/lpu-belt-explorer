import{r as s,j as t,J as p,R as d,N as x,O as c,P as f}from"./index-18fbf4ea.js";import{F as u,D as j,a as S,d as F}from"./index-82472fca.js";import{S as k,a as E,d as C,F as h}from"./sortFields-cf7c5994.js";import{u as g}from"./usePageTitle-9de0779f.js";import{u as v}from"./useWindowSize-1d909436.js";import{S as D,a as b,d as B}from"./safelocks-21ada968.js";import{I as P}from"./InlineFilterDisplay-7ce719a0.js";import{N as y}from"./NoEntriesCard-451ceb2e.js";import{S as N}from"./SystemMessage-190550c9.js";import"./Select-93a32a52.js";import"./Box-7a225f38.js";import"./Search-e5ccf89d.js";import"./Sort-89df6692.js";import"./TextField-ea2832b5.js";import"./useDocumentTitle-8425d6f2.js";import"./FieldValue-c2c9bede.js";import"./BeltStripe-8a61286d.js";import"./LoadingDisplay-353d2ae9.js";import"./AccordionSummary-28ef23fa.js";import"./index-faa4722c.js";import"./index-709eac7a.js";import"./AccordionActions-c4266284.js";import"./ImageViewer-b0ca0ee6.js";import"./Link-0226c958.js";import"./Launch-67828fe6.js";import"./Dialog-dc601841.js";import"./LinearProgress-d2955672.js";import"./ContentCopy-cea54885.js";import"./LockListContext-aa805f4c.js";function R({profile:r}){const{filters:o}=s.useContext(u),[i,l]=s.useState(o.id),{visibleEntries:a}=s.useContext(j),n=s.useDeferredValue(i),m=s.useCallback(e=>{l(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(N,{}),t.jsx(P,{profile:r,collectionType:"safelocks"}),a.length===0&&t.jsx(y,{label:"Dials"}),a.map(e=>t.jsx(D,{entry:e,onExpand:m,expanded:e.id===n},e.id))]})}function lt(){const{isMobile:r}=v(),{lockCollection:o}=s.useContext(p);g("Safe Locks");const i=t.jsxs(d.Fragment,{children:[t.jsx(k,{label:"Safe Locks"}),t.jsx(E,{sortValues:C}),t.jsx(h,{}),!r&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]});return t.jsx(S,{filterFields:F,children:t.jsxs(b,{allEntries:B,profile:o,children:[t.jsx(x,{title:"Safe Locks",extras:i}),t.jsx(R,{profile:o}),t.jsx(c,{}),t.jsx(f,{feature:"dials"})]})})}export{lt as default};
