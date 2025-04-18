import{r as s,j as o,R as u,ap as k,A as y,D as C,u as F,aq as P,N as S,F as D,T as E}from"./index-e6c9e4f3.js";import{d as L}from"./filterFields-25ce22f2.js";import{l as N}from"./sortFields-5471f00e.js";import{F as v,S as w}from"./SortButton-5f306ad9.js";import{D as B,a as R}from"./DataContext-5a91d8ba.js";import{a as T}from"./LockListContext-11a09df2.js";import{S as b}from"./SearchBox-0fe37aab.js";import{L as x}from"./LoadingDisplay-b916e9fe.js";import{u as W}from"./useData-13fc4754.js";import{N as I}from"./NoProfileData-d5181370.js";import{P as A}from"./ProfileNotFound-4c888070.js";import{S as $,d as q,a as M}from"./safelocks-9f1c36d4.js";import{I as V}from"./InlineFilterDisplay-5f11daa1.js";import{P as z}from"./ProfileHeader-2db819f6.js";import{E as G}from"./ScorecardExportButton-1c0de201.js";import"./rankingRequestData-d3ef79e5.js";import"./Badge-20aab7a5.js";import"./Chip-8ad5f6e8.js";import"./Select-3a361d26.js";import"./Box-513d0acd.js";import"./Sort-7461b884.js";import"./entryName-a043c199.js";import"./index-26ff9eef.js";import"./Search-3e9b445c.js";import"./TextField-20020eb9.js";import"./LPU-c3fa7122.js";import"./LinearProgress-0b1b5076.js";import"./mycollection-0ec86312.js";import"./ExpandMore-18485c27.js";import"./CopyLinkToEntryButton-3a21494a.js";import"./Link-fb06696d.js";import"./FieldValue-036f046e.js";import"./ImageGallery-c0e37f71.js";import"./ImageViewer-42a2faf0.js";import"./Launch-3ce4a2c9.js";import"./Dialog-1d1e8d29.js";import"./DialogContent-393e692f.js";import"./ImageListItem-cf7ba340.js";import"./BeltStripe-fb47a2df.js";import"./CopyEntryTextButton-813bb654.js";import"./ContentCopy-bc11bf96.js";import"./LoadingDisplay-c4f825d7.js";import"./CircularProgress-b6524013.js";import"./FormGroup-511a2b4f.js";import"./Checkbox-69c572e5.js";import"./AccordionSummary-01a674c4.js";import"./Collapse-6e335815.js";import"./index-d39e570e.js";import"./index-a8d000bb.js";import"./AccordionActions-ed43ef78.js";import"./glossary-db95354d.js";import"./Link-f0b7bed9.js";import"./CopyProfileLinkButton-8d5a0cd0.js";import"./ToggleButtonGroup-dfee8832.js";import"./download-b38ad927.js";import"./List-4f50cb2d.js";function H({profile:a}){const[e,l]=s.useState(!1),{visibleEntries:n=[]}=s.useContext(B),p=s.useDeferredValue(e);return o.jsx(u.Fragment,{children:o.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:0},children:[o.jsx(V,{profile:a,collectionType:"safelocks"}),n==null?void 0:n.map(m=>o.jsx($,{entry:m,expanded:m.id===p,onExpand:l},m.id))]})})}function Ko(){const{userId:a}=k(),{user:e}=s.useContext(y),{getProfile:l,lockCollection:n}=s.useContext(C),{isMobile:p}=F(),m=s.useCallback(async()=>{try{const r=(e==null?void 0:e.uid)!==a?await l(a):n;if(r){const f=r.displayName?r.displayName.toLowerCase().endsWith("s")?`${r.displayName}'`:`${r.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${f} Safe Locks`}return r}catch(r){return console.error("Error loading profile.",r),null}},[l,n,e,a]),{data:t={},loading:i,error:d}=W({loadFn:m}),c=s.useMemo(()=>{if(i||!t)return[];const r=new Set(P.safelocks.getCollected(t));return q.filter(f=>r.has(f.id))},[t,i]),j=o.jsxs(u.Fragment,{children:[o.jsx(b,{label:"Collection"}),o.jsx(v,{}),o.jsx(w,{sortValues:N}),!p&&o.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),g=i?"Loading...":"Profile",h=o.jsx("div",{style:{margin:"30px 0px"},children:o.jsx(G,{text:!0})});return i||!t?o.jsx(x,{}):o.jsx(R,{filterFields:L,children:o.jsx(M,{allEntries:c,profile:t,children:o.jsx(T,{children:o.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#000",marginLeft:"auto",marginRight:"auto",marginTop:0},children:[o.jsx(S,{title:g,extras:j}),o.jsx(z,{profile:t,page:"safelocks",owner:e&&e.uid===a}),i&&o.jsx(x,{}),!i&&t&&!d&&c.length>0&&o.jsx(H,{profile:t}),!i&&t&&!d&&c.length===0&&o.jsx(I,{collectionType:"safelocks"}),!i&&(!t||d)&&o.jsx(A,{}),o.jsx(D,{before:h}),o.jsx(E,{feature:"profile"})]})})})})}export{Ko as default};
