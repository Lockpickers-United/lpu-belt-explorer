import{r as a,U as u,p as d,j as r,R as n,O as p,H as m,P as x}from"./index-df5142d4.js";import{u as f}from"./useDocumentTitle-448976fd.js";import{S as l}from"./ScorecardProfileNotFound-75a800af.js";import{L as j}from"./LoadingDisplay-f335b887.js";import"./useWindowSize-d25ded87.js";import"./LPU-c3fa7122.js";import"./LinearProgress-2d3e32ad.js";function h({mostPopular:i}){const{authLoaded:e,isLoggedIn:c,user:o}=a.useContext(u),t=d();f("LPU Belt Explorer - View Scorecard");const s=i?"/popular":"";return a.useEffect(()=>{e&&o&&t(`/profile/${o.uid}/scorecard${s}`)},[e,t,s,o]),r.jsxs(n.Fragment,{children:[r.jsx(p,{title:"View Scorecard"}),!e&&r.jsx(j,{}),e&&!c&&r.jsx(l,{}),r.jsx(m,{}),r.jsx(x,{feature:"viewscorecardredirect"})]})}export{h as default};