import{r as o,j as t,u as d,D as x,R as m,N as c,F as f,T as u}from"./index-2ff3fbfc.js";import{F as j,D as F,a as S,d as k}from"./filterFields-d453b221.js";import{d as E}from"./sortFields-4ba3a593.js";import{S as h}from"./SearchBox-c224ba3d.js";import{u as C}from"./usePageTitle-2aa1bad2.js";import{S as D,a as g,d as v}from"./safelocks-a2e57e01.js";import{I as b}from"./InlineFilterDisplay-38a52cbe.js";import{N as T,V as w}from"./ViewFilterButtons-abc8734c.js";import"./index-69cb2f29.js";import"./Select-b0bbb37f.js";import"./Box-66031442.js";import"./Chip-da34140e.js";import"./Search-6d5c3c5a.js";import"./Badge-85ead18f.js";import"./TextField-df57048e.js";import"./useDocumentTitle-c6965a71.js";import"./FieldValue-40f134aa.js";import"./CopyEntryTextButton-e465b1cf.js";import"./Link-2d28905d.js";import"./entryName-914bc03a.js";import"./ContentCopy-35ad764f.js";import"./BeltStripe-7ff0729a.js";import"./LoadingDisplay-3920f6d9.js";import"./CircularProgress-d7d77c81.js";import"./FormGroup-3bd833ac.js";import"./Checkbox-1b5a9cdb.js";import"./AccordionSummary-db4af413.js";import"./Collapse-77ce7522.js";import"./index-1a3f0b0b.js";import"./index-27c9fb96.js";import"./AccordionActions-bf14d5df.js";import"./ImageViewer-66566062.js";import"./Launch-69673ff3.js";import"./Dialog-af368355.js";import"./LinearProgress-f95214af.js";import"./DialogContent-30fb1105.js";import"./Link-d120f710.js";import"./ImageListItem-a7a2ecf6.js";import"./LockListContext-183597a9.js";import"./ToggleButtonGroup-c4941596.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:p}=o.useContext(F),l=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),p.length===0&&t.jsx(T,{label:"Dials"}),p.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===l},e.id))]})}function jt(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(m.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(m.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{jt as default};
