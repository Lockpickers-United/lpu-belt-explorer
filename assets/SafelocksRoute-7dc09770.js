import{r as o,j as t,D as m,R as d,N as x,F as c,T as f}from"./index-55b1d90f.js";import{F as u,D as j,a as S,d as F}from"./filterFields-535497dc.js";import{S as k,a as E,d as C,F as h}from"./sortFields-2c4495a8.js";import{u as D}from"./usePageTitle-f818f1c1.js";import{u as v}from"./useWindowSize-ddd79567.js";import{S as g,a as b,d as B}from"./safelocks-f86aa6e7.js";import{I as N}from"./InlineFilterDisplay-cd66c0c7.js";import{N as P}from"./NoEntriesCard-4dcf8628.js";import"./Select-0268719f.js";import"./Box-4773417c.js";import"./Chip-bbfa754d.js";import"./Sort-67c589d1.js";import"./Search-9904dc15.js";import"./TextField-e413904e.js";import"./useDocumentTitle-9d5712c3.js";import"./FieldValue-c6e34107.js";import"./BeltStripe-127dae27.js";import"./LoadingDisplay-5c6678e5.js";import"./FormGroup-03ea5c62.js";import"./AccordionSummary-f8cc2316.js";import"./index-d7a3a884.js";import"./index-c92072e4.js";import"./AccordionActions-6d630fcf.js";import"./ImageViewer-429d47b9.js";import"./Link-c2ff03f2.js";import"./Launch-cc299e0d.js";import"./Dialog-d509866a.js";import"./LinearProgress-ae469504.js";import"./entryName-e02cbb5e.js";import"./ContentCopy-9927cadb.js";import"./LockListContext-ad77f53b.js";function R({profile:r}){const{filters:s}=o.useContext(u),[i,l]=o.useState(s.id),{visibleEntries:a}=o.useContext(j),n=o.useDeferredValue(i),p=o.useCallback(e=>{l(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(N,{profile:r,collectionType:"safelocks"}),a.length===0&&t.jsx(P,{label:"Dials"}),a.map(e=>t.jsx(g,{entry:e,onExpand:p,expanded:e.id===n},e.id))]})}function nt(){const{isMobile:r}=v(),{lockCollection:s}=o.useContext(m);D("Safe Locks");const i=t.jsxs(d.Fragment,{children:[t.jsx(k,{label:"Safe Locks"}),t.jsx(E,{sortValues:C}),t.jsx(h,{}),!r&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]});return t.jsx(S,{filterFields:F,children:t.jsxs(b,{allEntries:B,profile:s,children:[t.jsx(x,{title:"Safe Locks",extras:i}),t.jsx(R,{profile:s}),t.jsx(c,{}),t.jsx(f,{feature:"dials"})]})})}export{nt as default};
