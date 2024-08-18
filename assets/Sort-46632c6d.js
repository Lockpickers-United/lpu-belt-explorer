import{g as ar,a as tr,s as A,c as t,r as nr,u as ir,b as er,_ as b,l as W,d as U,j as y,e as sr,y as lr,z as cr}from"./index-c20bd96b.js";import{u as F}from"./Search-38894117.js";function gr(o){const{badgeContent:a,invisible:r=!1,max:n=99,showZero:i=!1}=o,c=F({badgeContent:a,max:n});let s=r;r===!1&&a===0&&!i&&(s=!0);const{badgeContent:e,max:g=n}=s?c:o,p=e&&Number(e)>g?`${g}+`:e;return{badgeContent:e,invisible:s,max:g,displayValue:p}}function pr(o){return tr("MuiBadge",o)}const dr=ar("MuiBadge",["root","badge","dot","standard","anchorOriginTopRight","anchorOriginBottomRight","anchorOriginTopLeft","anchorOriginBottomLeft","invisible","colorError","colorInfo","colorPrimary","colorSecondary","colorSuccess","colorWarning","overlapRectangular","overlapCircular","anchorOriginTopLeftCircular","anchorOriginTopLeftRectangular","anchorOriginTopRightCircular","anchorOriginTopRightRectangular","anchorOriginBottomLeftCircular","anchorOriginBottomLeftRectangular","anchorOriginBottomRightCircular","anchorOriginBottomRightRectangular"]),l=dr,vr=["anchorOrigin","className","classes","component","components","componentsProps","children","overlap","color","invisible","max","badgeContent","slots","slotProps","showZero","variant"],O=10,x=4,ur=o=>{const{color:a,anchorOrigin:r,invisible:n,overlap:i,variant:c,classes:s={}}=o,e={root:["root"],badge:["badge",c,n&&"invisible",`anchorOrigin${t(r.vertical)}${t(r.horizontal)}`,`anchorOrigin${t(r.vertical)}${t(r.horizontal)}${t(i)}`,`overlap${t(i)}`,a!=="default"&&`color${t(a)}`]};return sr(e,pr,s)},fr=A("span",{name:"MuiBadge",slot:"Root",overridesResolver:(o,a)=>a.root})({position:"relative",display:"inline-flex",verticalAlign:"middle",flexShrink:0}),hr=A("span",{name:"MuiBadge",slot:"Badge",overridesResolver:(o,a)=>{const{ownerState:r}=o;return[a.badge,a[r.variant],a[`anchorOrigin${t(r.anchorOrigin.vertical)}${t(r.anchorOrigin.horizontal)}${t(r.overlap)}`],r.color!=="default"&&a[`color${t(r.color)}`],r.invisible&&a.invisible]}})(({theme:o})=>{var a;return{display:"flex",flexDirection:"row",flexWrap:"wrap",justifyContent:"center",alignContent:"center",alignItems:"center",position:"absolute",boxSizing:"border-box",fontFamily:o.typography.fontFamily,fontWeight:o.typography.fontWeightMedium,fontSize:o.typography.pxToRem(12),minWidth:O*2,lineHeight:1,padding:"0 6px",height:O*2,borderRadius:O,zIndex:1,transition:o.transitions.create("transform",{easing:o.transitions.easing.easeInOut,duration:o.transitions.duration.enteringScreen}),variants:[...Object.keys(((a=o.vars)!=null?a:o).palette).filter(r=>{var n,i;return((n=o.vars)!=null?n:o).palette[r].main&&((i=o.vars)!=null?i:o).palette[r].contrastText}).map(r=>({props:{color:r},style:{backgroundColor:(o.vars||o).palette[r].main,color:(o.vars||o).palette[r].contrastText}})),{props:{variant:"dot"},style:{borderRadius:x,height:x*2,minWidth:x*2,padding:0}},{props:({ownerState:r})=>r.anchorOrigin.vertical==="top"&&r.anchorOrigin.horizontal==="right"&&r.overlap==="rectangular",style:{top:0,right:0,transform:"scale(1) translate(50%, -50%)",transformOrigin:"100% 0%",[`&.${l.invisible}`]:{transform:"scale(0) translate(50%, -50%)"}}},{props:({ownerState:r})=>r.anchorOrigin.vertical==="bottom"&&r.anchorOrigin.horizontal==="right"&&r.overlap==="rectangular",style:{bottom:0,right:0,transform:"scale(1) translate(50%, 50%)",transformOrigin:"100% 100%",[`&.${l.invisible}`]:{transform:"scale(0) translate(50%, 50%)"}}},{props:({ownerState:r})=>r.anchorOrigin.vertical==="top"&&r.anchorOrigin.horizontal==="left"&&r.overlap==="rectangular",style:{top:0,left:0,transform:"scale(1) translate(-50%, -50%)",transformOrigin:"0% 0%",[`&.${l.invisible}`]:{transform:"scale(0) translate(-50%, -50%)"}}},{props:({ownerState:r})=>r.anchorOrigin.vertical==="bottom"&&r.anchorOrigin.horizontal==="left"&&r.overlap==="rectangular",style:{bottom:0,left:0,transform:"scale(1) translate(-50%, 50%)",transformOrigin:"0% 100%",[`&.${l.invisible}`]:{transform:"scale(0) translate(-50%, 50%)"}}},{props:({ownerState:r})=>r.anchorOrigin.vertical==="top"&&r.anchorOrigin.horizontal==="right"&&r.overlap==="circular",style:{top:"14%",right:"14%",transform:"scale(1) translate(50%, -50%)",transformOrigin:"100% 0%",[`&.${l.invisible}`]:{transform:"scale(0) translate(50%, -50%)"}}},{props:({ownerState:r})=>r.anchorOrigin.vertical==="bottom"&&r.anchorOrigin.horizontal==="right"&&r.overlap==="circular",style:{bottom:"14%",right:"14%",transform:"scale(1) translate(50%, 50%)",transformOrigin:"100% 100%",[`&.${l.invisible}`]:{transform:"scale(0) translate(50%, 50%)"}}},{props:({ownerState:r})=>r.anchorOrigin.vertical==="top"&&r.anchorOrigin.horizontal==="left"&&r.overlap==="circular",style:{top:"14%",left:"14%",transform:"scale(1) translate(-50%, -50%)",transformOrigin:"0% 0%",[`&.${l.invisible}`]:{transform:"scale(0) translate(-50%, -50%)"}}},{props:({ownerState:r})=>r.anchorOrigin.vertical==="bottom"&&r.anchorOrigin.horizontal==="left"&&r.overlap==="circular",style:{bottom:"14%",left:"14%",transform:"scale(1) translate(-50%, 50%)",transformOrigin:"0% 100%",[`&.${l.invisible}`]:{transform:"scale(0) translate(-50%, 50%)"}}},{props:{invisible:!0},style:{transition:o.transitions.create("transform",{easing:o.transitions.easing.easeInOut,duration:o.transitions.duration.leavingScreen})}}]}}),mr=nr.forwardRef(function(a,r){var n,i,c,s,e,g;const p=ir({props:a,name:"MuiBadge"}),{anchorOrigin:$={vertical:"top",horizontal:"right"},className:H,component:V,components:R={},componentsProps:C={},children:k,overlap:B="rectangular",color:_="default",invisible:E=!1,max:q=99,badgeContent:z,slots:d,slotProps:v,showZero:T=!1,variant:u="standard"}=p,Z=er(p,vr),{badgeContent:j,invisible:G,max:J,displayValue:K}=gr({max:q,invisible:E,badgeContent:z,showZero:T}),Q=F({anchorOrigin:$,color:_,overlap:B,variant:u,badgeContent:z}),I=G||j==null&&u!=="dot",{color:X=_,overlap:Y=B,anchorOrigin:w=$,variant:M=u}=I?Q:p,D=M!=="dot"?K:void 0,f=b({},p,{badgeContent:j,invisible:I,max:J,displayValue:D,showZero:T,anchorOrigin:w,color:X,overlap:Y,variant:M}),N=ur(f),L=(n=(i=d==null?void 0:d.root)!=null?i:R.Root)!=null?n:fr,S=(c=(s=d==null?void 0:d.badge)!=null?s:R.Badge)!=null?c:hr,h=(e=v==null?void 0:v.root)!=null?e:C.root,m=(g=v==null?void 0:v.badge)!=null?g:C.badge,rr=W({elementType:L,externalSlotProps:h,externalForwardedProps:Z,additionalProps:{ref:r,as:V},ownerState:f,className:U(h==null?void 0:h.className,N.root,H)}),or=W({elementType:S,externalSlotProps:m,ownerState:f,className:U(N.badge,m==null?void 0:m.className)});return y.jsxs(L,b({},rr,{children:[k,y.jsx(S,b({},or,{children:D}))]}))}),Rr=mr;var P={},br=cr;Object.defineProperty(P,"__esModule",{value:!0});var Or=P.default=void 0,xr=br(lr()),yr=y;Or=P.default=(0,xr.default)((0,yr.jsx)("path",{d:"M3 18h6v-2H3zM3 6v2h18V6zm0 7h12v-2H3z"}),"Sort");export{Rr as B,Or as d};
