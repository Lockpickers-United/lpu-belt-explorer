import{ac as vt,r as y,ad as tt,K as Ve,ae as Lt,_ as f,l as xt,m as It,s as M,z as Be,n as Ot,o as We,j as h,q as ge,t as yt,G as At,I as Pt,af as Ct,ag as $t,a7 as ot,ah as kt}from"./index-69a25a31.js";import{i as nt,a as ne,o as ft,f as fe,A as Rt}from"./InputLabel-f2b81431.js";import{u as Tt,C as wt}from"./Chip-f6251cc8.js";function gt(o){return typeof o.normalize<"u"?o.normalize("NFD").replace(/[\u0300-\u036f]/g,""):o}function Dt(o={}){const{ignoreAccents:r=!0,ignoreCase:i=!0,limit:m,matchFrom:L="any",stringify:$,trim:P=!1}=o;return(g,{inputValue:_,getOptionLabel:H})=>{let A=P?_.trim():_;i&&(A=A.toLowerCase()),r&&(A=gt(A));const j=A?g.filter(Y=>{let D=($||H)(Y);return i&&(D=D.toLowerCase()),r&&(D=gt(D)),L==="start"?D.indexOf(A)===0:D.indexOf(A)>-1}):g;return typeof m=="number"?j.slice(0,m):j}}function rt(o,r){for(let i=0;i<o.length;i+=1)if(r(o[i]))return i;return-1}const Nt=Dt(),bt=5,Mt=o=>{var r;return o.current!==null&&((r=o.current.parentElement)==null?void 0:r.contains(document.activeElement))};function Et(o){const{unstable_isActiveElementInListbox:r=Mt,unstable_classNamePrefix:i="Mui",autoComplete:m=!1,autoHighlight:L=!1,autoSelect:$=!1,blurOnSelect:P=!1,clearOnBlur:g=!o.freeSolo,clearOnEscape:_=!1,componentName:H="useAutocomplete",defaultValue:A=o.multiple?[]:null,disableClearable:j=!1,disableCloseOnSelect:Y=!1,disabled:D,disabledItemsFocusable:_e=!1,disableListWrap:Ge=!1,filterOptions:at=Nt,filterSelectedOptions:be=!1,freeSolo:J=!1,getOptionDisabled:G,getOptionKey:Ue,getOptionLabel:Se=t=>{var e;return(e=t.label)!=null?e:t},groupBy:he,handleHomeEndKeys:Q=!o.freeSolo,id:lt,includeInputInList:Ke=!1,inputValue:ve,isOptionEqualToValue:re=(t,e)=>t===e,multiple:c=!1,onChange:me,onClose:Le,onHighlightChange:Ae,onInputChange:U,onOpen:ke,open:st,openOnFocus:it=!1,options:xe,readOnly:Z=!1,selectOnFocus:Ie=!o.freeSolo,value:Re}=o,T=vt(lt);let S=Se;S=t=>{const e=Se(t);return typeof e!="string"?String(e):e};const Oe=y.useRef(!1),Te=y.useRef(!0),x=y.useRef(null),w=y.useRef(null),[ae,qe]=y.useState(null),[k,ye]=y.useState(-1),we=L?0:-1,v=y.useRef(we),[l,pt]=tt({controlled:Re,default:A,name:H}),[u,K]=tt({controlled:ve,default:"",name:H,state:"inputValue"}),[le,De]=y.useState(!1),ee=y.useCallback((t,e)=>{if(!(c?l.length<e.length:e!==null)&&!g)return;let a;if(c)a="";else if(e==null)a="";else{const p=S(e);a=typeof p=="string"?p:""}u!==a&&(K(a),U&&U(t,a,"reset"))},[S,u,c,U,K,g,l]),[X,Ne]=tt({controlled:st,default:!1,name:H,state:"open"}),[Je,Me]=y.useState(!0),Ee=!c&&l!=null&&u===S(l),R=X&&!Z,d=R?at(xe.filter(t=>!(be&&(c?l:[l]).some(e=>e!==null&&re(t,e)))),{inputValue:Ee&&Je?"":u,getOptionLabel:S}):[],E=Tt({filteredOptions:d,value:l,inputValue:u});y.useEffect(()=>{const t=l!==E.value;le&&!t||J&&!t||ee(null,l)},[l,ee,le,E.value,J]);const Pe=X&&d.length>0&&!Z,se=Ve(t=>{t===-1?x.current.focus():ae.querySelector(`[data-tag-index="${t}"]`).focus()});y.useEffect(()=>{c&&k>l.length-1&&(ye(-1),se(-1))},[l,c,k,se]);function ie(t,e){if(!w.current||t<0||t>=d.length)return-1;let n=t;for(;;){const a=w.current.querySelector(`[data-option-index="${n}"]`),p=_e?!1:!a||a.disabled||a.getAttribute("aria-disabled")==="true";if(a&&a.hasAttribute("tabindex")&&!p)return n;if(e==="next"?n=(n+1)%d.length:n=(n-1+d.length)%d.length,n===t)return-1}}const V=Ve(({event:t,index:e,reason:n="auto"})=>{if(v.current=e,e===-1?x.current.removeAttribute("aria-activedescendant"):x.current.setAttribute("aria-activedescendant",`${T}-option-${e}`),Ae&&Ae(t,e===-1?null:d[e],n),!w.current)return;const a=w.current.querySelector(`[role="option"].${i}-focused`);a&&(a.classList.remove(`${i}-focused`),a.classList.remove(`${i}-focusVisible`));let p=w.current;if(w.current.getAttribute("role")!=="listbox"&&(p=w.current.parentElement.querySelector('[role="listbox"]')),!p)return;if(e===-1){p.scrollTop=0;return}const b=w.current.querySelector(`[data-option-index="${e}"]`);if(b&&(b.classList.add(`${i}-focused`),n==="keyboard"&&b.classList.add(`${i}-focusVisible`),p.scrollHeight>p.clientHeight&&n!=="mouse"&&n!=="touch")){const I=b,B=p.clientHeight+p.scrollTop,dt=I.offsetTop+I.offsetHeight;dt>B?p.scrollTop=dt-p.clientHeight:I.offsetTop-I.offsetHeight*(he?1.3:0)<p.scrollTop&&(p.scrollTop=I.offsetTop-I.offsetHeight*(he?1.3:0))}}),F=Ve(({event:t,diff:e,direction:n="next",reason:a="auto"})=>{if(!R)return;const b=ie((()=>{const I=d.length-1;if(e==="reset")return we;if(e==="start")return 0;if(e==="end")return I;const B=v.current+e;return B<0?B===-1&&Ke?-1:Ge&&v.current!==-1||Math.abs(e)>1?0:I:B>I?B===I+1&&Ke?-1:Ge||Math.abs(e)>1?I:0:B})(),n);if(V({index:b,reason:a,event:t}),m&&e!=="reset")if(b===-1)x.current.value=u;else{const I=S(d[b]);x.current.value=I,I.toLowerCase().indexOf(u.toLowerCase())===0&&u.length>0&&x.current.setSelectionRange(u.length,I.length)}}),pe=()=>{const t=(e,n)=>{const a=e?S(e):"",p=n?S(n):"";return a===p};if(v.current!==-1&&E.filteredOptions&&E.filteredOptions.length!==d.length&&E.inputValue===u&&(c?l.length===E.value.length&&E.value.every((e,n)=>S(l[n])===S(e)):t(E.value,l))){const e=E.filteredOptions[v.current];if(e&&d.some(a=>S(a)===S(e)))return!0}return!1},Ce=y.useCallback(()=>{if(!R||pe())return;const t=c?l[0]:l;if(d.length===0||t==null){F({diff:"reset"});return}if(w.current){if(t!=null){const e=d[v.current];if(c&&e&&rt(l,a=>re(e,a))!==-1)return;const n=rt(d,a=>re(a,t));n===-1?F({diff:"reset"}):V({index:n});return}if(v.current>=d.length-1){V({index:d.length-1});return}V({index:v.current})}},[d.length,c?!1:l,be,F,V,R,u,c]),Qe=Ve(t=>{Lt(w,t),t&&Ce()});y.useEffect(()=>{Ce()},[Ce]);const N=t=>{X||(Ne(!0),Me(!0),ke&&ke(t))},q=(t,e)=>{X&&(Ne(!1),Le&&Le(t,e))},W=(t,e,n,a)=>{if(c){if(l.length===e.length&&l.every((p,b)=>p===e[b]))return}else if(l===e)return;me&&me(t,e,n,a),pt(e)},ue=y.useRef(!1),te=(t,e,n="selectOption",a="options")=>{let p=n,b=e;if(c){b=Array.isArray(l)?l.slice():[];const I=rt(b,B=>re(e,B));I===-1?b.push(e):a!=="freeSolo"&&(b.splice(I,1),p="removeOption")}ee(t,b),W(t,b,p,{option:e}),!Y&&(!t||!t.ctrlKey&&!t.metaKey)&&q(t,p),(P===!0||P==="touch"&&ue.current||P==="mouse"&&!ue.current)&&x.current.blur()};function Fe(t,e){if(t===-1)return-1;let n=t;for(;;){if(e==="next"&&n===l.length||e==="previous"&&n===-1)return-1;const a=ae.querySelector(`[data-tag-index="${n}"]`);if(!a||!a.hasAttribute("tabindex")||a.disabled||a.getAttribute("aria-disabled")==="true")n+=e==="next"?1:-1;else return n}}const ze=(t,e)=>{if(!c)return;u===""&&q(t,"toggleInput");let n=k;k===-1?u===""&&e==="previous"&&(n=l.length-1):(n+=e==="next"?1:-1,n<0&&(n=0),n===l.length&&(n=-1)),n=Fe(n,e),ye(n),se(n)},He=t=>{Oe.current=!0,K(""),U&&U(t,"","clear"),W(t,c?[]:null,"clear")},Xe=t=>e=>{if(t.onKeyDown&&t.onKeyDown(e),!e.defaultMuiPrevented&&(k!==-1&&["ArrowLeft","ArrowRight"].indexOf(e.key)===-1&&(ye(-1),se(-1)),e.which!==229))switch(e.key){case"Home":R&&Q&&(e.preventDefault(),F({diff:"start",direction:"next",reason:"keyboard",event:e}));break;case"End":R&&Q&&(e.preventDefault(),F({diff:"end",direction:"previous",reason:"keyboard",event:e}));break;case"PageUp":e.preventDefault(),F({diff:-bt,direction:"previous",reason:"keyboard",event:e}),N(e);break;case"PageDown":e.preventDefault(),F({diff:bt,direction:"next",reason:"keyboard",event:e}),N(e);break;case"ArrowDown":e.preventDefault(),F({diff:1,direction:"next",reason:"keyboard",event:e}),N(e);break;case"ArrowUp":e.preventDefault(),F({diff:-1,direction:"previous",reason:"keyboard",event:e}),N(e);break;case"ArrowLeft":ze(e,"previous");break;case"ArrowRight":ze(e,"next");break;case"Enter":if(v.current!==-1&&R){const n=d[v.current],a=G?G(n):!1;if(e.preventDefault(),a)return;te(e,n,"selectOption"),m&&x.current.setSelectionRange(x.current.value.length,x.current.value.length)}else J&&u!==""&&Ee===!1&&(c&&e.preventDefault(),te(e,u,"createOption","freeSolo"));break;case"Escape":R?(e.preventDefault(),e.stopPropagation(),q(e,"escape")):_&&(u!==""||c&&l.length>0)&&(e.preventDefault(),e.stopPropagation(),He(e));break;case"Backspace":if(c&&!Z&&u===""&&l.length>0){const n=k===-1?l.length-1:k,a=l.slice();a.splice(n,1),W(e,a,"removeOption",{option:l[n]})}break;case"Delete":if(c&&!Z&&u===""&&l.length>0&&k!==-1){const n=k,a=l.slice();a.splice(n,1),W(e,a,"removeOption",{option:l[n]})}break}},ut=t=>{De(!0),it&&!Oe.current&&N(t)},ce=t=>{if(r(w)){x.current.focus();return}De(!1),Te.current=!0,Oe.current=!1,$&&v.current!==-1&&R?te(t,d[v.current],"blur"):$&&J&&u!==""?te(t,u,"blur","freeSolo"):g&&ee(t,l),q(t,"blur")},C=t=>{const e=t.target.value;u!==e&&(K(e),Me(!1),U&&U(t,e,"input")),e===""?!j&&!c&&W(t,null,"clear"):N(t)},O=t=>{const e=Number(t.currentTarget.getAttribute("data-option-index"));v.current!==e&&V({event:t,index:e,reason:"mouse"})},z=t=>{V({event:t,index:Number(t.currentTarget.getAttribute("data-option-index")),reason:"touch"}),ue.current=!0},ct=t=>{const e=Number(t.currentTarget.getAttribute("data-option-index"));te(t,d[e],"selectOption"),ue.current=!1},Ye=t=>e=>{const n=l.slice();n.splice(t,1),W(e,n,"removeOption",{option:l[t]})},Ze=t=>{X?q(t,"toggleInput"):N(t)},et=t=>{t.currentTarget.contains(t.target)&&t.target.getAttribute("id")!==T&&t.preventDefault()},je=t=>{t.currentTarget.contains(t.target)&&(x.current.focus(),Ie&&Te.current&&x.current.selectionEnd-x.current.selectionStart===0&&x.current.select(),Te.current=!1)},$e=t=>{!D&&(u===""||!X)&&Ze(t)};let oe=J&&u.length>0;oe=oe||(c?l.length>0:l!==null);let de=d;return he&&(de=d.reduce((t,e,n)=>{const a=he(e);return t.length>0&&t[t.length-1].group===a?t[t.length-1].options.push(e):t.push({key:n,index:n,group:a,options:[e]}),t},[])),D&&le&&ce(),{getRootProps:(t={})=>f({"aria-owns":Pe?`${T}-listbox`:null},t,{onKeyDown:Xe(t),onMouseDown:et,onClick:je}),getInputLabelProps:()=>({id:`${T}-label`,htmlFor:T}),getInputProps:()=>({id:T,value:u,onBlur:ce,onFocus:ut,onChange:C,onMouseDown:$e,"aria-activedescendant":R?"":null,"aria-autocomplete":m?"both":"list","aria-controls":Pe?`${T}-listbox`:void 0,"aria-expanded":Pe,autoComplete:"off",ref:x,autoCapitalize:"none",spellCheck:"false",role:"combobox",disabled:D}),getClearProps:()=>({tabIndex:-1,type:"button",onClick:He}),getPopupIndicatorProps:()=>({tabIndex:-1,type:"button",onClick:Ze}),getTagProps:({index:t})=>f({key:t,"data-tag-index":t,tabIndex:-1},!Z&&{onDelete:Ye(t)}),getListboxProps:()=>({role:"listbox",id:`${T}-listbox`,"aria-labelledby":`${T}-label`,ref:Qe,onMouseDown:t=>{t.preventDefault()}}),getOptionProps:({index:t,option:e})=>{var n;const a=(c?l:[l]).some(b=>b!=null&&re(e,b)),p=G?G(e):!1;return{key:(n=Ue==null?void 0:Ue(e))!=null?n:S(e),tabIndex:-1,role:"option",id:`${T}-option-${t}`,onMouseMove:O,onClick:ct,onTouchStart:z,"data-option-index":t,"aria-disabled":p,"aria-selected":a}},id:T,inputValue:u,value:l,dirty:oe,expanded:R&&ae,popupOpen:R,focused:le||k!==-1,anchorEl:ae,setAnchorEl:qe,focusedTag:k,groupedOptions:de}}function Ft(o){return xt("MuiListSubheader",o)}It("MuiListSubheader",["root","colorPrimary","colorInherit","gutters","inset","sticky"]);const zt=["className","color","component","disableGutters","disableSticky","inset"],Ht=o=>{const{classes:r,color:i,disableGutters:m,inset:L,disableSticky:$}=o,P={root:["root",i!=="default"&&`color${Be(i)}`,!m&&"gutters",L&&"inset",!$&&"sticky"]};return yt(P,Ft,r)},jt=M("li",{name:"MuiListSubheader",slot:"Root",overridesResolver:(o,r)=>{const{ownerState:i}=o;return[r.root,i.color!=="default"&&r[`color${Be(i.color)}`],!i.disableGutters&&r.gutters,i.inset&&r.inset,!i.disableSticky&&r.sticky]}})(({theme:o,ownerState:r})=>f({boxSizing:"border-box",lineHeight:"48px",listStyle:"none",color:(o.vars||o).palette.text.secondary,fontFamily:o.typography.fontFamily,fontWeight:o.typography.fontWeightMedium,fontSize:o.typography.pxToRem(14)},r.color==="primary"&&{color:(o.vars||o).palette.primary.main},r.color==="inherit"&&{color:"inherit"},!r.disableGutters&&{paddingLeft:16,paddingRight:16},r.inset&&{paddingLeft:72},!r.disableSticky&&{position:"sticky",top:0,zIndex:1,backgroundColor:(o.vars||o).palette.background.paper})),St=y.forwardRef(function(r,i){const m=Ot({props:r,name:"MuiListSubheader"}),{className:L,color:$="default",component:P="li",disableGutters:g=!1,disableSticky:_=!1,inset:H=!1}=m,A=We(m,zt),j=f({},m,{color:$,component:P,disableGutters:g,disableSticky:_,inset:H}),Y=Ht(j);return h.jsx(jt,f({as:P,className:ge(Y.root,L),ref:i,ownerState:j},A))});St.muiSkipListHighlight=!0;const Vt=St,Wt=At(h.jsx("path",{d:"M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"}),"Close");function Bt(o){return xt("MuiAutocomplete",o)}const _t=It("MuiAutocomplete",["root","expanded","fullWidth","focused","focusVisible","tag","tagSizeSmall","tagSizeMedium","hasPopupIcon","hasClearIcon","inputRoot","input","inputFocused","endAdornment","clearIndicator","popupIndicator","popupIndicatorOpen","popper","popperDisablePortal","paper","listbox","loading","noOptions","option","groupLabel","groupUl"]),s=_t;var ht,mt;const Gt=["autoComplete","autoHighlight","autoSelect","blurOnSelect","ChipProps","className","clearIcon","clearOnBlur","clearOnEscape","clearText","closeText","componentsProps","defaultValue","disableClearable","disableCloseOnSelect","disabled","disabledItemsFocusable","disableListWrap","disablePortal","filterOptions","filterSelectedOptions","forcePopupIcon","freeSolo","fullWidth","getLimitTagsText","getOptionDisabled","getOptionKey","getOptionLabel","isOptionEqualToValue","groupBy","handleHomeEndKeys","id","includeInputInList","inputValue","limitTags","ListboxComponent","ListboxProps","loading","loadingText","multiple","noOptionsText","onChange","onClose","onHighlightChange","onInputChange","onOpen","open","openOnFocus","openText","options","PaperComponent","PopperComponent","popupIcon","readOnly","renderGroup","renderInput","renderOption","renderTags","selectOnFocus","size","slotProps","value"],Ut=["ref"],Kt=["key"],qt=o=>{const{classes:r,disablePortal:i,expanded:m,focused:L,fullWidth:$,hasClearIcon:P,hasPopupIcon:g,inputFocused:_,popupOpen:H,size:A}=o,j={root:["root",m&&"expanded",L&&"focused",$&&"fullWidth",P&&"hasClearIcon",g&&"hasPopupIcon"],inputRoot:["inputRoot"],input:["input",_&&"inputFocused"],tag:["tag",`tagSize${Be(A)}`],endAdornment:["endAdornment"],clearIndicator:["clearIndicator"],popupIndicator:["popupIndicator",H&&"popupIndicatorOpen"],popper:["popper",i&&"popperDisablePortal"],paper:["paper"],listbox:["listbox"],loading:["loading"],noOptions:["noOptions"],option:["option"],groupLabel:["groupLabel"],groupUl:["groupUl"]};return yt(j,Bt,r)},Jt=M("div",{name:"MuiAutocomplete",slot:"Root",overridesResolver:(o,r)=>{const{ownerState:i}=o,{fullWidth:m,hasClearIcon:L,hasPopupIcon:$,inputFocused:P,size:g}=i;return[{[`& .${s.tag}`]:r.tag},{[`& .${s.tag}`]:r[`tagSize${Be(g)}`]},{[`& .${s.inputRoot}`]:r.inputRoot},{[`& .${s.input}`]:r.input},{[`& .${s.input}`]:P&&r.inputFocused},r.root,m&&r.fullWidth,$&&r.hasPopupIcon,L&&r.hasClearIcon]}})(({ownerState:o})=>f({[`&.${s.focused} .${s.clearIndicator}`]:{visibility:"visible"},"@media (pointer: fine)":{[`&:hover .${s.clearIndicator}`]:{visibility:"visible"}}},o.fullWidth&&{width:"100%"},{[`& .${s.tag}`]:f({margin:3,maxWidth:"calc(100% - 6px)"},o.size==="small"&&{margin:2,maxWidth:"calc(100% - 4px)"}),[`& .${s.inputRoot}`]:{flexWrap:"wrap",[`.${s.hasPopupIcon}&, .${s.hasClearIcon}&`]:{paddingRight:26+4},[`.${s.hasPopupIcon}.${s.hasClearIcon}&`]:{paddingRight:52+4},[`& .${s.input}`]:{width:0,minWidth:30}},[`& .${nt.root}`]:{paddingBottom:1,"& .MuiInput-input":{padding:"4px 4px 4px 0px"}},[`& .${nt.root}.${ne.sizeSmall}`]:{[`& .${nt.input}`]:{padding:"2px 4px 3px 0"}},[`& .${ft.root}`]:{padding:9,[`.${s.hasPopupIcon}&, .${s.hasClearIcon}&`]:{paddingRight:26+4+9},[`.${s.hasPopupIcon}.${s.hasClearIcon}&`]:{paddingRight:52+4+9},[`& .${s.input}`]:{padding:"7.5px 4px 7.5px 5px"},[`& .${s.endAdornment}`]:{right:9}},[`& .${ft.root}.${ne.sizeSmall}`]:{paddingTop:6,paddingBottom:6,paddingLeft:6,[`& .${s.input}`]:{padding:"2.5px 4px 2.5px 8px"}},[`& .${fe.root}`]:{paddingTop:19,paddingLeft:8,[`.${s.hasPopupIcon}&, .${s.hasClearIcon}&`]:{paddingRight:26+4+9},[`.${s.hasPopupIcon}.${s.hasClearIcon}&`]:{paddingRight:52+4+9},[`& .${fe.input}`]:{padding:"7px 4px"},[`& .${s.endAdornment}`]:{right:9}},[`& .${fe.root}.${ne.sizeSmall}`]:{paddingBottom:1,[`& .${fe.input}`]:{padding:"2.5px 4px"}},[`& .${ne.hiddenLabel}`]:{paddingTop:8},[`& .${fe.root}.${ne.hiddenLabel}`]:{paddingTop:0,paddingBottom:0,[`& .${s.input}`]:{paddingTop:16,paddingBottom:17}},[`& .${fe.root}.${ne.hiddenLabel}.${ne.sizeSmall}`]:{[`& .${s.input}`]:{paddingTop:8,paddingBottom:9}},[`& .${s.input}`]:f({flexGrow:1,textOverflow:"ellipsis",opacity:0},o.inputFocused&&{opacity:1})})),Qt=M("div",{name:"MuiAutocomplete",slot:"EndAdornment",overridesResolver:(o,r)=>r.endAdornment})({position:"absolute",right:0,top:"calc(50% - 14px)"}),Xt=M(Pt,{name:"MuiAutocomplete",slot:"ClearIndicator",overridesResolver:(o,r)=>r.clearIndicator})({marginRight:-2,padding:4,visibility:"hidden"}),Yt=M(Pt,{name:"MuiAutocomplete",slot:"PopupIndicator",overridesResolver:({ownerState:o},r)=>f({},r.popupIndicator,o.popupOpen&&r.popupIndicatorOpen)})(({ownerState:o})=>f({padding:2,marginRight:-2},o.popupOpen&&{transform:"rotate(180deg)"})),Zt=M(Ct,{name:"MuiAutocomplete",slot:"Popper",overridesResolver:(o,r)=>{const{ownerState:i}=o;return[{[`& .${s.option}`]:r.option},r.popper,i.disablePortal&&r.popperDisablePortal]}})(({theme:o,ownerState:r})=>f({zIndex:(o.vars||o).zIndex.modal},r.disablePortal&&{position:"absolute"})),eo=M($t,{name:"MuiAutocomplete",slot:"Paper",overridesResolver:(o,r)=>r.paper})(({theme:o})=>f({},o.typography.body1,{overflow:"auto"})),to=M("div",{name:"MuiAutocomplete",slot:"Loading",overridesResolver:(o,r)=>r.loading})(({theme:o})=>({color:(o.vars||o).palette.text.secondary,padding:"14px 16px"})),oo=M("div",{name:"MuiAutocomplete",slot:"NoOptions",overridesResolver:(o,r)=>r.noOptions})(({theme:o})=>({color:(o.vars||o).palette.text.secondary,padding:"14px 16px"})),no=M("div",{name:"MuiAutocomplete",slot:"Listbox",overridesResolver:(o,r)=>r.listbox})(({theme:o})=>({listStyle:"none",margin:0,padding:"8px 0",maxHeight:"40vh",overflow:"auto",position:"relative",[`& .${s.option}`]:{minHeight:48,display:"flex",overflow:"hidden",justifyContent:"flex-start",alignItems:"center",cursor:"pointer",paddingTop:6,boxSizing:"border-box",outline:"0",WebkitTapHighlightColor:"transparent",paddingBottom:6,paddingLeft:16,paddingRight:16,[o.breakpoints.up("sm")]:{minHeight:"auto"},[`&.${s.focused}`]:{backgroundColor:(o.vars||o).palette.action.hover,"@media (hover: none)":{backgroundColor:"transparent"}},'&[aria-disabled="true"]':{opacity:(o.vars||o).palette.action.disabledOpacity,pointerEvents:"none"},[`&.${s.focusVisible}`]:{backgroundColor:(o.vars||o).palette.action.focus},'&[aria-selected="true"]':{backgroundColor:o.vars?`rgba(${o.vars.palette.primary.mainChannel} / ${o.vars.palette.action.selectedOpacity})`:ot(o.palette.primary.main,o.palette.action.selectedOpacity),[`&.${s.focused}`]:{backgroundColor:o.vars?`rgba(${o.vars.palette.primary.mainChannel} / calc(${o.vars.palette.action.selectedOpacity} + ${o.vars.palette.action.hoverOpacity}))`:ot(o.palette.primary.main,o.palette.action.selectedOpacity+o.palette.action.hoverOpacity),"@media (hover: none)":{backgroundColor:(o.vars||o).palette.action.selected}},[`&.${s.focusVisible}`]:{backgroundColor:o.vars?`rgba(${o.vars.palette.primary.mainChannel} / calc(${o.vars.palette.action.selectedOpacity} + ${o.vars.palette.action.focusOpacity}))`:ot(o.palette.primary.main,o.palette.action.selectedOpacity+o.palette.action.focusOpacity)}}}})),ro=M(Vt,{name:"MuiAutocomplete",slot:"GroupLabel",overridesResolver:(o,r)=>r.groupLabel})(({theme:o})=>({backgroundColor:(o.vars||o).palette.background.paper,top:-8})),ao=M("ul",{name:"MuiAutocomplete",slot:"GroupUl",overridesResolver:(o,r)=>r.groupUl})({padding:0,[`& .${s.option}`]:{paddingLeft:24}}),lo=y.forwardRef(function(r,i){var m,L,$,P;const g=Ot({props:r,name:"MuiAutocomplete"}),{autoComplete:_=!1,autoHighlight:H=!1,autoSelect:A=!1,blurOnSelect:j=!1,ChipProps:Y,className:D,clearIcon:_e=ht||(ht=h.jsx(Wt,{fontSize:"small"})),clearOnBlur:Ge=!g.freeSolo,clearOnEscape:at=!1,clearText:be="Clear",closeText:J="Close",componentsProps:G={},defaultValue:Ue=g.multiple?[]:null,disableClearable:Se=!1,disableCloseOnSelect:he=!1,disabled:Q=!1,disabledItemsFocusable:lt=!1,disableListWrap:Ke=!1,disablePortal:ve=!1,filterSelectedOptions:re=!1,forcePopupIcon:c="auto",freeSolo:me=!1,fullWidth:Le=!1,getLimitTagsText:Ae=e=>`+${e}`,getOptionLabel:U,groupBy:ke,handleHomeEndKeys:st=!g.freeSolo,includeInputInList:it=!1,limitTags:xe=-1,ListboxComponent:Z="ul",ListboxProps:Ie,loading:Re=!1,loadingText:T="Loading…",multiple:S=!1,noOptionsText:Oe="No options",openOnFocus:Te=!1,openText:x="Open",PaperComponent:w=$t,PopperComponent:ae=Ct,popupIcon:qe=mt||(mt=h.jsx(Rt,{})),readOnly:k=!1,renderGroup:ye,renderInput:we,renderOption:v,renderTags:l,selectOnFocus:pt=!g.freeSolo,size:u="medium",slotProps:K={}}=g,le=We(g,Gt),{getRootProps:De,getInputProps:ee,getInputLabelProps:X,getPopupIndicatorProps:Ne,getClearProps:Je,getTagProps:Me,getListboxProps:Ee,getOptionProps:R,value:d,dirty:E,expanded:Pe,id:se,popupOpen:ie,focused:V,focusedTag:F,anchorEl:pe,setAnchorEl:Ce,inputValue:Qe,groupedOptions:N}=Et(f({},g,{componentName:"Autocomplete"})),q=!Se&&!Q&&E&&!k,W=(!me||c===!0)&&c!==!1,{onMouseDown:ue}=ee(),{ref:te}=Ie??{},Fe=Ee(),{ref:ze}=Fe,He=We(Fe,Ut),Xe=kt(ze,te),ce=U||(e=>{var n;return(n=e.label)!=null?n:e}),C=f({},g,{disablePortal:ve,expanded:Pe,focused:V,fullWidth:Le,getOptionLabel:ce,hasClearIcon:q,hasPopupIcon:W,inputFocused:F===-1,popupOpen:ie,size:u}),O=qt(C);let z;if(S&&d.length>0){const e=n=>f({className:O.tag,disabled:Q},Me(n));l?z=l(d,e,C):z=d.map((n,a)=>h.jsx(wt,f({label:ce(n),size:u},e({index:a}),Y)))}if(xe>-1&&Array.isArray(z)){const e=z.length-xe;!V&&e>0&&(z=z.splice(0,xe),z.push(h.jsx("span",{className:O.tag,children:Ae(e)},z.length)))}const Ye=ye||(e=>h.jsxs("li",{children:[h.jsx(ro,{className:O.groupLabel,ownerState:C,component:"div",children:e.group}),h.jsx(ao,{className:O.groupUl,ownerState:C,children:e.children})]},e.key)),et=v||((e,n)=>{const{key:a}=e,p=We(e,Kt);return h.jsx("li",f({},p,{children:ce(n)}),a)}),je=(e,n)=>{const a=R({option:e,index:n});return et(f({},a,{className:O.option}),e,{selected:a["aria-selected"],index:n,inputValue:Qe},C)},$e=(m=K.clearIndicator)!=null?m:G.clearIndicator,oe=(L=K.paper)!=null?L:G.paper,de=($=K.popper)!=null?$:G.popper,t=(P=K.popupIndicator)!=null?P:G.popupIndicator;return h.jsxs(y.Fragment,{children:[h.jsx(Jt,f({ref:i,className:ge(O.root,D),ownerState:C},De(le),{children:we({id:se,disabled:Q,fullWidth:!0,size:u==="small"?"small":void 0,InputLabelProps:X(),InputProps:f({ref:Ce,className:O.inputRoot,startAdornment:z,onClick:e=>{e.target===e.currentTarget&&ue(e)}},(q||W)&&{endAdornment:h.jsxs(Qt,{className:O.endAdornment,ownerState:C,children:[q?h.jsx(Xt,f({},Je(),{"aria-label":be,title:be,ownerState:C},$e,{className:ge(O.clearIndicator,$e==null?void 0:$e.className),children:_e})):null,W?h.jsx(Yt,f({},Ne(),{disabled:Q,"aria-label":ie?J:x,title:ie?J:x,ownerState:C},t,{className:ge(O.popupIndicator,t==null?void 0:t.className),children:qe})):null]})}),inputProps:f({className:O.input,disabled:Q,readOnly:k},ee())})})),pe?h.jsx(Zt,f({as:ae,disablePortal:ve,style:{width:pe?pe.clientWidth:null},ownerState:C,role:"presentation",anchorEl:pe,open:ie},de,{className:ge(O.popper,de==null?void 0:de.className),children:h.jsxs(eo,f({ownerState:C,as:w},oe,{className:ge(O.paper,oe==null?void 0:oe.className),children:[Re&&N.length===0?h.jsx(to,{className:O.loading,ownerState:C,children:T}):null,N.length===0&&!me&&!Re?h.jsx(oo,{className:O.noOptions,ownerState:C,role:"presentation",onMouseDown:e=>{e.preventDefault()},children:Oe}):null,N.length>0?h.jsx(no,f({as:Z,className:O.listbox,ownerState:C},He,Ie,{ref:Xe,children:N.map((e,n)=>ke?Ye({key:e.key,group:e.group,children:e.options.map((a,p)=>je(a,e.index+p))}):je(e,n))})):null]}))})):null]})}),uo=lo;export{uo as A};
