import{r as o,j as t,u as d,D as x,R as m,N as c,F as f,T as u}from"./index-82f69014.js";import{F as j,D as F,a as S,d as k}from"./filterFields-dbf6d059.js";import{d as E}from"./sortFields-9d3facfd.js";import{S as h}from"./SearchBox-ba3ffaba.js";import{u as C}from"./usePageTitle-3baf7885.js";import{S as D,a as g,d as v}from"./safelocks-d82f1dff.js";import{I as b}from"./InlineFilterDisplay-a470cf7d.js";import{N as T,V as w}from"./ViewFilterButtons-47f45ef4.js";import"./index-497c0c84.js";import"./Select-c6dc5000.js";import"./Box-7642ae15.js";import"./Chip-b2ec5584.js";import"./Search-cb0e5776.js";import"./Badge-0c1beb54.js";import"./TextField-a8cf8338.js";import"./useDocumentTitle-845f33d1.js";import"./ExpandMore-2bbb73f7.js";import"./CopyEntryTextButton-2758d1aa.js";import"./Link-789d33ce.js";import"./entryName-6e95117b.js";import"./ContentCopy-65ba1432.js";import"./FieldValue-895b6aa9.js";import"./ImageGallery-a9637366.js";import"./ImageViewer-23964493.js";import"./Launch-dd698b4f.js";import"./Dialog-ae69c3fb.js";import"./LinearProgress-94f4976c.js";import"./DialogContent-ed47a3fb.js";import"./ImageListItem-8e823818.js";import"./BeltStripe-ab9c0d7e.js";import"./LoadingDisplay-86223ce0.js";import"./CircularProgress-b03c54a0.js";import"./FormGroup-ef4fd41a.js";import"./Checkbox-2355a499.js";import"./AccordionSummary-ffe7eff7.js";import"./Collapse-3edf5e99.js";import"./index-f572a9d3.js";import"./index-10607d08.js";import"./AccordionActions-8300532b.js";import"./glossary-db95354d.js";import"./Link-c1646c4e.js";import"./LockListContext-efa7eb53.js";import"./ToggleButtonGroup-1215543b.js";function B({profile:e}){const{filters:i}=o.useContext(j),[s,a]=o.useState(i.id),{visibleEntries:p}=o.useContext(F),l=o.useDeferredValue(s),n=o.useCallback(r=>{a(r)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:e,collectionType:"safelocks"}),p.length===0&&t.jsx(T,{label:"Dials"}),p.map(r=>t.jsx(D,{entry:r,onExpand:n,expanded:r.id===l},r.id))]})}function kt(){const{isMobile:e}=d(),{lockCollection:i}=o.useContext(x);C("Safe Locks");const s=t.jsxs(m.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!e&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(m.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:i,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:i}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{kt as default};
