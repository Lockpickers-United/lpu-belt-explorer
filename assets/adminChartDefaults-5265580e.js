import{j as e,ab as x}from"./index-2ac54035.js";import{c as h,d as m,T as g,a as l,b as a,e as b}from"./TableRow-e94df2cb.js";const k=({tableData:t,tableWidth:d,fontSize:n})=>{const c={};return e.jsxs("div",{style:{},children:[t.title,e.jsx(h,{id:"dailyAverages",style:{padding:"0px 0px 0px 4px",width:d,marginLeft:"auto",marginRight:"auto"},component:x,elevation:2,children:e.jsxs(m,{size:"small",children:[e.jsx(g,{children:e.jsx(l,{children:t.columns.map((i,r)=>e.jsx(a,{sx:{textAlign:i.align,fontSize:n,lineHeight:"1.1rem",padding:"8px",color:"#fff"},component:"th",scope:"row",children:i.name},r+1))})}),e.jsx(b,{children:t.data.map((i,r)=>e.jsx(l,{index:r,sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":{backgroundColor:"#191919"},"td, th":{padding:"7px 1px",margin:"0px"}},children:t.columns.map((s,p)=>e.jsx(a,{style:c,sx:{textAlign:s.align,fontSize:n,whiteSpace:"nowrap",border:0,color:"#eee"},component:"th",scope:"row",children:i[s.id].toLocaleString()},p+1))},r))})]})})]})},y=["#d5d5d5","#d8d801","#ed7d01","#389700","#0090de","#634b9f","#9d5918","#ba0303","#1a1a1a","#373737"],o="#ccc",T={text:{color:o},grid:{line:{strokeWidth:1,stroke:"#555"}},tooltip:{container:{backgroundColor:"#222",color:"#ccc",fontSize:13}},axis:{domain:{line:{stroke:o,strokeWidth:1}},ticks:{line:{stroke:o,strokeWidth:1},text:{fill:o,color:o,fontSize:"0.83rem"}},grid:{line:{stroke:"#ccc",strokeWidth:1}},legend:{text:{fill:o,color:o}}}};export{k as A,y as b,T as p};
