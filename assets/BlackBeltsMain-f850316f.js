import{p as v,r as k,Z as c,j as e,ab as B}from"./index-72e7306a.js";import{L as T}from"./LoadingDisplay-28b62020.js";import{u as D}from"./useData-e12d4eff.js";import{u as A}from"./usePageTitle-1b065431.js";import{u as w}from"./useWindowSize-3c55f33a.js";import{C as z,a as N,b as R,c as H,d as W,e as M,T as P}from"./TopLocks-142dec6f.js";import{f as I,l as U}from"./dataUrls-b6a2c15e.js";import{c as E,d as F,T as O,a as S,b as i,e as Y}from"./TableRow-5dd24ea2.js";import{L as b}from"./Link-8068ecf4.js";import"./LPU-c3fa7122.js";import"./LinearProgress-1de67eae.js";import"./useDocumentTitle-fa366117.js";import"./adminChartDefaults-3dea4302.js";import"./nivo-bar.es-94ee54c5.js";import"./nivo-legends.es-ae556041.js";import"./index-1ff88a51.js";import"./nivo-line.es-b2e68ead.js";const q=({tableData:o,collectionsData:d})=>{const p=v(),[l,m]=k.useState(""),x=o.map(t=>{const s=t.displayName?t.displayName:"No display name",y=`/profile/${t.userId}/scorecard`,j=o.filter(n=>n.tabClaimed===t.tabClaimed).length>1?"#f00":"#eee",h=d.firstSeen[t.userId];return{displayName:s,tabClaimed:t.tabClaimed,cellColor:j,scorecardLink:y,firstSeen:h}}),g=l==="name"?x.sort((t,s)=>t.displayName.localeCompare(s.displayName)):x.sort((t,s)=>c(t.firstSeen).valueOf()-c(s.firstSeen).valueOf()||t.displayName.localeCompare(s.displayName)),r={},f=k.useCallback(t=>{p(t)},[p]);return e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"1.3rem",margin:"10px"},children:o.title}),e.jsx(E,{id:"statsTable",style:{padding:"0px 0px 0px 4px",width:500,marginLeft:"auto",marginRight:"auto"},component:B,elevation:2,children:e.jsxs(F,{size:"small",children:[e.jsx(O,{children:e.jsxs(S,{children:[e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:"#"}),e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:e.jsx(b,{onClick:()=>m("name"),style:{color:"#d9d9ff"},children:"Display Name"})}),e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:"Claimed Tab"}),e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:e.jsx(b,{onClick:()=>m("date"),style:{color:"#d9d9ff"},children:"Acquired"})})]})}),e.jsx(Y,{children:g.map((t,s)=>e.jsxs(S,{index:s,sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":{backgroundColor:"#191919"},"td, th":{}},children:[e.jsx(i,{style:r,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0,color:t.cellColor},component:"th",scope:"row",children:s+1}),e.jsx(i,{style:r,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0,color:"#eee"},component:"th",scope:"row",children:e.jsx(b,{onClick:()=>{f(t.scorecardLink)},style:{color:"#99c2e5",cursor:"pointer"},children:t.displayName})}),e.jsx(i,{style:r,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0,color:t.cellColor},component:"th",scope:"row",children:t.tabClaimed}),e.jsx(i,{style:r,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0},component:"th",scope:"row",children:t.firstSeen})]},s))})]})})]})};function ce(){var h;A("Black Belts Report");const{data:o,loading:d,error:p}=D({urls:Z}),l=o==null?void 0:o.collectionsFullBB,m=(h=o==null?void 0:o.leaderboardData2)==null?void 0:h.blackBelts,x=d?"--":"(updated: "+c(o==null?void 0:o.leaderboardData2.metadata.updatedDateTime).format("MM/DD/YY hh:mm")+")",g=["listUsers","wishlistLocks","recordedLocks","pickedLocks","ownLocks"],r=l.dailyTableData.data.filter(n=>c(n.date).isAfter(c("2024-08-17"))),f=g.reduce((n,u)=>{if(!o)return{};const L=r.map(C=>({x:C.date,y:C[u]}));return n[u]={data:L,id:u},n},{}),{width:t}=w(),y=t<560?"8px 8px 32px 8px":"24px 24px 32px 24px",a={margin:"46px 0px 18px 0px",width:"100%",textAlign:"center",color:"#fff"},j={margin:"0px 0px 36px 0px",width:"100%",textAlign:"center",color:"#fff"};return d?e.jsx(T,{}):p?null:e.jsxs("div",{style:{minWidth:"320px",maxWidth:900,height:"100%",padding:y,backgroundColor:"#292929",marginLeft:"auto",marginRight:"auto",fontSize:"1.5rem",lineHeight:.8},children:[e.jsxs("div",{style:j,children:["Black Belt Report",e.jsx("br",{}),e.jsx("span",{style:{fontSize:"0.85rem"},children:x})]}),e.jsx(q,{tableData:m,collectionsData:l}),e.jsx("div",{style:a,children:"Collection Summary"}),e.jsx(z,{data:l}),e.jsx("div",{style:a,children:"List Users"}),e.jsx(N,{data:f}),e.jsx("div",{style:a,children:"List Locks by Date"}),e.jsx(R,{data:f}),e.jsx("div",{style:a,children:"Average Items Per List"}),e.jsx(H,{data:l}),e.jsx("div",{style:a,children:"List Saves by Belt Ranking"}),e.jsx(W,{data:l}),e.jsx("div",{style:a,children:"Last 28 Days"}),e.jsx(M,{data:l}),e.jsx("div",{style:a,children:"Top Locks"}),e.jsx(P,{data:l})]})}const Z={collectionsFullBB:I,leaderboardData2:U};export{ce as default};