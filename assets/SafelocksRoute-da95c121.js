import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-32d4c99f.js";import{F as j,D as F,a as S,d as k}from"./filterFields-4f11352b.js";import{d as E}from"./sortFields-8bfcc66d.js";import{S as h}from"./SearchBox-254a201d.js";import{u as C}from"./usePageTitle-8d8d3910.js";import{S as D,a as g,d as v}from"./safelocks-422ffd17.js";import{I as b}from"./InlineFilterDisplay-d1fde3fd.js";import{N as T,V as w}from"./ViewFilterButtons-5f6ee01e.js";import"./index-6474dce1.js";import"./Select-018f8bd6.js";import"./Box-eefa0c70.js";import"./Chip-4e489496.js";import"./Search-74ce18f0.js";import"./Badge-bc1a2c25.js";import"./TextField-5afc7aff.js";import"./useDocumentTitle-2b68771e.js";import"./FieldValue-4772c4e4.js";import"./CopyEntryTextButton-00b43218.js";import"./Link-d0f7fbc3.js";import"./entryName-95501329.js";import"./ContentCopy-6105c766.js";import"./BeltStripe-e90de756.js";import"./LoadingDisplay-0e74a519.js";import"./CircularProgress-b50170d6.js";import"./FormGroup-f04439c0.js";import"./Checkbox-36ce1e3d.js";import"./AccordionSummary-abba8348.js";import"./index-749c99be.js";import"./index-af27b1f2.js";import"./AccordionActions-383a5667.js";import"./ImageViewer-ad70bf94.js";import"./Launch-48bb2192.js";import"./Dialog-ac2dc0a7.js";import"./LinearProgress-a0287b87.js";import"./DialogContent-27b2212d.js";import"./Link-ff1555b0.js";import"./LockListContext-e712e49f.js";import"./ToggleButtonGroup-52c70f6b.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ft(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ft as default};
