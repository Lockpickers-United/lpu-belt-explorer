import{r as t,K as D,M as E,j as e,u as P,G as I,I as F,B as O,aa as $,a2 as z,V as H,R as q,a8 as L}from"./index-71c5eed6.js";import{F as B,D as G}from"./DataContext-c1f23a1c.js";import"./index-f26db119.js";import{F as K,I as J,S as Q}from"./Select-5e37be19.js";import{B as U}from"./Box-51fe652a.js";import{C as X,I as R}from"./Chip-94ee05c8.js";import{d as W}from"./Search-cdb70606.js";import{B as Y}from"./Badge-48be4462.js";import{T as Z}from"./TextField-c99921d4.js";function N(l,o){const[c,i]=t.useState(l);return t.useEffect(()=>{const p=setTimeout(()=>i(l),o||500);return()=>{clearTimeout(p)}},[l,o]),c}const k={safelocksOwn:"Own",safelockCracked:"Cracked",safelockWishlist:"Wishlist",shippingSplit:"Shipping included",shippingNotSplit:"Winner may pay shipping"};var _={},ee=E;Object.defineProperty(_,"__esModule",{value:!0});var V=_.default=void 0,te=ee(D()),re=e;V=_.default=(0,te.default)((0,re.jsx)("path",{d:"M5 13h14v-2H5zm-2 4h14v-2H3zM7 7v2h14V7z"}),"ClearAll");function Ce({forceText:l}){const{isMobile:o}=P(),{filterCount:c,clearFilters:i}=t.useContext(B);return c===0?null:o&&!l?e.jsx(I,{title:"Clear Filters",arrow:!0,disableFocusListener:!0,children:e.jsx(F,{onClick:i,children:e.jsx(V,{})})}):e.jsx(O,{variant:"outlined",color:"inherit",onClick:i,style:{minWidth:120,marginRight:8},children:"Clear Filters"})}function ge({label:l,fieldName:o,onFilter:c,sort:i,tab:p}){const{visibleEntries:m}=t.useContext(G),{filters:x}=t.useContext(B),u=t.useMemo(()=>p==="search"||!p?m:m.filter(s=>s.simpleBelt===p),[p,m]),[v,d]=t.useState(!1),h=t.useCallback(s=>{d(!1),setTimeout(()=>c(o,s.target.value,!0),0),setTimeout(()=>document.activeElement.blur())},[o,c]),y=t.useCallback(()=>{d(!1),setTimeout(()=>document.activeElement.blur())},[]),b=t.useCallback(()=>d(!0),[]),{counts:f,options:C}=t.useMemo(()=>{const s=u.map(n=>n[o]).flat().filter(n=>n),a=s.reduce((n,r)=>(n[r]||(n[r]=0),n[r]++,n),{}),T=[...new Set(s)].sort((n,r)=>{if(i)return i(n,r);if(typeof n=="string"&&typeof r=="string")return n.localeCompare(r);if(Number.isInteger(n)&&Number.isInteger(r))return n-r});return{counts:a,options:T}},[u,o,i]),j=t.useDeferredValue(x),g=j[o],S=Array.isArray(g)?j[o]:g?[g]:[];return e.jsxs(K,{style:{minWidth:120,maxWidth:300,marginTop:8},fullWidth:!0,children:[e.jsx(J,{id:`filter-${o}`,color:"secondary",children:l}),e.jsx(Q,{multiple:!0,label:l,labelId:`filter-${o}`,value:S,onChange:h,style:{marginBottom:0},color:"secondary",open:v,onClose:y,onOpen:b,onBlur:y,MenuProps:{PaperProps:{style:{maxHeight:se*8+ne}}},renderValue:s=>e.jsx(U,{sx:{display:"flex",flexWrap:"wrap",gap:.5},children:s.map(a=>e.jsx(X,{label:k[a]?k[a]:a},a))}),children:C.map((s,a)=>e.jsx($,{value:s,children:k[s]?k[s]:s+` (${f[s]||0})`},a))})]})}const se=48,ne=8;var w={},oe=E;Object.defineProperty(w,"__esModule",{value:!0});var A=w.default=void 0,ie=oe(D()),le=e;A=w.default=(0,ie.default)((0,le.jsx)("path",{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Clear");function ve({label:l,extraFilters:o=[],keepOpen:c}){const[i]=z(),{filters:p,addFilters:m,removeFilter:x}=t.useContext(B),[u,v]=t.useState(p.search||""),{isMobile:d}=P(),h=t.useRef();H("s",()=>{var r;return(r=h==null?void 0:h.current)==null?void 0:r.focus()},{preventDefault:!0});const y=t.useCallback(()=>{window.scrollTo({top:0}),v(""),x("search",""),h.current.focus()},[x]),b=t.useCallback(r=>{const{value:M}=r.target;v(M),M.length===0&&x("search","")},[x]),f=N(u,250).replaceAll("	"," ");t.useEffect(()=>{f&&f!==i.get("search")&&(f?(window.scrollTo({top:0}),m([{key:"search",value:f},{key:"id",value:void 0},{key:"name",value:void 0},...o],!0)):m([{key:"search",value:f}],!0))},[f]);const[C,j]=t.useState(!1),g=t.useCallback(()=>setTimeout(()=>j(!1),0),[]),S=t.useCallback(()=>{j(!0),setTimeout(()=>{h.current.focus(),h.current.select()},0)},[]);t.useEffect(()=>{const r=i.get("search");r!==u&&v(r||"")},[i]);const s=u?e.jsx(R,{position:"end",children:e.jsx(I,{title:"Clear",arrow:!0,disableFocusListener:!0,children:e.jsx(F,{color:"inherit",onClick:y,edge:"end",size:"small",children:e.jsx(A,{})})})}):null,a=d?{maxWidth:450,marginTop:8,marginRight:8}:{maxWidth:450,marginTop:6,marginRight:8},T=C&&d?{width:"auto",position:"fixed",left:50,right:0,paddingRight:16,maxWidth:"unset",zIndex:9999999,backgroundColor:"#272727"}:{},n=u?"secondary":"inherit";return e.jsxs(q.Fragment,{children:[!C&&d&&!c&&e.jsx(I,{title:"Search",arrow:!0,disableFocusListener:!0,children:e.jsx(F,{color:"inherit",onClick:S,children:e.jsx(Y,{invisible:u.length===0,variant:"dot",color:"secondary",overlap:"circular",anchorOrigin:{vertical:"bottom",horizontal:"right"},children:e.jsx(W,{})})})}),(C||!d||c)&&e.jsx(Z,{placeholder:`Search ${l}`,InputProps:{inputProps:{ref:h},startAdornment:e.jsx(R,{position:"start",children:e.jsx(W,{color:n})}),endAdornment:s},variant:"standard",color:"secondary",onChange:b,onBlur:g,value:u,style:{...a,...T},fullWidth:!0}),e.jsx(L,{invisible:!0,open:C&&d,onClick:g})]})}export{Ce as C,ge as F,ve as S,k as f};
