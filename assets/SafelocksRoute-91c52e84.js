import{r as e,j as t,J as p,R as m,N as x,O as c,P as f}from"./index-49d84251.js";import{F as u,D as j,a as S,d as F}from"./BeltStripe-db13486d.js";import{S as k,a as E,f as C,F as h}from"./sortFields-91263a0d.js";import{u as v}from"./usePageTitle-4477c68e.js";import{u as D}from"./useWindowSize-89846b73.js";import{S as g,a as b,d as B}from"./safelocks-6cb8865c.js";import{I as P}from"./InlineFilterDisplay-84e471df.js";import{N}from"./NoEntriesCard-740968f5.js";import"./Select-a2a8ae8e.js";import"./LoadingDisplay-9968d2f0.js";import"./Search-141b21d9.js";import"./Sort-9768d15e.js";import"./TextField-dec16207.js";import"./useDocumentTitle-4eb58d91.js";import"./index-35d1e39c.js";import"./index-e7724138.js";import"./ImageViewer-a7189e26.js";import"./Link-86c32e75.js";import"./Dialog-7b72e789.js";import"./LinearProgress-66e7cc20.js";import"./ContentCopy-8dbd391f.js";import"./LockListContext-01e71446.js";function R({profile:a}){const{filters:o}=e.useContext(u),[r,l]=e.useState(o.id),{visibleEntries:i}=e.useContext(j),n=e.useDeferredValue(r),d=e.useCallback(s=>{l(s)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(P,{profile:a,collectionType:"safelocks"}),i.length===0&&t.jsx(N,{label:"Dials"}),i.map(s=>t.jsx(g,{entry:s,onExpand:d,expanded:s.id===n},s.id))]})}function $(){const{isMobile:a}=D(),{lockCollection:o}=e.useContext(p);v("Safe Locks");const r=t.jsxs(m.Fragment,{children:[t.jsx(k,{label:"Safe Locks"}),t.jsx(E,{sortValues:C}),t.jsx(h,{}),!a&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]});return t.jsx(S,{filterFields:F,children:t.jsxs(b,{allEntries:B,profile:o,children:[t.jsx(x,{title:"Safe Locks",extras:r}),t.jsx(R,{profile:o}),t.jsx(c,{}),t.jsx(f,{feature:"dials"})]})})}export{$ as default};
