import{r as a,A as u,u as d,j as r,R as n,N as p,F as m,T as x}from"./index-9a6ce20d.js";import{u as f}from"./useDocumentTitle-a175487c.js";import{S as l}from"./ScorecardProfileNotFound-1973c374.js";import{L as j}from"./LoadingDisplay-29057351.js";import"./useWindowSize-be23f983.js";import"./LPU-c3fa7122.js";import"./LinearProgress-767ffac7.js";function N({mostPopular:i}){const{authLoaded:e,isLoggedIn:c,user:o}=a.useContext(u),t=d();f("LPU Belt Explorer - View Scorecard");const s=i?"/popular":"";return a.useEffect(()=>{e&&o&&t(`/profile/${o.uid}/scorecard${s}`)},[e,t,s,o]),r.jsxs(n.Fragment,{children:[r.jsx(p,{title:"View Scorecard"}),!e&&r.jsx(j,{}),e&&!c&&r.jsx(l,{}),r.jsx(m,{}),r.jsx(x,{feature:"viewscorecardredirect"})]})}export{N as default};
