import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-9479cbb1.js";import{F as j,D as F,a as S,d as k}from"./filterFields-5de86a57.js";import{d as E}from"./sortFields-8bfcc66d.js";import{S as h}from"./SearchBox-bfae3b3d.js";import{u as C}from"./usePageTitle-f82c5439.js";import{S as D,a as g,d as v}from"./safelocks-23e5dc95.js";import{I as b}from"./InlineFilterDisplay-eebe3600.js";import{N as T,V as w}from"./ViewFilterButtons-285fefeb.js";import"./index-23693570.js";import"./Select-6ce6536b.js";import"./Box-8d9d2d3c.js";import"./Chip-0d38e776.js";import"./Search-971a3ef6.js";import"./Badge-eddc5742.js";import"./TextField-265308ca.js";import"./useDocumentTitle-d3502a27.js";import"./FieldValue-4f09c805.js";import"./CopyEntryTextButton-0bd00aa2.js";import"./Link-aca0c764.js";import"./entryName-0679d69e.js";import"./ContentCopy-18fabaf9.js";import"./BeltStripe-25baab0d.js";import"./LoadingDisplay-996bde4a.js";import"./CircularProgress-259cb966.js";import"./FormGroup-869965fc.js";import"./Checkbox-6a440f6e.js";import"./AccordionSummary-bdd23c51.js";import"./index-0a7fdaf7.js";import"./index-0834421f.js";import"./AccordionActions-828af88b.js";import"./ImageViewer-682b2cf1.js";import"./Launch-fd132ce3.js";import"./Dialog-0eae1a06.js";import"./LinearProgress-8e6a5ecc.js";import"./DialogContent-aeeeac97.js";import"./Link-8969d5c6.js";import"./LockListContext-311ff22c.js";import"./ToggleButtonGroup-d96131cb.js";function B({profile:i}){const{filters:r}=o.useContext(j),[s,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(s),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:i,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ft(){const{isMobile:i}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const s=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:s,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ft as default};
