import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-e541c88c.js";import{F as j,D as F,a as S,d as k}from"./filterFields-7fde3c46.js";import{d as E}from"./sortFields-cf9bc377.js";import{S as h}from"./SearchBox-b84f7719.js";import{u as C}from"./usePageTitle-ef7cb36c.js";import{S as D,a as g,d as v}from"./safelocks-8ab2cb7a.js";import{I as b}from"./InlineFilterDisplay-e70c5bbd.js";import{N as T,V as w}from"./ViewFilterButtons-2a4e79ee.js";import"./index-8d83a14a.js";import"./Select-7c59d7ea.js";import"./Box-295c2c99.js";import"./Chip-200d8f94.js";import"./Search-d5c7ada3.js";import"./Badge-90c7b39c.js";import"./TextField-a03de4ca.js";import"./useDocumentTitle-f33d62ee.js";import"./FieldValue-a1e18d45.js";import"./CopyEntryTextButton-5b227464.js";import"./Link-673281e2.js";import"./entryName-61eff0b8.js";import"./ContentCopy-e521c2cc.js";import"./BeltStripe-c73d3850.js";import"./LoadingDisplay-1da146e5.js";import"./FormGroup-aac4f6f4.js";import"./Checkbox-437c4be9.js";import"./AccordionSummary-269f90c1.js";import"./index-4f68142d.js";import"./index-cc4ab5a2.js";import"./AccordionActions-2b97b2eb.js";import"./ImageViewer-1940a1d0.js";import"./Launch-d9bc4273.js";import"./Dialog-9937aac2.js";import"./LinearProgress-2656ffc6.js";import"./DialogContent-c8b1b6d3.js";import"./Link-67a1c87b.js";import"./LockListContext-3ebc84f0.js";import"./ToggleButtonGroup-ea36c0d1.js";function B({profile:s}){const{filters:r}=o.useContext(j),[i,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(i),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:s,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ct(){const{isMobile:s}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const i=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!s&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:i,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ct as default};
