import{r as l,a as V,g as N,s as M,_ as y,u as X,b as J,j as e,d as $,e as K,c as Q,w as L,S as Y,A as B,C as I,T as P,I as w,t as Z,x as ee,U as ce,al as ue,G as te,R as E,av as de,E as U,M as pe,X as me,a3 as he}from"./index-07cc147a.js";import{u as re,b as le,F as be,I as fe,S as ge}from"./Select-12835ac0.js";import{F as S,D as ve}from"./BeltStripe-f3441602.js";import{B as oe}from"./LoadingDisplay-9913409b.js";import{C as xe,d as z,I as H}from"./Search-8bd2dda9.js";import{u as se}from"./useWindowSize-62c06cd0.js";import{B as G,d as Ce}from"./Sort-4ccf28bb.js";import{T as je}from"./TextField-ec5fd189.js";function ye(r,t){const[o,s]=l.useState(r);return l.useEffect(()=>{const i=setTimeout(()=>s(r),t||500);return()=>{clearTimeout(i)}},[r,t]),o}function Fe(r){return V("MuiFormGroup",r)}N("MuiFormGroup",["root","row","error"]);const De=["className","row"],ke=r=>{const{classes:t,row:o,error:s}=r;return K({root:["root",o&&"row",s&&"error"]},Fe,t)},Ae=M("div",{name:"MuiFormGroup",slot:"Root",overridesResolver:(r,t)=>{const{ownerState:o}=r;return[t.root,o.row&&t.row]}})(({ownerState:r})=>y({display:"flex",flexDirection:"column",flexWrap:"wrap"},r.row&&{flexDirection:"row"})),Pe=l.forwardRef(function(t,o){const s=X({props:t,name:"MuiFormGroup"}),{className:i,row:n=!1}=s,m=J(s,De),p=re(),a=le({props:s,muiFormControl:p,states:["error"]}),c=y({},s,{row:n,error:a.error}),b=ke(c);return e.jsx(Ae,y({className:$(b.root,i),ownerState:c,ref:o},m))}),rt=Pe;function we(r){return V("MuiFormControlLabel",r)}const Se=N("MuiFormControlLabel",["root","labelPlacementStart","labelPlacementTop","labelPlacementBottom","disabled","label","error","required","asterisk"]),A=Se,Te=["checked","className","componentsProps","control","disabled","disableTypography","inputRef","label","labelPlacement","name","onChange","required","slotProps","value"],Re=r=>{const{classes:t,disabled:o,labelPlacement:s,error:i,required:n}=r,m={root:["root",o&&"disabled",`labelPlacement${Q(s)}`,i&&"error",n&&"required"],label:["label",o&&"disabled"],asterisk:["asterisk",i&&"error"]};return K(m,we,t)},_e=M("label",{name:"MuiFormControlLabel",slot:"Root",overridesResolver:(r,t)=>{const{ownerState:o}=r;return[{[`& .${A.label}`]:t.label},t.root,t[`labelPlacement${Q(o.labelPlacement)}`]]}})(({theme:r,ownerState:t})=>y({display:"inline-flex",alignItems:"center",cursor:"pointer",verticalAlign:"middle",WebkitTapHighlightColor:"transparent",marginLeft:-11,marginRight:16,[`&.${A.disabled}`]:{cursor:"default"}},t.labelPlacement==="start"&&{flexDirection:"row-reverse",marginLeft:16,marginRight:-11},t.labelPlacement==="top"&&{flexDirection:"column-reverse",marginLeft:16},t.labelPlacement==="bottom"&&{flexDirection:"column",marginLeft:16},{[`& .${A.label}`]:{[`&.${A.disabled}`]:{color:(r.vars||r).palette.text.disabled}}})),$e=M("span",{name:"MuiFormControlLabel",slot:"Asterisk",overridesResolver:(r,t)=>t.asterisk})(({theme:r})=>({[`&.${A.error}`]:{color:(r.vars||r).palette.error.main}})),Le=l.forwardRef(function(t,o){var s,i;const n=X({props:t,name:"MuiFormControlLabel"}),{className:m,componentsProps:p={},control:a,disabled:c,disableTypography:b,label:g,labelPlacement:x="end",required:h,slotProps:v={}}=n,F=J(n,Te),f=re(),C=(s=c??a.props.disabled)!=null?s:f==null?void 0:f.disabled,j=h??a.props.required,u={disabled:C,required:j};["checked","name","onChange","value","inputRef"].forEach(T=>{typeof a.props[T]>"u"&&typeof n[T]<"u"&&(u[T]=n[T])});const d=le({props:n,muiFormControl:f,states:["error"]}),k=y({},n,{disabled:C,labelPlacement:x,required:j,error:d.error}),R=Re(k),_=(i=v.typography)!=null?i:p.typography;let D=g;return D!=null&&D.type!==L&&!b&&(D=e.jsx(L,y({component:"span"},_,{className:$(R.label,_==null?void 0:_.className),children:D}))),e.jsxs(_e,y({className:$(R.root,m),ownerState:k,ref:o},F,{children:[l.cloneElement(a,u),j?e.jsxs(Y,{display:"block",children:[D,e.jsxs($e,{ownerState:k,"aria-hidden":!0,className:R.asterisk,children:[" ","*"]})]}):D]}))}),lt=Le;var W={},Me=I;Object.defineProperty(W,"__esModule",{value:!0});var ne=W.default=void 0,Be=Me(B()),Ie=e;ne=W.default=(0,Be.default)((0,Ie.jsx)("path",{d:"M5 13h14v-2H5zm-2 4h14v-2H3zM7 7v2h14V7z"}),"ClearAll");function Ee({forceText:r}){const{isMobile:t}=se(),{filterCount:o,clearFilters:s}=l.useContext(S);return o===0?null:t&&!r?e.jsx(P,{title:"Clear Filters",arrow:!0,disableFocusListener:!0,children:e.jsx(w,{onClick:s,children:e.jsx(ne,{})})}):e.jsx(Z,{variant:"outlined",color:"inherit",onClick:s,style:{minWidth:120},children:"Clear Filters"})}var q={},Ge=I;Object.defineProperty(q,"__esModule",{value:!0});var ae=q.default=void 0,We=Ge(B()),qe=e;ae=q.default=(0,We.default)((0,qe.jsx)("path",{d:"M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39c.51-.66.04-1.61-.79-1.61H5.04c-.83 0-1.3.95-.79 1.61"}),"FilterAlt");function Oe({label:r,fieldName:t,onFilter:o,sort:s}){const{visibleEntries:i}=l.useContext(ve),{filters:n}=l.useContext(S),[m,p]=l.useState(!1),a=l.useCallback(f=>{p(!1),setTimeout(()=>o(t,f.target.value,!0),0),setTimeout(()=>document.activeElement.blur())},[t,o]),c=l.useCallback(()=>{p(!1),setTimeout(()=>document.activeElement.blur())},[]),b=l.useCallback(()=>p(!0),[]),{counts:g,options:x}=l.useMemo(()=>{const f=i.map(u=>u[t]).flat().filter(u=>u),C=f.reduce((u,d)=>(u[d]||(u[d]=0),u[d]++,u),{}),j=[...new Set(f)].sort((u,d)=>{if(s)return s(u,d);if(typeof u=="string"&&typeof d=="string")return u.localeCompare(d);if(Number.isInteger(u)&&Number.isInteger(d))return u-d});return{counts:C,options:j}},[t,i,s]),h=l.useDeferredValue(n),v=h[t],F=Array.isArray(v)?h[t]:v?[v]:[];return e.jsxs(be,{style:{minWidth:120,maxWidth:300,marginTop:4},fullWidth:!0,children:[e.jsx(fe,{id:`filter-${t}`,color:"secondary",children:r}),e.jsx(ge,{multiple:!0,label:r,labelId:`filter-${t}`,value:F,onChange:a,style:{marginBottom:8},color:"secondary",open:m,onClose:c,onOpen:b,onBlur:c,MenuProps:{PaperProps:{style:{maxHeight:Ue*8+ze}}},renderValue:f=>e.jsx(oe,{sx:{display:"flex",flexWrap:"wrap",gap:.5},children:f.map(C=>e.jsx(xe,{label:C},C))}),children:x.map((f,C)=>e.jsx(ee,{value:f,children:`${f} (${g[f]||0})`},C))})]})}const Ue=48,ze=8;function ot({onFiltersChanged:r,extraFilters:t=[]}){const{isLoggedIn:o}=l.useContext(ce),{beta:s}=l.useContext(ue),{filterCount:i,addFilters:n,filterFields:m}=l.useContext(S),[p,a]=l.useState(!1),c=l.useCallback(()=>a(!p),[p]);te("f",c);const b=l.useCallback(()=>a(!0),[]),g=l.useCallback(()=>a(!1),[]),x=l.useCallback((h,v)=>{n([{key:h,value:v},{key:"id",value:void 0},{key:"name",value:void 0},...t],!0),r&&r()},[n,r,t]);return e.jsxs(E.Fragment,{children:[e.jsx(P,{title:"Filter",arrow:!0,disableFocusListener:!0,children:e.jsx(w,{color:"inherit",onClick:b,children:e.jsx(G,{badgeContent:i,color:"secondary",overlap:"circular",anchorOrigin:{vertical:"bottom",horizontal:"right"},children:e.jsx(ae,{})})})}),e.jsxs(de,{anchor:"right",open:p,onClose:g,children:[e.jsx(U,{variant:"dense",onClick:g,children:e.jsx(L,{variant:"h6",children:"Filters"})}),e.jsx(oe,{margin:1,children:e.jsx(Y,{direction:"column",style:{minWidth:250},children:m.filter(h=>(!h.beta||s)&&(!h.userBased||o)).map((h,v)=>e.jsx(Oe,{...h,onFilter:x},v))})}),e.jsxs(U,{variant:"dense",children:[e.jsx(Ee,{forceText:!0,style:{marginRight:8}}),e.jsx(Z,{variant:"outlined",color:"inherit",onClick:g,children:"Done"})]})]})]})}function st({sortValues:r}){const[t,o]=l.useState(null),s=!!t,i=l.useCallback(b=>o(b.currentTarget),[]),n=l.useCallback(()=>o(null),[]),{filters:m,addFilter:p}=l.useContext(S),{sort:a}=m,c=l.useCallback(b=>()=>{n(),setTimeout(()=>p("sort",b,!0),0)},[p,n]);return e.jsxs(E.Fragment,{children:[e.jsx(P,{title:"Sort",arrow:!0,disableFocusListener:!0,children:e.jsx(w,{color:"inherit",onClick:i,children:e.jsx(G,{variant:"dot",color:"secondary",overlap:"circular",invisible:!a,anchorOrigin:{vertical:"bottom",horizontal:"right"},children:e.jsx(Ce,{})})})}),e.jsx(pe,{anchorEl:t,open:s,onClose:n,children:r.map(({label:b,value:g})=>e.jsx(ee,{onClick:c(g),selected:a===g,children:b},b))})]})}var O={},He=I;Object.defineProperty(O,"__esModule",{value:!0});var ie=O.default=void 0,Ve=He(B()),Ne=e;ie=O.default=(0,Ve.default)((0,Ne.jsx)("path",{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Clear");function nt({label:r,extraFilters:t=[]}){const[o]=me(),{filters:s,addFilters:i,removeFilter:n}=l.useContext(S),[m,p]=l.useState(s.search||""),{isMobile:a}=se(),c=l.useRef();te("s",()=>{var d;return(d=c==null?void 0:c.current)==null?void 0:d.focus()},{preventDefault:!0});const b=l.useCallback(()=>{window.scrollTo({top:0}),p(""),n("search",""),c.current.focus()},[n]),g=l.useCallback(d=>{const{value:k}=d.target;p(k)},[]),x=ye(m,250);l.useEffect(()=>{x!==o.get("search")&&(x?(window.scrollTo({top:0}),i([{key:"search",value:x},{key:"id",value:void 0},{key:"name",value:void 0},...t],!0)):i([{key:"search",value:x}],!0))},[x]);const[h,v]=l.useState(!1),F=l.useCallback(()=>setTimeout(()=>v(!1),0),[]),f=l.useCallback(()=>{v(!0),setTimeout(()=>{c.current.focus(),c.current.select()},0)},[]);l.useEffect(()=>{const d=o.get("search");d!==m&&p(d||"")},[o]);const C=m?e.jsx(H,{position:"end",children:e.jsx(P,{title:"Clear",arrow:!0,disableFocusListener:!0,children:e.jsx(w,{color:"inherit",onClick:b,edge:"end",size:"small",children:e.jsx(ie,{})})})}):null,j=a?{maxWidth:450,marginRight:8}:{maxWidth:450,paddingLeft:60,marginRight:8},u=h&&a?{width:"auto",position:"fixed",left:60,right:0,paddingRight:16,maxWidth:"unset",zIndex:9999999,backgroundColor:"#272727"}:{};return e.jsxs(E.Fragment,{children:[!h&&a&&e.jsx(P,{title:"Search",arrow:!0,disableFocusListener:!0,children:e.jsx(w,{color:"inherit",onClick:f,children:e.jsx(G,{invisible:m.length===0,variant:"dot",color:"secondary",overlap:"circular",anchorOrigin:{vertical:"bottom",horizontal:"right"},children:e.jsx(z,{})})})}),(h||!a)&&e.jsx(je,{placeholder:`Search ${r}`,InputProps:{inputProps:{ref:c},startAdornment:e.jsx(H,{position:"start",children:e.jsx(z,{})}),endAdornment:C},variant:"standard",color:"secondary",onChange:g,onBlur:F,value:m,style:{...j,...u},fullWidth:!0}),e.jsx(he,{invisible:!0,open:h&&a,onClick:F})]})}const at=[{label:"Default",value:void 0},{label:"Alphabetical (Ascending)",value:"alphaAscending"},{label:"Alphabetical (Descending)",value:"alphaDescending"},{label:"Belt (Ascending)",value:"beltAscending"},{label:"Belt (Descending)",value:"beltDescending"},{label:"Popularity",value:"popularity"},{label:"Recently Updated",value:"recentlyUpdated"}],it=[{label:"Default",value:void 0},{label:"UL Group (Ascending)",value:"groupAscending"},{label:"UL Group (Descending)",value:"groupDescending"},{label:"Difficulty Tier (Ascending)",value:"tierAscending"},{label:"Difficulty Tier (Descending)",value:"tierDescending"},{label:"Alphabetical (Ascending)",value:"alphaAscending"},{label:"Alphabetical (Descending)",value:"alphaDescending"},{label:"Recently Updated",value:"recentlyUpdated"}],ct=[{label:"Default",value:void 0},{label:"Dan Points (Ascending)",value:"danPointsAscending"},{label:"Dan Points (Descending)",value:"danPointsDescending"},{label:"Date (Ascending)",value:"dateAscending"},{label:"Date (Descending)",value:"dateDescending"},{label:"Belt (Ascending)",value:"beltAscending"},{label:"Belt (Descending)",value:"beltDescending"},{label:"Alphabetical (Ascending)",value:"alphaAscending"},{label:"Alphabetical (Descending)",value:"alphaDescending"}];export{Ee as C,ot as F,nt as S,st as a,rt as b,lt as c,it as d,at as l,ct as s};
