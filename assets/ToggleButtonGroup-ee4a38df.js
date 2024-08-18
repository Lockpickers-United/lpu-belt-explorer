import{r as n,g as _,a as j,s as U,B as H,c as O,_ as g,ac as W,b as P,a_ as q,u as E,j as L,d as A,e as F}from"./index-c20bd96b.js";function I(t){return n.Children.toArray(t).filter(o=>n.isValidElement(o))}function J(t){return j("MuiToggleButton",t)}const K=_("MuiToggleButton",["root","disabled","selected","standard","primary","secondary","sizeSmall","sizeMedium","sizeLarge","fullWidth"]),x=K,Q=n.createContext({}),V=Q,X=n.createContext(void 0),D=X;function Y(t,o){return o===void 0||t===void 0?!1:Array.isArray(o)?o.indexOf(t)>=0:t===o}const Z=["value"],w=["children","className","color","disabled","disableFocusRipple","fullWidth","onChange","onClick","selected","size","value"],S=t=>{const{classes:o,fullWidth:r,selected:s,disabled:f,size:c,color:v}=t,B={root:["root",s&&"selected",f&&"disabled",r&&"fullWidth",`size${O(c)}`,v]};return F(B,J,o)},tt=U(H,{name:"MuiToggleButton",slot:"Root",overridesResolver:(t,o)=>{const{ownerState:r}=t;return[o.root,o[`size${O(r.size)}`]]}})(({theme:t,ownerState:o})=>{let r=o.color==="standard"?t.palette.text.primary:t.palette[o.color].main,s;return t.vars&&(r=o.color==="standard"?t.vars.palette.text.primary:t.vars.palette[o.color].main,s=o.color==="standard"?t.vars.palette.text.primaryChannel:t.vars.palette[o.color].mainChannel),g({},t.typography.button,{borderRadius:(t.vars||t).shape.borderRadius,padding:11,border:`1px solid ${(t.vars||t).palette.divider}`,color:(t.vars||t).palette.action.active},o.fullWidth&&{width:"100%"},{[`&.${x.disabled}`]:{color:(t.vars||t).palette.action.disabled,border:`1px solid ${(t.vars||t).palette.action.disabledBackground}`},"&:hover":{textDecoration:"none",backgroundColor:t.vars?`rgba(${t.vars.palette.text.primaryChannel} / ${t.vars.palette.action.hoverOpacity})`:W(t.palette.text.primary,t.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:"transparent"}},[`&.${x.selected}`]:{color:r,backgroundColor:t.vars?`rgba(${s} / ${t.vars.palette.action.selectedOpacity})`:W(r,t.palette.action.selectedOpacity),"&:hover":{backgroundColor:t.vars?`rgba(${s} / calc(${t.vars.palette.action.selectedOpacity} + ${t.vars.palette.action.hoverOpacity}))`:W(r,t.palette.action.selectedOpacity+t.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:t.vars?`rgba(${s} / ${t.vars.palette.action.selectedOpacity})`:W(r,t.palette.action.selectedOpacity)}}}},o.size==="small"&&{padding:7,fontSize:t.typography.pxToRem(13)},o.size==="large"&&{padding:15,fontSize:t.typography.pxToRem(15)})}),ot=n.forwardRef(function(o,r){const s=n.useContext(V),{value:f}=s,c=P(s,Z),v=n.useContext(D),B=q(g({},c,{selected:Y(o.value,f)}),o),$=E({props:B,name:"MuiToggleButton"}),{children:h,className:p,color:k="standard",disabled:C=!1,disableFocusRipple:a=!1,fullWidth:N=!1,onChange:b,onClick:d,selected:R,size:m="medium",value:T}=$,y=P($,w),z=g({},$,{color:k,disabled:C,disableFocusRipple:a,fullWidth:N,size:m}),M=S(z),i=u=>{d&&(d(u,T),u.defaultPrevented)||b&&b(u,T)},l=v||"";return L.jsx(tt,g({className:A(c.className,M.root,p,l),disabled:C,focusRipple:!a,ref:r,onClick:i,onChange:b,value:T,ownerState:z,"aria-pressed":R},y,{children:h}))}),dt=ot;function et(t){return j("MuiToggleButtonGroup",t)}const rt=_("MuiToggleButtonGroup",["root","selected","vertical","disabled","grouped","groupedHorizontal","groupedVertical","fullWidth","firstButton","lastButton","middleButton"]),e=rt,st=["children","className","color","disabled","exclusive","fullWidth","onChange","orientation","size","value"],at=t=>{const{classes:o,orientation:r,fullWidth:s,disabled:f}=t,c={root:["root",r==="vertical"&&"vertical",s&&"fullWidth"],grouped:["grouped",`grouped${O(r)}`,f&&"disabled"],firstButton:["firstButton"],lastButton:["lastButton"],middleButton:["middleButton"]};return F(c,et,o)},lt=U("div",{name:"MuiToggleButtonGroup",slot:"Root",overridesResolver:(t,o)=>{const{ownerState:r}=t;return[{[`& .${e.grouped}`]:o.grouped},{[`& .${e.grouped}`]:o[`grouped${O(r.orientation)}`]},{[`& .${e.firstButton}`]:o.firstButton},{[`& .${e.lastButton}`]:o.lastButton},{[`& .${e.middleButton}`]:o.middleButton},o.root,r.orientation==="vertical"&&o.vertical,r.fullWidth&&o.fullWidth]}})(({ownerState:t,theme:o})=>g({display:"inline-flex",borderRadius:(o.vars||o).shape.borderRadius},t.orientation==="vertical"&&{flexDirection:"column"},t.fullWidth&&{width:"100%"},{[`& .${e.grouped}`]:g({},t.orientation==="horizontal"?{[`&.${e.selected} + .${e.grouped}.${e.selected}`]:{borderLeft:0,marginLeft:0}}:{[`&.${e.selected} + .${e.grouped}.${e.selected}`]:{borderTop:0,marginTop:0}})},t.orientation==="horizontal"?{[`& .${e.firstButton},& .${e.middleButton}`]:{borderTopRightRadius:0,borderBottomRightRadius:0},[`& .${e.lastButton},& .${e.middleButton}`]:{marginLeft:-1,borderLeft:"1px solid transparent",borderTopLeftRadius:0,borderBottomLeftRadius:0}}:{[`& .${e.firstButton},& .${e.middleButton}`]:{borderBottomLeftRadius:0,borderBottomRightRadius:0},[`& .${e.lastButton},& .${e.middleButton}`]:{marginTop:-1,borderTop:"1px solid transparent",borderTopLeftRadius:0,borderTopRightRadius:0}},t.orientation==="horizontal"?{[`& .${e.lastButton}.${x.disabled},& .${e.middleButton}.${x.disabled}`]:{borderLeft:"1px solid transparent"}}:{[`& .${e.lastButton}.${x.disabled},& .${e.middleButton}.${x.disabled}`]:{borderTop:"1px solid transparent"}})),nt=n.forwardRef(function(o,r){const s=E({props:o,name:"MuiToggleButtonGroup"}),{children:f,className:c,color:v="standard",disabled:B=!1,exclusive:$=!1,fullWidth:h=!1,onChange:p,orientation:k="horizontal",size:C="medium",value:a}=s,N=P(s,st),b=g({},s,{disabled:B,fullWidth:h,orientation:k,size:C}),d=at(b),R=n.useCallback((i,l)=>{if(!p)return;const u=a&&a.indexOf(l);let G;a&&u>=0?(G=a.slice(),G.splice(u,1)):G=a?a.concat(l):[l],p(i,G)},[p,a]),m=n.useCallback((i,l)=>{p&&p(i,a===l?null:l)},[p,a]),T=n.useMemo(()=>({className:d.grouped,onChange:$?m:R,value:a,size:C,fullWidth:h,color:v,disabled:B}),[d.grouped,$,m,R,a,C,h,v,B]),y=I(f),z=y.length,M=i=>{const l=i===0,u=i===z-1;return l&&u?"":l?d.firstButton:u?d.lastButton:d.middleButton};return L.jsx(lt,g({role:"group",className:A(d.root,c),ref:r,ownerState:b},N,{children:L.jsx(V.Provider,{value:T,children:y.map((i,l)=>L.jsx(D.Provider,{value:M(l),children:i},l))})}))}),ut=nt;export{ut as T,dt as a};
