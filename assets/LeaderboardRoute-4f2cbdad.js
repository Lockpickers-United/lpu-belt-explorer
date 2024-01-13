import{j as e,an as R,ao as _,ap as F,aq as M,r as n,f as D,H as E,q as I,i as N,R as f,T as A,z as W,A as q,a0 as v,I as C,J as k,ak as B,a3 as H,K as P,al as $,am as z,a5 as O}from"./index-b8b91259.js";import{a as T}from"./InputLabel-c2471fee.js";import{T as U,a as w,b as h,c as G,d as K,e as Y}from"./TableRow-319a77f6.js";import{L as J,d as g,T as Q,I as V}from"./Search-05284a9f.js";import{A as X}from"./Autocomplete-38510cf0.js";function Z(){const a={border:0,padding:"4px 12px",backgroundColor:"#000"};return e.jsx(U,{children:e.jsxs(w,{children:[e.jsx(h,{align:"center",style:a,children:"#"}),e.jsx(h,{style:{fontWeight:700,fontSize:"1.2rem",border:0,padding:"4px 16px 4px 0px",backgroundColor:"#000"},children:"Name"},"Display Name"),e.jsx(h,{align:"center",style:a,children:e.jsx(R,{})}),e.jsx(h,{align:"center",style:a,children:e.jsx(_,{})}),e.jsx(h,{align:"center",style:a,children:e.jsx(F,{})}),e.jsx(h,{align:"center",style:a,children:e.jsx(M,{})})]})})}function p({align:a="center",user:t,leader:s,value:o}){const{displayName:d,id:r}=s,l=(t==null?void 0:t.uid)===r,c=d?"#eee":"#bbb",i=l?{fontWeight:600,color:"#4db013"}:{fontWeight:500,color:c},u={color:c};return e.jsx(h,{align:a,sx:u,style:i,children:o})}function ee({index:a,leader:t,user:s,highlighted:o,scrollableRef:d}){const r=n.useRef(),[l,c]=n.useState(!1),i=o?{backgroundColor:"#333"}:{};return n.useEffect(()=>{o&&r&&!l&&setTimeout(()=>{c(!0),d.current.scrollTo({top:r.current.offsetTop-75,behavior:"smooth"})},0)},[o,d,l]),e.jsxs(w,{ref:r,sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":o?{}:{backgroundColor:"#000"},"td, th":{padding:"6px 2px",border:0},...i},children:[e.jsx(p,{leader:t,user:s,value:a+1}),e.jsx(p,{leader:t,user:s,value:t.displayName||"Anonymous",align:"left"}),e.jsx(p,{leader:t,user:s,value:t.own}),e.jsx(p,{leader:t,user:s,value:t.picked}),e.jsx(p,{leader:t,user:s,value:t.recorded}),e.jsx(p,{leader:t,user:s,value:t.wishlist})]},t.id)}function te({data:a,loading:t}){const s=D(),{user:o}=n.useContext(E),d=n.useRef(),{user:r}=n.useMemo(()=>I.parse(s.search),[s.search]),l=t?"####-##-## ##:##":N(a.metadata.updatedDateTime).format("MM/DD/YY hh:mm"),c=t?ae:a.data;return e.jsxs(f.Fragment,{children:[t&&e.jsx(J,{variant:"indeterminate",color:"secondary"}),e.jsxs("div",{style:{maxWidth:700,padding:8,backgroundColor:"#000",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[e.jsx(G,{sx:{height:"78vh",backgroundColor:"#111"},id:"scrollable",ref:d,children:e.jsxs(K,{stickyHeader:!0,children:[e.jsx(Z,{}),e.jsx(Y,{children:c.map((i,u)=>{const j=!!r&&(r==="me"&&i.id===o.uid||r===i.displayName);return e.jsx(ee,{index:u,leader:i,user:o,scrollableRef:d,highlighted:j},i.id)})})]})}),e.jsxs(A,{variant:"caption",align:"right",component:"div",style:{width:"100%",marginTop:8},children:["Last updated: ",l," GMT"]})]})]})}const ae=[...Array(40)].map((a,t)=>({id:t,displayName:"........................",own:"---",picked:"---",recorded:"---",wishlist:"--"}));var b={},se=q;Object.defineProperty(b,"__esModule",{value:!0});var L=b.default=void 0,re=se(W()),y=e;L=b.default=(0,re.default)([(0,y.jsx)("circle",{cx:"10",cy:"8",r:"4"},"0"),(0,y.jsx)("path",{d:"M10.35 14.01C7.62 13.91 2 15.27 2 18v2h9.54c-2.47-2.76-1.23-5.89-1.19-5.99m9.08 4.01c.36-.59.57-1.28.57-2.02 0-2.21-1.79-4-4-4s-4 1.79-4 4 1.79 4 4 4c.74 0 1.43-.22 2.02-.57L20.59 22 22 20.59zM16 18c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2"},"1")],"PersonSearch");function oe(){const a=v(),t=n.useCallback(()=>{a("/leaderboard?user=me")},[a]);return e.jsx(C,{title:"Find Me",arrow:!0,disableFocusListener:!0,children:e.jsx(k,{color:"inherit",onClick:t,children:e.jsx(L,{})})})}function ne({data:a}){const t={maxWidth:450},{isMobile:s}=T(),o=v(),d=n.useRef(),r=a.data.filter(x=>x.displayName).map(x=>x.displayName),l=n.useCallback((x,m)=>{m?r.includes(m)&&o(`/leaderboard?user=${m}`):o("/leaderboard")},[o,r]),[c,i]=n.useState(!1),u=n.useCallback(()=>{i(!0),setTimeout(()=>d.current.focus(),15)},[]),j=n.useCallback(()=>i(!1),[]),S=c&&s?{width:"auto",position:"fixed",left:60,right:0,paddingRight:16,maxWidth:"unset",zIndex:9999999,backgroundColor:"#272727"}:{};return e.jsxs(f.Fragment,{children:[!c&&s&&e.jsx(C,{title:"Search",arrow:!0,disableFocusListener:!0,children:e.jsx(k,{color:"inherit",onClick:u,children:e.jsx(g,{})})}),(c||!s)&&e.jsx(X,{selectOnFocus:!0,clearOnEscape:!0,handleHomeEndKeys:!0,fullWidth:!0,style:{...t,...S},options:r,onChange:l,renderInput:x=>e.jsx(Q,{...x,placeholder:"Search",variant:"standard",color:"secondary",inputRef:d,InputProps:{...x.InputProps,startAdornment:e.jsx(V,{position:"start",children:e.jsx(g,{})})}})}),e.jsx(B,{invisible:!0,open:c&&s,onClick:j})]})}function he(){const{width:a}=T(),t=a<650,[s,o]=n.useState({data:[],metadata:{}}),[d,r]=n.useState(!0);n.useEffect(()=>{const c=async()=>{const u=await(await fetch(ie)).json();o(u),r(!1)};try{c()}catch(i){console.error("Error loading leaderboard data.",i),H("Error loading leaderboard data. Please reload the page.",{autoHideDuration:null,action:e.jsx(P,{color:"secondary",onClick:()=>window.location.reload(),children:"Refresh"})}),r(!1)}},[]);const l=e.jsxs(f.Fragment,{children:[e.jsx(ne,{data:s}),e.jsx(oe,{}),!t&&e.jsx("div",{style:{flexGrow:1}})]});return e.jsxs(f.Fragment,{children:[e.jsx($,{title:"Leaderboard",extras:l}),e.jsx(te,{data:s,loading:d}),e.jsx(z,{}),e.jsx(O,{feature:"leaderboard"})]})}const ie="https://explore.lpubelts.com/leaderboard/leaderboardData.json";export{he as default};
