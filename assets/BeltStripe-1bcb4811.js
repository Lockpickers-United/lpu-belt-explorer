import{R as i,ah as o,r as c,j as s}from"./index-71c5eed6.js";function h({value:t="Unranked"}){const l={width:8,height:"100%",position:"absolute",left:0,top:0,backgroundColor:o[t]?o[t].color:t.includes("Dan")?"#769e49":""},{lineColor:r}=o[t]||{},a=c.useMemo(()=>{const[p]=t.match(/\d/)||[0],e=+p;if(e>1)return Array(e).fill(0).map((u,n)=>s.jsx("span",{style:{width:8,height:2,position:"absolute",left:0,top:18+n*6,backgroundColor:r}},n))},[t,r]);return t==="Unranked"?null:s.jsxs(i.Fragment,{children:[s.jsx("span",{style:l}),a]})}const b=i.memo(h);export{b as B};
