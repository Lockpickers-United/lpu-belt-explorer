import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-378eac39.js";import{F as j,D as F,a as S,d as k}from"./filterFields-64a5b02b.js";import{d as E}from"./sortFields-90ee3c27.js";import{S as h}from"./SearchBox-d6c40885.js";import{u as C}from"./usePageTitle-31e190be.js";import{S as D,a as g,d as v}from"./safelocks-363e72b7.js";import{I as b}from"./InlineFilterDisplay-789e2ad8.js";import{N as T,V as w}from"./ViewFilterButtons-d9ca01bb.js";import"./index-b6cb232c.js";import"./Select-3d9fa2c6.js";import"./Box-cb92c5c1.js";import"./Chip-803d6e2d.js";import"./Search-b68a6bc8.js";import"./Badge-7c9c8baf.js";import"./TextField-6f0a74e1.js";import"./useDocumentTitle-3fc53fac.js";import"./FieldValue-e0a0951f.js";import"./CopyEntryTextButton-23e65278.js";import"./Link-b723999f.js";import"./entryName-324928ce.js";import"./ContentCopy-ffc4ad15.js";import"./BeltStripe-afa57f97.js";import"./LoadingDisplay-40449e40.js";import"./FormGroup-a99a3a66.js";import"./Checkbox-30f2b0b0.js";import"./AccordionSummary-b0de915f.js";import"./Collapse-8f14d39f.js";import"./index-f189c53f.js";import"./index-5860a3d9.js";import"./AccordionActions-087b2caa.js";import"./ImageViewer-d81afc37.js";import"./Launch-5eb9ec56.js";import"./Dialog-433636c6.js";import"./LinearProgress-aacede7d.js";import"./DialogContent-75dfb75e.js";import"./Link-a911d67c.js";import"./LockListContext-f6ba3bcb.js";import"./ToggleButtonGroup-2871a214.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ft(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ft as default};
