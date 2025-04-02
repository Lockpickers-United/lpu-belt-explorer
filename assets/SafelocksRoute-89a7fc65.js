import{r as o,j as t,u as d,D as x,R as m,N as c,F as f,T as u}from"./index-36e795f6.js";import{F as j,D as F,a as S,d as k}from"./filterFields-6c912d83.js";import{d as E}from"./sortFields-9d3facfd.js";import{S as h}from"./SearchBox-78a36d61.js";import{u as C}from"./usePageTitle-0f39581f.js";import{S as D,a as g,d as v}from"./safelocks-f28df318.js";import{I as b}from"./InlineFilterDisplay-dc3ab5ef.js";import{N as T,V as w}from"./ViewFilterButtons-80923626.js";import"./index-9744f76d.js";import"./Select-c3d4f868.js";import"./Box-1a7870ad.js";import"./Chip-8032c0ed.js";import"./Search-ed96a402.js";import"./Badge-5cdaa4cd.js";import"./TextField-eb83db72.js";import"./useDocumentTitle-c54c190d.js";import"./ExpandMore-dc71fab6.js";import"./CopyEntryTextButton-bca143cb.js";import"./Link-e8279e97.js";import"./entryName-0929b96f.js";import"./ContentCopy-ede020e2.js";import"./FieldValue-b8b413f5.js";import"./ImageGallery-6a958f19.js";import"./ImageViewer-9b837dfc.js";import"./Launch-a3c1f54b.js";import"./Dialog-5ff98fc0.js";import"./LinearProgress-31e1f0d1.js";import"./DialogContent-b1627cca.js";import"./ImageListItem-aa7ee401.js";import"./BeltStripe-a3423a06.js";import"./LoadingDisplay-d0116a8b.js";import"./CircularProgress-8fd280d0.js";import"./FormGroup-805278db.js";import"./Checkbox-c838b342.js";import"./AccordionSummary-77e86297.js";import"./Collapse-30dda51f.js";import"./index-44b29c40.js";import"./index-fefc348e.js";import"./AccordionActions-fd897c05.js";import"./glossary-db95354d.js";import"./Link-f4920218.js";import"./LockListContext-adf632f4.js";import"./ToggleButtonGroup-5937b7ac.js";function B({profile:e}){const{filters:i}=o.useContext(j),[s,a]=o.useState(i.id),{visibleEntries:p}=o.useContext(F),l=o.useDeferredValue(s),n=o.useCallback(r=>{a(r)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:e,collectionType:"safelocks"}),p.length===0&&t.jsx(T,{label:"Dials"}),p.map(r=>t.jsx(D,{entry:r,onExpand:n,expanded:r.id===l},r.id))]})}function kt(){const{isMobile:e}=d(),{lockCollection:i}=o.useContext(x);C("Safe Locks");const s=t.jsxs(m.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!e&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(m.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:i,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:i}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{kt as default};
