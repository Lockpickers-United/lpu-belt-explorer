import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-d999bb61.js";import{F as j,D as F,a as S,d as k}from"./filterFields-979aba70.js";import{d as E}from"./sortFields-4ba3a593.js";import{S as h}from"./SearchBox-77cf1672.js";import{u as C}from"./usePageTitle-8c53e9c7.js";import{S as D,a as g,d as v}from"./safelocks-5fc88d7d.js";import{I as b}from"./InlineFilterDisplay-58a2f232.js";import{N as T,V as w}from"./ViewFilterButtons-5c491541.js";import"./index-c65ce715.js";import"./Select-b2353edc.js";import"./Box-2466cd35.js";import"./Chip-280d89ad.js";import"./Search-330ab8c3.js";import"./Badge-9dbf8218.js";import"./TextField-a1ca592d.js";import"./useDocumentTitle-415e4ca8.js";import"./FieldValue-a4a1ce40.js";import"./CopyEntryTextButton-eb137ac0.js";import"./Link-202a0ccd.js";import"./entryName-35cc608f.js";import"./ContentCopy-b778d1cc.js";import"./BeltStripe-f5bdf073.js";import"./LoadingDisplay-978405e8.js";import"./CircularProgress-791266c9.js";import"./FormGroup-8154b3b1.js";import"./Checkbox-8b9a3a5e.js";import"./AccordionSummary-41e55cec.js";import"./index-a98e60bd.js";import"./index-3bae82f2.js";import"./AccordionActions-4f794049.js";import"./ImageViewer-1093f378.js";import"./Launch-acdd4a9f.js";import"./Dialog-71eafc01.js";import"./LinearProgress-5f833ffa.js";import"./DialogContent-3bfe8bc1.js";import"./Link-869fab6c.js";import"./LockListContext-91d8794c.js";import"./ToggleButtonGroup-a8f17aa4.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ft(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ft as default};
