import{an as a,r as e,A as p,G as u,j as l,E as d,I as x}from"./index-55b1d90f.js";import{d as b}from"./Link-c2ff03f2.js";function C({page:i,safeName:o,mostPopular:r}){const{userId:n}=a(),{user:t}=e.useContext(p),s=e.useCallback(async()=>{const c=i==="collection"?`https://lpubelts.com/#/profile/${n||(t==null?void 0:t.uid)}?name=${o}`:r?`https://lpubelts.com/#/profile/${n||(t==null?void 0:t.uid)}/scorecard/popular?name=${o}`:`https://lpubelts.com/#/profile/${n||(t==null?void 0:t.uid)}/${i}?name=${o}`;await navigator.clipboard.writeText(c),u("Link copied to clipboard.")},[i,n,t,o,r]);return t?l.jsx(d,{title:"Copy Profile Link",arrow:!0,disableFocusListener:!0,children:l.jsx(x,{onClick:s,children:l.jsx(b,{})})}):null}export{C};
