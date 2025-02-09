import{b as L,r,d as h,j as e,an as T,u as w}from"./index-d9df6ac9.js";import{L as A}from"./LoadingDisplay-d3a0f9a9.js";import{u as z}from"./usePageTitle-eec0b67a.js";import{b as j,C as D,a as O,c as N,d as R,T as H}from"./TopLocks-3b5836a5.js";import{a as k}from"./ReportsContext-4c9ae621.js";import{c as P,d as W,T as M,a as u,b as i,e as q}from"./TableRow-4dd0fd15.js";import{L as m}from"./Link-5828f5aa.js";import"./LPU-c3fa7122.js";import"./LinearProgress-51d7a2f2.js";import"./useDocumentTitle-ed3efe32.js";import"./AdminStatsTable-f2f741af.js";import"./nivo-bar.es-e4bf791f.js";import"./nivo-legends.es-05ee4920.js";import"./index-61370078.js";import"./adminChartDefaults-e02caa29.js";import"./nivo-line.es-831d0f04.js";import"./dataUrls-2784c35e.js";import"./useData-0e91099d.js";const E=()=>{var x;const a=L(),[c,d]=r.useState(""),{data:t}=r.useContext(k),p=r.useMemo(()=>{var o;return Object.keys(((o=t==null?void 0:t.collectionStatsDaily)==null?void 0:o.blackBelts)||{}).map(l=>{var y,g,b;const S=(y=t==null?void 0:t.collectionStatsDaily)==null?void 0:y.blackBelts[l].displayName,B=`/profile/${l}/scorecard`,C=(g=t==null?void 0:t.collectionStatsDaily)==null?void 0:g.blackBelts[l].tabClaimed,v=(b=t==null?void 0:t.collectionStatsDaily)==null?void 0:b.blackBelts[l].acquired;return{userId:l,displayName:S,scorecardLink:B,tabClaimed:C,firstSeen:v}})},[(x=t==null?void 0:t.collectionStatsDaily)==null?void 0:x.blackBelts]),f=c==="name"?p.sort((o,l)=>o.displayName.localeCompare(l.displayName)):p.sort((o,l)=>h(o.firstSeen).valueOf()-h(l.firstSeen).valueOf()||o.displayName.localeCompare(l.displayName)),n={},s=r.useCallback(o=>{a(o)},[a]);return e.jsx("div",{children:e.jsx(P,{id:"statsTable",style:{padding:"0px 0px 0px 4px",width:700,marginLeft:"auto",marginRight:"auto"},component:T,elevation:2,children:e.jsxs(W,{size:"small",children:[e.jsx(M,{children:e.jsxs(u,{children:[e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:"#"}),e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:e.jsx(m,{onClick:()=>d("name"),style:{color:"#d9d9ff"},children:"Display Name"})}),e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:"Claimed Tab"}),e.jsx(i,{sx:{textAlign:"left",fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:e.jsx(m,{onClick:()=>d("date"),style:{color:"#d9d9ff"},children:"Acquired"})})]})}),e.jsx(q,{children:f.map((o,l)=>e.jsxs(u,{index:l,sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":{backgroundColor:"#191919"},"td, th":{}},children:[e.jsx(i,{style:n,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0},component:"th",scope:"row",children:l+1}),e.jsx(i,{style:n,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0,color:"#eee"},component:"th",scope:"row",children:e.jsx(m,{onClick:()=>{s(o.scorecardLink)},style:{color:"#99c2e5",cursor:"pointer"},children:o.displayName})}),e.jsx(i,{style:n,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0},component:"th",scope:"row",children:o.tabClaimed}),e.jsx(i,{style:n,sx:{textAlign:"left",fontSize:"0.9rem",padding:"8px",border:0},component:"th",scope:"row",children:o.firstSeen})]},l))})]})})})};function ie(){z("Black Belts Report");const{data:a,loading:c,error:d}=r.useContext(k),t=c?"--":"(updated: "+h(a.collectionsStatsCurrent.metadata.updatedDateTime).format("MM/DD/YY hh:mm")+" PST)",{width:p}=w(),n=p<560?"8px 8px 32px 8px":"24px 24px 32px 24px",s={margin:"46px 0px 18px 0px",width:"100%",textAlign:"center",color:"#fff"},x={margin:"0px 0px 36px 0px",width:"100%",textAlign:"center",color:"#fff"};return c?e.jsx(A,{}):d?null:e.jsxs("div",{style:{minWidth:"320px",maxWidth:900,height:"100%",padding:n,backgroundColor:"#292929",marginLeft:"auto",marginRight:"auto",fontSize:"1.5rem",lineHeight:.8},children:[e.jsxs("div",{style:x,children:["Black Belt Report",e.jsx("br",{}),e.jsx("span",{style:{fontSize:"0.85rem"},children:t})]}),e.jsx(E,{}),e.jsx("div",{style:s,children:"Collection Summary"}),e.jsx(j,{cohort:"blackBeltOnly"}),e.jsx("div",{style:s,children:"List Users"}),e.jsx(D,{cohort:"blackBeltOnly"}),e.jsx("div",{style:s,children:"List Details"}),e.jsx(j,{cohort:"blackBeltOnly"}),e.jsx("div",{style:s,children:"Average Items Per List"}),e.jsx(O,{cohort:"blackBeltOnly"}),e.jsx("div",{style:s,children:"List Saves by Belt Ranking"}),e.jsx(N,{cohort:"blackBeltOnly"}),e.jsx("div",{style:s,children:"Last 14 Days"}),e.jsx(R,{cohort:"blackBeltOnly"}),e.jsx("div",{style:s,children:"Top Locks"}),e.jsx(H,{cohort:"blackBeltOnly"})]})}export{ie as default};
