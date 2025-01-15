import{b as z,r as d,j as t,u as F,d as H,R as A,N as P,F as $,T as B}from"./index-f4300893.js";import{D as M,a as Y,r as E}from"./filterFields-336f0cfb.js";import{R as G}from"./ReportButton-e9e9fe6d.js";import{R as I,A as O}from"./AdminRoleButton-94d560ee.js";import{R as V}from"./RaffleDataProvider-e5c14ff8.js";import{R as _}from"./RaffleHeader-6bafd9d9.js";import{L as q}from"./LoadingDisplay-22a34167.js";import{u as J}from"./useData-825fdf3a.js";import{u as K}from"./usePageTitle-606f5940.js";import{s as Q,f as U}from"./dataUrls-6cc1b85c.js";import{A as W,R as X,a as Z}from"./RaffleYOYLines-75733656.js";import{L as tt}from"./Link-964409de.js";import{R as et}from"./RaffleHiddenDialog-375eae61.js";import{R as st}from"./RaffleSubHead-e846bdc4.js";import"./index-8b242a3e.js";import"./LPU-c3fa7122.js";import"./LinearProgress-2e9fec55.js";import"./useDocumentTitle-6d5d8ba0.js";import"./TableRow-71afa06e.js";import"./nivo-line.es-a2223ffb.js";import"./nivo-legends.es-2e1c8b06.js";import"./index-f197e3f0.js";import"./adminChartDefaults-e02caa29.js";import"./Dialog-99b01736.js";const nt=({data:p,tableWidth:l,nameLength:f})=>{const u=z(),{potViewsById:r}=p,{getPotFromId:o}=d.useContext(M),g=[{id:"title",align:"left",name:"Title"},{id:"donors",name:"Donors",align:"center"},{id:"tickets",name:"Tickets",align:"center"}],j=!0,[a,R]=d.useState("title"),[S,y]=d.useState(!0),c=r.data.map(n=>{var C;const e=o(n.id);if(!e)return null;let m=e!=null&&e.title?e.title.substring(0,f):`unknown (${n.id})`;return m=((C=e==null?void 0:e.title)==null?void 0:C.length)<f||!(e!=null&&e.title)?m:m+"...",{...n,...e,title:m}}).filter(n=>n).sort((n,e)=>{switch(a){case"title":return n[a].localeCompare(e[a]);case"donors":return parseInt(e[a])-parseInt(n[a])||n.title.localeCompare(e.title);case"tickets":return parseInt(e[a])-parseInt(n[a])||n.views-e.views;default:return parseInt(e[a])-parseInt(n[a])||n.title.localeCompare(e.title)}}),x=(S?c:c.reverse()||[]).map(n=>n.donors&&n.donors>0?{...n}:{...n,donors:0,tickets:0}),D={columns:g,data:x},b=d.useCallback((n,e)=>{const m=c.find(L=>L.title===e),C=m==null?void 0:m.title.replace(/[\s/]/g,"_").replace(/\W/g,"");return n==="title"?t.jsx(tt,{onClick:()=>u(`/rafl/?id=${m.id}&name=${C}`),style:{color:"#fff"},children:e}):e},[u,c]),{width:h}=F(),k=h<=360,N=h<=395,T=h<=428,s=h<=560,i=h<=820,v=k||N?".8rem":T?".9rem":".95rem";return t.jsx("div",{children:t.jsx(W,{tableData:D,tableWidth:l,fontSize:v,sortable:j,sort:a,setSort:R,ascending:S,setAscending:y,linkFunction:b})})},at=({tableWidth:p,nameLength:l})=>{const{allCharities:f}=d.useContext(I),u=[{id:"displayName",align:"left",name:"Charity Name"},{id:"donors",name:"Donors",align:"center"},{id:"donations",name:"Raised",align:"center"}],r=!0,[o,g]=d.useState("name"),[j,a]=d.useState(!0),R=f.sort((s,i)=>{switch(o){case"name":return s.name.localeCompare(i.name);case"donors":return i[o]-s[o];case"donations":return i[o]-s[o];default:return s.name.localeCompare(i.name)}}),y=(j?R:R.reverse()).map(s=>{var v;let i=s!=null&&s.name?s==null?void 0:s.name.substring(0,l):"unknown";return i=((v=s==null?void 0:s.name)==null?void 0:v.length)<l?i:i+"...",s.donations&&s.donations>0?{...s,donations:`$${s.donations}`,displayName:i}:{...s,displayName:i}}),c={columns:u,data:y},w=d.useCallback((s,i)=>i,[]),{width:x}=F(),D=x<=360,b=x<=395,h=x<=428,k=x<=560,N=x<=820,T=D?".8rem":b?".85rem":h?".9rem":".95rem";return t.jsxs("div",{children:[t.jsx("div",{style:{justifyItems:"center",marginBottom:20},children:t.jsx("div",{style:{width:400}})}),t.jsx(W,{tableData:c,tableWidth:p,fontSize:T,sortable:r,sort:o,setSort:g,ascending:j,setAscending:a,linkFunction:w})]})};function it(){K("RAFL Report");const{data:p,loading:l,error:f}=J({urls:ot}),{siteFullNew:u,raflResponseDetails:r}=p||{},{width:o,isMobile:g}=F(),j=l?"--":"(updated: "+H(r==null?void 0:r.metadata.updatedDateTime).format("MM/DD/YY hh:mm")+")",a={margin:"26px 0px 18px 0px",width:"100%",textAlign:"center",color:"#fff",fontSize:"1.3rem",fontWeight:700},R={margin:"46px 0px 18px 0px",width:"100%",textAlign:"center",color:"#fff",fontSize:"1.3rem",fontWeight:700},S=g?"8px 8px 32px 8px":"24px 24px 32px 24px",y=o<=560?o-20:650,c=g?24:48;return l?t.jsx(q,{}):f?null:t.jsxs(A.Fragment,{children:[t.jsxs("div",{style:{minWidth:"320px",maxWidth:700,height:"100%",padding:S,backgroundColor:"#292929",marginLeft:"auto",marginRight:"auto"},children:[t.jsx(X,{}),t.jsx("div",{style:{width:"100%",textAlign:"center",color:"#fff"},children:t.jsx("span",{style:{fontSize:"0.8rem",marginTop:0},children:j})}),t.jsx(Z,{data:r==null?void 0:r.detailedData}),t.jsx("div",{style:a,children:"Pots"}),t.jsx(nt,{data:u,tableWidth:y,nameLength:c}),t.jsx("div",{style:R,children:"Charities"}),t.jsx(at,{data:u,tableWidth:y,nameLength:c})]}),t.jsx(et,{})]})}const ot={siteFullNew:Q,raflResponseDetails:U};function wt(){const{isMobile:p}=F(),{allPots:l}=d.useContext(I),f=t.jsxs(A.Fragment,{children:[!p&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}}),t.jsx(G,{active:!1}),t.jsx(O,{})]});return t.jsx(Y,{filterFields:E,children:t.jsx(V,{allEntries:l,children:t.jsxs(A.Fragment,{children:[t.jsx(P,{title:"RAFL Stats",extras:f}),t.jsx(_,{page:"stats"}),t.jsx(st,{text:"Stats!"}),t.jsx(it,{}),t.jsx($,{}),t.jsx(B,{feature:"raflStats"})]})})})}export{wt as default};
