import{r as c,j as e,T as ee,I as F,R as j,a6 as te,a1 as ne,w as D,av as se,a4 as oe,A as ie,C as re,aw as le,a9 as ae,ac as ce,U as de,p as pe,v as xe}from"./index-5aed8077.js";import{F as _,d as me}from"./FieldValue-54074402.js";import{B as he}from"./BeltStripe-daf1d474.js";import{S as ue,E as ge,d as fe}from"./CollectionButton-b94132ff.js";import{e as L,F as O,D as W}from"./index-4631fc0d.js";import{d as ye}from"./Link-ffdbe88c.js";import{u as q}from"./useWindowSize-e33788c7.js";import{A as je,a as ke,b as be}from"./AccordionSummary-8a63781b.js";import{L as k}from"./Link-281d4d9e.js";import{p as Ce}from"./chartDefaults-9fc07b21.js";import{B as Se}from"./nivo-bar.es-66481bb9.js";function ve({entry:o}){const i=L(o).replace(/[\s/]/g,"_").replace(/\W/g,""),a=c.useCallback(n=>{n.preventDefault(),n.stopPropagation();const p=`${window.location.origin}/#/locks?id=${o.id}&name=${i}`,m=window.open(p,"_blank","noopener,noreferrer");m&&(m.opener=null)},[o.id,i]);return e.jsx(ee,{title:"View Lock Details",arrow:!0,disableFocusListener:!0,children:e.jsx(F,{onClick:a,children:e.jsx(ye,{style:{width:18,height:18}})})})}function we({owner:o,evid:t,expanded:i,onExpand:a,merged:n}){const{setFilters:p}=c.useContext(O),{cardEvidence:m,getEntryFromId:d,getProjectEntryFromId:x}=c.useContext(W),h=d(t.matchId),g=x(t.matchId),r=h||g,[u,b]=c.useState(!1),s=c.useRef(null);c.useEffect(()=>{if(i&&s&&!u){const N=window.innerWidth<=600?70:74,{id:Z}=te.parse(location.search),A=Z===t.id;b(!0),setTimeout(()=>{window.scrollTo({left:0,top:s.current.offsetTop-N,behavior:A?"auto":"smooth"})},A?0:100)}else i||b(!1)},[i,r,u,t.id]);let l=r?L(r):t.evidenceNotes;const f=t.exceptionType&&t.evidenceNotes.toLowerCase()!==l.toLowerCase()?t.evidenceNotes:null;l=t.exceptionType==="nomatch"?`[ ${t.evidenceNotes} ]`:l,l=t.exceptionType&&o&&n?l+" *":l;const y=["nomatch","duplicate","upgraded"].includes(t.exceptionType)?.5:1,C=t.exceptionId,S=C?m.find(w=>w.id===C):{},B=S?c.useMemo(()=>d(S.matchId),[d,S.matchId]):{},T=B?L(B,"short"):"",$=C?e.jsx(k,{style:{color:"#99c2e5"},onClick:()=>{M(C)},children:T}):null;let E=t.exceptionType==="nomatch"?"Could not be matched to a lock or project":t.exceptionType==="badlink"?"You must provide a valid link.":t.exceptionType==="duplicate"?"Duplicate of ":t.exceptionType==="upgraded"?"Upgraded to ":null;const M=c.useCallback(w=>{p({id:w})},[p]),U=t.points===1?"pt":"pts";let v=t.date?ne(t.date).format("L"):"(no date)";v=v.replace("/202","/2"),v=v.replace("/201","/1");const P=t.date?"#fff":"#aaa",R=c.useCallback((w,N)=>{o&&a(N?t.id:!1)},[t.id,a,o]),V=o?{}:{cursor:"default"},G=o?e.jsx(me,{}):null,{isMobile:I}=q(),K=I?"block":"flex",Y=I?{display:"block",marginLeft:0,placeItems:"center"}:{display:"flex",margin:"0px 0px 0px 20px"},J=I?"65%":"56%",Q=I?"-2px 0px 3px 0px":"1px 0px 3px 0px",X={maxWidth:700,marginLeft:"auto",marginRight:"auto",display:"flex",placeItems:"center"};return e.jsxs(je,{expanded:i,onChange:R,ref:s,children:[e.jsxs(ke,{expandIcon:G,style:{...X,...V},children:[e.jsx(he,{value:r?r.belt:""}),e.jsxs("div",{style:{margin:"8px 0px 0px 8px",width:J,flexShrink:0,flexDirection:"column",opacity:y},children:[e.jsx(_,{value:l,textStyle:{marginLeft:"0px",fontWeight:700},style:{marginBottom:"2px"}}),!!f&&e.jsx("span",{style:{margin:"0px 0px 0px 15px",fontSize:"0.95rem",lineHeight:1.25,color:"#bbb"},children:f}),!!r&&!!(r!=null&&r.version)&&e.jsx(_,{name:"Version",value:e.jsx(D,{style:{fontSize:"0.95rem",lineHeight:1.25},children:r==null?void 0:r.version}),textStyle:(r==null?void 0:r.belt)==="Unranked"?{color:"#aaa"}:{}})]}),e.jsxs("div",{style:{display:K,placeItems:"center",marginLeft:10,opacity:y},children:[e.jsxs("div",{style:{display:"flex",width:76},children:[e.jsx("div",{style:{margin:"2px 0px 0px 6px",width:30,flexShrink:0,flexDirection:"column"},children:h&&e.jsx(ve,{entry:h})}),e.jsx("div",{style:{margin:"0px 0px 0px 6px",flexShrink:0,flexDirection:"column"},children:e.jsx(ue,{url:t.link,handleChange:R,exceptionType:t.exceptionType,owner:o})})]}),e.jsxs("div",{style:Y,children:[e.jsx("div",{style:{margin:Q,color:P,width:90,textAlign:"center"},children:v}),e.jsx("div",{style:{margin:"1px 0px 0px 22px"},children:e.jsxs("nobr",{children:[e.jsxs("span",{style:{fontWeight:700},children:[t.points," "]}),e.jsx("span",{style:{color:"#666"},children:U})]})})]})]})]}),i&&e.jsx(j.Fragment,{children:e.jsxs(be,{sx:{padding:"4px 16px 0px 26px"},children:[(E||t.modifier)&&e.jsxs("div",{style:{margin:"0px 0px 20px 20px",fontWeight:600,fontSize:".95rem"},children:[t.modifier&&e.jsxs("span",{children:[t.modifier,"     "]}),E&&e.jsxs("span",{children:["* ",E," ",$]})]}),e.jsx(ge,{evid:t,handleUpdate:()=>{}})]})})]},t.id)}const $e=j.memo(we,(o,t)=>{const i=Object.keys(o.evid),a=Object.keys(t.evid);if(i.length!==a.length)return!1;for(let n=0;n<i.length;n++)if(i[n]!==a[n]||o.evid[i[n]]!==t.evid[a[n]])return!1;return o.owner===t.owner&&o.expanded===t.expanded&&o.onExpand===t.onExpand&&o.merged===t.merged});function De({beltData:o}){const{width:t}=q(),i=t<=560,a=i?190:175,n=i?-90:-45,p=i?{top:0,right:0,bottom:80,left:15}:{top:0,right:0,bottom:60,left:15},m=["#d5d5d5","#d8d801","#ed7d01","#389700","#0090de","#634b9f","#9d5918","#ba0303","#000","#000","#000","#000","#000","#3e3e3e","#a5a93c","#a5a93c","#a5a93c","#a5a93c","#a5a93c","#a5a93c"],d=["#000","#000","#000","#ddd","#ddd","#ddd","#ddd","#ddd","#ddd","#ddd","#ddd","#ddd","#ddd","#aaa","#000","#000","#000","#000","#000","#000"];return e.jsx("div",{style:{height:a,padding:"0px 0px 0px 0px",width:"100%"},children:e.jsx(Se,{data:o,margin:p,padding:.15,colors:x=>m[x.index%m.length],animate:!0,axisBottom:{tickRotation:n},axisLeft:null,enableGridY:!1,theme:Ce,isInteractive:!1,enableLabel:!0,label:x=>x.data.count,labelSkipWidth:12,labelSkipHeight:12,labelTextColor:x=>d[x.index%d.length]})},"bar")}function Me({entries:o}){const t=c.useMemo(()=>{const i=o.map(({belt:n})=>(n&&n.includes("Project"),n)).reduce((n,p)=>(n[p]||(n[p]=0),n[p]++,n),{});return i.Project=o.reduce((n,p)=>p.simpleBelt==="Project"?n+1:n,0),(i.Project>0?se:oe).map(n=>({id:n,label:n,count:i[n]||0,value:i[n]||0}))},[o]);return e.jsx("div",{style:{width:"100%",marginTop:"0px"},children:e.jsx(De,{beltData:t})})}var z={},Le=re;Object.defineProperty(z,"__esModule",{value:!0});var H=z.default=void 0,Be=Le(ie()),Ie=e;H=z.default=(0,Be.default)((0,Ie.jsx)("path",{d:"M11 18h2v-2h-2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4"}),"HelpOutline");function Te(){const{setFilters:o}=c.useContext(O),{cardEvidence:t,getEntryFromId:i}=c.useContext(W),[a,n]=c.useState(!1),p=c.useCallback(()=>{n(!0)},[]),m=c.useCallback(()=>{n(!1)},[]),d=c.useCallback(s=>{o({id:s}),n(!1)},[o]),x=t.map(s=>{const l=s.exceptionId,f=l?t.find(T=>T.id===l):{},y=f?i(f.matchId):{},C=y?L(y,"short"):"",S=s.matchId?i(s.matchId):null,B=S?L(S,"short"):"";return{...s,supersedingEntryId:l,supersedingLockName:C,matchLockName:B}}),h=x.filter(s=>s.exceptionType==="nomatch"),g=x.filter(s=>s.exceptionType==="badlink"),r=x.filter(s=>s.exceptionType==="duplicate"),u=x.filter(s=>s.exceptionType==="upgraded");if(h.length+g.length+r.length+u.length>0)return e.jsxs(j.Fragment,{children:[e.jsx(F,{onClick:p,style:{marginRight:0},children:e.jsx(H,{fontSize:"small"})}),e.jsx(le,{sx:{color:"#fff",textAlign:"left",height:700,zIndex:s=>s.zIndex.drawer+1},open:a,onClick:m,children:e.jsxs("div",{style:{maxWidth:600,fontSize:"0.95rem",padding:15},children:[e.jsxs("div",{style:{display:"flex",marginBottom:10,placeItems:"center"},children:[e.jsx("div",{style:{fontWeight:600,fontSize:"1.3rem",flexGrow:1},children:"Some documentation ineligible for Dan Points"}),e.jsx(F,{onClick:m,children:e.jsx(fe,{sx:{cursor:"pointer"}})})]}),e.jsx("div",{style:{marginBottom:20},children:"Some of the entries in your Scorecard are not eligible for Dan Points. Reasons for this may include: the link in your documentation is missing or not valid, we could not find a lock matching your entry, you have multiple entries for the same lock, or an entry may have been replaced by an upgrade of the same lock. Locks ranked below Blue Belt are never eligible for Dan Points."}),h.length>0&&e.jsxs(j.Fragment,{children:[e.jsx(ae,{style:{marginBottom:20}}),e.jsx(D,{style:{fontWeight:500,fontSize:"1.0rem",lineHeight:"1.25rem",margin:"0px"},children:"Could not be matched to a lock or project"}),e.jsx("ul",{style:{padding:0,marginLeft:20},children:h.map((s,l)=>e.jsx("li",{style:{marginBottom:4},children:e.jsx(k,{style:{color:"#99c2e5",textDecoration:"none"},onClick:()=>{d(s.id)},children:s.evidenceNotes})},l))})]}),g.length>0&&e.jsxs(j.Fragment,{children:[e.jsx(D,{style:{fontWeight:500,fontSize:"1.0rem",lineHeight:"1.25rem",margin:"0px"},children:"Missing or invalid URLs"}),e.jsx("ul",{style:{padding:0,marginLeft:20},children:g.map((s,l)=>e.jsx("li",{style:{marginBottom:4},children:e.jsx(k,{style:{color:"#99c2e5",textDecoration:"none"},onClick:()=>{d(s.id)},children:s.matchLockName})},l))})]}),r.length>0&&e.jsxs(j.Fragment,{children:[e.jsx(D,{style:{fontWeight:500,fontSize:"1.0rem",lineHeight:"1.25rem",margin:"0px"},children:"Duplicated by another entry"}),e.jsx("ul",{style:{padding:0,marginLeft:20},children:r.map((s,l)=>e.jsxs("li",{style:{marginBottom:4},children:[s.evidenceNotes," is a duplicate of ",e.jsx(k,{style:{color:"#99c2e5",textDecoration:"none"},onClick:()=>{d(s.supersedingEntryId)},children:s.supersedingLockName})]},l))})]}),u.length>0&&e.jsxs(j.Fragment,{children:[e.jsx(D,{style:{fontWeight:500,fontSize:"1.0rem",lineHeight:"1.25rem",margin:"0px"},children:"Upgraded by another lock"}),e.jsx("ul",{style:{padding:0,marginLeft:20},children:u.map((s,l)=>e.jsxs("li",{style:{marginBottom:4},children:[s.evidenceNotes," is upgraded by ",e.jsx(k,{style:{color:"#99c2e5",textDecoration:"none"},onClick:()=>{d(s.supersedingEntryId)},children:s.supersedingLockName})]},l))})]})]})})]})}function Ue({profile:o,owner:t}){var f;const{userId:i}=ce(),{user:a}=c.useContext(de),n=(f=o.displayName)==null?void 0:f.replace(/\s/g,"_"),{cardDanPoints:p,cardBBCount:m,cardEligibleDan:d,cardNextDanPoints:x,cardNextDanLocks:h}=c.useContext(W),g=pe(),r=c.useCallback(()=>{g("/profile/scorecard/upgrades")},[g]),u={1:"st",2:"nd",3:"rd"},b=u[[d]]?d+u[[d]]:d+"th",s=c.useCallback(async()=>{const y=`@LPUBeltBot request ${b} Dan https://lpubelts.com/#/profile/${i||(a==null?void 0:a.uid)}/scorecard?name=${n}`;await navigator.clipboard.writeText(y),xe("Request copied to clipboard. Take it over to #belt-requests!")},[b,n,a==null?void 0:a.uid,i]),l=o.blackBeltAwardedAt>0&&d===1?"DAN":"Eligible for Dan";return e.jsxs("div",{style:{display:"flex"},children:[e.jsxs("div",{style:{textAlign:"right",padding:"10px 12px 18px 0px",flexGrow:1},children:[e.jsxs("div",{style:{fontWeight:700,marginBottom:6},children:[l," ",e.jsx("span",{style:{fontSize:"1.8rem",lineHeight:"1rem"},children:d})]}),e.jsxs("div",{style:{marginBottom:5},children:["Dan Points ",e.jsx("strong",{children:p})]}),e.jsxs("div",{style:{marginBottom:5},children:["Black Belt Locks ",e.jsx("strong",{children:m})]}),e.jsxs("div",{style:{fontSize:"0.85rem"},children:[x," point",x!==1&&"s"," and ",h," BB lock",h!==1&&"s"," to next Dan"]}),e.jsxs("div",{style:{margin:"10px 0px",fontSize:"0.85rem"},children:[d>1&&t&&e.jsxs("span",{children:[e.jsx(k,{onClick:s,style:{color:"#99c2e5",cursor:"pointer"},children:"Copy Request"})," • "]}),e.jsx(k,{onClick:r,style:{color:"#99c2e5",cursor:"pointer"},children:"Upgrades list"})]})]}),e.jsx("div",{style:{textAlign:"right"},children:e.jsx(Te,{})})]})}export{Me as I,Ue as S,$e as a};
