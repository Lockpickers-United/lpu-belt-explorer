import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-3ba1aae1.js";import{F as j,D as F,a as S,d as k}from"./filterFields-c7a8f465.js";import{d as E}from"./sortFields-4ba3a593.js";import{S as h}from"./SearchBox-bdaac71a.js";import{u as C}from"./usePageTitle-fdaf2e33.js";import{S as D,a as g,d as v}from"./safelocks-ed787f73.js";import{I as b}from"./InlineFilterDisplay-786b0b84.js";import{N as T,V as w}from"./ViewFilterButtons-8c36427e.js";import"./index-005125c0.js";import"./Select-3520959c.js";import"./Box-46375afb.js";import"./Chip-03e93d57.js";import"./Search-06c6f936.js";import"./Badge-5727d72d.js";import"./TextField-8553dce7.js";import"./useDocumentTitle-ff310127.js";import"./FieldValue-e61fdd19.js";import"./CopyEntryTextButton-703c00f6.js";import"./Link-86d3876f.js";import"./entryName-2cd81e25.js";import"./ContentCopy-ab5ea4a2.js";import"./BeltStripe-4ea6396e.js";import"./LoadingDisplay-fdd288f7.js";import"./CircularProgress-3c462807.js";import"./FormGroup-247a1a7b.js";import"./Checkbox-ac649b1e.js";import"./AccordionSummary-25e1072a.js";import"./index-89ae4cfa.js";import"./index-8d342b22.js";import"./AccordionActions-95957a91.js";import"./ImageViewer-fda4b438.js";import"./Launch-545e1961.js";import"./Dialog-c17da1e6.js";import"./LinearProgress-ee68b794.js";import"./DialogContent-66dee570.js";import"./Link-bc9c49aa.js";import"./LockListContext-468d9953.js";import"./ToggleButtonGroup-c3ace87b.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ft(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ft as default};
