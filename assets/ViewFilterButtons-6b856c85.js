import{r as t,F as B,j as e,J as F,B as y,D as $,Z as S,u as A,R as O,ab as G,ac as w,an as W,A as J,X as K,bw as N,U as P,aj as E,Y as X}from"./index-358cf55c.js";import{L as Z}from"./Link-fd2326ea.js";import{B as D,d as q}from"./Sort-9379a15a.js";import{d as Q,F as ee,C as te}from"./FilterAlt-f3b196c0.js";import{L as oe}from"./LockListContext-5b2ba0d6.js";import{T as se,a as R}from"./ToggleButtonGroup-aa872cef.js";import{B as M}from"./Box-21b0306e.js";import{d as le}from"./Cancel-23670bc6.js";function ne({text:u}){const{filters:m,addFilter:h,removeFilter:r}=t.useContext(B),{expandAll:c}=m,x=t.useCallback(()=>{!c||c==="false"?h("expandAll","Expand All",!0):r("expandAll","Expand All")},[c,h,r]),o=c?"Collapse All":"Expand All";return u?e.jsx("div",{children:e.jsx(F,{title:o,arrow:!0,disableFocusListener:!0,children:e.jsx(Z,{onClick:()=>x(),style:{color:"#fff",textDecoration:"none",cursor:"pointer"},size:"small",children:e.jsx("div",{style:{marginLeft:5,marginTop:5,padding:5,fontWeight:700},children:o.toUpperCase()})})})}):e.jsx("div",{children:e.jsx(F,{title:o,arrow:!0,disableFocusListener:!0,children:e.jsx(y,{onClick:()=>x(),style:{color:"#aaa"},size:"small",children:o})})})}function re({sortValues:u,compactMode:m}){const[h,r]=t.useState(null),c=!!h,x=t.useCallback(i=>r(i.currentTarget),[]),o=t.useCallback(()=>r(null),[]),{filters:k,addFilter:p}=t.useContext(B),{sort:d}=k,{adminRole:C}=t.useContext($),{compact:j,setCompact:n}=t.useContext(S),s=t.useCallback(i=>()=>{o(),n(i)},[o,n]),l=t.useCallback(i=>()=>{o(),setTimeout(()=>p("sort",i,!0),0)},[p,o]),f={vertical:"top",horizontal:"right"},{width:b}=A(),g=b<=500;return e.jsxs(O.Fragment,{children:[e.jsx(F,{title:"View Options",arrow:!0,disableFocusListener:!0,children:e.jsx(y,{color:"inherit",onClick:x,style:{color:"#ddd"},children:e.jsx(D,{variant:"dot",color:"secondary",invisible:!d,anchorOrigin:f,children:g?e.jsx(q,{}):"VIEW"})})}),e.jsxs(G,{anchorEl:h,open:c,onClose:o,children:[e.jsx("div",{style:{marginLeft:5,padding:5,fontWeight:700},children:"SORT BY"}),u.map(({label:i,value:v})=>e.jsx(w,{onClick:l(v),selected:d===v,children:i},i)),m&&e.jsxs("div",{children:[e.jsx(W,{}),e.jsx("div",{style:{marginLeft:5,marginTop:5,padding:5,fontWeight:700},children:"MODE"}),e.jsx(w,{onClick:s(!1),selected:!j,children:"Normal"}),e.jsx(w,{onClick:s(!0),selected:j,children:"Compact"})]}),C&&e.jsxs("div",{children:[e.jsx(W,{}),e.jsx(ne,{text:!0})]})]})]})}function ie({onFiltersChanged:u}){const{isLoggedIn:m}=t.useContext(J),{beta:h}=t.useContext(S),{filters:r,filterCount:c,addFilters:x,addFilter:o,filterFields:k,removeFilters:p}=t.useContext(B),{tab:d}=t.useContext(oe),{belt:C}=r,j=/\/locks/.test(location.hash),n=t.useMemo(()=>d||C||"White",[C,d]),s=t.useMemo(()=>n!=="search"?"belt":"all",[n]),[l,f]=t.useState(n);n!==l&&n!=="search"?f(n):s==="belt"&&n==="search"&&f("search");const[b,g]=t.useState(!1),i=t.useCallback(()=>g(!b),[b]);K("f",i);const v=t.useCallback(a=>()=>{a==="all"?o("tab","search",!0):a==="belt"&&(p(["belt"]),o("tab",l,!0))},[o,l,p]),z=t.useCallback((a,T)=>{x([{key:a,value:T},{key:"id",value:void 0},{key:"name",value:void 0}],!0),u&&u()},[x,u]),I=t.useCallback(()=>g(!0),[]),L=t.useCallback(()=>g(!1),[]),{color:V,lineColor:_="#999"}=E[l]?E[l]:{color:"#inherit"},H=s==="belt"?1:.7,{width:U}=A(),Y=U<=500;return e.jsxs(O.Fragment,{children:[e.jsx(F,{title:"Filter",arrow:!0,disableFocusListener:!0,children:e.jsx(y,{color:"inherit",onClick:I,style:{color:"#ddd"},children:e.jsx(D,{variant:"dot",badgeContent:c,color:"secondary",anchorOrigin:{vertical:"top",horizontal:"right"},children:Y?e.jsx(Q,{}):"FILTER"})})}),b&&e.jsxs(N,{anchor:"right",open:b,onClose:L,children:[e.jsx(P,{variant:"dense",onClick:L,style:{padding:"8px 0px 0px 8px"},children:e.jsx("div",{style:{fontSize:"1.3rem",fontWeight:700},children:"Filters"})}),E[l]&&j&&e.jsx("div",{style:{marginLeft:8,marginBottom:8},children:e.jsxs(se,{variant:"outlined",children:[e.jsxs(R,{onClick:v("belt"),style:{color:s==="belt"?"#eee":"#777",backgroundColor:s==="belt"?"inherit":"#111",padding:"6px 12px",borderColor:"#666"},value:"belt",disabled:s==="belt",children:[e.jsx("div",{style:{backgroundColor:V,height:16,width:16,borderColor:_,borderRadius:8,border:"1px solid",marginRight:8,opacity:H}}),l," BELT"]},"belt"),e.jsx(R,{onClick:v("all"),style:{color:s==="all"?"#eee":"#777",backgroundColor:s==="all"?"inherit":"#111",padding:"6px 12px",borderColor:"#666"},value:"all",disabled:s==="all",children:"ALL LOCKS"},"all")]})}),e.jsx(M,{margin:1,children:e.jsx(X,{direction:"column",style:{minWidth:250},children:k.filter(a=>(!a.beta||h)&&(!a.userBased||m)).filter(a=>!(s==="belt"&&d!=="search"&&a.label==="Belt")).map((a,T)=>e.jsx(ee,{tab:d,...a,onFilter:z},T))})}),e.jsxs("div",{style:{padding:8},children:[e.jsx(te,{forceText:!0}),e.jsx(y,{variant:"outlined",color:"inherit",onClick:L,children:"Done"})]})]})]})}function be({sortValues:u,extraFilters:m=[],compactMode:h,resetAll:r=!1}){const{filters:c,filterCount:x,setFilters:o,isFiltered:k}=t.useContext(B),{tab:p,sort:d,search:C}=c,j=d||x>0||k&&r,n=t.useCallback(()=>{o(r?{tab:p}:{tab:p,search:C})},[r,C,o,p]),{width:s}=A(),l=s<=500,f=l?3:0,b=l?2:0,g=l?40:60;return e.jsxs(M,{style:{display:"flex",paddingTop:f,marginBottom:b,marginLeft:0,justifyContent:"center"},sx:{".MuiBadge-anchorOriginTopRightRectangular":{marginTop:"5px"},".MuiButton-root":{minWidth:g}},children:[e.jsx(re,{sortValues:u,compactMode:h}),e.jsx(ie,{extraFilters:m}),j&&e.jsx(y,{color:"inherit",style:{color:"#bbb"},onClick:n,children:l?e.jsx(le,{}):"RESET"})]})}export{ne as E,be as V};
