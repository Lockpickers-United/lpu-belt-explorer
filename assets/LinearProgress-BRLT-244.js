import{m as R,n as j,r as q,o as O,E as z,j as u,p as M,q as t,s as N,t as c,w as d,bR as P,bS as $,bv as l,bT as w,bU as D}from"./index-Kgl83hA3.js";function S(e){return R("MuiLinearProgress",e)}j("MuiLinearProgress",["root","colorPrimary","colorSecondary","determinate","indeterminate","buffer","query","dashed","dashedColorPrimary","dashedColorSecondary","bar","bar1","bar2","barColorPrimary","barColorSecondary","bar1Indeterminate","bar1Determinate","bar1Buffer","bar2Indeterminate","bar2Buffer"]);const v=4,y=$`
  0% {
    left: -35%;
    right: 100%;
  }

  60% {
    left: 100%;
    right: -90%;
  }

  100% {
    left: 100%;
    right: -90%;
  }
`,A=typeof y!="string"?P`
        animation: ${y} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
      `:null,C=$`
  0% {
    left: -200%;
    right: 100%;
  }

  60% {
    left: 107%;
    right: -8%;
  }

  100% {
    left: 107%;
    right: -8%;
  }
`,T=typeof C!="string"?P`
        animation: ${C} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite;
      `:null,h=$`
  0% {
    opacity: 1;
    background-position: 0 -23px;
  }

  60% {
    opacity: 0;
    background-position: 0 -23px;
  }

  100% {
    opacity: 1;
    background-position: -200px -23px;
  }
`,U=typeof h!="string"?P`
        animation: ${h} 3s infinite linear;
      `:null,E=e=>{const{classes:r,variant:a,color:n}=e,m={root:["root",`color${t(n)}`,a],dashed:["dashed",`dashedColor${t(n)}`],bar1:["bar","bar1",`barColor${t(n)}`,(a==="indeterminate"||a==="query")&&"bar1Indeterminate",a==="determinate"&&"bar1Determinate",a==="buffer"&&"bar1Buffer"],bar2:["bar","bar2",a!=="buffer"&&`barColor${t(n)}`,a==="buffer"&&`color${t(n)}`,(a==="indeterminate"||a==="query")&&"bar2Indeterminate",a==="buffer"&&"bar2Buffer"]};return N(m,S,r)},x=(e,r)=>e.vars?e.vars.palette.LinearProgress[`${r}Bg`]:e.palette.mode==="light"?w(e.palette[r].main,.62):D(e.palette[r].main,.5),K=c("span",{name:"MuiLinearProgress",slot:"Root",overridesResolver:(e,r)=>{const{ownerState:a}=e;return[r.root,r[`color${t(a.color)}`],r[a.variant]]}})(d(({theme:e})=>({position:"relative",overflow:"hidden",display:"block",height:4,zIndex:0,"@media print":{colorAdjust:"exact"},variants:[...Object.entries(e.palette).filter(l()).map(([r])=>({props:{color:r},style:{backgroundColor:x(e,r)}})),{props:({ownerState:r})=>r.color==="inherit"&&r.variant!=="buffer",style:{"&::before":{content:'""',position:"absolute",left:0,top:0,right:0,bottom:0,backgroundColor:"currentColor",opacity:.3}}},{props:{variant:"buffer"},style:{backgroundColor:"transparent"}},{props:{variant:"query"},style:{transform:"rotate(180deg)"}}]}))),X=c("span",{name:"MuiLinearProgress",slot:"Dashed",overridesResolver:(e,r)=>{const{ownerState:a}=e;return[r.dashed,r[`dashedColor${t(a.color)}`]]}})(d(({theme:e})=>({position:"absolute",marginTop:0,height:"100%",width:"100%",backgroundSize:"10px 10px",backgroundPosition:"0 -23px",variants:[{props:{color:"inherit"},style:{opacity:.3,backgroundImage:"radial-gradient(currentColor 0%, currentColor 16%, transparent 42%)"}},...Object.entries(e.palette).filter(l()).map(([r])=>{const a=x(e,r);return{props:{color:r},style:{backgroundImage:`radial-gradient(${a} 0%, ${a} 16%, transparent 42%)`}}})]})),U||{animation:`${h} 3s infinite linear`}),F=c("span",{name:"MuiLinearProgress",slot:"Bar1",overridesResolver:(e,r)=>{const{ownerState:a}=e;return[r.bar,r.bar1,r[`barColor${t(a.color)}`],(a.variant==="indeterminate"||a.variant==="query")&&r.bar1Indeterminate,a.variant==="determinate"&&r.bar1Determinate,a.variant==="buffer"&&r.bar1Buffer]}})(d(({theme:e})=>({width:"100%",position:"absolute",left:0,bottom:0,top:0,transition:"transform 0.2s linear",transformOrigin:"left",variants:[{props:{color:"inherit"},style:{backgroundColor:"currentColor"}},...Object.entries(e.palette).filter(l()).map(([r])=>({props:{color:r},style:{backgroundColor:(e.vars||e).palette[r].main}})),{props:{variant:"determinate"},style:{transition:`transform .${v}s linear`}},{props:{variant:"buffer"},style:{zIndex:1,transition:`transform .${v}s linear`}},{props:({ownerState:r})=>r.variant==="indeterminate"||r.variant==="query",style:{width:"auto"}},{props:({ownerState:r})=>r.variant==="indeterminate"||r.variant==="query",style:A||{animation:`${y} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite`}}]}))),V=c("span",{name:"MuiLinearProgress",slot:"Bar2",overridesResolver:(e,r)=>{const{ownerState:a}=e;return[r.bar,r.bar2,r[`barColor${t(a.color)}`],(a.variant==="indeterminate"||a.variant==="query")&&r.bar2Indeterminate,a.variant==="buffer"&&r.bar2Buffer]}})(d(({theme:e})=>({width:"100%",position:"absolute",left:0,bottom:0,top:0,transition:"transform 0.2s linear",transformOrigin:"left",variants:[...Object.entries(e.palette).filter(l()).map(([r])=>({props:{color:r},style:{"--LinearProgressBar2-barColor":(e.vars||e).palette[r].main}})),{props:({ownerState:r})=>r.variant!=="buffer"&&r.color!=="inherit",style:{backgroundColor:"var(--LinearProgressBar2-barColor, currentColor)"}},{props:({ownerState:r})=>r.variant!=="buffer"&&r.color==="inherit",style:{backgroundColor:"currentColor"}},{props:{color:"inherit"},style:{opacity:.3}},...Object.entries(e.palette).filter(l()).map(([r])=>({props:{color:r,variant:"buffer"},style:{backgroundColor:x(e,r),transition:`transform .${v}s linear`}})),{props:({ownerState:r})=>r.variant==="indeterminate"||r.variant==="query",style:{width:"auto"}},{props:({ownerState:r})=>r.variant==="indeterminate"||r.variant==="query",style:T||{animation:`${C} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite`}}]}))),G=q.forwardRef(function(r,a){const n=O({props:r,name:"MuiLinearProgress"}),{className:m,color:B="primary",value:g,valueBuffer:k,variant:i="indeterminate",...I}=n,s={...n,color:B,variant:i},p=E(s),L=z(),b={},f={bar1:{},bar2:{}};if((i==="determinate"||i==="buffer")&&g!==void 0){b["aria-valuenow"]=Math.round(g),b["aria-valuemin"]=0,b["aria-valuemax"]=100;let o=g-100;L&&(o=-o),f.bar1.transform=`translateX(${o}%)`}if(i==="buffer"&&k!==void 0){let o=(k||0)-100;L&&(o=-o),f.bar2.transform=`translateX(${o}%)`}return u.jsxs(K,{className:M(p.root,m),ownerState:s,role:"progressbar",...b,ref:a,...I,children:[i==="buffer"?u.jsx(X,{className:p.dashed,ownerState:s}):null,u.jsx(F,{className:p.bar1,ownerState:s,style:f.bar1}),i==="determinate"?null:u.jsx(V,{className:p.bar2,ownerState:s,style:f.bar2})]})});export{G as L};
