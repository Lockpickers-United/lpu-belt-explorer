import{r as n,A as c,D as m,j as t,R as d,$ as p,N as g,B as f,aB as j,F as h}from"./index-415cda15.js";import{u as y}from"./useData-07241258.js";import{L as B}from"./LoadingDisplay-6d84150e.js";import{a as C}from"./DataContext-12a912fb.js";import{D}from"./LockDataProvider-be18e745.js";import"./Box-a82b671a.js";import"./CircularProgress-527f121c.js";import"./index-14d87f72.js";function L(){const{user:r}=n.useContext(c),{getProfile:a}=n.useContext(m),o=r?r.uid:null,l=n.useCallback(async()=>{if(!o)return null;try{return await a(o)}catch(x){return console.error("Error loading profile.",x),null}},[a,o]),{data:e={},loading:s,error:i}=y({loadFn:l}),u=e;return t.jsxs(d.Fragment,{children:[s&&t.jsx(B,{}),!s&&e&&!i&&t.jsx(p,{context:{profile:u,user:r}}),!s&&!e&&!i&&!r&&t.jsx(C,{children:t.jsxs(D,{allEntries:[],children:[t.jsx(g,{title:"Please Sign In"}),t.jsx("div",{style:{maxWidth:700,padding:0,marginLeft:"auto",marginRight:"auto",marginTop:46,marginBottom:46},children:t.jsxs("div",{style:{textAlign:"center",marginTop:40},children:["We're sorry, you must be signed in to submit content.",t.jsx("br",{}),t.jsx("br",{}),t.jsx(f,{style:{color:"#fff"},children:t.jsx(j,{})})]})})]})}),t.jsx(h,{})]})}export{L as default};
