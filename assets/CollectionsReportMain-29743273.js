import{j as t,r as L}from"./index-cbca58c3.js";import{u as j,L as S}from"./useData-1d4b4283.js";import{u as v}from"./usePageTitle-5a944a63.js";import{u as p}from"./useWindowSize-9ae36387.js";import{d as f}from"./dayjs.min-49a5dac8.js";import{A as u,p as x,b as W}from"./adminChartDefaults-695c04ac.js";import{B as y}from"./nivo-bar.es-80616ca5.js";import{P as k}from"./nivo-line.es-c66bdc4f.js";import{i as D}from"./dataUrls-c8217d3b.js";import"./LPU-c3fa7122.js";import"./LinearProgress-921b0efb.js";import"./useDocumentTitle-7f078a8b.js";import"./nivo-legends.es-b1959a45.js";const M=({data:i})=>{const{summary:n}=i,{width:e}=p(),o=e<=360,r=e<=395,l=e<=428,d=e<=560,h=e<=820,a=o?".8rem":r?".85rem":l?".9rem":".95rem",s="100%";return t.jsx(u,{tableData:n,tableWidth:s,fontSize:a})},T=({data:i})=>{const{summary:{data:n}}=i,e=n.map(c=>({id:c.list,label:c.list,count:c.averageItems,value:c.averageItems})),{width:o}=p(),r=o<=360,l=o<=395,d=o<=428,h=o<=820,a=r?180:l?190:d?200:h?240:250,s={top:0,right:20,bottom:30,left:50},m=["#aeaeae","#0364ac","#0364ac","#0364ac","#0364ac"];return t.jsx("div",{style:{height:a,width:"100%"},children:t.jsx(y,{data:e,margin:s,padding:.15,colors:c=>m[c.index%m.length],animate:!0,enableLabel:!0,axisLeft:{tickSize:5,tickPadding:5,tickRotation:0},enableGridY:!1,theme:x,isInteractive:!1})})},B=({data:i})=>{const n=[i.listUsers],{width:e}=p(),o=e<=360,r=e<=395,l=e<=428,d=e<=560,h=e<=820,a=o||r?200:l?210:h?230:250,s=d?-45:0,m=d?{top:10,right:20,bottom:50,left:50}:{top:10,right:20,bottom:30,left:50};return t.jsx("div",{style:{height:a},children:t.jsx(k,{theme:P,data:n,enableGridX:!1,enableGridY:!1,colors:["#007de2","#16325d"],lineWidth:3,margin:m,height:a,curve:"natural",yScale:{type:"linear",min:0,max:"auto",stacked:!1,reverse:!1},yFormat:" >-.2f",axisLeft:{tickValues:5,tickSize:5,tickPadding:5,tickRotation:0,format:","},xScale:{type:"time",format:"%Y-%m-%d"},xFormat:"time:%m/%d/%y",axisBottom:{format:"%b %d",tickSize:5,tickPadding:5,tickRotation:s,direction:"row",legendOffset:-12,tickValues:"every week"},legends:[{anchor:"bottom",itemTextColor:"#ddd",direction:"row",justify:!1,translateX:0,translateY:75,itemsSpacing:0,itemWidth:100,itemHeight:20,symbolSize:13,symbolShape:"circle"}],enablePoints:!1,useMesh:!0,isInteractive:!1})})},C={grid:{line:{stroke:"#333",strokeWidth:1}}},P={...x,...C},z=({data:i})=>{const n=[i.ownLocks,i.pickedLocks,i.recordedLocks,i.wishlistLocks],{width:e}=p(),o=e<=360,r=e<=395,l=e<=428,d=e<=560,h=e<=820,a=o?200:r?220:l?230:h?260:290,s=d?-45:0,m={top:10,right:20,bottom:65,left:50},c=["#172072","#2e399b","#444fb2","#5966da"];return t.jsx("div",{style:{height:a,width:"100%"},children:t.jsx(k,{theme:Y,data:n,colors:c,enableArea:!0,areaOpacity:1,lineWidth:2,margin:m,curve:"natural",yScale:{type:"linear",min:0,max:"auto",stacked:!0,reverse:!1},yFormat:" >-.2f",axisLeft:{tickValues:5,tickSize:5,tickPadding:5,tickRotation:0,format:","},xScale:{type:"time",format:"%Y-%m-%d"},xFormat:"time:%m/%d/%y",enableGridX:!1,enableGridY:!1,axisBottom:{format:"%b %d",tickSize:5,tickPadding:5,tickRotation:s,tickValues:"every week"},legends:[{anchor:"bottom",itemTextColor:"#666",direction:"row",justify:!1,translateX:0,translateY:65,itemsSpacing:6,itemWidth:100,itemHeight:20,symbolSize:13,symbolShape:"circle"}],enablePoints:!1,useMesh:!0,isInteractive:!1})})},R={grid:{line:{stroke:"#333",strokeWidth:1}}},Y={...x,...R},A=({data:i})=>{const{listSavesByBelt:n}=i,{width:e}=p(),o=e<=360,r=e<=395,l=e<=428,d=e<=560,h=e<=820,a=o||r||l?200:h?250:290,s=d?1:2,m={top:0,right:20,bottom:30,left:50};return t.jsx("div",{style:{height:a},children:t.jsx(y,{data:n,keys:["White","Yellow","Orange","Green","Blue","Purple","Brown","Red","Black","Unranked"],indexBy:"list",groupMode:"grouped",margin:m,padding:.1,innerPadding:0,borderRadius:s,valueScale:{type:"linear"},indexScale:{type:"band",round:!0},maxValue:"auto",theme:x,colors:W,animate:!0,enableGridY:!1,enableLabel:!1,axisLeft:{tickSize:5,tickPadding:5,tickRotation:0,format:","},isInteractive:!0})})};function F({data:i}){const n=L.useMemo(()=>{const{dailyTableData:r}=i,l=r.data.map(a=>a.date),h=f(l.reduce((a,s)=>s>a?s:a)).subtract(28,"day");return{title:"",columns:r.columns,data:r.data.filter(a=>f(a.date).isAfter(h))}},[i]),e="100%",o=".83rem";return t.jsx("div",{style:{width:"100%"},children:t.jsx(u,{tableData:n,tableWidth:e,fontSize:o})})}const H=({data:i})=>{const{topLocksOwn:n,topLocksPicked:e,topLocksRecorded:o,topLocksWishlist:r}=i.topLocksFull,{width:l}=p(),d=l<=560,s={...{width:"100%",padding:"0px",marginBottom:12,alignItems:"center",verticalAlign:"top",marginLeft:"auto",marginRight:"auto"},...d?{}:{display:"flex"}},m="400px",c=".83rem";return t.jsxs("div",{style:{textAlign:"center"},children:[t.jsxs("div",{style:s,children:[t.jsx(u,{tableData:n,tableWidth:m,fontSize:c,wrap:!0}),t.jsx("div",{style:{width:"75px"},children:" "}),t.jsx(u,{tableData:e,tableWidth:m,fontSize:c,wrap:!0})]}),t.jsxs("div",{style:s,children:[t.jsx(u,{tableData:o,tableWidth:m,fontSize:c,wrap:!0}),t.jsx("div",{style:{width:"75px"},children:" "}),t.jsx(u,{tableData:r,tableWidth:m,fontSize:c,wrap:!0})]})]})};function _(){v("Collection Report");const{data:i,loading:n,error:e}=j({url:D}),o=n?"--":"(updated: "+f(i.metadata.updatedDateTime).format("MM/DD/YY hh:mm")+` ${i.metadata.timezone})`,l=["listUsers","wishlistLocks","recordedLocks","pickedLocks","ownLocks"].reduce((c,g)=>{if(!i)return{};const w=i.dailyTableData.data.map(b=>({x:b.date,y:b[g]}));return c[g]={data:w,id:g},c},{}),{width:d}=p(),a=d<560?"8px 8px 32px 8px":"24px 24px 32px 24px",s={margin:"46px 0px 18px 0px",width:"100%",textAlign:"center",color:"#fff"},m={margin:"0px 0px 36px 0px",width:"100%",textAlign:"center",color:"#fff"};return n?t.jsx(S,{}):e?null:t.jsxs("div",{style:{minWidth:"320px",maxWidth:900,height:"100%",padding:a,backgroundColor:"#292929",marginLeft:"auto",marginRight:"auto",fontSize:"1.5rem",lineHeight:.8},children:[t.jsxs("div",{style:m,children:["Collections Summary",t.jsx("br",{}),t.jsx("span",{style:{fontSize:"0.85rem"},children:o})]}),t.jsx(M,{data:i}),t.jsx("div",{style:s,children:"List Users"}),t.jsx(B,{data:l}),t.jsx("div",{style:s,children:"List Locks by Date"}),t.jsx(z,{data:l}),t.jsx("div",{style:s,children:"Average Items Per List"}),t.jsx(T,{data:i}),t.jsx("div",{style:s,children:"List Saves by Belt Ranking"}),t.jsx(A,{data:i}),t.jsx("div",{style:s,children:"Last 28 Days"}),t.jsx(F,{data:i}),t.jsx("div",{style:s,children:"Top Locks"}),t.jsx(H,{data:i})]})}export{_ as default};