import{j as t}from"./index-f302fb5f.js";import{P as m}from"./nivo-line.es-715bcafa.js";import{p as n}from"./chartDefaults-e88ecc0b.js";import{u as l}from"./useWindowSize-09fa7587.js";function x({data:i}){const{lockViews:o}=i,{width:e}=l(),a=e<=360,s=e<=560,r=a?260:s?300:350;return t.jsx("div",{style:{height:r},children:t.jsx(m,{theme:d,data:o,colors:["#4fa720"],lineWidth:3,margin:{top:10,right:20,bottom:50,left:55},xScale:{type:"time",format:"%Y-%m-%d"},xFormat:"time:%m/%d/%y",yScale:{type:"linear",min:"auto",max:"auto",stacked:!0,reverse:!1},curve:"natural",axisBottom:{format:"%b",tickValues:"every 1 month",legendOffset:-12},axisLeft:{tickSize:0,tickPadding:5,tickRotation:0,format:","},enableGridX:!1,enablePoints:!1,useMesh:!0,isInteractive:!1})})}const c={grid:{line:{stroke:"#333",strokeWidth:1}}},d={...n,...c};export{x as L};
