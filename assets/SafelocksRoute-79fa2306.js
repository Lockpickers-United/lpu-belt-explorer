import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-91bbac60.js";import{F as j,D as F,a as S,d as k}from"./filterFields-ee8ef7d8.js";import{d as E}from"./sortFields-8bfcc66d.js";import{S as h}from"./SearchBox-54d250cf.js";import{u as C}from"./usePageTitle-8aa9a8e4.js";import{S as D,a as g,d as v}from"./safelocks-38f97c76.js";import{I as b}from"./InlineFilterDisplay-5739d655.js";import{N as T,V as w}from"./ViewFilterButtons-fe9d805c.js";import"./index-c905e752.js";import"./Select-135a8838.js";import"./Box-da6d8805.js";import"./Chip-70b516be.js";import"./Search-9ba32307.js";import"./Badge-ea085a82.js";import"./TextField-1f3ab434.js";import"./useDocumentTitle-8f03a84e.js";import"./FieldValue-65eea5b9.js";import"./CopyEntryTextButton-abeaa891.js";import"./Link-1fcc6d44.js";import"./entryName-38dddbe8.js";import"./ContentCopy-aec442cb.js";import"./BeltStripe-ed83602b.js";import"./LoadingDisplay-c2cc224a.js";import"./CircularProgress-ebb46e50.js";import"./FormGroup-4c0a0e3a.js";import"./Checkbox-031cb54a.js";import"./AccordionSummary-3ae9b833.js";import"./index-8eef8828.js";import"./index-206a551f.js";import"./AccordionActions-16a8f4c2.js";import"./ImageViewer-ac74a007.js";import"./Launch-36cdc182.js";import"./Dialog-035f0789.js";import"./LinearProgress-654b1ba3.js";import"./DialogContent-6ade94a3.js";import"./Link-bd0f58a7.js";import"./LockListContext-99d6f64f.js";import"./ToggleButtonGroup-b3b4bb7c.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ft(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ft as default};
