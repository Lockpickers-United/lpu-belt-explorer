import{j as l,r as i}from"./index-c20bd96b.js";import{P as m}from"./nivo-line.es-f8873336.js";import{p as d}from"./chartDefaults-9fc07b21.js";import{u}from"./useWindowSize-a9ee710e.js";import{T as f,a as b}from"./ToggleButtonGroup-ee4a38df.js";function j({data:t}){const{lockViews:r}=t,{width:a}=u(),o=a<=360,s=a<=560,e=o?260:s?300:350;return l.jsx("div",{style:{height:e},children:l.jsx(m,{theme:x,data:r,colors:["#4fa720"],lineWidth:3,margin:{top:10,right:20,bottom:50,left:55},xScale:{type:"time",format:"%Y-%m-%d"},xFormat:"time:%m/%d/%y",yScale:{type:"linear",min:"auto",max:"auto",stacked:!0,reverse:!1},curve:"natural",axisBottom:{format:"%b",tickValues:"every 1 month",legendOffset:-12},axisLeft:{tickSize:0,tickPadding:5,tickRotation:0,format:","},enableGridX:!1,enablePoints:!1,useMesh:!0,isInteractive:!1})})}const h={grid:{line:{stroke:"#333",strokeWidth:1}}},x={...d,...h};function S({options:t,onChange:r}){const[a,o]=i.useState(t[0].label),s=i.useCallback(e=>()=>{const c=t.find(n=>n.label===e);o(e),r&&r(c)},[r,t]);return l.jsx(f,{variant:"outlined",children:t.map(e=>l.jsx(b,{onClick:s(e.label),style:{color:a===e.label?"#eee":"#777",backgroundColor:a===e.label?"#292929":"#111",padding:"6px 12px",borderColor:"#000",borderRadius:0},value:a,children:e.label},e.label))})}export{S as C,j as L};
