import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-598d2322.js";import{F as j,D as F,a as S,d as k}from"./filterFields-46144dfd.js";import{d as E}from"./sortFields-8bfcc66d.js";import{S as h}from"./SearchBox-42eab6b3.js";import{u as C}from"./usePageTitle-1f6d27a7.js";import{S as D,a as g,d as v}from"./safelocks-540d0d74.js";import{I as b}from"./InlineFilterDisplay-ee4f89e1.js";import{N as T,V as w}from"./ViewFilterButtons-aa43d0d2.js";import"./index-fa44a312.js";import"./Select-7713661d.js";import"./Box-07b2f124.js";import"./Chip-23297254.js";import"./Search-f84c789b.js";import"./Badge-1615b9af.js";import"./TextField-6ca348a3.js";import"./useDocumentTitle-8baac105.js";import"./FieldValue-202badfa.js";import"./CopyEntryTextButton-8c45798f.js";import"./Link-8765e2ec.js";import"./entryName-614fec4b.js";import"./ContentCopy-353307e6.js";import"./BeltStripe-524e9476.js";import"./LoadingDisplay-808cd4b4.js";import"./CircularProgress-85d7fbf4.js";import"./FormGroup-0fc1c989.js";import"./Checkbox-8c1f9f1b.js";import"./AccordionSummary-aa06330b.js";import"./index-ba06f16e.js";import"./index-6be24088.js";import"./AccordionActions-dcaed172.js";import"./ImageViewer-07ef9eb9.js";import"./Launch-a3527871.js";import"./Dialog-4a1fc38e.js";import"./LinearProgress-e6743701.js";import"./DialogContent-24dfe0f4.js";import"./Link-a6d2c921.js";import"./LockListContext-e071d727.js";import"./ToggleButtonGroup-78dfeb60.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ft(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ft as default};
