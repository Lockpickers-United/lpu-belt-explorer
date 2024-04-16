import{j as t,R as j}from"./index-cbca58c3.js";import{u as W,L as T}from"./useData-1d4b4283.js";import{u as V}from"./usePageTitle-5a944a63.js";import{u as h}from"./useWindowSize-9ae36387.js";import{d as v}from"./dayjs.min-49a5dac8.js";import{j as P,s as R}from"./dataUrls-c8217d3b.js";import{L as M}from"./LockViewsLine-8e3afb03.js";import{A as f,p as z}from"./adminChartDefaults-695c04ac.js";import{P as A}from"./nivo-line.es-c66bdc4f.js";import"./LPU-c3fa7122.js";import"./LinearProgress-921b0efb.js";import"./useDocumentTitle-7f078a8b.js";import"./chartDefaults-e88ecc0b.js";import"./nivo-legends.es-b1959a45.js";const C=({data:a})=>{const{firstVistsLastSevenDays:o}=a,{width:i}=h(),e=i<=360,r=i<=395,s=i<=428,l=i<=560,m=i<=820,c=e?".8rem":r?".85rem":s?".9rem":".95rem",n=400;return t.jsx(f,{tableData:o,tableWidth:n,fontSize:c})},H=({data:a})=>{const{pageTracking:o}=a,{width:i}=h(),e=i<=360,r=i<=395,s=i<=428,l=i<=560,m=i<=820,c=e?".8rem":r?".85rem":s?".9rem":".95rem",n="100%";return t.jsx(f,{tableData:o,tableWidth:n,fontSize:c})},F=({lineData:a})=>{const o=[a.traffic28days.data],i=[],e=new Map,r=new Map,s=new Map;o.forEach(d=>{const k=[],D=[],L=[];for(let p=0;p<d.length;p++){const w=new Map;w.x=d[p].date,w.y=d[p].visitors,k.push(w);const S=new Map;S.x=d[p].date,S.y=d[p].visits,D.push(S);const b=new Map;b.x=d[p].date,b.y=d[p].lockViews,L.push(b)}e.id="Visitors",e.data=k,r.id="Visits",r.data=D,s.id="Lock Views",s.data=L,i.push(r),i.push(e),i.push(s)});const{width:l}=h(),m=l<=360,c=l<=395,n=l<=428,u=l<=560,y=l<=820,x=m||c?200:n?210:y?230:350,g=u?{top:10,right:20,bottom:50,left:50}:{top:10,right:20,bottom:70,left:50};return t.jsx("div",{style:{height:x,width:"100%"},children:t.jsx(A,{theme:z,data:i,enableGridX:!1,enableGridY:!0,colors:["#5265ed","#082fd1","#4fa720"],lineWidth:3,margin:g,height:x,curve:"natural",yScale:{type:"linear",min:0,max:4e3,stacked:!1,reverse:!1},yFormat:" >-.2f",axisLeft:{tickValues:5,tickSize:5,tickPadding:5,tickRotation:0,format:","},xScale:{type:"time",format:"%Y-%m-%d"},xFormat:"time:%m/%d/%y",axisBottom:{format:"%b %d",tickSize:5,tickPadding:5,tickRotation:-45,direction:"row",legendOffset:-12,tickValues:"every day"},legends:[{anchor:"bottom",itemTextColor:"#444",direction:"row",justify:!1,translateX:0,translateY:70,itemsSpacing:0,itemWidth:100,itemHeight:20,symbolSize:13,symbolShape:"circle"}],enablePoints:!1,useMesh:!0,isInteractive:!0})})},Y=({fullData:a})=>{const o=a.traffic28days,i=28;function e(d){return v().subtract(i+1,"day").isBefore(v(d.date))}const r={columns:o.columns.filter(d=>d.id!=="weekend").filter(d=>d.id!=="visitors"),data:o.data.filter(e)},{width:s}=h(),l=s<=360,m=s<=395,c=s<=428,n=s<=560,u=s<=820,y=l?".8rem":m?".85rem":c||n||u?".9rem":".85rem",x=170,g=340;return t.jsx(f,{tableData:r,tableWidth:x,tableHeight:g,fontSize:y})};function B({data:a}){const{width:o}=h(),i=o<=560,s={...{width:"100%",padding:"0px",marginBottom:12,alignItems:"center",marginLeft:"auto",marginRight:"auto"},...i?{}:{display:"flex"}};return t.jsx(j.Fragment,{children:t.jsx("div",{style:{textAlign:"center"},children:t.jsxs("div",{style:s,children:[t.jsx(F,{lineData:a}),t.jsx(Y,{fullData:a})]})})})}const I=({data:a})=>{const o=a.popularCountries1,i=a.popularCountries2,{width:e}=h(),r=e<=560,m={...{width:"100%",padding:"0px",marginBottom:12,alignItems:"center",verticalAlign:"top",marginLeft:"auto",marginRight:"auto"},...r?{}:{display:"flex"}},c="400px",n=".95rem";return t.jsx("div",{style:{textAlign:"center"},children:t.jsxs("div",{style:m,children:[t.jsx(f,{tableData:o,tableWidth:c,fontSize:n,wrap:!0}),t.jsx("div",{style:{width:"75px"},children:" "}),t.jsx(f,{tableData:i,tableWidth:c,fontSize:n,wrap:!0})]})})};function it(){var x;V("Site Report");const{data:a,loading:o,error:i}=W({urls:E}),{siteFull:e,siteSummary:r}=a||{},{width:s}=h(),m=s<560?"8px 8px 32px 8px":"24px 24px 32px 24px",c={margin:"0px 0px 36px 0px",width:"100%",textAlign:"center",color:"#fff"},n={margin:"46px 0px 18px 0px",width:"100%",textAlign:"center",color:"#fff"},u=(x=e==null?void 0:e.firstVistsLastSevenDays)!=null&&x.countryCount?n:c,y=o?"--":"(updated: "+v(e==null?void 0:e.metadata.updatedDateTime).format("MM/DD/YY hh:mm")+` ${e==null?void 0:e.metadata.timezone})`;return o?t.jsx(T,{}):i?null:t.jsxs("div",{style:{minWidth:"320px",maxWidth:900,height:"100%",padding:m,backgroundColor:"#292929",marginLeft:"auto",marginRight:"auto",fontSize:"1.5rem",lineHeight:.8},children:[!!e.firstVistsLastSevenDays.countryCount&&t.jsxs(j.Fragment,{children:[t.jsx("div",{style:c,children:"First Visits (Last Seven Days)"}),t.jsx(C,{data:e,tableWidth:"50%"})]}),t.jsxs("div",{style:u,children:["Site Summary",t.jsx("br",{}),t.jsx("span",{style:{fontSize:"0.85rem"},children:y})]}),t.jsx(B,{data:e}),t.jsx("div",{style:n,children:"Weekly Lock Views"}),t.jsx(M,{data:r}),t.jsx("div",{style:n,children:"Page Tracking"}),t.jsx(H,{data:e}),!!e.popularCountries1&&t.jsxs(j.Fragment,{children:[t.jsx("div",{style:n,children:"Popular Countries"}),t.jsx(I,{data:e})]})]})}const E={siteFull:P,siteSummary:R};export{it as default};