import{ad as i,j as e,ae as l,r as o,a0 as c,af as m,u as d,R as s,U as x,ag as u,V as g,W as h}from"./index-b148edb8.js";import{l as p}from"./LPU-c3fa7122.js";import{L as j}from"./LinearProgress-fff85902.js";const n=i({palette:{mode:"light",text:{primary:"#333333",secondary:"#555555"}}}),f=t=>`
            body {
                margin: 0;
                padding: 0;
                color: #333
            }
            
            a {
                color: ${t.palette.text.icon};
            }
            
            pre{ 
                white-space: pre-wrap; 
                word-break: break-word;
            }
            
            :root {
              color-scheme: dark;
              overflow-y: scroll;
            }
        `,y=f(n),k=({children:t})=>e.jsxs(l,{theme:n,children:[e.jsx("style",{children:y}),t]});function C(){const{authLoaded:t}=o.useContext(c),{admin:a}=o.useContext(m),r=d();return o.useEffect(()=>{t&&!a&&r("/locks")},[a,t,r]),e.jsxs(s.Fragment,{children:[e.jsx(x,{title:"Admin"}),!t&&e.jsxs(s.Fragment,{children:[e.jsx(j,{variant:"indeterminate",color:"secondary"}),e.jsx("img",{alt:"Loading",src:p,style:{marginLeft:"auto",marginRight:"auto",display:"block"}})]}),t&&a&&e.jsx(u,{}),e.jsx(g,{}),e.jsx(h,{feature:"admin"}),e.jsx(k,{})]})}export{C as default};
