import{h as ee,f as te,s as T,_ as o,r as p,m as ne,bm as ie,aJ as oe,n as re,x as se,b2 as ae,j as C,o as le,p as de,bn as P}from"./index-a08903d0.js";function pe(n){return ee("MuiCollapse",n)}te("MuiCollapse",["root","horizontal","vertical","entered","hidden","wrapper","wrapperInner"]);const ce=["addEndListener","children","className","collapsedSize","component","easing","in","onEnter","onEntered","onEntering","onExit","onExited","onExiting","orientation","style","timeout","TransitionComponent"],ue=n=>{const{orientation:t,classes:r}=n,c={root:["root",`${t}`],entered:["entered"],hidden:["hidden"],wrapper:["wrapper",`${t}`],wrapperInner:["wrapperInner",`${t}`]};return de(c,pe,r)},he=T("div",{name:"MuiCollapse",slot:"Root",overridesResolver:(n,t)=>{const{ownerState:r}=n;return[t.root,t[r.orientation],r.state==="entered"&&t.entered,r.state==="exited"&&!r.in&&r.collapsedSize==="0px"&&t.hidden]}})(({theme:n,ownerState:t})=>o({height:0,overflow:"hidden",transition:n.transitions.create("height")},t.orientation==="horizontal"&&{height:"auto",width:0,transition:n.transitions.create("width")},t.state==="entered"&&o({height:"auto",overflow:"visible"},t.orientation==="horizontal"&&{width:"auto"}),t.state==="exited"&&!t.in&&t.collapsedSize==="0px"&&{visibility:"hidden"})),me=T("div",{name:"MuiCollapse",slot:"Wrapper",overridesResolver:(n,t)=>t.wrapper})(({ownerState:n})=>o({display:"flex",width:"100%"},n.orientation==="horizontal"&&{width:"auto",height:"100%"})),fe=T("div",{name:"MuiCollapse",slot:"WrapperInner",overridesResolver:(n,t)=>t.wrapperInner})(({ownerState:n})=>o({width:"100%"},n.orientation==="horizontal"&&{width:"auto",height:"100%"})),U=p.forwardRef(function(t,r){const c=ne({props:t,name:"MuiCollapse"}),{addEndListener:S,children:_,className:A,collapsedSize:g="0px",component:J,easing:$,in:D,onEnter:W,onEntered:j,onEntering:b,onExit:I,onExited:k,onExiting:M,orientation:F="vertical",style:z,timeout:a=ie.standard,TransitionComponent:q=oe}=c,B=re(c,ce),x=o({},c,{orientation:F,collapsedSize:g}),u=ue(x),H=se(),L=p.useRef(),l=p.useRef(null),R=p.useRef(),E=typeof g=="number"?`${g}px`:g,h=F==="horizontal",m=h?"width":"height";p.useEffect(()=>()=>{clearTimeout(L.current)},[]);const w=p.useRef(null),G=ae(r,w),d=e=>i=>{if(e){const s=w.current;i===void 0?e(s):e(s,i)}},v=()=>l.current?l.current[h?"clientWidth":"clientHeight"]:0,K=d((e,i)=>{l.current&&h&&(l.current.style.position="absolute"),e.style[m]=E,W&&W(e,i)}),O=d((e,i)=>{const s=v();l.current&&h&&(l.current.style.position="");const{duration:f,easing:y}=P({style:z,timeout:a,easing:$},{mode:"enter"});if(a==="auto"){const N=H.transitions.getAutoHeightDuration(s);e.style.transitionDuration=`${N}ms`,R.current=N}else e.style.transitionDuration=typeof f=="string"?f:`${f}ms`;e.style[m]=`${s}px`,e.style.transitionTimingFunction=y,b&&b(e,i)}),Q=d((e,i)=>{e.style[m]="auto",j&&j(e,i)}),V=d(e=>{e.style[m]=`${v()}px`,I&&I(e)}),X=d(k),Y=d(e=>{const i=v(),{duration:s,easing:f}=P({style:z,timeout:a,easing:$},{mode:"exit"});if(a==="auto"){const y=H.transitions.getAutoHeightDuration(i);e.style.transitionDuration=`${y}ms`,R.current=y}else e.style.transitionDuration=typeof s=="string"?s:`${s}ms`;e.style[m]=E,e.style.transitionTimingFunction=f,M&&M(e)}),Z=e=>{a==="auto"&&(L.current=setTimeout(e,R.current||0)),S&&S(w.current,e)};return C.jsx(q,o({in:D,onEnter:K,onEntered:Q,onEntering:O,onExit:V,onExited:X,onExiting:Y,addEndListener:Z,nodeRef:w,timeout:a==="auto"?null:a},B,{children:(e,i)=>C.jsx(he,o({as:J,className:le(u.root,A,{entered:u.entered,exited:!D&&E==="0px"&&u.hidden}[e]),style:o({[h?"minWidth":"minHeight"]:E},z),ownerState:o({},x,{state:e}),ref:G},i,{children:C.jsx(me,{ownerState:o({},x,{state:e}),className:u.wrapper,ref:l,children:C.jsx(fe,{ownerState:o({},x,{state:e}),className:u.wrapperInner,children:_})})}))}))});U.muiSupportAuto=!0;const xe=U;export{xe as C};
