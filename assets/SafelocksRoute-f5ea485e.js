import{r as o,j as t,u as d,D as x,R as p,N as c,F as f,T as u}from"./index-e6927b3c.js";import{F as j,D as F,a as S,d as k}from"./filterFields-eed5364c.js";import{d as E}from"./sortFields-fadf2c6a.js";import{S as h}from"./SearchBox-9fabb292.js";import{u as C}from"./usePageTitle-a6059b95.js";import{S as D,a as g,d as v}from"./safelocks-e8f2cb64.js";import{I as b}from"./InlineFilterDisplay-82b4f95c.js";import{N as T,V as w}from"./ViewFilterButtons-4ea179f6.js";import"./index-853498a1.js";import"./Select-b22500c4.js";import"./Box-4bf86d3c.js";import"./Chip-f2755588.js";import"./Search-275714c4.js";import"./Badge-1fbeb0af.js";import"./TextField-6e76c525.js";import"./useDocumentTitle-5c9b9fc7.js";import"./FieldValue-83469913.js";import"./CopyEntryTextButton-46b065bf.js";import"./Link-55afb133.js";import"./entryName-1bc7941d.js";import"./ContentCopy-9d8d0b00.js";import"./BeltStripe-88288378.js";import"./LoadingDisplay-a903ff80.js";import"./FormGroup-9a5b3ef6.js";import"./Checkbox-24d676d9.js";import"./AccordionSummary-ee4f7aeb.js";import"./index-df1e9c0f.js";import"./index-135a1e06.js";import"./AccordionActions-af8d8d1a.js";import"./ImageViewer-83b5484a.js";import"./Launch-8c7f9c38.js";import"./Dialog-367924b3.js";import"./LinearProgress-78fc6635.js";import"./DialogContent-4ae91a03.js";import"./Link-1c4d9163.js";import"./LockListContext-6b15fcc4.js";import"./ToggleButtonGroup-6b4de5fd.js";function B({profile:s}){const{filters:r}=o.useContext(j),[i,a]=o.useState(r.id),{visibleEntries:l}=o.useContext(F),m=o.useDeferredValue(i),n=o.useCallback(e=>{a(e)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(b,{profile:s,collectionType:"safelocks"}),l.length===0&&t.jsx(T,{label:"Dials"}),l.map(e=>t.jsx(D,{entry:e,onExpand:n,expanded:e.id===m},e.id))]})}function ct(){const{isMobile:s}=d(),{lockCollection:r}=o.useContext(x);C("Safe Locks");const i=t.jsxs(p.Fragment,{children:[t.jsx(h,{label:"Safe Locks"}),!s&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),a=t.jsx(p.Fragment,{children:t.jsx(w,{sortValues:E,compactMode:!1})});return t.jsx(S,{filterFields:k,children:t.jsxs(g,{allEntries:v,profile:r,children:[t.jsx(c,{title:"Safe Locks",extras:i,extrasTwo:a}),t.jsx(B,{profile:r}),t.jsx(f,{}),t.jsx(u,{feature:"dials"})]})})}export{ct as default};
