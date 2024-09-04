import{a1 as p,a2 as E,r as i,J as L,v as P,j as e,x as m,I as $,t as b,R as H,S as J,ae as Q,U as X}from"./index-07cc147a.js";import{u as Y}from"./usePageTitle-95e9b685.js";import{u as Z}from"./useWindowSize-62c06cd0.js";import{C as w,d as U,F as ee}from"./FieldValue-81f6842a.js";import{S as B}from"./SystemMessage-b9f260a0.js";import{d as se}from"./Launch-c83f3e3b.js";import{T as x}from"./TextField-ec5fd189.js";import{L as I}from"./Link-e3b8b465.js";import{A as N,a as F,b as G,C as te}from"./AccordionSummary-e16f5c07.js";import{A as le}from"./AccordionActions-09ed896e.js";import{T as R,a as A}from"./ToggleButtonGroup-92ee16f1.js";import"./useDocumentTitle-60b9123e.js";import"./Select-12835ac0.js";p.extend(E);function ie({message:a,temp:s,setTemp:t,updated:o,setUpdated:l}){var k,S;const{updateSystemMessage:j}=i.useContext(L),y=i.useCallback(async()=>{const n=p().utc().format();t({...s,modified:n}),await j(s),P("Message changes saved."),l(!1)},[t,l,s,j]),u=i.useCallback(()=>{o&&(t(a),l(!1))},[o,t,a,l]),c=i.useCallback(n=>{t({...s,[n]:!s[n]}),l(!0)},[t,l,s]),h=o?"#fff":"#555",C=o?"#e15c07":"#555",r=((k=s.linkDestination)==null?void 0:k.length)>0?"#fff":"#666";return e.jsxs("div",{style:{display:"block",width:"100%"},children:[e.jsxs("div",{style:{display:"flex",marginBottom:10},children:[e.jsxs(x,{select:!0,style:{width:280},id:"messageType",label:"Message Type",value:s.messageType,size:"small",margin:"dense",color:"secondary",onChange:n=>{t({...s,messageType:n.target.value}),l(!0)},children:[e.jsx(m,{value:"Good News",children:"Good News"}),e.jsx(m,{value:"Info",children:"Info"}),e.jsx(m,{value:"Alert",children:"Alert"}),e.jsx(m,{value:"Neutral",children:"Neutral"})]}),e.jsx(x,{id:"priority",label:"Priority",value:s.priority,size:"small",margin:"dense",color:"secondary",onChange:n=>{t({...s,priority:n.target.value}),l(!0)},style:{marginLeft:10}}),e.jsx(x,{id:"description",label:"Description",value:s.description,fullWidth:!0,size:"small",margin:"dense",color:"secondary",onChange:n=>{t({...s,description:n.target.value}),l(!0)},style:{marginLeft:10}})]}),e.jsx(x,{id:"messageHeadline",label:"Headline",value:s.messageHeadline,fullWidth:!0,size:"small",margin:"dense",color:"secondary",onChange:n=>{t({...s,messageHeadline:n.target.value}),l(!0)},style:{marginBottom:10}}),e.jsx(x,{id:"messageText",label:"Message Text",value:s.messageText,multiline:!0,rows:3,fullWidth:!0,size:"small",margin:"dense",color:"secondary",onChange:n=>{t({...s,messageText:n.target.value}),l(!0)},style:{marginBottom:10}}),e.jsxs("div",{style:{display:"flex",marginBottom:10},children:[e.jsx(x,{id:"linkText",label:"Link Text",value:s.linkText,size:"small",margin:"dense",color:"secondary",onChange:n=>{t({...s,linkText:n.target.value}),l(!0)}}),e.jsx(x,{id:"linkDestination",label:"Link Destination",value:s.linkDestination,fullWidth:!0,size:"small",margin:"dense",color:"secondary",onChange:n=>{t({...s,linkDestination:n.target.value}),l(!0)},style:{marginLeft:10}}),e.jsx($,{disabled:((S=s.linkDestination)==null?void 0:S.length)===0,children:e.jsx("a",{href:"https://lpubelts.com/#"+s.linkDestination,target:"_blank",rel:"noreferrer",children:e.jsx(se,{style:{fontSize:"large",color:r}})})})]}),e.jsxs("div",{style:{display:"flex",marginBottom:10},children:[e.jsx(x,{id:"pageIds",label:"Page Ids",value:s.pageIds,size:"small",margin:"dense",color:"secondary",onChange:n=>{const f=n.target.value.split(",");t({...s,pageIds:f}),l(!0)},style:{marginLeft:0,width:"50%"}}),e.jsx(x,{id:"excludePageIds",label:"Exclude Page Ids",value:s.excludePageIds,size:"small",margin:"dense",color:"secondary",onChange:n=>{const f=n.target.value.split(",");t({...s,excludePageIds:f}),l(!0)},style:{marginLeft:10,width:"49%"}})]}),e.jsxs("div",{style:{display:"flex",fontSize:"1rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",width:250},children:[e.jsx(w,{checked:s.targetAdminOnly,color:"secondary",onChange:()=>{c("targetAdminOnly")}}),e.jsx(I,{style:{color:"#fff"},onClick:()=>{c("targetAdminOnly")},children:"Target Admin Only"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx(w,{checked:s.targetCollectionUsersOnly,color:"secondary",onChange:()=>{c("targetCollectionUsersOnly")}}),e.jsx(I,{style:{color:"#fff"},onClick:()=>{c("targetCollectionUsersOnly")},children:"Target Collection Users Only"})]})]}),e.jsxs("div",{style:{display:"flex",fontSize:"1rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",width:250},children:[e.jsx(w,{checked:s.targetLoggedIn,color:"secondary",onChange:()=>{c("targetLoggedIn")}}),e.jsx(I,{style:{color:"#fff"},onClick:()=>{c("targetLoggedIn")},children:"Target Logged In Only"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx(w,{checked:s.targetAnonymousNotOK,color:"secondary",onChange:()=>{c("targetAnonymousNotOK")}}),e.jsx(I,{style:{color:"#fff"},onClick:()=>{c("targetAnonymousNotOK")},children:"Target Anonymous NOT ok"})]})]}),e.jsxs("div",{style:{display:"flex",fontSize:"1rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",width:250},children:[e.jsx(w,{checked:s.targetBlackBeltsOnly,color:"secondary",onChange:()=>{c("targetBlackBeltsOnly")}}),e.jsx(I,{style:{color:"#fff"},onClick:()=>{c("targetBlackBeltsOnly")},children:"Target Black Belts Only"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx(w,{checked:s.noDismiss,color:"secondary",onChange:()=>{c("noDismiss")}}),e.jsx(I,{style:{color:"#fff"},onClick:()=>{c("noDismiss")},children:"No Dismiss Button"})]})]}),e.jsx(x,{id:"targetUserIds",label:"Target User Ids",value:s.targetUserIds||"",fullWidth:!0,size:"small",margin:"dense",color:"secondary",onChange:n=>{const f=n.target.value.split(",");console.log("idArray",f),t({...s,pageIds:f}),l(!0)}}),e.jsxs("div",{style:{width:"100%",textAlign:"right",padding:"0px 12px 8px 0px"},children:[e.jsx(b,{style:{marginRight:10,color:C},onClick:u,disabled:!o,children:"Cancel"}),e.jsx(b,{style:{marginRight:0,color:h},onClick:y,disabled:!o,children:"Save"})]})]})}p.extend(E);function ne({message:a,expanded:s,onExpand:t,setControlsExpanded:o}){const{id:l,description:j,pageIds:y}=a,{updateSystemMessageStatus:u}=i.useContext(L),[c,h]=i.useState(!1),C=i.useRef(null),[r,k]=i.useState({...a}),[S,n]=i.useState(!1);i.useEffect(()=>{if(s&&C&&!c){const v=window.innerWidth<=600?70:74;h(!0),setTimeout(()=>{window.scrollTo({left:0,top:C.current.offsetTop-v,behavior:s?"auto":"smooth"})},s?0:100)}else s||h(!1)},[s,a,c]);const f=i.useCallback((g,v)=>{t&&t(v?a.id:!1)},[a.id,t]),T=i.useCallback(g=>{g.preventDefault(),g.stopPropagation();const v=p().utc().format();k({...r,status:g.target.value,modified:v}),u(l,g.target.value,v)},[l,r,u]),M={width:760,marginLeft:"auto",marginRight:"auto"},O=r.status==="archived"?.4:r.status==="completed"||r.status==="pending"?.8:1;return e.jsxs(N,{expanded:s,onChange:f,style:M,ref:C,children:[e.jsx(F,{expandIcon:e.jsx(U,{}),children:e.jsxs("div",{style:{display:"block",width:680,opacity:O},children:[e.jsxs("div",{style:{margin:"2px 0px 2px 4px",width:"100%",display:"flex",placeItems:"center"},children:[e.jsxs("div",{style:{fontWeight:500,fontSize:"1.2rem",lineHeight:1.25,marginBottom:"4px",flexGrow:1},children:[j," ",e.jsxs("span",{style:{fontWeight:400,color:"#bbb",fontSize:"1rem"},children:["(",l,")"]}),e.jsx("br",{}),e.jsx("span",{style:{fontWeight:400,color:"#bbb",fontSize:"0.93rem"},children:y.join(", ")})]}),e.jsx("div",{style:{fontWeight:400,color:"#bbb",fontSize:"1rem"},children:e.jsx(ee,{name:"Priority",value:r.priority,headerStyle:{color:"rgba(255, 255, 255, 0.7)",fontSize:"0.73rem"},textStyle:{color:"#fff",marginTop:"10px",fontWeight:700},style:{height:40,margin:"8px 0px 4px 0px"}})}),e.jsxs(x,{select:!0,variant:"standard",style:{width:150,fontWeight:700,marginLeft:30},sx:{".MuiInputBase-root":{fontWeight:700,paddingLeft:"5px"}},id:"status",label:"Status",value:r.status,size:"small",margin:"dense",color:"secondary",onChange:g=>{g.preventDefault(),g.stopPropagation(),T(g)},onClick:g=>{g.preventDefault(),g.stopPropagation()},children:[e.jsx(m,{value:"active",children:"Active"}),e.jsx(m,{value:"pending",children:"Pending"}),e.jsx(m,{value:"completed",children:"Completed"}),e.jsx(m,{value:"archived",children:"Archived"})]})]}),r.status!=="archived"&&e.jsx(B,{override:r})]},r.id)}),s&&e.jsxs(H.Fragment,{children:[e.jsx(G,{sx:{padding:"8px 16px 0px 16px"},children:e.jsxs("div",{style:{display:"block"},children:[r.status==="archived"&&e.jsx(B,{override:r}),e.jsx(J,{direction:"row",alignItems:"flex-start",style:{flexGrow:1},children:e.jsx(ie,{message:a,temp:r,setTemp:k,updated:S,setUpdated:n,setControlsExpanded:o})})]})}),e.jsx(le,{disableSpacing:!0})]})]})}const W=H.memo(ne,(a,s)=>{const t=Object.keys(a.message),o=Object.keys(s.message);if(t.length!==o.length)return!1;for(let l=0;l<t.length;l++)if(t[l]!==o[l]||a.message[t[l]]!==s.message[o[l]])return!1;return a.expanded===s.expanded&&a.onExpand===s.onExpand});function ae(){const[a,s]=i.useState("*"),[t,o]=i.useState(!1),l=i.useCallback(()=>{o(!t)},[t]),j={id:"007",status:"active",description:"placeholder",messageType:"Placeholder",linkText:"OK",priority:0,messageHeadline:"No Matching Messages.",messageText:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",noDismiss:!0,textColor:"#555"};return e.jsxs("div",{style:{textAlign:"center",width:760,marginLeft:"auto",marginRight:"auto",marginBottom:20},children:[t&&e.jsxs(te,{in:t,syle:{height:"auto"},children:[e.jsx(B,{overridePageId:a,placeholder:j}),e.jsx(x,{select:!0,style:{width:280,marginBottom:10},id:"pageId",label:"Page",value:a,size:"small",margin:"dense",color:"info",onChange:y=>{s(y.target.value)},children:re.map((y,u)=>e.jsx(m,{value:y,children:y},u))})]}),e.jsx("div",{style:{width:760,marginLeft:"auto",marginRight:"auto"},children:e.jsxs("div",{style:{width:"100%",textAlign:"center"},children:[!t&&e.jsx(b,{variant:"outlined",color:"info",size:"small",style:{lineHeight:"1rem"},onClick:()=>l(),children:"Preview"}),t&&e.jsx(b,{variant:"outlined",color:"info",size:"small",style:{lineHeight:"1rem"},onClick:()=>l(),children:"Close Preview"})]})})]})}const re=[...new Set(Q.reduce((a,s)=>{const t=s.path.replace("/:userId","");return a.push(t),s.children&&s.children.map(o=>{const l=o.path.replace("/:userId","");a.push(l)}),a},[]))].sort();function Se(){Y("System Message Admin");const{user:a}=i.useContext(X),{getAllSystemMessages:s,removeDismissedMessages:t}=i.useContext(L),[o,l]=i.useState([]),[j,y]=i.useState(null),[u,c]=i.useState(!1),[h,C]=i.useState("status"),[r,k]=i.useState("recent");i.useEffect(()=>{s().then(d=>l(d))},[s]);const S=i.useMemo(()=>o.filter(d=>r==="all"||r==="active"&&d.status==="active"?!0:r==="recent"&&["active","pending","completed"].includes(d.status)),[o,r]),n=i.useMemo(()=>S.sort((d,z)=>{const D=["active","pending","completed","archived"];return h==="priority"?z.priority-d.priority:h==="status"?D.indexOf(d.status)-D.indexOf(z.status)||p(z.modified).valueOf()-p(d.modified).valueOf():p(z.modified).valueOf()-p(d.modified).valueOf()}),[S,h]),f=i.useDeferredValue(j),T=i.useCallback(d=>{y(d)},[]),M=i.useCallback(d=>{C(d)},[]),O=i.useCallback(d=>{k(d)},[]),g=i.useCallback(()=>{c(!u)},[u]),v=i.useCallback(async()=>{await t(a==null?void 0:a.uid),P("Dismissed messages cleared.")},[t,a]),{width:K}=Z(),_=K<560?"8px 8px 32px 8px":"24px 24px 32px 24px",q={margin:"0px 0px 20px 0px",width:"100%",textAlign:"center",color:"#fff"},V={id:i.useMemo(()=>Math.floor(Math.random()*4294967296).toString(16),[]),status:"pending",description:"new message",messageType:"Neutral",priority:0,messageHeadline:"Hello!",messageText:"",pageIds:[],excludePageIds:[],targetAdminOnly:!0,targetLoggedIn:!1,targetBlackBeltsOnly:!1,noDismiss:!1,targetAnonymousNotOK:!1,targetCollectionUsersOnly:!1,targetUserIds:!1};return e.jsxs("div",{style:{minWidth:"320px",maxWidth:900,height:"100%",padding:_,backgroundColor:"#292929",marginLeft:"auto",marginRight:"auto",fontSize:"1.5rem",lineHeight:.8},children:[e.jsxs("div",{style:q,children:["System Message Admin",e.jsx("br",{})]}),e.jsx(ae,{}),e.jsxs("div",{style:{width:760,marginLeft:"auto",marginRight:"auto",marginBottom:20,display:"flex"},children:[e.jsxs("div",{style:{},children:[e.jsx("span",{style:{fontSize:".7rem",marginRight:5},children:"SORT"}),e.jsxs(R,{style:{height:26,marginTop:10},children:[e.jsx(A,{selected:h==="modified"||!h,style:{padding:7},value:"name",onClick:()=>M("modified"),children:"Modified"}),e.jsx(A,{selected:h==="priority",style:{padding:7},value:"lock",onClick:()=>M("priority"),children:"Priority"}),e.jsx(A,{selected:h==="status",style:{padding:7},value:"lock",onClick:()=>M("status"),children:"Status"})]})]}),e.jsxs("div",{style:{textAlign:"right",flexGrow:1},children:[e.jsx("span",{style:{fontSize:".7rem",marginRight:5},children:"FILTER"}),e.jsxs(R,{style:{height:26,marginTop:10},children:[e.jsx(A,{selected:r==="active",style:{padding:7},value:"name",onClick:()=>O("active"),children:"Active"}),e.jsx(A,{selected:r==="recent",style:{padding:7},value:"lock",onClick:()=>O("recent"),children:"Recent"}),e.jsx(A,{selected:r==="all",style:{padding:7},value:"lock",onClick:()=>O("all"),children:"All"})]})]})]}),e.jsxs(N,{expanded:u,disableGutters:!1,style:{width:760,marginLeft:"auto",marginRight:"auto"},children:[e.jsxs(F,{children:[e.jsx("div",{children:e.jsx(b,{variant:"outlined",color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:()=>v(),children:"Clear My Dismissed"})}),e.jsxs("div",{style:{width:"100%",textAlign:"right"},children:[!u&&e.jsx(b,{variant:"outlined",color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:()=>g(),children:"New Message"}),u&&e.jsx(b,{variant:"outlined",color:"warning",size:"small",style:{lineHeight:"1rem"},onClick:()=>g(),children:"Cancel New Message"})]})]}),e.jsx(G,{style:{backgroundColor:"#333",padding:0},children:u&&e.jsx(W,{message:V,expanded:!0})})]}),n.map(d=>e.jsx(W,{message:d,onExpand:T,expanded:d.id===f,setControlsExpanded:c},d.id))]})}export{Se as default};
