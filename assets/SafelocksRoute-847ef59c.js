import{r as o,j as t,u as d,D as x,R as m,N as c,F as f,T as u}from"./index-2f74fa4d.js";import{F as j,D as F,a as S,d as k}from"./filterFields-a74b63a5.js";import{d as E}from"./sortFields-4ba3a593.js";import{S as h}from"./SearchBox-feacefcb.js";import{u as C}from"./usePageTitle-7a856f36.js";import{S as D,a as g,d as v}from"./safelocks-b64d425a.js";import{I as b}from"./InlineFilterDisplay-801953a4.js";import{N as T,V as w}from"./ViewFilterButtons-f186c67e.js";import"./index-acbcfb9a.js";import"./Select-25a368f7.js";import"./Box-f8da229c.js";import"./Chip-41ba8fb4.js";import"./Search-5ce2cd11.js";import"./Badge-8b1ac65f.js";import"./TextField-f6d4d801.js";import"./useDocumentTitle-98b65976.js";import"./FieldValue-ae89a8e1.js";import"./CopyEntryTextButton-5bb1fc81.js";import"./Link-b21a70dc.js";import"./entryName-ab684837.js";import"./ContentCopy-aadf9f64.js";import"./BeltStripe-6c19a110.js";import"./LoadingDisplay-d5436444.js";import"./CircularProgress-3ea27ad4.js";import"./FormGroup-d51a56fd.js";import"./Checkbox-829f6a33.js";import"./AccordionSummary-5f1a38b2.js";import"./Collapse-3ce4b8cc.js";import"./index-c47f89fa.js";import"./index-9d25983b.js";import"./AccordionActions-92733193.js";import"./ImageViewer-407d0311.js";import"./Launch-ea69d231.js";import"./Dialog-528a707b.js";import"./LinearProgress-246cbd2b.js";import"./DialogContent-6ec2bbb4.js";import"./Link-5c02975d.js";import"./ImageListItem-68aa3396.js";import"./LockListContext-5c25a7eb.js";import"./ToggleButtonGroup-4eb58060.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:p}=o.useContext(F),l=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),p.length===0&&t.jsx(T,{label:"Dials"}),p.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===l},e.id))]})}function jt(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(m.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(m.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{jt as default};
