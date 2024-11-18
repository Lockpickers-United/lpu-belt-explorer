import{f as k,h as G,s as w,k as M,_ as a,r as x,m as N,n as S,J as $,j as m,o as y,W as A,p as j}from"./index-f61ce2d4.js";import{u as q,b as _}from"./Select-7ef96313.js";function z(e){return G("MuiFormControlLabel",e)}const B=k("MuiFormControlLabel",["root","labelPlacementStart","labelPlacementTop","labelPlacementBottom","disabled","label","error","required","asterisk"]),u=B,H=["checked","className","componentsProps","control","disabled","disableTypography","inputRef","label","labelPlacement","name","onChange","required","slotProps","value"],I=e=>{const{classes:o,disabled:r,labelPlacement:s,error:l,required:t}=e,c={root:["root",r&&"disabled",`labelPlacement${M(s)}`,l&&"error",t&&"required"],label:["label",r&&"disabled"],asterisk:["asterisk",l&&"error"]};return j(c,z,o)},J=w("label",{name:"MuiFormControlLabel",slot:"Root",overridesResolver:(e,o)=>{const{ownerState:r}=e;return[{[`& .${u.label}`]:o.label},o.root,o[`labelPlacement${M(r.labelPlacement)}`]]}})(({theme:e,ownerState:o})=>a({display:"inline-flex",alignItems:"center",cursor:"pointer",verticalAlign:"middle",WebkitTapHighlightColor:"transparent",marginLeft:-11,marginRight:16,[`&.${u.disabled}`]:{cursor:"default"}},o.labelPlacement==="start"&&{flexDirection:"row-reverse",marginLeft:16,marginRight:-11},o.labelPlacement==="top"&&{flexDirection:"column-reverse",marginLeft:16},o.labelPlacement==="bottom"&&{flexDirection:"column",marginLeft:16},{[`& .${u.label}`]:{[`&.${u.disabled}`]:{color:(e.vars||e).palette.text.disabled}}})),K=w("span",{name:"MuiFormControlLabel",slot:"Asterisk",overridesResolver:(e,o)=>o.asterisk})(({theme:e})=>({[`&.${u.error}`]:{color:(e.vars||e).palette.error.main}})),O=x.forwardRef(function(o,r){var s,l;const t=N({props:o,name:"MuiFormControlLabel"}),{className:c,componentsProps:b={},control:n,disabled:p,disableTypography:f,label:T,labelPlacement:U="end",required:v,slotProps:D={}}=t,E=S(t,H),C=q(),L=(s=p??n.props.disabled)!=null?s:C==null?void 0:C.disabled,g=v??n.props.required,R={disabled:L,required:g};["checked","name","onChange","value","inputRef"].forEach(d=>{typeof n.props[d]>"u"&&typeof t[d]<"u"&&(R[d]=t[d])});const W=_({props:t,muiFormControl:C,states:["error"]}),h=a({},t,{disabled:L,labelPlacement:U,required:g,error:W.error}),P=I(h),F=(l=D.typography)!=null?l:b.typography;let i=T;return i!=null&&i.type!==$&&!f&&(i=m.jsx($,a({component:"span"},F,{className:y(P.label,F==null?void 0:F.className),children:i}))),m.jsxs(J,a({className:y(P.root,c),ownerState:h,ref:r},E,{children:[x.cloneElement(n,R),g?m.jsxs(A,{display:"block",children:[i,m.jsxs(K,{ownerState:h,"aria-hidden":!0,className:P.asterisk,children:[" ","*"]})]}):i]}))}),re=O;function Q(e){return G("MuiFormGroup",e)}k("MuiFormGroup",["root","row","error"]);const V=["className","row"],X=e=>{const{classes:o,row:r,error:s}=e;return j({root:["root",r&&"row",s&&"error"]},Q,o)},Y=w("div",{name:"MuiFormGroup",slot:"Root",overridesResolver:(e,o)=>{const{ownerState:r}=e;return[o.root,r.row&&o.row]}})(({ownerState:e})=>a({display:"flex",flexDirection:"column",flexWrap:"wrap"},e.row&&{flexDirection:"row"})),Z=x.forwardRef(function(o,r){const s=N({props:o,name:"MuiFormGroup"}),{className:l,row:t=!1}=s,c=S(s,V),b=q(),n=_({props:s,muiFormControl:b,states:["error"]}),p=a({},s,{row:t,error:n.error}),f=X(p);return m.jsx(Y,a({className:y(f.root,l),ownerState:p,ref:r},c))}),se=Z;export{se as F,re as a};