import{u as m,j as t}from"./index-a08903d0.js";import{P as n}from"./nivo-line.es-6b224315.js";import{p as c}from"./chartDefaults-9fc07b21.js";function p({data:i}){const{lockViews:o}=i,{width:e}=m(),a=e<=360,s=e<=560,r=a?260:s?300:350;return t.jsx("div",{style:{height:r},children:t.jsx(n,{theme:d,data:o,colors:["#4fa720"],lineWidth:3,margin:{top:10,right:20,bottom:50,left:55},xScale:{type:"time",format:"%Y-%m-%d"},xFormat:"time:%m/%d/%y",yScale:{type:"linear",min:"auto",max:"auto",stacked:!0,reverse:!1},curve:"natural",axisBottom:{format:"%b",tickValues:"every 1 month",legendOffset:-12},axisLeft:{tickSize:0,tickPadding:5,tickRotation:0,format:","},enableGridX:!1,enablePoints:!1,useMesh:!0,isInteractive:!0})})}const l={grid:{line:{stroke:"#333",strokeWidth:1}}},d={...c,...l};export{p as L};