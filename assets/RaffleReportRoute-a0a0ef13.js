import{d as F,u as k,j as t,R as M,b as G,r as x,A as X,D as _,N as q,F as J,T as K}from"./index-9b911bde.js";import{D as Q,a as U,r as Z}from"./filterFields-c148fb6f.js";import{L as tt}from"./LoadingDisplay-68502f1a.js";import{u as et}from"./useData-9f097ac0.js";import{u as st}from"./usePageTitle-f43c39f2.js";import{s as nt,i as it}from"./dataUrls-d878baa3.js";import{P as I}from"./nivo-line.es-86b4ecc8.js";import{p as z}from"./adminChartDefaults-e02caa29.js";import{A as ot}from"./AdminStatsTable-344b03e5.js";import{A as H}from"./AdminStatsTableSort-acbf2724.js";import{R as at}from"./RaffleAutocompleteBox-fee6a7f7.js";import{L as rt}from"./Link-5646319b.js";import{a as B}from"./RaffleContext-b5e10089.js";import{R as lt,A as ct}from"./AdminRoleButton-de5b2116.js";import{R as dt}from"./RaffleDataProvider-38a96816.js";import"./LPU-c3fa7122.js";import"./LinearProgress-9d5bb072.js";import"./useDocumentTitle-927c7b08.js";import"./nivo-legends.es-d4dfeffc.js";import"./index-5bb38107.js";import"./TableRow-5ade152a.js";import"./Search-6ab11465.js";import"./Autocomplete-08dbe125.js";import"./Select-471ca9fb.js";import"./Chip-5d506665.js";import"./TextField-5f0a86ff.js";import"./index-ed02c54d.js";const mt=({lineData:n})=>{const s=[n.rafl28days.data],i=[],e=new Map,r=new Map,c=new Map;s.forEach(d=>{const y=[],p=[],C=[];for(let S=0;S<d.length;S++){let h=d[S].date;if(F(h)<F("2024-11-25"))continue;h=h+" 23:59:59";const m=new Map;m.x=h,m.y=d[S].potListViews,y.push(m);const w=new Map;w.x=h,w.y=d[S].potViews,p.push(w);const T=new Map;T.x=h,T.y=d[S].raflForm,C.push(T)}e.id="Pot List",e.data=y,r.id="Pot Views",r.data=p,c.id="Entry Form",c.data=C,i.push(r),i.push(e),i.push(c)});const{width:o}=k(),g=o<=360,j=o<=395,f=o<=428,D=o<=560,b=o<=820,u=g||j?200:f?210:b?230:350,v=D?{top:10,right:20,bottom:50,left:50}:{top:10,right:20,bottom:70,left:50};return t.jsx("div",{style:{height:u,width:"100%"},children:t.jsx(I,{theme:z,data:i,enableGridX:!1,enableGridY:!0,colors:["#5265ed","#082fd1","#4fa720"],lineWidth:3,margin:v,height:u,curve:"natural",yScale:{type:"linear",min:0,max:"auto",stacked:!1,reverse:!1},yFormat:" >-.0f",axisLeft:{tickValues:5,tickSize:5,tickPadding:5,tickRotation:0,format:","},xScale:{type:"time",format:"%Y-%m-%d %H:%M:%S"},xFormat:"time:%m/%d/%y",axisBottom:{format:"%b %d",tickSize:5,tickPadding:5,tickRotation:-45,direction:"row",legendOffset:-12,tickValues:"every day"},legends:[{anchor:"bottom",itemTextColor:"#bbb",direction:"row",justify:!1,translateX:0,translateY:70,itemsSpacing:0,itemWidth:100,itemHeight:20,symbolSize:13,symbolShape:"circle"}],enablePoints:!1,useMesh:!0,isInteractive:!0})})};function ut({data:n}){const{width:s}=k(),i=s<=560,c={...{width:"100%",padding:"0px",marginBottom:12,alignItems:"center",marginLeft:"auto",marginRight:"auto"},...i?{}:{display:"flex"}};return t.jsx(M.Fragment,{children:t.jsx("div",{style:{textAlign:"center"},children:t.jsx("div",{style:c,children:t.jsx(mt,{lineData:n})})})})}const ft=({data:n})=>{const{rafl28days:s}=n,i=s.data.filter(d=>F(d.date)>F("2024-11-27")),e=i.reduce((d,y)=>(Object.keys(s.data[s.data.length-1]).map(p=>{["date","dateString"].includes(p)||(d[p]=d[p]?d[p]+y[p]:y[p])}),d),{});e.dateString="Total",i.push(e);const r=Object.keys(e).reduce((d,y)=>(d[y]=Math.floor(e[y]/i.length),d),{});r.dateString="Average",i.push(r);const c={columns:s.columns,data:i},{width:o}=k(),g=o<=360,j=o<=395,f=o<=428,D=o<=560,b=o<=820,u=g?".8rem":j?".85rem":f?".9rem":".95rem",v="100%";return t.jsx(ot,{tableData:c,tableWidth:v,fontSize:u})},ht=({data:n})=>{const s=G(),{potViewsById:i}=n,{getPotFromId:e}=x.useContext(Q),r=[{name:"Pot #",align:"center",id:"potNumber"},{name:"ID",align:"center",id:"id"},{id:"title",align:"left",name:"Title"},{id:"views",align:"center",name:"Views"},{id:"percentViews",name:"% Views",align:"center"},{id:"donors",name:"Donors",align:"center"},{id:"tickets",name:"Tickets",align:"center"}],c=!0,[o,g]=x.useState("potNumber"),[j,f]=x.useState(!0),[D,b]=x.useState({}),u=i.data.map(a=>{var A,W;const l=e(a.id);if(!l)return null;let R=l!=null&&l.title?l.title.substring(0,32):`unknown (${a.id})`;R=((A=l==null?void 0:l.title)==null?void 0:A.length)<32||!(l!=null&&l.title)?R:R+"...";const V=(W=a==null?void 0:a.id)==null?void 0:W.replace("2025-","");return{...a,percentViews:Math.floor(a.percentViews*100)+"%",...l,title:R,id:V}}).filter(a=>a).sort((a,l)=>{switch(o){case"potNumber":return a.potNumber-l.potNumber||a.title.localeCompare(l.title);case"id":return a[o].localeCompare(l[o]);case"title":return a[o].localeCompare(l[o]);case"donors":return parseInt(l[o])-parseInt(a[o])||a.title.localeCompare(l.title);case"percentViews":return parseInt(l[o])-parseInt(a[o])||a.views-l.views;default:return parseInt(l[o])-parseInt(a[o])||a.title.localeCompare(l.title)}}),v=j?u:u.reverse(),y=(Object.keys(D).length>0?[v==null?void 0:v.find(a=>a.title===D.itemTitle)]:v||[]).map(a=>a.donors&&a.donors>0?{...a}:{...a,donors:0,tickets:0}),p={columns:r,data:y},C=x.useCallback((a,l)=>{const R=u.find(A=>A.title===l),V=R==null?void 0:R.title.replace(/[\s/]/g,"_").replace(/\W/g,"");return a==="title"?t.jsx(rt,{onClick:()=>s(`/rafl/?id=${R.id}&name=${V}`),style:{color:"#fff"},children:l}):l},[s,u]),S=x.useCallback(a=>a!=null&&a.title?a.title:"unknown",[]),{width:h}=k(),m=h<=360,w=h<=395,T=h<=428,Y=h<=560,O=h<=820,$=m?".8rem":w?".85rem":T?".9rem":".95rem",E="100%";return t.jsxs("div",{children:[t.jsx("div",{style:{justifyItems:"center",marginBottom:20},children:t.jsx("div",{style:{width:400},children:t.jsx(at,{allItems:u,setItemDetails:b,getOptionTitle:S,searchText:"Search Pots"})})}),t.jsx(H,{tableData:p,tableWidth:E,fontSize:$,sortable:c,sort:o,setSort:g,ascending:j,setAscending:f,linkFunction:C})]})},pt=()=>{const{allCharities:n}=x.useContext(B),s=[{id:"name",align:"left",name:"Charity Name"},{id:"donors",name:"Donors",align:"left"},{id:"donations",name:"Donations",align:"left"}],i=!0,[e,r]=x.useState("name"),[c,o]=x.useState(!0),g=n.sort((m,w)=>{switch(e){case"name":return m.name.localeCompare(w.name);case"donors":return w[e]-m[e];case"donations":return w[e]-m[e];default:return m.name.localeCompare(w.name)}}),f=(c?g:g.reverse()).map(m=>m.donations&&m.donations>0?{...m,donations:`$${m.donations}`}:{...m}),D={columns:s,data:f},b=x.useCallback((m,w)=>w,[]),{width:u}=k(),v=u<=360,d=u<=395,y=u<=428,p=u<=560,C=u<=820,S=v?".8rem":d?".85rem":y?".9rem":".95rem",h="100%";return t.jsxs("div",{children:[t.jsx("div",{style:{justifyItems:"center",marginBottom:20},children:t.jsx("div",{style:{width:400}})}),t.jsx(H,{tableData:D,tableWidth:h,fontSize:S,sortable:i,sort:e,setSort:r,ascending:c,setAscending:o,linkFunction:b})]})};function P({chartHeight:n,chartdata:s,showAxisBottom:i,colors:e,tickValues:r,curve:c}){const o=i?{top:10,right:20,bottom:70,left:50}:{top:10,right:20,bottom:10,left:50},g=i?"bottom":"top-left",j=i?70:20,f=i?0:20;return t.jsx("div",{style:{height:n,width:"100%"},children:t.jsx(I,{theme:z,data:s,enableGridX:!1,enableGridY:!1,colors:e,lineWidth:3,margin:o,height:n,curve:c??"natural",yScale:{type:"linear",min:0,max:"auto",stacked:!1,reverse:!1},yFormat:" >-.0f",axisLeft:{tickValues:r||5,tickSize:5,tickPadding:5,tickRotation:0,format:","},xScale:{type:"time",format:"%Y-%m-%d %H:%M:%S"},xFormat:"time:%m/%d/%y",axisBottom:i?{format:"%b %d",tickSize:5,tickPadding:5,tickRotation:-45,direction:"row",legendOffset:-12,tickValues:"every day"}:null,legends:i?[]:[{anchor:g,itemTextColor:"#bbb",direction:"row",justify:!1,translateX:f,translateY:j,itemsSpacing:0,itemWidth:100,itemHeight:20,symbolSize:13,symbolShape:"circle"}],enablePoints:!1,useMesh:!0,isInteractive:!0})})}function N(n,s,i){if(s.length===1){n[s[0]]=n[s[0]]?n[s[0]]+i:i;return}const e=s[0];n[e]||(n[e]={}),N(n[e],s.slice(1),i)}function L(n,s,i){if(s.length===1){n[s[0]]=n[s[0]]?[...n[s[0]],i]:[i];return}const e=s[0];n[e]||(n[e]={}),N(n[e],s.slice(1),i)}const xt=({data:n})=>{const s=Object.keys(n).sort((r,c)=>r.localeCompare(c)).reduce((r,c)=>{const o=c+" 23:59:59";return r.donorsCum=r.donorsCum+n[c].totalDonors||n[c].totalDonors,L(r,["totalDonors"],{x:o,y:n[c].totalDonors}),L(r,["cumulativeDonors"],{x:o,y:r.donorsCum}),r.donationsCum=r.donationsCum+n[c].totalDonations||n[c].totalDonations,L(r,["totalDonations"],{x:o,y:n[c].totalDonations}),L(r,["cumulativeDonations"],{x:o,y:r.donationsCum}),r},[]),i={margin:"30px 0px 0px 0px",width:"100%",textAlign:"center",color:"#fff",fontSize:"1.2rem"},e=120;return t.jsxs(M.Fragment,{children:[t.jsx("div",{style:i,children:"Donations"}),t.jsx("div",{style:{height:e,width:"100%"},children:t.jsx(P,{chartdata:[{id:"Donations Cumulative",data:s.cumulativeDonations}],chartHeight:e,showAxisBottom:!1,colors:["#4fa720"],tickValues:5})}),t.jsx("div",{style:{height:e,width:"100%"},children:t.jsx(P,{chartdata:[{id:"Donations",data:s.totalDonations}],chartHeight:e,showAxisBottom:!0,colors:["#3a7919"],tickValues:2,curve:"step"})}),t.jsx("div",{style:i,children:"Donors"}),t.jsx("div",{style:{height:e,width:"100%"},children:t.jsx(P,{chartdata:[{id:"Donors Cumulative",data:s.cumulativeDonors}],chartHeight:e,showAxisBottom:!1,colors:["#5265ed","#082fd1","#4fa720"]})}),t.jsx("div",{style:{height:e,width:"100%"},children:t.jsx(P,{chartdata:[{id:"Donors",data:s.totalDonors}],chartHeight:e,showAxisBottom:!0,colors:["#082fd1","#4fa720"],tickValues:2,curve:"step"})})]})};function gt(){st("RAFL Report");const{data:n,loading:s,error:i}=et({urls:yt}),{siteFullNew:e,raflResponseDetails:r}=n||{},{width:c}=k(),g=c<560?"8px 8px 32px 8px":"24px 24px 32px 24px",j={margin:"0px 0px 36px 0px",width:"100%",textAlign:"center",color:"#fff"},f={margin:"46px 0px 18px 0px",width:"100%",textAlign:"center",color:"#fff"},D=j,b=s?"--":"(updated: "+F(e==null?void 0:e.metadata.updatedDateTime).format("MM/DD/YY hh:mm")+` ${e==null?void 0:e.metadata.timezone})`;return s?t.jsx(tt,{}):i?null:t.jsxs("div",{style:{minWidth:"320px",maxWidth:900,height:"100%",padding:g,backgroundColor:"#292929",marginLeft:"auto",marginRight:"auto",fontSize:"1.5rem",lineHeight:.8},children:[t.jsxs("div",{style:D,children:["RAFL Summary",t.jsx("br",{}),t.jsx("span",{style:{fontSize:"0.85rem"},children:b})]}),t.jsx(ut,{data:e}),t.jsx("div",{style:f,children:"Totals Over Time"}),t.jsx(xt,{data:r}),t.jsx("div",{style:f,children:"Page Tracking"}),t.jsx(ft,{data:e}),t.jsx("div",{style:f,children:"Pot Details"}),t.jsx(ht,{data:e}),t.jsx("div",{style:f,children:"Charity Details"}),t.jsx(pt,{data:e})]})}const yt={siteFullNew:nt,raflResponseDetails:it};function Xt(){const{authLoaded:n}=x.useContext(X),{adminRole:s}=x.useContext(_),{isMobile:i}=k(),{allPots:e}=x.useContext(B),r=t.jsxs(M.Fragment,{children:[!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}}),t.jsx(lt,{active:!0}),t.jsx(ct,{})]});return t.jsx(U,{filterFields:Z,children:t.jsx(dt,{allEntries:e,children:t.jsxs(M.Fragment,{children:[t.jsx(q,{title:"RAFL Report",extras:r}),n&&s&&t.jsx(gt,{}),t.jsx(J,{}),t.jsx(K,{feature:"raflReport"})]})})})}export{Xt as default};
