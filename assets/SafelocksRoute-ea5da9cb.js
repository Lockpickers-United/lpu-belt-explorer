import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-e8309ac8.js";import{F as j,D as F,a as S,d as k}from"./filterFields-9ae34c23.js";import{d as E}from"./sortFields-8bfcc66d.js";import{S as h}from"./SearchBox-7991c451.js";import{u as C}from"./usePageTitle-1f701d35.js";import{S as D,a as g,d as v}from"./safelocks-ccef4bff.js";import{I as b}from"./InlineFilterDisplay-52aafcf9.js";import{N as T,V as w}from"./ViewFilterButtons-3ce4d1c7.js";import"./index-164a2b91.js";import"./Select-922ce9f9.js";import"./Box-fc78a35f.js";import"./Chip-32eed8d8.js";import"./Search-1ceb05e9.js";import"./Badge-0f330dbd.js";import"./TextField-222ec796.js";import"./useDocumentTitle-b33e59e6.js";import"./FieldValue-acdf5b6d.js";import"./CopyEntryTextButton-4f249602.js";import"./Link-7a0fff6b.js";import"./entryName-d4e836ea.js";import"./ContentCopy-cbf7d6fe.js";import"./BeltStripe-f90af0ae.js";import"./LoadingDisplay-801c02ab.js";import"./CircularProgress-6fa4b086.js";import"./FormGroup-bd4270a3.js";import"./Checkbox-d48e37ab.js";import"./AccordionSummary-75684668.js";import"./index-0c13ece7.js";import"./index-d5589a68.js";import"./AccordionActions-1d379fe2.js";import"./ImageViewer-c8753e6b.js";import"./Launch-31e4e9d0.js";import"./Dialog-43dc603e.js";import"./LinearProgress-f16a34b8.js";import"./DialogContent-a8f1f811.js";import"./Link-1cadb13a.js";import"./LockListContext-90ad5cb0.js";import"./ToggleButtonGroup-90b6e326.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ft(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ft as default};
