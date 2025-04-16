import{r as s,j as o,R as u,ap as k,A as y,D as C,u as F,aq as P,N as S,F as D,T as E}from"./index-415cda15.js";import{d as L}from"./filterFields-f703f32d.js";import{l as N}from"./sortFields-5471f00e.js";import{F as v,S as w}from"./SortButton-021c9091.js";import{D as B,a as R}from"./DataContext-12a912fb.js";import{a as T}from"./LockListContext-af97e682.js";import{S as b}from"./SearchBox-7357625f.js";import{L as x}from"./LoadingDisplay-cd9715c3.js";import{u as W}from"./useData-07241258.js";import{N as I}from"./NoProfileData-b7ca91c8.js";import{P as A}from"./ProfileNotFound-7c2c8aa4.js";import{S as $,d as q,a as M}from"./safelocks-9ca0b315.js";import{I as V}from"./InlineFilterDisplay-885a8b4a.js";import{P as z}from"./ProfileHeader-13181628.js";import{E as G}from"./ScorecardExportButton-c84c5f30.js";import"./rankingRequestData-d3ef79e5.js";import"./Badge-9c0c4829.js";import"./Chip-cd513c9a.js";import"./Select-bbe9f62e.js";import"./Box-a82b671a.js";import"./Sort-3495b53f.js";import"./entryName-19a7c345.js";import"./index-14d87f72.js";import"./Search-159497ac.js";import"./TextField-e08b4be9.js";import"./LPU-c3fa7122.js";import"./LinearProgress-adc86a1e.js";import"./mycollection-0ec86312.js";import"./ExpandMore-d524e014.js";import"./CopyLinkToEntryButton-b46671b1.js";import"./Link-4d450f1b.js";import"./FieldValue-98537ccf.js";import"./ImageGallery-c3163b33.js";import"./ImageViewer-58010aba.js";import"./Launch-922a1c4d.js";import"./Dialog-427c4fd0.js";import"./DialogContent-8c89cddd.js";import"./ImageListItem-9df95b93.js";import"./BeltStripe-97cd44c1.js";import"./CopyEntryTextButton-150bc708.js";import"./ContentCopy-e5cc6f93.js";import"./LoadingDisplay-6d84150e.js";import"./CircularProgress-527f121c.js";import"./FormGroup-42695e6a.js";import"./Checkbox-d1ba7039.js";import"./AccordionSummary-58c8112b.js";import"./Collapse-18a9be45.js";import"./index-0c363d12.js";import"./index-d0c2f8d6.js";import"./AccordionActions-a63bcd47.js";import"./glossary-db95354d.js";import"./Link-fc95f3d7.js";import"./CopyProfileLinkButton-c3734806.js";import"./ToggleButtonGroup-3993f335.js";import"./download-7bc45531.js";import"./List-92fa50ff.js";function H({profile:a}){const[e,l]=s.useState(!1),{visibleEntries:n=[]}=s.useContext(B),p=s.useDeferredValue(e);return o.jsx(u.Fragment,{children:o.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:0},children:[o.jsx(V,{profile:a,collectionType:"safelocks"}),n==null?void 0:n.map(m=>o.jsx($,{entry:m,expanded:m.id===p,onExpand:l},m.id))]})})}function Ko(){const{userId:a}=k(),{user:e}=s.useContext(y),{getProfile:l,lockCollection:n}=s.useContext(C),{isMobile:p}=F(),m=s.useCallback(async()=>{try{const r=(e==null?void 0:e.uid)!==a?await l(a):n;if(r){const f=r.displayName?r.displayName.toLowerCase().endsWith("s")?`${r.displayName}'`:`${r.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${f} Safe Locks`}return r}catch(r){return console.error("Error loading profile.",r),null}},[l,n,e,a]),{data:t={},loading:i,error:d}=W({loadFn:m}),c=s.useMemo(()=>{if(i||!t)return[];const r=new Set(P.safelocks.getCollected(t));return q.filter(f=>r.has(f.id))},[t,i]),j=o.jsxs(u.Fragment,{children:[o.jsx(b,{label:"Collection"}),o.jsx(v,{}),o.jsx(w,{sortValues:N}),!p&&o.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),g=i?"Loading...":"Profile",h=o.jsx("div",{style:{margin:"30px 0px"},children:o.jsx(G,{text:!0})});return i||!t?o.jsx(x,{}):o.jsx(R,{filterFields:L,children:o.jsx(M,{allEntries:c,profile:t,children:o.jsx(T,{children:o.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#000",marginLeft:"auto",marginRight:"auto",marginTop:0},children:[o.jsx(S,{title:g,extras:j}),o.jsx(z,{profile:t,page:"safelocks",owner:e&&e.uid===a}),i&&o.jsx(x,{}),!i&&t&&!d&&c.length>0&&o.jsx(H,{profile:t}),!i&&t&&!d&&c.length===0&&o.jsx(I,{collectionType:"safelocks"}),!i&&(!t||d)&&o.jsx(A,{}),o.jsx(D,{before:h}),o.jsx(E,{feature:"profile"})]})})})})}export{Ko as default};
