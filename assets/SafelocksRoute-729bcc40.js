import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-4247c5fe.js";import{F as j,D as F,a as S,d as k}from"./filterFields-20f1c795.js";import{d as E}from"./sortFields-8bfcc66d.js";import{S as h}from"./SearchBox-1f979e80.js";import{u as C}from"./usePageTitle-c7619d0d.js";import{S as D,a as g,d as v}from"./safelocks-9a6d4c71.js";import{I as b}from"./InlineFilterDisplay-2dfadb26.js";import{N as T,V as w}from"./ViewFilterButtons-cedf2b9b.js";import"./index-7398065e.js";import"./Select-3e2d7ed7.js";import"./Box-34d072f1.js";import"./Chip-5d4b0982.js";import"./Search-d7b0e291.js";import"./Badge-e5a5dd25.js";import"./TextField-daf588d4.js";import"./useDocumentTitle-4119a5b8.js";import"./FieldValue-0e86f451.js";import"./CopyEntryTextButton-fe6556b4.js";import"./Link-0d30660f.js";import"./entryName-61e6cb40.js";import"./ContentCopy-bd3b364a.js";import"./BeltStripe-f74021d0.js";import"./LoadingDisplay-7898b787.js";import"./CircularProgress-b4a7c7a6.js";import"./FormGroup-13d2ae4d.js";import"./Checkbox-a411410c.js";import"./AccordionSummary-6808a34d.js";import"./index-f9a640b7.js";import"./index-1e10bc3b.js";import"./AccordionActions-1515984a.js";import"./ImageViewer-70df6716.js";import"./Launch-1f79f92b.js";import"./Dialog-e36cbe21.js";import"./LinearProgress-7390ec8f.js";import"./DialogContent-b132e0c7.js";import"./Link-c1fcc832.js";import"./LockListContext-dcd06720.js";import"./ToggleButtonGroup-ef4a869b.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ft(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ft as default};
