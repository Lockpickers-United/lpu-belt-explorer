import{O as S,r as l,j as e,T as x,X as M,Y as P,Z as D,$ as N,a0 as y,a1 as _,a2 as I,R as j,b as W,h as B,i as $,u as w,I as v,P as E,M as O,g as A,U as H,V as q,W as z}from"./index-e16adaf9.js";import{u as U,L as Y}from"./useData-5ce70909.js";import{u as T}from"./useWindowSize-c2cebfea.js";import{d as G}from"./dayjs.min-14167635.js";import{T as V,a as F,b as m,c as K,d as X,e as Z,l as J}from"./dataUrls-e722c559.js";import{L as Q}from"./LinearProgress-150ec21f.js";import{d as k,I as ee}from"./Search-08698e87.js";import{A as re}from"./Autocomplete-2396a1e1.js";import{T as te}from"./TextField-9d39314a.js";import{d as se}from"./Sort-1dd157b8.js";import{B as oe}from"./Badge-c26574a7.js";import"./LPU-c3fa7122.js";import"./InputLabel-f7fbe339.js";import"./usePreviousProps-660caa5b.js";import"./Chip-19486bcd.js";function ne(){const[s,r]=S(),t=s.get("sort"),a={border:0,padding:"4px 12px",backgroundColor:"#000"},o=l.useCallback(n=>()=>{n&&n!==t?s.set("sort",n):s.delete("sort"),r(s)},[s,r,t]);return e.jsx(V,{children:e.jsxs(F,{children:[e.jsx(m,{align:"center",style:a,children:e.jsx(x,{title:"Sort Default",arrow:!0,disableFocusListener:!0,children:e.jsx("span",{style:{cursor:"pointer"},onClick:o(),children:"#"})})}),e.jsx(m,{style:{fontWeight:700,fontSize:"1.2rem",border:0,padding:"4px 16px 4px 0px",backgroundColor:"#000"},children:"Name"},"Display Name"),e.jsx(m,{align:"center",style:a,children:e.jsx(x,{title:"Sort by Own",arrow:!0,disableFocusListener:!0,children:e.jsx(M,{color:t==="own"?"secondary":void 0,onClick:o("own"),style:{cursor:"pointer"}})})}),e.jsx(m,{align:"center",style:a,children:e.jsx(x,{title:"Sort by Picked",arrow:!0,disableFocusListener:!0,children:e.jsx(P,{color:t==="picked"?"secondary":void 0,onClick:o("picked"),style:{cursor:"pointer"}})})}),e.jsx(m,{align:"center",style:a,children:e.jsx(x,{title:"Sort by Recorded",arrow:!0,disableFocusListener:!0,children:e.jsx(D,{color:t==="recorded"?"secondary":void 0,onClick:o("recorded"),style:{cursor:"pointer"}})})}),e.jsx(m,{align:"center",style:a,children:e.jsx(x,{title:"Sort by Wishlist",arrow:!0,disableFocusListener:!0,children:e.jsx(N,{color:t==="wishlist"?"secondary":void 0,onClick:o("wishlist"),style:{cursor:"pointer"}})})})]})})}function f({align:s="center",isCurrentUser:r,leader:t,value:a}){const o=t.displayName?"#eee":"#bbb",n=r?{fontWeight:600,color:"#4db013"}:{fontWeight:500,color:o},c={color:o};return e.jsx(m,{align:s,sx:c,style:n,children:a})}function ae({leader:s,isCurrentUser:r}){const t={textDecoration:"none",color:r?"#4db013":"#fff"};if(s.displayName){const a=s.displayName.replace(/\s/g,"_"),o=`/#/profile/${s.id}?name=${a}`;return e.jsx("a",{style:t,href:o,children:s.displayName})}else return"Anonymous"}function ie({index:s,leader:r,highlighted:t,scrollableRef:a}){const o=l.useRef(),{user:n}=l.useContext(y),[c,u]=l.useState(!1),d=(n==null?void 0:n.uid)===r.id,i=t?{backgroundColor:"#333"}:{};return l.useEffect(()=>{t&&o&&!c&&setTimeout(()=>{u(!0),a.current.scrollTo({top:o.current.offsetTop-75,behavior:"smooth"})},0)},[t,a,c]),e.jsxs(F,{ref:o,sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":t?{}:{backgroundColor:"#000"},"td, th":{padding:"6px 2px",border:0},...i},children:[e.jsx(f,{isCurrentUser:d,leader:r,value:s+1}),e.jsx(f,{isCurrentUser:d,leader:r,value:e.jsx(ae,{isCurrentUser:d,leader:r}),align:"left"}),e.jsx(f,{isCurrentUser:d,leader:r,value:r.own}),e.jsx(f,{isCurrentUser:d,leader:r,value:r.picked}),e.jsx(f,{isCurrentUser:d,leader:r,value:r.recorded}),e.jsx(f,{isCurrentUser:d,leader:r,value:r.wishlist})]},r.id)}function le({data:s,loading:r}){const t=_(),{user:a}=l.useContext(y),o=l.useRef(),{highlightedUser:n,sort:c}=l.useMemo(()=>{const i=I.parse(t.search);return{highlightedUser:i.user,sort:i.sort&&ce.includes(i.sort)?i.sort:void 0}},[t.search]),u=l.useMemo(()=>c?s.data.toSorted((i,h)=>h[c]-i[c]):s.data,[c,s]),d=G(s.metadata.updatedDateTime).format("MM/DD/YY HH:mm");return e.jsxs(j.Fragment,{children:[r&&e.jsx(Q,{variant:"indeterminate",color:"secondary"}),e.jsxs("div",{style:{maxWidth:700,padding:8,backgroundColor:"#000",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[e.jsx(K,{sx:{height:"78vh",backgroundColor:"#111"},id:"scrollable",ref:o,children:e.jsxs(X,{stickyHeader:!0,children:[e.jsx(ne,{}),e.jsx(Z,{children:u.map((i,h)=>{const b=!!n&&(n==="me"&&i.id===(a==null?void 0:a.uid)||n===i.displayName);return e.jsx(ie,{index:h,leader:i,scrollableRef:o,highlighted:b},i.id)})})]})}),e.jsxs(W,{variant:"caption",align:"right",component:"div",style:{width:"100%",marginTop:8},children:["Updated hourly, last update: ",d," GMT"]})]})]})}const ce=["own","picked","recorded","wishlist"];var C={},de=$;Object.defineProperty(C,"__esModule",{value:!0});var R=C.default=void 0,ue=de(B()),L=e;R=C.default=(0,ue.default)([(0,L.jsx)("circle",{cx:"10",cy:"8",r:"4"},"0"),(0,L.jsx)("path",{d:"M10.35 14.01C7.62 13.91 2 15.27 2 18v2h9.54c-2.47-2.76-1.23-5.89-1.19-5.99m9.08 4.01c.36-.59.57-1.28.57-2.02 0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4c.74 0 1.43-.22 2.02-.57L20.59 22 22 20.59zM16 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2"},"1")],"PersonSearch");function he(){const s=w(),{isLoggedIn:r}=l.useContext(y),t=l.useCallback(()=>{s("/leaderboard?user=me")},[s]);return r?e.jsx(x,{title:"Find Me",arrow:!0,disableFocusListener:!0,children:e.jsx(v,{color:"inherit",onClick:t,children:e.jsx(R,{})})}):null}function xe({data:s}){const r={maxWidth:450},{isMobile:t}=T(),a=w(),o=l.useRef(),n=l.useMemo(()=>s?s.data.filter(p=>p.displayName).map(p=>p.displayName):[],[s]),c=l.useCallback((p,g)=>{g?n.includes(g)&&a(`/leaderboard?user=${g}`):a("/leaderboard")},[a,n]),[u,d]=l.useState(!1),i=l.useCallback(()=>{d(!0),setTimeout(()=>o.current.focus(),15)},[]),h=l.useCallback(()=>d(!1),[]),b=u&&t?{width:"auto",position:"fixed",left:60,right:0,paddingRight:16,maxWidth:"unset",zIndex:9999999,backgroundColor:"#272727"}:{};return e.jsxs(j.Fragment,{children:[!u&&t&&e.jsx(x,{title:"Search",arrow:!0,disableFocusListener:!0,children:e.jsx(v,{color:"inherit",onClick:i,children:e.jsx(k,{})})}),(u||!t)&&e.jsx(re,{selectOnFocus:!0,clearOnEscape:!0,handleHomeEndKeys:!0,fullWidth:!0,style:{...r,...b},options:n,onChange:c,renderInput:p=>e.jsx(te,{...p,placeholder:"Search Leaderboard",variant:"standard",color:"secondary",inputRef:o,InputProps:{...p.InputProps,startAdornment:e.jsx(ee,{position:"start",children:e.jsx(k,{})})}})}),e.jsx(E,{invisible:!0,open:u&&t,onClick:h})]})}function pe(){const[s,r]=l.useState(null),t=!!s,a=l.useCallback(i=>r(i.currentTarget),[]),o=l.useCallback(()=>r(null),[]),[n,c]=S(),u=n.get("sort"),d=l.useCallback(i=>()=>{o(),i&&i!==u?n.set("sort",i):n.delete("sort"),c(n)},[n,c,u,o]);return e.jsxs(j.Fragment,{children:[e.jsx(x,{title:"Sort",arrow:!0,disableFocusListener:!0,children:e.jsx(v,{color:"inherit",onClick:a,children:e.jsx(oe,{variant:"dot",color:"secondary",overlap:"circular",invisible:!u,anchorOrigin:{vertical:"bottom",horizontal:"right"},children:e.jsx(se,{})})})}),e.jsx(O,{anchorEl:s,open:t,onClose:o,children:me.map(({label:i,value:h})=>e.jsx(A,{onClick:d(h),selected:u===h,children:i},i))})]})}const me=[{label:"Default",value:void 0},{label:"Own",value:"own"},{label:"Picked",value:"picked"},{label:"Recorded",value:"recorded"},{label:"Wishlist",value:"wishlist"}];function De(){const{isMobile:s}=T(),{data:r,loading:t,error:a}=U({url:fe}),o=e.jsxs(j.Fragment,{children:[e.jsx(xe,{data:r}),e.jsx(pe,{}),e.jsx(he,{}),!s&&e.jsx("div",{style:{flexGrow:1}})]}),n=t?"Loading...":"Leaderboard";return e.jsxs(j.Fragment,{children:[e.jsx(H,{title:n,extras:o}),!t&&!a&&r&&e.jsx(le,{data:r,loading:t}),t&&e.jsx(Y,{}),e.jsx(q,{}),e.jsx(z,{feature:"leaderboard"})]})}const fe=J;export{De as default};
