import{r as t,j as e,K as d,R as p,O as m,P as x,Q as c}from"./index-72e7306a.js";import{D as f,a as u,d as j}from"./BeltStripe-c56a1208.js";import{S,a as k,e as E,F}from"./sortFields-6d142324.js";import{u as h}from"./usePageTitle-1b065431.js";import{u as v}from"./useWindowSize-3c55f33a.js";import{S as C,a as D,d as g}from"./safelocks-cb5b4e13.js";import{I as b}from"./InlineFilterDisplay-9f2af403.js";import{N as B}from"./NoEntriesCard-9a91b33e.js";import"./Select-f33b80de.js";import"./LoadingDisplay-816c59f2.js";import"./Search-b43a91a1.js";import"./Sort-6c74f1d4.js";import"./TextField-03cab06c.js";import"./useDocumentTitle-fa366117.js";import"./index-38c3ddad.js";import"./index-d2f6c20a.js";import"./ImageViewer-997cae69.js";import"./Link-e90d6f11.js";import"./Dialog-4f6f452c.js";import"./LinearProgress-1de67eae.js";import"./ContentCopy-7cafc4ba.js";import"./LockListContext-01a3df18.js";function P({profile:a}){const[o,r]=t.useState(!1),{visibleEntries:i}=t.useContext(f),l=t.useDeferredValue(o),n=t.useCallback(s=>{r(s)},[]);return e.jsxs("div",{style:{margin:8,paddingBottom:32},children:[e.jsx(b,{profile:a,collectionType:"safelocks"}),i.length===0&&e.jsx(B,{label:"Dials"}),i.map(s=>e.jsx(C,{entry:s,onExpand:n,expanded:s.id===l},s.id))]})}function Z(){const{isMobile:a}=v(),{lockCollection:o}=t.useContext(d);h("Safe Locks");const r=e.jsxs(p.Fragment,{children:[e.jsx(S,{label:"Safe Locks"}),e.jsx(k,{sortValues:E}),e.jsx(F,{}),!a&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]});return e.jsx(u,{filterFields:j,children:e.jsxs(D,{allEntries:g,profile:o,children:[e.jsx(m,{title:"Safe Locks",extras:r}),e.jsx(P,{profile:o}),e.jsx(x,{}),e.jsx(c,{feature:"dials"})]})})}export{Z as default};