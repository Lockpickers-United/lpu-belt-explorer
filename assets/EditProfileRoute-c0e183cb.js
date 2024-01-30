import{m as N,l as _,s as m,z as g,_ as v,a4 as y,aj as I,ak as M,r,n as D,o as E,j as a,q as F,t as A,h as U,i as q,Q as S,u as O,a0 as $,e as j,C as R,a3 as P,T as V,I as W,c as z,b as L,S as H,R as w,U as Y,V as X,W as Z}from"./index-1d439e1c.js";import{l as Q}from"./LPU-c3fa7122.js";import{C as G}from"./CopyProfileLinkButton-2495973c.js";import{T as J}from"./TextField-0c801766.js";import{S as K}from"./SwitchBase-736b8f68.js";import{L as tt}from"./LinearProgress-2e826907.js";import"./Link-1b14c4b1.js";import"./InputLabel-c1066814.js";function at(t){return _("MuiSwitch",t)}const et=N("MuiSwitch",["root","edgeStart","edgeEnd","switchBase","colorPrimary","colorSecondary","sizeSmall","sizeMedium","checked","disabled","input","thumb","track"]),s=et,ot=["className","color","edge","size","sx"],st=t=>{const{classes:e,edge:o,size:n,color:i,checked:x,disabled:h}=t,c={root:["root",o&&`edge${g(o)}`,`size${g(n)}`],switchBase:["switchBase",`color${g(i)}`,x&&"checked",h&&"disabled"],thumb:["thumb"],track:["track"],input:["input"]},b=A(c,at,e);return v({},e,b)},rt=m("span",{name:"MuiSwitch",slot:"Root",overridesResolver:(t,e)=>{const{ownerState:o}=t;return[e.root,o.edge&&e[`edge${g(o.edge)}`],e[`size${g(o.size)}`]]}})(({ownerState:t})=>v({display:"inline-flex",width:34+12*2,height:14+12*2,overflow:"hidden",padding:12,boxSizing:"border-box",position:"relative",flexShrink:0,zIndex:0,verticalAlign:"middle","@media print":{colorAdjust:"exact"}},t.edge==="start"&&{marginLeft:-8},t.edge==="end"&&{marginRight:-8},t.size==="small"&&{width:40,height:24,padding:7,[`& .${s.thumb}`]:{width:16,height:16},[`& .${s.switchBase}`]:{padding:4,[`&.${s.checked}`]:{transform:"translateX(16px)"}}})),it=m(K,{name:"MuiSwitch",slot:"SwitchBase",overridesResolver:(t,e)=>{const{ownerState:o}=t;return[e.switchBase,{[`& .${s.input}`]:e.input},o.color!=="default"&&e[`color${g(o.color)}`]]}})(({theme:t})=>({position:"absolute",top:0,left:0,zIndex:1,color:t.vars?t.vars.palette.Switch.defaultColor:`${t.palette.mode==="light"?t.palette.common.white:t.palette.grey[300]}`,transition:t.transitions.create(["left","transform"],{duration:t.transitions.duration.shortest}),[`&.${s.checked}`]:{transform:"translateX(20px)"},[`&.${s.disabled}`]:{color:t.vars?t.vars.palette.Switch.defaultDisabledColor:`${t.palette.mode==="light"?t.palette.grey[100]:t.palette.grey[600]}`},[`&.${s.checked} + .${s.track}`]:{opacity:.5},[`&.${s.disabled} + .${s.track}`]:{opacity:t.vars?t.vars.opacity.switchTrackDisabled:`${t.palette.mode==="light"?.12:.2}`},[`& .${s.input}`]:{left:"-100%",width:"300%"}}),({theme:t,ownerState:e})=>v({"&:hover":{backgroundColor:t.vars?`rgba(${t.vars.palette.action.activeChannel} / ${t.vars.palette.action.hoverOpacity})`:y(t.palette.action.active,t.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}}},e.color!=="default"&&{[`&.${s.checked}`]:{color:(t.vars||t).palette[e.color].main,"&:hover":{backgroundColor:t.vars?`rgba(${t.vars.palette[e.color].mainChannel} / ${t.vars.palette.action.hoverOpacity})`:y(t.palette[e.color].main,t.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${s.disabled}`]:{color:t.vars?t.vars.palette.Switch[`${e.color}DisabledColor`]:`${t.palette.mode==="light"?I(t.palette[e.color].main,.62):M(t.palette[e.color].main,.55)}`}},[`&.${s.checked} + .${s.track}`]:{backgroundColor:(t.vars||t).palette[e.color].main}})),nt=m("span",{name:"MuiSwitch",slot:"Track",overridesResolver:(t,e)=>e.track})(({theme:t})=>({height:"100%",width:"100%",borderRadius:14/2,zIndex:-1,transition:t.transitions.create(["opacity","background-color"],{duration:t.transitions.duration.shortest}),backgroundColor:t.vars?t.vars.palette.common.onBackground:`${t.palette.mode==="light"?t.palette.common.black:t.palette.common.white}`,opacity:t.vars?t.vars.opacity.switchTrack:`${t.palette.mode==="light"?.38:.3}`})),ct=m("span",{name:"MuiSwitch",slot:"Thumb",overridesResolver:(t,e)=>e.thumb})(({theme:t})=>({boxShadow:(t.vars||t).shadows[1],backgroundColor:"currentColor",width:20,height:20,borderRadius:"50%"})),lt=r.forwardRef(function(e,o){const n=D({props:e,name:"MuiSwitch"}),{className:i,color:x="primary",edge:h=!1,size:c="medium",sx:b}=n,f=E(n,ot),l=v({},n,{color:x,edge:h,size:c}),d=st(l),u=a.jsx(ct,{className:d.thumb,ownerState:l});return a.jsxs(rt,{className:F(d.root,i),sx:b,ownerState:l,children:[a.jsx(it,v({type:"checkbox",icon:u,checkedIcon:u,ref:o,ownerState:l},f,{classes:v({},d,{root:d.switchBase})})),a.jsx(nt,{className:d.track,ownerState:l})]})}),dt=lt;var C={},ut=q;Object.defineProperty(C,"__esModule",{value:!0});var T=C.default=void 0,pt=ut(U()),ht=a;T=C.default=(0,pt.default)((0,ht.jsx)("path",{d:"M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3m3-10H5V5h10z"}),"Save");function gt(){const{lockCollection:t,updateProfileVisibility:e}=r.useContext(S),[o,n]=r.useState(t.displayName||""),[i,x]=r.useState(!!t.public),h=O(),{user:c}=r.useContext($),b=r.useCallback(p=>{const{value:k}=p.target;n(k)},[]),f=r.useCallback(p=>{const{checked:k}=p.target;x(k)},[]),l=r.useCallback(p=>p.target.select(),[]),d=r.useCallback(()=>{try{e(i,o),j("Updated profile."),h(`/profile/${c.uid}`)}catch(p){console.error("Error while updating profile",p),j("Error while updating profile.")}},[h,o,e,c==null?void 0:c.uid,i]),u=i&&!vt.test(o),B=u?o.length===0?"Public profiles must have a display name.":"Display name must only include A-Z, 0-9, _ and -.":i===!0?`Your profile will be public, as ${o}.`:"Your profile will be private";return a.jsxs(R,{style:{maxWidth:350,marginLeft:"auto",marginRight:"auto",marginTop:16,marginButtom:16},children:[a.jsx(P,{title:"Edit Profile",action:a.jsx(V,{title:"Save",arrow:!0,disableFocusListener:!0,children:a.jsx(W,{onClick:d,disabled:u,children:a.jsx(T,{color:u?void 0:"success"})})})}),a.jsxs(z,{children:[a.jsx(L,{children:"Set a display name for your profile. Public profiles can be shared and show nicknames on the leaderboard."}),a.jsx("br",{}),a.jsxs(H,{direction:"row",children:[a.jsx(J,{error:u,fullWidth:!0,variant:"outlined",color:"secondary",label:"Display Name",helperText:B,value:o||"",onChange:b,onFocus:l,inputProps:{maxLength:32}}),a.jsxs("div",{style:{textAlign:"center",width:100},children:[i?"Public":"Private",a.jsx(dt,{checked:i,color:"secondary",onChange:f})]})]})]})]})}const vt=/^[\sa-zA-Z0-9_-]{1,32}$/;function xt(){const t={marginTop:16,maxWidth:350,marginLeft:"auto",marginRight:"auto",borderRadius:0};return a.jsxs(R,{style:t,children:[a.jsx(P,{title:"Log In!"}),a.jsx(z,{children:a.jsx(L,{variant:"h6",align:"center",children:"You must be logged in to edit your profile."})})]})}function St(){const{authLoaded:t,isLoggedIn:e}=r.useContext($),{dbLoaded:o}=r.useContext(S),n=a.jsx(w.Fragment,{children:a.jsx(G,{})});return a.jsxs(w.Fragment,{children:[a.jsx(Y,{title:"Edit Profile",extras:n}),(!t||!o)&&a.jsxs(w.Fragment,{children:[a.jsx(tt,{variant:"indeterminate",color:"secondary"}),a.jsx("img",{alt:"Loading",src:Q,style:{marginLeft:"auto",marginRight:"auto",display:"block"}})]}),t&&!e&&a.jsx(xt,{}),t&&e&&o&&a.jsx(gt,{}),a.jsx(X,{}),a.jsx(Z,{feature:"editprofile"})]})}export{St as default};
