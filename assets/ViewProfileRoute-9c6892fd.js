import{r as s,$ as a,p as u,j as e,R as f,N as n,O as p,P as l}from"./index-6ed31b30.js";import{u as m}from"./useDocumentTitle-8f5e6192.js";import{P as x}from"./MustBeLoggedIn-5dc8c588.js";import{L as c}from"./LoadingDisplay-e23ee28d.js";import"./LPU-c3fa7122.js";import"./LinearProgress-dc4bc7b4.js";function w(){const{authLoaded:t,isLoggedIn:i,user:o}=s.useContext(a),r=u();return m("LPU Belt Explorer - View Profile"),s.useEffect(()=>{t&&o&&r(`/profile/${o.uid}`)},[t,r,o]),e.jsxs(f.Fragment,{children:[e.jsx(n,{title:"View Profile"}),!t&&e.jsx(c,{}),t&&!i&&e.jsx(x,{}),e.jsx(p,{}),e.jsx(l,{feature:"viewprofileredirect"})]})}export{w as default};
