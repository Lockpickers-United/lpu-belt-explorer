import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-bc9e6ed8.js";import{F as j,D as F,a as S,d as k}from"./filterFields-0ecbd1b8.js";import{d as E}from"./sortFields-4ba3a593.js";import{S as h}from"./SearchBox-b6176fda.js";import{u as C}from"./usePageTitle-54613085.js";import{S as D,a as g,d as v}from"./safelocks-a7bb9e2e.js";import{I as b}from"./InlineFilterDisplay-ac5a8fb0.js";import{N as T,V as w}from"./ViewFilterButtons-dc86a66f.js";import"./index-4a85a8fe.js";import"./Select-7cd09a41.js";import"./Box-0a77b99d.js";import"./Chip-e2c30500.js";import"./Search-64edc338.js";import"./Badge-6d25b07b.js";import"./TextField-eae2e599.js";import"./useDocumentTitle-075d96b7.js";import"./FieldValue-12c4cec7.js";import"./CopyEntryTextButton-5e222f85.js";import"./Link-68858e3f.js";import"./entryName-aaa918e4.js";import"./ContentCopy-80127392.js";import"./BeltStripe-a7114fc3.js";import"./LoadingDisplay-0caae165.js";import"./CircularProgress-e702c4be.js";import"./FormGroup-3cf58111.js";import"./Checkbox-91fa3e2c.js";import"./AccordionSummary-168dd9fc.js";import"./index-b281e885.js";import"./index-0b4dade1.js";import"./AccordionActions-6e0fe03b.js";import"./ImageViewer-43693246.js";import"./Launch-32e94f57.js";import"./Dialog-65135ab1.js";import"./LinearProgress-0defd2f2.js";import"./DialogContent-7e51d2a8.js";import"./Link-aced1bf0.js";import"./LockListContext-7a911bbf.js";import"./ToggleButtonGroup-628ab3cb.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ft(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ft as default};
