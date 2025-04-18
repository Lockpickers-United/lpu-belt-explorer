import{r as s,j as o,R as u,ap as k,A as y,D as C,u as F,aq as P,N as S,F as D,T as E}from"./index-d46c3d4a.js";import{d as L}from"./filterFields-1761bf55.js";import{l as N}from"./sortFields-5471f00e.js";import{F as v,S as w}from"./SortButton-4fc8869a.js";import{D as B,a as R}from"./DataContext-ed8611c1.js";import{a as T}from"./LockListContext-075c425e.js";import{S as b}from"./SearchBox-9b32e25c.js";import{L as x}from"./LoadingDisplay-a40188cd.js";import{u as W}from"./useData-301dbb87.js";import{N as I}from"./NoProfileData-80936afd.js";import{P as A}from"./ProfileNotFound-90cddb97.js";import{S as $,d as q,a as M}from"./safelocks-c8fd08b4.js";import{I as V}from"./InlineFilterDisplay-55af3695.js";import{P as z}from"./ProfileHeader-36efbe8c.js";import{E as G}from"./ScorecardExportButton-fd9fbf11.js";import"./rankingRequestData-d3ef79e5.js";import"./Badge-45f18bbb.js";import"./Chip-1b7b6bfc.js";import"./Select-3c7c5d76.js";import"./Box-ef334fb0.js";import"./Sort-922bc518.js";import"./entryName-1af20786.js";import"./index-553a8962.js";import"./Search-b1b24631.js";import"./TextField-fc5cf1ab.js";import"./LPU-c3fa7122.js";import"./LinearProgress-adafcfee.js";import"./mycollection-0ec86312.js";import"./ExpandMore-7bca7f2b.js";import"./CopyLinkToEntryButton-ebf83199.js";import"./Link-ca4238bd.js";import"./FieldValue-8e380a29.js";import"./ImageGallery-ba9af738.js";import"./ImageViewer-77201e72.js";import"./Launch-3d99469d.js";import"./Dialog-749ae9c2.js";import"./DialogContent-a1b4c507.js";import"./ImageListItem-55e6ddd4.js";import"./BeltStripe-21bff7e2.js";import"./CopyEntryTextButton-f86b0c37.js";import"./ContentCopy-d1d84ccf.js";import"./LoadingDisplay-9a7efbd4.js";import"./CircularProgress-c94f093b.js";import"./FormGroup-516d6b4d.js";import"./Checkbox-411c0d5d.js";import"./AccordionSummary-745fc18b.js";import"./Collapse-b730e390.js";import"./index-df45189d.js";import"./index-ad2f8520.js";import"./AccordionActions-3ebdddc5.js";import"./glossary-db95354d.js";import"./Link-8ddc1f2f.js";import"./CopyProfileLinkButton-051a2b13.js";import"./ToggleButtonGroup-2093bcc8.js";import"./download-3a983769.js";import"./List-2fa062b2.js";function H({profile:a}){const[e,l]=s.useState(!1),{visibleEntries:n=[]}=s.useContext(B),p=s.useDeferredValue(e);return o.jsx(u.Fragment,{children:o.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:0},children:[o.jsx(V,{profile:a,collectionType:"safelocks"}),n==null?void 0:n.map(m=>o.jsx($,{entry:m,expanded:m.id===p,onExpand:l},m.id))]})})}function Ko(){const{userId:a}=k(),{user:e}=s.useContext(y),{getProfile:l,lockCollection:n}=s.useContext(C),{isMobile:p}=F(),m=s.useCallback(async()=>{try{const r=(e==null?void 0:e.uid)!==a?await l(a):n;if(r){const f=r.displayName?r.displayName.toLowerCase().endsWith("s")?`${r.displayName}'`:`${r.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${f} Safe Locks`}return r}catch(r){return console.error("Error loading profile.",r),null}},[l,n,e,a]),{data:t={},loading:i,error:d}=W({loadFn:m}),c=s.useMemo(()=>{if(i||!t)return[];const r=new Set(P.safelocks.getCollected(t));return q.filter(f=>r.has(f.id))},[t,i]),j=o.jsxs(u.Fragment,{children:[o.jsx(b,{label:"Collection"}),o.jsx(v,{}),o.jsx(w,{sortValues:N}),!p&&o.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),g=i?"Loading...":"Profile",h=o.jsx("div",{style:{margin:"30px 0px"},children:o.jsx(G,{text:!0})});return i||!t?o.jsx(x,{}):o.jsx(R,{filterFields:L,children:o.jsx(M,{allEntries:c,profile:t,children:o.jsx(T,{children:o.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#000",marginLeft:"auto",marginRight:"auto",marginTop:0},children:[o.jsx(S,{title:g,extras:j}),o.jsx(z,{profile:t,page:"safelocks",owner:e&&e.uid===a}),i&&o.jsx(x,{}),!i&&t&&!d&&c.length>0&&o.jsx(H,{profile:t}),!i&&t&&!d&&c.length===0&&o.jsx(I,{collectionType:"safelocks"}),!i&&(!t||d)&&o.jsx(A,{}),o.jsx(D,{before:h}),o.jsx(E,{feature:"profile"})]})})})})}export{Ko as default};
