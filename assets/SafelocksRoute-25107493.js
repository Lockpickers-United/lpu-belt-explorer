import{r as o,j as t,u as d,D as x,R as m,N as c,F as f,T as u}from"./index-7c1e177e.js";import{F as j,D as F,a as S,d as k}from"./filterFields-adfc3130.js";import{d as E}from"./sortFields-9d3facfd.js";import{S as h}from"./SearchBox-1350dd8b.js";import{u as C}from"./usePageTitle-21ba0f8e.js";import{S as D,a as g,d as v}from"./safelocks-814c8c6f.js";import{I as b}from"./InlineFilterDisplay-1382e448.js";import{N as T,V as w}from"./ViewFilterButtons-2c1a669f.js";import"./index-c12adcd1.js";import"./Select-4a02f3e2.js";import"./Box-0c2fb810.js";import"./Chip-492b9fc2.js";import"./Search-f916bfb0.js";import"./Badge-0c1f1ecd.js";import"./TextField-86bac584.js";import"./useDocumentTitle-d5ead7bc.js";import"./ExpandMore-d997dc8e.js";import"./CopyEntryTextButton-a13d4c1f.js";import"./Link-7a705f67.js";import"./entryName-4b7e587d.js";import"./ContentCopy-393063f9.js";import"./FieldValue-8b3c3f10.js";import"./ImageGallery-8627d844.js";import"./ImageViewer-3ecef78c.js";import"./Launch-038a55a7.js";import"./Dialog-63446f9e.js";import"./LinearProgress-5e221104.js";import"./DialogContent-bc8f7028.js";import"./ImageListItem-86527ae0.js";import"./BeltStripe-e9349038.js";import"./LoadingDisplay-2a7c2b12.js";import"./CircularProgress-0e69e532.js";import"./FormGroup-6a9ea73a.js";import"./Checkbox-cbc9d9f0.js";import"./AccordionSummary-cbee3eaa.js";import"./Collapse-abfe266d.js";import"./index-ef4cdc6e.js";import"./index-4bc329fa.js";import"./AccordionActions-268b134b.js";import"./glossary-db95354d.js";import"./Link-21d8dbbf.js";import"./LockListContext-5a9791b8.js";import"./ToggleButtonGroup-6c1034e1.js";function B({profile:e}){const{filters:i}=o.useContext(j),[s,a]=o.useState(i.id),{visibleEntries:p}=o.useContext(F),l=o.useDeferredValue(s),n=o.useCallback(r=>{a(r)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:e,collectionType:"safelocks"}),p.length===0&&t.jsx(T,{label:"Dials"}),p.map(r=>t.jsx(D,{entry:r,onExpand:n,expanded:r.id===l},r.id))]})}function kt(){const{isMobile:e}=d(),{lockCollection:i}=o.useContext(x);C("Safe Locks");const s=t.jsxs(m.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!e&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(m.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:i,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:i}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{kt as default};
