import{r as e,j as t,J as p,R as m,N as x,O as c,P as f}from"./index-2a0a2ef8.js";import{F as u,D as j,a as S,d as F}from"./BeltStripe-7b721ba9.js";import{S as k,a as E,f as C,F as h}from"./sortFields-aaacbf5b.js";import{u as v}from"./usePageTitle-fc26fa20.js";import{u as D}from"./useWindowSize-4ac2346e.js";import{S as g,a as b,d as B}from"./safelocks-d72ba3df.js";import{I as P}from"./InlineFilterDisplay-c36933b2.js";import{N}from"./NoEntriesCard-d0c7bf59.js";import"./Select-1106db27.js";import"./LoadingDisplay-a6d802a7.js";import"./Search-3a2c25b6.js";import"./Sort-12127ce0.js";import"./TextField-ca7e8711.js";import"./useDocumentTitle-9e428b87.js";import"./index-60f035d4.js";import"./index-694da789.js";import"./ImageViewer-9d5f66e9.js";import"./Link-f06d5eed.js";import"./Dialog-7e98b3eb.js";import"./LinearProgress-91c378c3.js";import"./ContentCopy-956fe15d.js";import"./LockListContext-255921ce.js";function R({profile:a}){const{filters:o}=e.useContext(u),[r,l]=e.useState(o.id),{visibleEntries:i}=e.useContext(j),n=e.useDeferredValue(r),d=e.useCallback(s=>{l(s)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(P,{profile:a,collectionType:"safelocks"}),i.length===0&&t.jsx(N,{label:"Dials"}),i.map(s=>t.jsx(g,{entry:s,onExpand:d,expanded:s.id===n},s.id))]})}function $(){const{isMobile:a}=D(),{lockCollection:o}=e.useContext(p);v("Safe Locks");const r=t.jsxs(m.Fragment,{children:[t.jsx(k,{label:"Safe Locks"}),t.jsx(E,{sortValues:C}),t.jsx(h,{}),!a&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]});return t.jsx(S,{filterFields:F,children:t.jsxs(b,{allEntries:B,profile:o,children:[t.jsx(x,{title:"Safe Locks",extras:r}),t.jsx(R,{profile:o}),t.jsx(c,{}),t.jsx(f,{feature:"dials"})]})})}export{$ as default};
