import{r as i,ao as re,j as e,H as K,G as A,I as T,a2 as D,u as W,K as U,M as X,A as ae,D as Z,R as F,aZ as le,aA as ce,W as M,B as de,T as Q,X as O,V as pe,N as ue,F as me}from"./index-a08903d0.js";import{F as N,r as H,f as xe,D as Y,a as fe,b as he}from"./filterFields-36782c27.js";import{u as ge}from"./usePageTitle-92f643a7.js";import{a as je,F as z,I as ve}from"./InlineFilterDisplay-c0a15047.js";import{N as ye}from"./ViewFilterButtons-a7e5b14c.js";import{d as ee,F as L}from"./FieldValue-121cb983.js";import{d as be}from"./Link-3d1a2546.js";import{d as we}from"./ContentCopy-3b79d818.js";import{a as E}from"./RaffleContext-d7505131.js";import{L as Ce}from"./LoadingDisplaySmall-17b73d9f.js";import{A as te,a as se,b as ie}from"./AccordionSummary-fa0a3389.js";import{C as ke}from"./Collapse-b20ac058.js";import{M as V}from"./index-e21761a5.js";import{r as q}from"./index-9ca0c98a.js";import{A as Re}from"./AccordionActions-d71d572b.js";import{R as Se}from"./RaffleSearchBar-354563f2.js";import{r as Le}from"./sortFields-90296e28.js";import{a as Fe}from"./rafl-2110d2dc.js";import{u as Pe}from"./useData-85375b18.js";import{g as Ie}from"./dataUrls-02b67476.js";import{C as Be,c as Ae,L as Te}from"./LoadingDisplay-28d65e88.js";import{R as We}from"./RaffleHeader-09a89c0d.js";import{d as Me}from"./Cached-205bb3f2.js";import{L as ze}from"./Link-0e1fd53a.js";import{R as De,A as Ee}from"./AdminRoleButton-b249ea5e.js";import"./useDocumentTitle-9c7ce376.js";import"./ImageViewer-9b4ff7ba.js";import"./Launch-117dc6df.js";import"./Dialog-fe2f6851.js";import"./LinearProgress-631a5179.js";import"./DialogContent-39f5111d.js";import"./Chip-6bde20da.js";import"./Select-18bc60b9.js";import"./SearchBox-f1363f45.js";import"./Box-fc69d8f3.js";import"./Search-3b802198.js";import"./Badge-65cebb6a.js";import"./TextField-94ada92d.js";import"./LockListContext-3e788ffe.js";import"./entryName-6a27208f.js";import"./ToggleButtonGroup-b20cf4de.js";function _e({children:t,allEntries:s,profile:o}){const{filters:r}=i.useContext(N),{search:n,id:d,tab:u,name:c,sort:p,image:f,preview:y,single:m,...g}=r,j=i.useMemo(()=>s.map(x=>({...x,fuzzy:H([x.title,x.winner,x.description,x.potContents].join(",")),collection:re.raffle.map.map(h=>o&&o[h.key]&&o[h.key].includes(x.id)?"In "+h.label:"Not in "+h.label)})),[s,o]),k=i.useMemo(()=>{const x=Object.keys(g).map(l=>{const a=g[l];return Array.isArray(a)?a.map(C=>({key:l,value:C})):{key:l,value:a}}).flat(),h=j.filter(l=>x.every(({key:a,value:C})=>Array.isArray(l[a])?l[a].includes(C):l[a]===C)).sort((l,a)=>l.potNumber-a.potNumber),P=n?xe.go(H(n),h,{keys:Oe,threshold:-25e3}).map(l=>({...l.obj,score:l.score})):h;return p?P.sort((l,a)=>p==="potName"?l.title.localeCompare(a.title):p==="contributedBy"?l.contributedBy[0].localeCompare(a.contributedBy[0]):p==="tickets"?parseInt(a.tickets)-parseInt(l.tickets):l.potNumber<a.potNumber):P},[g,j,n,p]),w=i.useMemo(()=>({allEntries:s,visibleEntries:k}),[s,k]);return e.jsx(Y.Provider,{value:w,children:t})}const Oe=["fuzzy"];function Ne({entry:t}){const s=i.useCallback(async o=>{o.preventDefault(),o.stopPropagation();const n=t.title.replace(/[\s/]/g,"_").replace(/\W/g,""),d=`https://share.lpubelts.com/?id=${t.id}&name=${n}`;await navigator.clipboard.writeText(d),K("Link to RAFL pot copied to clipboard.")},[t]);return e.jsx(A,{title:"Copy Link to Pot",arrow:!0,disableFocusListener:!0,children:e.jsx(T,{onClick:s,style:{height:36,width:36},children:e.jsx(be,{})})})}function Ge({entry:t}){const[s,o]=D(),r=s.get("image"),n=i.useCallback(f=>{s.set("image",f+1),o(s)},[s,o]),d=i.useCallback(()=>{s.delete("image"),o(s)},[s,o]),u=i.useCallback(()=>J(r,t),[t,r]),c=i.useMemo(()=>r?+r-1:-1,[r]),p=J(c,t);return e.jsx(je,{media:t.media,openIndex:c,initiallyOpen:p,onOpenImage:n,onCloseImage:d,onBackButton:u,shareParams:{id:t.id,name:s.get("name")},columns:2})}const J=(t,s)=>/\d+/.test(t)&&!!s.media[t];function $e({entry:t}){const s=i.useCallback(async()=>{const o=t.title;await navigator.clipboard.writeText(o),K("Pot name copied to clipboard.")},[t]);return e.jsx(A,{title:"Copy RAFL pot name",arrow:!0,disableFocusListener:!0,children:e.jsx(T,{onClick:s,children:e.jsx(we,{})})})}function He({entry:t}){const{live:s,raffleAdminRole:o}=i.useContext(E),r=s||o,{isMobile:n,flexStyle:d}=W(),u=n?28:30,c=n?"1.1rem":"1.3rem",p="1rem",f=0,y=n?"1.3rem":"1.4rem",m=n?"1.6rem":"1.8rem";return e.jsxs("div",{style:{display:"flex",alignItems:"center",width:"100%"},children:[r&&e.jsx("div",{style:{borderRadius:"50%",backgroundColor:"#fff",color:"#000",height:u,width:u,minWidth:u,marginTop:0,marginBottom:4,marginRight:12,display:"flex"},children:e.jsx("div",{style:{margin:"auto",paddingTop:0,paddingLeft:f,paddingRight:1,fontWeight:700,fontSize:c,lineHeight:p},children:t.potNumber})}),e.jsxs("div",{style:{display:d,flexGrow:1},children:[e.jsx("div",{style:{display:"flex",fontWeight:500,fontSize:y,lineHeight:m,marginTop:n?0:-3,flexGrow:1},children:t.title}),t.winner&&e.jsxs("div",{style:{display:"flex",fontSize:y,lineHeight:m,marginTop:n?8:-3,marginRight:10,fontWeight:400},children:["Winner: ",e.jsx("strong",{children:" mgsecure"})]})]})]})}var G={},Ve=X;Object.defineProperty(G,"__esModule",{value:!0});var _=G.default=void 0,qe=Ve(U()),Je=e;_=G.default=(0,qe.default)((0,Je.jsx)("path",{d:"M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"}),"Star");function Ke({id:t}){const{isLoggedIn:s}=i.useContext(ae),{lockCollection:o,addToLockCollection:r,removeFromLockCollection:n}=i.useContext(Z),[d,u]=i.useState(()=>{}),c=!!d,{isMobile:p}=W(),[f,y]=i.useState(null),m="raffleWatchlist",g=i.useCallback(()=>!!o[m]&&o[m].includes(t),[t,o]),j=g()?"Remove from Watchlist":"Add to Watchlist",k=i.useCallback((a,C)=>async(I,R)=>{I.preventDefault(),I.stopPropagation(),y(a),R||!C?await r(a,t):await n(a,t),y(null)},[t,r,n]),w=i.useCallback(a=>{a.preventDefault(),a.stopPropagation(),u(a.currentTarget)},[]),x=i.useCallback(a=>{a.preventDefault(),a.stopPropagation(),u(null)},[]),h=36,l={marginTop:-2,marginRight:p?4:8,width:h,minWidth:h,height:h};return e.jsxs("div",{style:l,children:[s&&e.jsx("div",{style:{display:"flex",justifyItems:"left"},children:e.jsx(F.Fragment,{children:f===m?e.jsx("div",{style:{marginTop:1},children:e.jsx(Ce,{})}):e.jsx(A,{title:j,arrow:!0,disableFocusListener:!0,children:e.jsx(T,{onClick:k(m,g()),style:{color:g()?"#13e113":"#999",...l},children:e.jsx(_,{})},m)})},m)}),!s&&e.jsxs(F.Fragment,{children:[e.jsx(A,{title:j,arrow:!0,disableFocusListener:!0,children:e.jsx(T,{onClick:w,style:{color:g()?"#13e113":"#999",...l},children:e.jsx(_,{})},m)}),e.jsx(le,{open:c,anchorEl:d,onClose:x,anchorOrigin:{vertical:"top",horizontal:"left"},children:e.jsx("div",{style:{display:"flex",padding:30,width:300,placeItems:"center"},onClick:x,children:e.jsxs("div",{children:[e.jsx("strong",{children:"Log in to keep a RAFL Watchlist!"}),e.jsx("br",{}),e.jsx("br",{}),e.jsx(ce,{})]})})})]})]})}function Ue({entry:t,expanded:s,onExpand:o,single:r}){var I,R,S;const{live:n,raffleAdminRole:d}=i.useContext(E),u=n||d,{filters:c}=i.useContext(N),p=!!c.shippingType||!!c.splitShipping,[f,y]=i.useState(!1),m={maxWidth:700,marginLeft:"auto",marginRight:"auto"},g=i.useRef(null),j=r==="2",k=t.tickets?new Intl.NumberFormat().format(t.tickets):"---";i.useEffect(()=>{if(s&&g&&!f){const v=window.innerWidth<=600?70:74;y(!0),setTimeout(()=>{window.scrollTo({left:0,top:g.current.offsetTop-v,behavior:s?"auto":"smooth"})},s?0:100)}else s||y(!1)},[s,t,f]);const w=i.useCallback((b,v)=>{o&&o(v?t.id:!1)},[t.id,o]),{isMobile:x,flexStyle:h}=W(),P=x?"12px 0px 8px 0px":"12px 0px 8px 8px",l=x?"0px 0px 18px 0px":"0px 0px 18px 8px",a=x?"0.95rem":"1.0rem",C=t.winner&&!s?.6:1;return e.jsxs(te,{expanded:s,onChange:w,style:m,ref:g,children:[e.jsx(se,{expandIcon:j?null:e.jsx(ee,{}),children:e.jsxs("div",{style:{display:"flex",alignItems:"center",flexGrow:1},children:[e.jsxs("div",{style:{display:"block",marginBottom:0,flexGrow:1},children:[e.jsx("div",{style:{display:"flex",width:"100%",alignItems:"center"},children:e.jsx("div",{style:{margin:P,display:"flex",flexGrow:1},children:e.jsx(He,{entry:t})})}),e.jsxs("div",{style:{margin:l,display:"flex"},children:[e.jsx("div",{style:{flexGrow:1,opacity:C},children:e.jsxs("div",{style:{marginRight:8,color:"#bbb",fontSize:a},children:["Contributed by  ",t.contributedBy.map((b,v)=>{const B=v<t.contributedBy.length-1?", ":"";return e.jsxs("span",{children:[e.jsx(z,{value:b,field:"contributedBy",mode:"text"}),B]},v)})]})}),u&&e.jsx(ke,{in:!!t.donors,children:e.jsxs("div",{style:{marginRight:15,fontSize:a,textAlign:"right",display:h},children:[e.jsx("div",{children:e.jsxs("nobr",{children:["Donors: ",e.jsx("strong",{children:t.donors||"--"})]})}),e.jsx("div",{style:{marginLeft:8},children:e.jsxs("nobr",{children:["Tickets: ",e.jsx("strong",{children:k})]})})]})})]}),!j&&p&&e.jsxs("div",{style:{display:"flex",marginTop:6,opacity:C},children:[e.jsx("div",{style:{marginRight:10},children:e.jsx(L,{name:"Country",headerStyle:{marginBottom:4},value:t.country.map((b,v)=>{const B=v<t.country.length-1?", ":"";return e.jsxs("span",{children:[e.jsx(z,{value:b,field:"country",mode:"text"}),B]},v)})})}),e.jsx(L,{name:"Shipping Info",headerStyle:{marginBottom:4},value:t.shippingInfo})]}),e.jsx("div",{style:{margin:"12px 12px 8px 8px",fontSize:a,opacity:C},children:e.jsx(V,{rehypePlugins:[[q,{target:"_blank"}]],children:t.description})})]}),u&&e.jsx(Ke,{id:t.id})]})}),s&&e.jsxs(F.Fragment,{children:[e.jsxs(ie,{sx:{padding:"0px 16px 0px 16px"},children:[e.jsx("div",{style:{display:h},children:e.jsx(M,{direction:"row",alignItems:"flex-start",style:{},children:!!((I=t.tags)!=null&&I.length)&&!j&&e.jsx(L,{name:"Tags",value:e.jsx(M,{direction:"row",spacing:0,sx:{flexWrap:"wrap"},children:t.tags.map((b,v)=>e.jsx(z,{value:b,field:"tags",mode:"simple"},v))}),headerStyle:{marginBottom:4}})})}),!j&&!p&&e.jsxs("div",{style:{display:"flex",marginTop:6},children:[e.jsx("div",{style:{marginRight:10},children:e.jsx(L,{name:"Country",headerStyle:{marginBottom:4},value:t.country.map((b,v)=>{const B=v<t.country.length-1?", ":"";return e.jsxs("span",{children:[e.jsx(z,{value:b,field:"country",mode:"text"}),B]},v)})})}),e.jsx(L,{name:"Shipping Info",headerStyle:{marginBottom:4},value:t.shippingInfo})]}),t.potContents&&e.jsx(M,{direction:"row",spacing:1,sx:{width:"100%",flexWrap:"wrap",marginTop:"4px"},children:e.jsx(L,{name:"Contents",textStyle:{fontSize:a},value:e.jsx(V,{rehypePlugins:[[q,{target:"_blank"}]],children:t.potContents})})}),!!((R=t.media)!=null&&R.length)&&e.jsx(L,{value:e.jsx(Ge,{entry:t})}),!!((S=t.links)!=null&&S.length)&&e.jsx(L,{name:"Links",value:e.jsx(M,{direction:"row",spacing:1,sx:{flexWrap:"wrap"},children:t.links.map(({title:b,url:v},B)=>e.jsx(de,{href:v,target:"_blank",rel:"noopener noreferrer",color:"secondary",variant:"outlined",sx:{textTransform:"none"},style:{margin:4},children:b},B))})}),e.jsx(Q,{feature:"raflPot",id:t.id})]}),!j&&e.jsxs(Re,{disableSpacing:!0,children:[e.jsx($e,{entry:t}),u&&e.jsx(Ne,{entry:t})]})]})]})}const oe=F.memo(Ue,(t,s)=>{const o=Object.keys(t.entry),r=Object.keys(s.entry);if(o.length!==r.length)return!1;for(let n=0;n<o.length;n++)if(o[n]!==r[n]||t.entry[o[n]]!==s.entry[r[n]])return!1;return t.expanded===s.expanded&&t.onExpand===s.onExpand});function Xe(){const{isMobile:t}=W(),s=t?{maxWidth:700,marginLeft:"auto",marginRight:"auto",padding:8}:{maxWidth:700,marginLeft:"auto",marginRight:"auto",padding:12};return e.jsx("div",{style:{...s,backgroundColor:"#333",minHeight:72},children:e.jsxs("div",{style:{padding:"4px 4px 10px 4px"},children:[e.jsx("div",{style:{fontSize:"1.2rem",fontWeight:500,marginTop:1,marginBottom:7},children:"RAFL is coming soon!"}),"We will start accepting entries on January 1st. In the meantime, here's a preview of the pots that folks are developing. Please note that ",e.jsx("strong",{children:"all pots and contents are subject to change"})," until the raffle begins in January."]})})}function Ze({profile:t}){const{filters:s}=i.useContext(N),[o,r]=i.useState(s.id),{visibleEntries:n}=i.useContext(Y),d=i.useDeferredValue(o),u=i.useCallback(c=>{r(c)},[]);return e.jsxs("div",{style:{paddingBottom:32},children:[e.jsx(Xe,{}),e.jsx(Se,{label:"Raffle Pots",sortValues:Le}),e.jsx(ve,{profile:t,collectionType:"raffle"}),n.length===0&&e.jsx(ye,{label:"Rafl Pots"}),n.map(c=>e.jsx(oe,{entry:c,onExpand:u,expanded:c.id===d},c.id))]})}function Qe(){return e.jsx("div",{style:{display:"flex",placeItems:"center",width:40,height:40},children:e.jsx(Be,{variant:"indeterminate",disableShrink:!0,sx:{color:t=>(t.palette.mode==="light","#fff"),animationDuration:"550ms",[`& .${Ae.circle}`]:{strokeLinecap:"round"}},size:19,thickness:5})})}function Ye({refresh:t}){const[s,o]=i.useState(!1),[r,n]=i.useState(""),[d,u]=i.useState(!1),{preview:c,setPreview:p}=i.useContext(O),[f,y]=D(),m=f.has("preview"),g=i.useCallback(async()=>{const k=window.location.protocol==="http:"?"http://explore.lpubelts.com:8080/refresh-preview":"https://explore.lpubelts.com:8443/refresh-preview";o(!0),await fetch(k,{cache:"no-store"}).then(async w=>(o(!1),await w.json())).then(async w=>{n(w),console.log(`preview response
`,w)}),await t()},[t]),j=i.useCallback(()=>{m?(f.delete("preview"),y(f),p(!1)):p(!c)},[c,m,f,p,y]);return e.jsxs(F.Fragment,{children:[e.jsxs("div",{style:{maxWidth:700,margin:"20px auto 10px auto",padding:2,fontWeight:700,fontSize:"1.2rem",backgroundColor:"#8830d3",display:"flex",alignItems:"center"},children:[e.jsx("div",{style:{flexGrow:1,marginLeft:20},children:e.jsx(ze,{onClick:()=>j(),style:{color:"#fff",textDecorationColor:"#bbb"},children:"PREVIEW MODE"})}),s?e.jsx(Qe,{}):e.jsx(A,{title:"Refresh From Sheet",arrow:!0,disableFocusListener:!0,children:e.jsx(T,{onClick:g,style:{marginRight:10},children:e.jsx(Me,{})})})]}),(r==null?void 0:r.status)==="Errors"&&e.jsxs(te,{expanded:d,onChange:()=>u(!d),sx:{".MuiAccordionSummary-content":{margin:0}},children:[e.jsx(se,{expandIcon:e.jsx(ee,{}),style:{maxWidth:700,margin:"0px auto 10px auto",paddingLeft:20,fontWeight:700,fontSize:"1rem",backgroundColor:"#e34141"},children:"There were errors trying to import"}),e.jsx(ie,{style:{maxWidth:700,margin:"20px auto 10px auto",padding:10,fontWeight:400,fontSize:"0.8rem",backgroundColor:"#e34141",display:"flex",alignItems:"center"},children:e.jsx("pre",{children:JSON.stringify(r,null,2)})})]})]})}var $={},et=X;Object.defineProperty($,"__esModule",{value:!0});var ne=$.default=void 0,tt=et(U()),st=e;ne=$.default=(0,tt.default)((0,st.jsx)("path",{d:"M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5M12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5m0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3"}),"Visibility");function it(){const{raffleAdminRole:t}=i.useContext(E),{preview:s,setPreview:o}=i.useContext(O),[r,n]=D(),d=r.has("preview"),u=s||d,c=i.useCallback(()=>{d?(r.delete("preview"),n(r),o(!1)):o(!s)},[s,d,r,o,n]);pe("p",()=>c(),{preventDefault:!0});const p=u?"#983de6":"#fff";return t?e.jsx(A,{title:"Toggle Preview Mode",arrow:!0,disableFocusListener:!0,children:e.jsx(T,{onClick:c,style:{height:48,width:48},children:e.jsx(ne,{style:{color:p}})})}):null}function Vt(){ge("RAFL Prizes");const{preview:t}=i.useContext(O),{potStats:s}=i.useContext(E),{lockCollection:o}=i.useContext(Z),{isMobile:r}=W(),[n]=D(),d=n.get("single"),u=n.get("id"),c=n.has("preview"),p=t||c,{data:f,loading:y,error:m,refresh:g}=Pe({url:Ie}),j=f&&!y&&!m,k=t&&j?f||[]:Fe,w=k.map(R=>{const S=s==null?void 0:s.find(b=>b.id===R.id);return{...R,tickets:S==null?void 0:S.tickets,donors:S==null?void 0:S.donors}}),x=k.find(R=>R.id===u),h=!!d&&x,P=e.jsx(F.Fragment,{children:e.jsxs(F.Fragment,{children:[!r&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}}),e.jsx(it,{}),e.jsx(De,{}),e.jsx(Ee,{})]})}),l=void 0,a=r?8:0,C={maxWidth:700,marginLeft:"auto",marginRight:"auto",paddingLeft:a,paddingRight:a},I=r?"RAFL 2025!":"Announcing RAFL 2025!";return e.jsx(fe,{filterFields:he,children:e.jsx(_e,{allEntries:w,profile:o,children:e.jsxs("div",{style:C,children:[h&&e.jsx(oe,{entry:x,expanded:!0,single:d}),!h&&e.jsxs(F.Fragment,{children:[e.jsx(ue,{title:I,extras:P,extrasTwo:l}),e.jsx(We,{page:"pots"}),p&&e.jsx(Ye,{refresh:g}),p&&!j?e.jsx(Te,{}):e.jsx(Ze,{profile:o}),e.jsx(me,{})]}),e.jsx(Q,{feature:"rafl"})]})})})}export{Vt as default};
