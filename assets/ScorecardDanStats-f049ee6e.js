import{p as _,r as c,j as e,T as te,I as F,R as j,a6 as ne,a1 as se,w as L,ax as oe,a4 as ie,A as ae,C as le,ay as re,a9 as ce,ac as de,U as xe,v as pe}from"./index-f91a49a2.js";import{F as O,d as me}from"./FieldValue-ff7a6437.js";import{B as he}from"./BeltStripe-d51192e4.js";import{S as ue,E as ge,d as fe}from"./CollectionButton-b7d0af9e.js";import{e as B,F as q,D as z}from"./index-99c5a693.js";import{d as ye}from"./Link-15300eff.js";import{u as H}from"./useWindowSize-e0ac4a19.js";import{A as je,a as ke,b as be}from"./AccordionSummary-c236d0a6.js";import{L as k}from"./Link-4ed936a6.js";import{p as Ce}from"./chartDefaults-9fc07b21.js";import{B as Se}from"./nivo-bar.es-91dfa333.js";function ve({entry:o,color:t}){const i=_(),n=B(o).replace(/[\s/]/g,"_").replace(/\W/g,""),x=t||"#fff",m=c.useCallback(a=>{a.preventDefault(),a.stopPropagation(),i(`/locks?id=${o.id}&name=${n}`)},[o.id,i,n]);return e.jsx(te,{title:"View Lock Details",arrow:!0,disableFocusListener:!0,children:e.jsx(F,{onClick:m,children:e.jsx(ye,{style:{width:18,height:18,color:x}})})})}function De({owner:o,evid:t,expanded:i,onExpand:d,merged:n}){const{setFilters:x}=c.useContext(q),{cardEvidence:m,getEntryFromId:a,getProjectEntryFromId:p}=c.useContext(z),h=a(t.matchId),g=p(t.matchId),l=h||g,[u,b]=c.useState(!1),s=c.useRef(null);c.useEffect(()=>{if(i&&s&&!u){const N=window.innerWidth<=600?70:74,{id:ee}=ne.parse(location.search),A=ee===t.id;b(!0),setTimeout(()=>{window.scrollTo({left:0,top:s.current.offsetTop-N,behavior:A?"auto":"smooth"})},A?0:100)}else i||b(!1)},[i,l,u,t.id]);let r=l?B(l):t.evidenceNotes;const f=t.exceptionType&&t.evidenceNotes.toLowerCase()!==r.toLowerCase()?t.evidenceNotes:null;r=t.exceptionType==="nomatch"?`[ ${t.evidenceNotes} ]`:r,r=t.exceptionType&&o&&n?r+" *":r;const y=["nomatch","duplicate","upgraded"].includes(t.exceptionType)?.5:1,C=t.exceptionId,S=C?m.find(D=>D.id===C):{},I=S?c.useMemo(()=>a(S.matchId),[a,S.matchId]):{},E=I?B(I,"short"):"",$=C?e.jsx(k,{style:{color:"#99c2e5"},onClick:()=>{U(C)},children:E}):null;let w=t.exceptionType==="nomatch"?"Could not be matched to a lock or project":t.exceptionType==="badlink"?"You must provide a valid link.":t.exceptionType==="duplicate"?"Duplicate of ":t.exceptionType==="upgraded"?"Upgraded to ":null;const U=c.useCallback(D=>{x({id:D})},[x]),P=t.points===1?"pt":"pts";let v=t.date?se(t.date).format("L"):"(no date)";v=v.replace("/202","/2"),v=v.replace("/201","/1");const V=t.date?"#fff":"#aaa",W=c.useCallback((D,N)=>{o&&d(N?t.id:!1)},[t.id,d,o]),G=o?{}:{cursor:"default"},K=o?e.jsx(me,{}):null,{isMobile:T}=H(),Y=T?"block":"flex",J=T?{display:"block",marginLeft:0,placeItems:"center"}:{display:"flex",margin:"0px 0px 0px 20px"},Q=T?"65%":"56%",X=T?"-2px 0px 3px 0px":"1px 0px 3px 0px",Z={maxWidth:700,marginLeft:"auto",marginRight:"auto",display:"flex",placeItems:"center"};return e.jsxs(je,{expanded:i,onChange:W,ref:s,children:[e.jsxs(ke,{expandIcon:K,style:{...Z,...G},children:[e.jsx(he,{value:l?l.belt:""}),e.jsxs("div",{style:{margin:"8px 0px 0px 8px",width:Q,flexShrink:0,flexDirection:"column",opacity:y},children:[e.jsx(O,{value:r,textStyle:{marginLeft:"0px",fontWeight:700},style:{marginBottom:"2px"}}),!!f&&e.jsx("span",{style:{margin:"0px 0px 0px 15px",fontSize:"0.95rem",lineHeight:1.25,color:"#bbb"},children:f}),!!l&&!!(l!=null&&l.version)&&e.jsx(O,{name:"Version",value:e.jsx(L,{style:{fontSize:"0.95rem",lineHeight:1.25},children:l==null?void 0:l.version}),textStyle:(l==null?void 0:l.belt)==="Unranked"?{color:"#aaa"}:{}})]}),e.jsxs("div",{style:{display:Y,placeItems:"center",marginLeft:10,opacity:y},children:[e.jsxs("div",{style:{display:"flex",width:76},children:[e.jsx("div",{style:{margin:"2px 0px 0px 6px",width:30,flexShrink:0,flexDirection:"column"},children:h&&e.jsx(ve,{entry:h})}),e.jsx("div",{style:{margin:"0px 0px 0px 6px",flexShrink:0,flexDirection:"column"},children:e.jsx(ue,{url:t.link,handleChange:W,exceptionType:t.exceptionType,owner:o})})]}),e.jsxs("div",{style:J,children:[e.jsx("div",{style:{margin:X,color:V,width:90,textAlign:"center"},children:v}),e.jsx("div",{style:{margin:"1px 0px 0px 22px"},children:e.jsxs("nobr",{children:[e.jsxs("span",{style:{fontWeight:700},children:[t.points," "]}),e.jsx("span",{style:{color:"#666"},children:P})]})})]})]})]}),i&&e.jsx(j.Fragment,{children:e.jsxs(be,{sx:{padding:"4px 16px 0px 26px"},children:[(w||t.modifier)&&e.jsxs("div",{style:{margin:"0px 0px 20px 20px",fontWeight:600,fontSize:".95rem"},children:[t.modifier&&e.jsxs("span",{children:[t.modifier,"     "]}),w&&e.jsxs("span",{children:["* ",w," ",$]})]}),e.jsx(ge,{evid:t,handleUpdate:()=>{}})]})})]},t.id)}const Me=j.memo(De,(o,t)=>{const i=Object.keys(o.evid),d=Object.keys(t.evid);if(i.length!==d.length)return!1;for(let n=0;n<i.length;n++)if(i[n]!==d[n]||o.evid[i[n]]!==t.evid[d[n]])return!1;return o.owner===t.owner&&o.expanded===t.expanded&&o.onExpand===t.onExpand&&o.merged===t.merged});function Le({beltData:o}){const{width:t}=H(),i=t<=560,d=i?190:175,n=i?-90:-45,x=i?{top:0,right:0,bottom:80,left:15}:{top:0,right:0,bottom:60,left:15},m=["#d5d5d5","#d8d801","#ed7d01","#389700","#0090de","#634b9f","#9d5918","#ba0303","#000","#000","#000","#000","#000","#3e3e3e","#a5a93c","#a5a93c","#a5a93c","#a5a93c","#a5a93c","#a5a93c"],a=["#000","#000","#000","#ddd","#ddd","#ddd","#ddd","#ddd","#ddd","#ddd","#ddd","#ddd","#ddd","#aaa","#000","#000","#000","#000","#000","#000"];return e.jsx("div",{style:{height:d,padding:"0px 0px 0px 0px",width:"100%"},children:e.jsx(Se,{data:o,margin:x,padding:.15,colors:p=>m[p.index%m.length],animate:!0,axisBottom:{tickRotation:n},axisLeft:null,enableGridY:!1,theme:Ce,isInteractive:!1,enableLabel:!0,label:p=>p.data.count,labelSkipWidth:12,labelSkipHeight:12,labelTextColor:p=>a[p.index%a.length]})},"bar")}function $e({entries:o}){const t=c.useMemo(()=>{const i=o.map(({belt:n})=>(n&&n.includes("Project"),n)).reduce((n,x)=>(n[x]||(n[x]=0),n[x]++,n),{});return i.Project=o.reduce((n,x)=>x.simpleBelt==="Project"?n+1:n,0),(i.Project>0?oe:ie).map(n=>({id:n,label:n,count:i[n]||0,value:i[n]||0}))},[o]);return e.jsx("div",{style:{width:"100%",marginTop:"0px"},children:e.jsx(Le,{beltData:t})})}var R={},Be=le;Object.defineProperty(R,"__esModule",{value:!0});var M=R.default=void 0,Ie=Be(ae()),Te=e;M=R.default=(0,Ie.default)((0,Te.jsx)("path",{d:"M11 18h2v-2h-2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4"}),"HelpOutline");function Ee(){const{setFilters:o}=c.useContext(q),{cardEvidence:t,getEntryFromId:i}=c.useContext(z),[d,n]=c.useState(!1),x=c.useCallback(()=>{n(!0)},[]),m=c.useCallback(()=>{n(!1)},[]),a=c.useCallback(s=>{o({id:s}),n(!1)},[o]),p=t.map(s=>{const r=s.exceptionId,f=r?t.find(E=>E.id===r):{},y=f?i(f.matchId):{},C=y?B(y,"short"):"",S=s.matchId?i(s.matchId):null,I=S?B(S,"short"):"";return{...s,supersedingEntryId:r,supersedingLockName:C,matchLockName:I}}),h=p.filter(s=>s.exceptionType==="nomatch"),g=p.filter(s=>s.exceptionType==="badlink"),l=p.filter(s=>s.exceptionType==="duplicate"),u=p.filter(s=>s.exceptionType==="upgraded");if(h.length+g.length+l.length+u.length>0)return e.jsxs(j.Fragment,{children:[e.jsx(F,{onClick:x,style:{marginRight:0},children:e.jsx(M,{fontSize:"small"})}),e.jsx(re,{sx:{color:"#fff",textAlign:"left",height:700,zIndex:s=>s.zIndex.drawer+1},open:d,onClick:m,children:e.jsxs("div",{style:{maxWidth:600,fontSize:"0.95rem",padding:15},children:[e.jsxs("div",{style:{display:"flex",marginBottom:10,placeItems:"center"},children:[e.jsx("div",{style:{fontWeight:600,fontSize:"1.3rem",flexGrow:1},children:"Some documentation ineligible for Dan Points"}),e.jsx(F,{onClick:m,children:e.jsx(fe,{sx:{cursor:"pointer"}})})]}),e.jsx("div",{style:{marginBottom:20},children:"Some of the entries in your Scorecard are not eligible for Dan Points. Reasons for this may include: the link in your documentation is missing or not valid, we could not find a lock matching your entry, you have multiple entries for the same lock, or an entry may have been replaced by an upgrade of the same lock. Locks ranked below Blue Belt are never eligible for Dan Points."}),h.length>0&&e.jsxs(j.Fragment,{children:[e.jsx(ce,{style:{marginBottom:20}}),e.jsx(L,{style:{fontWeight:500,fontSize:"1.0rem",lineHeight:"1.25rem",margin:"0px"},children:"Could not be matched to a lock or project"}),e.jsx("ul",{style:{padding:0,marginLeft:20},children:h.map((s,r)=>e.jsx("li",{style:{marginBottom:4},children:e.jsx(k,{style:{color:"#99c2e5",textDecoration:"none"},onClick:()=>{a(s.id)},children:s.evidenceNotes})},r))})]}),g.length>0&&e.jsxs(j.Fragment,{children:[e.jsx(L,{style:{fontWeight:500,fontSize:"1.0rem",lineHeight:"1.25rem",margin:"0px"},children:"Missing or invalid URLs"}),e.jsx("ul",{style:{padding:0,marginLeft:20},children:g.map((s,r)=>e.jsx("li",{style:{marginBottom:4},children:e.jsx(k,{style:{color:"#99c2e5",textDecoration:"none"},onClick:()=>{a(s.id)},children:s.matchLockName})},r))})]}),l.length>0&&e.jsxs(j.Fragment,{children:[e.jsx(L,{style:{fontWeight:500,fontSize:"1.0rem",lineHeight:"1.25rem",margin:"0px"},children:"Duplicated by another entry"}),e.jsx("ul",{style:{padding:0,marginLeft:20},children:l.map((s,r)=>e.jsxs("li",{style:{marginBottom:4},children:[s.evidenceNotes," is a duplicate of ",e.jsx(k,{style:{color:"#99c2e5",textDecoration:"none"},onClick:()=>{a(s.supersedingEntryId)},children:s.supersedingLockName})]},r))})]}),u.length>0&&e.jsxs(j.Fragment,{children:[e.jsx(L,{style:{fontWeight:500,fontSize:"1.0rem",lineHeight:"1.25rem",margin:"0px"},children:"Upgraded by another lock"}),e.jsx("ul",{style:{padding:0,marginLeft:20},children:u.map((s,r)=>e.jsxs("li",{style:{marginBottom:4},children:[s.evidenceNotes," is upgraded by ",e.jsx(k,{style:{color:"#99c2e5",textDecoration:"none"},onClick:()=>{a(s.supersedingEntryId)},children:s.supersedingLockName})]},r))})]})]})})]})}function Ue({profile:o,owner:t}){var f;const{userId:i}=de(),{user:d}=c.useContext(xe),n=(f=o==null?void 0:o.displayName)==null?void 0:f.replace(/\s/g,"_"),{cardDanPoints:x,cardBBCount:m,cardEligibleDan:a,cardNextDanPoints:p,cardNextDanLocks:h}=c.useContext(z),g=_(),l=c.useCallback(()=>{g("/profile/scorecard/upgrades")},[g]),u={1:"st",2:"nd",3:"rd"},b=u[[a]]?a+u[[a]]:a+"th",s=c.useCallback(async()=>{const y=`@LPUBeltBot request ${b} Dan https://lpubelts.com/#/profile/${i||(d==null?void 0:d.uid)}/scorecard?name=${n}`;await navigator.clipboard.writeText(y),pe("Request copied to clipboard. Take it over to #belt-requests!")},[b,n,d==null?void 0:d.uid,i]),r=(o==null?void 0:o.blackBeltAwardedAt)>0&&a===1?"DAN":"Eligible for Dan";return e.jsxs("div",{style:{display:"flex"},children:[e.jsxs("div",{style:{textAlign:"right",padding:"10px 12px 18px 0px",flexGrow:1},children:[e.jsxs("div",{style:{fontWeight:700,marginBottom:6},children:[r," ",e.jsx("span",{style:{fontSize:"1.8rem",lineHeight:"1rem"},children:a})]}),e.jsxs("div",{style:{marginBottom:5},children:["Dan Points ",e.jsx("strong",{children:x})]}),e.jsxs("div",{style:{marginBottom:5},children:["Black Belt Locks ",e.jsx("strong",{children:m})]}),e.jsxs("div",{style:{fontSize:"0.85rem"},children:[p," point",p!==1&&"s"," and ",h," BB lock",h!==1&&"s"," to next Dan"]}),e.jsxs("div",{style:{margin:"10px 0px",fontSize:"0.85rem"},children:[a>1&&t&&e.jsxs("span",{children:[e.jsx(k,{onClick:s,style:{color:"#99c2e5",cursor:"pointer"},children:"Copy Request"})," • "]}),e.jsx(k,{onClick:l,style:{color:"#99c2e5",cursor:"pointer"},children:"Upgrades list"})]})]}),e.jsx("div",{style:{textAlign:"right"},children:e.jsx(Ee,{})})]})}export{$e as I,Ue as S,ve as V,Me as a};