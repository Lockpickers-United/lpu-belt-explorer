import{R as c,j as m}from"./index-64086145.js";import{q as a}from"./Nav-ab5e4c5c.js";function f({feature:r,...t}){const o=Math.random().toString(36).substring(2,10),s=l[r]||"lpu.gif",e=document.referrer||"none",n=a.stringify({trk:r,r:o,ref:e,...t}),i=`https://images.lpubelts.com/i/${s}?${n}`;return m.jsx("img",{alt:"",src:i,width:0,height:0})}const l={locks:"welcome.gif",lock:"clear.gif"},p=c.memo(f);export{p as T};
