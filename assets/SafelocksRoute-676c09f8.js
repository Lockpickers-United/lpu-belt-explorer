import{r as o,j as t,u as d,D as x,R as m,N as c,F as f,T as u}from"./index-a25ed024.js";import{F as j,D as F,a as S,d as k}from"./filterFields-5f195099.js";import{d as E}from"./sortFields-9d3facfd.js";import{S as h}from"./SearchBox-27808f50.js";import{u as C}from"./usePageTitle-39db0fd5.js";import{S as D,a as g,d as v}from"./safelocks-8eee44ba.js";import{I as b}from"./InlineFilterDisplay-074ace4a.js";import{N as T,V as w}from"./ViewFilterButtons-f26e8dc7.js";import"./index-9fb9133e.js";import"./Select-488e6942.js";import"./Box-198cb3e9.js";import"./Chip-5cf20fed.js";import"./Search-d0258c9b.js";import"./Badge-e35d07d0.js";import"./TextField-8c4a23da.js";import"./useDocumentTitle-84bc7b5a.js";import"./ExpandMore-114a2f75.js";import"./CopyEntryTextButton-b613e841.js";import"./Link-2a028e3c.js";import"./entryName-824c199e.js";import"./ContentCopy-86911193.js";import"./FieldValue-a9f0547b.js";import"./ImageGallery-1ebdb874.js";import"./ImageViewer-16c8bfba.js";import"./Launch-41f6fd0a.js";import"./Dialog-db1b4b15.js";import"./LinearProgress-352605a5.js";import"./DialogContent-32fa7547.js";import"./ImageListItem-808cca8d.js";import"./BeltStripe-4fbd8682.js";import"./LoadingDisplay-da6e1c81.js";import"./CircularProgress-7f4d6677.js";import"./FormGroup-d2a98f4d.js";import"./Checkbox-68cc929b.js";import"./AccordionSummary-f4a40e29.js";import"./Collapse-3005dd89.js";import"./index-7cad74be.js";import"./index-3f8660a1.js";import"./AccordionActions-3dc7271e.js";import"./glossary-db95354d.js";import"./Link-ac83e4db.js";import"./LockListContext-c9a343a9.js";import"./ToggleButtonGroup-2d4c17f5.js";function B({profile:e}){const{filters:i}=o.useContext(j),[s,a]=o.useState(i.id),{visibleEntries:p}=o.useContext(F),l=o.useDeferredValue(s),n=o.useCallback(r=>{a(r)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:e,collectionType:"safelocks"}),p.length===0&&t.jsx(T,{label:"Dials"}),p.map(r=>t.jsx(D,{entry:r,onExpand:n,expanded:r.id===l},r.id))]})}function kt(){const{isMobile:e}=d(),{lockCollection:i}=o.useContext(x);C("Safe Locks");const s=t.jsxs(m.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!e&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(m.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:i,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:i}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{kt as default};
