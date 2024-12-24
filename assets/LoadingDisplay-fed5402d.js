import{f as L,h as z,b4 as R,s as x,k as l,_ as o,b5 as D,r as I,m as N,n as U,j as t,o as B,p as E,R as F}from"./index-fb51a57b.js";import{B as K}from"./Box-1dad5068.js";function W(r){return z("MuiCircularProgress",r)}const G=L("MuiCircularProgress",["root","determinate","indeterminate","colorPrimary","colorSecondary","svg","circle","circleDeterminate","circleIndeterminate","circleDisableShrink"]),T=G,V=["className","color","disableShrink","size","style","thickness","value","variant"];let d=r=>r,P,S,b,$;const a=44,Z=R(P||(P=d`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`)),q=R(S||(S=d`
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
`)),A=r=>{const{classes:e,variant:s,color:i,disableShrink:u}=r,m={root:["root",s,`color${l(i)}`],svg:["svg"],circle:["circle",`circle${l(s)}`,u&&"circleDisableShrink"]};return E(m,W,e)},H=x("span",{name:"MuiCircularProgress",slot:"Root",overridesResolver:(r,e)=>{const{ownerState:s}=r;return[e.root,e[s.variant],e[`color${l(s.color)}`]]}})(({ownerState:r,theme:e})=>o({display:"inline-block"},r.variant==="determinate"&&{transition:e.transitions.create("transform")},r.color!=="inherit"&&{color:(e.vars||e).palette[r.color].main}),({ownerState:r})=>r.variant==="indeterminate"&&D(b||(b=d`
      animation: ${0} 1.4s linear infinite;
    `),Z)),J=x("svg",{name:"MuiCircularProgress",slot:"Svg",overridesResolver:(r,e)=>e.svg})({display:"block"}),O=x("circle",{name:"MuiCircularProgress",slot:"Circle",overridesResolver:(r,e)=>{const{ownerState:s}=r;return[e.circle,e[`circle${l(s.variant)}`],s.disableShrink&&e.circleDisableShrink]}})(({ownerState:r,theme:e})=>o({stroke:"currentColor"},r.variant==="determinate"&&{transition:e.transitions.create("stroke-dashoffset")},r.variant==="indeterminate"&&{strokeDasharray:"80px, 200px",strokeDashoffset:0}),({ownerState:r})=>r.variant==="indeterminate"&&!r.disableShrink&&D($||($=d`
      animation: ${0} 1.4s ease-in-out infinite;
    `),q)),Q=I.forwardRef(function(e,s){const i=N({props:e,name:"MuiCircularProgress"}),{className:u,color:m="primary",disableShrink:_=!1,size:h=40,style:M,thickness:n=3.6,value:g=0,variant:v="indeterminate"}=i,w=U(i,V),c=o({},i,{color:m,disableShrink:_,size:h,thickness:n,value:g,variant:v}),p=A(c),f={},k={},y={};if(v==="determinate"){const C=2*Math.PI*((a-n)/2);f.strokeDasharray=C.toFixed(3),y["aria-valuenow"]=Math.round(g),f.strokeDashoffset=`${((100-g)/100*C).toFixed(3)}px`,k.transform="rotate(-90deg)"}return t.jsx(H,o({className:B(p.root,u),style:o({width:h,height:h},k,M),ownerState:c,ref:s,role:"progressbar"},y,w,{children:t.jsx(J,{className:p.svg,ownerState:c,viewBox:`${a/2} ${a/2} ${a} ${a}`,children:t.jsx(O,{className:p.circle,style:f,ownerState:c,cx:a,cy:a,r:(a-n)/2,fill:"none",strokeWidth:n})})}))}),j=Q;function rr(){return t.jsx(F.Fragment,{children:t.jsx("div",{style:{display:"flex",placeItems:"center",width:"100%",alignItems:"center",height:200,marginRight:"auto",marginLeft:"auto"},children:t.jsx("div",{style:{marginRight:"auto",marginLeft:"auto"},children:t.jsxs(K,{sx:{position:"relative"},children:[t.jsx(j,{variant:"determinate",sx:{color:r=>r.palette.grey[r.palette.mode==="light"?200:800]},size:60,thickness:4,value:100}),t.jsx(j,{variant:"indeterminate",disableShrink:!0,sx:{color:r=>r.palette.mode==="light"?"#1a90ff":"#308fe8",animationDuration:"550ms",position:"absolute",left:0,[`& .${T.circle}`]:{strokeLinecap:"round"}},size:60,thickness:4})]})})})})}export{j as C,rr as L,T as c};
