import{r as e,j as t,u as d,D as x,R as n,N as c,F as f,T as u}from"./index-a14b0937.js";import{F as j,D as F,a as S,d as k}from"./filterFields-d044ca1e.js";import{S as E,d as h}from"./SearchBox-273d1c29.js";import{u as C}from"./usePageTitle-7ea5d479.js";import{S as D,a as g,d as v}from"./safelocks-e79506f8.js";import{I as b}from"./InlineFilterDisplay-01d7709e.js";import{N as T,V as w}from"./ViewFilterButtons-65d21b0c.js";import"./Select-2cbde9cc.js";import"./Box-5a2e166f.js";import"./Chip-50115d67.js";import"./Search-c3ee6cdf.js";import"./Badge-ba55f875.js";import"./TextField-3462f1d9.js";import"./useDocumentTitle-66e4a122.js";import"./FieldValue-cc234fef.js";import"./BeltStripe-0d7c7793.js";import"./LoadingDisplay-1e77bcb2.js";import"./FormGroup-016082cd.js";import"./AccordionSummary-62410a8c.js";import"./index-a08442f7.js";import"./index-9664953e.js";import"./AccordionActions-cad5daad.js";import"./ImageViewer-da3803ed.js";import"./Link-dbe435c4.js";import"./Launch-9831309d.js";import"./Dialog-b0686b23.js";import"./LinearProgress-b698b6bf.js";import"./entryName-ca45fb51.js";import"./ContentCopy-97f4353f.js";import"./LockListContext-61ca14a2.js";import"./ToggleButtonGroup-05ffa4a4.js";function B({profile:i}){const{filters:s}=e.useContext(j),[r,a]=e.useState(s.id),{visibleEntries:l}=e.useContext(F),p=e.useDeferredValue(r),m=e.useCallback(o=>{a(o)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(o=>t.jsx(D,{entry:o,onExpand:m,expanded:o.id===p},o.id))]})}function lt(){const{isMobile:i}=d(),{lockCollection:s}=e.useContext(x);C("Safe Locks");const r=t.jsxs(n.Fragment,{children:[t.jsx(E,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(n.Fragment,{children:t.jsx(w,{sortValues:h})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:s,children:[t.jsx(c,{title:"Safe Locks",extras:r,extrasTwo:a}),t.jsx(B,{profile:s}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{lt as default};
