import{d as T,u as v,j as t,R as F,b as H,r as h,A as I,D as E,N as O,F as Y,T as $}from"./index-5b61f6bf.js";import{D as G,a as X,b as N}from"./filterFields-9cd26100.js";import{L as _}from"./LoadingDisplay-bfb15657.js";import{u as q}from"./useData-fe18848f.js";import{u as J}from"./usePageTitle-bb270e9e.js";import{s as K}from"./dataUrls-02b67476.js";import"./LockViewsLine-ec4fe73c.js";import{P as Q}from"./nivo-line.es-b7d081d1.js";import{p as U}from"./adminChartDefaults-e02caa29.js";import{A as Z}from"./AdminStatsTable-9ec4a16a.js";import{a as L}from"./RaffleContext-c4acfbea.js";import{A as tt}from"./AdminStatsTableSort-2f1fcf61.js";import{R as et}from"./RaffleAutocompleteBox-c3ef195a.js";import{L as at}from"./Link-f764945d.js";import{R as it,A as st}from"./AdminRoleButton-ebd48e23.js";import{R as ot}from"./RaffleDataProvider-a780698f.js";import{r as nt}from"./rafl-7eb14271.js";import"./LPU-c3fa7122.js";import"./LinearProgress-2d38f15d.js";import"./useDocumentTitle-3bbc9372.js";import"./chartDefaults-9fc07b21.js";import"./nivo-legends.es-764b1390.js";import"./index-54fd7d09.js";import"./TableRow-f30b1f7a.js";import"./Search-3f3d8f0a.js";import"./Autocomplete-205271a0.js";import"./Select-b38978e9.js";import"./Chip-37fc803a.js";import"./TextField-c5ce3f5e.js";const rt=({lineData:m})=>{const r=[m.rafl28days.data],o=[],e=new Map,c=new Map,d=new Map;r.forEach(i=>{const u=[],p=[],A=[];for(let j=0;j<i.length;j++){const x=i[j].date;if(T(x)<T("2024-11-25"))continue;const k=new Map;k.x=x,k.y=i[j].potListViews,u.push(k);const D=new Map;D.x=x,D.y=i[j].potViews,p.push(D);const P=new Map;P.x=x,P.y=i[j].raflForm,A.push(P)}e.id="Pot List",e.data=u,c.id="Pot Views",c.data=p,d.id="Entry Form",d.data=A,o.push(c),o.push(e),o.push(d)});const{width:n}=v(),a=n<=360,f=n<=395,w=n<=428,b=n<=560,g=n<=820,R=a||f?200:w?210:g?230:350,y=b?{top:10,right:20,bottom:50,left:50}:{top:10,right:20,bottom:70,left:50};return t.jsx("div",{style:{height:R,width:"100%"},children:t.jsx(Q,{theme:U,data:o,enableGridX:!1,enableGridY:!0,colors:["#5265ed","#082fd1","#4fa720"],lineWidth:3,margin:y,height:R,curve:"natural",yScale:{type:"linear",min:0,max:"auto",stacked:!1,reverse:!1},yFormat:" >-.2f",axisLeft:{tickValues:5,tickSize:5,tickPadding:5,tickRotation:0,format:","},xScale:{type:"time",format:"%Y-%m-%d"},xFormat:"time:%m/%d/%y",axisBottom:{format:"%b %d",tickSize:5,tickPadding:5,tickRotation:-45,direction:"row",legendOffset:-12,tickValues:"every day"},legends:[{anchor:"bottom",itemTextColor:"#bbb",direction:"row",justify:!1,translateX:0,translateY:70,itemsSpacing:0,itemWidth:100,itemHeight:20,symbolSize:13,symbolShape:"circle"}],enablePoints:!1,useMesh:!0,isInteractive:!0})})};function lt({data:m}){const{width:r}=v(),o=r<=560,d={...{width:"100%",padding:"0px",marginBottom:12,alignItems:"center",marginLeft:"auto",marginRight:"auto"},...o?{}:{display:"flex"}};return t.jsx(F.Fragment,{children:t.jsx("div",{style:{textAlign:"center"},children:t.jsx("div",{style:d,children:t.jsx(rt,{lineData:m})})})})}const ct=({data:m})=>{const{rafl28days:r}=m,o=r.data.filter(i=>T(i.date)>T("2024-11-27")),e=o.reduce((i,u)=>(Object.keys(r.data[r.data.length-1]).map(p=>{["date","dateString"].includes(p)||(i[p]=i[p]?i[p]+u[p]:u[p])}),i),{});e.dateString="Total",o.push(e);const c=Object.keys(e).reduce((i,u)=>(i[u]=Math.floor(e[u]/o.length),i),{});c.dateString="Average",o.push(c);const d={columns:r.columns,data:o},{width:n}=v(),a=n<=360,f=n<=395,w=n<=428,b=n<=560,g=n<=820,R=a?".8rem":f?".85rem":w?".9rem":".95rem",y="100%";return t.jsx(Z,{tableData:d,tableWidth:y,fontSize:R})},dt=({data:m})=>{const r=H(),{potViewsById:o}=m,{potStats:e}=h.useContext(L),{getPotFromId:c}=h.useContext(G),d=[{name:"Pot ID",align:"left",id:"id"},{id:"title",align:"left",name:"Pot Title"},{id:"views",align:"center",name:"Pot Views"},{id:"percentViews",name:"% Views",align:"center"},{id:"donors",name:"Donors",align:"center"},{id:"tickets",name:"Tickets",align:"center"}],n=!0,[a,f]=h.useState("id"),[w,b]=h.useState(!0),[g,R]=h.useState({}),y=o.data.map(s=>{const l=c(s.id),S=e.find(C=>C.id===s.id);return{...s,donors:S.donors,tickets:S.tickets,percentViews:Math.floor(s.percentViews*100)+"%",title:l!=null&&l.title?l.title:`unknown (${s.id})`,...l}}).sort((s,l)=>{switch(a){case"id":return s[a].localeCompare(l[a]);case"title":return s[a].localeCompare(l[a]);default:return l[a]-s[a]||s.id.localeCompare(l.id)}}),i=w?y:y.reverse(),u=Object.keys(g).length>0?[i==null?void 0:i.find(s=>s.title===g.itemTitle)]:i||[],p={columns:d,data:u},A=h.useCallback((s,l)=>{const S=y.find(B=>B.title===l),C=S==null?void 0:S.title.replace(/[\s/]/g,"_").replace(/\W/g,"");return s==="title"?t.jsx(at,{onClick:()=>r(`/rafl/?id=${S.id}&name=${C}`),style:{color:"#fff"},children:l}):l},[r,y]),j=h.useCallback(s=>s!=null&&s.title?s.title:"unknown",[]),{width:x}=v(),k=x<=360,D=x<=395,P=x<=428,M=x<=560,W=x<=820,V=k?".8rem":D?".85rem":P?".9rem":".95rem",z="100%";return t.jsxs("div",{children:[t.jsx("div",{style:{justifyItems:"center",marginBottom:20},children:t.jsx("div",{style:{width:400},children:t.jsx(et,{allItems:y,setItemDetails:R,getOptionTitle:j,searchText:"Search Pots"})})}),t.jsx(tt,{tableData:p,tableWidth:z,fontSize:V,sortable:n,sort:a,setSort:f,ascending:w,setAscending:b,linkFunction:A})]})};function mt(){var g;J("RAFL Report");const{data:m,loading:r,error:o}=q({urls:ft}),{siteFullNew:e}=m||{},{width:c}=v(),n=c<560?"8px 8px 32px 8px":"24px 24px 32px 24px",a={margin:"0px 0px 36px 0px",width:"100%",textAlign:"center",color:"#fff"},f={margin:"46px 0px 18px 0px",width:"100%",textAlign:"center",color:"#fff"},w=(g=e==null?void 0:e.firstVistsLastSevenDays)!=null&&g.countryCount?f:a,b=r?"--":"(updated: "+T(e==null?void 0:e.metadata.updatedDateTime).format("MM/DD/YY hh:mm")+` ${e==null?void 0:e.metadata.timezone})`;return r?t.jsx(_,{}):o?null:t.jsxs("div",{style:{minWidth:"320px",maxWidth:900,height:"100%",padding:n,backgroundColor:"#292929",marginLeft:"auto",marginRight:"auto",fontSize:"1.5rem",lineHeight:.8},children:[t.jsxs("div",{style:w,children:["RAFL Summary",t.jsx("br",{}),t.jsx("span",{style:{fontSize:"0.85rem"},children:b})]}),t.jsx(lt,{data:e}),t.jsx("div",{style:f,children:"Page Tracking"}),t.jsx(ct,{data:e}),t.jsx("div",{style:f,children:"Pot Details"}),t.jsx(dt,{data:e}),t.jsx(F.Fragment,{children:!1})]})}const ft={siteFullNew:K};function Yt(){const{authLoaded:m}=h.useContext(I),{adminRole:r}=h.useContext(E),{isMobile:o}=v(),{potStats:e}=h.useContext(L),c=nt.map(n=>{const a=e==null?void 0:e.find(f=>f.id===n.id);return{...n,tickets:a==null?void 0:a.tickets,donors:a==null?void 0:a.donors}}),d=t.jsxs(F.Fragment,{children:[!o&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}}),t.jsx(it,{active:!0}),t.jsx(st,{})]});return t.jsx(X,{filterFields:N,children:t.jsx(ot,{allEntries:c,children:t.jsxs(F.Fragment,{children:[t.jsx(O,{title:"RAFL Report",extras:d}),m&&r&&t.jsx(mt,{}),t.jsx(Y,{}),t.jsx($,{feature:"raflReport"})]})})})}export{Yt as default};
