import{r as t,j as s}from"./index-71c5eed6.js";import{T as n,a as x}from"./ToggleButtonGroup-993ca65e.js";function C({options:e,onChange:r,defaultValue:o}){const[a,u]=t.useState(o||e[0].label),c=t.useCallback(l=>()=>{const d=e.find(b=>b.label===l);u(l),r&&r(d)},[r,e]);return s.jsx(n,{variant:"outlined",children:e.map(l=>s.jsx(x,{onClick:c(l.label),style:{color:a===l.label?"#eee":"#777",backgroundColor:a===l.label?"#292929":"#111",padding:"6px 12px",borderColor:"#000",borderRadius:0},value:a,children:l.label},l.label))})}export{C};
