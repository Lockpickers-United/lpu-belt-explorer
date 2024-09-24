import{R as b,r as d,a1 as M,j as e,ac as P,v as $,aa as q,K as I,am as z,an as D,ao as W,ap as U}from"./index-839bcaf3.js";import{u as Y}from"./useData-744262eb.js";import{D as w,e as _,a as G,s as K}from"./index-cb6c4728.js";import{a as S,b as x,c as J,d as O,T as Q,e as V}from"./TableRow-d1219fe0.js";import{L as N}from"./Link-40c7bf9f.js";import{N as X,E as Z}from"./ScorecardExportButton-ba7498f3.js";import{L as ee}from"./LoadingDisplay-4064fb5e.js";import{P as te}from"./ProfileNotFound-7a066bf0.js";import{a as oe,b as ne}from"./ScorecardListContext-c0d0e5bb.js";import"./mycollection-0ec86312.js";import"./useWindowSize-35499b3a.js";import"./Box-efa9858e.js";import"./download-3b961330.js";import"./ContentCopy-bb38a1d6.js";import"./LPU-c3fa7122.js";import"./LinearProgress-814988af.js";function re({evid:o}){const{getEntryFromId:l,getProjectEntryFromId:p}=d.useContext(w),g=l(o.matchId),f=p(o.matchId),s=g||f;let u=_(s);const t=o.points===1?"pt":"pts";let c=o.date?M(o.date).format("MM/DD/YY"):"(no date)";const m=o.link.substring(0,20),h=j=>{const k=window.open(j,"_blank","noopener,noreferrer");k&&(k.opener=null)},i="#fff",r="#333",n="0.9rem";return e.jsx(b.Fragment,{children:e.jsxs(S,{sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":{backgroundColor:"#eee"},"td, th":{}},children:[e.jsx(x,{sx:{textAlign:"left",fontSize:n,lineHeight:"1.1rem",padding:"8px",backgroundColor:i,color:r,fontWeight:600},component:"th",scope:"row",children:u}),e.jsx(x,{sx:{textAlign:"left",fontSize:n,lineHeight:"1.1rem",padding:"8px",backgroundColor:i,color:r},component:"th",scope:"row",children:s==null?void 0:s.version}),e.jsx(x,{sx:{textAlign:"left",fontSize:n,lineHeight:"1.1rem",padding:"8px",backgroundColor:i,color:r},component:"th",scope:"row",children:e.jsx("nobr",{children:s==null?void 0:s.belt})}),e.jsx(x,{sx:{textAlign:"left",fontSize:n,lineHeight:"1.1rem",padding:"8px",backgroundColor:i,color:r},component:"th",scope:"row",children:c}),e.jsx(x,{sx:{textAlign:"left",fontSize:n,lineHeight:"1.1rem",padding:"8px",backgroundColor:i,color:r},component:"th",scope:"row",children:e.jsx(N,{onClick:()=>h(o.link),children:m})}),e.jsx(x,{sx:{textAlign:"left",fontSize:n,lineHeight:"1.1rem",padding:"8px",backgroundColor:i,color:r},component:"th",scope:"row",children:o.modifier}),e.jsx(x,{sx:{textAlign:"left",fontSize:n,lineHeight:"1.1rem",padding:"8px",backgroundColor:i,color:r},component:"th",scope:"row",children:e.jsxs("nobr",{children:[e.jsxs("span",{style:{fontWeight:700},children:[o.points," "]}),e.jsx("span",{style:{color:"#666"},children:t})]})})]},o.id)})}const se=b.memo(re);function ie({profile:o}){var r;const{userId:l}=P(),{visibleEntries:p=[]}=d.useContext(w),g=p.filter(n=>n.points>0),f=[{id:"lock",name:"lock",align:"left"},{id:"version",name:"version",align:"left"},{id:"belt",name:"belt",align:"left"},{id:"date",name:"date",align:"left"},{id:"link",name:"link",align:"left"},{id:"modifier",name:"modifier",align:"left"},{id:"points",name:"points",align:"left"}],{cardDanPoints:s,cardBBCount:u,cardEligibleDan:t}=d.useContext(w),c={1:"st",2:"nd",3:"rd"},m=c[[t]]?t+c[[t]]:t+"th",h=(r=o.displayName)==null?void 0:r.replace(/\s/g,"_"),i=d.useCallback(async()=>{const n=`@LPUBeltBot request ${m} Dan https://lpubelts.com/#/profile/${l}/scorecard/no-tracking?name=${h}`;await navigator.clipboard.writeText(n),$("Request copied to clipboard. Take it over to #belt-requests!")},[m,h,l]);return e.jsxs("div",{style:{maxWidth:900,padding:0,backgroundColor:"#eee",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[e.jsxs("div",{style:{display:"flex",padding:8},children:[e.jsx("div",{style:{fontSize:"1.5rem",lineHeight:"1rem",flexGrow:1,marginRight:0},children:o.displayName}),e.jsxs("div",{style:{marginRight:25},children:["Dan Points ",e.jsx("strong",{children:s})]}),e.jsxs("div",{style:{marginRight:25},children:["Black Belt Locks ",e.jsx("strong",{children:u})]}),e.jsxs("div",{children:["Eligible for Dan ",e.jsx("span",{style:{fontSize:"1.7rem",lineHeight:"1rem"},children:t})]})]}),e.jsx("div",{style:{width:"100%",textAlign:"right",padding:8,marginBottom:10},children:e.jsx(N,{onClick:i,style:{color:"#99c2e5",cursor:"pointer"},children:"Copy Request"})}),p.length===0&&e.jsx(X,{}),e.jsxs("div",{children:[e.jsx(J,{id:"statsTable",style:{padding:"0px 0px 0px 4px",width:"100%",marginLeft:"auto",marginRight:"auto"},component:q,elevation:2,children:e.jsxs(O,{size:"small",children:[e.jsx(Q,{children:e.jsx(S,{children:f.map((n,j)=>e.jsx(x,{sx:{textAlign:n.align,fontSize:"1rem",lineHeight:"1.1rem",padding:"8px",backgroundColor:"#ddd",color:"#000"},component:"th",scope:"row",children:n.name},j+1))})}),e.jsx(V,{children:g.map(n=>e.jsx(se,{evid:n},n.id))})]})}),e.jsx("br",{})]})]})}function ve(){const{userId:o}=P(),{getProfile:l,getEvidence:p}=d.useContext(I),[g,f]=d.useState(!1),s=d.useCallback(()=>{f(!g)},[g]),u=d.useCallback(async()=>{try{const a=await l(o);if(a){const C=a.displayName?a.displayName.toLowerCase().endsWith("s")?`${a.displayName}'`:`${a.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${C} Scorecard`}const y=await p(o);return{profile:a,...z(y)}}catch(a){return console.error("Error loading profile and evidence.",a),null}},[o,l,p]),{data:t={},loading:c,error:m}=Y({loadFn:u}),h=t?t.profile:{},i=t?t.scoredEvidence:[],r=t?t.bbCount:0,n=t?t.danPoints:0,j=t?t.eligibleDan:0,k=t?t.nextDanPoints:0,E=t?t.nextDanLocks:0;if(c||m)return null;const R=b.createContext({toggleColorMode:()=>{}});function B({children:a}){const y=D({palette:{mode:"dark",secondary:{main:"#2d49bc"}}}),C=D({palette:{mode:"light"}}),[v,A]=d.useState("light"),L=b.useMemo(()=>({toggleColorMode:()=>{A(F=>F==="light"?"dark":"light")}}),[]),T=b.useMemo(()=>v==="light"?C:y,[y,C,v]),H=ae(T);return e.jsx(R.Provider,{value:L,children:e.jsxs(W,{theme:T,children:[e.jsx(U,{enableColorScheme:!0}),e.jsx("style",{children:H}),a]})})}return e.jsx(G,{filterFields:K,children:e.jsx(oe,{cardEvidence:i,cardBBCount:r,cardDanPoints:n,cardEligibleDan:j,cardNextDanPoints:k,cardNextDanLocks:E,children:e.jsx(ne,{children:e.jsxs(B,{children:[c&&e.jsx(ee,{}),!c&&t&&!m&&e.jsx(ie,{profile:h,adminAction:s}),!c&&(!t||m)&&e.jsx(te,{}),e.jsx("div",{style:{width:"100%",textAlign:"center",marginBottom:30},children:e.jsx(Z,{})})]})})})})}const ae=o=>{const l=o.palette.text.icon;return`
            body {
                background-color: ${o.palette.background.default};
                margin: 0;
                padding: 0;
            }
            
            a {
                color: ${l};
            }
            
            pre{ 
                white-space: pre-wrap; 
                word-break: break-word;
            }
            
            :root {
              color-scheme: dark;
              overflow-y: scroll;
            }
        `};export{ve as default};