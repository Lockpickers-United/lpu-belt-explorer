import{r as i,H as q,j as e,G as T,I as B,a2 as E,u as W,K as J,M as K,A as ne,D as U,R as S,aZ as oe,aA as re,W as D,B as ae,T as X,X as O,V as le,N as ce,F as de}from"./index-5b61f6bf.js";import{F as Z,D as pe,a as xe,b as me}from"./filterFields-9cd26100.js";import{u as ue}from"./usePageTitle-bb270e9e.js";import{R as fe}from"./RaffleDataProvider-a780698f.js";import{a as he,F as M,I as ge}from"./InlineFilterDisplay-6952b938.js";import{N as je}from"./ViewFilterButtons-04caf8eb.js";import{d as Q,F as R}from"./FieldValue-dbc6ee9d.js";import{d as ve}from"./Link-6a3703b9.js";import{d as ye}from"./ContentCopy-cd244383.js";import{a as _}from"./RaffleContext-c4acfbea.js";import{L as we}from"./LoadingDisplaySmall-73b99b29.js";import{A as Y,a as ee,b as te}from"./AccordionSummary-cb691cff.js";import{C as Ce}from"./Collapse-86cec5b6.js";import{M as H}from"./index-401201b9.js";import{r as N}from"./index-c9545cd3.js";import{A as be}from"./AccordionActions-37e89219.js";import{R as ke}from"./RaffleSearchBar-823afc49.js";import{r as Re}from"./sortFields-90296e28.js";import{r as Se}from"./rafl-7eb14271.js";import{u as Le}from"./useData-fe18848f.js";import{g as Fe}from"./dataUrls-02b67476.js";import{C as Pe,c as Ie,L as Te}from"./LoadingDisplay-8a07cdc2.js";import{R as Be}from"./RaffleHeader-ad1dbdc2.js";import{d as We}from"./Cached-e0d8304c.js";import{L as Ae}from"./Link-f764945d.js";import{R as De,A as Me}from"./AdminRoleButton-ebd48e23.js";import"./useDocumentTitle-3bbc9372.js";import"./ImageViewer-7e9935d6.js";import"./Launch-2be3ea23.js";import"./Dialog-f79bcbb5.js";import"./LinearProgress-2d38f15d.js";import"./DialogContent-255fd687.js";import"./Chip-37fc803a.js";import"./Select-b38978e9.js";import"./SearchBox-ff19cf03.js";import"./Box-a38be227.js";import"./Search-3f3d8f0a.js";import"./Badge-1e7e67cd.js";import"./TextField-c5ce3f5e.js";import"./LockListContext-d3ab7505.js";import"./entryName-fa899002.js";import"./ToggleButtonGroup-be8aa377.js";function Ee({entry:t}){const s=i.useCallback(async n=>{n.preventDefault(),n.stopPropagation();const o=t.title.replace(/[\s/]/g,"_").replace(/\W/g,""),l=`https://share.lpubelts.com/?id=${t.id}&name=${o}`;await navigator.clipboard.writeText(l),q("Link to RAFL pot copied to clipboard.")},[t]);return e.jsx(T,{title:"Copy Link to Pot",arrow:!0,disableFocusListener:!0,children:e.jsx(B,{onClick:s,style:{height:36,width:36},children:e.jsx(ve,{})})})}function _e({entry:t}){const[s,n]=E(),r=s.get("image"),o=i.useCallback(m=>{s.set("image",m+1),n(s)},[s,n]),l=i.useCallback(()=>{s.delete("image"),n(s)},[s,n]),c=i.useCallback(()=>V(r,t),[t,r]),a=i.useMemo(()=>r?+r-1:-1,[r]),p=V(a,t);return e.jsx(he,{media:t.media,openIndex:a,initiallyOpen:p,onOpenImage:o,onCloseImage:l,onBackButton:c,shareParams:{id:t.id,name:s.get("name")},columns:2})}const V=(t,s)=>/\d+/.test(t)&&!!s.media[t];function ze({entry:t}){const s=i.useCallback(async()=>{const n=t.title;await navigator.clipboard.writeText(n),q("Pot name copied to clipboard.")},[t]);return e.jsx(T,{title:"Copy RAFL pot name",arrow:!0,disableFocusListener:!0,children:e.jsx(B,{onClick:s,children:e.jsx(ye,{})})})}function Oe({entry:t}){const{live:s,raffleAdminRole:n}=i.useContext(_),r=s||n,{isMobile:o,flexStyle:l}=W(),c=o?28:30,a=o?"1.1rem":"1.3rem",p="1rem",m=0,f=o?"1.3rem":"1.4rem",x=o?"1.6rem":"1.8rem";return e.jsxs("div",{style:{display:"flex",alignItems:"center",width:"100%"},children:[r&&e.jsx("div",{style:{borderRadius:"50%",backgroundColor:"#fff",color:"#000",height:c,width:c,minWidth:c,marginTop:0,marginBottom:4,marginRight:12,display:"flex"},children:e.jsx("div",{style:{margin:"auto",paddingTop:0,paddingLeft:m,paddingRight:1,fontWeight:700,fontSize:a,lineHeight:p},children:t.potNumber})}),e.jsxs("div",{style:{display:l,flexGrow:1},children:[e.jsx("div",{style:{display:"flex",fontWeight:500,fontSize:f,lineHeight:x,marginTop:o?0:-3,flexGrow:1},children:t.title}),t.winner&&e.jsxs("div",{style:{display:"flex",fontSize:f,lineHeight:x,marginTop:o?8:-3,marginRight:10,fontWeight:400},children:["Winner: ",e.jsx("strong",{children:" mgsecure"})]})]})]})}var G={},Ge=K;Object.defineProperty(G,"__esModule",{value:!0});var z=G.default=void 0,$e=Ge(J()),He=e;z=G.default=(0,$e.default)((0,He.jsx)("path",{d:"M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"}),"Star");function Ne({id:t}){const{isLoggedIn:s}=i.useContext(ne),{lockCollection:n,addToLockCollection:r,removeFromLockCollection:o}=i.useContext(U),[l,c]=i.useState(()=>{}),a=!!l,{isMobile:p}=W(),[m,f]=i.useState(null),x="raffleWatchlist",j=i.useCallback(()=>!!n[x]&&n[x].includes(t),[t,n]),h=j()?"Remove from Watchlist":"Add to Watchlist",k=i.useCallback((d,F)=>async(P,C)=>{P.preventDefault(),P.stopPropagation(),f(d),C||!F?await r(d,t):await o(d,t),f(null)},[t,r,o]),v=i.useCallback(d=>{d.preventDefault(),d.stopPropagation(),c(d.currentTarget)},[]),y=i.useCallback(d=>{d.preventDefault(),d.stopPropagation(),c(null)},[]),w=36,L={marginTop:-2,marginRight:p?4:8,width:w,minWidth:w,height:w};return e.jsxs("div",{style:L,children:[s&&e.jsx("div",{style:{display:"flex",justifyItems:"left"},children:e.jsx(S.Fragment,{children:m===x?e.jsx("div",{style:{marginTop:1},children:e.jsx(we,{})}):e.jsx(T,{title:h,arrow:!0,disableFocusListener:!0,children:e.jsx(B,{onClick:k(x,j()),style:{color:j()?"#13e113":"#999",...L},children:e.jsx(z,{})},x)})},x)}),!s&&e.jsxs(S.Fragment,{children:[e.jsx(T,{title:h,arrow:!0,disableFocusListener:!0,children:e.jsx(B,{onClick:v,style:{color:j()?"#13e113":"#999",...L},children:e.jsx(z,{})},x)}),e.jsx(oe,{open:a,anchorEl:l,onClose:y,anchorOrigin:{vertical:"top",horizontal:"left"},children:e.jsx("div",{style:{display:"flex",padding:30,width:300,placeItems:"center"},onClick:y,children:e.jsxs("div",{children:[e.jsx("strong",{children:"Log in to keep a RAFL Watchlist!"}),e.jsx("br",{}),e.jsx("br",{}),e.jsx(re,{})]})})})]})]})}function Ve({entry:t,expanded:s,onExpand:n,single:r}){var P,C,b;const{live:o,raffleAdminRole:l}=i.useContext(_),c=o||l,{filters:a}=i.useContext(Z),p=!!a.shippingType||!!a.splitShipping,[m,f]=i.useState(!1),x={maxWidth:700,marginLeft:"auto",marginRight:"auto"},j=i.useRef(null),h=r==="2",k=t.tickets?new Intl.NumberFormat().format(t.tickets):"---";i.useEffect(()=>{if(s&&j&&!m){const u=window.innerWidth<=600?70:74;f(!0),setTimeout(()=>{window.scrollTo({left:0,top:j.current.offsetTop-u,behavior:s?"auto":"smooth"})},s?0:100)}else s||f(!1)},[s,t,m]);const v=i.useCallback((g,u)=>{n&&n(u?t.id:!1)},[t.id,n]),{isMobile:y,flexStyle:w}=W(),A=y?"12px 0px 8px 0px":"12px 0px 8px 8px",L=y?"0px 0px 18px 0px":"0px 0px 18px 8px",d=y?"0.95rem":"1.0rem",F=t.winner&&!s?.6:1;return e.jsxs(Y,{expanded:s,onChange:v,style:x,ref:j,children:[e.jsx(ee,{expandIcon:h?null:e.jsx(Q,{}),children:e.jsxs("div",{style:{display:"flex",alignItems:"center",flexGrow:1},children:[e.jsxs("div",{style:{display:"block",marginBottom:0,flexGrow:1},children:[e.jsx("div",{style:{display:"flex",width:"100%",alignItems:"center"},children:e.jsx("div",{style:{margin:A,display:"flex",flexGrow:1},children:e.jsx(Oe,{entry:t})})}),e.jsxs("div",{style:{margin:L,display:"flex"},children:[e.jsx("div",{style:{flexGrow:1,opacity:F},children:e.jsxs("div",{style:{marginRight:8,color:"#bbb",fontSize:d},children:["Contributed by  ",t.contributedBy.map((g,u)=>{const I=u<t.contributedBy.length-1?", ":"";return e.jsxs("span",{children:[e.jsx(M,{value:g,field:"contributedBy",mode:"text"}),I]},u)})]})}),c&&e.jsx(Ce,{in:!!t.donors,children:e.jsxs("div",{style:{marginRight:15,fontSize:d,textAlign:"right",display:w},children:[e.jsx("div",{children:e.jsxs("nobr",{children:["Donors: ",e.jsx("strong",{children:t.donors||"--"})]})}),e.jsx("div",{style:{marginLeft:8},children:e.jsxs("nobr",{children:["Tickets: ",e.jsx("strong",{children:k})]})})]})})]}),!h&&p&&e.jsxs("div",{style:{display:"flex",marginTop:6,opacity:F},children:[e.jsx("div",{style:{marginRight:10},children:e.jsx(R,{name:"Country",headerStyle:{marginBottom:4},value:t.country.map((g,u)=>{const I=u<t.country.length-1?", ":"";return e.jsxs("span",{children:[e.jsx(M,{value:g,field:"country",mode:"text"}),I]},u)})})}),e.jsx(R,{name:"Shipping Info",headerStyle:{marginBottom:4},value:t.shippingInfo})]}),e.jsx("div",{style:{margin:"12px 12px 8px 8px",fontSize:d,opacity:F},children:e.jsx(H,{rehypePlugins:[[N,{target:"_blank"}]],children:t.description})})]}),c&&e.jsx(Ne,{id:t.id})]})}),s&&e.jsxs(S.Fragment,{children:[e.jsxs(te,{sx:{padding:"0px 16px 0px 16px"},children:[e.jsx("div",{style:{display:w},children:e.jsx(D,{direction:"row",alignItems:"flex-start",style:{},children:!!((P=t.tags)!=null&&P.length)&&!h&&e.jsx(R,{name:"Tags",value:e.jsx(D,{direction:"row",spacing:0,sx:{flexWrap:"wrap"},children:t.tags.map((g,u)=>e.jsx(M,{value:g,field:"tags",mode:"simple"},u))}),headerStyle:{marginBottom:4}})})}),!h&&!p&&e.jsxs("div",{style:{display:"flex",marginTop:6},children:[e.jsx("div",{style:{marginRight:10},children:e.jsx(R,{name:"Country",headerStyle:{marginBottom:4},value:t.country.map((g,u)=>{const I=u<t.country.length-1?", ":"";return e.jsxs("span",{children:[e.jsx(M,{value:g,field:"country",mode:"text"}),I]},u)})})}),e.jsx(R,{name:"Shipping Info",headerStyle:{marginBottom:4},value:t.shippingInfo})]}),t.potContents&&e.jsx(D,{direction:"row",spacing:1,sx:{width:"100%",flexWrap:"wrap",marginTop:"4px"},children:e.jsx(R,{name:"Contents",textStyle:{fontSize:d},value:e.jsx(H,{rehypePlugins:[[N,{target:"_blank"}]],children:t.potContents})})}),!!((C=t.media)!=null&&C.length)&&e.jsx(R,{value:e.jsx(_e,{entry:t})}),!!((b=t.links)!=null&&b.length)&&e.jsx(R,{name:"Links",value:e.jsx(D,{direction:"row",spacing:1,sx:{flexWrap:"wrap"},children:t.links.map(({title:g,url:u},I)=>e.jsx(ae,{href:u,target:"_blank",rel:"noopener noreferrer",color:"secondary",variant:"outlined",sx:{textTransform:"none"},style:{margin:4},children:g},I))})}),e.jsx(X,{feature:"raflPot",id:t.id})]}),!h&&e.jsxs(be,{disableSpacing:!0,children:[e.jsx(ze,{entry:t}),c&&e.jsx(Ee,{entry:t})]})]})]})}const se=S.memo(Ve,(t,s)=>{const n=Object.keys(t.entry),r=Object.keys(s.entry);if(n.length!==r.length)return!1;for(let o=0;o<n.length;o++)if(n[o]!==r[o]||t.entry[n[o]]!==s.entry[r[o]])return!1;return t.expanded===s.expanded&&t.onExpand===s.onExpand});function qe(){const{isMobile:t}=W(),s=t?{maxWidth:700,marginLeft:"auto",marginRight:"auto",padding:8}:{maxWidth:700,marginLeft:"auto",marginRight:"auto",padding:12};return e.jsx("div",{style:{...s,backgroundColor:"#333",minHeight:72},children:e.jsxs("div",{style:{padding:"4px 4px 10px 4px"},children:[e.jsx("div",{style:{fontSize:"1.2rem",fontWeight:500,marginTop:1,marginBottom:7},children:"RAFL is coming soon!"}),"We will start accepting entries on January 1st. In the meantime, here's a preview of the pots that folks are developing. Please note that ",e.jsx("strong",{children:"all pots and contents are subject to change"})," until the raffle begins in January."]})})}function Je({profile:t}){const{filters:s}=i.useContext(Z),[n,r]=i.useState(s.id),{visibleEntries:o}=i.useContext(pe),l=i.useDeferredValue(n),c=i.useCallback(a=>{r(a)},[]);return e.jsxs("div",{style:{paddingBottom:32},children:[e.jsx(qe,{}),e.jsx(ke,{label:"Raffle Pots",sortValues:Re}),e.jsx(ge,{profile:t,collectionType:"raffle"}),o.length===0&&e.jsx(je,{label:"Rafl Pots"}),o.map(a=>e.jsx(se,{entry:a,onExpand:c,expanded:a.id===l},a.id))]})}function Ke(){return e.jsx("div",{style:{display:"flex",placeItems:"center",width:40,height:40},children:e.jsx(Pe,{variant:"indeterminate",disableShrink:!0,sx:{color:t=>(t.palette.mode==="light","#fff"),animationDuration:"550ms",[`& .${Ie.circle}`]:{strokeLinecap:"round"}},size:19,thickness:5})})}function Ue({refresh:t}){const[s,n]=i.useState(!1),[r,o]=i.useState(""),[l,c]=i.useState(!1),{preview:a,setPreview:p}=i.useContext(O),[m,f]=E(),x=m.has("preview"),j=i.useCallback(async()=>{const k=window.location.protocol==="http:"?"http://explore.lpubelts.com:8080/refresh-preview":"https://explore.lpubelts.com:8443/refresh-preview";n(!0),await fetch(k,{cache:"no-store"}).then(async v=>(n(!1),await v.json())).then(async v=>{o(v),console.log(`preview response
`,v)}),await t()},[t]),h=i.useCallback(()=>{x?(m.delete("preview"),f(m),p(!1)):p(!a)},[a,x,m,p,f]);return e.jsxs(S.Fragment,{children:[e.jsxs("div",{style:{maxWidth:700,margin:"20px auto 10px auto",padding:2,fontWeight:700,fontSize:"1.2rem",backgroundColor:"#8830d3",display:"flex",alignItems:"center"},children:[e.jsx("div",{style:{flexGrow:1,marginLeft:20},children:e.jsx(Ae,{onClick:()=>h(),style:{color:"#fff",textDecorationColor:"#bbb"},children:"PREVIEW MODE"})}),s?e.jsx(Ke,{}):e.jsx(T,{title:"Refresh From Sheet",arrow:!0,disableFocusListener:!0,children:e.jsx(B,{onClick:j,style:{marginRight:10},children:e.jsx(We,{})})})]}),(r==null?void 0:r.status)==="Errors"&&e.jsxs(Y,{expanded:l,onChange:()=>c(!l),sx:{".MuiAccordionSummary-content":{margin:0}},children:[e.jsx(ee,{expandIcon:e.jsx(Q,{}),style:{maxWidth:700,margin:"0px auto 10px auto",paddingLeft:20,fontWeight:700,fontSize:"1rem",backgroundColor:"#e34141"},children:"There were errors trying to import"}),e.jsx(te,{style:{maxWidth:700,margin:"20px auto 10px auto",padding:10,fontWeight:400,fontSize:"0.8rem",backgroundColor:"#e34141",display:"flex",alignItems:"center"},children:e.jsx("pre",{children:JSON.stringify(r,null,2)})})]})]})}var $={},Xe=K;Object.defineProperty($,"__esModule",{value:!0});var ie=$.default=void 0,Ze=Xe(J()),Qe=e;ie=$.default=(0,Ze.default)((0,Qe.jsx)("path",{d:"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3"}),"Visibility");function Ye(){const{raffleAdminRole:t}=i.useContext(_),{preview:s,setPreview:n}=i.useContext(O),[r,o]=E(),l=r.has("preview"),c=s||l,a=i.useCallback(()=>{l?(r.delete("preview"),o(r),n(!1)):n(!s)},[s,l,r,n,o]);le("p",()=>a(),{preventDefault:!0});const p=c?"#983de6":"#fff";return t?e.jsx(T,{title:"Toggle Preview Mode",arrow:!0,disableFocusListener:!0,children:e.jsx(B,{onClick:a,style:{height:48,width:48},children:e.jsx(ie,{style:{color:p}})})}):null}function $t(){ue("RAFL Prizes");const{preview:t}=i.useContext(O),{potStats:s}=i.useContext(_),{lockCollection:n}=i.useContext(U),{isMobile:r}=W(),[o]=E(),l=o.get("single"),c=o.get("id"),a=o.has("preview"),p=t||a,{data:m,loading:f,error:x,refresh:j}=Le({url:Fe}),h=m&&!f&&!x,k=t&&h?m||[]:Se,v=k.map(C=>{const b=s==null?void 0:s.find(g=>g.id===C.id);return{...C,tickets:b==null?void 0:b.tickets,donors:b==null?void 0:b.donors}}),y=k.find(C=>C.id===c),w=!!l&&y,A=e.jsx(S.Fragment,{children:e.jsxs(S.Fragment,{children:[!r&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}}),e.jsx(Ye,{}),e.jsx(De,{}),e.jsx(Me,{})]})}),L=void 0,d=r?8:0,F={maxWidth:700,marginLeft:"auto",marginRight:"auto",paddingLeft:d,paddingRight:d},P=r?"RAFL 2025!":"Announcing RAFL 2025!";return e.jsx(xe,{filterFields:me,children:e.jsx(fe,{allEntries:v,profile:n,children:e.jsxs("div",{style:F,children:[w&&e.jsx(se,{entry:y,expanded:!0,single:l}),!w&&e.jsxs(S.Fragment,{children:[e.jsx(ce,{title:P,extras:A,extrasTwo:L}),e.jsx(Be,{page:"pots"}),p&&e.jsx(Ue,{refresh:j}),p&&!h?e.jsx(Te,{}):e.jsx(Je,{profile:n}),e.jsx(de,{})]}),e.jsx(X,{feature:"rafl"})]})})})}export{$t as default};
