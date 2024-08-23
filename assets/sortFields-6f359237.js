import{r,a as O,g as E,s as R,B as Fe,_ as k,b2 as ce,b as H,aR as Pe,j as o,d as z,c as I,e as q,i as K,ad as Se,u as Q,x as J,S as ie,R as U,C as V,D as W,T as M,I as L,t as de,y as ue,a0 as $e,aq as Be,H as pe,ap as De,F as se,M as Ie,U as we,a1 as Re}from"./index-64ce7706.js";import{u as X,b as he,F as Ae,I as _e,S as ze}from"./Select-a096aee3.js";import{F as T,D as Me}from"./BeltStripe-1554f61c.js";import{B as me}from"./LoadingDisplay-dccbf9a5.js";import{C as Le,d as ae,I as le}from"./Search-15aac769.js";import{u as fe}from"./useWindowSize-e5e8c33d.js";import{B as Y,d as Te}from"./Sort-04a7c1d7.js";import{T as Oe}from"./TextField-9f0b5523.js";function Ee(e,t){const[n,s]=r.useState(e);return r.useEffect(()=>{const l=setTimeout(()=>s(e),t||500);return()=>{clearTimeout(l)}},[e,t]),n}function He(e){return O("PrivateSwitchBase",e)}E("PrivateSwitchBase",["root","checked","disabled","input","edgeStart","edgeEnd"]);const qe=["autoFocus","checked","checkedIcon","className","defaultChecked","disabled","disableFocusRipple","edge","icon","id","inputProps","inputRef","name","onBlur","onChange","onFocus","readOnly","required","tabIndex","type","value"],Ue=e=>{const{classes:t,checked:n,disabled:s,edge:l}=e,a={root:["root",n&&"checked",s&&"disabled",l&&`edge${I(l)}`],input:["input"]};return q(a,He,t)},Ve=R(Fe)(({ownerState:e})=>k({padding:9,borderRadius:"50%"},e.edge==="start"&&{marginLeft:e.size==="small"?-3:-12},e.edge==="end"&&{marginRight:e.size==="small"?-3:-12})),We=R("input",{shouldForwardProp:ce})({cursor:"inherit",position:"absolute",opacity:0,width:"100%",height:"100%",top:0,left:0,margin:0,padding:0,zIndex:1}),Ge=r.forwardRef(function(t,n){const{autoFocus:s,checked:l,checkedIcon:a,className:d,defaultChecked:u,disabled:i,disableFocusRipple:c=!1,edge:h=!1,icon:v,id:x,inputProps:m,inputRef:C,name:j,onBlur:p,onChange:g,onFocus:y,readOnly:f,required:b=!1,tabIndex:B,type:P,value:w}=t,S=H(t,qe),[D,ve]=Pe({controlled:l,default:!!u,name:"SwitchBase",state:"checked"}),$=X(),Ce=F=>{y&&y(F),$&&$.onFocus&&$.onFocus(F)},ke=F=>{p&&p(F),$&&$.onBlur&&$.onBlur(F)},ye=F=>{if(F.nativeEvent.defaultPrevented)return;const re=F.target.checked;ve(re),g&&g(F,re)};let A=i;$&&typeof A>"u"&&(A=$.disabled);const je=P==="checkbox"||P==="radio",G=k({},t,{checked:D,disabled:A,disableFocusRipple:c,edge:h}),ne=Ue(G);return o.jsxs(Ve,k({component:"span",className:z(ne.root,d),centerRipple:!0,focusRipple:!c,disabled:A,tabIndex:null,role:void 0,onFocus:Ce,onBlur:ke,ownerState:G,ref:n},S,{children:[o.jsx(We,k({autoFocus:s,checked:l,defaultChecked:u,className:ne.input,disabled:A,id:je?x:void 0,name:j,onChange:ye,readOnly:f,ref:C,required:b,ownerState:G,tabIndex:B,type:P},P==="checkbox"&&w===void 0?{}:{value:w},m)),D?a:v]}))}),Ne=Ge,Je=K(o.jsx("path",{d:"M19 5v14H5V5h14m0-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z"}),"CheckBoxOutlineBlank"),Ke=K(o.jsx("path",{d:"M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.11 0 2-.9 2-2V5c0-1.1-.89-2-2-2zm-9 14l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"}),"CheckBox"),Qe=K(o.jsx("path",{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2z"}),"IndeterminateCheckBox");function Xe(e){return O("MuiCheckbox",e)}const Ye=E("MuiCheckbox",["root","checked","disabled","indeterminate","colorPrimary","colorSecondary","sizeSmall","sizeMedium"]),N=Ye,Ze=["checkedIcon","color","icon","indeterminate","indeterminateIcon","inputProps","size","className"],et=e=>{const{classes:t,indeterminate:n,color:s,size:l}=e,a={root:["root",n&&"indeterminate",`color${I(s)}`,`size${I(l)}`]},d=q(a,Xe,t);return k({},t,d)},tt=R(Ne,{shouldForwardProp:e=>ce(e)||e==="classes",name:"MuiCheckbox",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,n.indeterminate&&t.indeterminate,t[`size${I(n.size)}`],n.color!=="default"&&t[`color${I(n.color)}`]]}})(({theme:e,ownerState:t})=>k({color:(e.vars||e).palette.text.secondary},!t.disableRipple&&{"&:hover":{backgroundColor:e.vars?`rgba(${t.color==="default"?e.vars.palette.action.activeChannel:e.vars.palette[t.color].mainChannel} / ${e.vars.palette.action.hoverOpacity})`:Se(t.color==="default"?e.palette.action.active:e.palette[t.color].main,e.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},t.color!=="default"&&{[`&.${N.checked}, &.${N.indeterminate}`]:{color:(e.vars||e).palette[t.color].main},[`&.${N.disabled}`]:{color:(e.vars||e).palette.action.disabled}})),ot=o.jsx(Ke,{}),nt=o.jsx(Je,{}),rt=o.jsx(Qe,{}),st=r.forwardRef(function(t,n){var s,l;const a=Q({props:t,name:"MuiCheckbox"}),{checkedIcon:d=ot,color:u="primary",icon:i=nt,indeterminate:c=!1,indeterminateIcon:h=rt,inputProps:v,size:x="medium",className:m}=a,C=H(a,Ze),j=c?h:i,p=c?h:d,g=k({},a,{color:u,indeterminate:c,size:x}),y=et(g);return o.jsx(tt,k({type:"checkbox",inputProps:k({"data-indeterminate":c},v),icon:r.cloneElement(j,{fontSize:(s=j.props.fontSize)!=null?s:x}),checkedIcon:r.cloneElement(p,{fontSize:(l=p.props.fontSize)!=null?l:x}),ownerState:g,ref:n,className:z(y.root,m)},C,{classes:y}))}),Vt=st;function at(e){return O("MuiFormGroup",e)}E("MuiFormGroup",["root","row","error"]);const lt=["className","row"],ct=e=>{const{classes:t,row:n,error:s}=e;return q({root:["root",n&&"row",s&&"error"]},at,t)},it=R("div",{name:"MuiFormGroup",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,n.row&&t.row]}})(({ownerState:e})=>k({display:"flex",flexDirection:"column",flexWrap:"wrap"},e.row&&{flexDirection:"row"})),dt=r.forwardRef(function(t,n){const s=Q({props:t,name:"MuiFormGroup"}),{className:l,row:a=!1}=s,d=H(s,lt),u=X(),i=he({props:s,muiFormControl:u,states:["error"]}),c=k({},s,{row:a,error:i.error}),h=ct(c);return o.jsx(it,k({className:z(h.root,l),ownerState:c,ref:n},d))}),Wt=dt;function ut(e){return O("MuiFormControlLabel",e)}const pt=E("MuiFormControlLabel",["root","labelPlacementStart","labelPlacementTop","labelPlacementBottom","disabled","label","error","required","asterisk"]),_=pt,ht=["checked","className","componentsProps","control","disabled","disableTypography","inputRef","label","labelPlacement","name","onChange","required","slotProps","value"],mt=e=>{const{classes:t,disabled:n,labelPlacement:s,error:l,required:a}=e,d={root:["root",n&&"disabled",`labelPlacement${I(s)}`,l&&"error",a&&"required"],label:["label",n&&"disabled"],asterisk:["asterisk",l&&"error"]};return q(d,ut,t)},ft=R("label",{name:"MuiFormControlLabel",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[{[`& .${_.label}`]:t.label},t.root,t[`labelPlacement${I(n.labelPlacement)}`]]}})(({theme:e,ownerState:t})=>k({display:"inline-flex",alignItems:"center",cursor:"pointer",verticalAlign:"middle",WebkitTapHighlightColor:"transparent",marginLeft:-11,marginRight:16,[`&.${_.disabled}`]:{cursor:"default"}},t.labelPlacement==="start"&&{flexDirection:"row-reverse",marginLeft:16,marginRight:-11},t.labelPlacement==="top"&&{flexDirection:"column-reverse",marginLeft:16},t.labelPlacement==="bottom"&&{flexDirection:"column",marginLeft:16},{[`& .${_.label}`]:{[`&.${_.disabled}`]:{color:(e.vars||e).palette.text.disabled}}})),bt=R("span",{name:"MuiFormControlLabel",slot:"Asterisk",overridesResolver:(e,t)=>t.asterisk})(({theme:e})=>({[`&.${_.error}`]:{color:(e.vars||e).palette.error.main}})),xt=r.forwardRef(function(t,n){var s,l;const a=Q({props:t,name:"MuiFormControlLabel"}),{className:d,componentsProps:u={},control:i,disabled:c,disableTypography:h,label:v,labelPlacement:x="end",required:m,slotProps:C={}}=a,j=H(a,ht),p=X(),g=(s=c??i.props.disabled)!=null?s:p==null?void 0:p.disabled,y=m??i.props.required,f={disabled:g,required:y};["checked","name","onChange","value","inputRef"].forEach(D=>{typeof i.props[D]>"u"&&typeof a[D]<"u"&&(f[D]=a[D])});const b=he({props:a,muiFormControl:p,states:["error"]}),B=k({},a,{disabled:g,labelPlacement:x,required:y,error:b.error}),P=mt(B),w=(l=C.typography)!=null?l:u.typography;let S=v;return S!=null&&S.type!==J&&!h&&(S=o.jsx(J,k({component:"span"},w,{className:z(P.label,w==null?void 0:w.className),children:S}))),o.jsxs(ft,k({className:z(P.root,d),ownerState:B,ref:n},j,{children:[r.cloneElement(i,f),y?o.jsxs(ie,{display:"block",children:[S,o.jsxs(bt,{ownerState:B,"aria-hidden":!0,className:P.asterisk,children:[" ","*"]})]}):S]}))}),Gt=xt;function gt({name:e,value:t,last:n,style:s,headerStyle:l={},textStyle:a={}}){const d=n?{marginLeft:5,...s}:{marginLeft:5,marginBottom:8,...s},u={color:"#666",fontSize:"0.85rem",...l},i={marginLeft:5,...a};return o.jsxs("div",{style:d,children:[o.jsx("div",{style:u,children:e}),o.jsx("div",{style:i,children:t})]})}const Nt=U.memo(gt);var Z={},vt=W;Object.defineProperty(Z,"__esModule",{value:!0});var Ct=Z.default=void 0,kt=vt(V()),yt=o;Ct=Z.default=(0,kt.default)((0,yt.jsx)("path",{d:"M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m0 16H8V7h11z"}),"ContentCopy");var ee={},jt=W;Object.defineProperty(ee,"__esModule",{value:!0});var be=ee.default=void 0,Ft=jt(V()),Pt=o;be=ee.default=(0,Ft.default)((0,Pt.jsx)("path",{d:"M5 13h14v-2H5zm-2 4h14v-2H3zM7 7v2h14V7z"}),"ClearAll");function St({forceText:e}){const{isMobile:t}=fe(),{filterCount:n,clearFilters:s}=r.useContext(T);return n===0?null:t&&!e?o.jsx(M,{title:"Clear Filters",arrow:!0,disableFocusListener:!0,children:o.jsx(L,{onClick:s,children:o.jsx(be,{})})}):o.jsx(de,{variant:"outlined",color:"inherit",onClick:s,style:{minWidth:120},children:"Clear Filters"})}var te={},$t=W;Object.defineProperty(te,"__esModule",{value:!0});var xe=te.default=void 0,Bt=$t(V()),Dt=o;xe=te.default=(0,Bt.default)((0,Dt.jsx)("path",{d:"M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39c.51-.66.04-1.61-.79-1.61H5.04c-.83 0-1.3.95-.79 1.61"}),"FilterAlt");function It({label:e,fieldName:t,onFilter:n,sort:s}){const{visibleEntries:l}=r.useContext(Me),{filters:a}=r.useContext(T),[d,u]=r.useState(!1),i=r.useCallback(p=>{u(!1),setTimeout(()=>n(t,p.target.value,!0),0),setTimeout(()=>document.activeElement.blur())},[t,n]),c=r.useCallback(()=>{u(!1),setTimeout(()=>document.activeElement.blur())},[]),h=r.useCallback(()=>u(!0),[]),{counts:v,options:x}=r.useMemo(()=>{const p=l.map(f=>f[t]).flat().filter(f=>f),g=p.reduce((f,b)=>(f[b]||(f[b]=0),f[b]++,f),{}),y=[...new Set(p)].sort((f,b)=>{if(s)return s(f,b);if(typeof f=="string"&&typeof b=="string")return f.localeCompare(b);if(Number.isInteger(f)&&Number.isInteger(b))return f-b});return{counts:g,options:y}},[t,l,s]),m=r.useDeferredValue(a),C=m[t],j=Array.isArray(C)?m[t]:C?[C]:[];return o.jsxs(Ae,{style:{minWidth:120,maxWidth:300,marginTop:4},fullWidth:!0,children:[o.jsx(_e,{id:`filter-${t}`,color:"secondary",children:e}),o.jsx(ze,{multiple:!0,label:e,labelId:`filter-${t}`,value:j,onChange:i,style:{marginBottom:8},color:"secondary",open:d,onClose:c,onOpen:h,onBlur:c,MenuProps:{PaperProps:{style:{maxHeight:wt*8+Rt}}},renderValue:p=>o.jsx(me,{sx:{display:"flex",flexWrap:"wrap",gap:.5},children:p.map(g=>o.jsx(Le,{label:g},g))}),children:x.map((p,g)=>o.jsx(ue,{value:p,children:`${p} (${v[p]||0})`},g))})]})}const wt=48,Rt=8;function Jt({onFiltersChanged:e,extraFilters:t=[]}){const{isLoggedIn:n}=r.useContext($e),{beta:s}=r.useContext(Be),{filterCount:l,addFilters:a,filterFields:d}=r.useContext(T),[u,i]=r.useState(!1),c=r.useCallback(()=>i(!u),[u]);pe("f",c);const h=r.useCallback(()=>i(!0),[]),v=r.useCallback(()=>i(!1),[]),x=r.useCallback((m,C)=>{a([{key:m,value:C},{key:"id",value:void 0},{key:"name",value:void 0},...t],!0),e&&e()},[a,e,t]);return o.jsxs(U.Fragment,{children:[o.jsx(M,{title:"Filter",arrow:!0,disableFocusListener:!0,children:o.jsx(L,{color:"inherit",onClick:h,children:o.jsx(Y,{badgeContent:l,color:"secondary",overlap:"circular",anchorOrigin:{vertical:"bottom",horizontal:"right"},children:o.jsx(xe,{})})})}),o.jsxs(De,{anchor:"right",open:u,onClose:v,children:[o.jsx(se,{variant:"dense",onClick:v,children:o.jsx(J,{variant:"h6",children:"Filters"})}),o.jsx(me,{margin:1,children:o.jsx(ie,{direction:"column",style:{minWidth:250},children:d.filter(m=>(!m.beta||s)&&(!m.userBased||n)).map((m,C)=>o.jsx(It,{...m,onFilter:x},C))})}),o.jsxs(se,{variant:"dense",children:[o.jsx(St,{forceText:!0,style:{marginRight:8}}),o.jsx(de,{variant:"outlined",color:"inherit",onClick:v,children:"Done"})]})]})]})}function Kt({sortValues:e}){const[t,n]=r.useState(null),s=!!t,l=r.useCallback(h=>n(h.currentTarget),[]),a=r.useCallback(()=>n(null),[]),{filters:d,addFilter:u}=r.useContext(T),{sort:i}=d,c=r.useCallback(h=>()=>{a(),setTimeout(()=>u("sort",h,!0),0)},[u,a]);return o.jsxs(U.Fragment,{children:[o.jsx(M,{title:"Sort",arrow:!0,disableFocusListener:!0,children:o.jsx(L,{color:"inherit",onClick:l,children:o.jsx(Y,{variant:"dot",color:"secondary",overlap:"circular",invisible:!i,anchorOrigin:{vertical:"bottom",horizontal:"right"},children:o.jsx(Te,{})})})}),o.jsx(Ie,{anchorEl:t,open:s,onClose:a,children:e.map(({label:h,value:v})=>o.jsx(ue,{onClick:c(v),selected:i===v,children:h},h))})]})}var oe={},At=W;Object.defineProperty(oe,"__esModule",{value:!0});var ge=oe.default=void 0,_t=At(V()),zt=o;ge=oe.default=(0,_t.default)((0,zt.jsx)("path",{d:"M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Clear");function Qt({label:e,extraFilters:t=[]}){const[n]=we(),{filters:s,addFilters:l,removeFilter:a}=r.useContext(T),[d,u]=r.useState(s.search||""),{isMobile:i}=fe(),c=r.useRef();pe("s",()=>{var b;return(b=c==null?void 0:c.current)==null?void 0:b.focus()},{preventDefault:!0});const h=r.useCallback(()=>{window.scrollTo({top:0}),u(""),a("search",""),c.current.focus()},[a]),v=r.useCallback(b=>{const{value:B}=b.target;u(B)},[]),x=Ee(d,250);r.useEffect(()=>{x!==n.get("search")&&(x?(window.scrollTo({top:0}),l([{key:"search",value:x},{key:"id",value:void 0},{key:"name",value:void 0},...t],!0)):l([{key:"search",value:x}],!0))},[x]);const[m,C]=r.useState(!1),j=r.useCallback(()=>setTimeout(()=>C(!1),0),[]),p=r.useCallback(()=>{C(!0),setTimeout(()=>{c.current.focus(),c.current.select()},0)},[]);r.useEffect(()=>{const b=n.get("search");b!==d&&u(b||"")},[n]);const g=d?o.jsx(le,{position:"end",children:o.jsx(M,{title:"Clear",arrow:!0,disableFocusListener:!0,children:o.jsx(L,{color:"inherit",onClick:h,edge:"end",size:"small",children:o.jsx(ge,{})})})}):null,y=i?{maxWidth:450,marginRight:8}:{maxWidth:450,paddingLeft:60,marginRight:8},f=m&&i?{width:"auto",position:"fixed",left:60,right:0,paddingRight:16,maxWidth:"unset",zIndex:9999999,backgroundColor:"#272727"}:{};return o.jsxs(U.Fragment,{children:[!m&&i&&o.jsx(M,{title:"Search",arrow:!0,disableFocusListener:!0,children:o.jsx(L,{color:"inherit",onClick:p,children:o.jsx(Y,{invisible:d.length===0,variant:"dot",color:"secondary",overlap:"circular",anchorOrigin:{vertical:"bottom",horizontal:"right"},children:o.jsx(ae,{})})})}),(m||!i)&&o.jsx(Oe,{placeholder:`Search ${e}`,InputProps:{inputProps:{ref:c},startAdornment:o.jsx(le,{position:"start",children:o.jsx(ae,{})}),endAdornment:g},variant:"standard",color:"secondary",onChange:v,onBlur:j,value:d,style:{...y,...f},fullWidth:!0}),o.jsx(Re,{invisible:!0,open:m&&i,onClick:j})]})}const Xt=[{label:"Default",value:void 0},{label:"Alphabetical (Ascending)",value:"alphaAscending"},{label:"Alphabetical (Descending)",value:"alphaDescending"},{label:"Belt (Ascending)",value:"beltAscending"},{label:"Belt (Descending)",value:"beltDescending"},{label:"Popularity",value:"popularity"},{label:"Recently Updated",value:"recentlyUpdated"}],Yt=[{label:"Default",value:void 0},{label:"UL Group (Ascending)",value:"groupAscending"},{label:"UL Group (Descending)",value:"groupDescending"},{label:"Difficulty Tier (Ascending)",value:"tierAscending"},{label:"Difficulty Tier (Descending)",value:"tierDescending"},{label:"Alphabetical (Ascending)",value:"alphaAscending"},{label:"Alphabetical (Descending)",value:"alphaDescending"},{label:"Recently Updated",value:"recentlyUpdated"}],Zt=[{label:"Default",value:void 0},{label:"Dan Points (Ascending)",value:"danPointsAscending"},{label:"Dan Points (Descending)",value:"danPointsDescending"},{label:"Date (Ascending)",value:"dateAscending"},{label:"Date (Descending)",value:"dateDescending"},{label:"Belt (Ascending)",value:"beltAscending"},{label:"Belt (Descending)",value:"beltDescending"},{label:"Alphabetical (Ascending)",value:"alphaAscending"},{label:"Alphabetical (Descending)",value:"alphaDescending"}];export{Vt as C,Jt as F,Qt as S,Kt as a,Nt as b,Wt as c,Ct as d,Gt as e,Yt as f,St as g,Xt as l,Zt as s};
