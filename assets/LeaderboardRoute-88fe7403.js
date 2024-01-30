import{O as w,r as l,j as e,T as x,X as M,Y as P,Z as D,$ as N,a0 as S,a1 as _,a2 as B,R as j,b as E,h as I,i as W,u as L,I as y,P as $,M as O,g as A,e as q,B as H,U as z,V as U,W as Y}from"./index-f0c59482.js";import{u as T}from"./useWindowSize-d49ab90c.js";import{d as G,B as V}from"./Badge-6822656d.js";import{T as K,a as F,b as f,c as X,d as Z,e as J}from"./TableRow-1d742b24.js";import{L as Q}from"./LinearProgress-18ccf1ed.js";import{d as k,I as ee}from"./Search-487d09ec.js";import{A as te}from"./Autocomplete-c3845ce7.js";import{T as re}from"./TextField-b2b5deea.js";import{d as se}from"./Sort-6f5045ad.js";import"./Chip-1a72c640.js";import"./InputLabel-0e2f90f6.js";function oe(){const[r,t]=w(),s=r.get("sort"),i={border:0,padding:"4px 12px",backgroundColor:"#000"},o=l.useCallback(a=>()=>{a&&a!==s?r.set("sort",a):r.delete("sort"),t(r)},[r,t,s]);return e.jsx(K,{children:e.jsxs(F,{children:[e.jsx(f,{align:"center",style:i,children:e.jsx(x,{title:"Sort Default",arrow:!0,disableFocusListener:!0,children:e.jsx("span",{style:{cursor:"pointer"},onClick:o(),children:"#"})})}),e.jsx(f,{style:{fontWeight:700,fontSize:"1.2rem",border:0,padding:"4px 16px 4px 0px",backgroundColor:"#000"},children:"Name"},"Display Name"),e.jsx(f,{align:"center",style:i,children:e.jsx(x,{title:"Sort by Own",arrow:!0,disableFocusListener:!0,children:e.jsx(M,{color:s==="own"?"secondary":void 0,onClick:o("own"),style:{cursor:"pointer"}})})}),e.jsx(f,{align:"center",style:i,children:e.jsx(x,{title:"Sort by Picked",arrow:!0,disableFocusListener:!0,children:e.jsx(P,{color:s==="picked"?"secondary":void 0,onClick:o("picked"),style:{cursor:"pointer"}})})}),e.jsx(f,{align:"center",style:i,children:e.jsx(x,{title:"Sort by Recorded",arrow:!0,disableFocusListener:!0,children:e.jsx(D,{color:s==="recorded"?"secondary":void 0,onClick:o("recorded"),style:{cursor:"pointer"}})})}),e.jsx(f,{align:"center",style:i,children:e.jsx(x,{title:"Sort by Wishlist",arrow:!0,disableFocusListener:!0,children:e.jsx(N,{color:s==="wishlist"?"secondary":void 0,onClick:o("wishlist"),style:{cursor:"pointer"}})})})]})})}function m({align:r="center",isCurrentUser:t,leader:s,value:i}){const o=s.displayName?"#eee":"#bbb",a=t?{fontWeight:600,color:"#4db013"}:{fontWeight:500,color:o},c={color:o};return e.jsx(f,{align:r,sx:c,style:a,children:i})}function ae({leader:r,isCurrentUser:t}){const s={textDecoration:"none",color:t?"#4db013":"#fff"};if(r.displayName){const i=`/#/profile/${r.id}?name=${r.displayName}`;return e.jsx("a",{style:s,href:i,children:r.displayName})}else return"Anonymous"}function ne({index:r,leader:t,highlighted:s,scrollableRef:i}){const o=l.useRef(),{user:a}=l.useContext(S),[c,d]=l.useState(!1),u=(a==null?void 0:a.uid)===t.id,n=s?{backgroundColor:"#333"}:{};return l.useEffect(()=>{s&&o&&!c&&setTimeout(()=>{d(!0),i.current.scrollTo({top:o.current.offsetTop-75,behavior:"smooth"})},0)},[s,i,c]),e.jsxs(F,{ref:o,sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":s?{}:{backgroundColor:"#000"},"td, th":{padding:"6px 2px",border:0},...n},children:[e.jsx(m,{isCurrentUser:u,leader:t,value:r+1}),e.jsx(m,{isCurrentUser:u,leader:t,value:e.jsx(ae,{isCurrentUser:u,leader:t}),align:"left"}),e.jsx(m,{isCurrentUser:u,leader:t,value:t.own}),e.jsx(m,{isCurrentUser:u,leader:t,value:t.picked}),e.jsx(m,{isCurrentUser:u,leader:t,value:t.recorded}),e.jsx(m,{isCurrentUser:u,leader:t,value:t.wishlist})]},t.id)}function ie({data:r,loading:t}){const s=_(),{user:i}=l.useContext(S),o=l.useRef(),{highlightedUser:a,sort:c}=l.useMemo(()=>{const n=B.parse(s.search);return{highlightedUser:n.user,sort:n.sort&&le.includes(n.sort)?n.sort:void 0}},[s.search]),d=l.useMemo(()=>t?ce:c?r.data.toSorted((n,h)=>h[c]-n[c]):r.data,[c,t,r]),u=t?"####-##-## ##:##":G(r.metadata.updatedDateTime).format("MM/DD/YY hh:mm");return e.jsxs(j.Fragment,{children:[t&&e.jsx(Q,{variant:"indeterminate",color:"secondary"}),e.jsxs("div",{style:{maxWidth:700,padding:8,backgroundColor:"#000",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[e.jsx(X,{sx:{height:"78vh",backgroundColor:"#111"},id:"scrollable",ref:o,children:e.jsxs(Z,{stickyHeader:!0,children:[e.jsx(oe,{}),e.jsx(J,{children:d.map((n,h)=>{const b=!!a&&(a==="me"&&n.id===i.uid||a===n.displayName);return e.jsx(ne,{index:h,leader:n,scrollableRef:o,highlighted:b},n.id)})})]})}),e.jsxs(E,{variant:"caption",align:"right",component:"div",style:{width:"100%",marginTop:8},children:["Last updated: ",u," GMT"]})]})]})}const le=["own","picked","recorded","wishlist"],ce=[...Array(40)].map((r,t)=>({id:t,displayName:"........................",own:"---",picked:"---",recorded:"---",wishlist:"--"}));var v={},de=W;Object.defineProperty(v,"__esModule",{value:!0});var R=v.default=void 0,ue=de(I()),C=e;R=v.default=(0,ue.default)([(0,C.jsx)("circle",{cx:"10",cy:"8",r:"4"},"0"),(0,C.jsx)("path",{d:"M10.35 14.01C7.62 13.91 2 15.27 2 18v2h9.54c-2.47-2.76-1.23-5.89-1.19-5.99m9.08 4.01c.36-.59.57-1.28.57-2.02 0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4c.74 0 1.43-.22 2.02-.57L20.59 22 22 20.59zM16 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2"},"1")],"PersonSearch");function he(){const r=L(),t=l.useCallback(()=>{r("/leaderboard?user=me")},[r]);return e.jsx(x,{title:"Find Me",arrow:!0,disableFocusListener:!0,children:e.jsx(y,{color:"inherit",onClick:t,children:e.jsx(R,{})})})}function xe({data:r}){const t={maxWidth:450},{isMobile:s}=T(),i=L(),o=l.useRef(),a=r.data.filter(p=>p.displayName).map(p=>p.displayName),c=l.useCallback((p,g)=>{g?a.includes(g)&&i(`/leaderboard?user=${g}`):i("/leaderboard")},[i,a]),[d,u]=l.useState(!1),n=l.useCallback(()=>{u(!0),setTimeout(()=>o.current.focus(),15)},[]),h=l.useCallback(()=>u(!1),[]),b=d&&s?{width:"auto",position:"fixed",left:60,right:0,paddingRight:16,maxWidth:"unset",zIndex:9999999,backgroundColor:"#272727"}:{};return e.jsxs(j.Fragment,{children:[!d&&s&&e.jsx(x,{title:"Search",arrow:!0,disableFocusListener:!0,children:e.jsx(y,{color:"inherit",onClick:n,children:e.jsx(k,{})})}),(d||!s)&&e.jsx(te,{selectOnFocus:!0,clearOnEscape:!0,handleHomeEndKeys:!0,fullWidth:!0,style:{...t,...b},options:a,onChange:c,renderInput:p=>e.jsx(re,{...p,placeholder:"Search",variant:"standard",color:"secondary",inputRef:o,InputProps:{...p.InputProps,startAdornment:e.jsx(ee,{position:"start",children:e.jsx(k,{})})}})}),e.jsx($,{invisible:!0,open:d&&s,onClick:h})]})}function pe(){const[r,t]=l.useState(null),s=!!r,i=l.useCallback(n=>t(n.currentTarget),[]),o=l.useCallback(()=>t(null),[]),[a,c]=w(),d=a.get("sort"),u=l.useCallback(n=>()=>{o(),n&&n!==d?a.set("sort",n):a.delete("sort"),c(a)},[a,c,d,o]);return e.jsxs(j.Fragment,{children:[e.jsx(x,{title:"Sort",arrow:!0,disableFocusListener:!0,children:e.jsx(y,{color:"inherit",onClick:i,children:e.jsx(V,{variant:"dot",color:"secondary",overlap:"circular",invisible:!d,anchorOrigin:{vertical:"bottom",horizontal:"right"},children:e.jsx(se,{})})})}),e.jsx(O,{anchorEl:r,open:s,onClose:o,children:fe.map(({label:n,value:h})=>e.jsx(A,{onClick:u(h),selected:d===h,children:n},n))})]})}const fe=[{label:"Default",value:void 0},{label:"Own",value:"own"},{label:"Picked",value:"picked"},{label:"Recorded",value:"recorded"},{label:"Wishlist",value:"wishlist"}];function Fe(){const{isMobile:r}=T(),[t,s]=l.useState({data:[],metadata:{}}),[i,o]=l.useState(!0);l.useEffect(()=>{const c=async()=>{const u=await(await fetch(me)).json();s(u),o(!1)};try{c()}catch(d){console.error("Error loading leaderboard data.",d),q("Error loading leaderboard data. Please reload the page.",{autoHideDuration:null,action:e.jsx(H,{color:"secondary",onClick:()=>window.location.reload(),children:"Refresh"})}),o(!1)}},[]);const a=e.jsxs(j.Fragment,{children:[e.jsx(xe,{data:t}),e.jsx(pe,{}),e.jsx(he,{}),!r&&e.jsx("div",{style:{flexGrow:1}})]});return e.jsxs(j.Fragment,{children:[e.jsx(z,{title:"Leaderboard",extras:a}),e.jsx(ie,{data:t,loading:i}),e.jsx(U,{}),e.jsx(Y,{feature:"leaderboard"})]})}const me="https://explore.lpubelts.com/leaderboard/leaderboardData.json";export{Fe as default};
