import{a as e}from"./chunk-Cyuzqnbw.js";import{At as t,Ct as n,F as r,L as i,Lt as a,M as o,Ot as s,P as c,R as l,S as u,Tt as d,a as f,i as p,j as m,jt as h,kt as g,r as _,t as v,wt as y,x as b,yt as x}from"./DefaultPropsProvider-D_RySoZB.js";import{n as S,r as C}from"./Button-Bxub9_ZD.js";var w=e(a());h(),g();var T=x();l(),b(),p(),v(),C(),m(),c();function E(e){return r(`MuiCircularProgress`,e)}var D=o(`MuiCircularProgress`,[`root`,`determinate`,`indeterminate`,`colorPrimary`,`colorSecondary`,`svg`,`circle`,`circleDeterminate`,`circleIndeterminate`,`circleDisableShrink`]);y();var O=[`className`,`color`,`disableShrink`,`size`,`style`,`thickness`,`value`,`variant`],k=e=>e,A,j,M,N,P=44,F=d(A||=k`
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
`),I=d(j||=k`
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
`),L=e=>{let{classes:t,variant:n,color:r,disableShrink:i}=e;return u({root:[`root`,n,`color${S(r)}`],svg:[`svg`],circle:[`circle`,`circle${S(n)}`,i&&`circleDisableShrink`]},E,t)},R=f(`span`,{name:`MuiCircularProgress`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,t[n.variant],t[`color${S(n.color)}`]]}})(({ownerState:e,theme:n})=>t({display:`inline-block`},e.variant===`determinate`&&{transition:n.transitions.create(`transform`)},e.color!==`inherit`&&{color:(n.vars||n).palette[e.color].main}),({ownerState:e})=>e.variant===`indeterminate`&&n(M||=k`
      animation: ${0} 1.4s linear infinite;
    `,F)),z=f(`svg`,{name:`MuiCircularProgress`,slot:`Svg`,overridesResolver:(e,t)=>t.svg})({display:`block`}),B=f(`circle`,{name:`MuiCircularProgress`,slot:`Circle`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.circle,t[`circle${S(n.variant)}`],n.disableShrink&&t.circleDisableShrink]}})(({ownerState:e,theme:n})=>t({stroke:`currentColor`},e.variant===`determinate`&&{transition:n.transitions.create(`stroke-dashoffset`)},e.variant===`indeterminate`&&{strokeDasharray:`80px, 200px`,strokeDashoffset:0}),({ownerState:e})=>e.variant===`indeterminate`&&!e.disableShrink&&n(N||=k`
      animation: ${0} 1.4s ease-in-out infinite;
    `,I)),V=w.forwardRef(function(e,n){let r=_({props:e,name:`MuiCircularProgress`}),{className:a,color:o=`primary`,disableShrink:c=!1,size:l=40,style:u,thickness:d=3.6,value:f=0,variant:p=`indeterminate`}=r,m=s(r,O),h=t({},r,{color:o,disableShrink:c,size:l,thickness:d,value:f,variant:p}),g=L(h),v={},y={},b={};if(p===`determinate`){let e=2*Math.PI*((P-d)/2);v.strokeDasharray=e.toFixed(3),b[`aria-valuenow`]=Math.round(f),v.strokeDashoffset=`${((100-f)/100*e).toFixed(3)}px`,y.transform=`rotate(-90deg)`}return(0,T.jsx)(R,t({className:i(g.root,a),style:t({width:l,height:l},y,u),ownerState:h,ref:n,role:`progressbar`},b,m,{children:(0,T.jsx)(z,{className:g.svg,ownerState:h,viewBox:`${P/2} ${P/2} ${P} ${P}`,children:(0,T.jsx)(B,{className:g.circle,style:v,ownerState:h,cx:P,cy:P,r:(P-d)/2,fill:`none`,strokeWidth:d})})}))});export{D as n,V as t};