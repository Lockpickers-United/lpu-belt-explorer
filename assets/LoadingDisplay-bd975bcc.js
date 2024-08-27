import{be as L,bf as T,r as D,bg as z,bh as E,bi as F,j as t,bj as U,d as B,g as M,a as W,b3 as w,s as C,c as f,_ as x,b4 as I,u as G,b as K,e as H,bk as V,bl as Z,bm as q,R as A}from"./index-c172f830.js";const J=["className","component"];function O(e={}){const{themeId:s,defaultTheme:r,defaultClassName:a="MuiBox-root",generateClassName:c}=e,u=L("div",{shouldForwardProp:o=>o!=="theme"&&o!=="sx"&&o!=="as"})(T);return D.forwardRef(function(p,l){const n=z(r),m=E(p),{className:v,component:d="div"}=m,h=F(m,J);return t.jsx(u,U({as:d,ref:l,className:B(v,c?c(a):a),theme:s&&n[s]||n},h))})}function Q(e){return W("MuiCircularProgress",e)}const X=M("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]),Y=X,ee=["className","color","disableShrink","size","style","thickness","value","variant"];let g=e=>e,$,j,R,_;const i=44,se=w($||($=g`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`)),re=w(j||(j=g`
  0% {
    stroke-dasharray: 1px, 200px;
    stroke-dashoffset: 0;
  }

  50% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -15px;
  }

  100% {
    stroke-dasharray: 100px, 200px;
    stroke-dashoffset: -125px;
  }
`)),te=e=>{const{classes:s,variant:r,color:a,disableShrink:c}=e,u={root:["root",r,`color${f(a)}`],svg:["svg"],circle:["circle",`circle${f(r)}`,c&&"circleDisableShrink"]};return H(u,Q,s)},ae=C("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(e,s)=>{const{ownerState:r}=e;return[s.root,s[r.variant],s[`color${f(r.color)}`]]}})(({ownerState:e,theme:s})=>x({display:"inline-block"},e.variant==="determinate"&&{transition:s.transitions.create("transform")},e.color!=="inherit"&&{color:(s.vars||s).palette[e.color].main}),({ownerState:e})=>e.variant==="indeterminate"&&I(R||(R=g`
      animation: ${0} 1.4s linear infinite;
    `),se)),oe=C("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(e,s)=>s.svg})({display:"block"}),ie=C("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(e,s)=>{const{ownerState:r}=e;return[s.circle,s[`circle${f(r.variant)}`],r.disableShrink&&s.circleDisableShrink]}})(({ownerState:e,theme:s})=>x({stroke:"currentColor"},e.variant==="determinate"&&{transition:s.transitions.create("stroke-dashoffset")},e.variant==="indeterminate"&&{strokeDasharray:"80px, 200px",strokeDashoffset:0}),({ownerState:e})=>e.variant==="indeterminate"&&!e.disableShrink&&I(_||(_=g`
      animation: ${0} 1.4s ease-in-out infinite;
    `),re)),ne=D.forwardRef(function(s,r){const a=G({props:s,name:"MuiCircularProgress"}),{className:c,color:u="primary",disableShrink:b=!1,size:o=40,style:p,thickness:l=3.6,value:n=0,variant:m="indeterminate"}=a,v=K(a,ee),d=x({},a,{color:u,disableShrink:b,size:o,thickness:l,value:n,variant:m}),h=te(d),k={},y={},P={};if(m==="determinate"){const S=2*Math.PI*((i-l)/2);k.strokeDasharray=S.toFixed(3),P["aria-valuenow"]=Math.round(n),k.strokeDashoffset=`${((100-n)/100*S).toFixed(3)}px`,y.transform="rotate(-90deg)"}return t.jsx(ae,x({className:B(h.root,c),style:x({width:o,height:o},y,p),ownerState:d,ref:r,role:"progressbar"},P,v,{children:t.jsx(oe,{className:h.svg,ownerState:d,viewBox:`${i/2} ${i/2} ${i} ${i}`,children:t.jsx(ie,{className:h.circle,style:k,ownerState:d,cx:i,cy:i,r:(i-l)/2,fill:"none",strokeWidth:l})})}))}),N=ne,ce=M("MuiBox",["root"]),le=ce,de=V(),ue=O({themeId:Z,defaultTheme:de,defaultClassName:le.root,generateClassName:q.generate}),me=ue;function xe(){return t.jsx(A.Fragment,{children:t.jsx("div",{style:{display:"flex",placeItems:"center",width:"100%",alignItems:"center",height:200,marginRight:"auto",marginLeft:"auto"},children:t.jsx("div",{style:{marginRight:"auto",marginLeft:"auto"},children:t.jsxs(me,{sx:{position:"relative"},children:[t.jsx(N,{variant:"determinate",sx:{color:e=>e.palette.grey[e.palette.mode==="light"?200:800]},size:60,thickness:4,value:100}),t.jsx(N,{variant:"indeterminate",disableShrink:!0,sx:{color:e=>e.palette.mode==="light"?"#1a90ff":"#308fe8",animationDuration:"550ms",position:"absolute",left:0,[`& .${Y.circle}`]:{strokeLinecap:"round"}},size:60,thickness:4})]})})})})}export{me as B,xe as L};
