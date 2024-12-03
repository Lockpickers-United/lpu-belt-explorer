import{r as s,j as o,R as u,an as k,A as y,D as C,u as F,ao as P,N as S,F as D,T as E}from"./index-308b459e.js";import{D as L,a as N,d as v}from"./filterFields-9a173c8f.js";import{S as w,l as B}from"./SearchBox-5f4c5346.js";import{F as R,S as T}from"./SortButton-7c4a5d45.js";import{a as b}from"./LockListContext-6d15205b.js";import{L as x}from"./LoadingDisplay-f1098c01.js";import{u as W}from"./useData-5b934588.js";import{N as I}from"./NoProfileData-933b0ea0.js";import{P as A}from"./ProfileNotFound-0a866b56.js";import{S as $,d as M,a as V}from"./safelocks-926cd2bc.js";import{I as q}from"./InlineFilterDisplay-5b386ddd.js";import{P as z}from"./ProfileHeader-fbf48404.js";import{E as G}from"./ScorecardExportButton-36989c0f.js";import"./Select-1d56a076.js";import"./Box-45e87f12.js";import"./Chip-b28f19aa.js";import"./Search-82f50625.js";import"./Badge-925ee2f4.js";import"./TextField-5f726933.js";import"./Sort-d696fca0.js";import"./entryName-ed07acc6.js";import"./LPU-c3fa7122.js";import"./LinearProgress-bd11a24d.js";import"./mycollection-0ec86312.js";import"./FieldValue-4b554765.js";import"./BeltStripe-fb18d473.js";import"./LoadingDisplay-d5fe3477.js";import"./FormGroup-05938ddd.js";import"./AccordionSummary-5953ab15.js";import"./index-e469b0cb.js";import"./index-08c918cc.js";import"./AccordionActions-fc066da5.js";import"./ImageViewer-e5b91557.js";import"./Link-b4787837.js";import"./Launch-81ab9c94.js";import"./Dialog-0fd516e3.js";import"./ContentCopy-b94cdbb7.js";import"./CopyProfileLinkButton-3142c55b.js";import"./ToggleButtonGroup-9fa8e37a.js";import"./Link-d6bd10a5.js";import"./download-fd2e5961.js";function H({profile:a}){const[e,m]=s.useState(!1),{visibleEntries:n=[]}=s.useContext(L),p=s.useDeferredValue(e);return o.jsx(u.Fragment,{children:o.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:0},children:[o.jsx(q,{profile:a,collectionType:"safelocks"}),n==null?void 0:n.map(l=>o.jsx($,{entry:l,expanded:l.id===p,onExpand:m},l.id))]})})}function To(){const{userId:a}=k(),{user:e}=s.useContext(y),{getProfile:m,lockCollection:n}=s.useContext(C),{isMobile:p}=F(),l=s.useCallback(async()=>{try{const r=(e==null?void 0:e.uid)!==a?await m(a):n;if(r){const f=r.displayName?r.displayName.toLowerCase().endsWith("s")?`${r.displayName}'`:`${r.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${f} Safe Locks`}return r}catch(r){return console.error("Error loading profile.",r),null}},[m,n,e,a]),{data:t={},loading:i,error:d}=W({loadFn:l}),c=s.useMemo(()=>{if(i||!t)return[];const r=new Set(P.safelocks.getCollected(t));return M.filter(f=>r.has(f.id))},[t,i]),j=o.jsxs(u.Fragment,{children:[o.jsx(w,{label:"Collection"}),o.jsx(R,{}),o.jsx(T,{sortValues:B}),!p&&o.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),g=i?"Loading...":"Profile",h=o.jsx("div",{style:{margin:"30px 0px"},children:o.jsx(G,{text:!0})});return i||!t?o.jsx(x,{}):o.jsx(N,{filterFields:v,children:o.jsx(V,{allEntries:c,profile:t,children:o.jsx(b,{children:o.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#000",marginLeft:"auto",marginRight:"auto",marginTop:0},children:[o.jsx(S,{title:g,extras:j}),o.jsx(z,{profile:t,page:"safelocks",owner:e&&e.uid===a}),i&&o.jsx(x,{}),!i&&t&&!d&&c.length>0&&o.jsx(H,{profile:t}),!i&&t&&!d&&c.length===0&&o.jsx(I,{collectionType:"safelocks"}),!i&&(!t||d)&&o.jsx(A,{}),o.jsx(D,{before:h}),o.jsx(E,{feature:"profile"})]})})})})}export{To as default};
