import{r as a,A as u,b as d,j as e,R as n,N as p,F as m,T as x}from"./index-0570dab5.js";import{u as f}from"./useDocumentTitle-7b629b76.js";import{S as l}from"./ScorecardProfileNotFound-b4bf4620.js";import{L as j}from"./LoadingDisplay-63dc9136.js";import"./LPU-c3fa7122.js";import"./LinearProgress-5b1fa15d.js";function F({mostPopular:i}){const{authLoaded:r,isLoggedIn:c,user:o}=a.useContext(u),t=d();f("LPU Belt Explorer - View Scorecard");const s=i?"/popular":"";return a.useEffect(()=>{r&&o&&t(`/profile/${o.uid}/scorecard${s}`)},[r,t,s,o]),e.jsxs(n.Fragment,{children:[e.jsx(p,{title:"View Scorecard"}),!r&&e.jsx(j,{}),r&&!c&&e.jsx(l,{}),e.jsx(m,{}),e.jsx(x,{feature:"viewscorecardredirect"})]})}export{F as default};
