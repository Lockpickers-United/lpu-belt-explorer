import{r as e,j as t,u as d,D as x,R as n,N as c,F as f,T as u}from"./index-f61ce2d4.js";import{F as j,D as F,a as S,d as k}from"./filterFields-85abd313.js";import{S as E,d as h}from"./SearchBox-20477219.js";import{u as C}from"./usePageTitle-e554cecc.js";import{S as D,a as g,d as v}from"./safelocks-d3f66b6f.js";import{I as b}from"./InlineFilterDisplay-682621a1.js";import{N as T,V as w}from"./ViewFilterButtons-69503e3b.js";import"./Select-7ef96313.js";import"./Box-5d84a5f1.js";import"./Chip-f9b027aa.js";import"./Search-8c2e1be5.js";import"./Badge-9dd81b8c.js";import"./TextField-ff85c18d.js";import"./useDocumentTitle-407f5360.js";import"./FieldValue-3ea4748d.js";import"./BeltStripe-2f52e1d8.js";import"./LoadingDisplay-fa190154.js";import"./FormGroup-3c286692.js";import"./AccordionSummary-9a2db7ff.js";import"./index-99a4b877.js";import"./index-7ef9de62.js";import"./AccordionActions-12c3ddf7.js";import"./ImageViewer-c51bb4ba.js";import"./Link-605cc1db.js";import"./Launch-8edf5b1b.js";import"./Dialog-de26e25f.js";import"./LinearProgress-fbc38d70.js";import"./entryName-271e68f1.js";import"./ContentCopy-ae759475.js";import"./LockListContext-a047db8c.js";import"./ToggleButtonGroup-5b379823.js";function B({profile:i}){const{filters:s}=e.useContext(j),[r,a]=e.useState(s.id),{visibleEntries:l}=e.useContext(F),p=e.useDeferredValue(r),m=e.useCallback(o=>{a(o)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(o=>t.jsx(D,{entry:o,onExpand:m,expanded:o.id===p},o.id))]})}function lt(){const{isMobile:i}=d(),{lockCollection:s}=e.useContext(x);C("Safe Locks");const r=t.jsxs(n.Fragment,{children:[t.jsx(E,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(n.Fragment,{children:t.jsx(w,{sortValues:h})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:s,children:[t.jsx(c,{title:"Safe Locks",extras:r,extrasTwo:a}),t.jsx(B,{profile:s}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{lt as default};