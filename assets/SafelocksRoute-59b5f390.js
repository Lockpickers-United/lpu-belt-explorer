import{r as s,j as t,J as p,R as d,N as x,O as c,P as f}from"./index-6abde975.js";import{F as u,D as j,a as S,d as F}from"./index-274e3669.js";import{S as k,a as E,d as C,F as h}from"./sortFields-29e02786.js";import{u as g}from"./usePageTitle-3c340cd6.js";import{u as v}from"./useWindowSize-0df4846e.js";import{S as D,a as b,d as B}from"./safelocks-f458dac5.js";import{I as P}from"./InlineFilterDisplay-737296ac.js";import{N as y}from"./NoEntriesCard-f52dd88c.js";import{S as N}from"./SystemMessage-e7c35924.js";import"./Select-13c2ca4b.js";import"./Box-cdd6461e.js";import"./Search-c314504c.js";import"./Sort-82a1d824.js";import"./TextField-27045503.js";import"./useDocumentTitle-1e8b77f3.js";import"./FieldValue-2cea0eb6.js";import"./BeltStripe-a96a35c5.js";import"./LoadingDisplay-72f7aea2.js";import"./AccordionSummary-b408e6ca.js";import"./index-33347bbd.js";import"./index-66756d6c.js";import"./AccordionActions-b0cf0829.js";import"./ImageViewer-b6f43a04.js";import"./Link-4477bd40.js";import"./Launch-3a2313ba.js";import"./Dialog-419c1932.js";import"./LinearProgress-38718f9f.js";import"./ContentCopy-a14a8d58.js";import"./LockListContext-1a05e042.js";function R({profile:r}){const{filters:o}=s.useContext(u),[i,l]=s.useState(o.id),{visibleEntries:a}=s.useContext(j),n=s.useDeferredValue(i),m=s.useCallback(e=>{l(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(N,{}),t.jsx(P,{profile:r,collectionType:"safelocks"}),a.length===0&&t.jsx(y,{label:"Dials"}),a.map(e=>t.jsx(D,{entry:e,onExpand:m,expanded:e.id===n},e.id))]})}function lt(){const{isMobile:r}=v(),{lockCollection:o}=s.useContext(p);g("Safe Locks");const i=t.jsxs(d.Fragment,{children:[t.jsx(k,{label:"Safe Locks"}),t.jsx(E,{sortValues:C}),t.jsx(h,{}),!r&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]});return t.jsx(S,{filterFields:F,children:t.jsxs(b,{allEntries:B,profile:o,children:[t.jsx(x,{title:"Safe Locks",extras:i}),t.jsx(R,{profile:o}),t.jsx(c,{}),t.jsx(f,{feature:"dials"})]})})}export{lt as default};
