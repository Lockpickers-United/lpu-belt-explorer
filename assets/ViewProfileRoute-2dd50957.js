import{r as s,X as n,u as l,j as e,R as i,N as u,a0 as d,a1 as g,a2 as m,b as c,K as x,O as f}from"./index-fe3cdc37.js";import{l as p}from"./LPU-c3fa7122.js";import{u as h}from"./useDocumentTitle-984a2642.js";import{L as j}from"./LinearProgress-524e2f0c.js";function R(){const{authLoaded:a,isLoggedIn:o,user:r}=s.useContext(n),t=l();return h("LPU Belt Explorer - View Profile"),s.useEffect(()=>{a&&r&&t(`/profile/${r.uid}`)},[a,t,r]),e.jsxs(i.Fragment,{children:[e.jsx(u,{title:"View Profile"}),!a&&e.jsxs(i.Fragment,{children:[e.jsx(j,{variant:"indeterminate",color:"secondary"}),e.jsx("img",{alt:"Loading",src:p,style:{marginLeft:"auto",marginRight:"auto",display:"block"}})]}),a&&!o&&e.jsxs(d,{style:{marginTop:16,maxWidth:350,marginLeft:"auto",marginRight:"auto",borderRadius:0},children:[e.jsx(g,{title:"Please Log In"}),e.jsx(m,{children:e.jsx(c,{variant:"h6",align:"center",children:"You must be logged in to view your profile."})})]}),e.jsx(x,{}),e.jsx(f,{feature:"viewprofileredirect"})]})}export{R as default};