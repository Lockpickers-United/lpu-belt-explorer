import{al as M,r as t,D as z,u as re,j as e,R as w,B as u,E as ie,I as Y,ar as Re,a9 as ae,a1 as le,af as ce,a2 as de,Q as Pe,as as _e,P as Fe,J as pe,K as xe,A as ue,ak as me,W as Be,S as Ne,ae as Oe,d as Me,N as ze,F as We,T as He}from"./index-9a6ce20d.js";import{c as Ve}from"./dataUrls-29ba4993.js";import{D as he,F as ge,a as $e,s as Ue}from"./filterFields-9dd8683f.js";import{S as Ge,a as Ye,b as qe}from"./ScorecardListContext-d7cafba1.js";import{S as Qe,a as Je,s as Ke,F as Xe}from"./sortFields-ed18f740.js";import{L as Ze}from"./LoadingDisplay-29057351.js";import{V as et,S as tt}from"./ScorecardRow-2f20b968.js";import{I as te,S as oe}from"./ScorecardDanStats-3aeb538a.js";import{u as N}from"./useWindowSize-be23f983.js";import{L as q}from"./LoadingDisplay-963bae2b.js";import{L as G}from"./Link-84dc1764.js";import{T as ot}from"./TextField-04b643cf.js";import{d as ye,E as O,L as nt,A as st}from"./BeltIcon-194ea6fe.js";import{P as rt}from"./ProfileHeader-780dd358.js";import{N as it,E as at}from"./ScorecardExportButton-5273988e.js";import{I as lt}from"./IntroCopy-47748179.js";import{B as ct}from"./BeltStripe-b4da5b40.js";import{e as dt}from"./entryName-775d9a94.js";import{L as pt}from"./ListItem-2d368bf4.js";import{C as ne,A as xt,a as ut,b as mt}from"./AccordionSummary-b4024eea.js";import{S as ht}from"./ScorecardProfileNotFound-1973c374.js";import{u as se}from"./useData-74baa56d.js";import"./Select-4aac435e.js";import"./Box-8581b8d5.js";import"./Chip-e81fc882.js";import"./Sort-90181fa7.js";import"./Search-f0e44f7a.js";import"./LPU-c3fa7122.js";import"./LinearProgress-767ffac7.js";import"./FieldValue-22f2e232.js";import"./Link-d2429bbb.js";import"./chartDefaults-9fc07b21.js";import"./nivo-bar.es-3a837ad2.js";import"./nivo-legends.es-1a9d08a9.js";import"./index-4be1d3c8.js";import"./Launch-d20e6ccc.js";import"./PhotoCamera-179cf666.js";import"./Autocomplete-53be4a91.js";import"./Dialog-c7f75393.js";import"./FormGroup-c56bf579.js";import"./CopyProfileLinkButton-d4672166.js";import"./ToggleButtonGroup-32d389a3.js";import"./mycollection-0ec86312.js";import"./download-2a6b607c.js";import"./ContentCopy-41900c66.js";function je({setControlsExpanded:n,adminAction:o}){const{userId:s}=M(),{importUnclaimedEvidence:h}=t.useContext(z),{isMobile:i}=N(),[d,a]=t.useState(!1),l=re(),[c,m]=t.useState(""),[p,f]=t.useState(null),j=t.useCallback(async()=>{a(!0);const b=await h(s,c);a(!1),b?(m(""),n(!1),o()):f("Cannot find dan sheet tab")},[h,s,c,n,o]),D=i?"block":"flex",k=i?"0.95rem":"1rem";return e.jsx(w.Fragment,{children:e.jsx("div",{style:{placeItems:"center",display:D},children:d?e.jsx(q,{}):e.jsx(w.Fragment,{children:e.jsxs("div",{style:{padding:20,fontSize:k},children:[e.jsx("strong",{children:"For Black Belt pickers only."}),e.jsx("br",{}),"Black Belt pickers currently use another scorecard system known as the Dan Sheet. This import allows them to bring their picking history over to the site. If you do not already have a tab in the Dan sheet, this import will not work for you. For those that do, specify the name of your tab in the sheet to import your history into your Scorecard. Please note that tab names are case sensitive. ",e.jsx(G,{onClick:()=>{l("/profile/scorecard/howto")},style:{color:"#bbb",cursor:"pointer"},children:"Click here to learn more."}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("div",{style:{padding:"0px",alignItems:"center"},children:e.jsxs("div",{style:{padding:"0px",display:"flex"},children:[e.jsx("div",{style:{flexGrow:1}}),e.jsx(ot,{id:"tab-to-import",label:"Tab to Import",value:c,size:"small",error:!!p,helperText:p,margin:"dense",color:"secondary",onChange:b=>{m(b.target.value)}}),e.jsx(u,{style:{color:"#000",padding:0,lineHeight:"1rem",height:40,marginTop:8,marginLeft:10},variant:"contained",onClick:j,edge:"start",color:"secondary",children:"Import"})]})})]})})})})}function gt({id:n,owner:o}){const[s,h]=t.useState(null),{cardActivity:i}=t.useContext(he),d=i.filter(c=>c.id===n).filter(c=>c),a=t.useCallback(c=>{h(c)},[]),l=t.useCallback(()=>{h(null)},[]);return e.jsxs(w.Fragment,{children:[e.jsx(ie,{title:"My Collection",arrow:!0,disableFocusListener:!0,children:e.jsx(Y,{variant:"outlined",color:"inherit",onClick:a,children:e.jsx(Re,{color:d.length>0?"secondary":"inherit",fontSize:"medium"})})}),e.jsx(ae,{sx:{color:"#fff",zIndex:c=>c.zIndex.drawer+1},open:!!s,onClick:null,children:!!s&&e.jsxs(le,{style:{maxWidth:600,marginLeft:"auto",marginRight:"auto",border:"1px solid #666",opacity:1},children:[e.jsx(ce,{title:"Documentation",action:e.jsx(ye,{sx:{cursor:"pointer"}}),style:{paddingBottom:0},onClick:l}),e.jsxs(de,{children:[d.map((c,m)=>e.jsx(O,{activity:c,handleUpdate:l,source:"collectionButton",owner:o},m)),d.length===0&&e.jsx(O,{activity:null,lockId:n,handleUpdate:l,source:"collectionButton",owner:o})]})]})})]})}function yt({entry:n,owner:o}){const s=n.link?"#fff":"#888";return e.jsxs(pt,{style:{minHeight:64,borderTop:"1px solid rgba(255, 255, 255, 0.12)",color:s},children:[e.jsx(ct,{value:n.belt}),e.jsx(Pe,{primary:dt(n),primaryTypographyProps:{fontWeight:500},secondary:n.version,secondaryTypographyProps:{color:s},style:{padding:"0px 0px 0px 10px"}}),e.jsx(et,{entry:n,color:s}),e.jsx(gt,{id:n.id,owner:o})]},n.id)}const jt=w.memo(yt);function ft({owner:n,popularEntries:o}){const{isMobile:s}=N(),{filters:h}=t.useContext(ge),[i,d]=t.useState(25),[a,l]=t.useState("all"),[c,m]=t.useState(!0),p=t.useMemo(()=>o.slice(0,i),[o,i]),f=t.useMemo(()=>a==="picked"?p.filter(x=>x.link):a==="notPicked"?p.filter(x=>!x.link):p,[a,p]),j=p.filter(x=>x.link).length,D=f.length>0?Math.floor(j/p.length*100):0,k=n?"You've picked":"Picked",b=Object.keys(h).filter(x=>x!=="locks"&&x!=="tab").length>0?"matching":"most popular",r=t.useCallback(x=>()=>{m(!1),setTimeout(()=>d(x),150),setTimeout(()=>m(!0),300)},[]),v=s?"block":"flex",y=i===25?"contained":"text",E=i===50?"contained":"text",S=i===100?"contained":"text",T=a==="all"?"contained":"text",L=a==="picked"?"contained":"text",R=a==="notPicked"?"contained":"text";return o?e.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[e.jsxs("div",{style:{width:"100%",textAlign:"center",padding:"0px 20px 24px 20px"},children:[e.jsx(_e,{in:c,children:e.jsxs("div",{style:{fontSize:"1.2rem",fontWeight:700},children:[k," ",j," of the ",p.length," ",b," locks in BB Scorecards (",D,"%)"]})}),"(only entries with documentation are counted)",e.jsxs("div",{style:{marginTop:20,display:v,padding:"0px 20px"},children:[e.jsxs("div",{style:{flexGrow:1,textAlign:"left",fontSize:"1rem",marginTop:6},children:[e.jsx(u,{onClick:()=>l("all"),color:"info",variant:T,value:"all",style:{padding:"2px 8px 2px 8px",minWidth:35,lineHeight:"1rem",marginRight:6},children:"All"}),e.jsx(u,{onClick:()=>l("picked"),color:"info",variant:L,value:"picked",style:{padding:"2px 8px 2px 8px",minWidth:35,lineHeight:"1rem",marginRight:2},children:"Picked"}),e.jsx(u,{onClick:()=>l("notPicked"),color:"info",variant:R,value:"notPicked",style:{padding:"2px 8px 2px 8px",minWidth:35,lineHeight:"1rem"},children:"Not Picked"})]}),e.jsxs("div",{style:{flexGrow:1,textAlign:"right",fontSize:"1rem",marginTop:6},children:["Top Locks:  ",e.jsx(u,{onClick:r(25),color:"info",variant:y,value:"25",style:{padding:"2px 2px 2px 2px",minWidth:35,lineHeight:"1rem"},children:"25"}),e.jsx(u,{onClick:r(50),variant:E,color:"info",value:"50",style:{padding:"2px 2px 2px 2px",minWidth:35,lineHeight:"1rem"},children:"50"}),e.jsx(u,{onClick:r(100),color:"info",variant:S,value:"100",style:{padding:"2px 2px 2px 2px",minWidth:35,lineHeight:"1rem"},children:"100"})]})]})]}),e.jsx("div",{children:f.map(x=>e.jsx(Fe,{dense:!0,style:{padding:0},children:e.jsx(jt,{entry:x,owner:n})},x.id))})]}):e.jsx(q,{})}var Q={},vt=xe;Object.defineProperty(Q,"__esModule",{value:!0});var fe=Q.default=void 0,Ct=vt(pe()),kt=e;fe=Q.default=(0,Ct.default)((0,kt.jsx)("path",{d:"m19 8-4 4h3c0 3.31-2.69 6-6 6-1.01 0-1.97-.25-2.8-.7l-1.46 1.46C8.97 19.54 10.43 20 12 20c4.42 0 8-3.58 8-8h3zM6 12c0-3.31 2.69-6 6-6 1.01 0 1.97.25 2.8.7l1.46-1.46C15.03 4.46 13.57 4 12 4c-4.42 0-8 3.58-8 8H1l4 4 4-4z"}),"Cached");function bt({profile:n}){const{isMobile:o}=N(),{user:s}=t.useContext(ue),{oauthState:h}=t.useContext(z),i=(n==null?void 0:n.blackBeltAwardedAt)>0,{beta:d}=t.useContext(me),[a,l]=t.useState(!d),c=t.useCallback(()=>{l(!a)},[a]),[m,p]=t.useState(!1),f=()=>{p(!1),l(!1)},j=()=>{p(!0),d||l(!0)},D=t.useCallback(()=>{const{VITE_DISCORD_CLIENT_ID:y}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},E=encodeURIComponent("identify"),S=encodeURIComponent(`${location.origin}/#/auth/discord`),T=`https://discord.com/oauth2/authorize?client_id=${y}&response_type=code&redirect_uri=${S}&scope=${E}`;window.location.assign(T)},[]),k=t.useCallback(async()=>{const{VITE_REDDIT_CLIENT_ID:y}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},E=await h(s.uid),S=encodeURIComponent("identity flair privatemessages"),T=encodeURIComponent(`${location.origin}/#/auth/reddit`),L=`https://www.reddit.com/api/v1/authorize?client_id=${y}&response_type=code&state=${E}&redirect_uri=${T}&duration=temporary&scope=${S}`;window.location.assign(L)},[s,h]),b=o?"0.91rem":"1rem",r=o?"1.3rem":"1.5rem",v=d?"IMPORT BELTS":"IMPORT";return e.jsxs(w.Fragment,{children:[(!i||d)&&e.jsx(ie,{title:"Import",arrow:!0,disableFocusListener:!0,children:e.jsx(u,{variant:"contained",color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginLeft:6},onClick:j,children:v})}),e.jsx(ae,{sx:{color:"#fff",zIndex:y=>y.zIndex.drawer+1},open:m,onClick:null,children:m&&e.jsxs(le,{style:{maxWidth:600,marginLeft:"auto",marginRight:"auto",border:"1px solid #666",opacity:1},children:[e.jsx(ce,{title:"Import Belts",action:e.jsx(ye,{sx:{cursor:"pointer"}}),style:{paddingBottom:0},onClick:f}),e.jsxs(de,{children:[e.jsxs(ne,{in:!a,children:[e.jsxs("div",{style:{padding:"0px 0px",fontSize:b,lineHeight:r},children:[e.jsx("strong",{children:"New!"})," Add your approved Belts (and Dan Levels) to your Scorecard. You'll need to authorize for each site, and we'll pull your username and approvals for you. Please note: you can only import belts already approved through the official process.",e.jsx("br",{}),e.jsx("br",{}),"You'll need to briefly authorize for each platform you use for belts (Discord and/or Reddit) to verify your username. For Discord, we get the belt approvals from the #belt-requests channel. For Reddit, we need to read your messages to find the Mod approvals. We only make a connection once per import and your accounts will not remained linked. We cannot access and do not store your password.",e.jsx("br",{}),e.jsx("br",{}),e.jsxs("span",{style:{fontWeight:400},children:["New Discord approvals will be automatically added to your scorecard as long as there is a Discord username in your Profile. You only need to re-import from Discord if you want to add belts from an additional username.",e.jsx("br",{}),e.jsx("br",{}),"You'll need to import from Reddit again to pick up newly approved belts."]})]}),e.jsxs("div",{style:{padding:20,width:"100%",textAlign:"center"},children:[e.jsx("span",{style:{fontWeight:700},children:"Import From"}),e.jsx("br",{}),e.jsxs("div",{style:{marginTop:8},children:[e.jsx(u,{variant:"contained",color:"secondary",style:{lineHeight:"1.2rem"},onClick:D,children:"DISCORD"}),e.jsx(u,{variant:"contained",color:"secondary",style:{lineHeight:"1.2rem",marginLeft:16},onClick:k,children:"REDDIT"})]})]}),!i&&e.jsxs("div",{style:{padding:20,width:"100%",textAlign:"center"},children:["Black Belts only: ",e.jsx(G,{onClick:c,style:{color:"#99c2e5",cursor:"pointer"},children:"Import your Dan Sheet"})]})]}),e.jsx(ne,{in:a,children:a&&e.jsxs(w.Fragment,{children:[e.jsx(je,{}),e.jsx("div",{style:{display:"none"},children:"REMOVE beta check when not beta"}),d&&e.jsxs("div",{style:{padding:20,width:"100%",textAlign:"center"},children:["Return to ",e.jsx(G,{onClick:c,style:{color:"#99c2e5",cursor:"pointer"},children:"Import Belts"})]})]})})]})]})})]})}function It({owner:n,profile:o,adminAction:s,popular:h}){const{isMobile:i}=N(),{userId:d}=M(),a=re(),{visibleEntries:l=[],popularEntries:c=[],cardActivity:m}=t.useContext(he),{expanded:p}=t.useContext(Ge),{filters:f,setFilters:j,removeFilters:D}=t.useContext(ge),{name:k,locks:b}=f,{createEvidenceForEntries:r,removePickerActivity:v,refreshPickerActivity:y}=t.useContext(z),{admin:E}=t.useContext(me),[S,T]=t.useState(p),[L,R]=t.useState(!1),[x,W]=t.useState("import"),[P,A]=t.useState(!1),[I,H]=t.useState(b==="mostPopular"||h);p&&p!==S&&T(p);const _=t.useMemo(()=>{if(o&&o.recorded){const g=m.map(U=>U.matchId);return o.recorded.filter(U=>!g.includes(U))}else return[]},[o,m]),C=t.useCallback(g=>{f.id&&D(["id"]),T(g)},[f,D]),F=t.useCallback(async()=>{A(!0),await r(d,_),R(!1),A(!1),s()},[r,d,_,s]),B=t.useCallback(g=>{W(g),R(!L)},[L]),[K,X]=t.useState(null),Ce=!!K,ke=t.useCallback(g=>{g.preventDefault(),g.stopPropagation(),X(g.currentTarget)},[]),V=t.useCallback(()=>X(null),[]),be=t.useCallback(async()=>{A(!0),await v(m),V(),A(!1),s()},[m,v,V,s]),Z=15,$=i?"block":"flex",Ie=i?6:0,ee=t.useCallback(()=>{j(I?{name:k}:{locks:"mostPopular",name:k}),H(!I)},[I,k,j]),De=t.useCallback(g=>{a(g)},[a]),Ee=t.useCallback(async()=>{A(!0),await y(d),A(!1),s(),window.location.reload()},[s,y,d]),Se=I?"text":"outlined",Te=I?"outlined":"text",we=o.displayName&&!o.privacyAnonymous?o.displayName.toLowerCase().endsWith("s")?`${o.displayName}'`:`${o.displayName}'s`:"Anonymous",Le=n?"My Locks":`${we} Locks`,Ae=n?86:124;return e.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[e.jsx(rt,{profile:o,page:"scorecard",owner:n,mostPopular:I}),n&&l.length>0&&!o.tabClaimed&&e.jsx("div",{style:{margin:8,padding:"0px 0px"},children:e.jsx(lt,{pageName:"scorecard"})}),l.length>0&&e.jsx(w.Fragment,{children:i?e.jsxs("div",{style:{display:$,padding:"0px 8px 0px 16px"},children:[(o==null?void 0:o.blackBeltAwardedAt)>0&&e.jsx(oe,{profile:o,owner:n}),e.jsx("div",{style:{marginRight:0,width:"95%"},children:e.jsx(te,{profile:o,entries:l})})]}):e.jsxs("div",{style:{display:$,padding:"10px 8px 0px 16px"},children:[e.jsx("div",{style:{marginRight:10,width:370},children:e.jsx(te,{profile:o,entries:l})}),o.danLevel>0&&e.jsx("div",{style:{flexGrow:1,marginRight:0},children:e.jsx(oe,{profile:o,owner:n})})]})}),e.jsxs(xt,{expanded:L,disableGutters:!0,children:[e.jsx(ut,{style:{paddingLeft:Z,paddingRight:Z,placeItems:"center",width:"100%"},children:e.jsxs("div",{style:{width:"100%",placeItems:"center",textAlign:"center"},children:[e.jsxs("div",{style:{display:$,width:"100%",placeItems:"center",textAlign:"center"},children:[(n||E)&&e.jsxs("div",{style:{width:"100%",textAlign:"left"},children:[e.jsx(bt,{profile:o}),!I&&e.jsx(u,{variant:"outlined",color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginLeft:6},onClick:()=>B("project"),children:"ADD PROJECT"}),o&&o.blackBeltAwardedAt&&e.jsx(u,{variant:"outlined",color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginLeft:6},onClick:()=>De("/scorecard/info/FAQ"),children:"BB FAQ"})]}),e.jsxs("div",{style:{width:"100%",textAlign:"right",display:"flex",marginTop:Ie},children:[e.jsx("div",{style:{flexGrow:1}}),e.jsx(u,{variant:Se,color:"info",size:"small",style:{lineHeight:"1.2rem",minWidth:Ae,padding:"4px 10px"},onClick:()=>ee(),children:e.jsx("nobr",{children:Le})}),e.jsx(u,{variant:Te,color:"info",size:"small",style:{lineHeight:"1.2rem",marginLeft:6,width:122},onClick:()=>ee(),children:"MOST POPULAR"})]})]}),P&&e.jsx(q,{}),E&&!P&&e.jsx("div",{style:{backgroundColor:"#700",padding:5,marginTop:20},children:e.jsxs("div",{style:{display:"flex"},children:[e.jsx("div",{style:{width:"10%",textAlign:"center"},children:"ADMIN"}),e.jsx(u,{color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginLeft:6},onClick:()=>B("award"),children:"ADD BELT"}),e.jsx(u,{color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:()=>B("import"),children:"IMPORT DAN SHEET"}),e.jsxs(u,{color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:F,children:["MERGE RECORDED (",_.length,")"]}),e.jsx(u,{color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:ke,children:"DELETE SCORECARD"}),e.jsxs(Be,{anchorEl:K,open:Ce,onClose:V,children:[e.jsxs("div",{style:{padding:20,textAlign:"center"},children:["You cannot undo delete.",e.jsx("br",{}),"Are you sure?"]}),e.jsx("div",{style:{textAlign:"center"},children:e.jsx(u,{style:{marginBottom:10,color:"#000"},variant:"contained",onClick:be,edge:"start",color:"error",children:"Delete"})})]}),e.jsx(Y,{color:"secondary",onClick:Ee,children:e.jsx(fe,{})})]})})]})}),e.jsxs(mt,{style:{backgroundColor:"#333"},children:[x==="import"&&e.jsx(je,{setControlsExpanded:R,adminAction:s}),x==="project"&&e.jsx(O,{activity:null,handleUpdate:B,addProject:!0,owner:n}),x==="award"&&e.jsx(O,{activity:null,handleUpdate:B,addAward:!0,owner:n})]})]}),!I&&e.jsxs(w.Fragment,{children:[l.length===0&&e.jsx(it,{}),e.jsx("div",{children:l.map(g=>e.jsx(tt,{owner:n,activity:g,expanded:g.id===S,onExpand:C,merged:o.blackBeltAwardedAt>0},g.id))})]}),I&&e.jsx(ft,{owner:n,profile:o,adminAction:s,popularEntries:c})]})}var J={},Dt=xe;Object.defineProperty(J,"__esModule",{value:!0});var ve=J.default=void 0,Et=Dt(pe()),St=e;ve=J.default=(0,Et.default)((0,St.jsx)("path",{d:"M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3z"}),"LaunchOutlined");function Tt(){const{userId:n}=M(),o=`https://lpubelts.com/#/profile/${n}/scorecard/no-tracking`,s=t.useCallback(h=>{const i=window.open(h,"_blank","noopener,noreferrer");i&&(i.opener=null)},[]);return e.jsx(Y,{onClick:()=>s(o),children:e.jsx(ve,{fontSize:"small"})})}function Co({mostPopular:n}){const{userId:o}=M(),{user:s}=t.useContext(ue),{getProfile:h,getPickerActivity:i}=t.useContext(z),{scoredActivity:d,bbCount:a,danPoints:l,eligibleDan:c,nextDanPoints:m,nextDanLocks:p}=t.useContext(Ne),{isMobile:f}=N(),[j,D]=t.useState(!1),k=t.useCallback(()=>{D(!j)},[j]),b=t.useCallback(async()=>{try{const C=await h(o);if(C){const F=C.displayName&&!C.privacyAnonymous?C.displayName.toLowerCase().endsWith("s")?`${C.displayName}'`:`${C.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${F} Scorecard`}if((s==null?void 0:s.uid)!==o){const F=await i(o);return{profile:C,...Oe(F)}}else return{profile:C,scoredActivity:d,bbCount:a,danPoints:l,eligibleDan:c,nextDanPoints:m,nextDanLocks:p}}catch(C){return console.error("Error loading profile and activity.",C),null}},[j,h,o,s,i,d,a,l,c,m,p]),{data:r={},loading:v,error:y}=se({loadFn:b}),E=r?r.profile:{},S=r?r.scoredActivity:[],T=r?r.bbCount:0,L=r?r.danPoints:0,R=r?r.eligibleDan:0,x=r?r.nextDanPoints:0,W=r?r.nextDanLocks:0,P=se({url:Ve}),A=P.data?P.data.scorecardLocks:[],I=window.location.hash.search(/locks=mostPopular/)<1&&!n?e.jsxs(w.Fragment,{children:[e.jsx(Qe,{label:"Scorecard",extraFilters:[{key:"tab",value:"search"}]}),e.jsx(Je,{sortValues:Ke}),e.jsx(Xe,{extraFilters:[{key:"tab",value:"search"}]}),!f&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}):null,H=e.jsxs(w.Fragment,{children:[e.jsx("br",{}),e.jsx(at,{}),e.jsx(Tt,{})]}),_=v?"Loading...":"Profile";return v||y?null:e.jsx($e,{filterFields:Ue,children:e.jsx(Ye,{cardActivity:S,cardBBCount:T,cardDanPoints:L,cardEligibleDan:R,cardNextDanPoints:x,cardNextDanLocks:W,popularLocks:A,children:e.jsxs(qe,{children:[e.jsxs(nt,{adapterLocale:Me.locale(),dateAdapter:st,children:[e.jsx(ze,{title:_,extras:I}),v&&e.jsx(Ze,{}),!v&&r&&!y&&e.jsx(It,{owner:s&&s.uid===o,profile:E,adminAction:k,popular:n}),!v&&(!r||y)&&e.jsx(ht,{}),e.jsx(We,{extras:H})]}),e.jsx(He,{feature:"scorecard"})]})})})}export{Co as default};
