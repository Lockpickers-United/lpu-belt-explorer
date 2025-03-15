import{u as T,a2 as L,r as a,ag as P,d,ah as y,j as e,R as v,N as W,F as B}from"./index-bbf4fd2d.js";import{u as M}from"./usePageTitle-4ba1c1bd.js";import{L as R}from"./LeaderboardName-14a8b7bf.js";import{c as Y,d as w,T as z,a as C,b as i,e as A}from"./TableRow-0ec16692.js";import{L as E}from"./Link-7b400855.js";import{u as F}from"./useData-686e2a26.js";import{L as O}from"./LoadingDisplay-7eae6afc.js";import"./useDocumentTitle-b7c18029.js";import"./Box-30a24ec4.js";import"./CircularProgress-4d29f0e8.js";function U({projects:o,updated:p}){const{isMobile:m}=T(),[n,x]=L(),r=n.get("sort"),c=r&&r.includes("ev"),[f,u]=a.useState(!1),[l,g]=a.useState(!1),h=a.useCallback(t=>()=>{r&&t!==r?(n.set("sort",t),u(c?f:!1),g(c?!1:l)):r&&t===r?(u(c?f:!f),g(c?!l:l)):t==="date"?(n.set("sort",t),u(!0)):t==="evDate"?(n.set("sort",t),g(!0)):n.set("sort",t),x(n)},[c,l,f,n,x,r]),j=a.useMemo(()=>o.length>1&&r?o.sort((t,s)=>{if(r==="evName")return(t.displayName||"").localeCompare(s.displayName||"");if(r==="evLock")return t.evidenceName.localeCompare(s.evidenceName)||t.displayName.localeCompare(s.displayName);if(r==="evBelt")return P(t.belt.replace(" Belt",""),s.belt.replace(" Belt",""))||t.displayName.localeCompare(s.displayName);if(r==="evDate")return d(s.date).valueOf()-d(t.date).valueOf()}):o.sort((t,s)=>d(s.date).valueOf()-d(t.date).valueOf()),[r,o,l]),k=a.useMemo(()=>l?j.reverse():j,[j,l]),b=m?"auto":"170px",S=m?16:20,N=a.useCallback(t=>{const s=t.replace(" Belt","");return y[s]?y[s].color:t.includes("Dan")?"#769e49":"#b00"},[]),D=a.useCallback(t=>{const s=window.open(t,"_blank","noopener,noreferrer");s&&(s.opener=null)},[]);return e.jsx(v.Fragment,{children:e.jsxs("div",{style:{justifyItems:"center",marginTop:40},children:[e.jsxs("div",{style:{fontWeight:700,fontSize:"1.2rem",width:"100%",textAlign:"center",margin:"20px 0px"},children:["Recent Projects",e.jsxs("div",{style:{fontWeight:400,fontSize:"0.9rem",width:"100%",textAlign:"center",margin:"0px 0px"},children:["Through ",d(p).format("MMM DD, YYYY")]})]}),e.jsx(Y,{sx:{backgroundColor:"#111",maxWidth:650},children:e.jsxs(w,{sx:{minWidth:360,align:"left"},children:[e.jsx(z,{children:e.jsxs(C,{children:[e.jsx(i,{align:"left",style:{fontWeight:700,fontSize:"1.0rem",border:0,padding:"4px 0px 4px 16px",backgroundColor:"#222",width:b},children:e.jsx("span",{style:r==="evName"?{}:{cursor:"pointer",color:"#ccc"},onClick:h("evName"),children:"User"})}),e.jsxs(i,{align:"left",colSpan:2,style:{fontWeight:700,fontSize:"1.0rem",border:0,padding:"0px 0px 0px 4px",backgroundColor:"#222"},children:[e.jsx("span",{style:r==="evLock"?{}:{cursor:"pointer",color:"#ccc"},onClick:h("evLock"),children:"Project"}),e.jsx("span",{style:r==="evBelt"?{}:{cursor:"pointer",color:"#ccc"},onClick:h("evBelt"),children:" (Tier)"})]}),e.jsx(i,{align:"center",style:{fontWeight:700,fontSize:"1.0rem",border:0,padding:0,backgroundColor:"#222"},children:e.jsx("span",{style:!c||r==="evDate"?{}:{cursor:"pointer",color:"#ccc"},onClick:h("evDate"),children:"Date"})})]})}),e.jsx(A,{children:k.map((t,s)=>e.jsxs(C,{sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":{backgroundColor:"#000"},"td, th":{padding:"6px 2px",border:0}},children:[e.jsx(i,{align:"left",style:{padding:"0px 0px 0px 16px"},children:e.jsx("span",{style:{fontWeight:500,width:b},children:e.jsx(R,{leader:t,isCurrentUser:t.isCurrentUser,tab:"blackBelts",maxLength:S})})}),e.jsx(i,{align:"left",style:{backgroundColor:N(t.belt),borderBottom:"1px solid #333",width:4,marginLeft:5}}),e.jsx(i,{align:"left",children:e.jsx("div",{style:{fontWeight:500,marginLeft:5},children:e.jsx(E,{onClick:()=>D(t.evidenceUrl),style:{color:"#fff"},children:t.evidenceName})})}),e.jsx(i,{align:"center",children:e.jsx("nobr",{children:d(t.date).format("MMM DD, YYYY")})})]},s))})]})})]})})}function $(){var r;M("All Projects");const{data:o,loading:p,error:m}=F({url:I}),n=o?o==null?void 0:o.evidence:[],x=e.jsx(v.Fragment,{});return e.jsxs(v.Fragment,{children:[e.jsx(W,{title:"All Projects",extras:x}),(p||m)&&e.jsx(O,{}),!p&&n.length>0&&e.jsx(U,{projects:n,updated:(r=o==null?void 0:o.metadata)==null?void 0:r.updatedDateTime}),e.jsx(B,{})]})}const I="https://explore.lpubelts.com/data/allProjects.json";export{$ as default};
