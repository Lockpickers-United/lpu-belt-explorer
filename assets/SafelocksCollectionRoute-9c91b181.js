import{r as s,j as o,R as u,ap as k,A as y,D as C,u as F,aq as P,N as S,F as D,T as E}from"./index-b0d06e2f.js";import{d as L}from"./filterFields-1a4a809b.js";import{l as N}from"./sortFields-5471f00e.js";import{F as v,S as w}from"./SortButton-5e6793a3.js";import{D as B,a as R}from"./DataContext-fea6fee0.js";import{a as T}from"./LockListContext-78b292a8.js";import{S as b}from"./SearchBox-9cc49b28.js";import{L as x}from"./LoadingDisplay-acf166f2.js";import{u as W}from"./useData-b5d111ea.js";import{N as I}from"./NoProfileData-23ddea1f.js";import{P as A}from"./ProfileNotFound-214bdad5.js";import{S as $,d as q,a as M}from"./safelocks-7b5cfac6.js";import{I as V}from"./InlineFilterDisplay-daee9414.js";import{P as z}from"./ProfileHeader-a2ee0c05.js";import{E as G}from"./ScorecardExportButton-03a86ec6.js";import"./rankingRequestData-d3ef79e5.js";import"./Badge-e335712b.js";import"./Chip-96aca3c9.js";import"./Select-e5b0c040.js";import"./Box-b0cbe9af.js";import"./Sort-ab290d00.js";import"./entryName-fff48022.js";import"./index-f2054a9f.js";import"./Search-0cdf7412.js";import"./TextField-e5c3f1c9.js";import"./LPU-c3fa7122.js";import"./LinearProgress-41949fb6.js";import"./mycollection-0ec86312.js";import"./ExpandMore-d48fcddd.js";import"./CopyLinkToEntryButton-fbb63118.js";import"./Link-9ca9d500.js";import"./FieldValue-5499bed5.js";import"./ImageGallery-8a9d0cb1.js";import"./ImageViewer-8bc4cdc6.js";import"./Launch-6f934a1c.js";import"./Dialog-2784f595.js";import"./DialogContent-431be305.js";import"./ImageListItem-15a65da2.js";import"./BeltStripe-1ad5434b.js";import"./CopyEntryTextButton-bc7d3208.js";import"./ContentCopy-75e20988.js";import"./LoadingDisplay-eb68e5fa.js";import"./CircularProgress-539eaa42.js";import"./FormGroup-40a9afdb.js";import"./Checkbox-d0721790.js";import"./AccordionSummary-a893306d.js";import"./Collapse-817e7762.js";import"./index-6cfe8014.js";import"./index-93e137ed.js";import"./AccordionActions-3db2e143.js";import"./glossary-db95354d.js";import"./Link-420e3228.js";import"./CopyProfileLinkButton-6c6d00b9.js";import"./ToggleButtonGroup-4ccf0f47.js";import"./download-f7d093cf.js";import"./List-a0800a43.js";function H({profile:a}){const[e,l]=s.useState(!1),{visibleEntries:n=[]}=s.useContext(B),p=s.useDeferredValue(e);return o.jsx(u.Fragment,{children:o.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:0},children:[o.jsx(V,{profile:a,collectionType:"safelocks"}),n==null?void 0:n.map(m=>o.jsx($,{entry:m,expanded:m.id===p,onExpand:l},m.id))]})})}function Ko(){const{userId:a}=k(),{user:e}=s.useContext(y),{getProfile:l,lockCollection:n}=s.useContext(C),{isMobile:p}=F(),m=s.useCallback(async()=>{try{const r=(e==null?void 0:e.uid)!==a?await l(a):n;if(r){const f=r.displayName?r.displayName.toLowerCase().endsWith("s")?`${r.displayName}'`:`${r.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${f} Safe Locks`}return r}catch(r){return console.error("Error loading profile.",r),null}},[l,n,e,a]),{data:t={},loading:i,error:d}=W({loadFn:m}),c=s.useMemo(()=>{if(i||!t)return[];const r=new Set(P.safelocks.getCollected(t));return q.filter(f=>r.has(f.id))},[t,i]),j=o.jsxs(u.Fragment,{children:[o.jsx(b,{label:"Collection"}),o.jsx(v,{}),o.jsx(w,{sortValues:N}),!p&&o.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),g=i?"Loading...":"Profile",h=o.jsx("div",{style:{margin:"30px 0px"},children:o.jsx(G,{text:!0})});return i||!t?o.jsx(x,{}):o.jsx(R,{filterFields:L,children:o.jsx(M,{allEntries:c,profile:t,children:o.jsx(T,{children:o.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#000",marginLeft:"auto",marginRight:"auto",marginTop:0},children:[o.jsx(S,{title:g,extras:j}),o.jsx(z,{profile:t,page:"safelocks",owner:e&&e.uid===a}),i&&o.jsx(x,{}),!i&&t&&!d&&c.length>0&&o.jsx(H,{profile:t}),!i&&t&&!d&&c.length===0&&o.jsx(I,{collectionType:"safelocks"}),!i&&(!t||d)&&o.jsx(A,{}),o.jsx(D,{before:h}),o.jsx(E,{feature:"profile"})]})})})})}export{Ko as default};
