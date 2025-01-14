import{r as l,j as e,u as R,R as C,N as F,F as z,T}from"./index-ef57ba35.js";import{F as W,f as L,D as A,a as N,r as B}from"./filterFields-7bab582c.js";import{u as D}from"./usePageTitle-ebc0d91d.js";import{r as H}from"./index-0bc0c833.js";import{R as S,A as M}from"./AdminRoleButton-6763ca47.js";import{N as P}from"./ViewFilterButtons-554f4fb0.js";import{L as j}from"./Link-830fe752.js";import{a as k,b as g,c as E,d as I,T as U,e as G}from"./TableRow-a90aa2b9.js";import{R as _}from"./RaffleSearchBar-c3780934.js";import{R as K}from"./RaffleHiddenDialog-e8d637ce.js";import{R as O}from"./RaffleHeader-f3127ee6.js";import{R as V}from"./ReportButton-19c17044.js";import"./useDocumentTitle-442ea82f.js";import"./useData-aa8d7f79.js";import"./dataUrls-6cc1b85c.js";import"./LockListContext-0292bf6e.js";import"./entryName-02b0a665.js";import"./Badge-53ff6400.js";import"./Chip-962d105b.js";import"./Select-d6cb1e34.js";import"./SearchBox-69801cb2.js";import"./Box-09c956a2.js";import"./Search-0f0081f8.js";import"./TextField-ff664d8f.js";import"./ToggleButtonGroup-d9238bda.js";import"./Dialog-7dc2c580.js";function $({children:t}){const{filters:i}=l.useContext(W),{search:c,id:p,tab:f,name:a,sort:o,image:u,...d}=i,{allCharities:m}=l.useContext(S),x=l.useMemo(()=>{const b=Object.keys(d).map(r=>{const s=d[r];return Array.isArray(s)?s.map(n=>({key:r,value:n})):{key:r,value:s}}).flat(),y=m.filter(r=>b.every(({key:s,value:n})=>Array.isArray(r[s])?r[s].includes(n):r[s]===n)).sort((r,s)=>r.fuzzy.localeCompare(s.fuzzy)),v=c?L.go(H(c),y,{keys:q,threshold:-25e3}).map(r=>({...r.obj,score:r.score})):y;return o?v.sort((r,s)=>o==="potName"?r.title.localeCompare(s.title):o==="contributedBy"?r.contributedBy[0].localeCompare(s.contributedBy[0]):r.potNumber<s.potNumber):v},[m,d,c,o]),w=l.useMemo(()=>({allCharities:m,visibleEntries:x}),[m,x]);return e.jsx(A.Provider,{value:w,children:t})}const q=["fuzzy"];function J({charity:t}){const{isMobile:i}=R(),{raflState:c,raffleAdminRole:p}=l.useContext(S),f=["live","post"].includes(c)||p,a=l.useCallback(m=>{const x=window.open(m,"_blank","noopener,noreferrer");x&&(x.opener=null)},[]),o=t.url?e.jsx(j,{onClick:()=>a(t.url),style:{color:"#fff",fontWeight:500},children:t.name}):e.jsx("span",{style:{color:"#ddd"},children:t.name}),u=i?"0.95rem":"1.0rem",d=i?{fontSize:u,border:0,padding:"6px 10px"}:{fontSize:u,border:0,padding:"8px 16px"};return e.jsxs(k,{sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":{backgroundColor:"#191919"},"td, th":{}},children:[e.jsx(g,{align:"left",style:d,children:o}),f&&e.jsxs(C.Fragment,{children:[e.jsx(g,{align:"center",style:d,children:t.donations2024>0&&new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumSignificantDigits:3}).format(t.donations2024)}),e.jsx(g,{align:"center",style:d,children:t.donations>0&&new Intl.NumberFormat("en-US",{style:"currency",currency:"USD",maximumSignificantDigits:3}).format(t.donations)})]})]})}function Q({charities:t}){const{isMobile:i}=R(),c=i?{maxWidth:700,marginLeft:"auto",marginRight:"auto",padding:8}:{maxWidth:700,marginLeft:"auto",marginRight:"auto",padding:12},p=t?{borderBottom:"1px #555 solid"}:{},f=l.useCallback(a=>{const o=window.open(a,"_blank","noopener,noreferrer");o&&(o.opener=null)},[]);return e.jsxs(C.Fragment,{children:[e.jsxs("div",{style:{...c,backgroundColor:"#333",minHeight:72,...p},children:[e.jsx("div",{style:{display:"flex",flexGrow:1,marginLeft:8,fontWeight:700,fontSize:"1.1rem"},children:"Los Angeles Wildfires"}),e.jsx("div",{style:{margin:"12px 20px 0px 8px"},children:"In light of the devastating wildfires in Los Angeles, we have added a number of California-based charities to our list of options. These vetted organizations are providing support to victims of the fires, their families, and the first-responders who are battling the blazes."})]}),e.jsx("div",{style:{padding:"16px 0px 0px 0px",backgroundColor:"#000"}}),t&&t.map(a=>e.jsx("div",{style:{margin:"0px 0px 0px 0px",padding:"3px 0px 2px 20px",backgroundColor:"#000"},children:a.url?e.jsx(j,{onClick:()=>f(a.url),style:{color:"#fff",fontWeight:500},children:a.name}):e.jsx("span",{style:{color:"#ddd"},children:a.name})},a.name)),e.jsx("div",{style:{padding:"24px 0px 0px 0px",backgroundColor:"#000"}})]})}function X(){const{visibleEntries:t}=l.useContext(A),{raflState:i,raffleAdminRole:c}=l.useContext(S),p=["live","post"].includes(i)||c,{isMobile:f}=R(),a=l.useRef(),[o,u]=l.useState("name"),d=l.useCallback(n=>{n!==o&&u(n)},[u,o]),m=t.sort((n,h)=>{switch(o){case"2024":return h.donations2024-n.donations2024;case"2025":return h.donations-n.donations;case"name":return n.name.localeCompare(h.name);default:return n.name.localeCompare(h.name)}}),x=m.filter(n=>n.tags.includes("Los Angeles Wildfires")),w={maxWidth:700,marginLeft:"auto",marginRight:"auto"},b=f?"0.9rem":"1.0rem",y=f?"10px 10px":"16px 16px",v=i==="live"?"Currently":"Contributions",r=f?"2024":"2024 Contributions",s=f?"2025":`2025 ${v}`;return e.jsxs(C.Fragment,{children:[e.jsxs("div",{style:{paddingBottom:32},children:[e.jsx(Q,{charities:x}),e.jsx(_,{label:"All Approved Charities",sortValues:null}),t.length===0&&e.jsx(P,{label:"Charities"}),t.length>0&&e.jsx(E,{sx:{height:"100%",backgroundColor:"#111"},id:"scrollable",ref:a,children:e.jsxs(I,{stickyHeader:!0,style:w,children:[e.jsx(U,{children:e.jsxs(k,{children:[e.jsx(g,{style:{fontWeight:700,fontSize:b,lineHeight:"1.3rem",border:0,backgroundColor:"#222",padding:y},children:e.jsx(j,{onClick:()=>d("name"),style:{color:o==="name"?"#fff":"#ccc"},children:"Charity Name"})},"Charity Name"),p&&e.jsxs(C.Fragment,{children:[e.jsx(g,{style:{fontWeight:700,fontSize:b,lineHeight:"1.3rem",border:0,backgroundColor:"#222",textAlign:"center"},children:e.jsx(j,{onClick:()=>d("2024"),style:{color:o==="2024"?"#fff":"#ccc"},children:r})},"2024"),e.jsx(g,{style:{fontWeight:700,fontSize:b,lineHeight:"1.3rem",border:0,backgroundColor:"#222",textAlign:"center"},children:e.jsx(j,{onClick:()=>d("2025"),style:{color:o==="2025"?"#fff":"#ccc"},children:s})},"2025")]})]})}),e.jsx(G,{children:m.map((n,h)=>e.jsx(J,{charity:n},h))})]})})]}),e.jsx(K,{})]})}function we(){D("RAFL Charities");const{isMobile:t}=R(),i=t?8:0,c={maxWidth:700,marginLeft:"auto",marginRight:"auto",paddingLeft:i,paddingRight:i},p=e.jsxs(C.Fragment,{children:[!t&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}}),e.jsx(V,{}),e.jsx(M,{})]});return e.jsx(N,{filterFields:B,children:e.jsx($,{children:e.jsxs("div",{style:c,children:[e.jsx(F,{title:"RAFL Charities",extras:p}),e.jsx(O,{page:"charities"}),e.jsx(X,{}),e.jsx(z,{}),e.jsx(T,{feature:"raflCharities"})]})})})}export{we as default};
