import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-8d5c18fe.js";import{F as j,D as F,a as S,d as k}from"./filterFields-0cead1ab.js";import{d as E}from"./sortFields-4ba3a593.js";import{S as h}from"./SearchBox-763cdbdf.js";import{u as C}from"./usePageTitle-2e9d041b.js";import{S as D,a as g,d as v}from"./safelocks-c43fa095.js";import{I as b}from"./InlineFilterDisplay-ded5b217.js";import{N as T,V as w}from"./ViewFilterButtons-d06e9cde.js";import"./index-113c0443.js";import"./Select-0c0aa6ff.js";import"./Box-1df98baf.js";import"./Chip-ac55054a.js";import"./Search-8bfed859.js";import"./Badge-f50d4011.js";import"./TextField-cf2b658f.js";import"./useDocumentTitle-6bc0ef62.js";import"./FieldValue-38c3e926.js";import"./CopyEntryTextButton-23e7a461.js";import"./Link-98569b4b.js";import"./entryName-456291e6.js";import"./ContentCopy-9c6b8619.js";import"./BeltStripe-9d56aed9.js";import"./LoadingDisplay-4366818f.js";import"./CircularProgress-24a4b28a.js";import"./FormGroup-b8aacab9.js";import"./Checkbox-3c3c46d7.js";import"./AccordionSummary-146f1f09.js";import"./index-1df70dfe.js";import"./index-c26e5a6f.js";import"./AccordionActions-14bd4c16.js";import"./ImageViewer-fbfa5763.js";import"./Launch-449b1f36.js";import"./Dialog-a300c4fc.js";import"./LinearProgress-4e707036.js";import"./DialogContent-1211d0aa.js";import"./Link-cadc87cb.js";import"./LockListContext-1d43a75d.js";import"./ToggleButtonGroup-d0369d96.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ft(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ft as default};
