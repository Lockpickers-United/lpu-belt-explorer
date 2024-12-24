import{d as F,u as k,j as t,R as W,b as $,r as x,A as G,D as X,N as _,F as q,T as J}from"./index-54946f8a.js";import{D as K,a as Q,r as U}from"./filterFields-412eea47.js";import{L as Z}from"./LoadingDisplay-75b86f57.js";import{u as tt}from"./useData-bb00cdee.js";import{u as et}from"./usePageTitle-fc6b1e2c.js";import{s as st,g as nt}from"./dataUrls-824ba4d9.js";import{P as z}from"./nivo-line.es-50c9c395.js";import{p as I}from"./adminChartDefaults-e02caa29.js";import{A as ot}from"./AdminStatsTable-24caee34.js";import{A as H}from"./AdminStatsTableSort-dccacd07.js";import{R as it}from"./RaffleAutocompleteBox-eab01f65.js";import{L as at}from"./Link-99bbb211.js";import{a as B,s as A}from"./RaffleContext-7a42f529.js";import{R as rt}from"./RaffleStatsHeader-ad6815ad.js";import{R as lt,A as ct}from"./AdminRoleButton-98f96b23.js";import{R as dt}from"./RaffleDataProvider-d40ecf2f.js";import"./LPU-c3fa7122.js";import"./LinearProgress-1bfcbd32.js";import"./useDocumentTitle-4bf9b6a7.js";import"./nivo-legends.es-5240a481.js";import"./index-b02f5358.js";import"./TableRow-8be57780.js";import"./Search-cb159a6b.js";import"./Autocomplete-e0313970.js";import"./Select-422c3caf.js";import"./Chip-f439db66.js";import"./TextField-50424180.js";import"./index-5162c72b.js";const mt=({lineData:c})=>{const l=[c.rafl28days.data],i=[],e=new Map,o=new Map,r=new Map;l.forEach(d=>{const y=[],p=[],C=[];for(let D=0;D<d.length;D++){let h=d[D].date;if(F(h)<F("2024-11-25"))continue;h=h+" 23:59:59";const m=new Map;m.x=h,m.y=d[D].potListViews,y.push(m);const j=new Map;j.x=h,j.y=d[D].potViews,p.push(j);const T=new Map;T.x=h,T.y=d[D].raflForm,C.push(T)}e.id="Pot List",e.data=y,o.id="Pot Views",o.data=p,r.id="Entry Form",r.data=C,i.push(o),i.push(e),i.push(r)});const{width:s}=k(),g=s<=360,w=s<=395,f=s<=428,b=s<=560,S=s<=820,u=g||w?200:f?210:S?230:350,v=b?{top:10,right:20,bottom:50,left:50}:{top:10,right:20,bottom:70,left:50};return t.jsx("div",{style:{height:u,width:"100%"},children:t.jsx(z,{theme:I,data:i,enableGridX:!1,enableGridY:!0,colors:["#5265ed","#082fd1","#4fa720"],lineWidth:3,margin:v,height:u,curve:"natural",yScale:{type:"linear",min:0,max:"auto",stacked:!1,reverse:!1},yFormat:" >-.0f",axisLeft:{tickValues:5,tickSize:5,tickPadding:5,tickRotation:0,format:","},xScale:{type:"time",format:"%Y-%m-%d %H:%M:%S"},xFormat:"time:%m/%d/%y",axisBottom:{format:"%b %d",tickSize:5,tickPadding:5,tickRotation:-45,direction:"row",legendOffset:-12,tickValues:"every day"},legends:[{anchor:"bottom",itemTextColor:"#bbb",direction:"row",justify:!1,translateX:0,translateY:70,itemsSpacing:0,itemWidth:100,itemHeight:20,symbolSize:13,symbolShape:"circle"}],enablePoints:!1,useMesh:!0,isInteractive:!0})})};function ut({data:c}){const{width:l}=k(),i=l<=560,r={...{width:"100%",padding:"0px",marginBottom:12,alignItems:"center",marginLeft:"auto",marginRight:"auto"},...i?{}:{display:"flex"}};return t.jsx(W.Fragment,{children:t.jsx("div",{style:{textAlign:"center"},children:t.jsx("div",{style:r,children:t.jsx(mt,{lineData:c})})})})}const ft=({data:c})=>{const{rafl28days:l}=c,i=l.data.filter(d=>F(d.date)>F("2024-11-27")),e=i.reduce((d,y)=>(Object.keys(l.data[l.data.length-1]).map(p=>{["date","dateString"].includes(p)||(d[p]=d[p]?d[p]+y[p]:y[p])}),d),{});e.dateString="Total",i.push(e);const o=Object.keys(e).reduce((d,y)=>(d[y]=Math.floor(e[y]/i.length),d),{});o.dateString="Average",i.push(o);const r={columns:l.columns,data:i},{width:s}=k(),g=s<=360,w=s<=395,f=s<=428,b=s<=560,S=s<=820,u=g?".8rem":w?".85rem":f?".9rem":".95rem",v="100%";return t.jsx(ot,{tableData:r,tableWidth:v,fontSize:u})},ht=({data:c})=>{const l=$(),{potViewsById:i}=c,{getPotFromId:e}=x.useContext(K),o=[{name:"Pot #",align:"center",id:"potNumber"},{name:"ID",align:"center",id:"id"},{id:"title",align:"left",name:"Title"},{id:"views",align:"center",name:"Views"},{id:"percentViews",name:"% Views",align:"center"},{id:"donors",name:"Donors",align:"center"},{id:"tickets",name:"Tickets",align:"center"}],r=!0,[s,g]=x.useState("potNumber"),[w,f]=x.useState(!0),[b,S]=x.useState({}),u=i.data.map(n=>{var P,V;const a=e(n.id);if(!a)return null;let R=a!=null&&a.title?a.title.substring(0,32):`unknown (${n.id})`;R=((P=a==null?void 0:a.title)==null?void 0:P.length)<32||!(a!=null&&a.title)?R:R+"...";const M=(V=n==null?void 0:n.id)==null?void 0:V.replace("2025-","");return{...n,percentViews:Math.floor(n.percentViews*100)+"%",...a,title:R,id:M}}).filter(n=>n).sort((n,a)=>{switch(s){case"potNumber":return n.potNumber-a.potNumber||n.title.localeCompare(a.title);case"id":return n[s].localeCompare(a[s]);case"title":return n[s].localeCompare(a[s]);case"donors":return parseInt(a[s])-parseInt(n[s])||n.title.localeCompare(a.title);case"percentViews":return parseInt(a[s])-parseInt(n[s])||n.views-a.views;default:return parseInt(a[s])-parseInt(n[s])||n.title.localeCompare(a.title)}}),v=w?u:u.reverse(),y=(Object.keys(b).length>0?[v==null?void 0:v.find(n=>n.title===b.itemTitle)]:v||[]).map(n=>n.donors&&n.donors>0?{...n}:{...n,donors:0,tickets:0}),p={columns:o,data:y},C=x.useCallback((n,a)=>{const R=u.find(P=>P.title===a),M=R==null?void 0:R.title.replace(/[\s/]/g,"_").replace(/\W/g,"");return n==="title"?t.jsx(at,{onClick:()=>l(`/rafl/?id=${R.id}&name=${M}`),style:{color:"#fff"},children:a}):a},[l,u]),D=x.useCallback(n=>n!=null&&n.title?n.title:"unknown",[]),{width:h}=k(),m=h<=360,j=h<=395,T=h<=428,N=h<=560,O=h<=820,Y=m?".8rem":j?".85rem":T?".9rem":".95rem",E="100%";return t.jsxs("div",{children:[t.jsx("div",{style:{justifyItems:"center",marginBottom:20},children:t.jsx("div",{style:{width:400},children:t.jsx(it,{allItems:u,setItemDetails:S,getOptionTitle:D,searchText:"Search Pots"})})}),t.jsx(H,{tableData:p,tableWidth:E,fontSize:Y,sortable:r,sort:s,setSort:g,ascending:w,setAscending:f,linkFunction:C})]})},pt=()=>{const{allCharities:c}=x.useContext(B),l=[{id:"name",align:"left",name:"Charity Name"},{id:"donors",name:"Donors",align:"left"},{id:"donations",name:"Donations",align:"left"}],i=!0,[e,o]=x.useState("name"),[r,s]=x.useState(!0),g=c.sort((m,j)=>{switch(e){case"name":return m.name.localeCompare(j.name);case"donors":return j[e]-m[e];case"donations":return j[e]-m[e];default:return m.name.localeCompare(j.name)}}),f=(r?g:g.reverse()).map(m=>m.donations&&m.donations>0?{...m,donations:`$${m.donations}`}:{...m}),b={columns:l,data:f},S=x.useCallback((m,j)=>j,[]),{width:u}=k(),v=u<=360,d=u<=395,y=u<=428,p=u<=560,C=u<=820,D=v?".8rem":d?".85rem":y?".9rem":".95rem",h="100%";return t.jsxs("div",{children:[t.jsx("div",{style:{justifyItems:"center",marginBottom:20},children:t.jsx("div",{style:{width:400}})}),t.jsx(H,{tableData:b,tableWidth:h,fontSize:D,sortable:i,sort:e,setSort:o,ascending:r,setAscending:s,linkFunction:S})]})};function L({chartHeight:c,chartdata:l,showAxisBottom:i,colors:e,tickValues:o,curve:r}){const s=i?{top:10,right:20,bottom:70,left:50}:{top:10,right:20,bottom:10,left:50},g=i?"bottom":"top-left",w=i?70:20,f=i?0:20;return t.jsx("div",{style:{height:c,width:"100%"},children:t.jsx(z,{theme:I,data:l,enableGridX:!1,enableGridY:!1,colors:e,lineWidth:3,margin:s,height:c,curve:r??"natural",yScale:{type:"linear",min:0,max:"auto",stacked:!1,reverse:!1},yFormat:" >-.0f",axisLeft:{tickValues:o||5,tickSize:5,tickPadding:5,tickRotation:0,format:","},xScale:{type:"time",format:"%Y-%m-%d %H:%M:%S"},xFormat:"time:%m/%d/%y",axisBottom:i?{format:"%b %d",tickSize:5,tickPadding:5,tickRotation:-45,direction:"row",legendOffset:-12,tickValues:"every day"}:null,legends:i?[]:[{anchor:g,itemTextColor:"#bbb",direction:"row",justify:!1,translateX:f,translateY:w,itemsSpacing:0,itemWidth:100,itemHeight:20,symbolSize:13,symbolShape:"circle"}],enablePoints:!1,useMesh:!0,isInteractive:!0})})}const xt=({data:c})=>{const l=Object.keys(c).sort((o,r)=>o.localeCompare(r)).reduce((o,r)=>{const s=r+" 23:59:59";return o.donorsCum=o.donorsCum+c[r].totalDonors||c[r].totalDonors,A(o,["totalDonors"],{x:s,y:c[r].totalDonors}),A(o,["cumulativeDonors"],{x:s,y:o.donorsCum}),o.donationsCum=o.donationsCum+c[r].totalDonations||c[r].totalDonations,A(o,["totalDonations"],{x:s,y:c[r].totalDonations}),A(o,["cumulativeDonations"],{x:s,y:o.donationsCum}),o},[]),i={margin:"30px 0px 0px 0px",width:"100%",textAlign:"center",color:"#fff",fontSize:"1.2rem"},e=120;return t.jsxs(W.Fragment,{children:[t.jsx("div",{style:i,children:"Donations"}),t.jsx("div",{style:{height:e,width:"100%"},children:t.jsx(L,{chartdata:[{id:"Donations Cumulative",data:l.cumulativeDonations}],chartHeight:e,showAxisBottom:!1,colors:["#4fa720"],tickValues:5})}),t.jsx("div",{style:{height:e,width:"100%"},children:t.jsx(L,{chartdata:[{id:"Donations",data:l.totalDonations}],chartHeight:e,showAxisBottom:!0,colors:["#3a7919"],tickValues:2,curve:"step"})}),t.jsx("div",{style:i,children:"Donors"}),t.jsx("div",{style:{height:e,width:"100%"},children:t.jsx(L,{chartdata:[{id:"Donors Cumulative",data:l.cumulativeDonors}],chartHeight:e,showAxisBottom:!1,colors:["#5265ed","#082fd1","#4fa720"]})}),t.jsx("div",{style:{height:e,width:"100%"},children:t.jsx(L,{chartdata:[{id:"Donors",data:l.totalDonors}],chartHeight:e,showAxisBottom:!0,colors:["#082fd1","#4fa720"],tickValues:2,curve:"step"})})]})};function gt(){et("RAFL Report");const{data:c,loading:l,error:i}=tt({urls:yt}),{siteFullNew:e,raflResponseDetails2:o}=c||{},{width:r}=k(),g=r<560?"8px 8px 32px 8px":"24px 24px 32px 24px",w={margin:"0px 0px 36px 0px",width:"100%",textAlign:"center",color:"#fff",fontSize:"1.3rem",fontWeight:700},f={margin:"46px 0px 18px 0px",width:"100%",textAlign:"center",color:"#fff",fontSize:"1.3rem",fontWeight:700},b=w,S=l?"--":"(updated: "+F(e==null?void 0:e.metadata.updatedDateTime).format("MM/DD/YY hh:mm")+` ${e==null?void 0:e.metadata.timezone})`;return l?t.jsx(Z,{}):i?null:t.jsxs("div",{style:{minWidth:"320px",maxWidth:900,height:"100%",padding:g,backgroundColor:"#292929",marginLeft:"auto",marginRight:"auto",fontSize:"1.0rem"},children:[t.jsxs("div",{style:b,children:["RAFL REPORT",t.jsx("br",{}),t.jsx("span",{style:{fontSize:"0.85rem"},children:S})]}),t.jsx(rt,{}),t.jsx("div",{style:{height:20}}),t.jsx(ut,{data:e}),t.jsx("div",{style:f,children:"Totals Over Time"}),t.jsx(xt,{data:o}),t.jsx("div",{style:f,children:"Page Tracking"}),t.jsx(ft,{data:e}),t.jsx("div",{style:f,children:"Pot Details"}),t.jsx(ht,{data:e}),t.jsx("div",{style:f,children:"Charity Details"}),t.jsx(pt,{data:e})]})}const yt={siteFullNew:st,raflResponseDetails2:nt};function _t(){const{authLoaded:c}=x.useContext(G),{adminRole:l}=x.useContext(X),{isMobile:i}=k(),{allPots:e}=x.useContext(B),o=t.jsxs(W.Fragment,{children:[!i&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}}),t.jsx(lt,{active:!0}),t.jsx(ct,{})]});return t.jsx(Q,{filterFields:U,children:t.jsx(dt,{allEntries:e,children:t.jsxs(W.Fragment,{children:[t.jsx(_,{title:"RAFL Report",extras:o}),c&&l&&t.jsx(gt,{}),t.jsx(q,{}),t.jsx(J,{feature:"raflReport"})]})})})}export{_t as default};
