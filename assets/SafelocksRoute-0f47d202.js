import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-f4300893.js";import{F as j,D as F,a as S,d as k}from"./filterFields-336f0cfb.js";import{d as E}from"./sortFields-8bfcc66d.js";import{S as h}from"./SearchBox-f43c7c12.js";import{u as C}from"./usePageTitle-606f5940.js";import{S as D,a as g,d as v}from"./safelocks-3fc81e18.js";import{I as b}from"./InlineFilterDisplay-2fc245df.js";import{N as T,V as w}from"./ViewFilterButtons-aa5dba94.js";import"./index-8b242a3e.js";import"./Select-6e91fb08.js";import"./Box-448a47f7.js";import"./Chip-126e6bec.js";import"./Search-1029c0b2.js";import"./Badge-4cedc3cf.js";import"./TextField-7f95e975.js";import"./useDocumentTitle-6d5d8ba0.js";import"./FieldValue-2ed2f437.js";import"./CopyEntryTextButton-3ce3be6b.js";import"./Link-a013b04d.js";import"./entryName-8afa7f15.js";import"./ContentCopy-64442a5d.js";import"./BeltStripe-c7f43d37.js";import"./LoadingDisplay-d81f1659.js";import"./CircularProgress-455f653a.js";import"./FormGroup-4c46dacd.js";import"./Checkbox-717d1fdd.js";import"./AccordionSummary-51cd764e.js";import"./index-93c52027.js";import"./index-3b59d654.js";import"./AccordionActions-58666559.js";import"./ImageViewer-30cdb12a.js";import"./Launch-f3895fdd.js";import"./Dialog-99b01736.js";import"./LinearProgress-2e9fec55.js";import"./DialogContent-b299e51a.js";import"./Link-964409de.js";import"./LockListContext-4f99b209.js";import"./ToggleButtonGroup-2e98da72.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ft(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ft as default};
