import{am as G,r as t,D as O,u as P,b as oe,j as e,R as S,B as m,G as se,I as ne,at as Ee,a8 as ie,a0 as re,ag as ae,a1 as le,U as Te,au as De,Q as Se,A as ce,X as Le,a9 as Ae,S as Re,af as _e,d as we,N as Fe,F as Pe,T as Be}from"./index-e2776fc1.js";import{c as Ne}from"./dataUrls-a7325920.js";import{D as de,F as pe,a as Oe,s as Me}from"./filterFields-d5f6e0a1.js";import{S as Ve,a as We,b as ze}from"./ScorecardListContext-8e881d21.js";import{s as He}from"./sortFields-8bfcc66d.js";import{S as $e,F as Ue}from"./SortButton-6120fa0d.js";import{L as Ye}from"./LoadingDisplay-69dbf72b.js";import{V as Ge,S as Qe}from"./ScorecardRow-065f992a.js";import"./index-43ca5ff6.js";import{I as J,S as Z}from"./ScorecardDanStats-8b4ba525.js";import{L as Q}from"./LoadingDisplay-2bdbe032.js";import{L as Y}from"./Link-d0e8a9a1.js";import{T as qe}from"./TextField-2c9ade0a.js";import{d as xe,E as N,L as Xe,A as Ke}from"./BeltIcon-69722dd8.js";import{P as Je}from"./ProfileHeader-15b6a56b.js";import{N as Ze}from"./NoScorecardData-3988b1d9.js";import{I as et}from"./IntroCopy-2368f9c8.js";import{B as tt}from"./BeltStripe-c7a2c688.js";import{e as ot}from"./entryName-2d7f4ae7.js";import{L as st}from"./ListItem-cc089e6d.js";import{d as nt}from"./Cached-e4302269.js";import{C as ee,A as it,a as rt,b as at}from"./AccordionSummary-3a6e2c14.js";import{E as lt}from"./ScorecardExportButton-5e457a48.js";import{S as ct}from"./ScorecardProfileNotFound-ef727a5d.js";import{S as dt}from"./SearchBox-024832e1.js";import{u as te}from"./useData-14de1077.js";import"./Badge-0b4e17da.js";import"./Chip-0113d76a.js";import"./Select-7747177d.js";import"./Box-d10df774.js";import"./Sort-bac75afc.js";import"./LockListContext-36f0846b.js";import"./LPU-c3fa7122.js";import"./LinearProgress-7753f135.js";import"./FieldValue-2b752e15.js";import"./Link-3b557916.js";import"./chartDefaults-9fc07b21.js";import"./nivo-bar.es-8a3f2abc.js";import"./nivo-legends.es-b7fd8f2c.js";import"./index-27ed37f9.js";import"./CircularProgress-6214258f.js";import"./Launch-5633aa7f.js";import"./PhotoCamera-7cc69aed.js";import"./Autocomplete-04d7794a.js";import"./DialogContent-3a555782.js";import"./Dialog-269d543e.js";import"./VideocamOutlined-ec65a351.js";import"./FormGroup-ff2d2c5c.js";import"./Checkbox-4e4cacf2.js";import"./LoadingDisplaySmall-a7e42445.js";import"./CopyProfileLinkButton-35778968.js";import"./ToggleButtonGroup-8c15f912.js";import"./mycollection-0ec86312.js";import"./download-1116b88c.js";import"./ContentCopy-4ec37d8f.js";import"./Search-d92fcfd4.js";function me({setControlsExpanded:s,adminAction:o}){const{userId:n}=G(),{importUnclaimedEvidence:y}=t.useContext(O),{isMobile:p}=P(),[l,c]=t.useState(!1),a=oe(),[r,u]=t.useState(""),[d,f]=t.useState(null),I=t.useCallback(async()=>{c(!0);const E=await y(n,r);c(!1),E?(u(""),s(!1),o()):f("Cannot find dan sheet tab")},[y,n,r,s,o]),C=p?"block":"flex",b=p?"0.95rem":"1rem";return e.jsx(S.Fragment,{children:e.jsx("div",{style:{placeItems:"center",display:C},children:l?e.jsx(Q,{}):e.jsx(S.Fragment,{children:e.jsxs("div",{style:{padding:20,fontSize:b},children:[e.jsx("strong",{children:"For Black Belt pickers only."}),e.jsx("br",{}),"Black Belt pickers currently use another scorecard system known as the Dan Sheet. This import allows them to bring their picking history over to the site. If you do not already have a tab in the Dan sheet, this import will not work for you. For those that do, specify the name of your tab in the sheet to import your history into your Scorecard. Please note that tab names are case sensitive. ",e.jsx(Y,{onClick:()=>{a("/profile/scorecard/howto")},style:{color:"#bbb",cursor:"pointer"},children:"Click here to learn more."}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("div",{style:{padding:"0px",alignItems:"center"},children:e.jsxs("div",{style:{padding:"0px",display:"flex"},children:[e.jsx("div",{style:{flexGrow:1}}),e.jsx(qe,{id:"tab-to-import",label:"Tab to Import",value:r,size:"small",error:!!d,helperText:d,margin:"dense",color:"secondary",onChange:E=>{u(E.target.value)}}),e.jsx(m,{style:{color:"#000",padding:0,lineHeight:"1rem",height:40,marginTop:8,marginLeft:10},variant:"contained",onClick:I,edge:"start",color:"secondary",children:"Import"})]})})]})})})})}function pt({id:s,owner:o}){const[n,y]=t.useState(null),{cardActivity:p}=t.useContext(de),l=p.filter(r=>r.id===s).filter(r=>r),c=t.useCallback(r=>{y(r)},[]),a=t.useCallback(()=>{y(null)},[]);return e.jsxs(S.Fragment,{children:[e.jsx(se,{title:"My Collection",arrow:!0,disableFocusListener:!0,children:e.jsx(ne,{variant:"outlined",color:"inherit",onClick:c,children:e.jsx(Ee,{color:l.length>0?"secondary":"inherit",fontSize:"medium"})})}),e.jsx(ie,{sx:{color:"#fff",zIndex:r=>r.zIndex.drawer+1},open:!!n,onClick:null,children:!!n&&e.jsxs(re,{style:{maxWidth:600,marginLeft:"auto",marginRight:"auto",border:"1px solid #666",opacity:1},children:[e.jsx(ae,{title:"Documentation",action:e.jsx(xe,{sx:{cursor:"pointer"}}),style:{paddingBottom:0},onClick:a}),e.jsxs(le,{children:[l.map((r,u)=>e.jsx(N,{activity:r,handleUpdate:a,source:"collectionButton",owner:o},u)),l.length===0&&e.jsx(N,{activity:null,lockId:s,handleUpdate:a,source:"collectionButton",owner:o})]})]})})]})}function xt({entry:s,owner:o}){const n=s.link?"#fff":"#888";return e.jsxs(st,{style:{minHeight:64,borderTop:"1px solid rgba(255, 255, 255, 0.12)",color:n},children:[e.jsx(tt,{value:s.belt}),e.jsx(Te,{primary:ot(s),primaryTypographyProps:{fontWeight:500},secondary:s.version,secondaryTypographyProps:{color:n},style:{padding:"0px 0px 0px 10px"}}),e.jsx(Ge,{entry:s,color:n}),e.jsx(pt,{id:s.id,owner:o})]},s.id)}const mt=S.memo(xt);function ut({owner:s,popularEntries:o}){const{isMobile:n}=P(),{filters:y}=t.useContext(pe),[p,l]=t.useState(25),[c,a]=t.useState("all"),[r,u]=t.useState(!0),d=t.useMemo(()=>o.slice(0,p),[o,p]),f=t.useMemo(()=>c==="picked"?d.filter(x=>x.link):c==="notPicked"?d.filter(x=>!x.link):d,[c,d]),I=d.filter(x=>x.link).length,C=f.length>0?Math.floor(I/d.length*100):0,b=s?"You've picked":"Picked",E=Object.keys(y).filter(x=>x!=="locks"&&x!=="tab").length>0?"matching":"most popular",T=t.useCallback(x=>()=>{u(!1),setTimeout(()=>l(x),150),setTimeout(()=>u(!0),300)},[]),i=n?"block":"flex",j=p===25?"contained":"text",k=p===50?"contained":"text",D=p===100?"contained":"text",L=c==="all"?"contained":"text",R=c==="picked"?"contained":"text",_=c==="notPicked"?"contained":"text";return o?e.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[e.jsxs("div",{style:{width:"100%",textAlign:"center",padding:"0px 20px 24px 20px"},children:[e.jsx(De,{in:r,children:e.jsxs("div",{style:{fontSize:"1.2rem",fontWeight:700},children:[b," ",I," of the ",d.length," ",E," locks in BB Scorecards (",C,"%)"]})}),"(only entries with documentation are counted)",e.jsxs("div",{style:{marginTop:20,display:i,padding:"0px 20px"},children:[e.jsxs("div",{style:{flexGrow:1,textAlign:"left",fontSize:"1rem",marginTop:6},children:[e.jsx(m,{onClick:()=>a("all"),color:"info",variant:L,value:"all",style:{padding:"2px 8px 2px 8px",minWidth:35,lineHeight:"1rem",marginRight:6},children:"All"}),e.jsx(m,{onClick:()=>a("picked"),color:"info",variant:R,value:"picked",style:{padding:"2px 8px 2px 8px",minWidth:35,lineHeight:"1rem",marginRight:2},children:"Picked"}),e.jsx(m,{onClick:()=>a("notPicked"),color:"info",variant:_,value:"notPicked",style:{padding:"2px 8px 2px 8px",minWidth:35,lineHeight:"1rem"},children:"Not Picked"})]}),e.jsxs("div",{style:{flexGrow:1,textAlign:"right",fontSize:"1rem",marginTop:6},children:["Top Locks:  ",e.jsx(m,{onClick:T(25),color:"info",variant:j,value:"25",style:{padding:"2px 2px 2px 2px",minWidth:35,lineHeight:"1rem"},children:"25"}),e.jsx(m,{onClick:T(50),variant:k,color:"info",value:"50",style:{padding:"2px 2px 2px 2px",minWidth:35,lineHeight:"1rem"},children:"50"}),e.jsx(m,{onClick:T(100),color:"info",variant:D,value:"100",style:{padding:"2px 2px 2px 2px",minWidth:35,lineHeight:"1rem"},children:"100"})]})]})]}),e.jsx("div",{children:f.map(x=>e.jsx(Se,{dense:!0,style:{padding:0},children:e.jsx(mt,{entry:x,owner:s})},x.id))})]}):e.jsx(Q,{})}function ht({profile:s}){const{isMobile:o}=P(),{user:n}=t.useContext(ce),{oauthState:y}=t.useContext(O),p=(s==null?void 0:s.blackBeltAwardedAt)>0,[l,c]=t.useState(!1),a=t.useCallback(()=>{c(!l)},[l]),[r,u]=t.useState(!1),d=()=>{u(!1),c(!1)},f=()=>{u(!0)},I=t.useCallback(()=>{const{VITE_DISCORD_CLIENT_ID:i}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLSf_PQ6XXDYy0cTn_2MeDCwikTOYLRtncPKluFRK-QEYHX0qug",VITE_RAFL_STATE:"live",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},j=encodeURIComponent("identify"),k=encodeURIComponent(`${location.origin}/#/auth/discord`),D=`https://discord.com/oauth2/authorize?client_id=${i}&response_type=code&redirect_uri=${k}&scope=${j}`;window.location.assign(D)},[]),C=t.useCallback(async()=>{const{VITE_REDDIT_CLIENT_ID:i}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLSf_PQ6XXDYy0cTn_2MeDCwikTOYLRtncPKluFRK-QEYHX0qug",VITE_RAFL_STATE:"live",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},j=await y(n.uid),k=encodeURIComponent("identity flair privatemessages"),D=encodeURIComponent(`${location.origin}/#/auth/reddit`),L=`https://www.reddit.com/api/v1/authorize?client_id=${i}&response_type=code&state=${j}&redirect_uri=${D}&duration=temporary&scope=${k}`;window.location.assign(L)},[n,y]),b=o?"0.91rem":"1rem",E=o?"1.3rem":"1.5rem",T="IMPORT BELTS";return e.jsxs(S.Fragment,{children:[e.jsx(se,{title:"Import",arrow:!0,disableFocusListener:!0,children:e.jsx(m,{variant:"contained",color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginLeft:6},onClick:f,children:T})}),e.jsx(ie,{sx:{color:"#fff",zIndex:i=>i.zIndex.drawer+1},open:r,onClick:null,children:r&&e.jsxs(re,{style:{maxWidth:600,marginLeft:"auto",marginRight:"auto",border:"1px solid #666",opacity:1},children:[e.jsx(ae,{title:"Import Belts",action:e.jsx(xe,{sx:{cursor:"pointer"}}),style:{paddingBottom:0},onClick:d}),e.jsxs(le,{children:[e.jsxs(ee,{in:!l,children:[e.jsxs("div",{style:{padding:"0px 0px",fontSize:b,lineHeight:E},children:[e.jsx("strong",{children:"New!"})," Add your approved Belts (and Dan Levels) to your Scorecard. You'll need to authorize for each site, and we'll pull your username and approvals for you. Please note: you can only import belts already approved through the official process.",e.jsx("br",{}),e.jsx("br",{}),"You'll need to briefly authorize for each platform you use for belts. For Discord, we use the publicly available awards in #belt-requests so that linking is a simple confirmation of your username to determine which belts are yours. Reddit requests temporary permission in order to scan direct messages for belt awards. We cannot access and do not store your password.",e.jsx("br",{}),e.jsx("br",{}),e.jsxs("span",{style:{fontWeight:400},children:["New Discord approvals will be automatically added to your scorecard as long as there is a Discord username in your Profile. You only need to re-import from Discord if you want to add belts from an additional username.",e.jsx("br",{}),e.jsx("br",{}),"You'll need to import from Reddit again to pick up newly approved belts."]})]}),e.jsxs("div",{style:{padding:20,width:"100%",textAlign:"center"},children:[e.jsx("span",{style:{fontWeight:700},children:"Import From"}),e.jsx("br",{}),e.jsxs("div",{style:{marginTop:8},children:[e.jsx(m,{variant:"contained",color:"secondary",style:{lineHeight:"1.2rem"},onClick:I,children:"DISCORD"}),e.jsx(m,{variant:"contained",color:"secondary",style:{lineHeight:"1.2rem",marginLeft:16},onClick:C,children:"REDDIT"})]})]}),!p&&e.jsxs("div",{style:{padding:20,width:"100%",textAlign:"center"},children:["Black Belts only: ",e.jsx(Y,{onClick:a,style:{color:"#99c2e5",cursor:"pointer"},children:"Import your Dan Sheet"})]})]}),e.jsx(ee,{in:l,children:l&&e.jsxs(S.Fragment,{children:[e.jsx(me,{}),e.jsxs("div",{style:{padding:20,width:"100%",textAlign:"center"},children:["Return to ",e.jsx(Y,{onClick:a,style:{color:"#99c2e5",cursor:"pointer"},children:"Import Belts"})]})]})})]})]})})]})}function gt({owner:s,profile:o,adminAction:n,popular:y}){const{isMobile:p}=P(),{userId:l}=G(),c=oe(),{visibleEntries:a=[],popularEntries:r=[],cardActivity:u}=t.useContext(de),{expanded:d}=t.useContext(Ve),{filters:f,setFilters:I,removeFilters:C}=t.useContext(pe),{name:b,locks:E}=f,{createEvidenceForEntries:T,removePickerActivity:i,refreshPickerActivity:j}=t.useContext(O),{admin:k}=t.useContext(Le),[D,L]=t.useState(d),[R,_]=t.useState(!1),[x,M]=t.useState("import"),[B,A]=t.useState(!1),[v,V]=t.useState(E==="mostPopular"||y);d&&d!==D&&L(d);const F=t.useMemo(()=>{if(o&&o.recorded){const g=u.map(U=>U.matchId);return o.recorded.filter(U=>!g.includes(U))}else return[]},[o,u]),W=t.useCallback(g=>{f.id&&C(["id"]),L(g)},[f,C]),z=t.useCallback(async()=>{A(!0),await T(l,F),_(!1),A(!1),n()},[T,l,F,n]),h=t.useCallback(g=>{M(g),_(!R)},[R]),[w,q]=t.useState(null),ue=!!w,he=t.useCallback(g=>{g.preventDefault(),g.stopPropagation(),q(g.currentTarget)},[]),H=t.useCallback(()=>q(null),[]),ge=t.useCallback(async()=>{A(!0),await i(u),H(),A(!1),n()},[u,i,H,n]),X=15,$=p?"block":"flex",ye=p?6:0,K=t.useCallback(()=>{I(v?{name:b}:{locks:"mostPopular",name:b}),V(!v)},[v,b,I]),je=t.useCallback(g=>{c(g)},[c]),fe=t.useCallback(async()=>{A(!0),await j(l),A(!1),n(),window.location.reload()},[n,j,l]),Ce=v?"text":"outlined",ke=v?"outlined":"text",ve=o!=null&&o.displayName&&!o.privacyAnonymous?o.displayName.toLowerCase().endsWith("s")?`${o.displayName}'`:`${o.displayName}'s`:"Anonymous",Ie=s?"My Locks":`${ve} Locks`,be=s?86:124;return e.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[e.jsx(Je,{profile:o,page:"scorecard",owner:s,mostPopular:v}),s&&a.length>0&&!o.tabClaimed&&e.jsx("div",{style:{margin:8,padding:"0px 0px"},children:e.jsx(et,{pageName:"scorecard"})}),a.length>0&&e.jsx(S.Fragment,{children:p?e.jsxs("div",{style:{display:$,padding:"0px 8px 0px 16px"},children:[(o==null?void 0:o.blackBeltAwardedAt)>0&&e.jsx(Z,{profile:o,owner:s}),e.jsx("div",{style:{marginRight:0,width:"95%"},children:e.jsx(J,{profile:o,entries:a})})]}):e.jsxs("div",{style:{display:$,padding:"10px 8px 0px 16px"},children:[e.jsx("div",{style:{marginRight:10,width:370},children:e.jsx(J,{profile:o,entries:a})}),o.danLevel>0&&e.jsx("div",{style:{flexGrow:1,marginRight:0},children:e.jsx(Z,{profile:o,owner:s})})]})}),e.jsxs(it,{expanded:R,disableGutters:!0,children:[e.jsx(rt,{style:{paddingLeft:X,paddingRight:X,placeItems:"center",width:"100%"},children:e.jsxs("div",{style:{width:"100%",placeItems:"center",textAlign:"center"},children:[e.jsxs("div",{style:{display:$,width:"100%",placeItems:"center",textAlign:"center"},children:[(s||k)&&e.jsxs("div",{style:{width:"100%",textAlign:"left"},children:[e.jsx(ht,{profile:o}),!v&&e.jsx(m,{variant:"outlined",color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginLeft:6},onClick:()=>h("project"),children:"ADD PROJECT"}),o&&o.blackBeltAwardedAt&&e.jsx(m,{variant:"outlined",color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginLeft:6},onClick:()=>je("/scorecard/info/FAQ"),children:"BB FAQ"})]}),e.jsxs("div",{style:{width:"100%",textAlign:"right",display:"flex",marginTop:ye},children:[e.jsx("div",{style:{flexGrow:1}}),e.jsx(m,{variant:Ce,color:"info",size:"small",style:{lineHeight:"1.2rem",minWidth:be,padding:"4px 10px"},onClick:()=>K(),children:e.jsx("nobr",{children:Ie})}),e.jsx(m,{variant:ke,color:"info",size:"small",style:{lineHeight:"1.2rem",marginLeft:6,width:122},onClick:()=>K(),children:"MOST POPULAR"})]})]}),B&&e.jsx(Q,{}),k&&!B&&e.jsx("div",{style:{backgroundColor:"#700",padding:5,marginTop:20},children:e.jsxs("div",{style:{display:"flex"},children:[e.jsx("div",{style:{width:"10%",textAlign:"center"},children:"ADMIN"}),e.jsx(m,{color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginLeft:6},onClick:()=>h("award"),children:"ADD BELT"}),e.jsx(m,{color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:()=>h("import"),children:"IMPORT DAN SHEET"}),e.jsxs(m,{color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:z,children:["MERGE RECORDED (",F.length,")"]}),e.jsx(m,{color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:he,children:"DELETE SCORECARD"}),e.jsxs(Ae,{anchorEl:w,open:ue,onClose:H,children:[e.jsxs("div",{style:{padding:20,textAlign:"center"},children:["You cannot undo delete.",e.jsx("br",{}),"Are you sure?"]}),e.jsx("div",{style:{textAlign:"center"},children:e.jsx(m,{style:{marginBottom:10,color:"#000"},variant:"contained",onClick:ge,edge:"start",color:"error",children:"Delete"})})]}),e.jsx(ne,{color:"secondary",onClick:fe,children:e.jsx(nt,{})})]})})]})}),e.jsxs(at,{style:{backgroundColor:"#333"},children:[x==="import"&&e.jsx(me,{setControlsExpanded:_,adminAction:n}),x==="project"&&e.jsx(N,{activity:null,handleUpdate:h,addProject:!0,owner:s}),x==="award"&&e.jsx(N,{activity:null,handleUpdate:h,addAward:!0,owner:s})]})]}),!v&&e.jsxs(S.Fragment,{children:[a.length===0&&e.jsx(Ze,{}),e.jsx("div",{children:a.map(g=>e.jsx(Qe,{owner:s,activity:g,expanded:g.id===D,onExpand:W,merged:o.blackBeltAwardedAt>0},g.id))})]}),v&&e.jsx(ut,{owner:s,profile:o,adminAction:n,popularEntries:r})]})}function Co({mostPopular:s}){const{userId:o}=G(),{user:n}=t.useContext(ce),{getProfile:y,getPickerActivity:p}=t.useContext(O),{scoredActivity:l,bbCount:c,danPoints:a,eligibleDan:r,nextDanPoints:u,nextDanLocks:d,uniqueLocks:f}=t.useContext(Re),{isMobile:I}=P(),[C,b]=t.useState(!1),E=t.useCallback(()=>{b(!C)},[C]),T=t.useCallback(async()=>{try{const h=await y(o);if(h){const w=h.displayName&&!h.privacyAnonymous?h.displayName.toLowerCase().endsWith("s")?`${h.displayName}'`:`${h.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${w} Scorecard`}if((n==null?void 0:n.uid)!==o){const w=await p(o);return{profile:h,..._e(w)}}else return{profile:h,scoredActivity:l,bbCount:c,danPoints:a,eligibleDan:r,nextDanPoints:u,nextDanLocks:d,uniqueLocks:f}}catch(h){return console.error("Error loading profile and activity.",h),null}},[C,y,o,n==null?void 0:n.uid,p,l,c,a,r,u,d,f]),{data:i={},loading:j,error:k}=te({loadFn:T}),D=i?i.profile:{},L=i?i.scoredActivity:[],R=i?i.bbCount:0,_=i?i.danPoints:0,x=i?i.eligibleDan:0,M=i?i.nextDanPoints:0,B=i?i.nextDanLocks:0,A=i?i.uniqueLocks:0,v=te({url:Ne}),V=v.data?v.data.blackBeltOnly.listStats.recordedLocks.topItems:[],F=window.location.hash.search(/locks=mostPopular/)<1&&!s?e.jsxs(S.Fragment,{children:[e.jsx(dt,{label:"Scorecard",extraFilters:[{key:"tab",value:"search"}]}),e.jsx($e,{sortValues:He}),e.jsx(Ue,{extraFilters:[{key:"tab",value:"search"}]}),!I&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}):null,W=e.jsx("div",{style:{margin:"30px 0px"},children:e.jsx(lt,{text:!0})}),z=j?"Loading...":"Profile";return j||k?null:e.jsx(Oe,{filterFields:Me,children:e.jsx(We,{cardActivity:L,cardBBCount:R,cardDanPoints:_,cardEligibleDan:x,cardNextDanPoints:M,cardNextDanLocks:B,popularLocks:V,cardUniqueLocks:A,children:e.jsxs(ze,{children:[e.jsxs(Xe,{adapterLocale:we.locale(),dateAdapter:Ke,children:[e.jsx(Fe,{title:z,extras:F}),j&&e.jsx(Ye,{}),!j&&i&&!k&&e.jsx(gt,{owner:n&&n.uid===o,profile:D,adminAction:E,popular:s}),!j&&(!i||k)&&e.jsx(ct,{}),e.jsx(Pe,{before:W})]}),e.jsx(Be,{feature:"scorecard"})]})})})}export{Co as default};
