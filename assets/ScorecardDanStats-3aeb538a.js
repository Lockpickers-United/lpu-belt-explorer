import{j as e,r as d,aD as z,aa as R,J as F,K as W,aE as H,R as j,I as E,aF as M,ah as O,H as I,al as q,A as _,u as G,g as U,aG as $,G as J}from"./index-9a6ce20d.js";import{p as K}from"./chartDefaults-9fc07b21.js";import{u as Y}from"./useWindowSize-be23f983.js";import{B as Q}from"./nivo-bar.es-3a837ad2.js";import{F as V,D as A}from"./filterFields-9dd8683f.js";import{d as X}from"./BeltIcon-194ea6fe.js";import{e as P}from"./entryName-775d9a94.js";import{L as u}from"./Link-84dc1764.js";function Z({beltData:a}){const{width:p}=Y(),c=p<=560,s=c?190:175,h=c?-90:-45,n=c?{top:0,right:0,bottom:80,left:15}:{top:0,right:0,bottom:60,left:15},o=["#d5d5d5","#d8d801","#ed7d01","#389700","#0090de","#634b9f","#9d5918","#ba0303","#000","#000","#000","#000","#000","#3e3e3e","#a5a93c","#a5a93c","#a5a93c","#a5a93c","#a5a93c","#a5a93c"],m=["#000","#000","#000","#ddd","#ddd","#ddd","#ddd","#ddd","#ddd","#ddd","#ddd","#ddd","#ddd","#aaa","#000","#000","#000","#000","#000","#000"];return e.jsx("div",{style:{height:s,padding:"0px 0px 0px 0px",width:"100%"},children:e.jsx(Q,{data:a,margin:n,padding:.15,colors:r=>o[r.index%o.length],animate:!0,axisBottom:{tickRotation:h},axisLeft:null,enableGridY:!1,theme:K,isInteractive:!1,enableLabel:!0,label:r=>r.data.count,labelSkipWidth:12,labelSkipHeight:12,labelTextColor:r=>m[r.index%m.length]})},"bar")}function he({entries:a}){const p=d.useMemo(()=>{const s=a.filter(n=>!n.awardType).map(({belt:n})=>(n&&n.includes("Project"),n)).reduce((n,o)=>(n[o]||(n[o]=0),n[o]++,n),{});return s.Project=a.reduce((n,o)=>o.simpleBelt==="Project"?n+1:n,0),(s.Project>0?z:R).map(n=>({id:n,label:n,count:s[n]||0,value:s[n]||0}))},[a]);return e.jsx("div",{style:{width:"100%",marginTop:"0px"},children:e.jsx(Z,{beltData:p})})}var w={},ee=W;Object.defineProperty(w,"__esModule",{value:!0});var T=w.default=void 0,te=ee(F()),ne=e;T=w.default=(0,te.default)((0,ne.jsx)("path",{d:"M11 18h2v-2h-2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8m0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4"}),"HelpOutline");function se(){const{setFilters:a}=d.useContext(V),{cardActivity:p,getEntryFromId:c}=d.useContext(A),[s,h]=d.useState(!1),n=d.useCallback(()=>{h(!0)},[]),o=d.useCallback(()=>{h(!1)},[]),m=d.useCallback(t=>{a({id:t}),h(!1)},[a]),r=p.map(t=>{const i=t.exceptionId,b=i?p.find(D=>D.id===i):{},B=b?c(b.matchId):{},L=B?P(B,"short"):"",f=t.matchId?c(t.matchId):null,C=f?P(f,"short"):"";return{...t,supersedingEntryId:i,supersedingLockName:L,matchLockName:C}}),x=r.filter(t=>t.exceptionType==="nomatch"),k=r.filter(t=>t.exceptionType==="badlink"&&!H(t.matchId)),g=r.filter(t=>t.exceptionType==="duplicate"),y=r.filter(t=>t.exceptionType==="upgraded");if(x.length+k.length+g.length+y.length>0)return e.jsxs(j.Fragment,{children:[e.jsx(E,{onClick:n,style:{marginRight:0},children:e.jsx(T,{fontSize:"small"})}),e.jsx(M,{sx:{color:"#fff",textAlign:"left",height:700,zIndex:t=>t.zIndex.drawer+1},open:s,onClick:o,children:e.jsxs("div",{style:{maxWidth:600,fontSize:"0.95rem",padding:15},children:[e.jsxs("div",{style:{display:"flex",marginBottom:10,placeItems:"center"},children:[e.jsx("div",{style:{fontWeight:600,fontSize:"1.3rem",flexGrow:1},children:"Some documentation ineligible for Dan Points"}),e.jsx(E,{onClick:o,children:e.jsx(X,{sx:{cursor:"pointer"}})})]}),e.jsx("div",{style:{marginBottom:20},children:"Some of the entries in your Scorecard are not eligible for Dan Points. Reasons for this may include: the link in your documentation is missing or not valid, we could not find a lock matching your entry, you have multiple entries for the same lock, or an entry may have been replaced by an upgrade of the same lock. Locks ranked below Blue Belt are never eligible for Dan Points."}),x.length>0&&e.jsxs(j.Fragment,{children:[e.jsx(O,{style:{marginBottom:20}}),e.jsx(I,{style:{fontWeight:500,fontSize:"1.0rem",lineHeight:"1.25rem",margin:"0px"},children:"Could not be matched to a lock or project"}),e.jsx("ul",{style:{padding:0,marginLeft:20},children:x.map((t,i)=>e.jsx("li",{style:{marginBottom:4},children:e.jsx(u,{style:{color:"#99c2e5",textDecoration:"none"},onClick:()=>{m(t.id)},children:t.evidenceNotes})},i))})]}),k.length>0&&e.jsxs(j.Fragment,{children:[e.jsx(I,{style:{fontWeight:500,fontSize:"1.0rem",lineHeight:"1.25rem",margin:"0px"},children:"Missing or invalid URLs"}),e.jsx("ul",{style:{padding:0,marginLeft:20},children:k.map((t,i)=>e.jsx("li",{style:{marginBottom:4},children:e.jsx(u,{style:{color:"#99c2e5",textDecoration:"none"},onClick:()=>{m(t.id)},children:t.matchLockName})},i))})]}),g.length>0&&e.jsxs(j.Fragment,{children:[e.jsx(I,{style:{fontWeight:500,fontSize:"1.0rem",lineHeight:"1.25rem",margin:"0px"},children:"Duplicated by another entry"}),e.jsx("ul",{style:{padding:0,marginLeft:20},children:g.map((t,i)=>e.jsxs("li",{style:{marginBottom:4},children:[t.evidenceNotes," is a duplicate of ",e.jsx(u,{style:{color:"#99c2e5",textDecoration:"none"},onClick:()=>{m(t.supersedingEntryId)},children:t.supersedingLockName})]},i))})]}),y.length>0&&e.jsxs(j.Fragment,{children:[e.jsx(I,{style:{fontWeight:500,fontSize:"1.0rem",lineHeight:"1.25rem",margin:"0px"},children:"Upgraded by another lock"}),e.jsx("ul",{style:{padding:0,marginLeft:20},children:y.map((t,i)=>e.jsxs("li",{style:{marginBottom:4},children:[t.evidenceNotes," is upgraded by ",e.jsx(u,{style:{color:"#99c2e5",textDecoration:"none"},onClick:()=>{m(t.supersedingEntryId)},children:t.supersedingLockName})]},i))})]})]})})]})}function xe({profile:a,owner:p}){var D;const{userId:c}=q(),{user:s}=d.useContext(_),h=(D=a==null?void 0:a.displayName)==null?void 0:D.replace(/\s/g,"_"),n=G(),o=d.useCallback(()=>{n("/profile/scorecard/upgrades")},[n]),{cardDanPoints:m,cardBBCount:r,cardEligibleDan:x,cardNextDanPoints:k,cardNextDanLocks:g,cardActivity:y}=d.useContext(A),v=y.reduce((l,N)=>{const S=U(N.matchId);return l=(S==null?void 0:S.awardType)==="dan"?Math.max(l,S.rank):l,l},0),t=Math.max(x,v),i=$.find(l=>l.level===t+1),b=x<=v?"DAN":"Eligible for Dan",B=d.useCallback(async()=>{const l=`@LPUBeltBot request ${C(x)} Dan https://lpubelts.com/#/profile/${c||(s==null?void 0:s.uid)}/scorecard?name=${h}`;await navigator.clipboard.writeText(l),J("Request copied to clipboard. Take it over to #belt-requests!")},[x,h,s==null?void 0:s.uid,c]),L=Math.max(0,i.bbLocks-r),f=Math.max(0,i.points-m);return e.jsxs("div",{style:{display:"flex"},children:[e.jsxs("div",{style:{textAlign:"right",padding:"10px 0px 18px 0px",flexGrow:1},children:[e.jsxs("div",{style:{fontWeight:700,marginBottom:6},children:[b," ",e.jsx("span",{style:{fontSize:"1.8rem",lineHeight:"1rem"},children:t})]}),e.jsxs("div",{style:{marginBottom:5},children:["Dan Points ",e.jsx("strong",{children:m})]}),e.jsxs("div",{style:{marginBottom:5},children:["Black Belt Locks ",e.jsx("strong",{children:r})]}),e.jsxs("div",{style:{fontSize:"0.85rem"},children:[f," point",f!==1&&"s"," and ",L," BB lock",g!==1&&"s"," to ",C(t+1)," Dan"]}),e.jsxs("div",{style:{margin:"10px 0px",fontSize:"0.85rem"},children:[x>v&&p&&e.jsxs("span",{children:[e.jsx(u,{onClick:B,style:{color:"#99c2e5",cursor:"pointer"},children:"Copy Request Text"})," • "]}),e.jsx(u,{onClick:o,style:{color:"#99c2e5",cursor:"pointer"},children:"Upgrades list"})]})]}),e.jsx("div",{style:{textAlign:"right",minWidth:20},children:e.jsx(se,{})})]});function C(l){const N=["st","nd","rd","th"];return l+""+N[Math.min(4,l)-1]}}export{he as I,xe as S};
