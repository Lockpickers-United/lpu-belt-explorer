import{ar as J,r as o,D as H,u as O,b as ie,j as e,R as S,B as m,J as ae,I as le,aw as De,aa as ce,a2 as de,ak as pe,a3 as me,W as Se,F as xe,ax as Ae,V as Le,A as ue,Z as we,ab as Re,S as _e,ah as Fe,ay as Pe,e as Be,d as Ne,N as Oe,h as Ve,T as We}from"./index-358cf55c.js";import{c as Me}from"./dataUrls-e1e30111.js";import{S as ze,a as He,b as $e}from"./ScorecardListContext-6af46cae.js";import{s as Ue}from"./filterFields-37f371ab.js";import{s as Ye}from"./sortFields-5471f00e.js";import{S as Ge,F as Qe}from"./SortButton-60254e9b.js";import{L as qe}from"./LoadingDisplay-bb4d2578.js";import{V as Xe,S as Ke}from"./ScorecardRow-2462507b.js";import{D as he}from"./DataContext-eb10ae68.js";import"./index-e21bed11.js";import{I as oe,S as se}from"./ScorecardDanStats-ed72e37b.js";import{L as Z}from"./LoadingDisplay-5feb4a2e.js";import{L as K}from"./Link-fd2326ea.js";import{T as Je}from"./TextField-c2add89f.js";import{d as ye,E as z,L as Ze,A as et}from"./EvidenceForm-682185a1.js";import{P as tt}from"./ProfileHeader-90fb1699.js";import{N as ot}from"./NoScorecardData-ec03d870.js";import{I as st}from"./IntroCopy-df666e11.js";import{B as nt}from"./BeltStripe-d4b00d94.js";import{e as rt}from"./entryName-c10c9242.js";import{L as it}from"./ListItem-ff62f672.js";import{d as at}from"./Cached-e6a1af99.js";import{C as ne}from"./Collapse-e0fa264c.js";import{A as lt,a as ct,b as dt}from"./AccordionSummary-6763eef5.js";import{E as pt}from"./ScorecardExportButton-2999824d.js";import{S as mt}from"./ScorecardProfileNotFound-a25ff479.js";import{S as xt}from"./FilterAlt-f3b196c0.js";import{u as re}from"./useData-2a4201a1.js";import"./rankingRequestData-d3ef79e5.js";import"./Sort-9379a15a.js";import"./Chip-42802da5.js";import"./Select-41c1ecaa.js";import"./Box-21b0306e.js";import"./LockListContext-5b2ba0d6.js";import"./LPU-c3fa7122.js";import"./LinearProgress-0411230a.js";import"./ExpandMore-4f5789bd.js";import"./FieldValue-9a21872d.js";import"./Link-c302e16a.js";import"./BeltIcon-b3d6f0f5.js";import"./chartDefaults-270235e0.js";import"./nivo-bar.es-ab13c826.js";import"./nivo-legends.es-403a6965.js";import"./index-15857fde.js";import"./CircularProgress-50f2494a.js";import"./Launch-b7cbfbbe.js";import"./PhotoCamera-800bf212.js";import"./Autocomplete-65fcf0fa.js";import"./DialogContent-c3dff8e9.js";import"./Dialog-b959fc28.js";import"./VideocamOutlined-a166c41c.js";import"./FormGroup-1ac54b05.js";import"./Checkbox-1483942c.js";import"./LoadingDisplaySmall-42cf73da.js";import"./CopyProfileLinkButton-46e25cc7.js";import"./ToggleButtonGroup-aa872cef.js";import"./mycollection-0ec86312.js";import"./index-1ec4a325.js";import"./index-0f5748aa.js";import"./index-542ac4d8.js";import"./download-b912248f.js";import"./List-1273c85a.js";import"./ContentCopy-2cbb5adb.js";import"./Search-eb4b844c.js";function ge({setControlsExpanded:s,adminAction:t}){const{userId:n}=J(),{importUnclaimedEvidence:u}=o.useContext(H),{isMobile:h}=O(),[i,y]=o.useState(!1),a=ie(),[l,j]=o.useState(""),[g,c]=o.useState(null),f=o.useCallback(async()=>{y(!0);const I=await u(n,l);y(!1),I?(j(""),s(!1),t()):c("Cannot find dan sheet tab")},[u,n,l,s,t]),v=h?"block":"flex",b=h?"0.95rem":"1rem";return e.jsx(S.Fragment,{children:e.jsx("div",{style:{placeItems:"center",display:v},children:i?e.jsx(Z,{}):e.jsx(S.Fragment,{children:e.jsxs("div",{style:{padding:20,fontSize:b},children:[e.jsx("strong",{children:"For Black Belt pickers only."}),e.jsx("br",{}),"Black Belt pickers currently use another scorecard system known as the Dan Sheet. This import allows them to bring their picking history over to the site. If you do not already have a tab in the Dan sheet, this import will not work for you. For those that do, specify the name of your tab in the sheet to import your history into your Scorecard. Please note that tab names are case sensitive. ",e.jsx(K,{onClick:()=>{a("/profile/scorecard/howto")},style:{color:"#bbb",cursor:"pointer"},children:"Click here to learn more."}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("div",{style:{padding:"0px",alignItems:"center"},children:e.jsxs("div",{style:{padding:"0px",display:"flex"},children:[e.jsx("div",{style:{flexGrow:1}}),e.jsx(Je,{id:"tab-to-import",label:"Tab to Import",value:l,size:"small",error:!!g,helperText:g,margin:"dense",color:"secondary",onChange:I=>{j(I.target.value)}}),e.jsx(m,{style:{color:"#000",padding:0,lineHeight:"1rem",height:40,marginTop:8,marginLeft:10},variant:"contained",onClick:f,edge:"start",color:"secondary",children:"Import"})]})})]})})})})}function ut({id:s,owner:t}){const[n,u]=o.useState(null),{cardActivity:h}=o.useContext(he),i=h.filter(l=>l.id===s).filter(l=>l),y=o.useCallback(l=>{u(l)},[]),a=o.useCallback(()=>{u(null)},[]);return e.jsxs(S.Fragment,{children:[e.jsx(ae,{title:"My Collection",arrow:!0,disableFocusListener:!0,children:e.jsx(le,{variant:"outlined",color:"inherit",onClick:y,children:e.jsx(De,{color:i.length>0?"secondary":"inherit",fontSize:"medium"})})}),e.jsx(ce,{sx:{color:"#fff",zIndex:l=>l.zIndex.drawer+1},open:!!n,onClick:null,children:!!n&&e.jsxs(de,{style:{maxWidth:600,marginLeft:"auto",marginRight:"auto",border:"1px solid #666",opacity:1},children:[e.jsx(pe,{title:"Documentation",action:e.jsx(ye,{sx:{cursor:"pointer"}}),style:{paddingBottom:0},onClick:a}),e.jsxs(me,{children:[i.map((l,j)=>e.jsx(z,{activity:l,handleUpdate:a,source:"collectionButton",owner:t},j)),i.length===0&&e.jsx(z,{activity:null,lockId:s,handleUpdate:a,source:"collectionButton",owner:t})]})]})})]})}function ht({entry:s,owner:t}){const n=s.link?"#fff":"#888";return e.jsxs(it,{style:{minHeight:64,borderTop:"1px solid rgba(255, 255, 255, 0.12)",color:n},children:[e.jsx(nt,{value:s.belt}),e.jsx(Se,{primary:rt(s),primaryTypographyProps:{fontWeight:500},secondary:s.version,secondaryTypographyProps:{color:n},style:{padding:"0px 0px 0px 10px"}}),e.jsx(Xe,{entry:s,color:n}),e.jsx(ut,{id:s.id,owner:t})]},s.id)}const yt=S.memo(ht);function gt({owner:s,popularEntries:t,popularType:n}){const{isMobile:u}=O(),{filters:h}=o.useContext(xe),[i,y]=o.useState(25),[a,l]=o.useState("all"),[j,g]=o.useState(!0),c=o.useMemo(()=>t.slice(0,i),[t,i]),f=o.useMemo(()=>a==="picked"?c.filter(p=>p.link):a==="notPicked"?c.filter(p=>!p.link):c,[a,c]),v=c.filter(p=>p.link).length,b=f.length>0?Math.floor(v/c.length*100):0,I=s?"You've picked":"Picked",D=Object.keys(h).filter(p=>p!=="locks"&&p!=="tab").length>0?"matching":"most popular",C=o.useCallback(p=>()=>{g(!1),setTimeout(()=>y(p),150),setTimeout(()=>g(!0),300)},[]),r=u?"block":"flex",k=i===25?"contained":"text",E=i===50?"contained":"text",A=i===100?"contained":"text",P=a==="all"?"contained":"text",B=a==="picked"?"contained":"text",R=a==="notPicked"?"contained":"text";return t?e.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[e.jsxs("div",{style:{width:"100%",textAlign:"center",padding:"0px 20px 24px 20px"},children:[e.jsx(Ae,{in:j,children:e.jsxs("div",{style:{fontSize:"1.2rem",fontWeight:700},children:[I," ",v," of the ",c.length," ",D," locks in ",n," Scorecards (",b,"%)"]})}),"(only entries with documentation are counted)",e.jsxs("div",{style:{marginTop:20,display:r,padding:"0px 20px"},children:[e.jsxs("div",{style:{flexGrow:1,textAlign:"left",fontSize:"1rem",marginTop:6},children:[e.jsx(m,{onClick:()=>l("all"),color:"info",variant:P,value:"all",style:{padding:"2px 8px 2px 8px",minWidth:35,lineHeight:"1rem",marginRight:6},children:"All"}),e.jsx(m,{onClick:()=>l("picked"),color:"info",variant:B,value:"picked",style:{padding:"2px 8px 2px 8px",minWidth:35,lineHeight:"1rem",marginRight:2},children:"Picked"}),e.jsx(m,{onClick:()=>l("notPicked"),color:"info",variant:R,value:"notPicked",style:{padding:"2px 8px 2px 8px",minWidth:35,lineHeight:"1rem"},children:"Not Picked"})]}),e.jsxs("div",{style:{flexGrow:1,textAlign:"right",fontSize:"1rem",marginTop:6},children:["Top Locks:  ",e.jsx(m,{onClick:C(25),color:"info",variant:k,value:"25",style:{padding:"2px 2px 2px 2px",minWidth:35,lineHeight:"1rem"},children:"25"}),e.jsx(m,{onClick:C(50),variant:E,color:"info",value:"50",style:{padding:"2px 2px 2px 2px",minWidth:35,lineHeight:"1rem"},children:"50"}),e.jsx(m,{onClick:C(100),color:"info",variant:A,value:"100",style:{padding:"2px 2px 2px 2px",minWidth:35,lineHeight:"1rem"},children:"100"})]})]})]}),e.jsx("div",{children:e.jsx(Le,{dense:!0,style:{padding:0},children:f.map(p=>e.jsx(yt,{entry:p,owner:s},p.id))})})]}):e.jsx(Z,{})}function jt({profile:s}){const{isMobile:t}=O(),{user:n}=o.useContext(ue),{oauthState:u}=o.useContext(H),h=(s==null?void 0:s.blackBeltAwardedAt)>0,[i,y]=o.useState(!1),a=o.useCallback(()=>{y(!i)},[i]),[l,j]=o.useState(!1),g=()=>{j(!1),y(!1)},c=()=>{j(!0)},f=o.useCallback(()=>{const{VITE_DISCORD_CLIENT_ID:C}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLSf_PQ6XXDYy0cTn_2MeDCwikTOYLRtncPKluFRK-QEYHX0qug",VITE_RAFL_STATE:"hidden",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},r=encodeURIComponent("identify"),k=encodeURIComponent(`${location.origin}/#/auth/discord`),E=`https://discord.com/oauth2/authorize?client_id=${C}&response_type=code&redirect_uri=${k}&scope=${r}`;window.location.assign(E)},[]),v=o.useCallback(async()=>{const{VITE_REDDIT_CLIENT_ID:C}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLSf_PQ6XXDYy0cTn_2MeDCwikTOYLRtncPKluFRK-QEYHX0qug",VITE_RAFL_STATE:"hidden",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},r=await u(n.uid),k=encodeURIComponent("identity flair privatemessages"),E=encodeURIComponent(`${location.origin}/#/auth/reddit`),A=`https://www.reddit.com/api/v1/authorize?client_id=${C}&response_type=code&state=${r}&redirect_uri=${E}&duration=temporary&scope=${k}`;window.location.assign(A)},[n,u]),b=t?"0.91rem":"1rem",I=t?"1.3rem":"1.5rem",D="IMPORT BELTS";return e.jsxs(S.Fragment,{children:[e.jsx(ae,{title:"Import",arrow:!0,disableFocusListener:!0,children:e.jsx(m,{variant:"contained",color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginLeft:6},onClick:c,children:D})}),e.jsx(ce,{sx:{color:"#fff",zIndex:C=>C.zIndex.drawer+1},open:l,onClick:null,children:l&&e.jsxs(de,{style:{maxWidth:600,marginLeft:"auto",marginRight:"auto",border:"1px solid #666",opacity:1},children:[e.jsx(pe,{title:"Import Belts",action:e.jsx(ye,{sx:{cursor:"pointer"}}),style:{paddingBottom:0},onClick:g}),e.jsxs(me,{children:[e.jsxs(ne,{in:!i,children:[e.jsxs("div",{style:{padding:"0px 0px",fontSize:b,lineHeight:I},children:[e.jsx("strong",{children:"New!"})," Add your approved Belts (and Dan Levels) to your Scorecard. You'll need to authorize for each site, and we'll pull your username and approvals for you. Please note: you can only import belts already approved through the official process.",e.jsx("br",{}),e.jsx("br",{}),"You'll need to briefly authorize for each platform you use for belts. For Discord, we use the publicly available awards in #belt-requests so that linking is a simple confirmation of your username to determine which belts are yours. Reddit requests temporary permission in order to scan direct messages for belt awards. We cannot access and do not store your password.",e.jsx("br",{}),e.jsx("br",{}),e.jsxs("span",{style:{fontWeight:400},children:["New Discord approvals will be automatically added to your scorecard as long as there is a Discord username in your Profile. You only need to re-import from Discord if you want to add belts from an additional username.",e.jsx("br",{}),e.jsx("br",{}),"You'll need to import from Reddit again to pick up newly approved belts."]})]}),e.jsxs("div",{style:{padding:20,width:"100%",textAlign:"center"},children:[e.jsx("span",{style:{fontWeight:700},children:"Import From"}),e.jsx("br",{}),e.jsxs("div",{style:{marginTop:8},children:[e.jsx(m,{variant:"contained",color:"secondary",style:{lineHeight:"1.2rem"},onClick:f,children:"DISCORD"}),e.jsx(m,{variant:"contained",color:"secondary",style:{lineHeight:"1.2rem",marginLeft:16},onClick:v,children:"REDDIT"})]})]}),!h&&e.jsxs("div",{style:{padding:20,width:"100%",textAlign:"center"},children:["Black Belts only: ",e.jsx(K,{onClick:a,style:{color:"#99c2e5",cursor:"pointer"},children:"Import your Dan Sheet"})]})]}),e.jsx(ne,{in:i,children:i&&e.jsxs(S.Fragment,{children:[e.jsx(ge,{}),e.jsxs("div",{style:{padding:20,width:"100%",textAlign:"center"},children:["Return to ",e.jsx(K,{onClick:a,style:{color:"#99c2e5",cursor:"pointer"},children:"Import Belts"})]})]})})]})]})})]})}function ft({owner:s,profile:t,adminAction:n,popular:u}){const{isMobile:h}=O(),{userId:i}=J(),y=ie(),{visibleEntries:a=[],popularEntries:l=[],bbPopularEntries:j=[],cardActivity:g,cardMaxBelt:c}=o.useContext(he),{expanded:f}=o.useContext(ze),{filters:v,setFilters:b,removeFilters:I}=o.useContext(xe),{name:D,locks:C}=v,{createEvidenceForEntries:r,removePickerActivity:k,refreshPickerActivity:E}=o.useContext(H),{admin:A}=o.useContext(we),[P,B]=o.useState(f),[R,p]=o.useState(!1),[N,$]=o.useState("import"),[V,L]=o.useState(!1),[T,U]=o.useState(C==="mostPopular"||u);f&&f!==P&&B(f);const w=o.useMemo(()=>{if(t&&t.recorded){const x=g.map(X=>X.matchId);return t.recorded.filter(X=>!x.includes(X))}else return[]},[t,g]),Y=o.useCallback(x=>{v.id&&I(["id"]),B(x)},[v,I]),G=o.useCallback(async()=>{L(!0),await r(i,w),p(!1),L(!1),n()},[r,i,w,n]),_=o.useCallback(x=>{$(x),p(!R)},[R]),[W,M]=o.useState(null),d=!!W,F=o.useCallback(x=>{x.preventDefault(),x.stopPropagation(),M(x.currentTarget)},[]),Q=o.useCallback(()=>M(null),[]),je=o.useCallback(async()=>{L(!0),await k(g),Q(),L(!1),n()},[g,k,Q,n]),ee=15,q=h?"block":"flex",fe=h?6:0,te=o.useCallback(()=>{b(T?{name:D}:{locks:"mostPopular",name:D}),U(!T)},[T,D,b]),ke=o.useCallback(x=>{y(x)},[y]),Ce=o.useCallback(async()=>{L(!0),await E(i),L(!1),n(),window.location.reload()},[n,E,i]),ve=T?"text":"outlined",be=T?"outlined":"text",Ie=t!=null&&t.displayName&&!t.privacyAnonymous?t.displayName.toLowerCase().endsWith("s")?`${t.displayName}'`:`${t.displayName}'s`:"Anonymous",Ee=s?"My Locks":`${Ie} Locks`,Te=s?86:124;return e.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[e.jsx(tt,{profile:t,page:"scorecard",owner:s,mostPopular:T}),s&&a.length===0&&!(t!=null&&t.tabClaimed)&&e.jsx("div",{style:{margin:8,padding:"0px 0px"},children:e.jsx(st,{pageName:"scorecard"})}),a.length>0&&e.jsx(S.Fragment,{children:h?e.jsxs("div",{style:{display:q,padding:"0px 8px 0px 16px"},children:[(t==null?void 0:t.blackBeltAwardedAt)>0&&e.jsx(se,{profile:t,owner:s}),e.jsx("div",{style:{marginRight:0,width:"95%"},children:e.jsx(oe,{profile:t,entries:a})})]}):e.jsxs("div",{style:{display:q,padding:"10px 8px 0px 16px"},children:[e.jsx("div",{style:{marginRight:10,width:370},children:e.jsx(oe,{profile:t,entries:a})}),t.danLevel>=0&&e.jsx("div",{style:{flexGrow:1,marginRight:0},children:e.jsx(se,{profile:t,owner:s})})]})}),e.jsxs(lt,{expanded:R,disableGutters:!0,children:[e.jsx(ct,{style:{paddingLeft:ee,paddingRight:ee,placeItems:"center",width:"100%"},children:e.jsxs("div",{style:{width:"100%",placeItems:"center",textAlign:"center"},children:[e.jsxs("div",{style:{display:q,width:"100%",placeItems:"center",textAlign:"center"},children:[(s||A)&&e.jsxs("div",{style:{width:"100%",textAlign:"left"},children:[e.jsx(jt,{profile:t}),!T&&e.jsx(m,{variant:"outlined",color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginLeft:6},onClick:()=>_("project"),children:"ADD PROJECT"}),t&&t.blackBeltAwardedAt&&e.jsx(m,{variant:"outlined",color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginLeft:6},onClick:()=>ke("/scorecard/info/FAQ"),children:"BB FAQ"})]}),e.jsxs("div",{style:{width:"100%",textAlign:"right",display:"flex",marginTop:fe},children:[e.jsx("div",{style:{flexGrow:1}}),e.jsx(m,{variant:ve,color:"info",size:"small",style:{lineHeight:"1.2rem",minWidth:Te,padding:"4px 10px"},onClick:()=>te(),children:e.jsx("nobr",{children:Ee})}),e.jsx(m,{variant:be,color:"info",size:"small",style:{lineHeight:"1.2rem",marginLeft:6,width:122},onClick:()=>te(),children:"MOST POPULAR"})]})]}),V&&e.jsx(Z,{}),A&&!V&&e.jsx("div",{style:{backgroundColor:"#700",padding:5,marginTop:20},children:e.jsxs("div",{style:{display:"flex"},children:[e.jsx("div",{style:{width:"10%",textAlign:"center"},children:"ADMIN"}),e.jsx(m,{color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginLeft:6},onClick:()=>_("award"),children:"ADD BELT"}),e.jsx(m,{color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:()=>_("import"),children:"IMPORT DAN SHEET"}),e.jsxs(m,{color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:G,children:["MERGE RECORDED (",w.length,")"]}),e.jsx(m,{color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:F,children:"DELETE SCORECARD"}),e.jsxs(Re,{anchorEl:W,open:d,onClose:Q,children:[e.jsxs("div",{style:{padding:20,textAlign:"center"},children:["You cannot undo delete.",e.jsx("br",{}),"Are you sure?"]}),e.jsx("div",{style:{textAlign:"center"},children:e.jsx(m,{style:{marginBottom:10,color:"#000"},variant:"contained",onClick:je,edge:"start",color:"error",children:"Delete"})})]}),e.jsx(le,{color:"secondary",onClick:Ce,children:e.jsx(at,{})})]})})]})}),e.jsxs(dt,{style:{backgroundColor:"#333"},children:[N==="import"&&e.jsx(ge,{setControlsExpanded:p,adminAction:n}),N==="project"&&e.jsx(z,{activity:null,handleUpdate:_,addProject:!0,owner:s}),N==="award"&&e.jsx(z,{activity:null,handleUpdate:_,addAward:!0,owner:s})]})]}),!T&&e.jsxs(S.Fragment,{children:[a.length===0&&e.jsx(ot,{}),e.jsx("div",{children:a.map(x=>e.jsx(Ke,{owner:s,activity:x,expanded:x.id===P,onExpand:Y,merged:t.blackBeltAwardedAt>0},x.id))})]}),T&&e.jsx(gt,{owner:s,profile:t,adminAction:n,popularType:(c==null?void 0:c.rank)<9?"all":"BB",popularEntries:(c==null?void 0:c.rank)<9?l:j})]})}function wo({mostPopular:s}){const{userId:t}=J(),{user:n}=o.useContext(ue),{getProfile:u,getPickerActivity:h}=o.useContext(H),{scoredActivity:i,bbCount:y,danPoints:a,eligibleDan:l,nextDanPoints:j,nextDanLocks:g,uniqueLocks:c,maxBelt:f}=o.useContext(_e),{isMobile:v}=O(),[b,I]=o.useState(!1),D=o.useCallback(()=>{I(!b)},[b]),C=o.useCallback(async()=>{try{const d=await u(t);if(d){const F=d.displayName&&!d.privacyAnonymous?d.displayName.toLowerCase().endsWith("s")?`${d.displayName}'`:`${d.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${F} Scorecard`}if((n==null?void 0:n.uid)!==t){const F=await h(t);return{profile:d,...Fe(F)}}else return{profile:d,scoredActivity:i,bbCount:y,danPoints:a,eligibleDan:l,nextDanPoints:j,nextDanLocks:g,uniqueLocks:c,maxBelt:f}}catch(d){return console.error("Error loading profile and activity.",d),null}},[b,u,t,n,h,i,y,a,l,j,g,c,f]),{data:r={},loading:k,error:E}=re({loadFn:C}),A=(n==null?void 0:n.uid)===t,P=r?r.profile:{},B=r?r.scoredActivity:[],R=r?r.bbCount:0,p=r?r.danPoints:0,N=r?r.eligibleDan:0,$=r?r.nextDanPoints:0,V=r?r.nextDanLocks:0,L=r?r.uniqueLocks:0,T=r?r.scoredActivity.filter(d=>d.collectionDB==="awards").map(d=>Pe[d.matchId]).filter(d=>d.awardType==="belt").sort((d,F)=>d.rank-F.rank):[],U=r?T[T.length-1]:{},w=re({url:Me}),Y=w.data?w.data.blackBeltOnly.listStats.recordedLocks.topItems:[],G=w.data?w.data.allUsers.listStats.recordedLocks.topItems:[],_=window.location.hash.search(/locks=mostPopular/)<1&&!s?e.jsxs(S.Fragment,{children:[e.jsx(xt,{label:"Scorecard",extraFilters:[{key:"tab",value:"search"}]}),e.jsx(Ge,{sortValues:Ye}),e.jsx(Qe,{extraFilters:[{key:"tab",value:"search"}]}),!v&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}):null,W=e.jsx("div",{style:{margin:"30px 0px"},children:e.jsx(pt,{text:!0})}),M=k?"Loading...":"Profile";return k||E?null:e.jsx(Be,{filterFields:Ue,children:e.jsx(He,{cardActivity:B,cardBBCount:R,cardDanPoints:p,cardEligibleDan:N,cardNextDanPoints:$,cardNextDanLocks:V,cardUniqueLocks:L,cardMaxBelt:U,popularLocks:G,popularLocksBB:Y,children:e.jsxs($e,{children:[e.jsxs(Ze,{adapterLocale:Ne.locale(),dateAdapter:et,children:[e.jsx(Oe,{title:M,extras:_}),k&&e.jsx(qe,{}),!k&&r&&!E&&e.jsx(ft,{owner:n&&(n==null?void 0:n.uid)===t,profile:P,adminAction:D,popular:s}),!k&&(!r||E)&&e.jsx(mt,{}),e.jsx(Ve,{before:W})]}),e.jsx(We,{feature:"scorecard",own:A})]})})})}export{wo as default};
