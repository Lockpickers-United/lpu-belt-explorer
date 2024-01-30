import{ai as p,r as s,a0 as g,u as h,j as t,T as C,I as E,aj as P,C as L,a3 as v,c as y,b as F,Q as k,R as d,U as T,V as b,W as B}from"./index-71f562e3.js";import{L as D,D as I,I as R,C as w,E as N,m as S,k as M,h as V,T as W,i as q,j as A,l as H}from"./FilterButton-3e57c73d.js";import{C as O,l as Q}from"./CopyProfileLinkButton-3831d585.js";import{L as U}from"./LinearProgress-87a50b89.js";import"./useWindowSize-be6f34be.js";import"./InputLabel-d28c8f84.js";import"./SwitchBase-fed616d5.js";import"./ImageViewer-64cb79b9.js";import"./Link-442609fc.js";import"./Chip-6a87a19b.js";import"./index-a4d7036b.js";import"./index-8e1da61f.js";import"./Badge-f93eb320.js";function _(){const{userId:e}=p(),{user:a}=s.useContext(g),o=h(),n=s.useCallback(()=>{o("/profile/edit")},[o]);return e!==(a==null?void 0:a.uid)?null:t.jsx(C,{title:"Edit Profile",arrow:!0,disableFocusListener:!0,children:t.jsx(E,{onClick:n,children:t.jsx(P,{})})})}function z(){const e={marginTop:16,maxWidth:350,marginLeft:"auto",marginRight:"auto",borderRadius:0};return t.jsxs(L,{style:e,children:[t.jsx(v,{title:"Profile Not Found!"}),t.jsx(y,{children:t.jsx(F,{variant:"h6",align:"center",children:"This profile was not found, or is not public."})})]})}function G({profile:e}){const{compact:a,expanded:o,setExpanded:n}=s.useContext(D),{visibleEntries:r=[]}=s.useContext(I),c=s.useDeferredValue(o);return t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(R,{profile:e}),a?t.jsx(w,{entries:r}):r.map(l=>t.jsx(N,{entry:l,expanded:l.id===c,onExpand:n},l.id))]})}function nt(){const[e,a]=s.useState({}),{userId:o}=p(),{getProfile:n}=s.useContext(k),[r,c]=s.useState(!0),[l,u]=s.useState(!1);s.useEffect(()=>{(async()=>{try{const i=await n(o);a(i),u(!1)}catch(i){console.trace("Error loading profile",i),a({}),u(!0)}finally{c(!1)}})()},[o,n]);const f=s.useMemo(()=>{const x=new Set(S.flatMap(({key:i})=>e[i]));return M.filter(i=>x.has(i.id))},[e]),m=t.jsxs(d.Fragment,{children:[t.jsx(V,{}),t.jsx(W,{}),t.jsx(_,{}),t.jsx(O,{})]}),j=r?"Loading...":"Profile";return t.jsx(d.Fragment,{children:t.jsx(q,{children:t.jsx(A,{allEntries:f,profile:e,children:t.jsxs(H,{children:[t.jsx(T,{title:j,extras:m}),r&&t.jsxs(d.Fragment,{children:[t.jsx(U,{variant:"indeterminate",color:"secondary"}),t.jsx("img",{alt:"Loading",src:Q,style:{marginLeft:"auto",marginRight:"auto",display:"block"}})]}),!r&&e&&!l&&t.jsx(G,{profile:e}),!r&&l&&t.jsx(z,{}),t.jsx(b,{}),t.jsx(B,{feature:"profile"})]})})})})}export{nt as default};
