import{j as t,a1 as T,R as D,r as L}from"./index-df5142d4.js";import{L as A}from"./LoadingDisplay-f335b887.js";import{u as P}from"./useData-3eb54f9a.js";import{u as R}from"./usePageTitle-602489d4.js";import{u as b}from"./useWindowSize-d25ded87.js";import{s as V}from"./dataUrls-cfa73315.js";import{C as M,L as H}from"./ChoiceButtonGroup-32356592.js";import{A as S,p as z}from"./adminChartDefaults-9472b231.js";import{P as F}from"./nivo-line.es-4f76d7d2.js";import{c as E,d as B,T as I,a as C,b as w,e as Y}from"./TableRow-aae0ec56.js";import"./LPU-c3fa7122.js";import"./LinearProgress-2d3e32ad.js";import"./useDocumentTitle-448976fd.js";import"./chartDefaults-9fc07b21.js";import"./ToggleButtonGroup-c28e1050.js";import"./nivo-legends.es-916fbaac.js";import"./index-b1d8d3c7.js";const G=({data:n})=>{const{firstVistsLastSevenDays:a}=n,{width:i}=b(),e=i<=360,d=i<=395,s=i<=428,r=i<=560,c=i<=820,l=e?".8rem":d?".85rem":s?".9rem":".95rem",m=400;return t.jsx(S,{tableData:a,tableWidth:m,fontSize:l})},U=({data:n})=>{const{pageTracking:a}=n,i=Object.keys(a.data[13]).sort((p,o)=>a.data[13][o]-a.data[13][p]).filter(p=>p!=="total"&&p!=="date");i.unshift("date"),i.push("total");const d={columns:i.reduce((p,o)=>{const x=a.columns.find(u=>u.id===o);return p.push(x),p},[]),data:a.data},{width:s}=b(),r=s<=360,c=s<=395,l=s<=428,m=s<=560,g=s<=820,h=r?".8rem":c?".85rem":l?".9rem":".95rem",y="100%";return t.jsx(S,{tableData:d,tableWidth:y,fontSize:h})},O=({lineData:n})=>{const a=[n.traffic28days.data],i=[],e=new Map,d=new Map,s=new Map;a.forEach(o=>{const x=[],u=[],j=[];for(let f=0;f<o.length;f++){const v=new Map;v.x=o[f].date,v.y=o[f].visitors,x.push(v);const W=new Map;W.x=o[f].date,W.y=o[f].visits,u.push(W);const k=new Map;k.x=o[f].date,k.y=o[f].lockViews,j.push(k)}e.id="Visitors",e.data=x,d.id="Visits",d.data=u,s.id="Lock Views",s.data=j,i.push(d),i.push(e),i.push(s)});const{width:r}=b(),c=r<=360,l=r<=395,m=r<=428,g=r<=560,h=r<=820,y=c||l?200:m?210:h?230:350,p=g?{top:10,right:20,bottom:50,left:50}:{top:10,right:20,bottom:70,left:50};return t.jsx("div",{style:{height:y,width:"100%"},children:t.jsx(F,{theme:z,data:i,enableGridX:!1,enableGridY:!0,colors:["#5265ed","#082fd1","#4fa720"],lineWidth:3,margin:p,height:y,curve:"natural",yScale:{type:"linear",min:0,max:4500,stacked:!1,reverse:!1},yFormat:" >-.2f",axisLeft:{tickValues:5,tickSize:5,tickPadding:5,tickRotation:0,format:","},xScale:{type:"time",format:"%Y-%m-%d"},xFormat:"time:%m/%d/%y",axisBottom:{format:"%b %d",tickSize:5,tickPadding:5,tickRotation:-45,direction:"row",legendOffset:-12,tickValues:"every day"},legends:[{anchor:"bottom",itemTextColor:"#444",direction:"row",justify:!1,translateX:0,translateY:70,itemsSpacing:0,itemWidth:100,itemHeight:20,symbolSize:13,symbolShape:"circle"}],enablePoints:!1,useMesh:!0,isInteractive:!0})})},X=({fullData:n})=>{const a=n.traffic28days,i=28;function e(o){return T().subtract(i+1,"day").isBefore(T(o.date))}const d={columns:a.columns.filter(o=>o.id!=="weekend").filter(o=>o.id!=="visitors"),data:a.data.filter(e)},{width:s}=b(),r=s<=360,c=s<=395,l=s<=428,m=s<=560,g=s<=820,h=r?".8rem":c?".85rem":l||m||g?".9rem":".85rem",y=170,p=340;return t.jsx(S,{tableData:d,tableWidth:y,tableHeight:p,fontSize:h})};function $({data:n}){const{width:a}=b(),i=a<=560,s={...{width:"100%",padding:"0px",marginBottom:12,alignItems:"center",marginLeft:"auto",marginRight:"auto"},...i?{}:{display:"flex"}};return t.jsx(D.Fragment,{children:t.jsx("div",{style:{textAlign:"center"},children:t.jsxs("div",{style:s,children:[t.jsx(O,{lineData:n}),t.jsx(X,{fullData:n})]})})})}const q=({data:n})=>{const a=n.popularCountries1,i=n.popularCountries2,{width:e}=b(),d=e<=560,c={...{width:"100%",padding:"0px",marginBottom:12,alignItems:"center",verticalAlign:"top",marginLeft:"auto",marginRight:"auto"},...d?{}:{display:"flex"}},l="400px",m=".95rem";return t.jsx("div",{style:{textAlign:"center"},children:t.jsxs("div",{style:c,children:[t.jsx(S,{tableData:a,tableWidth:l,fontSize:m,wrap:!0}),t.jsx("div",{style:{width:"75px"},children:" "}),t.jsx(S,{tableData:i,tableWidth:l,fontSize:m,wrap:!0})]})})};function J({data:n}){const{width:a}=b(),i=a<500,e=a<700,d=e?280:400,s=e?260:375,r=i?320:450,c={border:0,padding:"4px 8px 0px 0px",fontWeight:400},g={...{width:"100%",padding:"8px 16px",marginTop:16,alignItems:"center",marginLeft:"auto",marginRight:"auto"},...e?{}:{display:"flex"}},h=L.useMemo(()=>{const{popularCountries:x,popularEuropeanCountries:u,popularStates:j}=n.popularAreas;return[{label:"Worldwide",data:x,map:K},{label:"Europe",data:u,map:Q},{label:"US States",data:j,map:Z}]},[n]),[y,p]=L.useState(h[0]),o=L.useCallback(x=>p(x),[]);return t.jsxs("div",{style:{textAlign:"center"},children:[t.jsx(M,{options:h,onChange:o}),t.jsxs("div",{style:g,children:[t.jsx("div",{style:{backgroundColor:"#000",border:"1px solid #666",padding:12,align:"center",margin:"10px 0px 0px 0px",width:200,height:d,marginLeft:"auto",marginRight:"auto"},children:t.jsx(E,{id:"areaList",sx:{height:s,backgroundColor:"#111",margin:"auto"},children:t.jsxs(B,{stickyHeader:!0,children:[t.jsx(I,{children:t.jsxs(C,{children:[t.jsx(w,{style:{padding:"4px 10px 4px 12px",fontWeight:700,textAlign:"right"},children:"#"}),t.jsx(w,{style:{padding:"4px 0px",fontWeight:700},children:"Area"})]})}),t.jsx(Y,{children:y.data.data.map((x,u)=>t.jsxs(C,{index:u,children:[t.jsx(w,{style:c,sx:{textAlign:"right",padding:"0px",width:34},children:u+1},u+1),t.jsx(w,{style:c,children:x.area},x.area)]},u))})]})})}),t.jsx("div",{style:{flexGrow:1,width:r},children:t.jsx("img",{id:"mapImage",alt:"map",src:y.map,width:r})})]})]})}const K="https://explore.lpubelts.com/maps/mapWorld.gif",Q="https://explore.lpubelts.com/maps/mapEurope.gif",Z="https://explore.lpubelts.com/maps/mapUSA.gif";function gt(){var h;R("Site Report");const{data:n,loading:a,error:i}=P({urls:_}),{siteFullNew:e}=n||{},{width:d}=b(),r=d<560?"8px 8px 32px 8px":"24px 24px 32px 24px",c={margin:"0px 0px 36px 0px",width:"100%",textAlign:"center",color:"#fff"},l={margin:"46px 0px 18px 0px",width:"100%",textAlign:"center",color:"#fff"},m=(h=e==null?void 0:e.firstVistsLastSevenDays)!=null&&h.countryCount?l:c,g=a?"--":"(updated: "+T(e==null?void 0:e.metadata.updatedDateTime).format("MM/DD/YY hh:mm")+` ${e==null?void 0:e.metadata.timezone})`;return a?t.jsx(A,{}):i?null:t.jsxs("div",{style:{minWidth:"320px",maxWidth:900,height:"100%",padding:r,backgroundColor:"#292929",marginLeft:"auto",marginRight:"auto",fontSize:"1.5rem",lineHeight:.8},children:[!!e.firstVistsLastSevenDays.countryCount&&t.jsxs(D.Fragment,{children:[t.jsx("div",{style:c,children:"First Visits (Last Seven Days)"}),t.jsx(G,{data:e,tableWidth:"50%"})]}),t.jsxs("div",{style:m,children:["Site Summary",t.jsx("br",{}),t.jsx("span",{style:{fontSize:"0.85rem"},children:g})]}),t.jsx($,{data:e}),t.jsx("div",{style:l,children:"Weekly Lock Views"}),t.jsx(H,{data:e}),t.jsx("div",{style:l,children:"Page Tracking"}),t.jsx(U,{data:e}),t.jsx("div",{style:l,children:"Popular Areas"}),t.jsx(J,{data:e}),!!e.popularCountries1&&t.jsxs(D.Fragment,{children:[t.jsx("div",{style:l,children:"Popular Countries"}),t.jsx(q,{data:e})]})]})}const _={siteFullNew:V};export{gt as default};