import{a as e}from"./chunk-Cyuzqnbw.js";import{At as t,Ct as n,F as r,L as i,Lt as a,M as o,Ot as s,P as c,R as l,S as u,Tt as d,a as f,g as p,i as m,j as h,jt as g,kt as _,r as v,t as y,wt as b,x,yt as S}from"./DefaultPropsProvider-D_RySoZB.js";import{n as C,r as w}from"./Button-Bxub9_ZD.js";import{n as T}from"./RtlProvider-B4bylSO-.js";var E=e(a());g(),_();var D=S();l(),x();var O=p();m(),y(),w(),h(),c();function k(e){return r(`MuiLinearProgress`,e)}o(`MuiLinearProgress`,[`root`,`colorPrimary`,`colorSecondary`,`determinate`,`indeterminate`,`buffer`,`query`,`dashed`,`dashedColorPrimary`,`dashedColorSecondary`,`bar`,`barColorPrimary`,`barColorSecondary`,`bar1Indeterminate`,`bar1Determinate`,`bar1Buffer`,`bar2Indeterminate`,`bar2Buffer`]),b();var A=[`className`,`color`,`value`,`valueBuffer`,`variant`],j=e=>e,M,N,P,F,I,L,R=4,z=d(M||=j`
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
`),B=d(N||=j`
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
`),V=d(P||=j`
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
`),H=e=>{let{classes:t,variant:n,color:r}=e;return u({root:[`root`,`color${C(r)}`,n],dashed:[`dashed`,`dashedColor${C(r)}`],bar1:[`bar`,`barColor${C(r)}`,(n===`indeterminate`||n===`query`)&&`bar1Indeterminate`,n===`determinate`&&`bar1Determinate`,n===`buffer`&&`bar1Buffer`],bar2:[`bar`,n!==`buffer`&&`barColor${C(r)}`,n===`buffer`&&`color${C(r)}`,(n===`indeterminate`||n===`query`)&&`bar2Indeterminate`,n===`buffer`&&`bar2Buffer`]},k,t)},U=(e,t)=>t===`inherit`?`currentColor`:e.vars?e.vars.palette.LinearProgress[`${t}Bg`]:e.palette.mode===`light`?(0,O.lighten)(e.palette[t].main,.62):(0,O.darken)(e.palette[t].main,.5),W=f(`span`,{name:`MuiLinearProgress`,slot:`Root`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.root,t[`color${C(n.color)}`],t[n.variant]]}})(({ownerState:e,theme:n})=>t({position:`relative`,overflow:`hidden`,display:`block`,height:4,zIndex:0,"@media print":{colorAdjust:`exact`},backgroundColor:U(n,e.color)},e.color===`inherit`&&e.variant!==`buffer`&&{backgroundColor:`none`,"&::before":{content:`""`,position:`absolute`,left:0,top:0,right:0,bottom:0,backgroundColor:`currentColor`,opacity:.3}},e.variant===`buffer`&&{backgroundColor:`transparent`},e.variant===`query`&&{transform:`rotate(180deg)`})),G=f(`span`,{name:`MuiLinearProgress`,slot:`Dashed`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.dashed,t[`dashedColor${C(n.color)}`]]}})(({ownerState:e,theme:n})=>{let r=U(n,e.color);return t({position:`absolute`,marginTop:0,height:`100%`,width:`100%`},e.color===`inherit`&&{opacity:.3},{backgroundImage:`radial-gradient(${r} 0%, ${r} 16%, transparent 42%)`,backgroundSize:`10px 10px`,backgroundPosition:`0 -23px`})},n(F||=j`
    animation: ${0} 3s infinite linear;
  `,V)),K=f(`span`,{name:`MuiLinearProgress`,slot:`Bar1`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.bar,t[`barColor${C(n.color)}`],(n.variant===`indeterminate`||n.variant===`query`)&&t.bar1Indeterminate,n.variant===`determinate`&&t.bar1Determinate,n.variant===`buffer`&&t.bar1Buffer]}})(({ownerState:e,theme:n})=>t({width:`100%`,position:`absolute`,left:0,bottom:0,top:0,transition:`transform 0.2s linear`,transformOrigin:`left`,backgroundColor:e.color===`inherit`?`currentColor`:(n.vars||n).palette[e.color].main},e.variant===`determinate`&&{transition:`transform .${R}s linear`},e.variant===`buffer`&&{zIndex:1,transition:`transform .${R}s linear`}),({ownerState:e})=>(e.variant===`indeterminate`||e.variant===`query`)&&n(I||=j`
      width: auto;
      animation: ${0} 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    `,z)),q=f(`span`,{name:`MuiLinearProgress`,slot:`Bar2`,overridesResolver:(e,t)=>{let{ownerState:n}=e;return[t.bar,t[`barColor${C(n.color)}`],(n.variant===`indeterminate`||n.variant===`query`)&&t.bar2Indeterminate,n.variant===`buffer`&&t.bar2Buffer]}})(({ownerState:e,theme:n})=>t({width:`100%`,position:`absolute`,left:0,bottom:0,top:0,transition:`transform 0.2s linear`,transformOrigin:`left`},e.variant!==`buffer`&&{backgroundColor:e.color===`inherit`?`currentColor`:(n.vars||n).palette[e.color].main},e.color===`inherit`&&{opacity:.3},e.variant===`buffer`&&{backgroundColor:U(n,e.color),transition:`transform .${R}s linear`}),({ownerState:e})=>(e.variant===`indeterminate`||e.variant===`query`)&&n(L||=j`
      width: auto;
      animation: ${0} 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) 1.15s infinite;
    `,B)),J=E.forwardRef(function(e,n){let r=v({props:e,name:`MuiLinearProgress`}),{className:a,color:o=`primary`,value:c,valueBuffer:l,variant:u=`indeterminate`}=r,d=s(r,A),f=t({},r,{color:o,variant:u}),p=H(f),m=T(),h={},g={bar1:{},bar2:{}};if((u===`determinate`||u===`buffer`)&&c!==void 0){h[`aria-valuenow`]=Math.round(c),h[`aria-valuemin`]=0,h[`aria-valuemax`]=100;let e=c-100;m&&(e=-e),g.bar1.transform=`translateX(${e}%)`}if(u===`buffer`&&l!==void 0){let e=(l||0)-100;m&&(e=-e),g.bar2.transform=`translateX(${e}%)`}return(0,D.jsxs)(W,t({className:i(p.root,a),ownerState:f,role:`progressbar`},h,{ref:n},d,{children:[u===`buffer`?(0,D.jsx)(G,{className:p.dashed,ownerState:f}):null,(0,D.jsx)(K,{className:p.bar1,ownerState:f,style:g.bar1}),u===`determinate`?null:(0,D.jsx)(q,{className:p.bar2,ownerState:f,style:g.bar2})]}))});export{J as t};