import{K as g,M as m,j as r,r as j,al as I,I as q}from"./index-dc14f103.js";import{c as L,d as $,T as z,a as v,b as u,e as D}from"./TableRow-8964ad02.js";import{L as E}from"./Link-03346f93.js";var o={},H=m;Object.defineProperty(o,"__esModule",{value:!0});var y=o.default=void 0,M=H(g()),P=r;y=o.default=(0,M.default)((0,P.jsx)("path",{d:"m7 14 5-5 5 5z"}),"ArrowDropUp");var l={},B=m;Object.defineProperty(l,"__esModule",{value:!0});var w=l.default=void 0,O=B(g()),U=r;w=l.default=(0,O.default)((0,U.jsx)("path",{d:"m7 10 5 5 5-5z"}),"ArrowDropDown");const J=({tableData:i,tableWidth:_,tableHeight:p,fontSize:c,wrap:S,sortable:b,sort:t,setSort:h,ascending:d,setAscending:n,linkFunction:T})=>{const C=S?"inherit":"nowrap";i.columns.filter(e=>(e==null?void 0:e.id)&&(e==null?void 0:e.align));const[x,R]=j.useState(!1);i.columns.map(e=>(e==null?void 0:e.id)==="dateString"&&!x?R(!0):null),i.columns=x?i.columns.filter(e=>e.id!=="date"):i.columns;const f=j.useCallback(e=>{e!==t?(h(e),n(!0)):n(!d)},[d,n,h,t]),k=d?r.jsx(y,{}):r.jsx(w,{});return r.jsxs("div",{children:[r.jsx("div",{style:{fontSize:"1.3rem",margin:"10px"},children:i.title}),r.jsx(L,{id:"statsTable",style:{padding:"0px 0px 0px 4px",width:_,marginLeft:"auto",marginRight:"auto",height:p},component:I,elevation:2,children:r.jsxs($,{size:"small",stickyHeader:!!p,children:[r.jsx(z,{children:r.jsx(v,{children:i.columns.map((e,s)=>r.jsx(u,{sx:{textAlign:e.align,fontSize:c,lineHeight:"1.1rem",padding:"6px 2px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:b&&e.id!=="index"&&r.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.align==="center"?r.jsx("div",{style:{width:24}}):r.jsx("div",{style:{width:6}}),r.jsx(E,{onClick:()=>f(e.id),style:{color:t===e.id?"#fff":"#bbb"},children:r.jsx("nobr",{children:e.name})}),t===e.id?r.jsx(q,{onClick:()=>f(e.id),style:{padding:0},children:k}):r.jsx("div",{style:{width:24}})]})||r.jsx("div",{children:e.name})},s+1))})}),r.jsx(D,{children:i.data.map((e,s)=>r.jsx(v,{index:s,sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":{backgroundColor:"#191919"},"td, th":{}},children:i.columns.map((a,A)=>r.jsx(u,{sx:{textAlign:a.align,fontSize:c,whiteSpace:C,padding:"8px",border:0,color:"#eee"},component:"th",scope:"row",children:T(a.id,e[a.id]?e[a.id].toLocaleString():"")},A+1))},s))})]})})]})};export{J as A};
