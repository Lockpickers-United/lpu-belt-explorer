import{r as s,U as a,p as u,j as e,R as f,O as n,H as p,P as l}from"./index-839bcaf3.js";import{u as m}from"./useDocumentTitle-74046c6a.js";import{P as x}from"./MustBeLoggedIn-35f0cee0.js";import{L as c}from"./LoadingDisplay-4064fb5e.js";import"./LPU-c3fa7122.js";import"./LinearProgress-814988af.js";function w(){const{authLoaded:t,isLoggedIn:i,user:o}=s.useContext(a),r=u();return m("LPU Belt Explorer - View Profile"),s.useEffect(()=>{t&&o&&r(`/profile/${o.uid}`)},[t,r,o]),e.jsxs(f.Fragment,{children:[e.jsx(n,{title:"View Profile"}),!t&&e.jsx(c,{}),t&&!i&&e.jsx(x,{}),e.jsx(p,{}),e.jsx(l,{feature:"viewprofileredirect"})]})}export{w as default};