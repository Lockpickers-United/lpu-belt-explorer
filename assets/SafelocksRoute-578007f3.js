import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-abe5a221.js";import{F as j,D as F,a as S,d as k}from"./filterFields-52549b6b.js";import{d as E}from"./sortFields-8bfcc66d.js";import{S as h}from"./SearchBox-7fc0e96f.js";import{u as C}from"./usePageTitle-ca2d0458.js";import{S as D,a as g,d as v}from"./safelocks-e46f12ff.js";import{I as b}from"./InlineFilterDisplay-1417c636.js";import{N as T,V as w}from"./ViewFilterButtons-e26f6620.js";import"./index-3ded974e.js";import"./Select-d0c86a47.js";import"./Box-f2056de4.js";import"./Chip-68e6f941.js";import"./Search-b600e3a8.js";import"./Badge-624815e4.js";import"./TextField-de0bbe4a.js";import"./useDocumentTitle-12e14ad6.js";import"./FieldValue-1a5cde21.js";import"./CopyEntryTextButton-09f5efc6.js";import"./Link-e236c3f5.js";import"./entryName-7bcd2d8a.js";import"./ContentCopy-47d42f28.js";import"./BeltStripe-ac29ad85.js";import"./LoadingDisplay-2c56c094.js";import"./CircularProgress-89cab2ca.js";import"./FormGroup-923ece15.js";import"./Checkbox-9497a0b7.js";import"./AccordionSummary-fc7f0331.js";import"./index-1540da3b.js";import"./index-ab854524.js";import"./AccordionActions-51d8a8dc.js";import"./ImageViewer-480bbb84.js";import"./Launch-7f19d6ad.js";import"./Dialog-de7c4930.js";import"./LinearProgress-fe2d23af.js";import"./DialogContent-a1bdb509.js";import"./Link-095afd39.js";import"./LockListContext-effffe23.js";import"./ToggleButtonGroup-114ef751.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ft(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ft as default};
