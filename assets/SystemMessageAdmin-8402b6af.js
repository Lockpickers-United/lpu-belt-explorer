import{d as p,a7 as P,r as n,D as L,H,j as e,aa as j,I as J,B as S,R as N,e as T,W as Q,am as X,A as Y,u as Z}from"./index-a89c4977.js";import{u as U}from"./usePageTitle-79dbb429.js";import{d as ee,F as se}from"./FieldValue-c30ae55a.js";import{d as te}from"./Launch-066de9f4.js";import{T as u}from"./TextField-096c22fe.js";import{C as w}from"./Checkbox-6a5b2fd8.js";import{L as I}from"./Link-8d133c4d.js";import{A as F,a as G,b as K,C as le}from"./AccordionSummary-c20bcfba.js";import{A as ie}from"./AccordionActions-a401ec6a.js";import{T as W,a as A}from"./ToggleButtonGroup-ce72776a.js";import"./useDocumentTitle-06aa4919.js";import"./Select-c934e749.js";p.extend(P);function ne({message:a,temp:s,setTemp:t,updated:d,setUpdated:l}){var r,b;const{updateSystemMessage:y}=n.useContext(L),x=n.useCallback(async()=>{const i=p().utc().format();t({...s,modified:i}),await y(s),H("Message changes saved."),l(!1)},[t,l,s,y]),f=n.useCallback(()=>{d&&(t(a),l(!1))},[d,t,a,l]),o=n.useCallback(i=>{t({...s,[i]:!s[i]}),l(!0)},[t,l,s]),C=d?"#fff":"#555",h=d?"#e15c07":"#555",k=((r=s.linkDestination)==null?void 0:r.length)>0?"#fff":"#666";return e.jsxs("div",{style:{display:"block",width:"100%"},children:[e.jsxs("div",{style:{display:"flex",marginBottom:10},children:[e.jsxs(u,{select:!0,style:{width:280},id:"messageType",label:"Message Type",value:s.messageType,size:"small",margin:"dense",color:"secondary",onChange:i=>{t({...s,messageType:i.target.value}),l(!0)},children:[e.jsx(j,{value:"Good News",children:"Good News"}),e.jsx(j,{value:"Info",children:"Info"}),e.jsx(j,{value:"Alert",children:"Alert"}),e.jsx(j,{value:"Neutral",children:"Neutral"})]}),e.jsx(u,{id:"priority",label:"Priority",value:s.priority,size:"small",margin:"dense",color:"secondary",onChange:i=>{t({...s,priority:i.target.value}),l(!0)},style:{marginLeft:10}}),e.jsx(u,{id:"description",label:"Description",value:s.description,fullWidth:!0,size:"small",margin:"dense",color:"secondary",onChange:i=>{t({...s,description:i.target.value}),l(!0)},style:{marginLeft:10}})]}),e.jsx(u,{id:"messageHeadline",label:"Headline",value:s.messageHeadline,fullWidth:!0,size:"small",margin:"dense",color:"secondary",onChange:i=>{t({...s,messageHeadline:i.target.value}),l(!0)},style:{marginBottom:10}}),e.jsx(u,{id:"messageText",label:"Message Text",value:s.messageText,multiline:!0,rows:3,fullWidth:!0,size:"small",margin:"dense",color:"secondary",onChange:i=>{t({...s,messageText:i.target.value}),l(!0)},style:{marginBottom:10}}),e.jsxs("div",{style:{display:"flex",marginBottom:10},children:[e.jsx(u,{id:"linkText",label:"Link Text",value:s.linkText,size:"small",margin:"dense",color:"secondary",onChange:i=>{t({...s,linkText:i.target.value}),l(!0)}}),e.jsx(u,{id:"linkDestination",label:"Link Destination",value:s.linkDestination,fullWidth:!0,size:"small",margin:"dense",color:"secondary",onChange:i=>{t({...s,linkDestination:i.target.value}),l(!0)},style:{marginLeft:10}}),e.jsx(J,{disabled:((b=s.linkDestination)==null?void 0:b.length)===0,children:e.jsx("a",{href:"https://lpubelts.com/#"+s.linkDestination,target:"_blank",rel:"noreferrer",children:e.jsx(te,{style:{fontSize:"large",color:k}})})})]}),e.jsxs("div",{style:{display:"flex",marginBottom:10},children:[e.jsx(u,{id:"pageIds",label:"Page Ids",value:s.pageIds,size:"small",margin:"dense",color:"secondary",onChange:i=>{const m=i.target.value.split(",");t({...s,pageIds:m}),l(!0)},style:{marginLeft:0,width:"50%"}}),e.jsx(u,{id:"excludePageIds",label:"Exclude Page Ids",value:s.excludePageIds,size:"small",margin:"dense",color:"secondary",onChange:i=>{const m=i.target.value.split(",");t({...s,excludePageIds:m}),l(!0)},style:{marginLeft:10,width:"49%"}})]}),e.jsxs("div",{style:{display:"flex",fontSize:"1rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",width:250},children:[e.jsx(w,{checked:s.targetAdminOnly,color:"secondary",onChange:()=>{o("targetAdminOnly")}}),e.jsx(I,{style:{color:"#fff"},onClick:()=>{o("targetAdminOnly")},children:"Target Admin Only"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx(w,{checked:s.targetCollectionUsersOnly,color:"secondary",onChange:()=>{o("targetCollectionUsersOnly")}}),e.jsx(I,{style:{color:"#fff"},onClick:()=>{o("targetCollectionUsersOnly")},children:"Target Collection Users Only"})]})]}),e.jsxs("div",{style:{display:"flex",fontSize:"1rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",width:250},children:[e.jsx(w,{checked:s.targetLoggedIn,color:"secondary",onChange:()=>{o("targetLoggedIn")}}),e.jsx(I,{style:{color:"#fff"},onClick:()=>{o("targetLoggedIn")},children:"Target Logged In Only"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx(w,{checked:s.targetAnonymousNotOK,color:"secondary",onChange:()=>{o("targetAnonymousNotOK")}}),e.jsx(I,{style:{color:"#fff"},onClick:()=>{o("targetAnonymousNotOK")},children:"Target Anonymous NOT ok"})]})]}),e.jsxs("div",{style:{display:"flex",fontSize:"1rem"},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",width:250},children:[e.jsx(w,{checked:s.targetBlackBeltsOnly,color:"secondary",onChange:()=>{o("targetBlackBeltsOnly")}}),e.jsx(I,{style:{color:"#fff"},onClick:()=>{o("targetBlackBeltsOnly")},children:"Target Black Belts Only"})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[e.jsx(w,{checked:s.noDismiss,color:"secondary",onChange:()=>{o("noDismiss")}}),e.jsx(I,{style:{color:"#fff"},onClick:()=>{o("noDismiss")},children:"No Dismiss Button"})]})]}),e.jsxs("div",{style:{display:"flex",fontSize:"1rem"},children:[e.jsx(u,{id:"minVersion",label:"Minimum Version",value:s.minVersion||"",size:"small",margin:"dense",color:"secondary",onChange:i=>{t({...s,minVersion:i.target.value}),l(!0)},style:{width:350,marginRight:20}}),e.jsx(u,{id:"targetUserIds",label:"Target User Ids",value:s.targetUserIds||"",fullWidth:!0,size:"small",margin:"dense",color:"secondary",onChange:i=>{const m=i.target.value.split(",");t({...s,pageIds:m}),l(!0)}})]}),e.jsxs("div",{style:{width:"100%",textAlign:"right",padding:"0px 12px 8px 0px"},children:[e.jsxs("span",{style:{fontSize:"0.9rem",marginRight:100},children:["ID: ",s==null?void 0:s.id]}),e.jsx(S,{style:{marginRight:10,color:h},onClick:f,disabled:!d,children:"Cancel"}),e.jsx(S,{style:{marginRight:0,color:C},onClick:x,disabled:!d,children:"Save"})]})]})}p.extend(P);function ae({message:a,expanded:s,onExpand:t,setControlsExpanded:d}){const{id:l,dbId:y,description:x,pageIds:f}=a,{updateSystemMessageStatus:o}=n.useContext(L),[C,h]=n.useState(!1),k=n.useRef(null),[r,b]=n.useState({...a}),[i,m]=n.useState(!1);n.useEffect(()=>{if(s&&k&&!C){const v=window.innerWidth<=600?70:74;h(!0),setTimeout(()=>{window.scrollTo({left:0,top:k.current.offsetTop-v,behavior:s?"auto":"smooth"})},s?0:100)}else s||h(!1)},[s,a,C]);const B=n.useCallback((g,v)=>{t&&t(v?a.id:!1)},[a.id,t]),D=n.useCallback(g=>{g.preventDefault(),g.stopPropagation();const v=p().utc().format();b({...r,status:g.target.value,modified:v}),o(y,g.target.value,v)},[y,r,o]),M={width:760,marginLeft:"auto",marginRight:"auto"},z=r.status==="archived"?.4:r.status==="completed"||r.status==="pending"?.8:1;return e.jsxs(F,{expanded:s,onChange:B,style:M,ref:k,children:[e.jsx(G,{expandIcon:e.jsx(ee,{}),children:e.jsxs("div",{style:{display:"block",width:680,opacity:z},children:[e.jsxs("div",{style:{margin:"2px 0px 2px 4px",width:"100%",display:"flex",placeItems:"center"},children:[e.jsxs("div",{style:{fontWeight:500,fontSize:"1.2rem",lineHeight:1.25,marginBottom:"4px",flexGrow:1},children:[x," ",e.jsxs("span",{style:{fontWeight:400,color:"#bbb",fontSize:"1rem"},children:["(",l,")"]}),e.jsx("br",{}),e.jsx("span",{style:{fontWeight:400,color:"#bbb",fontSize:"0.93rem"},children:f==null?void 0:f.join(", ")})]}),e.jsx("div",{style:{fontWeight:400,color:"#bbb",fontSize:"1rem"},children:e.jsx(se,{name:"Priority",value:r.priority,headerStyle:{color:"rgba(255, 255, 255, 0.7)",fontSize:"0.73rem"},textStyle:{color:"#fff",marginTop:"10px",fontWeight:700},style:{height:40,margin:"8px 0px 4px 0px"}})}),e.jsxs(u,{select:!0,variant:"standard",style:{width:150,fontWeight:700,marginLeft:30},sx:{".MuiInputBase-root":{fontWeight:700,paddingLeft:"5px"}},id:"status",label:"Status",value:r.status,size:"small",margin:"dense",color:"secondary",onChange:g=>{g.preventDefault(),g.stopPropagation(),D(g)},onClick:g=>{g.preventDefault(),g.stopPropagation()},children:[e.jsx(j,{value:"active",children:"Active"}),e.jsx(j,{value:"pending",children:"Pending"}),e.jsx(j,{value:"completed",children:"Completed"}),e.jsx(j,{value:"archived",children:"Archived"})]})]}),r.status!=="archived"&&e.jsx(T,{override:r})]},r.id)}),s&&e.jsxs(N.Fragment,{children:[e.jsx(K,{sx:{padding:"8px 16px 0px 16px"},children:e.jsxs("div",{style:{display:"block"},children:[r.status==="archived"&&e.jsx(T,{override:r}),e.jsx(Q,{direction:"row",alignItems:"flex-start",style:{flexGrow:1},children:e.jsx(ne,{message:a,temp:r,setTemp:b,updated:i,setUpdated:m,setControlsExpanded:d})})]})}),e.jsx(ie,{disableSpacing:!0})]})]})}const E=N.memo(ae,(a,s)=>{const t=Object.keys(a.message),d=Object.keys(s.message);if(t.length!==d.length)return!1;for(let l=0;l<t.length;l++)if(t[l]!==d[l]||a.message[t[l]]!==s.message[d[l]])return!1;return a.expanded===s.expanded&&a.onExpand===s.onExpand});function re(){const[a,s]=n.useState("*"),[t,d]=n.useState(!1),l=n.useCallback(()=>{d(!t)},[t]),y={id:"007",status:"active",description:"placeholder",messageType:"Placeholder",linkText:"OK",priority:0,messageHeadline:"No Matching Messages.",messageText:"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",noDismiss:!0,textColor:"#555"};return e.jsxs("div",{style:{textAlign:"center",width:760,marginLeft:"auto",marginRight:"auto",marginBottom:20},children:[t&&e.jsxs(le,{in:t,syle:{height:"auto"},children:[e.jsx(T,{overridePageId:a,placeholder:y}),e.jsx(u,{select:!0,style:{width:280,marginBottom:10},id:"pageId",label:"Page",value:a,size:"small",margin:"dense",color:"info",onChange:x=>{s(x.target.value)},children:oe.map((x,f)=>e.jsx(j,{value:x,children:x},f))})]}),e.jsx("div",{style:{width:760,marginLeft:"auto",marginRight:"auto"},children:e.jsxs("div",{style:{width:"100%",textAlign:"center"},children:[!t&&e.jsx(S,{variant:"outlined",color:"info",size:"small",style:{lineHeight:"1rem"},onClick:()=>l(),children:"Preview"}),t&&e.jsx(S,{variant:"outlined",color:"info",size:"small",style:{lineHeight:"1rem"},onClick:()=>l(),children:"Close Preview"})]})})]})}const oe=[...new Set(X.reduce((a,s)=>{const t=s.path.replace("/:userId","");return a.push(t),s.children&&s.children.map(d=>{const l=d.path.replace("/:userId","");a.push(l)}),a},[]))].sort();function be(){U("System Message Admin");const{user:a}=n.useContext(Y),{systemMessages:s,getAllSystemMessages:t,removeDismissedMessages:d}=n.useContext(L),[l,y]=n.useState([]),[x,f]=n.useState(null),[o,C]=n.useState(!1),[h,k]=n.useState("status"),[r,b]=n.useState("recent");n.useEffect(()=>{t().then(c=>y(c))},[t,s]);const i=n.useMemo(()=>l.filter(c=>r==="all"||r==="active"&&c.status==="active"?!0:r==="recent"&&["active","pending","completed"].includes(c.status)),[l,r]),m=n.useMemo(()=>i==null?void 0:i.sort((c,O)=>{const R=["active","pending","completed","archived"];return h==="priority"?O.priority-c.priority:h==="status"?R.indexOf(c.status)-R.indexOf(O.status)||p(O.modified).valueOf()-p(c.modified).valueOf():p(O.modified).valueOf()-p(c.modified).valueOf()}),[i,h]),B=n.useDeferredValue(x),D=n.useCallback(c=>{f(c)},[]),M=n.useCallback(c=>{k(c)},[]),z=n.useCallback(c=>{b(c)},[]),g=n.useCallback(()=>{C(!o)},[o]),v=n.useCallback(async()=>{await d(a==null?void 0:a.uid),H("Dismissed messages cleared.")},[d,a]),{width:V}=Z(),_=V<560?"8px 8px 32px 8px":"24px 24px 32px 24px",q={margin:"0px 0px 20px 0px",width:"100%",textAlign:"center",color:"#fff"},$={id:n.useMemo(()=>Math.floor(Math.random()*4294967296).toString(16),[]),status:"pending",description:"new message",messageType:"Neutral",priority:0,messageHeadline:"Hello!",messageText:"",pageIds:[],excludePageIds:[],targetAdminOnly:!0,targetLoggedIn:!1,targetBlackBeltsOnly:!1,noDismiss:!1,targetAnonymousNotOK:!1,targetCollectionUsersOnly:!1,targetUserIds:!1};return e.jsxs("div",{style:{minWidth:"320px",maxWidth:900,height:"100%",padding:_,backgroundColor:"#292929",marginLeft:"auto",marginRight:"auto",fontSize:"1.5rem",lineHeight:.8},children:[e.jsxs("div",{style:q,children:["System Message Admin",e.jsx("br",{})]}),e.jsx(re,{}),e.jsxs("div",{style:{width:760,marginLeft:"auto",marginRight:"auto",marginBottom:20,display:"flex"},children:[e.jsxs("div",{style:{},children:[e.jsx("span",{style:{fontSize:".7rem",marginRight:5},children:"SORT"}),e.jsxs(W,{style:{height:26,marginTop:10},children:[e.jsx(A,{selected:h==="modified"||!h,style:{padding:7},value:"name",onClick:()=>M("modified"),children:"Modified"}),e.jsx(A,{selected:h==="priority",style:{padding:7},value:"lock",onClick:()=>M("priority"),children:"Priority"}),e.jsx(A,{selected:h==="status",style:{padding:7},value:"lock",onClick:()=>M("status"),children:"Status"})]})]}),e.jsxs("div",{style:{textAlign:"right",flexGrow:1},children:[e.jsx("span",{style:{fontSize:".7rem",marginRight:5},children:"FILTER"}),e.jsxs(W,{style:{height:26,marginTop:10},children:[e.jsx(A,{selected:r==="active",style:{padding:7},value:"name",onClick:()=>z("active"),children:"Active"}),e.jsx(A,{selected:r==="recent",style:{padding:7},value:"lock",onClick:()=>z("recent"),children:"Recent"}),e.jsx(A,{selected:r==="all",style:{padding:7},value:"lock",onClick:()=>z("all"),children:"All"})]})]})]}),e.jsxs(F,{expanded:o,disableGutters:!1,style:{width:760,marginLeft:"auto",marginRight:"auto"},children:[e.jsxs(G,{children:[e.jsx("div",{children:e.jsx(S,{variant:"outlined",color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:()=>v(),children:"Clear My Dismissed"})}),e.jsxs("div",{style:{width:"100%",textAlign:"right"},children:[!o&&e.jsx(S,{variant:"outlined",color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:()=>g(),children:"New Message"}),o&&e.jsx(S,{variant:"outlined",color:"info",size:"small",style:{lineHeight:"1rem"},onClick:()=>g(),children:"Close New Message"})]})]}),e.jsx(K,{style:{backgroundColor:"#333",padding:0},children:o&&e.jsx(E,{message:$,expanded:!0})})]}),m.map(c=>e.jsx(E,{message:c,onExpand:D,expanded:c.id===B,setControlsExpanded:C},c.id))]})}export{be as default};
