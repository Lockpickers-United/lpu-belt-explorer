import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-4ae4bfb0.js";import{F as j,D as F,a as S,d as k}from"./filterFields-165c2368.js";import{d as E}from"./sortFields-cf9f802c.js";import{S as h}from"./SearchBox-ded7a1c2.js";import{u as C}from"./usePageTitle-4d01f4f9.js";import{S as D,a as g,d as v}from"./safelocks-52022824.js";import{I as b}from"./InlineFilterDisplay-de62bcd5.js";import{N as T,V as w}from"./ViewFilterButtons-f6840afd.js";import"./index-e8cb67d3.js";import"./Select-f6d61f71.js";import"./Box-58d3dbb1.js";import"./Chip-87b15f72.js";import"./Search-5dd8e196.js";import"./Badge-ec075aa9.js";import"./TextField-0f11ab2d.js";import"./useDocumentTitle-969ebc01.js";import"./FieldValue-138ac50d.js";import"./CopyEntryTextButton-64c0a4bc.js";import"./Link-d5457ad6.js";import"./entryName-2445267a.js";import"./ContentCopy-1c2cb8fe.js";import"./BeltStripe-51427405.js";import"./LoadingDisplay-8ae45fa5.js";import"./CircularProgress-f598c7cb.js";import"./FormGroup-fc90e11c.js";import"./Checkbox-36de7944.js";import"./AccordionSummary-c0b10de7.js";import"./index-df1799d4.js";import"./index-7d552d45.js";import"./AccordionActions-32acfe3f.js";import"./ImageViewer-407e4594.js";import"./Launch-9b6f736f.js";import"./Dialog-dfa9a08a.js";import"./LinearProgress-51ee7cf2.js";import"./DialogContent-54689c29.js";import"./Link-e1a46b2e.js";import"./LockListContext-a488573f.js";import"./ToggleButtonGroup-b8c6dcd3.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ft(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ft as default};
