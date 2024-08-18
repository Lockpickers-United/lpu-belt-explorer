import{p as C,r as L,j as e,aa as k,Z as v}from"./index-c20bd96b.js";import{L as B}from"./LoadingDisplay-e7a74286.js";import{u as T}from"./useData-509b6a4a.js";import{u as S}from"./usePageTitle-c61e03c6.js";import{u as D}from"./useWindowSize-a9ee710e.js";import{C as w,a as z,b as A,c as R,d as H,e as N,T as W}from"./TopLocks-99ffcefc.js";import{c as M,d as P,T as U,a as b,b as c,e as E,k as F,l as I}from"./dataUrls-2130ae50.js";import{L as Y}from"./Link-aad64ec7.js";import"./LPU-c3fa7122.js";import"./LinearProgress-2b8b832c.js";import"./useDocumentTitle-7e7306f3.js";import"./adminChartDefaults-69e74959.js";import"./nivo-bar.es-a1968e4b.js";import"./nivo-legends.es-b9ba815e.js";import"./index-38850789.js";import"./nivo-line.es-f8873336.js";const Z=({tableData:t})=>{const i=C(),r={},a=t.map(s=>{const l=s.displayName?s.displayName:"No display name",n=`/profile/${s.userId}/scorecard`,h=t.filter(p=>p.tabClaimed===s.tabClaimed).length>1?"#f00":"#eee";return{displayName:l,tabClaimed:s.tabClaimed,cellColor:h,scorecardLink:n}}),d=L.useCallback(s=>{i(s)},[i]);return e.jsxs("div",{children:[e.jsx("div",{style:{fontSize:"1.3rem",margin:"10px"},children:t.title}),e.jsx(M,{id:"statsTable",style:{padding:"0px 0px 0px 4px",width:500,marginLeft:"auto",marginRight:"auto"},component:k,elevation:2,children:e.jsxs(P,{size:"small",children:[e.jsx(U,{children:e.jsxs(b,{children:[e.jsx(c,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:"Display Name"}),e.jsx(c,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:"Claimed Tab"})]})}),e.jsx(E,{children:a.map((s,l)=>e.jsxs(b,{index:l,sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":{backgroundColor:"#191919"},"td, th":{}},children:[e.jsx(c,{style:r,sx:{textAlign:"left",fontSize:"1rem",padding:"8px",border:0,color:"#eee"},component:"th",scope:"row",children:e.jsx(Y,{onClick:()=>{d(s.scorecardLink)},style:{color:"#99c2e5",cursor:"pointer"},children:s.displayName})}),e.jsx(c,{style:r,sx:{textAlign:"left",fontSize:"1rem",padding:"8px",border:0,color:s.cellColor},component:"th",scope:"row",children:s.tabClaimed})]},l))})]})})]})};function re(){var f;S("Black Belts Report");const{data:t,loading:i,error:r}=T({urls:$}),a=t==null?void 0:t.collectionsFullBB,d=(f=t==null?void 0:t.leaderboardData2)==null?void 0:f.blackBelts,s=i?"--":"(updated: "+v(t==null?void 0:t.leaderboardData2.metadata.updatedDateTime).format("MM/DD/YY hh:mm")+")",n=["listUsers","wishlistLocks","recordedLocks","pickedLocks","ownLocks"].reduce((g,m)=>{if(!t)return{};const u=a.dailyTableData.data.map(y=>({x:y.date,y:y[m]}));return g[m]={data:u,id:m},g},{}),{width:x}=D(),p=x<560?"8px 8px 32px 8px":"24px 24px 32px 24px",o={margin:"46px 0px 18px 0px",width:"100%",textAlign:"center",color:"#fff"},j={margin:"0px 0px 36px 0px",width:"100%",textAlign:"center",color:"#fff"};return i?e.jsx(B,{}):r?null:e.jsxs("div",{style:{minWidth:"320px",maxWidth:900,height:"100%",padding:p,backgroundColor:"#292929",marginLeft:"auto",marginRight:"auto",fontSize:"1.5rem",lineHeight:.8},children:[e.jsxs("div",{style:j,children:["Black Belt Report",e.jsx("br",{}),e.jsx("span",{style:{fontSize:"0.85rem"},children:s})]}),e.jsx(Z,{tableData:d}),e.jsx("div",{style:o,children:"Collection Summary"}),e.jsx(w,{data:a}),e.jsx("div",{style:o,children:"List Users"}),e.jsx(z,{data:n}),e.jsx("div",{style:o,children:"List Locks by Date"}),e.jsx(A,{data:n}),e.jsx("div",{style:o,children:"Average Items Per List"}),e.jsx(R,{data:a}),e.jsx("div",{style:o,children:"List Saves by Belt Ranking"}),e.jsx(H,{data:a}),e.jsx("div",{style:o,children:"Last 28 Days"}),e.jsx(N,{data:a}),e.jsx("div",{style:o,children:"Top Locks"}),e.jsx(W,{data:a})]})}const $={collectionsFullBB:F,leaderboardData2:I};export{re as default};