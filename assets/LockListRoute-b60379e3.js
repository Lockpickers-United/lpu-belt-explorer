import{f as ge,h as Se,s as Y,i as st,k as it,_ as S,r as n,m as Ce,n as ie,o as D,j as t,p as je,q as _t,t as at,v as ct,w as dt,x as ut,y as xe,z as Le,C as Nt,L as Ht,b as ft,I as R,E as Ke,B as Ot,R as X,G as z,H as Dt,J as me,K as ae,M as ce,O as Me,P as ht,Q as qt,U as Vt,V as ve,W as Ut,X as Xt,F as Yt,u as pt,Y as Ge,D as Kt,Z as Gt,N as Zt,T as Jt}from"./index-d9df6ac9.js";import{D as ye,F as bt,a as Qt,l as er}from"./filterFields-098944b7.js";import{u as tr}from"./usePageTitle-eec0b67a.js";import{L as we,a as rr}from"./LockListContext-fa07bb2a.js";import{D as or}from"./LockDataProvider-2c16e9dd.js";import{C as nr,E as lr,a as sr}from"./ExportButton-5bd9d485.js";import{I as ir}from"./InlineFilterDisplay-7d50c7b1.js";import{d as ar}from"./FieldValue-70f7f8b0.js";import{B as cr}from"./BeltStripe-4e98dd96.js";import{d as dr}from"./Link-5214e785.js";import{w as ur,y as fr,o as hr,g as pr,b as br,p as xr,a as mr,r as vr,c as gr}from"./black-c0c5d153.js";import{A as Sr,a as Cr,b as jr}from"./AccordionSummary-baa201c4.js";import{M as yr}from"./index-3fe64df1.js";import{A as wr}from"./AccordionActions-e03f8769.js";import"./index-bb7761b6.js";import{N as kr,V as Br}from"./ViewFilterButtons-06406431.js";import{T as xt,d as mt,l as Er,a as Ir,b as Lr}from"./ImageViewer-5585d2f6.js";import{D as vt}from"./Dialog-510058f6.js";import{D as gt,a as Fr}from"./DialogContent-7f241da0.js";import{L as Mr}from"./ListItem-5c210e7b.js";import{d as Tr}from"./Launch-6e9a0de6.js";import{L as Rr}from"./LinearProgress-51d7a2f2.js";import{B as zr}from"./BeltIcon-0c4e4571.js";import{l as $r}from"./sortFields-4ba3a593.js";import{S as Pr}from"./SearchBox-a7867bec.js";import"./useDocumentTitle-ed3efe32.js";import"./entryName-f1774cd9.js";import"./CopyEntryTextButton-016b4b06.js";import"./ContentCopy-dd4860bb.js";import"./index-7b01e2f1.js";import"./download-2602562a.js";import"./List-b469c3cf.js";import"./Chip-64ed9c07.js";import"./Select-a1c5bb91.js";import"./Link-5828f5aa.js";import"./Badge-94f73d7f.js";import"./ToggleButtonGroup-f53287dc.js";import"./Box-4be2972d.js";import"./PhotoCamera-3c73dada.js";import"./Autocomplete-ad53c89b.js";import"./TextField-8a6fe3c6.js";import"./index-61370078.js";import"./VideocamOutlined-f7aace6d.js";import"./FormGroup-8fab59d3.js";import"./Checkbox-df0adc2d.js";import"./LoadingDisplay-9d850534.js";import"./CircularProgress-4be02506.js";import"./LoadingDisplaySmall-775f1628.js";import"./Search-e870a8c7.js";let re;function St(){if(re)return re;const e=document.createElement("div"),r=document.createElement("div");return r.style.width="10px",r.style.height="1px",e.appendChild(r),e.dir="rtl",e.style.fontSize="14px",e.style.width="4px",e.style.height="1px",e.style.position="absolute",e.style.top="-1000px",e.style.overflow="scroll",document.body.appendChild(e),re="reverse",e.scrollLeft>0?re="default":(e.scrollLeft=1,e.scrollLeft===0&&(re="negative")),document.body.removeChild(e),re}function Wr(e,r){const o=e.scrollLeft;if(r!=="rtl")return o;switch(St()){case"negative":return e.scrollWidth-e.clientWidth+o;case"reverse":return e.scrollWidth-e.clientWidth-o;default:return o}}function Ar(e){return Se("MuiTab",e)}const _r=ge("MuiTab",["root","labelIcon","textColorInherit","textColorPrimary","textColorSecondary","selected","disabled","fullWidth","wrapped","iconWrapper"]),Q=_r,Nr=["className","disabled","disableFocusRipple","fullWidth","icon","iconPosition","indicator","label","onChange","onClick","onFocus","selected","selectionFollowsFocus","textColor","value","wrapped"],Hr=e=>{const{classes:r,textColor:o,fullWidth:l,wrapped:i,icon:a,label:d,selected:h,disabled:u}=e,v={root:["root",a&&d&&"labelIcon",`textColor${it(o)}`,l&&"fullWidth",i&&"wrapped",h&&"selected",u&&"disabled"],iconWrapper:["iconWrapper"]};return je(v,Ar,r)},Or=Y(st,{name:"MuiTab",slot:"Root",overridesResolver:(e,r)=>{const{ownerState:o}=e;return[r.root,o.label&&o.icon&&r.labelIcon,r[`textColor${it(o.textColor)}`],o.fullWidth&&r.fullWidth,o.wrapped&&r.wrapped]}})(({theme:e,ownerState:r})=>S({},e.typography.button,{maxWidth:360,minWidth:90,position:"relative",minHeight:48,flexShrink:0,padding:"12px 16px",overflow:"hidden",whiteSpace:"normal",textAlign:"center"},r.label&&{flexDirection:r.iconPosition==="top"||r.iconPosition==="bottom"?"column":"row"},{lineHeight:1.25},r.icon&&r.label&&{minHeight:72,paddingTop:9,paddingBottom:9,[`& > .${Q.iconWrapper}`]:S({},r.iconPosition==="top"&&{marginBottom:6},r.iconPosition==="bottom"&&{marginTop:6},r.iconPosition==="start"&&{marginRight:e.spacing(1)},r.iconPosition==="end"&&{marginLeft:e.spacing(1)})},r.textColor==="inherit"&&{color:"inherit",opacity:.6,[`&.${Q.selected}`]:{opacity:1},[`&.${Q.disabled}`]:{opacity:(e.vars||e).palette.action.disabledOpacity}},r.textColor==="primary"&&{color:(e.vars||e).palette.text.secondary,[`&.${Q.selected}`]:{color:(e.vars||e).palette.primary.main},[`&.${Q.disabled}`]:{color:(e.vars||e).palette.text.disabled}},r.textColor==="secondary"&&{color:(e.vars||e).palette.text.secondary,[`&.${Q.selected}`]:{color:(e.vars||e).palette.secondary.main},[`&.${Q.disabled}`]:{color:(e.vars||e).palette.text.disabled}},r.fullWidth&&{flexShrink:1,flexGrow:1,flexBasis:0,maxWidth:"none"},r.wrapped&&{fontSize:e.typography.pxToRem(12)})),Dr=n.forwardRef(function(r,o){const l=Ce({props:r,name:"MuiTab"}),{className:i,disabled:a=!1,disableFocusRipple:d=!1,fullWidth:h,icon:u,iconPosition:v="top",indicator:x,label:w,onChange:C,onClick:k,onFocus:p,selected:m,selectionFollowsFocus:y,textColor:P="inherit",value:L,wrapped:oe=!1}=l,q=ie(l,Nr),A=S({},l,{disabled:a,disableFocusRipple:d,selected:m,icon:!!u,iconPosition:v,label:!!w,fullWidth:h,textColor:P,wrapped:oe}),_=Hr(A),N=u&&w&&n.isValidElement(u)?n.cloneElement(u,{className:D(_.iconWrapper,u.props.className)}):u,ee=E=>{!m&&C&&C(E,L),k&&k(E)},$=E=>{y&&!m&&C&&C(E,L),p&&p(E)};return t.jsxs(Or,S({focusRipple:!d,className:D(_.root,i),ref:o,role:"tab","aria-selected":m,disabled:a,onClick:ee,onFocus:$,ownerState:A,tabIndex:m?0:-1},q,{children:[v==="top"||v==="start"?t.jsxs(n.Fragment,{children:[N,w]}):t.jsxs(n.Fragment,{children:[w,N]}),x]}))}),Ze=Dr;function qr(e){return(1+Math.sin(Math.PI*e-Math.PI/2))/2}function Vr(e,r,o,l={},i=()=>{}){const{ease:a=qr,duration:d=300}=l;let h=null;const u=r[e];let v=!1;const x=()=>{v=!0},w=C=>{if(v){i(new Error("Animation cancelled"));return}h===null&&(h=C);const k=Math.min(1,(C-h)/d);if(r[e]=a(k)*(o-u)+u,k>=1){requestAnimationFrame(()=>{i(null)});return}requestAnimationFrame(w)};return u===o?(i(new Error("Element already at target position")),x):(requestAnimationFrame(w),x)}const Ur=["onChange"],Xr={width:99,height:99,position:"absolute",top:-9999,overflow:"scroll"};function Yr(e){const{onChange:r}=e,o=ie(e,Ur),l=n.useRef(),i=n.useRef(null),a=()=>{l.current=i.current.offsetHeight-i.current.clientHeight};return _t(()=>{const d=at(()=>{const u=l.current;a(),u!==l.current&&r(l.current)}),h=ct(i.current);return h.addEventListener("resize",d),()=>{d.clear(),h.removeEventListener("resize",d)}},[r]),n.useEffect(()=>{a(),r(l.current)},[r]),t.jsx("div",S({style:Xr,ref:i},o))}const Kr=dt(t.jsx("path",{d:"M15.41 16.09l-4.58-4.59 4.58-4.59L14 5.5l-6 6 6 6z"}),"KeyboardArrowLeft"),Gr=dt(t.jsx("path",{d:"M8.59 16.34l4.58-4.59-4.58-4.59L10 5.75l6 6-6 6z"}),"KeyboardArrowRight");function Zr(e){return Se("MuiTabScrollButton",e)}const Jr=ge("MuiTabScrollButton",["root","vertical","horizontal","disabled"]),Qr=Jr,eo=["className","slots","slotProps","direction","orientation","disabled"],to=e=>{const{classes:r,orientation:o,disabled:l}=e;return je({root:["root",o,l&&"disabled"]},Zr,r)},ro=Y(st,{name:"MuiTabScrollButton",slot:"Root",overridesResolver:(e,r)=>{const{ownerState:o}=e;return[r.root,o.orientation&&r[o.orientation]]}})(({ownerState:e})=>S({width:40,flexShrink:0,opacity:.8,[`&.${Qr.disabled}`]:{opacity:0}},e.orientation==="vertical"&&{width:"100%",height:40,"& svg":{transform:`rotate(${e.isRtl?-90:90}deg)`}})),oo=n.forwardRef(function(r,o){var l,i;const a=Ce({props:r,name:"MuiTabScrollButton"}),{className:d,slots:h={},slotProps:u={},direction:v}=a,x=ie(a,eo),C=ut().direction==="rtl",k=S({isRtl:C},a),p=to(k),m=(l=h.StartScrollButtonIcon)!=null?l:Kr,y=(i=h.EndScrollButtonIcon)!=null?i:Gr,P=xe({elementType:m,externalSlotProps:u.startScrollButtonIcon,additionalProps:{fontSize:"small"},ownerState:k}),L=xe({elementType:y,externalSlotProps:u.endScrollButtonIcon,additionalProps:{fontSize:"small"},ownerState:k});return t.jsx(ro,S({component:"div",className:D(p.root,d),ref:o,role:null,ownerState:k,tabIndex:null},x,{children:v==="left"?t.jsx(m,S({},P)):t.jsx(y,S({},L))}))}),no=oo;function lo(e){return Se("MuiTabs",e)}const so=ge("MuiTabs",["root","vertical","flexContainer","flexContainerVertical","centered","scroller","fixed","scrollableX","scrollableY","hideScrollbar","scrollButtons","scrollButtonsHideMobile","indicator"]),Fe=so,io=["aria-label","aria-labelledby","action","centered","children","className","component","allowScrollButtonsMobile","indicatorColor","onChange","orientation","ScrollButtonComponent","scrollButtons","selectionFollowsFocus","slots","slotProps","TabIndicatorProps","TabScrollButtonProps","textColor","value","variant","visibleScrollbar"],Je=(e,r)=>e===r?e.firstChild:r&&r.nextElementSibling?r.nextElementSibling:e.firstChild,Qe=(e,r)=>e===r?e.lastChild:r&&r.previousElementSibling?r.previousElementSibling:e.lastChild,be=(e,r,o)=>{let l=!1,i=o(e,r);for(;i;){if(i===e.firstChild){if(l)return;l=!0}const a=i.disabled||i.getAttribute("aria-disabled")==="true";if(!i.hasAttribute("tabindex")||a)i=o(e,i);else{i.focus();return}}},ao=e=>{const{vertical:r,fixed:o,hideScrollbar:l,scrollableX:i,scrollableY:a,centered:d,scrollButtonsHideMobile:h,classes:u}=e;return je({root:["root",r&&"vertical"],scroller:["scroller",o&&"fixed",l&&"hideScrollbar",i&&"scrollableX",a&&"scrollableY"],flexContainer:["flexContainer",r&&"flexContainerVertical",d&&"centered"],indicator:["indicator"],scrollButtons:["scrollButtons",h&&"scrollButtonsHideMobile"],scrollableX:[i&&"scrollableX"],hideScrollbar:[l&&"hideScrollbar"]},lo,u)},co=Y("div",{name:"MuiTabs",slot:"Root",overridesResolver:(e,r)=>{const{ownerState:o}=e;return[{[`& .${Fe.scrollButtons}`]:r.scrollButtons},{[`& .${Fe.scrollButtons}`]:o.scrollButtonsHideMobile&&r.scrollButtonsHideMobile},r.root,o.vertical&&r.vertical]}})(({ownerState:e,theme:r})=>S({overflow:"hidden",minHeight:48,WebkitOverflowScrolling:"touch",display:"flex"},e.vertical&&{flexDirection:"column"},e.scrollButtonsHideMobile&&{[`& .${Fe.scrollButtons}`]:{[r.breakpoints.down("sm")]:{display:"none"}}})),uo=Y("div",{name:"MuiTabs",slot:"Scroller",overridesResolver:(e,r)=>{const{ownerState:o}=e;return[r.scroller,o.fixed&&r.fixed,o.hideScrollbar&&r.hideScrollbar,o.scrollableX&&r.scrollableX,o.scrollableY&&r.scrollableY]}})(({ownerState:e})=>S({position:"relative",display:"inline-block",flex:"1 1 auto",whiteSpace:"nowrap"},e.fixed&&{overflowX:"hidden",width:"100%"},e.hideScrollbar&&{scrollbarWidth:"none","&::-webkit-scrollbar":{display:"none"}},e.scrollableX&&{overflowX:"auto",overflowY:"hidden"},e.scrollableY&&{overflowY:"auto",overflowX:"hidden"})),fo=Y("div",{name:"MuiTabs",slot:"FlexContainer",overridesResolver:(e,r)=>{const{ownerState:o}=e;return[r.flexContainer,o.vertical&&r.flexContainerVertical,o.centered&&r.centered]}})(({ownerState:e})=>S({display:"flex"},e.vertical&&{flexDirection:"column"},e.centered&&{justifyContent:"center"})),ho=Y("span",{name:"MuiTabs",slot:"Indicator",overridesResolver:(e,r)=>r.indicator})(({ownerState:e,theme:r})=>S({position:"absolute",height:2,bottom:0,width:"100%",transition:r.transitions.create()},e.indicatorColor==="primary"&&{backgroundColor:(r.vars||r).palette.primary.main},e.indicatorColor==="secondary"&&{backgroundColor:(r.vars||r).palette.secondary.main},e.vertical&&{height:"100%",width:2,right:0})),po=Y(Yr)({overflowX:"auto",overflowY:"hidden",scrollbarWidth:"none","&::-webkit-scrollbar":{display:"none"}}),et={},bo=n.forwardRef(function(r,o){const l=Ce({props:r,name:"MuiTabs"}),i=ut(),a=i.direction==="rtl",{"aria-label":d,"aria-labelledby":h,action:u,centered:v=!1,children:x,className:w,component:C="div",allowScrollButtonsMobile:k=!1,indicatorColor:p="primary",onChange:m,orientation:y="horizontal",ScrollButtonComponent:P=no,scrollButtons:L="auto",selectionFollowsFocus:oe,slots:q={},slotProps:A={},TabIndicatorProps:_={},TabScrollButtonProps:N={},textColor:ee="primary",value:$,variant:E="standard",visibleScrollbar:te=!1}=l,de=ie(l,io),M=E==="scrollable",g=y==="vertical",K=g?"scrollTop":"scrollLeft",ue=g?"top":"left",fe=g?"bottom":"right",ke=g?"clientHeight":"clientWidth",ne=g?"height":"width",G=S({},l,{component:C,allowScrollButtonsMobile:k,indicatorColor:p,orientation:y,vertical:g,scrollButtons:L,textColor:ee,variant:E,visibleScrollbar:te,fixed:!M,hideScrollbar:M&&!te,scrollableX:M&&!g,scrollableY:M&&g,centered:v&&!M,scrollButtonsHideMobile:!k}),V=ao(G),Bt=xe({elementType:q.StartScrollButtonIcon,externalSlotProps:A.startScrollButtonIcon,ownerState:G}),Et=xe({elementType:q.EndScrollButtonIcon,externalSlotProps:A.endScrollButtonIcon,ownerState:G}),[We,It]=n.useState(!1),[Z,Ae]=n.useState(et),[_e,Lt]=n.useState(!1),[Ne,Ft]=n.useState(!1),[He,Mt]=n.useState(!1),[Oe,Tt]=n.useState({overflow:"hidden",scrollbarWidth:0}),De=new Map,H=n.useRef(null),J=n.useRef(null),qe=()=>{const s=H.current;let c;if(s){const f=s.getBoundingClientRect();c={clientWidth:s.clientWidth,scrollLeft:s.scrollLeft,scrollTop:s.scrollTop,scrollLeftNormalized:Wr(s,i.direction),scrollWidth:s.scrollWidth,top:f.top,bottom:f.bottom,left:f.left,right:f.right}}let b;if(s&&$!==!1){const f=J.current.children;if(f.length>0){const j=f[De.get($)];b=j?j.getBoundingClientRect():null}}return{tabsMeta:c,tabMeta:b}},le=Le(()=>{const{tabsMeta:s,tabMeta:c}=qe();let b=0,f;if(g)f="top",c&&s&&(b=c.top-s.top+s.scrollTop);else if(f=a?"right":"left",c&&s){const B=a?s.scrollLeftNormalized+s.clientWidth-s.scrollWidth:s.scrollLeft;b=(a?-1:1)*(c[f]-s[f]+B)}const j={[f]:b,[ne]:c?c[ne]:0};if(isNaN(Z[f])||isNaN(Z[ne]))Ae(j);else{const B=Math.abs(Z[f]-j[f]),W=Math.abs(Z[ne]-j[ne]);(B>=1||W>=1)&&Ae(j)}}),Be=(s,{animation:c=!0}={})=>{c?Vr(K,H.current,s,{duration:i.transitions.duration.standard}):H.current[K]=s},Ve=s=>{let c=H.current[K];g?c+=s:(c+=s*(a?-1:1),c*=a&&St()==="reverse"?-1:1),Be(c)},Ue=()=>{const s=H.current[ke];let c=0;const b=Array.from(J.current.children);for(let f=0;f<b.length;f+=1){const j=b[f];if(c+j[ke]>s){f===0&&(c=s);break}c+=j[ke]}return c},Rt=()=>{Ve(-1*Ue())},zt=()=>{Ve(Ue())},$t=n.useCallback(s=>{Tt({overflow:null,scrollbarWidth:s})},[]),Pt=()=>{const s={};s.scrollbarSizeListener=M?t.jsx(po,{onChange:$t,className:D(V.scrollableX,V.hideScrollbar)}):null;const b=M&&(L==="auto"&&(_e||Ne)||L===!0);return s.scrollButtonStart=b?t.jsx(P,S({slots:{StartScrollButtonIcon:q.StartScrollButtonIcon},slotProps:{startScrollButtonIcon:Bt},orientation:y,direction:a?"right":"left",onClick:Rt,disabled:!_e},N,{className:D(V.scrollButtons,N.className)})):null,s.scrollButtonEnd=b?t.jsx(P,S({slots:{EndScrollButtonIcon:q.EndScrollButtonIcon},slotProps:{endScrollButtonIcon:Et},orientation:y,direction:a?"left":"right",onClick:zt,disabled:!Ne},N,{className:D(V.scrollButtons,N.className)})):null,s},Xe=Le(s=>{const{tabsMeta:c,tabMeta:b}=qe();if(!(!b||!c)){if(b[ue]<c[ue]){const f=c[K]+(b[ue]-c[ue]);Be(f,{animation:s})}else if(b[fe]>c[fe]){const f=c[K]+(b[fe]-c[fe]);Be(f,{animation:s})}}}),he=Le(()=>{M&&L!==!1&&Mt(!He)});n.useEffect(()=>{const s=at(()=>{H.current&&le()});let c;const b=B=>{B.forEach(W=>{W.removedNodes.forEach(se=>{var U;(U=c)==null||U.unobserve(se)}),W.addedNodes.forEach(se=>{var U;(U=c)==null||U.observe(se)})}),s(),he()},f=ct(H.current);f.addEventListener("resize",s);let j;return typeof ResizeObserver<"u"&&(c=new ResizeObserver(s),Array.from(J.current.children).forEach(B=>{c.observe(B)})),typeof MutationObserver<"u"&&(j=new MutationObserver(b),j.observe(J.current,{childList:!0})),()=>{var B,W;s.clear(),f.removeEventListener("resize",s),(B=j)==null||B.disconnect(),(W=c)==null||W.disconnect()}},[le,he]),n.useEffect(()=>{const s=Array.from(J.current.children),c=s.length;if(typeof IntersectionObserver<"u"&&c>0&&M&&L!==!1){const b=s[0],f=s[c-1],j={root:H.current,threshold:.99},B=Ie=>{Lt(!Ie[0].isIntersecting)},W=new IntersectionObserver(B,j);W.observe(b);const se=Ie=>{Ft(!Ie[0].isIntersecting)},U=new IntersectionObserver(se,j);return U.observe(f),()=>{W.disconnect(),U.disconnect()}}},[M,L,He,x==null?void 0:x.length]),n.useEffect(()=>{It(!0)},[]),n.useEffect(()=>{le()}),n.useEffect(()=>{Xe(et!==Z)},[Xe,Z]),n.useImperativeHandle(u,()=>({updateIndicator:le,updateScrollButtons:he}),[le,he]);const Ye=t.jsx(ho,S({},_,{className:D(V.indicator,_.className),ownerState:G,style:S({},Z,_.style)}));let pe=0;const Wt=n.Children.map(x,s=>{if(!n.isValidElement(s))return null;const c=s.props.value===void 0?pe:s.props.value;De.set(c,pe);const b=c===$;return pe+=1,n.cloneElement(s,S({fullWidth:E==="fullWidth",indicator:b&&!We&&Ye,selected:b,selectionFollowsFocus:oe,onChange:m,textColor:ee,value:c},pe===1&&$===!1&&!s.props.tabIndex?{tabIndex:0}:{}))}),At=s=>{const c=J.current,b=Nt(c).activeElement;if(b.getAttribute("role")!=="tab")return;let j=y==="horizontal"?"ArrowLeft":"ArrowUp",B=y==="horizontal"?"ArrowRight":"ArrowDown";switch(y==="horizontal"&&a&&(j="ArrowRight",B="ArrowLeft"),s.key){case j:s.preventDefault(),be(c,b,Qe);break;case B:s.preventDefault(),be(c,b,Je);break;case"Home":s.preventDefault(),be(c,null,Je);break;case"End":s.preventDefault(),be(c,null,Qe);break}},Ee=Pt();return t.jsxs(co,S({className:D(V.root,w),ownerState:G,ref:o,as:C},de,{children:[Ee.scrollButtonStart,Ee.scrollbarSizeListener,t.jsxs(uo,{className:V.scroller,ownerState:G,style:{overflow:Oe.overflow,[g?`margin${a?"Left":"Right"}`:"marginBottom"]:te?void 0:-Oe.scrollbarWidth},ref:H,children:[t.jsx(fo,{"aria-label":d,"aria-labelledby":h,"aria-orientation":y==="vertical"?"vertical":null,className:V.flexContainer,ownerState:G,onKeyDown:At,ref:J,role:"tablist",children:Wt}),We&&Ye]}),Ee.scrollButtonEnd]}))}),xo=bo;function mo(e){return Se("MuiListItemAvatar",e)}ge("MuiListItemAvatar",["root","alignItemsFlexStart"]);const vo=["className"],go=e=>{const{alignItems:r,classes:o}=e;return je({root:["root",r==="flex-start"&&"alignItemsFlexStart"]},mo,o)},So=Y("div",{name:"MuiListItemAvatar",slot:"Root",overridesResolver:(e,r)=>{const{ownerState:o}=e;return[r.root,o.alignItems==="flex-start"&&r.alignItemsFlexStart]}})(({ownerState:e})=>S({minWidth:56,flexShrink:0},e.alignItems==="flex-start"&&{marginTop:8})),Co=n.forwardRef(function(r,o){const l=Ce({props:r,name:"MuiListItemAvatar"}),{className:i}=l,a=ie(l,vo),d=n.useContext(Ht),h=S({},l,{alignItems:d.alignItems}),u=go(h);return t.jsx(So,S({className:D(u.root,i),ownerState:h,ref:o},a))}),jo=Co;function yo({icon:e,active:r}){const o=ft(),l=n.useCallback(a=>()=>{o(a),window.scrollTo({top:0})},[o]),i=e?t.jsx(R,{color:"inherit",onClick:l("/info"),children:t.jsx(Ke,{})}):t.jsx(Ot,{color:"inherit",onClick:l("/info"),children:"Read more..."});return r?t.jsx(Ke,{color:"secondary"}):t.jsx(X.Fragment,{children:t.jsx(z,{title:"Information",arrow:!0,disableFocusListener:!0,children:i})})}function wo(){const e=n.useCallback(async()=>{const r=new URL(window.location.href);await navigator.clipboard.writeText(r.href),Dt("Link to belt requirements copied to clipboard.")},[]);return t.jsx(z,{title:"Copy Link to Requirements",arrow:!0,disableFocusListener:!0,children:t.jsx(R,{onClick:e,children:t.jsx(dr,{})})})}const ko={White:ur,Yellow:fr,Orange:hr,Green:pr,Blue:br,Purple:xr,Brown:mr,Red:vr,Black:gr};function Bo({belt:e}){const{expanded:r,setExpanded:o}=n.useContext(we),l=n.useCallback((d,h)=>{o(h?"beltreqs":!1),window.scrollTo({top:0,behavior:"smooth"})},[o]),i={maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0},a=ko[e];return a?t.jsxs(Sr,{expanded:r==="beltreqs",onChange:l,style:i,children:[t.jsxs(Cr,{expandIcon:t.jsx(ar,{}),children:[t.jsx(cr,{value:e}),t.jsxs(me,{variant:"h6",style:{margin:"0px 0px 0px 12px"},children:[e," Belt Requirements"]})]}),t.jsx(jr,{style:{margin:"0px 0px 0px 12px"},children:t.jsx(yr,{children:a})}),t.jsxs(wr,{children:[t.jsx(wo,{}),t.jsx(yo,{})]})]}):null}var Te={},Eo=ce;Object.defineProperty(Te,"__esModule",{value:!0});var Ct=Te.default=void 0,Io=Eo(ae()),Lo=t;Ct=Te.default=(0,Io.default)((0,Lo.jsx)("path",{d:"M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2m-9 3h2v2h-2zm0 3h2v2h-2zM8 8h2v2H8zm0 3h2v2H8zm-1 2H5v-2h2zm0-3H5V8h2zm9 7H8v-2h8zm0-4h-2v-2h2zm0-3h-2V8h2zm3 3h-2v-2h2zm0-3h-2V8h2z"}),"Keyboard");function Fo(){const[e,r]=n.useState(!1),o=n.useCallback(()=>r(!0),[]),l=n.useCallback(()=>r(!1),[]);return t.jsxs(X.Fragment,{children:[t.jsx(z,{title:"Hotkeys",arrow:!0,disableFocusListener:!0,children:t.jsx(R,{color:"inherit",onClick:o,children:t.jsx(Ct,{})})}),t.jsxs(vt,{open:e,onClose:l,TransitionComponent:xt,scroll:"body",children:[t.jsx(Me,{sx:{position:"relative"},children:t.jsxs(ht,{children:[t.jsx(R,{edge:"start",color:"inherit",onClick:l,"aria-label":"close",children:t.jsx(mt,{})}),t.jsx(me,{sx:{ml:2,flex:1},variant:"h6",component:"div",children:"Hotkey Info"})]})}),t.jsx(gt,{children:t.jsx(qt,{children:Mo.map(({key:i,text:a})=>t.jsx(X.Fragment,{children:t.jsxs(Mr,{children:[t.jsx(jo,{children:i}),t.jsx(Vt,{children:a})]})},i))})})]})]})}const Mo=[{key:"S",text:"Select (S)earch text box."},{key:"F",text:"Open/Close (F)ilter drawer."},{key:"1 - 9",text:"Select belt tab, 1=white, 2=yellow, etc."},{key:"R",text:"(R)andom Lock"}];var Re={},To=ce;Object.defineProperty(Re,"__esModule",{value:!0});var jt=Re.default=void 0,Ro=To(ae()),zo=t;jt=Re.default=(0,Ro.default)((0,zo.jsx)("path",{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2M7.5 18c-.83 0-1.5-.67-1.5-1.5S6.67 15 7.5 15s1.5.67 1.5 1.5S8.33 18 7.5 18m0-9C6.67 9 6 8.33 6 7.5S6.67 6 7.5 6 9 6.67 9 7.5 8.33 9 7.5 9m4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m4.5 4.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m0-9c-.83 0-1.5-.67-1.5-1.5S15.67 6 16.5 6s1.5.67 1.5 1.5S17.33 9 16.5 9"}),"Casino");function $o({onSelect:e}){const{visibleEntries:r}=n.useContext(ye),o=ft(),l=n.useCallback(()=>{const i=Math.floor(Math.random()*r.length),a=r[i];o(`/locks?id=${a.id}`),e(a.id)},[r,o,e]);return ve("r",()=>l(),{preventDefault:!0}),t.jsx(z,{title:"Random Lock",arrow:!0,disableFocusListener:!0,children:t.jsx(R,{onClick:l,children:t.jsx(jt,{})})})}var ze={},Po=ce;Object.defineProperty(ze,"__esModule",{value:!0});var yt=ze.default=void 0,Wo=Po(ae()),Ao=t;yt=ze.default=(0,Wo.default)((0,Ao.jsx)("path",{d:"M20 19.59V8l-6-6H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c.45 0 .85-.15 1.19-.4l-4.43-4.43c-.8.52-1.74.83-2.76.83-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5c0 1.02-.31 1.96-.83 2.75zM9 13c0 1.66 1.34 3 3 3s3-1.34 3-3-1.34-3-3-3-3 1.34-3 3"}),"FindInPage");var F={fullscreenEnabled:0,fullscreenElement:1,requestFullscreen:2,exitFullscreen:3,fullscreenchange:4,fullscreenerror:5,fullscreen:6},tt=["webkitFullscreenEnabled","webkitFullscreenElement","webkitRequestFullscreen","webkitExitFullscreen","webkitfullscreenchange","webkitfullscreenerror","-webkit-full-screen"],rt=["mozFullScreenEnabled","mozFullScreenElement","mozRequestFullScreen","mozCancelFullScreen","mozfullscreenchange","mozfullscreenerror","-moz-full-screen"],ot=["msFullscreenEnabled","msFullscreenElement","msRequestFullscreen","msExitFullscreen","MSFullscreenChange","MSFullscreenError","-ms-fullscreen"],I=typeof window<"u"&&typeof window.document<"u"?window.document:{},T="fullscreenEnabled"in I&&Object.keys(F)||tt[0]in I&&tt||rt[0]in I&&rt||ot[0]in I&&ot||[],_o={requestFullscreen:function(e){return e[T[F.requestFullscreen]]()},requestFullscreenFunction:function(e){return e[T[F.requestFullscreen]]},get exitFullscreen(){return I[T[F.exitFullscreen]].bind(I)},get fullscreenPseudoClass(){return":"+T[F.fullscreen]},addEventListener:function(e,r,o){return I.addEventListener(T[F[e]],r,o)},removeEventListener:function(e,r,o){return I.removeEventListener(T[F[e]],r,o)},get fullscreenEnabled(){return!!I[T[F.fullscreenEnabled]]},set fullscreenEnabled(e){},get fullscreenElement(){return I[T[F.fullscreenElement]]},set fullscreenElement(e){},get onfullscreenchange(){return I[("on"+T[F.fullscreenchange]).toLowerCase()]},set onfullscreenchange(e){return I[("on"+T[F.fullscreenchange]).toLowerCase()]=e},get onfullscreenerror(){return I[("on"+T[F.fullscreenerror]).toLowerCase()]},set onfullscreenerror(e){return I[("on"+T[F.fullscreenerror]).toLowerCase()]=e}};const O=_o;function No(){var e=n.useState(!1),r=e[0],o=e[1],l=n.useRef(null);n.useEffect(function(){var d=function(){o(O.fullscreenElement===l.current)};return O.addEventListener("fullscreenchange",d),function(){return O.removeEventListener("fullscreenchange",d)}},[]);var i=n.useCallback(function(){if(O.fullscreenElement)return O.exitFullscreen().then(function(){return O.requestFullscreen(l.current)});if(l.current)return O.requestFullscreen(l.current)},[]),a=n.useCallback(function(){return O.fullscreenElement===l.current?O.exitFullscreen():Promise.resolve()},[]);return n.useMemo(function(){return{active:r,enter:i,exit:a,node:l}},[r,i,a])}var Ho=function(r){var o=r.handle,l=r.onChange,i=r.children,a=r.className,d=[];return a&&d.push(a),d.push("fullscreen"),o.active&&d.push("fullscreen-enabled"),n.useEffect(function(){l&&l(o.active,o)},[o.active]),X.createElement("div",{className:d.join(" "),ref:o.node,style:o.active?{height:"100%",width:"100%"}:void 0},i)},$e={},Oo=ce;Object.defineProperty($e,"__esModule",{value:!0});var wt=$e.default=void 0,Do=Oo(ae()),qo=t;wt=$e.default=(0,Do.default)((0,qo.jsx)("path",{d:"M7 14H5v5h5v-2H7zm-2-4h2V7h3V5H5zm12 7h-3v2h5v-5h-2zM14 5v2h3v3h2V5z"}),"Fullscreen");function Vo({onClose:e}){const r=No(),{visibleEntries:o}=n.useContext(ye),l=n.useMemo(()=>o.filter(g=>g.media).flatMap(g=>g.media.map(K=>({entry:g,...K}))),[o]),[i,a]=n.useState(!1),[d,h]=n.useState(!0),[u,v]=n.useState(!0),[x,w]=n.useState(0),{setTab:C,setExpanded:k}=n.useContext(we),p=n.useCallback(()=>{const g=Math.floor(Math.random()*l.length);return l[g]},[l]),[m,y]=n.useState([p()]),{entry:P}=m[x],{fullSizeUrl:L,thumbnailUrl:oe,fullUrl:q,title:A,subtitle:_,subtitleUrl:N}=m[x],ee=n.useCallback(()=>{v(!1),a(!0)},[]),$=n.useCallback(()=>{h(!1),setTimeout(()=>e(),200)},[e]),E=n.useCallback(()=>{a(!1),setTimeout(()=>{const g=m.length>4?m.slice(1,5):[...m];g.push(p()),y(g),w(g.length-1)},1e3)},[m,p]),te=n.useCallback(()=>{x>0&&(w(x-1),v(!0))},[x]),de=n.useCallback(()=>{x===m.length-1?E():(w(x+1),v(!0))},[x,m,E]),M=n.useCallback(()=>{C(P.belt.replace(/\s\d/g,"")),k(P.id),$()},[P,$,k,C]);return ve("left",te,{preventDefault:!0}),ve("right",de,{preventDefault:!0}),n.useEffect(()=>{const g=setInterval(E,1e4);return()=>clearInterval(g)},[m,x,E]),t.jsxs(vt,{open:d,onClose:$,TransitionComponent:xt,fullScreen:!0,children:[t.jsx(Me,{sx:{position:"relative"},children:t.jsxs(ht,{children:[t.jsx(R,{edge:"start",color:"inherit",onClick:$,"aria-label":"close",children:t.jsx(mt,{})}),t.jsxs(Ut,{direction:"column",sx:{marginLeft:2,width:"100%"},children:[t.jsx(me,{variant:"subtitle1",component:"div",children:A}),t.jsx(me,{variant:"subtitle2",component:"div",style:{color:"#777"},children:t.jsx("a",{href:N||Er[_],target:"_blank",rel:"noopener noreferrer",children:_})})]}),t.jsx(z,{title:"View Full Size",arrow:!0,disableFocusListener:!0,children:t.jsx(R,{href:q,style:{color:"rgba(255, 255, 255, 0.5)"},target:"_blank",rel:"noopener noreferrer",children:t.jsx(Tr,{})})})]})}),u&&t.jsx(Rr,{color:"secondary"}),t.jsx(gt,{style:{padding:0,height:"100%",width:"100%"},children:t.jsx(Ho,{handle:r,children:t.jsx("div",{style:{display:"flex",flex:1,flexDirection:"column",alignItems:"center",justifyContent:"center",width:"100%",height:"100%",overflow:"hidden",backgroundColor:r.active?"black":null},children:t.jsx("img",{draggable:!1,style:{maxWidth:"100vw",maxHeight:r.active?"100vh":"calc(100vh - 128px)",backgroundSize:50,transformOrigin:"center center",...i?nt.visible:nt.hidden},onLoad:ee,title:A,src:L||oe,alt:A})})})}),t.jsxs(Fr,{sx:{maxHeight:64,display:"flex",flex:1,alignItems:"center",justifyContent:"center"},children:[t.jsx(z,{title:"Previous Image",arrow:!0,disableFocusListener:!0,children:t.jsx("span",{children:t.jsx(R,{color:"inherit",onClick:te,"aria-label":"previousImage",disabled:x===0,children:t.jsx(Ir,{})})})}),t.jsx(z,{title:"Go To Lock",arrow:!0,disableFocusListener:!0,children:t.jsx("span",{children:t.jsx(R,{color:"inherit",onClick:M,"aria-label":"goToLock",children:t.jsx(yt,{})})})}),t.jsx(z,{title:"Full Screen",arrow:!0,disableFocusListener:!0,children:t.jsx("span",{children:t.jsx(R,{color:"inherit",onClick:r.enter,"aria-label":"fullScreen",children:t.jsx(wt,{})})})}),t.jsx(z,{title:"Next Image",arrow:!0,disableFocusListener:!0,children:t.jsx(R,{color:"inherit",onClick:de,"aria-label":"nextImage",children:t.jsx(Lr,{})})})]})]})}const nt={visible:{visibility:"visible",opacity:1,transition:"opacity 1s linear"},hidden:{visibility:"hidden",opacity:0,transition:"visibility 0s 1s, opacity 1s linear"}};var Pe={},Uo=ce;Object.defineProperty(Pe,"__esModule",{value:!0});var kt=Pe.default=void 0,Xo=Uo(ae()),Yo=t;kt=Pe.default=(0,Xo.default)((0,Yo.jsx)("path",{d:"M10 8v8l5-4zm9-5H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m0 16H5V5h14z"}),"Slideshow");function Ko(){const[e,r]=n.useState(!1),o=n.useCallback(()=>r(!0),[]),l=n.useCallback(()=>r(!1),[]);return t.jsxs(X.Fragment,{children:[t.jsx(z,{title:"Slideshow",arrow:!0,disableFocusListener:!0,children:t.jsx(R,{color:"inherit",onClick:o,children:t.jsx(kt,{})})}),e&&t.jsx(Vo,{open:e,onClose:l})]})}function Go({profile:e}){const{tab:r,expanded:o}=n.useContext(we),{compact:l}=n.useContext(Xt),{visibleEntries:i=[]}=n.useContext(ye),{filterCount:a,isSearch:d}=n.useContext(bt),[h,u]=n.useState(o),v=n.useMemo(()=>r==="search"?i:i.filter(C=>C.simpleBelt===r),[r,i]),x=t.jsx("div",{style:{margin:"30px 0px"},children:t.jsx(sr,{text:!0})}),w=t.jsxs(X.Fragment,{children:[t.jsx("br",{}),t.jsx(Fo,{})," • ",t.jsx($o,{onSelect:u})," • ",t.jsx(Ko,{})]});return t.jsxs(X.Fragment,{children:[t.jsxs("div",{style:{margin:8,paddingBottom:32},children:[t.jsx(ir,{profile:e,collectionType:"locks"}),r!=="search"&&!d&&a===0&&v.length!==0&&t.jsx(Bo,{belt:r}),v.length===0&&t.jsx(kr,{label:"Locks",isSearch:d}),l?t.jsx(nr,{entries:v}):v.map(C=>t.jsx(lr,{entry:C,expanded:C.id===h,onExpand:u},C.id))]}),t.jsx(Yt,{extras:w,before:x})]})}const Zo=e=>t.jsx("div",{style:{position:"relative",minWidth:32,height:32},children:t.jsx("div",{style:{display:"inline-block",minWidth:32,height:32,position:"absolute",top:0,left:0,paddingTop:2},children:t.jsxs("svg",{id:"Layer_1",xmlns:"http://www.w3.org/2000/svg",version:"1.1",viewBox:"0 0 32 32",children:[t.jsx("rect",{fill:e.fill,x:"2",y:"6.2",width:"28",height:"19.1",rx:"2",ry:"2"}),t.jsxs("g",{children:[t.jsx("path",{fill:"#2A2A2A",d:"M8.4,17.4l-.6,2.2h-2l2.5-8.9h2.5l2.5,8.9h-2l-.6-2.2h-2.3ZM10.4,15.9l-.5-1.9c-.1-.5-.3-1.3-.4-1.8h0c-.1.5-.3,1.3-.4,1.8l-.5,1.9h1.8Z"}),t.jsx("path",{fill:"#2A2A2A",d:"M14.9,10.7h1.9v7.3h3.2v1.6h-5.1v-8.9Z"}),t.jsx("path",{fill:"#2A2A2A",d:"M21.7,10.7h1.9v7.3h3.2v1.6h-5.1v-8.9Z"})]})]})})});function Jo(){const{tab:e,setTab:r}=n.useContext(we),{addFilter:o,removeFilters:l}=n.useContext(bt),{visibleEntries:i=[]}=n.useContext(ye),a=i.reduce((p,m)=>{const y=m.belt.replace(/ \d/,"");return p[y]=p[y]?p[y]+1:1,p},{}),d=Math.floor(window.innerWidth/10),{width:h}=pt(),u=h<=500,v=u?"block":"flex",x=u?{minWidth:d,maxWidth:d,opacity:1}:{minWidth:50,maxWidth:50,opacity:1};ve("1,2,3,4,5,6,7,8,9",({key:p})=>{r(Ge[p-1])});const w=n.useCallback((p,m)=>r(m),[r]),C=n.useCallback(p=>()=>{e===p?o("tab",e,!0):l(["belt"])},[o,l,e]),k=e==="search"?"#eee":"#aaa";return t.jsx(Me,{position:"relative",style:{boxShadow:"none"},children:t.jsxs("div",{style:{display:v,justifyContent:"center"},children:[t.jsx("div",{children:t.jsxs(xo,{value:e,onChange:w,indicatorColor:"secondary",variant:u?"fullWidth":"standard",centered:!u,textColor:"inherit",children:[Ge.map(p=>t.jsx(lt,{value:p,children:m=>t.jsx(z,{title:`${p} Belt`,arrow:!0,disableFocusListener:!0,children:t.jsx(Ze,{...m,icon:t.jsx(zr,{value:p,style:{paddingTop:2,opacity:a[p]?1:.2}}),sx:x,onClick:C(p)})})},p)),t.jsx(lt,{value:"search",children:p=>t.jsx(z,{title:"All Matching Locks",arrow:!0,disableFocusListener:!0,children:t.jsx(Ze,{...p,icon:t.jsx(Zo,{fill:k}),sx:x})})})]})}),t.jsx("div",{style:{width:15,height:0}}),t.jsx(Br,{sortValues:$r,extraFilters:[{key:"tab",value:"search"}],compactMode:!0})]})})}function lt({children:e,...r}){return e(r)}function Kn(){const{isMobile:e}=pt(),{lockCollection:r}=n.useContext(Kt);tr("Locks");const o=t.jsxs(X.Fragment,{children:[t.jsx(Pr,{label:"Locks",extraFilters:[{key:"tab",value:"search"}],keepOpen:!0}),!e&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]});return t.jsx(Qt,{filterFields:er,children:t.jsx(or,{allEntries:Gt,profile:r,children:t.jsxs(rr,{children:[t.jsx(Zt,{title:"Locks",extras:o}),t.jsx(Jo,{}),t.jsx(Go,{profile:r}),t.jsx(Jt,{feature:"locks"})]})})})}export{Kn as default};
