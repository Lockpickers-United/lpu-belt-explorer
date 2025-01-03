import{an as Y,r as t,D as M,u as N,b as oe,j as e,R as S,B as m,G as se,I as ne,at as Ee,a8 as re,a0 as ie,ag as ae,a1 as le,U as De,au as Te,Q as Se,A as ce,X as Ae,a9 as Le,S as Re,af as _e,d as we,N as Fe,F as Pe,T as Be}from"./index-f0068c75.js";import{c as Ne}from"./dataUrls-f163a2c2.js";import{D as de,F as pe,a as Oe,s as Me}from"./filterFields-da9721f6.js";import{S as Ve,a as We,b as ze}from"./ScorecardListContext-3dd4d9d2.js";import{s as He}from"./sortFields-8bfcc66d.js";import{S as $e,F as Ue}from"./SortButton-9588abd9.js";import{L as Ye}from"./LoadingDisplay-25220090.js";import{V as Ge,S as Qe}from"./ScorecardRow-e9993fb3.js";import"./index-3eff78fa.js";import{I as J,S as Z}from"./ScorecardDanStats-ec82670b.js";import{L as G}from"./LoadingDisplay-1aaec19b.js";import{L as U}from"./Link-22fb05d6.js";import{T as Xe}from"./TextField-2e6c872f.js";import{d as xe,E as O,L as qe,A as Ke}from"./BeltIcon-266b5573.js";import{P as Je}from"./ProfileHeader-2d17e5d1.js";import{N as Ze}from"./NoScorecardData-62c3158f.js";import{I as et}from"./IntroCopy-6fc38064.js";import{B as tt}from"./BeltStripe-ff93d768.js";import{e as ot}from"./entryName-c19c3acd.js";import{L as st}from"./ListItem-94b1e95f.js";import{d as nt}from"./Cached-d2979872.js";import{C as ee,A as rt,a as it,b as at}from"./AccordionSummary-219d2e9e.js";import{E as lt}from"./ScorecardExportButton-ef3c32b9.js";import{S as ct}from"./ScorecardProfileNotFound-52e9495d.js";import{S as dt}from"./SearchBox-c135cc4a.js";import{u as te}from"./useData-f916acad.js";import"./Badge-f696e1a1.js";import"./Chip-2b7c0160.js";import"./Select-7a245973.js";import"./Box-7750e020.js";import"./Sort-19312036.js";import"./LockListContext-24cac423.js";import"./LPU-c3fa7122.js";import"./LinearProgress-566f301b.js";import"./FieldValue-ddc3bb0e.js";import"./Link-ae9dbabf.js";import"./chartDefaults-9fc07b21.js";import"./nivo-bar.es-0cd94556.js";import"./nivo-legends.es-c0089c49.js";import"./index-b6290678.js";import"./CircularProgress-12c476c5.js";import"./Launch-1a820ebb.js";import"./PhotoCamera-ba9988ee.js";import"./Autocomplete-ce7be1b8.js";import"./DialogContent-57a0ac10.js";import"./Dialog-49fa6cc6.js";import"./VideocamOutlined-9dca1864.js";import"./FormGroup-971b8ec4.js";import"./Checkbox-e9f4db35.js";import"./LoadingDisplaySmall-8ca5fc1f.js";import"./CopyProfileLinkButton-0d9708cc.js";import"./ToggleButtonGroup-a33b354f.js";import"./mycollection-0ec86312.js";import"./download-6873f0ab.js";import"./ContentCopy-e384eb33.js";import"./Search-f71e9f45.js";function me({setControlsExpanded:s,adminAction:o}){const{userId:n}=Y(),{importUnclaimedEvidence:y}=t.useContext(M),{isMobile:p}=N(),[l,c]=t.useState(!1),a=oe(),[i,u]=t.useState(""),[d,f]=t.useState(null),j=t.useCallback(async()=>{c(!0);const b=await y(n,i);c(!1),b?(u(""),s(!1),o()):f("Cannot find dan sheet tab")},[y,n,i,s,o]),E=p?"block":"flex",k=p?"0.95rem":"1rem";return e.jsx(S.Fragment,{children:e.jsx("div",{style:{placeItems:"center",display:E},children:l?e.jsx(G,{}):e.jsx(S.Fragment,{children:e.jsxs("div",{style:{padding:20,fontSize:k},children:[e.jsx("strong",{children:"For Black Belt pickers only."}),e.jsx("br",{}),"Black Belt pickers currently use another scorecard system known as the Dan Sheet. This import allows them to bring their picking history over to the site. If you do not already have a tab in the Dan sheet, this import will not work for you. For those that do, specify the name of your tab in the sheet to import your history into your Scorecard. Please note that tab names are case sensitive. ",e.jsx(U,{onClick:()=>{a("/profile/scorecard/howto")},style:{color:"#bbb",cursor:"pointer"},children:"Click here to learn more."}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("div",{style:{padding:"0px",alignItems:"center"},children:e.jsxs("div",{style:{padding:"0px",display:"flex"},children:[e.jsx("div",{style:{flexGrow:1}}),e.jsx(Xe,{id:"tab-to-import",label:"Tab to Import",value:i,size:"small",error:!!d,helperText:d,margin:"dense",color:"secondary",onChange:b=>{u(b.target.value)}}),e.jsx(m,{style:{color:"#000",padding:0,lineHeight:"1rem",height:40,marginTop:8,marginLeft:10},variant:"contained",onClick:j,edge:"start",color:"secondary",children:"Import"})]})})]})})})})}function pt({id:s,owner:o}){const[n,y]=t.useState(null),{cardActivity:p}=t.useContext(de),l=p.filter(i=>i.id===s).filter(i=>i),c=t.useCallback(i=>{y(i)},[]),a=t.useCallback(()=>{y(null)},[]);return e.jsxs(S.Fragment,{children:[e.jsx(se,{title:"My Collection",arrow:!0,disableFocusListener:!0,children:e.jsx(ne,{variant:"outlined",color:"inherit",onClick:c,children:e.jsx(Ee,{color:l.length>0?"secondary":"inherit",fontSize:"medium"})})}),e.jsx(re,{sx:{color:"#fff",zIndex:i=>i.zIndex.drawer+1},open:!!n,onClick:null,children:!!n&&e.jsxs(ie,{style:{maxWidth:600,marginLeft:"auto",marginRight:"auto",border:"1px solid #666",opacity:1},children:[e.jsx(ae,{title:"Documentation",action:e.jsx(xe,{sx:{cursor:"pointer"}}),style:{paddingBottom:0},onClick:a}),e.jsxs(le,{children:[l.map((i,u)=>e.jsx(O,{activity:i,handleUpdate:a,source:"collectionButton",owner:o},u)),l.length===0&&e.jsx(O,{activity:null,lockId:s,handleUpdate:a,source:"collectionButton",owner:o})]})]})})]})}function xt({entry:s,owner:o}){const n=s.link?"#fff":"#888";return e.jsxs(st,{style:{minHeight:64,borderTop:"1px solid rgba(255, 255, 255, 0.12)",color:n},children:[e.jsx(tt,{value:s.belt}),e.jsx(De,{primary:ot(s),primaryTypographyProps:{fontWeight:500},secondary:s.version,secondaryTypographyProps:{color:n},style:{padding:"0px 0px 0px 10px"}}),e.jsx(Ge,{entry:s,color:n}),e.jsx(pt,{id:s.id,owner:o})]},s.id)}const mt=S.memo(xt);function ut({owner:s,popularEntries:o}){const{isMobile:n}=N(),{filters:y}=t.useContext(pe),[p,l]=t.useState(25),[c,a]=t.useState("all"),[i,u]=t.useState(!0),d=t.useMemo(()=>o.slice(0,p),[o,p]),f=t.useMemo(()=>c==="picked"?d.filter(x=>x.link):c==="notPicked"?d.filter(x=>!x.link):d,[c,d]),j=d.filter(x=>x.link).length,E=f.length>0?Math.floor(j/d.length*100):0,k=s?"You've picked":"Picked",b=Object.keys(y).filter(x=>x!=="locks"&&x!=="tab").length>0?"matching":"most popular",r=t.useCallback(x=>()=>{u(!1),setTimeout(()=>l(x),150),setTimeout(()=>u(!0),300)},[]),h=n?"block":"flex",C=p===25?"contained":"text",D=p===50?"contained":"text",T=p===100?"contained":"text",A=c==="all"?"contained":"text",R=c==="picked"?"contained":"text",_=c==="notPicked"?"contained":"text";return o?e.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[e.jsxs("div",{style:{width:"100%",textAlign:"center",padding:"0px 20px 24px 20px"},children:[e.jsx(Te,{in:i,children:e.jsxs("div",{style:{fontSize:"1.2rem",fontWeight:700},children:[k," ",j," of the ",d.length," ",b," locks in BB Scorecards (",E,"%)"]})}),"(only entries with documentation are counted)",e.jsxs("div",{style:{marginTop:20,display:h,padding:"0px 20px"},children:[e.jsxs("div",{style:{flexGrow:1,textAlign:"left",fontSize:"1rem",marginTop:6},children:[e.jsx(m,{onClick:()=>a("all"),color:"info",variant:A,value:"all",style:{padding:"2px 8px 2px 8px",minWidth:35,lineHeight:"1rem",marginRight:6},children:"All"}),e.jsx(m,{onClick:()=>a("picked"),color:"info",variant:R,value:"picked",style:{padding:"2px 8px 2px 8px",minWidth:35,lineHeight:"1rem",marginRight:2},children:"Picked"}),e.jsx(m,{onClick:()=>a("notPicked"),color:"info",variant:_,value:"notPicked",style:{padding:"2px 8px 2px 8px",minWidth:35,lineHeight:"1rem"},children:"Not Picked"})]}),e.jsxs("div",{style:{flexGrow:1,textAlign:"right",fontSize:"1rem",marginTop:6},children:["Top Locks:  ",e.jsx(m,{onClick:r(25),color:"info",variant:C,value:"25",style:{padding:"2px 2px 2px 2px",minWidth:35,lineHeight:"1rem"},children:"25"}),e.jsx(m,{onClick:r(50),variant:D,color:"info",value:"50",style:{padding:"2px 2px 2px 2px",minWidth:35,lineHeight:"1rem"},children:"50"}),e.jsx(m,{onClick:r(100),color:"info",variant:T,value:"100",style:{padding:"2px 2px 2px 2px",minWidth:35,lineHeight:"1rem"},children:"100"})]})]})]}),e.jsx("div",{children:f.map(x=>e.jsx(Se,{dense:!0,style:{padding:0},children:e.jsx(mt,{entry:x,owner:s})},x.id))})]}):e.jsx(G,{})}function ht({profile:s}){const{isMobile:o}=N(),{user:n}=t.useContext(ce),{oauthState:y}=t.useContext(M),p=(s==null?void 0:s.blackBeltAwardedAt)>0,[l,c]=t.useState(!1),a=t.useCallback(()=>{c(!l)},[l]),[i,u]=t.useState(!1),d=()=>{u(!1),c(!1)},f=()=>{u(!0)},j=t.useCallback(()=>{const{VITE_DISCORD_CLIENT_ID:h}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLSf_PQ6XXDYy0cTn_2MeDCwikTOYLRtncPKluFRK-QEYHX0qug",VITE_RAFL_STATE:"live",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},C=encodeURIComponent("identify"),D=encodeURIComponent(`${location.origin}/#/auth/discord`),T=`https://discord.com/oauth2/authorize?client_id=${h}&response_type=code&redirect_uri=${D}&scope=${C}`;window.location.assign(T)},[]),E=t.useCallback(async()=>{const{VITE_REDDIT_CLIENT_ID:h}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLSf_PQ6XXDYy0cTn_2MeDCwikTOYLRtncPKluFRK-QEYHX0qug",VITE_RAFL_STATE:"live",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},C=await y(n.uid),D=encodeURIComponent("identity flair privatemessages"),T=encodeURIComponent(`${location.origin}/#/auth/reddit`),A=`https://www.reddit.com/api/v1/authorize?client_id=${h}&response_type=code&state=${C}&redirect_uri=${T}&duration=temporary&scope=${D}`;window.location.assign(A)},[n,y]),k=o?"0.91rem":"1rem",b=o?"1.3rem":"1.5rem",r="IMPORT BELTS";return e.jsxs(S.Fragment,{children:[e.jsx(se,{title:"Import",arrow:!0,disableFocusListener:!0,children:e.jsx(m,{variant:"contained",color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginLeft:6},onClick:f,children:r})}),e.jsx(re,{sx:{color:"#fff",zIndex:h=>h.zIndex.drawer+1},open:i,onClick:null,children:i&&e.jsxs(ie,{style:{maxWidth:600,marginLeft:"auto",marginRight:"auto",border:"1px solid #666",opacity:1},children:[e.jsx(ae,{title:"Import Belts",action:e.jsx(xe,{sx:{cursor:"pointer"}}),style:{paddingBottom:0},onClick:d}),e.jsxs(le,{children:[e.jsxs(ee,{in:!l,children:[e.jsxs("div",{style:{padding:"0px 0px",fontSize:k,lineHeight:b},children:[e.jsx("strong",{children:"New!"})," Add your approved Belts (and Dan Levels) to your Scorecard. You'll need to authorize for each site, and we'll pull your username and approvals for you. Please note: you can only import belts already approved through the official process.",e.jsx("br",{}),e.jsx("br",{}),"You'll need to briefly authorize for each platform you use for belts. For Discord, we use the publicly available awards in #belt-requests so that linking is a simple confirmation of your username to determine which belts are yours. Reddit requests temporary permission in order to scan direct messages for belt awards. We cannot access and do not store your password.",e.jsx("br",{}),e.jsx("br",{}),e.jsxs("span",{style:{fontWeight:400},children:["New Discord approvals will be automatically added to your scorecard as long as there is a Discord username in your Profile. You only need to re-import from Discord if you want to add belts from an additional username.",e.jsx("br",{}),e.jsx("br",{}),"You'll need to import from Reddit again to pick up newly approved belts."]})]}),e.jsxs("div",{style:{padding:20,width:"100%",textAlign:"center"},children:[e.jsx("span",{style:{fontWeight:700},children:"Import From"}),e.jsx("br",{}),e.jsxs("div",{style:{marginTop:8},children:[e.jsx(m,{variant:"contained",color:"secondary",style:{lineHeight:"1.2rem"},onClick:j,children:"DISCORD"}),e.jsx(m,{variant:"contained",color:"secondary",style:{lineHeight:"1.2rem",marginLeft:16},onClick:E,children:"REDDIT"})]})]}),!p&&e.jsxs("div",{style:{padding:20,width:"100%",textAlign:"center"},children:["Black Belts only: ",e.jsx(U,{onClick:a,style:{color:"#99c2e5",cursor:"pointer"},children:"Import your Dan Sheet"})]})]}),e.jsx(ee,{in:l,children:l&&e.jsxs(S.Fragment,{children:[e.jsx(me,{}),e.jsxs("div",{style:{padding:20,width:"100%",textAlign:"center"},children:["Return to ",e.jsx(U,{onClick:a,style:{color:"#99c2e5",cursor:"pointer"},children:"Import Belts"})]})]})})]})]})})]})}function gt({owner:s,profile:o,adminAction:n,popular:y}){const{isMobile:p}=N(),{userId:l}=Y(),c=oe(),{visibleEntries:a=[],popularEntries:i=[],cardActivity:u}=t.useContext(de),{expanded:d}=t.useContext(Ve),{filters:f,setFilters:j,removeFilters:E}=t.useContext(pe),{name:k,locks:b}=f,{createEvidenceForEntries:r,removePickerActivity:h,refreshPickerActivity:C}=t.useContext(M),{admin:D}=t.useContext(Ae),[T,A]=t.useState(d),[R,_]=t.useState(!1),[x,V]=t.useState("import"),[w,L]=t.useState(!1),[I,W]=t.useState(b==="mostPopular"||y);d&&d!==T&&A(d);const F=t.useMemo(()=>{if(o&&o.recorded){const g=u.map($=>$.matchId);return o.recorded.filter($=>!g.includes($))}else return[]},[o,u]),v=t.useCallback(g=>{f.id&&E(["id"]),A(g)},[f,E]),P=t.useCallback(async()=>{L(!0),await r(l,F),_(!1),L(!1),n()},[r,l,F,n]),B=t.useCallback(g=>{V(g),_(!R)},[R]),[Q,X]=t.useState(null),ue=!!Q,he=t.useCallback(g=>{g.preventDefault(),g.stopPropagation(),X(g.currentTarget)},[]),z=t.useCallback(()=>X(null),[]),ge=t.useCallback(async()=>{L(!0),await h(u),z(),L(!1),n()},[u,h,z,n]),q=15,H=p?"block":"flex",ye=p?6:0,K=t.useCallback(()=>{j(I?{name:k}:{locks:"mostPopular",name:k}),W(!I)},[I,k,j]),je=t.useCallback(g=>{c(g)},[c]),fe=t.useCallback(async()=>{L(!0),await C(l),L(!1),n(),window.location.reload()},[n,C,l]),Ce=I?"text":"outlined",ve=I?"outlined":"text",ke=o!=null&&o.displayName&&!o.privacyAnonymous?o.displayName.toLowerCase().endsWith("s")?`${o.displayName}'`:`${o.displayName}'s`:"Anonymous",be=s?"My Locks":`${ke} Locks`,Ie=s?86:124;return e.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[e.jsx(Je,{profile:o,page:"scorecard",owner:s,mostPopular:I}),s&&a.length>0&&!o.tabClaimed&&e.jsx("div",{style:{margin:8,padding:"0px 0px"},children:e.jsx(et,{pageName:"scorecard"})}),a.length>0&&e.jsx(S.Fragment,{children:p?e.jsxs("div",{style:{display:H,padding:"0px 8px 0px 16px"},children:[(o==null?void 0:o.blackBeltAwardedAt)>0&&e.jsx(Z,{profile:o,owner:s}),e.jsx("div",{style:{marginRight:0,width:"95%"},children:e.jsx(J,{profile:o,entries:a})})]}):e.jsxs("div",{style:{display:H,padding:"10px 8px 0px 16px"},children:[e.jsx("div",{style:{marginRight:10,width:370},children:e.jsx(J,{profile:o,entries:a})}),o.danLevel>0&&e.jsx("div",{style:{flexGrow:1,marginRight:0},children:e.jsx(Z,{profile:o,owner:s})})]})}),e.jsxs(rt,{expanded:R,disableGutters:!0,children:[e.jsx(it,{style:{paddingLeft:q,paddingRight:q,placeItems:"center",width:"100%"},children:e.jsxs("div",{style:{width:"100%",placeItems:"center",textAlign:"center"},children:[e.jsxs("div",{style:{display:H,width:"100%",placeItems:"center",textAlign:"center"},children:[(s||D)&&e.jsxs("div",{style:{width:"100%",textAlign:"left"},children:[e.jsx(ht,{profile:o}),!I&&e.jsx(m,{variant:"outlined",color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginLeft:6},onClick:()=>B("project"),children:"ADD PROJECT"}),o&&o.blackBeltAwardedAt&&e.jsx(m,{variant:"outlined",color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginLeft:6},onClick:()=>je("/scorecard/info/FAQ"),children:"BB FAQ"})]}),e.jsxs("div",{style:{width:"100%",textAlign:"right",display:"flex",marginTop:ye},children:[e.jsx("div",{style:{flexGrow:1}}),e.jsx(m,{variant:Ce,color:"info",size:"small",style:{lineHeight:"1.2rem",minWidth:Ie,padding:"4px 10px"},onClick:()=>K(),children:e.jsx("nobr",{children:be})}),e.jsx(m,{variant:ve,color:"info",size:"small",style:{lineHeight:"1.2rem",marginLeft:6,width:122},onClick:()=>K(),children:"MOST POPULAR"})]})]}),w&&e.jsx(G,{}),D&&!w&&e.jsx("div",{style:{backgroundColor:"#700",padding:5,marginTop:20},children:e.jsxs("div",{style:{display:"flex"},children:[e.jsx("div",{style:{width:"10%",textAlign:"center"},children:"ADMIN"}),e.jsx(m,{color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginLeft:6},onClick:()=>B("award"),children:"ADD BELT"}),e.jsx(m,{color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:()=>B("import"),children:"IMPORT DAN SHEET"}),e.jsxs(m,{color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:P,children:["MERGE RECORDED (",F.length,")"]}),e.jsx(m,{color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:he,children:"DELETE SCORECARD"}),e.jsxs(Le,{anchorEl:Q,open:ue,onClose:z,children:[e.jsxs("div",{style:{padding:20,textAlign:"center"},children:["You cannot undo delete.",e.jsx("br",{}),"Are you sure?"]}),e.jsx("div",{style:{textAlign:"center"},children:e.jsx(m,{style:{marginBottom:10,color:"#000"},variant:"contained",onClick:ge,edge:"start",color:"error",children:"Delete"})})]}),e.jsx(ne,{color:"secondary",onClick:fe,children:e.jsx(nt,{})})]})})]})}),e.jsxs(at,{style:{backgroundColor:"#333"},children:[x==="import"&&e.jsx(me,{setControlsExpanded:_,adminAction:n}),x==="project"&&e.jsx(O,{activity:null,handleUpdate:B,addProject:!0,owner:s}),x==="award"&&e.jsx(O,{activity:null,handleUpdate:B,addAward:!0,owner:s})]})]}),!I&&e.jsxs(S.Fragment,{children:[a.length===0&&e.jsx(Ze,{}),e.jsx("div",{children:a.map(g=>e.jsx(Qe,{owner:s,activity:g,expanded:g.id===T,onExpand:v,merged:o.blackBeltAwardedAt>0},g.id))})]}),I&&e.jsx(ut,{owner:s,profile:o,adminAction:n,popularEntries:i})]})}function Co({mostPopular:s}){const{userId:o}=Y(),{user:n}=t.useContext(ce),{getProfile:y,getPickerActivity:p}=t.useContext(M),{scoredActivity:l,bbCount:c,danPoints:a,eligibleDan:i,nextDanPoints:u,nextDanLocks:d}=t.useContext(Re),{isMobile:f}=N(),[j,E]=t.useState(!1),k=t.useCallback(()=>{E(!j)},[j]),b=t.useCallback(async()=>{try{const v=await y(o);if(v){const P=v.displayName&&!v.privacyAnonymous?v.displayName.toLowerCase().endsWith("s")?`${v.displayName}'`:`${v.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${P} Scorecard`}if((n==null?void 0:n.uid)!==o){const P=await p(o);return{profile:v,..._e(P)}}else return{profile:v,scoredActivity:l,bbCount:c,danPoints:a,eligibleDan:i,nextDanPoints:u,nextDanLocks:d}}catch(v){return console.error("Error loading profile and activity.",v),null}},[j,y,o,n,p,l,c,a,i,u,d]),{data:r={},loading:h,error:C}=te({loadFn:b}),D=r?r.profile:{},T=r?r.scoredActivity:[],A=r?r.bbCount:0,R=r?r.danPoints:0,_=r?r.eligibleDan:0,x=r?r.nextDanPoints:0,V=r?r.nextDanLocks:0,w=te({url:Ne}),L=w.data?w.data.scorecardLocks:[],I=window.location.hash.search(/locks=mostPopular/)<1&&!s?e.jsxs(S.Fragment,{children:[e.jsx(dt,{label:"Scorecard",extraFilters:[{key:"tab",value:"search"}]}),e.jsx($e,{sortValues:He}),e.jsx(Ue,{extraFilters:[{key:"tab",value:"search"}]}),!f&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}):null,W=e.jsx("div",{style:{margin:"30px 0px"},children:e.jsx(lt,{text:!0})}),F=h?"Loading...":"Profile";return h||C?null:e.jsx(Oe,{filterFields:Me,children:e.jsx(We,{cardActivity:T,cardBBCount:A,cardDanPoints:R,cardEligibleDan:_,cardNextDanPoints:x,cardNextDanLocks:V,popularLocks:L,children:e.jsxs(ze,{children:[e.jsxs(qe,{adapterLocale:we.locale(),dateAdapter:Ke,children:[e.jsx(Fe,{title:F,extras:I}),h&&e.jsx(Ye,{}),!h&&r&&!C&&e.jsx(gt,{owner:n&&n.uid===o,profile:D,adminAction:k,popular:s}),!h&&(!r||C)&&e.jsx(ct,{}),e.jsx(Pe,{before:W})]}),e.jsx(Be,{feature:"scorecard"})]})})})}export{Co as default};