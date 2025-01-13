import{b as L,r as n,d as h,j as e,ak as T,u as w}from"./index-96a4be6e.js";import{L as A}from"./LoadingDisplay-7846151a.js";import{u as z}from"./usePageTitle-42087d6c.js";import{b as j,C as D,a as O,c as N,d as R,T as H}from"./TopLocks-54cf0376.js";import{a as k}from"./ReportsContext-1804d7fc.js";import{c as P,d as W,T as M,a as u,b as i,e as q}from"./TableRow-23d37e00.js";import{L as m}from"./Link-6e2886df.js";import"./LPU-c3fa7122.js";import"./LinearProgress-27774f31.js";import"./useDocumentTitle-29dcb0f1.js";import"./AdminStatsTable-d5b1ec7d.js";import"./nivo-bar.es-1e43b511.js";import"./nivo-legends.es-81d20e44.js";import"./index-4cff18fc.js";import"./adminChartDefaults-e02caa29.js";import"./nivo-line.es-3b0a0574.js";import"./dataUrls-6cc1b85c.js";import"./useData-89a5a4dc.js";const E=()=>{var x;const a=L(),[c,d]=n.useState(""),{data:t}=n.useContext(k),p=n.useMemo(()=>{var o;return Object.keys(((o=t==null?void 0:t.collectionStatsDaily)==null?void 0:o.blackBelts)||{}).map(l=>{var y,g,b;const S=(y=t==null?void 0:t.collectionStatsDaily)==null?void 0:y.blackBelts[l].displayName,B=`/profile/${l}/scorecard`,C=(g=t==null?void 0:t.collectionStatsDaily)==null?void 0:g.blackBelts[l].tabClaimed,v=(b=t==null?void 0:t.collectionStatsDaily)==null?void 0:b.blackBelts[l].acquired;return{userId:l,displayName:S,scorecardLink:B,tabClaimed:C,firstSeen:v}})},[(x=t==null?void 0:t.collectionStatsDaily)==null?void 0:x.blackBelts]),f=c==="name"?p.sort((o,l)=>o.displayName.localeCompare(l.displayName)):p.sort((o,l)=>h(o.firstSeen).valueOf()-h(l.firstSeen).valueOf()||o.displayName.localeCompare(l.displayName)),r={},s=n.useCallback(o=>{a(o)},[a]);return e.jsx("div",{children:e.jsx(P,{id:"statsTable",style:{padding:"0px 0px 0px 4px",width:700,marginLeft:"auto",marginRight:"auto"},component:T,elevation:2,children:e.jsxs(W,{size:"small",children:[e.jsx(M,{children:e.jsxs(u,{children:[e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:"#"}),e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:e.jsx(m,{onClick:()=>d("name"),style:{color:"#d9d9ff"},children:"Display Name"})}),e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:"Claimed Tab"}),e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:e.jsx(m,{onClick:()=>d("date"),style:{color:"#d9d9ff"},children:"Acquired"})})]})}),e.jsx(q,{children:f.map((o,l)=>e.jsxs(u,{index:l,sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":{backgroundColor:"#191919"},"td, th":{}},children:[e.jsx(i,{style:r,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0},component:"th",scope:"row",children:l+1}),e.jsx(i,{style:r,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0,color:"#eee"},component:"th",scope:"row",children:e.jsx(m,{onClick:()=>{s(o.scorecardLink)},style:{color:"#99c2e5",cursor:"pointer"},children:o.displayName})}),e.jsx(i,{style:r,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0},component:"th",scope:"row",children:o.tabClaimed}),e.jsx(i,{style:r,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0},component:"th",scope:"row",children:o.firstSeen})]},l))})]})})})};function ie(){z("Black Belts Report");const{data:a,loading:c,error:d}=n.useContext(k),t=c?"--":"(updated: "+h(a.collectionsStatsCurrent.metadata.updatedDateTime).format("MM/DD/YY hh:mm")+" PST)",{width:p}=w(),r=p<560?"8px 8px 32px 8px":"24px 24px 32px 24px",s={margin:"46px 0px 18px 0px",width:"100%",textAlign:"center",color:"#fff"},x={margin:"0px 0px 36px 0px",width:"100%",textAlign:"center",color:"#fff"};return c?e.jsx(A,{}):d?null:e.jsxs("div",{style:{minWidth:"320px",maxWidth:900,height:"100%",padding:r,backgroundColor:"#292929",marginLeft:"auto",marginRight:"auto",fontSize:"1.5rem",lineHeight:.8},children:[e.jsxs("div",{style:x,children:["Black Belt Report",e.jsx("br",{}),e.jsx("span",{style:{fontSize:"0.85rem"},children:t})]}),e.jsx(E,{}),e.jsx("div",{style:s,children:"Collection Summary"}),e.jsx(j,{cohort:"blackBeltOnly"}),e.jsx("div",{style:s,children:"List Users"}),e.jsx(D,{cohort:"blackBeltOnly"}),e.jsx("div",{style:s,children:"List Details"}),e.jsx(j,{cohort:"blackBeltOnly"}),e.jsx("div",{style:s,children:"Average Items Per List"}),e.jsx(O,{cohort:"blackBeltOnly"}),e.jsx("div",{style:s,children:"List Saves by Belt Ranking"}),e.jsx(N,{cohort:"blackBeltOnly"}),e.jsx("div",{style:s,children:"Last 14 Days"}),e.jsx(R,{cohort:"blackBeltOnly"}),e.jsx("div",{style:s,children:"Top Locks"}),e.jsx(H,{cohort:"blackBeltOnly"})]})}export{ie as default};
