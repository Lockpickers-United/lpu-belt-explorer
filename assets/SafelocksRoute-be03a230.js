import{r as o,j as t,u as d,D as x,R as m,N as c,F as f,T as u}from"./index-a0298778.js";import{F as j,D as F,a as S,d as k}from"./filterFields-9431e87b.js";import{d as E}from"./sortFields-4ba3a593.js";import{S as h}from"./SearchBox-0baf6669.js";import{u as C}from"./usePageTitle-63b1505e.js";import{S as D,a as g,d as v}from"./safelocks-b6735de1.js";import{I as b}from"./InlineFilterDisplay-0ccf3caf.js";import{N as T,V as w}from"./ViewFilterButtons-42fc1097.js";import"./index-2abf5b90.js";import"./Select-a1b6de48.js";import"./Box-53dbb7b1.js";import"./Chip-3cb0e602.js";import"./Search-1d5371a8.js";import"./Badge-db81a1ae.js";import"./TextField-9116720d.js";import"./useDocumentTitle-1515ba14.js";import"./FieldValue-e5d2b1ff.js";import"./CopyEntryTextButton-3a09d1ad.js";import"./Link-4a538605.js";import"./entryName-fe75f72b.js";import"./ContentCopy-885ad0b1.js";import"./BeltStripe-22925056.js";import"./LoadingDisplay-d2acaf4e.js";import"./CircularProgress-8cf17fa7.js";import"./FormGroup-15b94b0d.js";import"./Checkbox-ff0e4b32.js";import"./AccordionSummary-2153a803.js";import"./Collapse-f43b88d6.js";import"./index-3b8c7005.js";import"./index-602dcac7.js";import"./AccordionActions-6f66d6eb.js";import"./ImageViewer-48b331af.js";import"./Launch-a54e82c3.js";import"./Dialog-b963752e.js";import"./LinearProgress-cb583795.js";import"./DialogContent-0be9fc78.js";import"./Link-a0852a49.js";import"./ImageListItem-d537f5cb.js";import"./LockListContext-bf1cf748.js";import"./ToggleButtonGroup-34de4644.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:p}=o.useContext(F),l=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),p.length===0&&t.jsx(T,{label:"Dials"}),p.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===l},e.id))]})}function jt(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(m.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(m.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{jt as default};
