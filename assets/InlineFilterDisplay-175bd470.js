import{a as k,g as M,s as b,_ as f,r as a,u as S,b as B,j as o,d as v,e as D,a_ as U,c as C,p as H,R as F,M as q,y as j,a9 as G,v as $,T as W,I as O,S as X,af as J,ag as T,a5 as Y,a7 as Z}from"./index-5981b98a.js";import{F as N,e as _}from"./BeltStripe-6753dd24.js";import{g as ee,I as te,l as oe}from"./ImageViewer-29785a15.js";import{C as z}from"./Search-1e6d9ef6.js";import{d as ie}from"./Link-b5f57d46.js";import{d as se}from"./ContentCopy-5b8d1b0e.js";import{d as ne}from"./Dialog-4bac2972.js";import{u as V}from"./useWindowSize-74c355bb.js";import{b as ae,f as re}from"./sortFields-f30d7ae4.js";import{F as le,I as ce,S as de}from"./Select-dbbf16ce.js";function me(e){return k("MuiAccordionActions",e)}M("MuiAccordionActions",["root","spacing"]);const ge=["className","disableSpacing"],ue=e=>{const{classes:t,disableSpacing:i}=e;return D({root:["root",!i&&"spacing"]},me,t)},Le=b("div",{name:"MuiAccordionActions",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:i}=e;return[t.root,!i.disableSpacing&&t.spacing]}})(({ownerState:e})=>f({display:"flex",alignItems:"center",padding:8,justifyContent:"flex-end"},!e.disableSpacing&&{"& > :not(style) ~ :not(style)":{marginLeft:8}})),pe=a.forwardRef(function(t,i){const n=S({props:t,name:"MuiAccordionActions"}),{className:c,disableSpacing:m=!1}=n,g=B(n,ge),l=f({},n,{disableSpacing:m}),s=ue(l);return o.jsx(Le,f({className:v(s.root,c),ref:i,ownerState:l},g))}),Ze=pe;function fe(e){return k("MuiImageList",e)}M("MuiImageList",["root","masonry","quilted","standard","woven"]);const ye=a.createContext({}),K=ye,he=["children","className","cols","component","rowHeight","gap","style","variant"],Ie=e=>{const{classes:t,variant:i}=e;return D({root:["root",i]},fe,t)},Ae=b("ul",{name:"MuiImageList",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:i}=e;return[t.root,t[i.variant]]}})(({ownerState:e})=>f({display:"grid",overflowY:"auto",listStyle:"none",padding:0,WebkitOverflowScrolling:"touch"},e.variant==="masonry"&&{display:"block"})),xe=a.forwardRef(function(t,i){const n=S({props:t,name:"MuiImageList"}),{children:c,className:m,cols:g=2,component:l="ul",rowHeight:s="auto",gap:L=4,style:y,variant:d="standard"}=n,p=B(n,he),r=a.useMemo(()=>({rowHeight:s,gap:L,variant:d}),[s,L,d]);a.useEffect(()=>{},[]);const h=d==="masonry"?f({columnCount:g,columnGap:L},y):f({gridTemplateColumns:`repeat(${g}, 1fr)`,gap:L},y),I=f({},n,{component:l,gap:L,rowHeight:s,variant:d}),u=Ie(I);return o.jsx(Ae,f({as:l,className:v(u.root,u[d],m),ref:i,style:h,ownerState:I},p,{children:o.jsx(K.Provider,{value:r,children:c})}))}),Ce=xe;function be(e){return k("MuiImageListItem",e)}const we=M("MuiImageListItem",["root","img","standard","woven","masonry","quilted"]),E=we,ve=["children","className","cols","component","rows","style"],je=e=>{const{classes:t,variant:i}=e;return D({root:["root",i],img:["img"]},be,t)},ke=b("li",{name:"MuiImageListItem",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:i}=e;return[{[`& .${E.img}`]:t.img},t.root,t[i.variant]]}})(({ownerState:e})=>f({display:"block",position:"relative"},e.variant==="standard"&&{display:"flex",flexDirection:"column"},e.variant==="woven"&&{height:"100%",alignSelf:"center","&:nth-of-type(even)":{height:"70%"}},{[`& .${E.img}`]:f({objectFit:"cover",width:"100%",height:"100%",display:"block"},e.variant==="standard"&&{height:"auto",flexGrow:1})})),Me=a.forwardRef(function(t,i){const n=S({props:t,name:"MuiImageListItem"}),{children:c,className:m,cols:g=1,component:l="li",rows:s=1,style:L}=n,y=B(n,ve),{rowHeight:d="auto",gap:p,variant:r}=a.useContext(K);let h="auto";r==="woven"?h=void 0:d!=="auto"&&(h=d*s+p*(s-1));const I=f({},n,{cols:g,component:l,gap:p,rowHeight:d,rows:s,variant:r}),u=je(I);return o.jsx(ke,f({as:l,className:v(u.root,u[r],m),ref:i,style:f({height:h,gridColumnEnd:r!=="masonry"?`span ${g}`:void 0,gridRowEnd:r!=="masonry"?`span ${s}`:void 0,marginBottom:r==="masonry"?p:void 0,breakInside:r==="masonry"?"avoid":void 0},L),ownerState:I},y,{children:a.Children.map(c,A=>a.isValidElement(A)?A.type==="img"||U(A,["Image"])?a.cloneElement(A,{className:v(u.img,A.props.className)}):A:null)}))}),Se=Me;function Be(e){return k("MuiImageListItemBar",e)}M("MuiImageListItemBar",["root","positionBottom","positionTop","positionBelow","titleWrap","titleWrapBottom","titleWrapTop","titleWrapBelow","titleWrapActionPosLeft","titleWrapActionPosRight","title","subtitle","actionIcon","actionIconActionPosLeft","actionIconActionPosRight"]);const De=["actionIcon","actionPosition","className","subtitle","title","position"],Re=e=>{const{classes:t,position:i,actionIcon:n,actionPosition:c}=e,m={root:["root",`position${C(i)}`],titleWrap:["titleWrap",`titleWrap${C(i)}`,n&&`titleWrapActionPos${C(c)}`],title:["title"],subtitle:["subtitle"],actionIcon:["actionIcon",`actionIconActionPos${C(c)}`]};return D(m,Be,t)},Pe=b("div",{name:"MuiImageListItemBar",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:i}=e;return[t.root,t[`position${C(i.position)}`]]}})(({theme:e,ownerState:t})=>f({position:"absolute",left:0,right:0,background:"rgba(0, 0, 0, 0.5)",display:"flex",alignItems:"center",fontFamily:e.typography.fontFamily},t.position==="bottom"&&{bottom:0},t.position==="top"&&{top:0},t.position==="below"&&{position:"relative",background:"transparent",alignItems:"normal"})),Te=b("div",{name:"MuiImageListItemBar",slot:"TitleWrap",overridesResolver:(e,t)=>{const{ownerState:i}=e;return[t.titleWrap,t[`titleWrap${C(i.position)}`],i.actionIcon&&t[`titleWrapActionPos${C(i.actionPosition)}`]]}})(({theme:e,ownerState:t})=>f({flexGrow:1,padding:"12px 16px",color:(e.vars||e).palette.common.white,overflow:"hidden"},t.position==="below"&&{padding:"6px 0 12px",color:"inherit"},t.actionIcon&&t.actionPosition==="left"&&{paddingLeft:0},t.actionIcon&&t.actionPosition==="right"&&{paddingRight:0})),Fe=b("div",{name:"MuiImageListItemBar",slot:"Title",overridesResolver:(e,t)=>t.title})(({theme:e})=>({fontSize:e.typography.pxToRem(16),lineHeight:"24px",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"})),We=b("div",{name:"MuiImageListItemBar",slot:"Subtitle",overridesResolver:(e,t)=>t.subtitle})(({theme:e})=>({fontSize:e.typography.pxToRem(12),lineHeight:1,textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"})),Oe=b("div",{name:"MuiImageListItemBar",slot:"ActionIcon",overridesResolver:(e,t)=>{const{ownerState:i}=e;return[t.actionIcon,t[`actionIconActionPos${C(i.actionPosition)}`]]}})(({ownerState:e})=>f({},e.actionPosition==="left"&&{order:-1})),Ne=a.forwardRef(function(t,i){const n=S({props:t,name:"MuiImageListItemBar"}),{actionIcon:c,actionPosition:m="right",className:g,subtitle:l,title:s,position:L="bottom"}=n,y=B(n,De),d=f({},n,{position:L,actionPosition:m}),p=Re(d);return o.jsxs(Pe,f({ownerState:d,className:v(p.root,g),ref:i},y,{children:[o.jsxs(Te,{ownerState:d,className:p.titleWrap,children:[o.jsx(Fe,{className:p.title,children:s}),l?o.jsx(We,{className:p.subtitle,children:l}):null]}),c?o.jsx(Oe,{ownerState:d,className:p.actionIcon,children:c}):null]}))}),Ee=Ne;function _e({field:e,value:t,label:i=t,...n}){const c=H(),[m,g]=a.useState(!1),{addFilter:l}=a.useContext(N),s=a.useCallback(r=>{r.preventDefault(),r.stopPropagation(),g(!1)},[]),L=a.useCallback(r=>{r.preventDefault(),r.stopPropagation(),g(!1),l(e,t),window.scrollTo({top:0,behavior:"smooth"})},[l,e,t]),y=a.useCallback(r=>{r.preventDefault(),r.stopPropagation(),g(r.target)},[]),d=a.useCallback(r=>{r.stopPropagation(),g(!1);const h=encodeURI(t);setTimeout(()=>c(`/glossary?term=${h}`),0)},[c,t]),p=a.useMemo(()=>!!ee.find(r=>r.term.toLowerCase()===t.toLowerCase()),[t]);return o.jsxs(F.Fragment,{children:[o.jsx(z,{clickable:!0,variant:"outlined",label:i,style:{marginRight:4,marginBottom:4},onClick:y,...n}),o.jsxs(q,{open:!!m,anchorEl:m,anchorOrigin:{horizontal:"right",vertical:"bottom"},onClose:s,children:[o.jsxs(j,{disabled:!0,children:["Term: ",t]}),o.jsx(G,{}),o.jsx(j,{onClick:L,children:"Add Filter"}),o.jsx(j,{onClick:d,disabled:!p,children:"Go to Glossary"})]})]})}function et({entry:e,nameType:t}){const i=a.useCallback(async()=>{const c=_(e,t).replace(/[\s/]/g,"_").replace(/\W/g,""),m=`${window.location.origin}/#/locks?id=${e.id}&name=${c}`;await navigator.clipboard.writeText(m),$("Link to entry copied to clipboard.")},[e,t]);return o.jsx(W,{title:"Copy Link to Entry",arrow:!0,disableFocusListener:!0,children:o.jsx(O,{onClick:i,children:o.jsx(ie,{})})})}function tt({entry:e}){const t=a.useCallback(async()=>{const i=e.makeModels.map(({make:n,model:c})=>n&&n!==c?`${n} ${c}`:c).join(`
`);await navigator.clipboard.writeText(i),$("Make/Model text copied to clipboard.")},[e.makeModels]);return o.jsx(W,{title:"Copy Make/Model Text",arrow:!0,disableFocusListener:!0,children:o.jsx(O,{onClick:t,children:o.jsx(se,{})})})}const Qe="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAACLlBMVEUAAAD/AAD/VVX/Pz/MMzPUKiraJCTfHx/iODjnLi7pKiraNjbdMzPfLy/hLS3iKirkKCjlMzPaMDDcLi7fKirgMzPhMTHjLS3dMzPeMTHfLy/hLS3iMTHfMTHhLy/iLi7eMDDfLy/fLi7gLS3hLS3dLy/eLi7fLS3fMTHgMDDgLy/hLi7hLS3eLS3fLy/fLy/gLi7hMDDfLS3fMDDgLy/hLi7hLS3fLy/fLy/hMDDfLi7gLy/gLi7hLi7eMDDfLy/hLy/fLi7fMDDgLy/gLy/gLi7gLi7fLy/fLy/fLi7hLy/fLi7fLy/gLy/gLi7gLi7gLi7fLy/fLi7gLi7gLy/gLy/fLi7fLi7fLi7gLy/gLi7gLi7fLy/fLi7fLi7gLi7gLy/gLi7fLi7fLi7fLy/gLy/gLi7gLi7gLi7fLy/fLy/fLi7fLi7gLy/gLy/fLi7fLy/fLy/gLy/gLi7gLi7fLy/fLi7gLy/fLi7fLi7fLy/fLy/gLi7gLi7gLi7gLy/fLi7gLi7gLy/gLi7fLi7fLi7fLy/fLy/gLy/gLi7gLi7gLy/fLy/fLy/fLi7gLi7gLy/gLy/gLy/fLi7fLy/fLy/fLy/gLi7gLi7gLi7fLy/fLi7fLi7fLi7gLy/gLy/fLi7fLi7fLy/gLi7gLi7gLi7fLy/fLy/fLi7gLy/gLy/gLy/gLi7fLi7fLi7fLy/fLy/////++Pj74+P2wcHwl5fpbm7kS0vhNjbgLy/Aen0RAAAAsXRSTlMAAQMEBQYHCAkLDA4PEBESExQVFhgZGhweHyAiJCkrLC8wMTIzNjc4OTo7PD0+QEFCRElKS01OUFFVWFtdXl9gZmlqa2xtbnBxcnd5e3x9fn+Ag4SGh4iJio2Oj5GTlJWXmJmanJ2en6ChoqOkpqiqq6ytrq+ztLi6u7y9vr/AwcTGyMnKy8zNzs/Q0dLT1dbX2Nna3N3e3+Dh4+Tl5ufo6+zu7/Dx8/T19/j5+vv8/f4b3nMYAAADa0lEQVR42u2b+1cMYRjHvymVKCX3FUK5pUSSdSuXsEmIIS1qiS5YWmGUSDVd6WbLXe2SJbTrPv+ds1OydarTzLw7zznOfH/bs2fO8zn7fWfe533mu4AuXbp06dKlS9eECowwxCakGNMPmY5wnMVyxXqT5+uEZrtXTx1evRUlOaUPPdIXTUIdz9usZZZCjss2HUw3bk5YboiYNvWqi1IyT5XY7gpdb1wiQ7ledwm8rZjbv2nBZNXjzveIftcT84oJysdXixrpwfpxyoeY3aJmcpunj60/r0XUVLVRo+vPfSxqrPb5vvXD2kTN1RziA1AmEqjwX/0NIolWjwDU0ADwxD+AKK4cBiilAjg/VH+GiwrAGSQBpIlkSpYALtIBmCWALjqARm/9KDcdwJeZALaKIu0iyKUEyAJQTglQBqCeEqAawHNKgA4gYIASwAlEyrzk+y+mBKFYKvMKz9cfvxkCLMZGuQAez7ef7ADiYZQP4PGw8yEVe5UAsPNhNw4rAmDmwwGcVgjAyIdjuKAYgIkP+bAqB2DhwyXcUQOg3gcbatUBqPWhCq0qAVT6UIMO1QCqfBDQzQBAhQ+P8JIFgHIfOtHLBkCpDz14xwpAmQ+v8IEZgCIf+jDIEECBD/0QmQLI9sHFGkCuD34AkOeDXwDk+OAfABk+/KcA1BYQL0Li21D+g4j8UUy+GZFvx+QNyQvqloy4KW2lb8tbVAOoPJg8pD2aVeI27eG0HNdoj+dFKKQdUOSBox3R5CCLdkiViQzaMd1O+kFlonwAlqPaOMTIBWA7rF6ICJlXsB3Xu4MhuyViKgeAZ5QAbYDsQSFTVQG4QQlQCuA4JYAJwBZKgCQAkYQvrz+HeV+ft9MB1Ev5AQsdwBkJgHARJEoAof1U9XsDh2I0RVQA+cM5ojVUAMv+Rqnu0dSvGMmSrSOp7/bJlpLciXk+ecLQZu3r146Klc7WfFNuGBMqDec1bgRmjY3VBux7r+EmlDNe2Dv6pFOj5W+LmSBbHZxaUPfRz9UHm3KXTJpuD4o1ZhffqunsY9kmfOqzN96vuFpwdFdC+NSD9mHRhti1yWnbdqRnmEwnuLOWy9brPM9XCoLQYLfbux0Oh+TZgJTul8L9rYJQ7033l1jOcZzJtCd9e2rSKsOcEP2/Erp06dKlS5euSfQHCEWsD45POXkAAAAASUVORK5CYII=";function ot(e){const{columns:t,media:i,initiallyOpen:n,openIndex:c,onOpenImage:m,onCloseImage:g,onBackButton:l,shareParams:s}=e,{isMobile:L}=V(),[y,d]=a.useState(n),p=a.useCallback(u=>()=>window.open(u,"_blank","noopener,noreferrer"),[]),r=a.useCallback(u=>()=>{m(u),d(!0)},[m]),h=a.useCallback(()=>{g(),d(!1)},[g]);a.useEffect(()=>{const u=()=>{if(l){const A=l();return d(A)}return d(!1)};return addEventListener("hashchange",u),()=>removeEventListener("hashchange",u)});const I=t??(L?2:3);return o.jsxs(F.Fragment,{children:[y&&o.jsx(te,{media:i,openIndex:c,onOpenImage:m,onClose:h,shareParams:s}),o.jsx(Ce,{variant:"masonry",cols:I,sx:{marginTop:2},children:i.map(({title:u,subtitle:A,thumbnailUrl:R,fullUrl:x,subtitleUrl:P},w)=>o.jsxs(Se,{style:{marginBottom:8},children:[o.jsx("img",{src:R,alt:u,style:{paddingBottom:A?60:48,cursor:"pointer"},onClick:r(w)}),(x==null?void 0:x.match(/youtube\.com/))&&o.jsx("img",{src:Qe,alt:u,style:{alignItems:"center",position:"absolute",top:"calc(50% - 65px)",left:"calc(50% - 40px)",width:80,height:80,cursor:"pointer"},onClick:p(x)}),o.jsx(Ee,{title:u,subtitle:A&&o.jsx("a",{href:P||oe[A],target:"_blank",rel:"noopener noreferrer",children:A}),actionIcon:x&&o.jsx(W,{title:"View Full Size",arrow:!0,disableFocusListener:!0,children:o.jsx(O,{href:x,style:{color:"rgba(255, 255, 255, 0.5)"},target:"_blank",rel:"noopener noreferrer",children:o.jsx(ne,{})})})})]},w))})]})}const Q={safelocksOwn:"Own",safelockCracked:"Cracked",safelockWishlist:"Wishlist"};function $e(){const{filters:e,filterCount:t,removeFilter:i,filterFieldsByFieldName:n}=a.useContext(N),c=a.useCallback((l,s)=>()=>{i(l,s)},[i]),m=a.useMemo(()=>{const{search:l,id:s,tab:L,name:y,sort:d,image:p,...r}=e;return Object.keys(r).map(h=>{const I=e[h];return Array.isArray(I)?I.map(u=>({key:h,value:u})):{key:h,value:I}}).flat()},[e]),g=a.useCallback((l,s)=>l==="Belt"?s==="Unranked"?l:s.includes("Black")?s.replace(/(Black)\s(\d+)/,"$1 Belt $2"):s+" Belt":l==="UL Group"?"Group "+s:l==="Wheels"?`${s} Wheels`:Q[s]?Q[s]:s,[]);return t===0?null:o.jsx(ae,{name:"Current Filters",style:{marginBottom:0},value:o.jsx(X,{direction:"row",spacing:0,sx:{flexWrap:"wrap"},style:{marginRight:-24},children:m.map(({key:l,value:s},L)=>{var y;return o.jsx(z,{label:`${g((y=n[l])==null?void 0:y.label,s)}`,variant:"outlined",style:{marginRight:4,marginBottom:4},onDelete:c(l,s)},L)})})})}function it({profile:e={},collectionType:t}){const{userId:i}=J(),{filters:n,filterCount:c,addFilter:m}=a.useContext(N),[g,l]=F.useState(!1),s=T[t].labels,L=T[t].keyByLabel,y=T[t].getCollected(e)||[],{isMobile:d}=V(),p=d?{maxWidth:700,borderRadius:0}:{maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0},{collection:r=i&&c===0?"Any":null}=n,h=s.includes(r)&&c<2;let I="";r&&(typeof r=="string"?I=r:I="Any");const u=a.useCallback(()=>l(!1),[]),A=a.useCallback(()=>l(!0),[]),R=a.useCallback(x=>{m("collection",x.target.value,!0)},[m]);return!c&&!i?null:o.jsx(Y,{style:p,sx:{paddingBottom:0,paddingTop:2},children:o.jsxs(Z,{style:{paddingTop:0,paddingLeft:8},children:[h&&o.jsxs("div",{style:{display:"flex"},children:[o.jsxs(le,{fullWidth:!0,size:"small",color:"secondary",sx:{marginLeft:"8px",minWidth:80,maxWidth:300},children:[o.jsx(ce,{id:"label",children:"Collection"}),o.jsx(de,{name:"collection-selector",label:"Collection",open:g,onClose:u,onOpen:A,value:I,onChange:R,style:{backgroundColor:"#222",fontSize:"1.1rem",fontWeight:500},color:"secondary",children:s.map((x,P)=>{var w;return o.jsxs(j,{value:x,children:[x," (",x==="Any"?y.length:((w=e[L[x]])==null?void 0:w.length)||0,")"]},P)})})]}),o.jsx("div",{style:{flexGrow:1,marginTop:2,marginLeft:15},children:o.jsx(re,{})})]}),!h&&o.jsx($e,{})]})})}export{Ze as A,tt as C,_e as F,it as I,ot as a,et as b};
