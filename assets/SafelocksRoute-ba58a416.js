import{r as e,j as t,J as p,R as m,N as x,O as c,P as f}from"./index-cf37f2be.js";import{F as u,D as j,a as S,d as F}from"./BeltStripe-46edcc02.js";import{S as k,a as E,f as C,F as h}from"./sortFields-19d5c59e.js";import{u as v}from"./usePageTitle-7bc96558.js";import{u as D}from"./useWindowSize-aa807212.js";import{S as g,a as b,d as B}from"./safelocks-42abad8c.js";import{I as P}from"./InlineFilterDisplay-077d370e.js";import{N}from"./NoEntriesCard-275fe508.js";import"./Select-524a8a3d.js";import"./LoadingDisplay-48049aeb.js";import"./Search-3317f0a1.js";import"./Sort-d8d835a2.js";import"./TextField-abaaae79.js";import"./useDocumentTitle-ecd28bed.js";import"./index-10ebc354.js";import"./index-6801a224.js";import"./ImageViewer-0f840735.js";import"./Link-41eddf90.js";import"./Dialog-e8591859.js";import"./LinearProgress-7c3cf6d7.js";import"./ContentCopy-31de7bf9.js";import"./LockListContext-a663ca57.js";function R({profile:a}){const{filters:o}=e.useContext(u),[r,l]=e.useState(o.id),{visibleEntries:i}=e.useContext(j),n=e.useDeferredValue(r),d=e.useCallback(s=>{l(s)},[]);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(P,{profile:a,collectionType:"safelocks"}),i.length===0&&t.jsx(N,{label:"Dials"}),i.map(s=>t.jsx(g,{entry:s,onExpand:d,expanded:s.id===n},s.id))]})}function $(){const{isMobile:a}=D(),{lockCollection:o}=e.useContext(p);v("Safe Locks");const r=t.jsxs(m.Fragment,{children:[t.jsx(k,{label:"Safe Locks"}),t.jsx(E,{sortValues:C}),t.jsx(h,{}),!a&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]});return t.jsx(S,{filterFields:F,children:t.jsxs(b,{allEntries:B,profile:o,children:[t.jsx(x,{title:"Safe Locks",extras:r}),t.jsx(R,{profile:o}),t.jsx(c,{}),t.jsx(f,{feature:"dials"})]})})}export{$ as default};
