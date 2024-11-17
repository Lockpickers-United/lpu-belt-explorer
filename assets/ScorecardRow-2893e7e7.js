import{b as $,r as a,j as t,G as N,I as V,K as z,M as B,d as H,aa as ce,R as W,$ as pe,af as xe,u as ue,a9 as fe,J as me,aI as he}from"./index-34e6572e.js";import{F as A,d as ge}from"./FieldValue-fcd3344b.js";import{B as je}from"./BeltStripe-a8c6815a.js";import{B as ye,S as be,E as ve}from"./BeltIcon-2e6d750e.js";import{e as T}from"./entryName-6a9ba0a2.js";import{d as ke}from"./Link-662017cd.js";import{F as Ce,D as we}from"./filterFields-65e56a2d.js";import{A as Te,a as Se,b as Ie}from"./AccordionSummary-10a560c0.js";import{L as Ee}from"./Link-031a11df.js";function Le({entry:n,color:e}){const o=$(),r=T(n).replace(/[\s/]/g,"_").replace(/\W/g,""),p=e||"#fff",x=a.useCallback(u=>{u.preventDefault(),u.stopPropagation(),o(`/locks?id=${n.id}&name=${r}`)},[n.id,o,r]);return t.jsx(N,{title:"View Lock Details",arrow:!0,disableFocusListener:!0,children:t.jsx(V,{onClick:x,children:t.jsx(ke,{style:{width:18,height:18,color:p}})})})}var S={},_e=B;Object.defineProperty(S,"__esModule",{value:!0});var q=S.default=void 0,De=_e(z()),Me=t;q=S.default=(0,De.default)((0,Me.jsx)("path",{d:"M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2M5 8V7h2v3.82C5.84 10.4 5 9.3 5 8m14 0c0 1.3-.84 2.4-2 2.82V7h2z"}),"EmojiEvents");var I={},Fe=B;Object.defineProperty(I,"__esModule",{value:!0});var O=I.default=void 0,Re=Fe(z()),Ae=t;O=I.default=(0,Re.default)((0,Ae.jsx)("path",{d:"M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3m-3 11H8v-5h8zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m-1-9H6v4h12z"}),"Print");H.extend(ce);function $e({owner:n,activity:e,expanded:o,onExpand:i,merged:r}){const p=$(),{setFilters:x}=a.useContext(Ce),{cardActivity:u,getEntryFromId:y,getProjectEntryFromId:K,getAwardEntryFromId:U}=a.useContext(we),{admin:G}=a.useContext(pe),b=y(e.matchId),J=K(e.matchId),f=U(e.matchId),s=b||J||f;if(!s)return;const[E,L]=a.useState(!1),v=a.useRef(null);a.useEffect(()=>{if(o&&v&&!E){const w=window.innerWidth<=600?70:74,{id:de}=xe.parse(location.search),R=de===e.id;L(!0),setTimeout(()=>{window.scrollTo({left:0,top:v.current.offsetTop-w,behavior:R?"auto":"smooth"})},R?0:100)}else o||L(!1)},[o,s,E,e.id]);let d=s?T(s):e.evidenceNotes;const _=e.exceptionType&&e.evidenceNotes&&e.evidenceNotes.toLowerCase()!==d.toLowerCase()?e.evidenceNotes:null;d=e.exceptionType==="nomatch"?`[ ${e.evidenceNotes} ]`:d,d=e.exceptionType&&n&&r&&!f?d+" *":d;const D=["nomatch","duplicate","upgraded"].includes(e.exceptionType)?.5:1,m=e.exceptionId,k=m?u.find(l=>l.id===m):{},M=k?a.useMemo(()=>y(k.matchId),[y,k.matchId]):{},Y=M?T(M,"short"):"",Q=m?t.jsx(Ee,{style:{color:"#99c2e5"},onClick:()=>{X(m)},children:Y}):null;let C=e.exceptionType==="nomatch"?"Could not be matched to a lock or project":e.exceptionType==="badlink"&&!f?"You must provide a valid link.":e.exceptionType==="duplicate"?"Duplicate of ":e.exceptionType==="upgraded"?"Upgraded to ":null;const X=a.useCallback(l=>{x({id:l})},[x]),Z=e.points===1?"pt":"pts";let c=e.date?H(e.date).format("L"):"(no date)";c=c.replace("/202","/2"),c=c.replace("/201","/1");const P=e.date?"#fff":"#aaa",h=["belt","dan","hof"].includes(e.awardType),g=n&&!h||G,F=a.useCallback((l,w)=>{g&&i(w?e.id:!1)},[e,g,i]),ee=a.useCallback(l=>{l.preventDefault(),l.stopPropagation(),p("/award")},[p]),te=g?{}:{cursor:"default"},se=g?t.jsx(ge,{}):t.jsx("div",{style:{width:24}}),{isMobile:j}=ue(),ne=j?"block":"flex",oe=j?{display:"block",marginLeft:0,placeItems:"center"}:{display:"flex",margin:"0px 0px 0px 20px"},re=j?"65%":"56%",ae=j?"-2px 0px 3px 0px":"3px 0px 3px 0px",le=h?"1.1rem":"1rem",ie={maxWidth:700,marginLeft:"auto",marginRight:"auto",display:"flex",placeItems:"center",backgroundColor:h?"#121212":""};return t.jsxs(Te,{expanded:o,onChange:F,ref:v,children:[t.jsxs(Se,{expandIcon:se,style:{...ie,...te},children:[t.jsx(je,{value:s?s.belt:""}),t.jsxs("div",{style:{margin:"8px 0px 0px 8px",width:re,flexShrink:0,flexDirection:"column",opacity:D},children:[t.jsxs("div",{style:{display:"flex"},children:[e.awardType==="belt"&&t.jsx("div",{style:{marginTop:-4,marginRight:10},children:t.jsx(ye,{value:s.belt,style:{paddingTop:2}})}),e.awardType==="dan"&&t.jsx("div",{style:{margin:"0px 12px 0px 5px"},children:t.jsx(fe,{style:{color:"#87c048"}})}),e.awardType==="hof"&&t.jsx("div",{style:{margin:"0px 12px 0px 5px"},children:t.jsx(q,{style:{color:"#f8f52f"}})}),t.jsx(A,{value:d,textStyle:{marginLeft:"0px",fontWeight:700,fontSize:le},style:{marginBottom:"2px"}})]}),!!_&&!f&&t.jsx("span",{style:{margin:"0px 0px 0px 15px",fontSize:"0.95rem",lineHeight:1.25,color:"#bbb"},children:_}),!!s&&!!(s!=null&&s.version)&&t.jsx(A,{name:"Version",value:t.jsx(me,{style:{fontSize:"0.95rem",lineHeight:1.25},children:s==null?void 0:s.version}),textStyle:(s==null?void 0:s.belt)==="Unranked"?{color:"#aaa"}:{}})]}),t.jsxs("div",{style:{display:ne,placeItems:"center",marginLeft:10,opacity:D},children:[t.jsxs("div",{style:{display:"flex",width:76},children:[t.jsx("div",{style:{margin:"2px 0px 0px 6px",width:30,flexShrink:0,flexDirection:"column"},children:b&&t.jsx(Le,{entry:b})}),t.jsx("div",{style:{margin:"0px 0px 0px 6px",flexShrink:0,flexDirection:"column"},children:(n||!h)&&t.jsx(be,{activity:e,handleChange:F,exceptionType:e.exceptionType,owner:n})})]}),t.jsxs("div",{style:oe,children:[t.jsx("div",{style:{margin:ae,color:P,width:90,textAlign:"center"},children:c}),!["belt","dan"].includes(e.awardType)&&t.jsx("div",{style:{margin:"1px 0px 0px 22px"},children:t.jsxs("nobr",{children:[t.jsxs("span",{style:{fontWeight:700},children:[e.points," "]}),t.jsx("span",{style:{color:"#666"},children:Z})]})}),n&&e.matchId===he&&t.jsx(N,{title:"Print Certificate",arrow:!0,disableFocusListener:!0,children:t.jsx(V,{onClick:ee,style:{marginLeft:30},children:t.jsx(O,{})})})]})]})]}),o&&t.jsx(W.Fragment,{children:t.jsxs(Ie,{sx:{padding:"4px 16px 0px 26px"},children:[(C||e.evidenceModifier)&&t.jsxs("div",{style:{margin:"0px 0px 20px 20px",fontWeight:600,fontSize:".95rem"},children:[e.evidenceModifier&&t.jsxs("span",{children:[e.evidenceModifier,"     "]}),C&&t.jsxs("span",{children:["* ",C," ",Q]})]}),t.jsx(ve,{activity:e,handleUpdate:()=>{}})]})})]},e.id)}const Ge=W.memo($e,(n,e)=>{const o=Object.keys(n.activity),i=Object.keys(e.activity);if(o.length!==i.length)return!1;for(let r=0;r<o.length;r++)if(o[r]!==i[r]||n.activity[o[r]]!==e.activity[i[r]])return!1;return n.owner===e.owner&&n.expanded===e.expanded&&n.onExpand===e.onExpand&&n.merged===e.merged});export{Ge as S,Le as V};
