import{r as s,A as a,b as u,j as e,R as f,N as n,F as l,T as m}from"./index-a08903d0.js";import{u as p}from"./useDocumentTitle-9c7ce376.js";import{P as x}from"./MustBeLoggedIn-26707602.js";import{L as c}from"./LoadingDisplay-684fd2db.js";import"./LPU-c3fa7122.js";import"./LinearProgress-631a5179.js";function w(){const{authLoaded:t,isLoggedIn:i,user:o}=s.useContext(a),r=u();return p("LPU Belt Explorer - View Profile"),s.useEffect(()=>{t&&o&&r(`/profile/${o.uid}`)},[t,r,o]),e.jsxs(f.Fragment,{children:[e.jsx(n,{title:"View Profile"}),!t&&e.jsx(c,{}),t&&!i&&e.jsx(x,{}),e.jsx(l,{}),e.jsx(m,{feature:"viewprofileredirect"})]})}export{w as default};