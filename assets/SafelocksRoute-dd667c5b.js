import{r as o,j as t,K as m,R as d,O as x,H as c,P as f}from"./index-a5bdb401.js";import{F as u,D as j,a as S,d as F}from"./index-13a985cf.js";import{S as k,a as E,d as C,F as h}from"./sortFields-884eff56.js";import{u as v}from"./usePageTitle-7e50f4bd.js";import{u as D}from"./useWindowSize-61310f85.js";import{S as g,a as b,d as B}from"./safelocks-789c8ee2.js";import{I as P}from"./InlineFilterDisplay-a3845fe0.js";import{N as R}from"./NoEntriesCard-96133038.js";import"./Select-af701fb8.js";import"./Box-9c98191b.js";import"./Search-4ab245fb.js";import"./Sort-beb20cbe.js";import"./TextField-2b0ff12b.js";import"./useDocumentTitle-b858cdcc.js";import"./FieldValue-c7667552.js";import"./BeltStripe-aa4e8dcb.js";import"./LoadingDisplay-6e3630bb.js";import"./AccordionSummary-25229751.js";import"./index-8ccf5457.js";import"./index-299635af.js";import"./AccordionActions-7a18e258.js";import"./ImageViewer-bc25c2e8.js";import"./Link-8373b856.js";import"./Launch-73d51be9.js";import"./Dialog-f018e927.js";import"./LinearProgress-c9eb3ef4.js";import"./entryName-d41e4847.js";import"./ContentCopy-d5ffd007.js";import"./LockListContext-56b68cf8.js";function y({profile:r}){const{filters:s}=o.useContext(u),[i,l]=o.useState(s.id),{visibleEntries:a}=o.useContext(j),n=o.useDeferredValue(i),p=o.useCallback(e=>{l(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(P,{profile:r,collectionType:"safelocks"}),a.length===0&&t.jsx(R,{label:"Dials"}),a.map(e=>t.jsx(g,{entry:e,onExpand:p,expanded:e.id===n},e.id))]})}function at(){const{isMobile:r}=D(),{lockCollection:s}=o.useContext(m);v("Safe Locks");const i=t.jsxs(d.Fragment,{children:[t.jsx(k,{label:"Safe Locks"}),t.jsx(E,{sortValues:C}),t.jsx(h,{}),!r&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]});return t.jsx(S,{filterFields:F,children:t.jsxs(b,{allEntries:B,profile:s,children:[t.jsx(x,{title:"Safe Locks",extras:i}),t.jsx(y,{profile:s}),t.jsx(c,{}),t.jsx(f,{feature:"dials"})]})})}export{at as default};
