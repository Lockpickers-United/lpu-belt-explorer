import{r as o,j as t,D as m,R as d,N as x,F as c,T as f}from"./index-b56dc73a.js";import{F as u,D as j,a as S,d as F}from"./filterFields-cf526141.js";import{S as k,a as E,d as C,F as h}from"./sortFields-74e5a302.js";import{u as D}from"./usePageTitle-721430f8.js";import{u as v}from"./useWindowSize-cc532ecf.js";import{S as g,a as b,d as B}from"./safelocks-6f338fd2.js";import{I as N}from"./InlineFilterDisplay-27cccc0e.js";import{N as P}from"./NoEntriesCard-410079a0.js";import"./Select-42245dc8.js";import"./Box-0faa1887.js";import"./Chip-e4a6bb6b.js";import"./Sort-a922cedd.js";import"./Search-f9f653be.js";import"./TextField-f02101b4.js";import"./useDocumentTitle-a857dca7.js";import"./FieldValue-b0d5c9fd.js";import"./BeltStripe-601ba816.js";import"./LoadingDisplay-e795f41c.js";import"./FormGroup-9c2fedfa.js";import"./AccordionSummary-de79f73f.js";import"./index-fcb575f5.js";import"./index-992060b0.js";import"./AccordionActions-6f6ebeab.js";import"./ImageViewer-c5a31416.js";import"./Link-255d5368.js";import"./Launch-f2b2a345.js";import"./Dialog-4ce59d0a.js";import"./LinearProgress-bf1b48cf.js";import"./entryName-cc10f0cd.js";import"./ContentCopy-f5df7ba6.js";import"./LockListContext-d349592b.js";function R({profile:r}){const{filters:s}=o.useContext(u),[i,l]=o.useState(s.id),{visibleEntries:a}=o.useContext(j),n=o.useDeferredValue(i),p=o.useCallback(e=>{l(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(N,{profile:r,collectionType:"safelocks"}),a.length===0&&t.jsx(P,{label:"Dials"}),a.map(e=>t.jsx(g,{entry:e,onExpand:p,expanded:e.id===n},e.id))]})}function nt(){const{isMobile:r}=v(),{lockCollection:s}=o.useContext(m);D("Safe Locks");const i=t.jsxs(d.Fragment,{children:[t.jsx(k,{label:"Safe Locks"}),t.jsx(E,{sortValues:C}),t.jsx(h,{}),!r&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]});return t.jsx(S,{filterFields:F,children:t.jsxs(b,{allEntries:B,profile:s,children:[t.jsx(x,{title:"Safe Locks",extras:i}),t.jsx(R,{profile:s}),t.jsx(c,{}),t.jsx(f,{feature:"dials"})]})})}export{nt as default};
