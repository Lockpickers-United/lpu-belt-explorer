import{j as a,r as c,A as g,x as m,w as b,R as u}from"./index-6772e535.js";import{Q as f,R as y,U as v,V as T,d as w,T as C,N as k,O as L}from"./Nav-d9721410.js";import{T as R,a as j,b as s,c as D,d as N,e as E}from"./TableRow-b2f531ce.js";import{L as _}from"./LinearProgress-764c182d.js";function A(){const t={border:0,padding:"4px 12px",backgroundColor:"#000"};return a.jsx(R,{children:a.jsxs(j,{children:[a.jsx(s,{align:"center",style:t,children:"#"}),a.jsx(s,{style:{fontWeight:700,fontSize:"1.2rem",border:0,padding:"4px 16px 4px 0px",backgroundColor:"#000"},children:"Name"},"Display Name"),a.jsx(s,{align:"center",style:t,children:a.jsx(f,{})}),a.jsx(s,{align:"center",style:t,children:a.jsx(y,{})}),a.jsx(s,{align:"center",style:t,children:a.jsx(v,{})}),a.jsx(s,{align:"center",style:t,children:a.jsx(T,{})})]})})}function d({align:t="center",user:e,leader:o,value:i}){const{displayName:l,id:x}=o,p=(e==null?void 0:e.uid)===x,n=l?"#eee":"#bbb",r=p?{fontWeight:600,color:"#4db013"}:{fontWeight:500,color:n},h={color:n};return a.jsx(s,{align:t,sx:h,style:r,children:i})}function H({index:t,leader:e,user:o}){return a.jsxs(j,{sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":{backgroundColor:"#000"},"td, th":{padding:"6px 2px",border:0}},children:[a.jsx(d,{leader:e,user:o,value:t+1}),a.jsx(d,{leader:e,user:o,value:e.displayName||"Anonymous",align:"left"}),a.jsx(d,{leader:e,user:o,value:e.own}),a.jsx(d,{leader:e,user:o,value:e.picked}),a.jsx(d,{leader:e,user:o,value:e.recorded}),a.jsx(d,{leader:e,user:o,value:e.wishlist})]},e.id)}function S(){const{user:t}=c.useContext(g),[e,o]=c.useState({data:[],metadata:{}}),[i,l]=c.useState(!0);c.useEffect(()=>{const n=async()=>{const h=await(await fetch(F)).json();o(h),l(!1)};try{n()}catch(r){console.error("Error loading leaderboard data.",r),m("Error loading leaderboard data. Please reload the page.",{autoHideDuration:null,action:a.jsx(b,{color:"secondary",onClick:()=>window.location.reload(),children:"Refresh"})}),l(!1)}},[]);const x=i?"####-##-## ##:##":w(e.metadata.updatedDateTime).format("MM/DD/YY hh:mm"),p=i?W:e.data;return a.jsxs(u.Fragment,{children:[i&&a.jsx(_,{variant:"indeterminate",color:"secondary"}),a.jsxs("div",{style:{maxWidth:700,padding:8,backgroundColor:"#000",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[a.jsx(D,{sx:{height:"78vh",backgroundColor:"#111"},children:a.jsxs(N,{stickyHeader:!0,children:[a.jsx(A,{}),a.jsx(E,{children:p.map((n,r)=>a.jsx(H,{index:r,leader:n,user:t},n.id))})]})}),a.jsxs(C,{variant:"caption",align:"right",component:"div",style:{width:"100%",marginTop:8},children:["Last updated: ",x," GMT"]})]})]})}const W=[...Array(40)].map((t,e)=>({id:e,displayName:"........................",own:"---",picked:"---",recorded:"---",wishlist:"--"})),F="https://explore.lpubelts.com/leaderboard/leaderboardData.json";function P(){return a.jsxs(u.Fragment,{children:[a.jsx(k,{title:"Collection Leaderboard"}),a.jsx(S,{}),a.jsx(L,{})]})}export{P as default};
