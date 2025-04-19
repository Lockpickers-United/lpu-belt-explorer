import{r as s,j as o,R as u,ap as k,A as y,D as C,u as F,aq as P,N as S,F as D,T as E}from"./index-9acfd12f.js";import{d as L}from"./filterFields-22805e73.js";import{l as N}from"./sortFields-5471f00e.js";import{F as v,S as w}from"./SortButton-2a50da0b.js";import{D as B,a as R}from"./DataContext-c10540e3.js";import{a as T}from"./LockListContext-0bda292d.js";import{S as b}from"./SearchBox-f09e91b2.js";import{L as x}from"./LoadingDisplay-6d487988.js";import{u as W}from"./useData-26811710.js";import{N as I}from"./NoProfileData-e3c86c65.js";import{P as A}from"./ProfileNotFound-845cf6fa.js";import{S as $,d as q,a as M}from"./safelocks-e9876d1d.js";import{I as V}from"./InlineFilterDisplay-14a257a2.js";import{P as z}from"./ProfileHeader-b6e7caf6.js";import{E as G}from"./ScorecardExportButton-54ab4b60.js";import"./rankingRequestData-d3ef79e5.js";import"./Badge-cf1d5360.js";import"./Chip-f9edb4d3.js";import"./Select-b2dab828.js";import"./Box-9469bbb8.js";import"./Sort-827d726f.js";import"./entryName-692c3216.js";import"./index-84ec01e8.js";import"./Search-40dc23fc.js";import"./TextField-e861e227.js";import"./LPU-c3fa7122.js";import"./LinearProgress-a6029a28.js";import"./mycollection-0ec86312.js";import"./ExpandMore-1b223f88.js";import"./CopyLinkToEntryButton-c8596227.js";import"./Link-46d10994.js";import"./FieldValue-31f75850.js";import"./ImageGallery-f88f1c35.js";import"./ImageViewer-af04c443.js";import"./Launch-c48ed7a3.js";import"./Dialog-251e2e85.js";import"./DialogContent-74505963.js";import"./ImageListItem-1b530264.js";import"./BeltStripe-dea95388.js";import"./CopyEntryTextButton-8a79e3fe.js";import"./ContentCopy-f0545b97.js";import"./LoadingDisplay-dc5bd034.js";import"./CircularProgress-b66f88d1.js";import"./FormGroup-46577050.js";import"./Checkbox-24e201a4.js";import"./AccordionSummary-d5ea065a.js";import"./Collapse-97bd87e9.js";import"./index-a5321e8c.js";import"./index-f1b42adf.js";import"./AccordionActions-e07dbad0.js";import"./glossary-db95354d.js";import"./Link-ce1dadc8.js";import"./CopyProfileLinkButton-cce46271.js";import"./ToggleButtonGroup-4434bb88.js";import"./download-7c431661.js";import"./List-45166d37.js";function H({profile:a}){const[e,l]=s.useState(!1),{visibleEntries:n=[]}=s.useContext(B),p=s.useDeferredValue(e);return o.jsx(u.Fragment,{children:o.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:0},children:[o.jsx(V,{profile:a,collectionType:"safelocks"}),n==null?void 0:n.map(m=>o.jsx($,{entry:m,expanded:m.id===p,onExpand:l},m.id))]})})}function Ko(){const{userId:a}=k(),{user:e}=s.useContext(y),{getProfile:l,lockCollection:n}=s.useContext(C),{isMobile:p}=F(),m=s.useCallback(async()=>{try{const r=(e==null?void 0:e.uid)!==a?await l(a):n;if(r){const f=r.displayName?r.displayName.toLowerCase().endsWith("s")?`${r.displayName}'`:`${r.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${f} Safe Locks`}return r}catch(r){return console.error("Error loading profile.",r),null}},[l,n,e,a]),{data:t={},loading:i,error:d}=W({loadFn:m}),c=s.useMemo(()=>{if(i||!t)return[];const r=new Set(P.safelocks.getCollected(t));return q.filter(f=>r.has(f.id))},[t,i]),j=o.jsxs(u.Fragment,{children:[o.jsx(b,{label:"Collection"}),o.jsx(v,{}),o.jsx(w,{sortValues:N}),!p&&o.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),g=i?"Loading...":"Profile",h=o.jsx("div",{style:{margin:"30px 0px"},children:o.jsx(G,{text:!0})});return i||!t?o.jsx(x,{}):o.jsx(R,{filterFields:L,children:o.jsx(M,{allEntries:c,profile:t,children:o.jsx(T,{children:o.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#000",marginLeft:"auto",marginRight:"auto",marginTop:0},children:[o.jsx(S,{title:g,extras:j}),o.jsx(z,{profile:t,page:"safelocks",owner:e&&e.uid===a}),i&&o.jsx(x,{}),!i&&t&&!d&&c.length>0&&o.jsx(H,{profile:t}),!i&&t&&!d&&c.length===0&&o.jsx(I,{collectionType:"safelocks"}),!i&&(!t||d)&&o.jsx(A,{}),o.jsx(D,{before:h}),o.jsx(E,{feature:"profile"})]})})})})}export{Ko as default};
