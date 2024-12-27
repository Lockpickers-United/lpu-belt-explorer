import{r as a,j as e,u as v,R as y,N as A,F as w,T}from"./index-d72901c5.js";import{F as k,f as N,D as F,a as W,r as B}from"./filterFields-d692a765.js";import{u as D}from"./usePageTitle-7e51adea.js";import{r as H}from"./index-f5cf9552.js";import{R as S,A as L}from"./AdminRoleButton-1884f370.js";import{N as P}from"./ViewFilterButtons-0ca77aa7.js";import{L as b}from"./Link-e6b2e8e2.js";import{a as z,b as p,c as E,d as M,T as U,e as I}from"./TableRow-3c6571b6.js";import{R as G}from"./RaffleSearchBar-83050d56.js";import{R as K}from"./RaffleHiddenDialog-93e640bf.js";import{R as O}from"./RaffleHeader-1d8c0dbd.js";import{R as V}from"./ReportButton-9d34eb1f.js";import"./useDocumentTitle-fda0c444.js";import"./useData-b07c17f8.js";import"./dataUrls-824ba4d9.js";import"./LockListContext-411aa4b2.js";import"./entryName-ee03161a.js";import"./Badge-9b0c1bde.js";import"./Chip-f152661e.js";import"./Select-54701803.js";import"./SearchBox-bc53c243.js";import"./Box-a1058137.js";import"./Search-c997d05e.js";import"./TextField-8ab3a185.js";import"./ToggleButtonGroup-e691dc40.js";import"./Dialog-25a34709.js";function _({children:o}){const{filters:l}=a.useContext(k),{search:c,id:u,tab:m,name:g,sort:n,image:x,...s}=l,{allCharities:d}=a.useContext(S),f=a.useMemo(()=>{const R=Object.keys(s).map(r=>{const t=s[r];return Array.isArray(t)?t.map(i=>({key:r,value:i})):{key:r,value:t}}).flat(),C=d.filter(r=>R.every(({key:t,value:i})=>Array.isArray(r[t])?r[t].includes(i):r[t]===i)).sort((r,t)=>r.fuzzy.localeCompare(t.fuzzy)),j=c?N.go(H(c),C,{keys:$,threshold:-25e3}).map(r=>({...r.obj,score:r.score})):C;return n?j.sort((r,t)=>n==="potName"?r.title.localeCompare(t.title):n==="contributedBy"?r.contributedBy[0].localeCompare(t.contributedBy[0]):r.potNumber<t.potNumber):j},[d,s,c,n]),h=a.useMemo(()=>({allCharities:d,visibleEntries:f}),[d,f]);return e.jsx(F.Provider,{value:h,children:o})}const $=["fuzzy"];function q({charity:o}){const{isMobile:l}=v(),{raflState:c,raffleAdminRole:u}=a.useContext(S),m=["live","post"].includes(c)||u,g=a.useCallback(d=>{const f=window.open(d,"_blank","noopener,noreferrer");f&&(f.opener=null)},[]),n=o.url?e.jsx(b,{onClick:()=>g(o.url),style:{color:"#fff",fontWeight:500},children:o.name}):e.jsx("span",{style:{color:"#ddd"},children:o.name}),x=l?"0.95rem":"1.0rem",s=l?{fontSize:x,border:0,padding:"6px 10px"}:{fontSize:x,border:0,padding:"10px 16px"};return e.jsxs(z,{sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":{backgroundColor:"#191919"},"td, th":{}},children:[e.jsx(p,{align:"left",style:s,children:n}),m&&e.jsxs(y.Fragment,{children:[e.jsx(p,{align:"center",style:s,children:o.donations2024>0&&new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumSignificantDigits:3}).format(o.donations2024)}),e.jsx(p,{align:"center",style:s,children:o.donations>0&&new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumSignificantDigits:3}).format(o.donations)})]})]})}function J(){const{visibleEntries:o}=a.useContext(F),{raflState:l,raffleAdminRole:c}=a.useContext(S),u=["live","post"].includes(l)||c,{isMobile:m}=v(),g=a.useRef(),[n,x]=a.useState("name"),s=a.useCallback(t=>{t!==n&&x(t)},[x,n]),d=o.sort((t,i)=>{switch(n){case"2024":return i.donations2024-t.donations2024;case"2025":return i.donations-t.donations;case"name":return t.name.localeCompare(i.name);default:return t.name.localeCompare(i.name)}}),f={maxWidth:700,marginLeft:"auto",marginRight:"auto"},h=m?"0.9rem":"1.0rem",R=m?"10px 10px":"16px 16px",C=l==="live"?"Currently":"Contributions",j=m?"2024":"2024 Contributions",r=m?"2025":`2025 ${C}`;return e.jsxs(y.Fragment,{children:[e.jsxs("div",{style:{paddingBottom:32},children:[e.jsx(G,{label:"Approved Charities",sortValues:null}),o.length===0&&e.jsx(P,{label:"Charities"}),o.length>0&&e.jsx(E,{sx:{height:"100%",backgroundColor:"#111"},id:"scrollable",ref:g,children:e.jsxs(M,{stickyHeader:!0,style:f,children:[e.jsx(U,{children:e.jsxs(z,{children:[e.jsx(p,{style:{fontWeight:700,fontSize:h,lineHeight:"1.3rem",border:0,backgroundColor:"#222",padding:R},children:e.jsx(b,{onClick:()=>s("name"),style:{color:n==="name"?"#fff":"#ccc"},children:"Charity Name"})},"Charity Name"),u&&e.jsxs(y.Fragment,{children:[e.jsx(p,{style:{fontWeight:700,fontSize:h,lineHeight:"1.3rem",border:0,backgroundColor:"#222",textAlign:"center"},children:e.jsx(b,{onClick:()=>s("2024"),style:{color:n==="2024"?"#fff":"#ccc"},children:j})},"2024"),e.jsx(p,{style:{fontWeight:700,fontSize:h,lineHeight:"1.3rem",border:0,backgroundColor:"#222",textAlign:"center"},children:e.jsx(b,{onClick:()=>s("2025"),style:{color:n==="2025"?"#fff":"#ccc"},children:r})},"2025")]})]})}),e.jsx(I,{children:d.map((t,i)=>e.jsx(q,{charity:t},i))})]})})]}),e.jsx(K,{})]})}function Re(){D("RAFL Charities");const{isMobile:o}=v(),l=o?8:0,c={maxWidth:700,marginLeft:"auto",marginRight:"auto",paddingLeft:l,paddingRight:l},u=e.jsxs(y.Fragment,{children:[!o&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}}),e.jsx(V,{}),e.jsx(L,{})]});return e.jsx(W,{filterFields:B,children:e.jsx(_,{children:e.jsxs("div",{style:c,children:[e.jsx(A,{title:"RAFL Charities",extras:u}),e.jsx(O,{page:"charities"}),e.jsx(J,{}),e.jsx(w,{}),e.jsx(T,{feature:"raflCharities"})]})})})}export{Re as default};
