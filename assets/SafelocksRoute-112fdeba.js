import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-e55a35db.js";import{F as j,D as F,a as S,d as k}from"./filterFields-00c2c2e4.js";import{d as E}from"./sortFields-169921b9.js";import{S as h}from"./SearchBox-e18e9b18.js";import{u as C}from"./usePageTitle-caf6b46e.js";import{S as D,a as g,d as v}from"./safelocks-5c4df379.js";import{I as b}from"./InlineFilterDisplay-95e86bab.js";import{N as T,V as w}from"./ViewFilterButtons-28a9169d.js";import"./Select-ea86930d.js";import"./Box-ea53b0bc.js";import"./Chip-4f51e6f3.js";import"./Search-8ef19cdd.js";import"./Badge-14e6e254.js";import"./TextField-0ac3a789.js";import"./useDocumentTitle-932ea92a.js";import"./FieldValue-32d56cb8.js";import"./CopyEntryTextButton-dbdf7715.js";import"./Link-1326bd4c.js";import"./entryName-aa037302.js";import"./ContentCopy-5097af62.js";import"./BeltStripe-dee532c1.js";import"./LoadingDisplay-f38ca345.js";import"./FormGroup-8861b357.js";import"./Checkbox-7c1b276a.js";import"./AccordionSummary-59a29420.js";import"./Collapse-f0ef2a10.js";import"./index-80803360.js";import"./index-cb47bbb3.js";import"./AccordionActions-8166eccc.js";import"./ImageViewer-5f6f66b3.js";import"./Launch-86135784.js";import"./Dialog-965e6c53.js";import"./LinearProgress-1f760817.js";import"./DialogContent-4bdf5cb4.js";import"./Link-c6426c1f.js";import"./LockListContext-8a319ed0.js";import"./ToggleButtonGroup-fb06dcbb.js";function B({profile:s}){const{filters:r}=o.useContext(j),[i,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(i),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:s,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ct(){const{isMobile:s}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const i=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!s&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:i,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ct as default};
