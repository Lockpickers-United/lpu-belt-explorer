import{ac as M,r as s,J as O,p as ie,j as e,R as D,t as p,A as re,C as le,a1 as R,a2 as Te,v as te,T as ce,I as q,a9 as se,ai as Ie,a3 as Be,V as Fe,a7 as Re,W as Ne,z as Me,aj as He,F as ze,ak as We,M as Oe,U as _e,al as $e,am as Ue,N as Ve,O as Ge,P as qe}from"./index-b4a073ec.js";import{u as ne}from"./useData-7477d88e.js";import{V as Je,I as oe,S as ae,a as Ye}from"./ScorecardDanStats-1d98e8c7.js";import{D as de,e as Ke,F as xe,a as Qe,s as Xe}from"./index-46a952c0.js";import{S as Ze,a as et,b as tt}from"./ScorecardListContext-dfbf8558.js";import{u as H}from"./useWindowSize-7d42790c.js";import{L as J}from"./LoadingDisplay-ab3c3ce7.js";import{L as st}from"./Link-306a9ec2.js";import{T as nt}from"./TextField-3fecd5bb.js";import{L as pe,A as ue,D as ot,d as at,E as G}from"./CollectionButton-857098bc.js";import{P as it}from"./ProfileHeader-641ef3da.js";import{B as he}from"./BeltStripe-cc9cd068.js";import{F as rt,d as lt}from"./FieldValue-e20181cc.js";import{A as me,a as ge,b as ye}from"./AccordionSummary-5341f3c7.js";import{N as ct,E as dt}from"./ScorecardExportButton-3a7b4848.js";import{I as xt}from"./IntroCopy-223d6705.js";import{L as pt}from"./ListItem-34efa3b0.js";import{L as ut}from"./LoadingDisplay-43a7d646.js";import{P as ht}from"./ProfileNotFound-7a320124.js";import{S as mt,a as gt,s as yt,F as jt}from"./sortFields-0947281c.js";import{S as ft}from"./SystemMessage-90b3ffad.js";import{f as vt}from"./dataUrls-b6a2c15e.js";import"./Link-0ccf7e5d.js";import"./chartDefaults-9fc07b21.js";import"./nivo-bar.es-8a26dbf4.js";import"./nivo-legends.es-f166c658.js";import"./index-394366e5.js";import"./Box-816b4047.js";import"./Select-60e2867e.js";import"./PhotoCamera-4a5b959a.js";import"./Launch-7363cc7a.js";import"./Autocomplete-8bb3323b.js";import"./Search-d2948f7b.js";import"./Dialog-b5051c6c.js";import"./CopyProfileLinkButton-bc95eaaa.js";import"./ToggleButtonGroup-430a7d63.js";import"./mycollection-0ec86312.js";import"./download-6a25d73b.js";import"./ContentCopy-88d5add6.js";import"./LPU-c3fa7122.js";import"./LinearProgress-897a7bf2.js";import"./Sort-006301d2.js";function kt({setControlsExpanded:n,adminAction:t}){const{userId:a}=M(),{importUnclaimedEvidence:h}=s.useContext(O),{isMobile:r}=H(),[u,o]=s.useState(!1),l=ie(),[x,m]=s.useState(""),[d,C]=s.useState(null),j=s.useCallback(async()=>{o(!0);const S=await h(a,x);o(!1),S?(m(""),n(!1),t()):C("Cannot find dan sheet tab")},[h,a,x,n,t]),b=r?"block":"flex";return e.jsx(D.Fragment,{children:e.jsx("div",{style:{placeItems:"center",display:b},children:u?e.jsx(J,{}):e.jsx(D.Fragment,{children:e.jsxs("div",{style:{padding:20},children:[e.jsx("strong",{children:"For Black Belt pickers only."}),e.jsx("br",{}),"Black Belt pickers currently use another scorecard system known as the Dan Sheet. This import allows them to bring their picking history over to the site. If you do not already have a tab in the Dan sheet, this import will not work for you. For those that do, specify the name of your tab in the sheet to import your history into your Scorecard. Please note that tab names are case sensitive. ",e.jsx(st,{onClick:()=>{l("/profile/scorecard/howto")},style:{color:"#bbb",cursor:"pointer"},children:"Click here to learn more."}),e.jsx("br",{}),e.jsx("br",{}),e.jsx("div",{style:{padding:"0px",alignItems:"center"},children:e.jsxs("div",{style:{padding:"0px",display:"flex"},children:[e.jsx("div",{style:{flexGrow:1}}),e.jsx(nt,{id:"tab-to-import",label:"Tab to Import",value:x,size:"small",error:!!d,helperText:d,margin:"dense",color:"secondary",onChange:S=>{m(S.target.value)}}),e.jsx(p,{style:{color:"#000",padding:0,lineHeight:"1rem",height:40,marginTop:8,marginLeft:10},variant:"contained",onClick:j,edge:"start",color:"secondary",children:"Import"})]})})]})})})})}var Y={},Ct=le;Object.defineProperty(Y,"__esModule",{value:!0});var je=Y.default=void 0,bt=Ct(re()),St=e;je=Y.default=(0,bt.default)((0,St.jsx)("path",{d:"M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3m-3 11H8v-5h8zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1m-1-9H6v4h12z"}),"Print");R.extend(Te);function Et({owner:n,date:t}){const{userId:a}=M(),{updateProfileBlackBeltAwardedAt:h}=s.useContext(O),[r,u]=s.useState(!1),[o,l]=s.useState(!1),[x,m]=s.useState(R.utc(t)),d=ie(),C=s.useCallback((f,F)=>{n&&u(F)},[n]),j=s.useCallback(()=>{m(R.utc(t)),l(!1)},[t]),b=s.useCallback(async()=>{try{h(a,x),te("Profile updated"),l(!1)}catch(f){console.error("Error while updating profile",f),te("Error while updating profile")}},[a,x,h]),S=s.useCallback(f=>{f.preventDefault(),f.stopPropagation(),d("/award")},[d]);let v=t?R.utc(t).format("L"):"(no date)";v=v.replace("/202","/2"),v=v.replace("/201","/1");const i={maxWidth:700,marginLeft:"auto",marginRight:"auto",display:"flex",placeItems:"center"},k=n?{}:{cursor:"default"},w=n?e.jsx(lt,{}):null,{isMobile:P}=H(),B=P?"block":"flex",L=P?"65%":"56%",T=P?{display:"block",marginLeft:0,placeItems:"center"}:{display:"flex",margin:"0px 0px 0px 20px"},A=o?"#fff":"#555",c=o?"#e15c07":"#555";return e.jsxs(D.Fragment,{children:[e.jsxs(me,{expanded:r,onChange:C,children:[e.jsxs(ge,{expandIcon:w,style:{...i,...k},children:[e.jsx(he,{value:"Black"}),e.jsx("div",{style:{margin:"4px 0px 0px 8px",width:L,flexShrink:0,flexDirection:"column"},children:e.jsx(rt,{value:"Black Belt Awarded",textStyle:{marginLeft:"0px",fontWeight:700},style:{marginBottom:"2px"}})}),e.jsxs("div",{style:{display:B,placeItems:"center",marginLeft:10},children:[e.jsx("div",{style:{display:"flex",width:76}}),e.jsx("div",{style:T,children:e.jsx("div",{style:{margin:"4px 0px 0px 10px"},children:v})}),n&&e.jsx(ce,{title:"Print Certificate",arrow:!0,disableFocusListener:!0,children:e.jsx(q,{onClick:S,style:{marginLeft:30},children:e.jsx(je,{})})})]})]}),r&&e.jsx(ye,{sx:{padding:"4px 16px 0px 26px"},children:e.jsx(pe,{adapterLocale:R.locale(),dateAdapter:ue,children:e.jsx(D.Fragment,{children:e.jsxs("div",{style:{display:"flex",width:"100%",marginBottom:20},children:[e.jsx(ot,{label:"Awarded date",value:x,onChange:f=>{m(f),l(!0)},sx:{width:400},disableFuture:!0}),e.jsxs("div",{style:{width:"100%",textAlign:"right",position:"relative",top:"30px",padding:"0px 12px 8px 0px"},children:[e.jsx(p,{style:{marginRight:10,color:c},onClick:j,disabled:!o,children:"Cancel"}),e.jsx(p,{style:{marginRight:0,color:A},onClick:b,disabled:!o,children:"Save"})]})]})})})})]}),e.jsx(se,{}),e.jsx(se,{})]})}function wt({id:n}){const[t,a]=s.useState(null),{cardEvidence:h}=s.useContext(de),r=h.filter(l=>l.id===n).filter(l=>l);console.log("id",n);const u=s.useCallback(l=>{a(l)},[]),o=s.useCallback(()=>{a(null)},[]);return e.jsxs(D.Fragment,{children:[e.jsx(ce,{title:"My Collection",arrow:!0,disableFocusListener:!0,children:e.jsx(q,{variant:"outlined",color:"inherit",onClick:u,children:e.jsx(Ie,{color:r.length>0?"secondary":"inherit",fontSize:"medium"})})}),e.jsx(Be,{sx:{color:"#fff",zIndex:l=>l.zIndex.drawer+1},open:!!t,onClick:null,children:!!t&&e.jsxs(Fe,{style:{maxWidth:600,marginLeft:"auto",marginRight:"auto",border:"1px solid #666",opacity:1},children:[e.jsx(Re,{title:"Documentation",action:e.jsx(at,{sx:{cursor:"pointer"}}),style:{paddingBottom:0},onClick:o}),e.jsxs(Ne,{children:[r.map((l,x)=>e.jsx(G,{evid:l,handleUpdate:o,source:"collectionButton"},x)),r.length===0&&e.jsx(G,{evid:null,lockId:n,handleUpdate:o,source:"collectionButton"})]})]})})]})}function Pt({entry:n}){const t=n.link?"#fff":"#888";return e.jsxs(pt,{style:{minHeight:64,borderTop:"1px solid rgba(255, 255, 255, 0.12)",color:t},children:[e.jsx(he,{value:n.belt}),e.jsx(Me,{primary:Ke(n),primaryTypographyProps:{fontWeight:500},secondary:n.version,secondaryTypographyProps:{color:t},style:{padding:"0px 0px 0px 10px"}}),e.jsx(Je,{entry:n,color:t}),e.jsx(wt,{id:n.id})]},n.id)}const At=D.memo(Pt);function Dt({owner:n,popularEntries:t}){const{isMobile:a}=H(),{filters:h}=s.useContext(xe),[r,u]=s.useState(25),[o,l]=s.useState("all"),[x,m]=s.useState(!0),d=s.useMemo(()=>t.slice(0,r),[t,r]),C=s.useMemo(()=>o==="picked"?d.filter(c=>c.link):o==="notPicked"?d.filter(c=>!c.link):d,[o,d]),j=d.filter(c=>c.link).length,b=C.length>0?Math.floor(j/d.length*100):0,S=n?"You've picked":"Picked",v=Object.keys(h).filter(c=>c!=="locks"&&c!=="tab").length>0?"matching":"most popular",i=s.useCallback(c=>()=>{m(!1),setTimeout(()=>u(c),150),setTimeout(()=>m(!0),300)},[]),k=a?"block":"flex",w=r===25?"contained":"text",P=r===50?"contained":"text",B=r===100?"contained":"text",L=o==="all"?"contained":"text",T=o==="picked"?"contained":"text",A=o==="notPicked"?"contained":"text";return t?e.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[e.jsxs("div",{style:{width:"100%",textAlign:"center",padding:"0px 20px 24px 20px"},children:[e.jsx(He,{in:x,children:e.jsxs("div",{style:{fontSize:"1.2rem",fontWeight:700},children:[S," ",j," of the ",d.length," ",v," locks in BB Scorecards (",b,"%)"]})}),"(only entries with documentation are counted)",e.jsxs("div",{style:{marginTop:20,display:k,padding:"0px 20px"},children:[e.jsxs("div",{style:{flexGrow:1,textAlign:"left",fontSize:"1rem",marginTop:6},children:[e.jsx(p,{onClick:()=>l("all"),color:"info",variant:L,value:"all",style:{padding:"2px 8px 2px 8px",minWidth:35,lineHeight:"1rem",marginRight:6},children:"All"}),e.jsx(p,{onClick:()=>l("picked"),color:"info",variant:T,value:"picked",style:{padding:"2px 8px 2px 8px",minWidth:35,lineHeight:"1rem",marginRight:2},children:"Picked"}),e.jsx(p,{onClick:()=>l("notPicked"),color:"info",variant:A,value:"notPicked",style:{padding:"2px 8px 2px 8px",minWidth:35,lineHeight:"1rem"},children:"Not Picked"})]}),e.jsxs("div",{style:{flexGrow:1,textAlign:"right",fontSize:"1rem",marginTop:6},children:["Top Locks:  ",e.jsx(p,{onClick:i(25),color:"info",variant:w,value:"25",style:{padding:"2px 2px 2px 2px",minWidth:35,lineHeight:"1rem"},children:"25"}),e.jsx(p,{onClick:i(50),variant:P,color:"info",value:"50",style:{padding:"2px 2px 2px 2px",minWidth:35,lineHeight:"1rem"},children:"50"}),e.jsx(p,{onClick:i(100),color:"info",variant:B,value:"100",style:{padding:"2px 2px 2px 2px",minWidth:35,lineHeight:"1rem"},children:"100"})]})]})]}),e.jsx("div",{children:C.map(c=>e.jsx(ze,{dense:!0,style:{padding:0},children:e.jsx(At,{entry:c})},c.id))})]}):e.jsx(J,{})}function Lt({owner:n,profile:t,adminAction:a,popular:h}){const{isMobile:r}=H(),{userId:u}=M(),{visibleEntries:o=[],popularEntries:l=[],cardEvidence:x}=s.useContext(de),{expanded:m}=s.useContext(Ze),{filters:d,setFilters:C,removeFilters:j}=s.useContext(xe),{name:b,locks:S}=d,{createEvidenceForEntries:v,removeEvidence:i,removeProfileBlackBeltAwarded:k,updateUserStatistics:w}=s.useContext(O),{admin:P}=s.useContext(We),B=(t==null?void 0:t.blackBeltAwardedAt)>0,[L,T]=s.useState(m),[A,c]=s.useState(!1),[f,F]=s.useState("import"),[z,I]=s.useState(!1),[E,_]=s.useState(S==="mostPopular"||h);m&&m!==L&&T(m);const g=s.useMemo(()=>{if(t&&t.recorded){const y=x.map(V=>V.matchId);return t.recorded.filter(V=>!y.includes(V))}else return[]},[t,x]),N=s.useCallback(y=>{d.id&&j(["id"]),T(y)},[d,j]),ve=s.useCallback(async()=>{I(!0),await v(u,g),c(!1),I(!1),a()},[v,u,g,a]),W=s.useCallback(y=>{F(y),c(!A)},[A]),[Q,X]=s.useState(null),ke=!!Q,Ce=s.useCallback(y=>{y.preventDefault(),y.stopPropagation(),X(y.currentTarget)},[]),$=s.useCallback(()=>X(null),[]),be=s.useCallback(async()=>{I(!0),await w(u),I(!1)},[w,u]),Se=s.useCallback(async()=>{I(!0),await i(x),await k(u),$(),I(!1),a()},[x,i,$,a,k,u]),Z=15,U=r?"block":"flex",Ee=r?6:0,ee=s.useCallback(()=>{C(E?{name:b}:{locks:"mostPopular",name:b}),_(!E)},[E,b,C]),we=E?"text":"contained",Pe=E?"contained":"text",Ae=t.displayName&&!t.privacyAnonymous?t.displayName.toLowerCase().endsWith("s")?`${t.displayName}'`:`${t.displayName}'s`:"Anonymous",De=n?"My Locks":`${Ae} Locks`,Le=n?86:124;return e.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[e.jsx(it,{profile:t,page:"scorecard",owner:n,mostPopular:E}),n&&o.length>0&&!t.tabClaimed&&e.jsx("div",{style:{margin:8,padding:"0px 0px"},children:e.jsx(xt,{pageName:"scorecard"})}),o.length>0&&e.jsx(D.Fragment,{children:r?e.jsxs("div",{style:{display:U,padding:"0px 8px 0px 16px"},children:[t.danLevel>0&&e.jsx(ae,{profile:t,owner:n}),e.jsx("div",{style:{marginRight:0,width:"95%"},children:e.jsx(oe,{profile:t,entries:o})})]}):e.jsxs("div",{style:{display:U,padding:"10px 8px 0px 16px"},children:[e.jsx("div",{style:{marginRight:0,width:380},children:e.jsx(oe,{profile:t,entries:o})}),t.danLevel>0&&e.jsx("div",{style:{flexGrow:1,marginRight:0},children:e.jsx(ae,{profile:t,owner:n})})]})}),e.jsxs(me,{expanded:A,disableGutters:!0,children:[e.jsx(ge,{style:{paddingLeft:Z,paddingRight:Z,placeItems:"center",width:"100%"},children:e.jsxs("div",{style:{width:"100%",placeItems:"center",textAlign:"center"},children:[e.jsxs("div",{style:{display:U,width:"100%",placeItems:"center",textAlign:"center"},children:[(n||P)&&e.jsxs("div",{style:{width:"100%",textAlign:"left"},children:[!B&&e.jsx(p,{variant:"outlined",color:"secondary",size:"small",style:{lineHeight:"1.2rem",marginRight:6},onClick:()=>W("import"),children:"IMPORT DAN SHEET"}),!E&&e.jsx(p,{variant:"outlined",color:"secondary",size:"small",style:{lineHeight:"1.2rem"},onClick:()=>W("project"),children:A&&f==="project"?"CANCEL ADD PROJECT":"ADD PROJECT"})]}),e.jsxs("div",{style:{width:"100%",textAlign:"right",display:"flex",marginTop:Ee},children:[e.jsx("div",{style:{flexGrow:1}}),e.jsx(p,{variant:we,color:"secondary",size:"small",style:{lineHeight:"1.2rem",width:Le},onClick:()=>ee(),children:De}),e.jsx(p,{variant:Pe,color:"info",size:"small",style:{lineHeight:"1.2rem",marginLeft:6,width:122},onClick:()=>ee(),children:"MOST POPULAR"})]})]}),z&&e.jsx(J,{}),P&&!z&&e.jsx("div",{style:{backgroundColor:"#700",padding:5,marginTop:20},children:e.jsxs("div",{style:{display:"flex"},children:[e.jsx("div",{style:{width:"10%",textAlign:"center"},children:"admin"}),e.jsx("div",{style:{width:"20%",textAlign:"center"},children:e.jsx(p,{color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:()=>W("import"),children:"IMPORT DAN SHEET"})}),e.jsx("div",{style:{width:"20%",textAlign:"center"},children:e.jsx(p,{color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:be,children:"UPDATE STATS"})}),e.jsx("div",{style:{width:"20%",textAlign:"center"},children:e.jsxs(p,{color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:ve,children:["MERGE RECORDED (",g.length,")"]})}),e.jsxs("div",{style:{width:"20%",textAlign:"center"},children:[e.jsx(p,{color:"secondary",size:"small",style:{lineHeight:"1rem"},onClick:Ce,children:"DELETE SCORECARD"}),e.jsxs(Oe,{anchorEl:Q,open:ke,onClose:$,children:[e.jsxs("div",{style:{padding:20,textAlign:"center"},children:["You cannot undo delete.",e.jsx("br",{}),"Are you sure?"]}),e.jsx("div",{style:{textAlign:"center"},children:e.jsx(p,{style:{marginBottom:10,color:"#000"},variant:"contained",onClick:Se,edge:"start",color:"error",children:"Delete"})})]})]})]})})]})}),e.jsxs(ye,{style:{backgroundColor:"#333"},children:[f==="import"&&e.jsx(kt,{setControlsExpanded:c,adminAction:a}),f==="project"&&e.jsx(G,{evid:null,handleUpdate:W,addProject:!0})]})]}),!E&&e.jsxs(D.Fragment,{children:[o.length===0&&e.jsx(ct,{}),t&&t.blackBeltAwardedAt&&e.jsx(Et,{owner:n,date:t.blackBeltAwardedAt.toDate().toJSON()}),e.jsx("div",{children:o.map(y=>e.jsx(Ye,{owner:n,evid:y,expanded:y.id===L,onExpand:N,merged:t.blackBeltAwardedAt>0},y.id))})]}),E&&e.jsx(Dt,{owner:n,profile:t,adminAction:a,popularEntries:l})]})}var K={},Tt=le;Object.defineProperty(K,"__esModule",{value:!0});var fe=K.default=void 0,It=Tt(re()),Bt=e;fe=K.default=(0,It.default)((0,Bt.jsx)("path",{d:"M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3z"}),"LaunchOutlined");function Ft(){const{userId:n}=M(),t=`https://lpubelts.com/#/profile/${n}/scorecard/no-tracking`,a=s.useCallback(h=>{const r=window.open(h,"_blank","noopener,noreferrer");r&&(r.opener=null)},[]);return e.jsx(q,{onClick:()=>a(t),children:e.jsx(fe,{fontSize:"small"})})}function bs({mostPopular:n}){const{userId:t}=M(),{user:a}=s.useContext(_e),{getProfile:h,getEvidence:r}=s.useContext(O),{scoredEvidence:u,bbCount:o,danPoints:l,eligibleDan:x,nextDanPoints:m,nextDanLocks:d}=s.useContext($e),{isMobile:C}=H(),[j,b]=s.useState(!1),S=s.useCallback(()=>{b(!j)},[j]),v=s.useCallback(async()=>{try{const g=await h(t);if(g){const N=g.displayName&&!g.privacyAnonymous?g.displayName.toLowerCase().endsWith("s")?`${g.displayName}'`:`${g.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${N} Scorecard`}if((a==null?void 0:a.uid)!==t){const N=await r(t);return{profile:g,...Ue(N)}}else return{profile:g,scoredEvidence:u,bbCount:o,danPoints:l,eligibleDan:x,nextDanPoints:m,nextDanLocks:d}}catch(g){return console.error("Error loading profile and evidence.",g),null}},[j,a,t,h,r,u,o,l,x,m,d]),{data:i={},loading:k,error:w}=ne({loadFn:v}),P=i?i.profile:{},B=i?i.scoredEvidence:[],L=i?i.bbCount:0,T=i?i.danPoints:0,A=i?i.eligibleDan:0,c=i?i.nextDanPoints:0,f=i?i.nextDanLocks:0,F=ne({url:vt}),z=F.data?F.data.scorecardLocks:[],I=window.location.hash.search(/locks=mostPopular/)<1&&!n?e.jsxs(D.Fragment,{children:[e.jsx(mt,{label:"Scorecard",extraFilters:[{key:"tab",value:"search"}]}),e.jsx(gt,{sortValues:yt}),e.jsx(jt,{extraFilters:[{key:"tab",value:"search"}]}),!C&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}):null,E=e.jsxs(D.Fragment,{children:[e.jsx("br",{}),e.jsx(dt,{}),e.jsx(Ft,{})]}),_=k?"Loading...":"Profile";return k||w?null:e.jsx(Qe,{filterFields:Xe,children:e.jsx(et,{cardEvidence:B,cardBBCount:L,cardDanPoints:T,cardEligibleDan:A,cardNextDanPoints:c,cardNextDanLocks:f,popularLocks:z,children:e.jsxs(tt,{children:[e.jsxs(pe,{adapterLocale:R.locale(),dateAdapter:ue,children:[e.jsx(Ve,{title:_,extras:I}),e.jsx(ft,{}),k&&e.jsx(ut,{}),!k&&i&&!w&&e.jsx(Lt,{owner:a&&a.uid===t,profile:P,adminAction:S,popular:n}),!k&&(!i||w)&&e.jsx(ht,{}),e.jsx(Ge,{extras:E})]}),e.jsx(qe,{feature:"scorecard"})]})})})}export{bs as default};
