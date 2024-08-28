import{p as S,r as C,Z as y,j as e,ab as v}from"./index-50bb9ea2.js";import{L as B}from"./LoadingDisplay-fa2d5ece.js";import{u as T}from"./useData-f13835e7.js";import{u as D}from"./usePageTitle-db0b5520.js";import{u as w}from"./useWindowSize-e151ab73.js";import{C as z,a as A,b as N,c as R,d as H,e as W,T as M}from"./TopLocks-2304ac4e.js";import{f as P,l as I}from"./dataUrls-b6a2c15e.js";import{c as U,d as E,T as F,a as k,b as i,e as O}from"./TableRow-62f01e6e.js";import{L as g}from"./Link-91c0d819.js";import"./LPU-c3fa7122.js";import"./LinearProgress-22f08b9c.js";import"./useDocumentTitle-e18543f4.js";import"./adminChartDefaults-9ddc2092.js";import"./nivo-bar.es-e15ca2f4.js";import"./nivo-legends.es-a37d9c25.js";import"./index-ed738ae4.js";import"./nivo-line.es-ec825cb3.js";const Y=({tableData:o,collectionsData:c})=>{const d=S(),[l,p]=C.useState(""),m=o.map(t=>{const s=t.displayName?t.displayName:"No display name",a=`/profile/${t.userId}/scorecard`,x=o.filter(n=>n.tabClaimed===t.tabClaimed).length>1?"#f00":"#eee",f=c.firstSeen[t.userId];return{displayName:s,tabClaimed:t.tabClaimed,cellColor:x,scorecardLink:a,firstSeen:f}}),j=l==="name"?m.sort((t,s)=>t.displayName.localeCompare(s.displayName)):m.sort((t,s)=>y(t.firstSeen).valueOf()-y(s.firstSeen).valueOf()||t.displayName.localeCompare(s.displayName)),r={},h=C.useCallback(t=>{d(t)},[d]);return e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"1.3rem",margin:"10px"},children:o.title}),e.jsx(U,{id:"statsTable",style:{padding:"0px 0px 0px 4px",width:500,marginLeft:"auto",marginRight:"auto"},component:v,elevation:2,children:e.jsxs(E,{size:"small",children:[e.jsx(F,{children:e.jsxs(k,{children:[e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:"#"}),e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:e.jsx(g,{onClick:()=>p("name"),style:{color:"#d9d9ff"},children:"Display Name"})}),e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:"Claimed Tab"}),e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:e.jsx(g,{onClick:()=>p("date"),style:{color:"#d9d9ff"},children:"Display Name"})})]})}),e.jsx(O,{children:j.map((t,s)=>e.jsxs(k,{index:s,sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":{backgroundColor:"#191919"},"td, th":{}},children:[e.jsx(i,{style:r,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0,color:t.cellColor},component:"th",scope:"row",children:s+1}),e.jsx(i,{style:r,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0,color:"#eee"},component:"th",scope:"row",children:e.jsx(g,{onClick:()=>{h(t.scorecardLink)},style:{color:"#99c2e5",cursor:"pointer"},children:t.displayName})}),e.jsx(i,{style:r,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0,color:t.cellColor},component:"th",scope:"row",children:t.tabClaimed}),e.jsx(i,{style:r,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0},component:"th",scope:"row",children:t.firstSeen})]},s))})]})})]})};function ne(){var x;D("Black Belts Report");const{data:o,loading:c,error:d}=T({urls:Z}),l=o==null?void 0:o.collectionsFullBB,p=(x=o==null?void 0:o.leaderboardData2)==null?void 0:x.blackBelts,m=c?"--":"(updated: "+y(o==null?void 0:o.leaderboardData2.metadata.updatedDateTime).format("MM/DD/YY hh:mm")+")",r=["listUsers","wishlistLocks","recordedLocks","pickedLocks","ownLocks"].reduce((f,n)=>{if(!o)return{};const L=l.dailyTableData.data.map(u=>({x:u.date,y:u[n]}));return f[n]={data:L,id:n},f},{}),{width:h}=w(),s=h<560?"8px 8px 32px 8px":"24px 24px 32px 24px",a={margin:"46px 0px 18px 0px",width:"100%",textAlign:"center",color:"#fff"},b={margin:"0px 0px 36px 0px",width:"100%",textAlign:"center",color:"#fff"};return c?e.jsx(B,{}):d?null:e.jsxs("div",{style:{minWidth:"320px",maxWidth:900,height:"100%",padding:s,backgroundColor:"#292929",marginLeft:"auto",marginRight:"auto",fontSize:"1.5rem",lineHeight:.8},children:[e.jsxs("div",{style:b,children:["Black Belt Report",e.jsx("br",{}),e.jsx("span",{style:{fontSize:"0.85rem"},children:m})]}),e.jsx(Y,{tableData:p,collectionsData:l}),e.jsx("div",{style:a,children:"Collection Summary"}),e.jsx(z,{data:l}),e.jsx("div",{style:a,children:"List Users"}),e.jsx(A,{data:r}),e.jsx("div",{style:a,children:"List Locks by Date"}),e.jsx(N,{data:r}),e.jsx("div",{style:a,children:"Average Items Per List"}),e.jsx(R,{data:l}),e.jsx("div",{style:a,children:"List Saves by Belt Ranking"}),e.jsx(H,{data:l}),e.jsx("div",{style:a,children:"Last 28 Days"}),e.jsx(W,{data:l}),e.jsx("div",{style:a,children:"Top Locks"}),e.jsx(M,{data:l})]})}const Z={collectionsFullBB:P,leaderboardData2:I};export{ne as default};
