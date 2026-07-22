import{Fn as e,Fr as t,In as n,Ir as r,Lr as i,Mn as a,Nn as o,Pr as s,Rr as c,Zr as l,ai as u,hn as d,ii as f,ir as p,mn as m,ni as h,oi as g,pi as _,ri as v,rr as y,ti as b,vi as x,zr as S}from"./index-lG3ipNUw.js";var C=x(_());g(),f();var w=l();S(),y(),e(),a(),d(),s(),r();function T(e){return i(`MuiCircularProgress`,e)}var E=t(`MuiCircularProgress`,[`root`,`determinate`,`indeterminate`,`colorPrimary`,`colorSecondary`,`svg`,`circle`,`circleDeterminate`,`circleIndeterminate`,`circleDisableShrink`]),D=[`className`,`color`,`disableShrink`,`size`,`style`,`thickness`,`value`,`variant`],O=e=>e,k,A,j,M,N=44,P=h(k||=O`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`),F=h(A||=O`
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
`),I=e=>{let{classes:t,variant:n,color:r,disableShrink:i}=e;return p({root:[`root`,n,`color${m(r)}`],svg:[`svg`],circle:[`circle`,`circle${m(n)}`,i&&`circleDisableShrink`]},T,t)},L=n(`span`,{name:`MuiCircularProgress`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,t[n.variant],t[`color${m(n.color)}`]]}})(({ownerState:e,theme:t})=>u({display:`inline-block`},e.variant===`determinate`&&{transition:t.transitions.create(`transform`)},e.color!==`inherit`&&{color:(t.vars||t).palette[e.color].main}),({ownerState:e})=>e.variant===`indeterminate`&&b(j||=O`
      animation: ${0} 1.4s linear infinite;
    `,P)),R=n(`svg`,{name:`MuiCircularProgress`,slot:`Svg`,overridesResolver:(e,t)=>t.svg})({display:`block`}),z=n(`circle`,{name:`MuiCircularProgress`,slot:`Circle`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.circle,t[`circle${m(n.variant)}`],n.disableShrink&&t.circleDisableShrink]}})(({ownerState:e,theme:t})=>u({stroke:`currentColor`},e.variant===`determinate`&&{transition:t.transitions.create(`stroke-dashoffset`)},e.variant===`indeterminate`&&{strokeDasharray:`80px, 200px`,strokeDashoffset:0}),({ownerState:e})=>e.variant===`indeterminate`&&!e.disableShrink&&b(M||=O`
      animation: ${0} 1.4s ease-in-out infinite;
    `,F)),B=C.forwardRef(function(e,t){let n=o({props:e,name:`MuiCircularProgress`}),{className:r,color:i=`primary`,disableShrink:a=!1,size:s=40,style:l,thickness:d=3.6,value:f=0,variant:p=`indeterminate`}=n,m=v(n,D),h=u({},n,{color:i,disableShrink:a,size:s,thickness:d,value:f,variant:p}),g=I(h),_={},y={},b={};if(p===`determinate`){let e=2*Math.PI*((N-d)/2);_.strokeDasharray=e.toFixed(3),b[`aria-valuenow`]=Math.round(f),_.strokeDashoffset=`${((100-f)/100*e).toFixed(3)}px`,y.transform=`rotate(-90deg)`}return(0,w.jsx)(L,u({className:c(g.root,r),style:u({width:s,height:s},y,l),ownerState:h,ref:t,role:`progressbar`},b,m,{children:(0,w.jsx)(R,{className:g.svg,ownerState:h,viewBox:`${N/2} ${N/2} ${N} ${N}`,children:(0,w.jsx)(z,{className:g.circle,style:_,ownerState:h,cx:N,cy:N,r:(N-d)/2,fill:`none`,strokeWidth:d})})}))});export{E as n,B as t};