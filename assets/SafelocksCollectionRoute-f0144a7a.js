import{r as s,j as o,R as u,an as k,A as y,D as C,u as F,ao as P,N as S,F as D,T as E}from"./index-dc14f103.js";import{D as L,a as N,d as v}from"./filterFields-e9deb0f8.js";import{l as w}from"./sortFields-169921b9.js";import{F as B,S as R}from"./SortButton-a53372ef.js";import{a as T}from"./LockListContext-c39168e6.js";import{S as b}from"./SearchBox-6b676231.js";import{L as x}from"./LoadingDisplay-fa47da32.js";import{u as W}from"./useData-e1a1f96e.js";import{N as I}from"./NoProfileData-90c395ae.js";import{P as A}from"./ProfileNotFound-7573853e.js";import{S as $,d as M,a as V}from"./safelocks-ebb79924.js";import{I as q}from"./InlineFilterDisplay-df905d5d.js";import{P as z}from"./ProfileHeader-60a30597.js";import{E as G}from"./ScorecardExportButton-636a6184.js";import"./Badge-73148da7.js";import"./Chip-eb6446d6.js";import"./Select-ad6c5f55.js";import"./Box-ec1cbbcb.js";import"./Sort-f3561ea8.js";import"./entryName-348fcc84.js";import"./Search-d40ac2fd.js";import"./TextField-47470cf4.js";import"./LPU-c3fa7122.js";import"./LinearProgress-29f795c8.js";import"./mycollection-0ec86312.js";import"./FieldValue-f7937b38.js";import"./CopyEntryTextButton-e99990d5.js";import"./Link-8c45ed8e.js";import"./ContentCopy-9907cb58.js";import"./BeltStripe-56bd4740.js";import"./LoadingDisplay-8845542d.js";import"./FormGroup-1b24eda2.js";import"./Checkbox-cf747a4a.js";import"./AccordionSummary-ad52e5c2.js";import"./Collapse-abe64a91.js";import"./index-45f7ed1f.js";import"./index-91c6462c.js";import"./AccordionActions-25c778c2.js";import"./ImageViewer-b129257b.js";import"./Launch-80c1d9fc.js";import"./Dialog-640a8cff.js";import"./DialogContent-53bbc506.js";import"./Link-03346f93.js";import"./CopyProfileLinkButton-eca7079a.js";import"./ToggleButtonGroup-50d48bb3.js";import"./download-082acca2.js";function H({profile:a}){const[e,m]=s.useState(!1),{visibleEntries:n=[]}=s.useContext(L),p=s.useDeferredValue(e);return o.jsx(u.Fragment,{children:o.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:0},children:[o.jsx(q,{profile:a,collectionType:"safelocks"}),n==null?void 0:n.map(l=>o.jsx($,{entry:l,expanded:l.id===p,onExpand:m},l.id))]})})}function $o(){const{userId:a}=k(),{user:e}=s.useContext(y),{getProfile:m,lockCollection:n}=s.useContext(C),{isMobile:p}=F(),l=s.useCallback(async()=>{try{const r=(e==null?void 0:e.uid)!==a?await m(a):n;if(r){const f=r.displayName?r.displayName.toLowerCase().endsWith("s")?`${r.displayName}'`:`${r.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${f} Safe Locks`}return r}catch(r){return console.error("Error loading profile.",r),null}},[m,n,e,a]),{data:t={},loading:i,error:d}=W({loadFn:l}),c=s.useMemo(()=>{if(i||!t)return[];const r=new Set(P.safelocks.getCollected(t));return M.filter(f=>r.has(f.id))},[t,i]),j=o.jsxs(u.Fragment,{children:[o.jsx(b,{label:"Collection"}),o.jsx(B,{}),o.jsx(R,{sortValues:w}),!p&&o.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),g=i?"Loading...":"Profile",h=o.jsx("div",{style:{margin:"30px 0px"},children:o.jsx(G,{text:!0})});return i||!t?o.jsx(x,{}):o.jsx(N,{filterFields:v,children:o.jsx(V,{allEntries:c,profile:t,children:o.jsx(T,{children:o.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#000",marginLeft:"auto",marginRight:"auto",marginTop:0},children:[o.jsx(S,{title:g,extras:j}),o.jsx(z,{profile:t,page:"safelocks",owner:e&&e.uid===a}),i&&o.jsx(x,{}),!i&&t&&!d&&c.length>0&&o.jsx(H,{profile:t}),!i&&t&&!d&&c.length===0&&o.jsx(I,{collectionType:"safelocks"}),!i&&(!t||d)&&o.jsx(A,{}),o.jsx(D,{before:h}),o.jsx(E,{feature:"profile"})]})})})})}export{$o as default};
