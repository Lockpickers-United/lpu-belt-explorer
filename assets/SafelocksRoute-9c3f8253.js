import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-08543946.js";import{F as j,D as F,a as S,d as k}from"./filterFields-55abd3a3.js";import{d as E}from"./sortFields-4ba3a593.js";import{S as h}from"./SearchBox-a09c7d5e.js";import{u as C}from"./usePageTitle-3355da31.js";import{S as D,a as g,d as v}from"./safelocks-e7f5cc02.js";import{I as b}from"./InlineFilterDisplay-e88aecae.js";import{N as T,V as w}from"./ViewFilterButtons-8a3faf87.js";import"./index-60a6f84d.js";import"./Select-c8d0d695.js";import"./Box-a1837bd3.js";import"./Chip-5b671632.js";import"./Search-df61369b.js";import"./Badge-20f55dab.js";import"./TextField-864e534b.js";import"./useDocumentTitle-a33af29d.js";import"./FieldValue-082a6b7d.js";import"./CopyEntryTextButton-678c07b7.js";import"./Link-d504dd23.js";import"./entryName-a7621a81.js";import"./ContentCopy-5d1ed14d.js";import"./BeltStripe-c60bc623.js";import"./LoadingDisplay-1bfb3850.js";import"./CircularProgress-48cdb538.js";import"./FormGroup-af23bb14.js";import"./Checkbox-d47cb5ef.js";import"./AccordionSummary-98eae5ff.js";import"./index-a21ee45e.js";import"./index-421311e0.js";import"./AccordionActions-d9741070.js";import"./ImageViewer-99565dee.js";import"./Launch-153904a4.js";import"./Dialog-ed2a93d3.js";import"./LinearProgress-ad09c865.js";import"./DialogContent-bb929637.js";import"./Link-a091b473.js";import"./LockListContext-7e03e9a1.js";import"./ToggleButtonGroup-afc4f306.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ft(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ft as default};
