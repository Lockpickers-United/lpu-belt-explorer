import{b as B,r as k,d,j as e,al as v,u as T}from"./index-dc14f103.js";import{L as A}from"./LoadingDisplay-fa47da32.js";import{u as w}from"./useData-e1a1f96e.js";import{u as z}from"./usePageTitle-1b94cf72.js";import{C as D,a as N,b as H,c as R,d as W,e as M,T as P}from"./TopLocks-048d0ccb.js";import{c as I,l as U}from"./dataUrls-02b67476.js";import{c as E,d as F,T as O,a as S,b as i,e as Y}from"./TableRow-8964ad02.js";import{L as b}from"./Link-03346f93.js";import"./LPU-c3fa7122.js";import"./LinearProgress-29f795c8.js";import"./useDocumentTitle-b206a98a.js";import"./AdminStatsTable-c71e1ed3.js";import"./nivo-bar.es-6e8c4baa.js";import"./nivo-legends.es-a3c5b60c.js";import"./index-762ced6f.js";import"./adminChartDefaults-e02caa29.js";import"./nivo-line.es-8a965140.js";const q=({tableData:s,collectionsData:c})=>{const p=B(),[o,m]=k.useState(""),x=s.map(t=>{const l=t.displayName?t.displayName:"No display name",y=`/profile/${t.userId}/scorecard`,j=s.filter(n=>n.tabClaimed===t.tabClaimed).length>1?"#f00":"#eee",h=c.firstSeen[t.userId];return{displayName:l,tabClaimed:t.tabClaimed,cellColor:j,scorecardLink:y,firstSeen:h}}),g=o==="name"?x.sort((t,l)=>t.displayName.localeCompare(l.displayName)):x.sort((t,l)=>d(t.firstSeen).valueOf()-d(l.firstSeen).valueOf()||t.displayName.localeCompare(l.displayName)),r={},f=k.useCallback(t=>{p(t)},[p]);return e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"1.3rem",margin:"10px"},children:s.title}),e.jsx(E,{id:"statsTable",style:{padding:"0px 0px 0px 4px",width:700,marginLeft:"auto",marginRight:"auto"},component:v,elevation:2,children:e.jsxs(F,{size:"small",children:[e.jsx(O,{children:e.jsxs(S,{children:[e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:"#"}),e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:e.jsx(b,{onClick:()=>m("name"),style:{color:"#d9d9ff"},children:"Display Name"})}),e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:"Claimed Tab"}),e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:e.jsx(b,{onClick:()=>m("date"),style:{color:"#d9d9ff"},children:"Acquired"})})]})}),e.jsx(Y,{children:g.map((t,l)=>e.jsxs(S,{index:l,sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":{backgroundColor:"#191919"},"td, th":{}},children:[e.jsx(i,{style:r,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0,color:t.cellColor},component:"th",scope:"row",children:l+1}),e.jsx(i,{style:r,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0,color:"#eee"},component:"th",scope:"row",children:e.jsx(b,{onClick:()=>{f(t.scorecardLink)},style:{color:"#99c2e5",cursor:"pointer"},children:t.displayName})}),e.jsx(i,{style:r,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0,color:t.cellColor},component:"th",scope:"row",children:t.tabClaimed}),e.jsx(i,{style:r,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0},component:"th",scope:"row",children:t.firstSeen})]},l))})]})})]})};function de(){var h;z("Black Belts Report");const{data:s,loading:c,error:p}=w({urls:$}),o=s==null?void 0:s.collectionsFullBB,m=(h=s==null?void 0:s.leaderboardData2)==null?void 0:h.blackBelts,x=c?"--":"(updated: "+d(s==null?void 0:s.leaderboardData2.metadata.updatedDateTime).format("MM/DD/YY hh:mm")+")",g=["listUsers","wishlistLocks","scorecardLocks","pickedLocks","ownLocks"],r=o==null?void 0:o.dailyTableData.data.filter(n=>d(n.date).isAfter(d("2024-08-17"))),f=g.reduce((n,u)=>{if(!s)return{};const L=r.map(C=>({x:C.date,y:C[u]}));return n[u]={data:L,id:u},n},{}),{width:t}=T(),y=t<560?"8px 8px 32px 8px":"24px 24px 32px 24px",a={margin:"46px 0px 18px 0px",width:"100%",textAlign:"center",color:"#fff"},j={margin:"0px 0px 36px 0px",width:"100%",textAlign:"center",color:"#fff"};return c?e.jsx(A,{}):p?null:e.jsxs("div",{style:{minWidth:"320px",maxWidth:900,height:"100%",padding:y,backgroundColor:"#292929",marginLeft:"auto",marginRight:"auto",fontSize:"1.5rem",lineHeight:.8},children:[e.jsxs("div",{style:j,children:["Black Belt Report",e.jsx("br",{}),e.jsx("span",{style:{fontSize:"0.85rem"},children:x})]}),e.jsx(q,{tableData:m,collectionsData:o}),e.jsx("div",{style:a,children:"Collection Summary"}),e.jsx(D,{data:o}),e.jsx("div",{style:a,children:"List Users"}),e.jsx(N,{data:f}),e.jsx("div",{style:a,children:"List Locks by Date"}),e.jsx(H,{data:f}),e.jsx("div",{style:a,children:"Average Items Per List"}),e.jsx(R,{data:o}),e.jsx("div",{style:a,children:"List Saves by Belt Ranking"}),e.jsx(W,{data:o}),e.jsx("div",{style:a,children:"Last 28 Days"}),e.jsx(M,{data:o}),e.jsx("div",{style:a,children:"Top Locks"}),e.jsx(P,{data:o})]})}const $={collectionsFullBB:I,leaderboardData2:U};export{de as default};
