import{r as t,ak as N,X as A,j as e,x as G,R as P,a5 as T,a6 as W,am as O,a1 as z,N as H,O as J}from"./index-4f592016.js";import{u as S}from"./useData-eb7f62e3.js";import{I as D,S as L,a as K}from"./ScorecardDanStats-98095d37.js";import{D as U,a as V,s as X}from"./index-ad82b8a3.js";import{u as R}from"./useWindowSize-036299b5.js";import{F as _,I as q,S as Y}from"./Select-9a5cb84b.js";import{a as Q,b as Z}from"./ScorecardListContext-31a54bbf.js";import{S as $,a as ee,s as ae,F as te}from"./sortFields-90105e21.js";import{u as oe,f as se}from"./dataUrls-b6a2c15e.js";import{L as ce}from"./LoadingDisplay-84c2cd9f.js";import{L as re,A as ne}from"./CollectionButton-8c6c936e.js";import"./FieldValue-272f24f1.js";import"./BeltStripe-8caab7ad.js";import"./Link-e1560704.js";import"./AccordionSummary-e44f4a9a.js";import"./Link-ba87676d.js";import"./chartDefaults-9fc07b21.js";import"./nivo-bar.es-e0eeeda8.js";import"./nivo-legends.es-daab7aaa.js";import"./index-d3ebe83e.js";import"./Box-f7c8a562.js";import"./Search-1f69d1a1.js";import"./Sort-33e152ab.js";import"./TextField-ab198274.js";import"./PhotoCamera-f7ad51f4.js";import"./Launch-9c3fb400.js";import"./Autocomplete-981298f6.js";import"./Dialog-d1e8d7b5.js";import"./ListItem-e5664789.js";const ie="Alpama",de="Burnetb1",le="Cajunlockpick",me="deadhammer",fe="Dra9i",be="EdMcBane",pe="Gas Station Hotdog",ue="GeorgiaJim",xe="GravityKarma",he="HVLogic",ge="Justinmcslappy",ve="Lock_Picker_",je="LockChuck",ye="LockFumbler",ke="m.c.",Ce="MGsecure",Se="MoKdtex",De="Mow",Le="NiXXeD",Pe="PeaceWeapon",Re="Picksmith",Be="RedWanderer",Fe="Reinder",Me="retep",we="Reverend",Ee="Rxpert",Ie="Sidepicks",Ne="snow",Ae="SteveDynamics",Ge="Strix",Te="Syotos",We="Tarehjerne",Oe="TheGreenishOne",ze="threeraccoonsinacoat",He="Tonysansan",Je="TruckingLock",Ke="TypeRegal",k={59541391:"Crispix","5ee93ec3":"_least","851c7109":"-CK-","5bdf7301":"Affinity",b83f698e:ie,"65dabde3":"Angryducc","65a02185":"Armlock","5b25d107":"B1","8a432e9d":"BanditoBrandino","67c16b3b":"Birdie","9c62e0e1":"Boro",c6d4a4ea:de,ff1da1a0:le,"1a6bfad7":"Chestnut","47a0654c":"Clefmentine","5fd25111":"Craig3.0","89bf77bf":"CYP",f59f0924:me,"234bf337":"decent picker dude","313a181c":"Den Brass","37520ebc":"DigPicks","572aab15":"DoNotDuplicate","7be077d2":"DQ",fe69ed63:fe,"60e2ed54":"DrHogmaster","855b1f01":"Dromicete",d069bfda:be,"33b17571":"Florida man picks locks",e6412ca5:pe,"02882ec4":"Geoffry 005 McGary",a015d38c:ue,"7175bd6d":"Gexpro","0773ce0e":"GilliGainz",f88d2a15:xe,dfc228e0:he,"10cf17de":"IonaWest",bc34c803:ge,"98be0744":"L0ckJockey","18caf61f":"Ladylocks","8fdfc379":"Lemon",b611230f:ve,ec30142a:je,ddc09876:ye,"3627245f":"LockNoob","36c024fc":"Loose-Shirt",d5383587:ke,"85b505e2":"m0g","9dd38cc7":"Marson",c4838e56:Ce,"7d40b8cc":"Mick Emhurt",c31354b6:Se,ad5495d7:De,"6ea2e6c6":"MrBlack-Magic",ec58b469:Le,"97334d23":"pandafrog",f2b00685:Pe,c453d9dc:Re,"121ef739":"Plz7","581b107f":"RavenRules","405b4e23":"RC13",d8a1a279:Be,"19ea8968":"regen",fa20cac5:Fe,e19b8ac0:Me,ae258826:we,"7e52bea5":"Roo1","935e7a60":"Rusted Chevy",baae2413:Ee,"2da26ba5":"Seb",f278d443:Ie,"1b29c1f0":"Sir Paradise","2f3bf239":"skwiggledork","5ad5637e":"Skylerminer",e1b522de:Ne,bc01ce17:Ae,b7d8f610:Ge,d30d678c:Te,f889ded7:We,aaa549eb:Oe,a592a379:ze,c15c0f1c:He,e3fd6847:Je,"594262f8":"Two06",b0ceb7fb:Ke,"5c715b55":"Vinsanity0","36be2cf0":"wyte","09f2de32":"Yabende"};function Ue({owner:h,profile:i,tab:f,setTab:b}){const{admin:p}=t.useContext(N),{isMobile:d}=R(),u=d?"block":"flex",{visibleEntries:n=[]}=t.useContext(U),[o,x]=A(),[g,l]=t.useState(!1),s=t.useCallback(()=>l(!1),[]),v=t.useCallback(()=>l(!0),[]),j=t.useCallback(a=>{o.set("tab",a.target.value),x(o),b(a.target.value),s()},[s,o,x,b]),y=t.useMemo(()=>Object.keys(k).reduce((a,c)=>(a.push({name:k[c],id:c}),a),[]),[]);return e.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[p&&e.jsxs("div",{style:{display:"flex",padding:20,marginBottom:20,backgroundColor:"#800"},children:[e.jsx("div",{style:{fontWeight:700,fontSize:"1.5rem",marginRight:20},children:"ADMIN"}),e.jsx("div",{children:e.jsxs(_,{style:{marginBottom:10,minWidth:200,textAlign:"left"},size:"small",children:[e.jsx(q,{color:"info",children:"Choose Tab"}),e.jsx(Y,{value:f,name:"Choose Tab ",label:"Choose Tab ",open:g,onClose:s,onOpen:v,onChange:j,style:{fontWeight:400,color:"#eee"},color:"info",children:y.map((a,c)=>e.jsx(G,{value:a.id,children:a.name},c))})]})})]}),n.length>0&&e.jsx(P.Fragment,{children:d?e.jsxs("div",{style:{display:u,padding:"20px 8px 0px 16px"},children:[e.jsx(L,{}),e.jsx("div",{style:{marginRight:0,width:"95%"},children:e.jsx(D,{profile:i,entries:n})})]}):e.jsxs("div",{style:{display:u,padding:"30px 8px 0px 16px"},children:[e.jsx("div",{style:{marginRight:0,width:380},children:e.jsx(D,{profile:i,entries:n})}),e.jsx("div",{style:{flexGrow:1,marginRight:0},children:e.jsx(L,{})})]})}),e.jsx("div",{children:n.map((a,c)=>e.jsx(K,{owner:h,evid:a,expanded:!1,onExpand:void 0,merged:!1},c))})]})}function ka(){const{isMobile:h}=R(),i=T(),f=S({url:se}),b=f.data?f.data.scorecardLocks:[],p=t.useMemo(()=>{const m=W.parse(i.search);return m.tab?m.tab:""},[i.search]),d=k[p],[u,n]=t.useState(p),{data:o,loading:x,error:g}=S({urls:Ve}),l=!!o&&!x&&!g,s=o==null?void 0:o.unclaimedEvidence,v=t.useMemo(()=>{let m=[];return s&&(m=Object.keys(s).reduce((C,I)=>{let r=s[I];return r.tabName===d&&C.push({date:r.evidenceCreatedAt,evidenceNotes:r.evidenceNotes,link:r.evidenceUrl,modifier:r.modifier,matchId:r.projectId,userId:r.tabName}),C},[])),m},[s,d]),{scoredEvidence:j,bbCount:y,danPoints:a,eligibleDan:c,nextDanPoints:B,nextDanLocks:F}=O(v),M=e.jsxs(P.Fragment,{children:[e.jsx($,{label:"Scorecard",extraFilters:[{key:"tab",value:"search"}]}),e.jsx(ee,{sortValues:ae}),e.jsx(te,{extraFilters:[{key:"tab",value:"search"}]}),!h&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),w="",E="Preview";return document.title="LPU Belt Explorer - Preview Dan Import",e.jsx(V,{filterFields:X,children:e.jsx(Q,{cardEvidence:j,cardBBCount:y,cardDanPoints:a,cardEligibleDan:c,cardNextDanPoints:B,cardNextDanLocks:F,popularLocks:b,children:e.jsx(Z,{children:e.jsxs(re,{adapterLocale:z.locale(),dateAdapter:ne,children:[e.jsx(H,{title:E,extras:M}),!l&&e.jsx(ce,{}),l&&e.jsx(Ue,{tab:u,setTab:n}),e.jsx(J,{extras:w})]})})})})}const Ve={unclaimedEvidence:oe};export{ka as default};
