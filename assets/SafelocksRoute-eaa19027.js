import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-2a0a4b7e.js";import{F as j,D as F,a as S,d as k}from"./filterFields-2e4e62e8.js";import{d as E}from"./sortFields-8bfcc66d.js";import{S as h}from"./SearchBox-d3270808.js";import{u as C}from"./usePageTitle-b9b26eef.js";import{S as D,a as g,d as v}from"./safelocks-68c6b3a3.js";import{I as b}from"./InlineFilterDisplay-4675adc1.js";import{N as T,V as w}from"./ViewFilterButtons-56dd3912.js";import"./index-1f3d433d.js";import"./Select-088dbbbd.js";import"./Box-2225a9e1.js";import"./Chip-b51ea90b.js";import"./Search-7f6c86d9.js";import"./Badge-ffe144ef.js";import"./TextField-69fe7c1a.js";import"./useDocumentTitle-98df96bd.js";import"./FieldValue-8c15a7c9.js";import"./CopyEntryTextButton-bae34bca.js";import"./Link-7a2758f2.js";import"./entryName-2e5cb34e.js";import"./ContentCopy-2a6641cb.js";import"./BeltStripe-04d52a4d.js";import"./LoadingDisplay-30ede9e9.js";import"./CircularProgress-06420334.js";import"./FormGroup-695fb07f.js";import"./Checkbox-4043e320.js";import"./AccordionSummary-3ca04757.js";import"./index-18c5390e.js";import"./index-1e88da51.js";import"./AccordionActions-ebf68ca9.js";import"./ImageViewer-031bfc4a.js";import"./Launch-31b3c0ec.js";import"./Dialog-1ce9f1b9.js";import"./LinearProgress-60cb92dd.js";import"./DialogContent-c4535399.js";import"./Link-f7cb3b6f.js";import"./LockListContext-0169a6f3.js";import"./ToggleButtonGroup-299bf7b0.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ft(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ft as default};
