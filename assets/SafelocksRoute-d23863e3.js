import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-d72901c5.js";import{F as j,D as F,a as S,d as k}from"./filterFields-d692a765.js";import{d as E}from"./sortFields-5c5c6976.js";import{S as h}from"./SearchBox-bc53c243.js";import{u as C}from"./usePageTitle-7e51adea.js";import{S as D,a as g,d as v}from"./safelocks-44bda486.js";import{I as b}from"./InlineFilterDisplay-41634cf6.js";import{N as T,V as w}from"./ViewFilterButtons-0ca77aa7.js";import"./index-f5cf9552.js";import"./Select-54701803.js";import"./Box-a1058137.js";import"./Chip-f152661e.js";import"./Search-c997d05e.js";import"./Badge-9b0c1bde.js";import"./TextField-8ab3a185.js";import"./useDocumentTitle-fda0c444.js";import"./FieldValue-33a7b098.js";import"./CopyEntryTextButton-719b8d77.js";import"./Link-65e0047f.js";import"./entryName-ee03161a.js";import"./ContentCopy-2bc65cf7.js";import"./BeltStripe-f2afe3f5.js";import"./LoadingDisplay-f0a0c1d0.js";import"./FormGroup-14f62107.js";import"./Checkbox-5fe2eea8.js";import"./AccordionSummary-6e8022f1.js";import"./index-64df7a81.js";import"./index-d676b1c3.js";import"./AccordionActions-21fd79f0.js";import"./ImageViewer-478b0d1f.js";import"./Launch-a993927d.js";import"./Dialog-25a34709.js";import"./LinearProgress-3e90de7b.js";import"./DialogContent-64a4afeb.js";import"./Link-e6b2e8e2.js";import"./LockListContext-411aa4b2.js";import"./ToggleButtonGroup-e691dc40.js";function B({profile:s}){const{filters:r}=o.useContext(j),[i,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(i),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:s,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ct(){const{isMobile:s}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const i=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!s&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:i,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ct as default};
