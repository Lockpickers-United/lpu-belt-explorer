import{r as d,b as y,u as g,j as e,R as C,G as l,B as o}from"./index-f0068c75.js";import{R as u}from"./AdminRoleButton-343d835b.js";function E({page:t}){const{raflState:i,raffleAdminRole:s}=d.useContext(u),f=y(),{displayStats:x,setAnimateTotal:h}=d.useContext(u),n=d.useCallback(S=>{f(S),h(!1)},[f,h]),{isMobile:c,flexStyle:p}=g(),R=c?0:4,r=c?"1.0rem":"1.03rem",m={maxWidth:700,marginLeft:"auto",marginRight:"auto",marginTop:10,padding:"14px 0px 0px 0px",fontWeight:700,display:p};let a=i!=="preview"||s||c?"PRIZES":"PRIZE PREVIEW";a=["hidden","post"].includes(i)?a.replace("PRIZES","2025 PRIZES"):a;const j=x?"Hide Real-time Stats":"Show Real-time Stats";return e.jsxs(C.Fragment,{children:[e.jsxs("div",{style:m,children:[e.jsx("div",{style:{flexGrow:1,fontSize:"1.7rem",marginTop:0},children:"LPU Annual Raffle"}),e.jsxs("div",{style:{marginTop:R,justifyItems:"right"},children:[e.jsx("div",{style:{flexGrow:1}}),e.jsx(l,{title:"Raffle Prizes",arrow:!0,disableFocusListener:!0,style:{},children:e.jsx("span",{children:e.jsx(o,{onClick:()=>n("/rafl"),style:{marginRight:10,color:t==="pots"?"#fff":"#ccc",fontSize:r},disabled:t==="pots",children:a})})}),i==="preview"&&!s&&e.jsx(l,{title:"Call For Contributions",arrow:!0,disableFocusListener:!0,style:{},children:e.jsx("span",{children:e.jsx(o,{onClick:()=>n("/rafl/announce"),style:{marginRight:10,color:t==="announce"?"#fff":"#ccc",fontSize:r},disabled:t==="announce",children:"CONTRIBUTE"})})}),(i!=="hidden"||s)&&e.jsx(l,{title:"Approved Charities",arrow:!0,disableFocusListener:!0,style:{},children:e.jsx("span",{children:e.jsx(o,{onClick:()=>n("/rafl/charities"),style:{marginRight:10,color:t==="charities"?"#fff":"#ccc",fontSize:r},disabled:t==="charities",children:"CHARITIES"})})}),(["live","post"].includes(i)||s)&&e.jsx(l,{title:"Enter the RAFL",arrow:!0,disableFocusListener:!0,style:{},children:e.jsx("span",{children:e.jsx(o,{onClick:()=>n("/rafl/enter"),style:{marginRight:10,color:t==="enter"?"#fff":"#ccc",fontSize:r},children:"ENTER"})})}),(["live","post"].includes(i)||s)&&e.jsx(l,{title:j,arrow:!0,disableFocusListener:!0,style:{},children:e.jsx("span",{children:e.jsx(o,{onClick:()=>n("/rafl/stats"),style:{marginRight:0,color:t==="stats"?"#fff":"#ccc",fontSize:r},children:"STATS"})})})]})]}),e.jsx("div",{style:{height:8}})]})}export{E as R};