import{r as o,j as t,u as d,D as x,R as m,N as c,F as f,T as u}from"./index-740f2836.js";import{F as j,D as F,a as S,d as k}from"./filterFields-52909ad9.js";import{d as E}from"./sortFields-588a06b5.js";import{S as h}from"./SearchBox-cadc5d3b.js";import{u as C}from"./usePageTitle-15cfad42.js";import{S as D,a as g,d as v}from"./safelocks-460480f9.js";import{I as b}from"./InlineFilterDisplay-8d0a2cdf.js";import{N as T,V as w}from"./ViewFilterButtons-fec7564e.js";import"./index-a2e7e296.js";import"./Select-f0dddcc3.js";import"./Box-f723b2d6.js";import"./Chip-e9722575.js";import"./Search-4de544e9.js";import"./Badge-32b1daa1.js";import"./TextField-68bf7314.js";import"./useDocumentTitle-73f80f9b.js";import"./ExpandMore-81304f86.js";import"./CopyEntryTextButton-128caf18.js";import"./Link-3993415d.js";import"./entryName-831704e5.js";import"./ContentCopy-afe413e4.js";import"./FieldValue-7d2e1e3d.js";import"./ImageGallery-bb4987ab.js";import"./ImageViewer-67943031.js";import"./Launch-fa6ddd87.js";import"./Dialog-c2726c17.js";import"./LinearProgress-844d2682.js";import"./DialogContent-fb129fb8.js";import"./ImageListItem-77ce4c8a.js";import"./BeltStripe-a1882a08.js";import"./LoadingDisplay-e3fcb3f6.js";import"./CircularProgress-e4a07932.js";import"./FormGroup-4d7eeac0.js";import"./Checkbox-359ac66f.js";import"./AccordionSummary-8209dde4.js";import"./Collapse-aac09367.js";import"./index-01903455.js";import"./index-020933b5.js";import"./AccordionActions-7797befc.js";import"./glossary-db95354d.js";import"./Link-aec1f44c.js";import"./LockListContext-e6f3a6b1.js";import"./ToggleButtonGroup-294f427f.js";function B({profile:e}){const{filters:i}=o.useContext(j),[s,a]=o.useState(i.id),{visibleEntries:p}=o.useContext(F),l=o.useDeferredValue(s),n=o.useCallback(r=>{a(r)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:e,collectionType:"safelocks"}),p.length===0&&t.jsx(T,{label:"Dials"}),p.map(r=>t.jsx(D,{entry:r,onExpand:n,expanded:r.id===l},r.id))]})}function kt(){const{isMobile:e}=d(),{lockCollection:i}=o.useContext(x);C("Safe Locks");const s=t.jsxs(m.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!e&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(m.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:i,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:i}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{kt as default};
