import{j as t,R as j}from"./index-f302fb5f.js";import{u as W,L as V}from"./useData-45b8e819.js";import{u as h}from"./useWindowSize-09fa7587.js";import{d as v}from"./dayjs.min-4595a5e2.js";import{j as T,s as M}from"./dataUrls-1e5c3577.js";import{L as P}from"./LockViewsLine-aa2d82a9.js";import{A as f,p as R}from"./adminChartDefaults-1949a262.js";import{P as z}from"./nivo-line.es-715bcafa.js";import"./LPU-c3fa7122.js";import"./LinearProgress-f3c833be.js";import"./chartDefaults-e88ecc0b.js";import"./nivo-legends.es-2f3a245c.js";const A=({data:a})=>{const{firstVistsLastSevenDays:n}=a,{width:i}=h(),e=i<=360,r=i<=395,s=i<=428,c=i<=560,m=i<=820,d=e?".8rem":r?".85rem":s?".9rem":".95rem",o=400;return t.jsx(f,{tableData:n,tableWidth:o,fontSize:d})},C=({data:a})=>{const{pageTracking:n}=a,{width:i}=h(),e=i<=360,r=i<=395,s=i<=428,c=i<=560,m=i<=820,d=e?".8rem":r?".85rem":s?".9rem":".95rem",o="100%";return t.jsx(f,{tableData:n,tableWidth:o,fontSize:d})},H=({lineData:a})=>{const n=[a.traffic28days.data],i=[],e=new Map,r=new Map,s=new Map;n.forEach(l=>{const k=[],D=[],L=[];for(let p=0;p<l.length;p++){const w=new Map;w.x=l[p].date,w.y=l[p].visitors,k.push(w);const S=new Map;S.x=l[p].date,S.y=l[p].visits,D.push(S);const b=new Map;b.x=l[p].date,b.y=l[p].lockViews,L.push(b)}e.id="Visitors",e.data=k,r.id="Visits",r.data=D,s.id="Lock Views",s.data=L,i.push(r),i.push(e),i.push(s)});const{width:c}=h(),m=c<=360,d=c<=395,o=c<=428,u=c<=560,y=c<=820,x=m||d?200:o?210:y?230:350,g=u?{top:10,right:20,bottom:50,left:50}:{top:10,right:20,bottom:70,left:50};return t.jsx("div",{style:{height:x,width:"100%"},children:t.jsx(z,{theme:R,data:i,enableGridX:!1,enableGridY:!0,colors:["#5265ed","#082fd1","#4fa720"],lineWidth:3,margin:g,height:x,curve:"natural",yScale:{type:"linear",min:0,max:4e3,stacked:!1,reverse:!1},yFormat:" >-.2f",axisLeft:{tickValues:5,tickSize:5,tickPadding:5,tickRotation:0,format:","},xScale:{type:"time",format:"%Y-%m-%d"},xFormat:"time:%m/%d/%y",axisBottom:{format:"%b %d",tickSize:5,tickPadding:5,tickRotation:-45,direction:"row",legendOffset:-12,tickValues:"every day"},legends:[{anchor:"bottom",itemTextColor:"#444",direction:"row",justify:!1,translateX:0,translateY:70,itemsSpacing:0,itemWidth:100,itemHeight:20,symbolSize:13,symbolShape:"circle"}],enablePoints:!1,useMesh:!0,isInteractive:!0})})},F=({fullData:a})=>{const n=a.traffic28days,i=28;function e(l){return v().subtract(i+1,"day").isBefore(v(l.date))}const r={columns:n.columns.filter(l=>l.id!=="weekend").filter(l=>l.id!=="visitors"),data:n.data.filter(e)},{width:s}=h(),c=s<=360,m=s<=395,d=s<=428,o=s<=560,u=s<=820,y=c?".8rem":m?".85rem":d||o||u?".9rem":".85rem",x=170,g=340;return t.jsx(f,{tableData:r,tableWidth:x,tableHeight:g,fontSize:y})};function Y({data:a}){const{width:n}=h(),i=n<=560,s={...{width:"100%",padding:"0px",marginBottom:12,alignItems:"center",marginLeft:"auto",marginRight:"auto"},...i?{}:{display:"flex"}};return t.jsx(j.Fragment,{children:t.jsx("div",{style:{textAlign:"center"},children:t.jsxs("div",{style:s,children:[t.jsx(H,{lineData:a}),t.jsx(F,{fullData:a})]})})})}const B=({data:a})=>{const n=a.popularCountries1,i=a.popularCountries2,{width:e}=h(),r=e<=560,m={...{width:"100%",padding:"0px",marginBottom:12,alignItems:"center",verticalAlign:"top",marginLeft:"auto",marginRight:"auto"},...r?{}:{display:"flex"}},d="400px",o=".95rem";return t.jsx("div",{style:{textAlign:"center"},children:t.jsxs("div",{style:m,children:[t.jsx(f,{tableData:n,tableWidth:d,fontSize:o,wrap:!0}),t.jsx("div",{style:{width:"75px"},children:" "}),t.jsx(f,{tableData:i,tableWidth:d,fontSize:o,wrap:!0})]})})};function _(){var x;const{data:a,loading:n,error:i}=W({urls:I}),{siteFull:e,siteSummary:r}=a||{},{width:s}=h(),m=s<560?"8px 8px 32px 8px":"24px 24px 32px 24px",d={margin:"0px 0px 36px 0px",width:"100%",textAlign:"center",color:"#fff"},o={margin:"46px 0px 18px 0px",width:"100%",textAlign:"center",color:"#fff"},u=(x=e==null?void 0:e.firstVistsLastSevenDays)!=null&&x.countryCount?o:d,y=n?"--":"(updated: "+v(e==null?void 0:e.metadata.updatedDateTime).format("MM/DD/YY hh:mm")+` ${e==null?void 0:e.metadata.timezone})`;return n?t.jsx(V,{}):i?null:t.jsxs("div",{style:{minWidth:"320px",maxWidth:900,height:"100%",padding:m,backgroundColor:"#292929",marginLeft:"auto",marginRight:"auto",fontSize:"1.5rem",lineHeight:.8},children:[!!e.firstVistsLastSevenDays.countryCount&&t.jsxs(j.Fragment,{children:[t.jsx("div",{style:d,children:"First Visits (Last Seven Days)"}),t.jsx(A,{data:e,tableWidth:"50%"})]}),t.jsxs("div",{style:u,children:["Site Summary",t.jsx("br",{}),t.jsx("span",{style:{fontSize:"0.85rem"},children:y})]}),t.jsx(Y,{data:e}),t.jsx("div",{style:o,children:"Weekly Lock Views"}),t.jsx(P,{data:r}),t.jsx("div",{style:o,children:"Page Tracking"}),t.jsx(C,{data:e}),!!e.popularCountries1&&t.jsxs(j.Fragment,{children:[t.jsx("div",{style:o,children:"Popular Countries"}),t.jsx(B,{data:e})]})]})}const I={siteFull:T,siteSummary:M};export{_ as default};
