import{r as a,H as j,j as e,G as N,I as Q,aV as ne,R as E,ab as le,K as de,M as ce,Y as ue,B as q,A as X,d as K,ae as me,u as V,U as he,b as pe,D as ge,bI as fe,N as xe}from"./index-a9bb63ec.js";import{u as je}from"./usePageTitle-137b65b1.js";import{F as B}from"./FieldValue-48d892ef.js";import{L as ke}from"./LockImageGallery-739208f1.js";import{e as Z}from"./entryName-c9bd8236.js";import{d as ve}from"./ExpandMore-b99713e8.js";import{D as W,F as Se,a as Ce}from"./DataContext-15e88187.js";import{d as be}from"./Link-0369a866.js";import{S as F,D as ye}from"./SelectBox-87de1c3d.js";import{r as qe,a as ee}from"./rankingRequestData-d3ef79e5.js";import{B as we}from"./BeltStripe-88832f32.js";import{d as Re}from"./AddCircle-c3495ca4.js";import{L as Be}from"./LoadingDisplayWhite-71f0660c.js";import{D as $}from"./Dialog-c73b906d.js";import{T}from"./TextField-00366ac4.js";import{A as Te,a as Ee,b as Le}from"./AccordionSummary-bc30e4e8.js";import{A as De}from"./AccordionActions-4aee9d03.js";import"./index-4e2db8de.js";import{S as Ae}from"./SearchBox-655c00e2.js";import{V as ze}from"./ViewFilterButtons-580355d8.js";import{a as Me}from"./sortFields-5471f00e.js";import{C as Ue}from"./ChoiceButtonGroup-621074e8.js";import{L as Ie}from"./Link-102537c0.js";import{a as Fe}from"./filterFields-a3cade8c.js";import"./useDocumentTitle-422dc0b1.js";import"./ImageGallery-2cf2151b.js";import"./ImageViewer-bb644fb2.js";import"./Launch-4bedab4b.js";import"./LinearProgress-0202bc0f.js";import"./DialogContent-84d5cc61.js";import"./ImageListItem-4e4a5b84.js";import"./Select-0e2bc70a.js";import"./CircularProgress-301a53be.js";import"./Collapse-0fe136f8.js";import"./Box-e3eba86e.js";import"./Chip-04b2588f.js";import"./Search-6c0aa5bd.js";import"./Badge-09b0d65d.js";import"./LockListContext-1df5dbc5.js";import"./ToggleButtonGroup-b4edf8d8.js";function $e({entry:t,nameType:o}){const s=a.useCallback(async()=>{const l=Z(t,o).replace(/[\s/]/g,"_").replace(/\W/g,""),r=`${window.location.origin}/#/rankingrequests/view?id=${t.id}&name=${l}`;await navigator.clipboard.writeText(r),j("Link copied to clipboard.")},[t,o]);return e.jsx(N,{title:"Copy Link to Request",arrow:!0,disableFocusListener:!0,children:e.jsx(Q,{onClick:s,children:e.jsx(be,{})})})}function Ne({requestMod:t,handleClick:o}){return t?e.jsx(N,{title:"Edit Request",arrow:!0,disableFocusListener:!0,children:e.jsx(Q,{onClick:o,style:{height:38,width:38,marginTop:"auto",marginBottom:"auto"},children:e.jsx(ne,{style:{height:20,width:20}})})}):null}function Ve({entry:t,requestMod:o,form:s,setForm:n,setUpdated:l}){const[r,i]=a.useState(!1),d=le.filter(p=>!["Unranked","Project"].includes(p));a.useEffect(()=>{setTimeout(()=>{n({make:t.makeModels?t.makeModels[0].make:"",model:t.makeModels?t.makeModels[0].model:"",requestStatus:t.requestStatus,belt:t.belt})},100)},[t,n]);const u=a.useCallback(p=>{const{name:g,value:x}=p.target;g==="requestStatus"&&x==="Ranked"?i(!0):g==="requestStatus"&&(i(!1),delete s.belt),n({...s,[g]:x}),l(!0)},[s,n,l]);return e.jsxs(E.Fragment,{children:[o&&e.jsxs("div",{style:{marginTop:10},children:[e.jsx("div",{style:{fontSize:"1.1rem",fontWeight:500,marginBottom:5},children:"Status"}),e.jsx(F,{changeHandler:u,name:"requestStatus",form:{},optionsList:qe,multiple:!1,value:s.requestStatus||t.requestStatus,defaultValue:s.requestStatus||t.requestStatus,size:"small",width:200})]}),o&&(s.belt||r)&&e.jsx("div",{style:{marginTop:8},children:e.jsx(F,{changeHandler:u,name:"belt",form:s,optionsList:d,multiple:!1,defaultValue:t.belt||"",size:"small",width:200,label:"belt"})})]})}async function We({entry:t,user:o}){const s=new AbortController,n=setTimeout(()=>{s.abort()},1e4),l=Math.floor(Math.random()*1e6);try{const r=await o.getIdToken(),i=await fetch(`${ee}/update-request?${l}`,{method:"POST",headers:{Authorization:"Bearer "+r,"Content-Type":"application/json"},body:JSON.stringify({entry:t}),signal:s.signal});if(clearTimeout(n),i.ok)return j("Request updated"),await i.json().catch(()=>({}));{let d="Error updating request";try{const u=await i.json();console.log("errorData",u),d=u.message||d,j(`Error updating request: ${d}`,{variant:"error",autoHideDuration:3e3})}catch{}return{response:{data:{status:i.status,message:d}}}}}catch(r){throw clearTimeout(n),console.error("Error during authentication or server request:",Pe(r)),j("Error updating request",{variant:"error",autoHideDuration:3e3}),r}}const Pe=t=>{if(console.log(t),t.response.data&&typeof t.response.data=="string"){const o=t.message.match(/code (\d+)/)[1],s=t.response.data.match(/<pre>([\s\S]*?)<\/pre>/)[1];return{response:{data:{status:o,message:s}}}}else return t};var P={},He=ce;Object.defineProperty(P,"__esModule",{value:!0});var te=P.default=void 0,Oe=He(de()),_e=e;te=P.default=(0,Oe.default)((0,_e.jsx)("path",{d:"M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8"}),"AddCircleOutline");async function Ge({newVote:t,user:o}){const s=new AbortController,n=setTimeout(()=>{s.abort()},1e4),l=Math.floor(Math.random()*1e6);try{const r=await o.getIdToken(),i=await fetch(`${ee}/request-vote?${l}`,{method:"POST",headers:{Authorization:"Bearer "+r,"Content-Type":"application/json"},body:JSON.stringify({newVote:t}),signal:s.signal});if(clearTimeout(n),i.ok)return j("Votes updated"),await i.json().catch(()=>({}));{let d="Error updating request";try{const u=await i.json();console.log("errorData",u),d=u.message||d,j(`Error updating votes: ${d}`,{variant:"error",autoHideDuration:3e3})}catch{}return{response:{data:{status:i.status,message:d}}}}}catch(r){throw clearTimeout(n),console.error("Error during authentication or server request:",r),j("Error updating request",{variant:"error",autoHideDuration:3e3}),r}}function Ye({user:t,entry:o}){const[s,n]=a.useState(!1),[l,r]=a.useState(!1),[i,d]=a.useState({}),[u,p]=a.useState(!1),{profile:g}=a.useContext(W),{requestedBy:x=[]}=o,f=x.find(h=>h.userId===t.uid&&h.owner)||!1,k=x.find(h=>h.userId===t.uid)||!1,w=x.length>1?x.length:"",c=x.length>1?"2px solid #444":"",S=f?"#999":"#fff",M=k?e.jsx(Re,{fontSize:"small",style:{color:S}}):e.jsx(te,{fontSize:"small"}),L=f?"You requested this lock":k?"Click to remove your vote":"Add Your Vote",U=f||s?"default":"pointer",C=a.useCallback(h=>{const{name:R,value:A}=h.target;d({...i,[R]:A}),p(i.discordUsername&&i.discordUsername.length>0||i.redditUsername&&i.redditUsername.length>0)},[i]),D=a.useCallback(h=>{h.preventDefault(),h.stopPropagation(),d({}),p(!1),r(!1)},[]),v=a.useCallback(async()=>{if(s)return;if(f){j("You requested this lock",{variant:"info",autoHideDuration:1e3});return}n(!0);const h={...i,entryId:o.id,owner:!1,userId:t.uid,displayName:g.displayName};try{await Ge({newVote:h,user:t})}catch(R){console.error("Error updating vote:",R)}finally{n(!1),d({}),p(!1),r(!1)}},[o.id,i,f,s,g.displayName,t]),b=a.useCallback(h=>{if(h.preventDefault(),h.stopPropagation(),!s){if(f){j("You requested this lock",{variant:"info",autoHideDuration:3e3});return}k?v().then():r(!0)}},[v,k,f,s]);return e.jsxs(E.Fragment,{children:[e.jsx(N,{title:L,arrow:!0,disableFocusListener:!0,children:s?e.jsx("div",{onClick:b,style:{padding:"4px 0px",marginTop:"auto",marginBottom:"auto",alignItems:"center",justifyContent:"right"},children:e.jsx(Be,{})}):e.jsx("div",{onClick:b,style:{border:c,borderRadius:18,padding:"4px 10px",marginTop:"auto",marginBottom:"auto",display:"flex",alignItems:"center",justifyContent:"right",fontWeight:600,cursor:U},children:e.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[w>1&&e.jsx("span",{style:{marginLeft:5,marginRight:7},children:w}),M]})})}),e.jsx($,{open:l,onClose:D,componentsProps:{backdrop:{style:{backgroundColor:"#000",opacity:.7}}},children:e.jsxs("div",{style:{backgroundColor:"#444",marginLeft:"auto",marginRight:"auto",maxWidth:340,padding:20},onClick:h=>h.stopPropagation(),children:[e.jsx("div",{style:{fontSize:"1.3rem",fontWeight:500,marginBottom:10},children:"Upvote Request"}),e.jsx("div",{style:{marginBottom:20,fontSize:"0.95rem",lineHeight:"1.3rem"},children:"A lot of work goes into ranking locks, and we use these votes to prioritize which locks are considered. Please only vote for locks you are specifically interested in."}),e.jsxs("div",{style:{flexGrow:1},children:[e.jsxs("div",{style:{fontSize:"1.1rem"},children:["Notes ",e.jsx("span",{style:{color:"#aaa"},children:"(optional)"})]}),e.jsx(T,{type:"text",name:"notes",multiline:!0,fullWidth:!0,rows:3,color:"info",style:{},value:i.notes||"",maxLength:1200,id:"notes",onChange:C})]}),e.jsxs("div",{style:{marginTop:20},children:[e.jsx("div",{style:{fontSize:"1.1rem",fontWeight:500},children:"Contact Info"}),e.jsxs("div",{style:{},children:[e.jsx("div",{style:{fontSize:"1rem"},children:"Discord Username"}),e.jsx(T,{type:"text",name:"discordUsername",style:{width:200},onChange:C,value:i.discordUsername||"",color:"info",size:"small"})]}),e.jsxs("div",{style:{marginTop:5},children:[e.jsx("div",{style:{fontSize:"1rem"},children:"AND/OR Reddit Username"}),e.jsx(T,{type:"text",name:"redditUsername",style:{width:200},onChange:C,value:i.redditUsername||"",color:"info",size:"small"})]})]}),e.jsxs("div",{style:{marginTop:15},children:[e.jsxs("div",{style:{fontSize:"1rem"},children:["Your current belt ",e.jsx("span",{style:{color:"#aaa"},children:"(optional)"})]}),e.jsx(F,{changeHandler:C,name:"userBelt",form:i,optionsList:["Unranked",...ue],multiple:!1,defaultValue:"",size:"small",width:200})]}),e.jsxs("div",{style:{width:"100%",textAlign:"center",marginTop:25},children:[e.jsx(q,{onClick:D,variant:"contained",color:"success",style:{marginRight:20,backgroundColor:"#999"},children:"CANCEL"}),e.jsx(q,{onClick:v,variant:"contained",color:"success",disabled:!u,children:"SAVE"})]})]})})]})}function Je({upvote:t,voteNum:o}){const{notes:s,discordUsername:n,redditUsername:l,userBelt:r}=t,i=[n&&`@${n}`,l&&`u/${l.replace(/^\/*u\//,"")}`].filter(Boolean).join(" • "),d=r&&` (${r})`,u=(s==null?void 0:s.length)>0?`> ${s}`:"";return e.jsxs("div",{style:{marginBottom:10},children:[o+1,". ",e.jsx("strong",{children:i}),d," ",u]})}function Ke({entry:t,expanded:o,onExpand:s,requestMod:n}){var G,Y;const{user:l}=a.useContext(X),r=a.useRef(null),{expandAll:i}=a.useContext(W),[d,u]=a.useState(!1),[p,g]=a.useState(!1),[x,f]=a.useState(!1),[k,w]=a.useState(!1),[c,S]=a.useState({make:t.makeModels?t.makeModels[0].make:"",model:t.makeModels?t.makeModels[0].model:"",requestStatus:t.requestStatus,belt:t.belt}),{requestedBy:M=[]}=t,L=M.filter(m=>!m.owner);a.useEffect(()=>{setTimeout(()=>{S({make:t.makeModels?t.makeModels[0].make:"",model:t.makeModels?t.makeModels[0].model:"",requestStatus:t.requestStatus,belt:t.belt})},100)},[t,S]);const U=a.useCallback((m,y)=>{s&&s(y?t.id:!1)},[t.id,s]),C=a.useCallback(m=>{const{name:y,value:I}=m.target;S({...c,[y]:I}),w(!0)},[c]),D=a.useCallback(m=>{m.preventDefault(),m.stopPropagation(),g(!0)},[g]),v=a.useCallback(()=>{S({make:t.makeModels?t.makeModels[0].make:"",model:t.makeModels?t.makeModels[0].model:"",requestStatus:t.requestStatus,belt:t.belt}),g(!1),f(!1)},[t]),b=a.useCallback(async m=>{await We({entry:m,user:l}).then(()=>{v()})},[v,l]),h=a.useCallback(async()=>{const m={...t.originalEntry,requestStatus:"Deleted",lastUpdated:K().toISOString()};await b(m)},[t.originalEntry,b]),R=a.useCallback(async()=>{if(!k)return;c.requestStatus==="Deleted"&&f(!0);const m={...t.originalEntry,makeModels:[{make:c.make,model:c.model}],requestStatus:c.requestStatus||t.requestStatus,belt:c.belt||t.belt,lastUpdated:K().toISOString()};["Ranked","Deleted"].includes(m.requestStatus)||delete m.belt,c.requestStatus==="Deleted"?f(!0):await b(m)},[t,c,b,k]),A=a.useCallback(()=>{f(!1)},[f]);a.useEffect(()=>{if(o&&r&&!d&&!i){const y=window.innerWidth<=600?70:74,{id:I}=me.parse(location.search),J=I===t.id;u(!0),setTimeout(()=>{window.scrollTo({left:0,top:r.current.offsetTop-y,behavior:J?"auto":"smooth"})},J?0:100)}else o||u(!1)},[o,t,d,i]);const{discord:H,reddit:O}=t.usernames||{},se=[H&&`@${H}`,O&&`u/${O.replace(/^\/*u\//,"")}`].filter(Boolean).join(" • "),oe=t.userBelt?` (${t.userBelt})`:"",ae=t.belt&&t.belt!=="Unranked"?` (${t.belt})`:"",ie=!c.make||c.model.length<1||c.requestStatus==="Ranked"&&!c.belt,re={maxWidth:700,marginLeft:"auto",marginRight:"auto"},{flexStyle:z}=V(),_=t.requestStatus==="Declined"?.5:1;return e.jsxs(E.Fragment,{children:[e.jsxs(Te,{expanded:o,onChange:U,style:re,ref:r,children:[e.jsxs(Ee,{expandIcon:e.jsx(ve,{}),style:{cursor:"pointer"},children:[e.jsx(we,{value:t.belt}),e.jsx("div",{style:{display:z,width:"100%",alignItems:"center",opacity:_},children:e.jsxs("div",{style:{display:z,width:"100%",alignItems:"center",opacity:_},children:[e.jsx(he,{primary:Z(t),primaryTypographyProps:{fontWeight:500,fontSize:"1.1rem"},secondary:t.lockingMechanisms.join(", "),secondaryTypographyProps:{fontSize:"0.9rem"},style:{padding:"0px 0px 0px 10px"}}),e.jsx("div",{style:{display:"flex",alignItems:"center",justifyContent:"right",marginRight:10},children:t.requestStatus!=="Submitted"&&e.jsxs("span",{children:[t.requestStatus,ae]})})]})}),e.jsx(Ye,{user:l,entry:t}),e.jsx(Ne,{handleClick:D,requestMod:n})]}),o&&e.jsxs(Le,{sx:{padding:"0px 16px 0px 16px"},children:[e.jsx("div",{style:{display:z,width:"100%"},children:!!((G=t.notes)!=null&&G.length)&&e.jsx(B,{name:"Notes",value:t.notes,style:{marginRight:20}})}),e.jsxs("div",{style:{display:z,width:"100%",marginTop:15},children:[e.jsx(B,{name:"Requested By",value:se+oe,style:{marginRight:30},headerStyle:{color:"#aaa",fontSize:"0.9rem"}}),!!t.approximateBelt&&e.jsx(B,{name:"Suggested Belt",value:`${t.approximateBelt} Belt`,style:{marginRight:30},headerStyle:{color:"#aaa",fontSize:"0.9rem"}}),!!t.hazLocc&&e.jsx(B,{name:"Has Lock(s)",value:t.hazLocc,style:{marginRight:0},headerStyle:{color:"#aaa",fontSize:"0.9rem"}})]}),!!((Y=t.media)!=null&&Y.length)&&e.jsx("div",{style:{marginLeft:6},children:e.jsx(ke,{entry:t})}),L.length>0&&n&&e.jsx(B,{name:"Upvotes",style:{marginRight:20,marginTop:10},headerStyle:{color:"#bbb",fontSize:"1rem"},value:L.map((m,y)=>e.jsx(Je,{upvote:m,voteNum:y},m.userId))}),e.jsx(De,{children:e.jsx($e,{entry:t})})]})]}),e.jsx($,{open:p,onClose:v,componentsProps:{backdrop:{style:{backgroundColor:"#000",opacity:.7}}},children:e.jsxs("div",{style:{backgroundColor:"#444",marginLeft:"auto",marginRight:"auto",padding:30},children:[e.jsxs("div",{style:{fontSize:"1.3rem",fontWeight:500,marginBottom:20,textAlign:"center"},children:["Edit Request",e.jsx("br",{})]}),e.jsx("div",{style:{marginTop:0},children:e.jsx(Ve,{entry:t,requestMod:n,form:c,setForm:S,setShowEditRequest:g,setUpdated:w})}),e.jsxs("div",{style:{marginTop:10},children:[e.jsx("div",{style:{fontSize:"1.1rem",fontWeight:500,marginBottom:5},children:"Brand"}),e.jsx(T,{type:"text",name:"make",size:"small",style:{width:200},color:"info",onChange:C,value:c.make||"",error:c.make.length===0})]}),e.jsxs("div",{style:{marginTop:10},children:[e.jsx("div",{style:{fontSize:"1.1rem",fontWeight:500,marginBottom:5},children:"Model Name"}),e.jsx(T,{type:"text",name:"model",size:"small",style:{width:200},color:"info",onChange:C,value:c.model||"",error:c.model.length===0})]}),e.jsxs("div",{style:{width:"100%",textAlign:"center",marginTop:20},children:[e.jsx(q,{onClick:v,variant:"contained",color:"success",style:{marginRight:20,backgroundColor:"#999"},children:"CANCEL"}),e.jsx(q,{onClick:R,variant:"contained",color:"success",disabled:ie||!k,children:"SAVE"})]})]})}),e.jsx($,{open:x,onClose:A,componentsProps:{backdrop:{style:{backgroundColor:"#000",opacity:.5}}},children:e.jsxs("div",{style:{backgroundColor:"#444",marginLeft:"auto",marginRight:"auto",padding:40},children:[e.jsxs("div",{style:{fontSize:"1.3rem",fontWeight:500,marginBottom:20,textAlign:"center"},children:["Are you sure you want to delete?",e.jsx("br",{}),"Action cannot be undone.",e.jsx("br",{})]}),e.jsxs("div",{style:{width:"100%",textAlign:"center"},children:[e.jsx(q,{onClick:A,variant:"contained",color:"success",style:{marginRight:20,backgroundColor:"#999"},children:"CANCEL"}),e.jsx(q,{onClick:h,variant:"contained",color:"error",children:"DELETE"})]})]})})]})}function Qe({label:t,sortValues:o,resetAll:s}){const{isMobile:n}=V(),l=n?"block":"flex",r=n?{maxWidth:700,marginLeft:"auto",marginRight:"auto",padding:8}:{maxWidth:700,marginLeft:"auto",marginRight:"auto",padding:12};return e.jsxs("div",{style:{display:l,...r,backgroundColor:"#333",minHeight:72},children:[e.jsx("div",{style:{display:"flex",flexGrow:1,marginLeft:8},children:e.jsx(Ae,{label:t,keepOpen:!0})}),!!o&&e.jsx("div",{style:{margin:"12px 20px 0px 20px"},children:e.jsx(ze,{sortValues:o,resetAll:s})})]})}function Xe({requestMod:t}){const{visibleEntries:o=[],expandAll:s}=a.useContext(W),{filters:n}=a.useContext(Se),[l,r]=a.useState(n.id),i=a.useMemo(()=>[{label:"Request a Lock",page:"/rankingrequests/submit"},{label:"View Requests",page:"/rankingrequests/view"}],[]),d=pe(),u=a.useCallback(p=>{d(p.page)},[d]);return e.jsxs(E.Fragment,{children:[e.jsx("div",{style:{marginBottom:20,marginTop:1},children:e.jsx(Ue,{options:i,onChange:u,defaultValue:i[1].label})}),e.jsxs("div",{style:{maxWidth:720,padding:0,marginLeft:"auto",marginRight:"auto",marginTop:16,marginBottom:46,paddingLeft:8},children:[t&&e.jsx(Ie,{onClick:()=>console.log("visibleEntries",o),style:{color:"#444",cursor:"pointer",marginLeft:10},children:"LOG"}),e.jsx(Qe,{sortValues:Me,label:"Lock Requests",resetAll:!0}),o.map((p,g)=>e.jsx(Ke,{entry:p,expanded:p.id===l||!!s,onExpand:r,requestMod:t},g))]})]})}function $t(){je("View Ranking Requests");const{user:t,userClaims:o}=a.useContext(X),{lockCollection:s}=a.useContext(ge),n=(o==null?void 0:o.requestAdmin)||(o==null?void 0:o.admin),{isMobile:l}=V(),r=fe(),i=e.jsx(E.Fragment,{children:!l&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})});return e.jsx(Ce,{filterFields:Fe,children:e.jsxs(ye,{allEntries:r,profile:s,children:[e.jsx(xe,{title:"Ranking Requests",extras:i}),e.jsx(Xe,{user:t,requestMod:n})]})})}export{$t as default};
