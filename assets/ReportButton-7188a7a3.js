import{K as f,M as c,j as t,r as a,b as p,G as d,I as h}from"./index-f0068c75.js";import{R as x}from"./AdminRoleButton-343d835b.js";var o={},R=c;Object.defineProperty(o,"__esModule",{value:!0});var s=o.default=void 0,v=R(f()),m=t;s=o.default=(0,v.default)((0,m.jsx)("path",{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M9 17H7v-7h2zm4 0h-2V7h2zm4 0h-2v-4h2z"}),"Poll");function _({active:e}){const{raffleAdminRole:l}=a.useContext(x),r=p(),n=a.useCallback(()=>{r(e?"/rafl":"/rafl/reports")},[e,r]),u=e?"Return to RAFL":"View Reports",i=e?"#0b0":"#fff";return l?t.jsx(d,{title:u,arrow:!0,disableFocusListener:!0,children:t.jsx(h,{onClick:()=>n(),style:{height:48,width:48},children:t.jsx(s,{style:{color:i}})})}):null}export{_ as R};