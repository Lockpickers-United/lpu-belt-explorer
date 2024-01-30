import{m as j,l as M,s as S,z as L,_ as l,r as N,n as U,o as _,j as a,q as B,t as W,ac as se}from"./index-71f562e3.js";import{u as le,c as ne,F as ae,I as ie,S as de,d as ce,e as ue,O as pe}from"./InputLabel-d28c8f84.js";function me(e){return M("MuiFormHelperText",e)}const fe=j("MuiFormHelperText",["root","error","disabled","sizeSmall","sizeMedium","contained","focused","filled","required"]),q=fe;var $;const xe=["children","className","component","disabled","error","filled","focused","margin","required","variant"],Fe=e=>{const{classes:o,contained:r,size:s,disabled:i,error:d,filled:c,focused:p,required:u}=e,t={root:["root",i&&"disabled",d&&"error",s&&`size${L(s)}`,r&&"contained",p&&"focused",c&&"filled",u&&"required"]};return W(t,me,o)},he=S("p",{name:"MuiFormHelperText",slot:"Root",overridesResolver:(e,o)=>{const{ownerState:r}=e;return[o.root,r.size&&o[`size${L(r.size)}`],r.contained&&o.contained,r.filled&&o.filled]}})(({theme:e,ownerState:o})=>l({color:(e.vars||e).palette.text.secondary},e.typography.caption,{textAlign:"left",marginTop:3,marginRight:0,marginBottom:0,marginLeft:0,[`&.${q.disabled}`]:{color:(e.vars||e).palette.text.disabled},[`&.${q.error}`]:{color:(e.vars||e).palette.error.main}},o.size==="small"&&{marginTop:4},o.contained&&{marginLeft:14,marginRight:14})),Te=N.forwardRef(function(o,r){const s=U({props:o,name:"MuiFormHelperText"}),{children:i,className:d,component:c="p"}=s,p=_(s,xe),u=le(),t=ne({props:s,muiFormControl:u,states:["variant","size","disabled","error","filled","focused","required"]}),m=l({},s,{component:c,contained:t.variant==="filled"||t.variant==="outlined",variant:t.variant,size:t.size,disabled:t.disabled,error:t.error,filled:t.filled,focused:t.focused,required:t.required}),F=Fe(m);return a.jsx(he,l({as:c,ownerState:m,className:B(F.root,d),ref:r},p,{children:i===" "?$||($=a.jsx("span",{className:"notranslate",children:"​"})):i}))}),be=Te;function ve(e){return M("MuiTextField",e)}j("MuiTextField",["root"]);const Ce=["autoComplete","autoFocus","children","className","color","defaultValue","disabled","error","FormHelperTextProps","fullWidth","helperText","id","InputLabelProps","inputProps","InputProps","inputRef","label","maxRows","minRows","multiline","name","onBlur","onChange","onFocus","placeholder","required","rows","select","SelectProps","type","value","variant"],Re={standard:ce,filled:ue,outlined:pe},ge=e=>{const{classes:o}=e;return W({root:["root"]},ve,o)},Ie=S(ae,{name:"MuiTextField",slot:"Root",overridesResolver:(e,o)=>o.root})({}),we=N.forwardRef(function(o,r){const s=U({props:o,name:"MuiTextField"}),{autoComplete:i,autoFocus:d=!1,children:c,className:p,color:u="primary",defaultValue:t,disabled:m=!1,error:F=!1,FormHelperTextProps:E,fullWidth:b=!1,helperText:v,id:O,InputLabelProps:h,inputProps:V,InputProps:k,inputRef:A,label:f,maxRows:D,minRows:G,multiline:I=!1,name:J,onBlur:K,onChange:Q,onFocus:X,placeholder:Y,required:w=!1,rows:Z,select:C=!1,SelectProps:R,type:ee,value:y,variant:T="outlined"}=s,oe=_(s,Ce),z=l({},s,{autoFocus:d,color:u,disabled:m,error:F,fullWidth:b,multiline:I,required:w,select:C,variant:T}),te=ge(z),x={};T==="outlined"&&(h&&typeof h.shrink<"u"&&(x.notched=h.shrink),x.label=f),C&&((!R||!R.native)&&(x.id=void 0),x["aria-describedby"]=void 0);const n=se(O),g=v&&n?`${n}-helper-text`:void 0,H=f&&n?`${n}-label`:void 0,re=Re[T],P=a.jsx(re,l({"aria-describedby":g,autoComplete:i,autoFocus:d,defaultValue:t,fullWidth:b,multiline:I,name:J,rows:Z,maxRows:D,minRows:G,type:ee,value:y,id:n,inputRef:A,onBlur:K,onChange:Q,onFocus:X,placeholder:Y,inputProps:V},x,k));return a.jsxs(Ie,l({className:B(te.root,p),disabled:m,error:F,fullWidth:b,ref:r,required:w,color:u,variant:T,ownerState:z},oe,{children:[f!=null&&f!==""&&a.jsx(ie,l({htmlFor:n,id:H},h,{children:f})),C?a.jsx(de,l({"aria-describedby":g,id:n,labelId:H,value:y,input:P},R,{children:c})):P,v&&a.jsx(be,l({id:g},E,{children:v}))]}))}),He=we;export{He as T};