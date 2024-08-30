import{r as s,j as o,ae as j,U as h,J as k,af as C,R as P,N as y,O as S,P as F}from"./index-83934d36.js";import{D as L,a as N,d as D}from"./BeltStripe-dee6c3df.js";import{S as E,F as v,a as w,l as R}from"./sortFields-4fb76184.js";import{a as B}from"./LockListContext-8f51c496.js";import{L as x}from"./LoadingDisplay-8678a259.js";import{u as T}from"./useData-035ebdc7.js";import{u as W}from"./useWindowSize-f7aaa6a9.js";import{N as b}from"./NoProfileData-9f7e26e2.js";import{P as I}from"./ProfileNotFound-c36a8fdd.js";import{S as $,d as A,a as M}from"./safelocks-eb32f80a.js";import{I as O}from"./InlineFilterDisplay-c36b48e2.js";import{P as U}from"./ProfileHeader-7fc2c61c.js";import"./Select-d9e31bd4.js";import"./LoadingDisplay-50165025.js";import"./Search-d37e3091.js";import"./Sort-0f233f5e.js";import"./TextField-b6170e17.js";import"./LPU-c3fa7122.js";import"./LinearProgress-ac67fda6.js";import"./index-85b8d943.js";import"./index-854e7988.js";import"./ImageViewer-b89d147f.js";import"./Link-c9383a02.js";import"./Dialog-2dd9882c.js";import"./ContentCopy-3873d6c4.js";import"./CopyProfileLinkButton-39413c01.js";import"./ToggleButtonGroup-0779275e.js";function V({profile:n}){const[a,d]=s.useState(!1),{visibleEntries:i=[]}=s.useContext(L),m=s.useDeferredValue(a);return o.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[o.jsx(O,{profile:n,collectionType:"safelocks"}),i==null?void 0:i.map(l=>o.jsx($,{entry:l,expanded:l.id===m,onExpand:d},l.id))]})}function jo(){const{userId:n}=j(),{user:a}=s.useContext(h),{getProfile:d,lockCollection:i}=s.useContext(k),{isMobile:m}=W(),l=s.useCallback(async()=>{try{const t=(a==null?void 0:a.uid)!==n?await d(n):i;if(t){const f=t.displayName?t.displayName.toLowerCase().endsWith("s")?`${t.displayName}'`:`${t.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${f} Safe Locks`}return t}catch(t){return console.error("Error loading profile.",t),null}},[d,i,a,n]),{data:e={},loading:r,error:p}=T({loadFn:l}),c=s.useMemo(()=>{if(r||!e)return[];const t=new Set(C.safelocks.getCollected(e));return A.filter(f=>t.has(f.id))},[e,r]),u=o.jsxs(P.Fragment,{children:[o.jsx(E,{label:"Collection"}),o.jsx(v,{}),o.jsx(w,{sortValues:R}),!m&&o.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),g=r?"Loading...":"Safe Locks";return r||!e?o.jsx(x,{}):o.jsx(N,{filterFields:D,children:o.jsx(M,{allEntries:c,profile:e,children:o.jsx(B,{children:o.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#000",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[o.jsx(y,{title:g,extras:u}),o.jsx(U,{profile:e,page:"safelocks"}),r&&o.jsx(x,{}),!r&&e&&!p&&c.length>0&&o.jsx(V,{profile:e}),!r&&e&&!p&&c.length===0&&o.jsx(b,{collectionType:"safelocks"}),!r&&(!e||p)&&o.jsx(I,{}),o.jsx(S,{}),o.jsx(F,{feature:"profile"})]})})})})}export{jo as default};
