import{r as t,X as N,u as P,a2 as G,j as e,aa as E,R,ad as T,ae as W,af as O,d as z,N as H,F as J}from"./index-96a4be6e.js";import{u as C}from"./useData-89a5a4dc.js";import{S as K}from"./ScorecardRow-576481ad.js";import{D as U,a as V,s as X}from"./filterFields-926f20be.js";import"./index-56d9053d.js";import{I as D,S as L}from"./ScorecardDanStats-a7c4b8be.js";import{F as _,I as q,S as Y}from"./Select-df652450.js";import{a as Q,b as Z}from"./ScorecardListContext-d82032e7.js";import{S as $}from"./SearchBox-cabd5853.js";import{S as ee,F as ae}from"./SortButton-272c6f65.js";import{s as te}from"./sortFields-8bfcc66d.js";import{u as oe,c as ce}from"./dataUrls-6cc1b85c.js";import{L as se}from"./LoadingDisplay-7bc2b7f8.js";import{L as re,A as ne}from"./BeltIcon-f7b6810e.js";import"./FieldValue-6151d875.js";import"./BeltStripe-9b00843e.js";import"./entryName-f537124c.js";import"./Link-89f2a95f.js";import"./AccordionSummary-873a43ea.js";import"./Link-6e2886df.js";import"./chartDefaults-9fc07b21.js";import"./nivo-bar.es-1e43b511.js";import"./nivo-legends.es-81d20e44.js";import"./index-4cff18fc.js";import"./Box-47ff6b0d.js";import"./Chip-7e97becf.js";import"./Search-532bf314.js";import"./Badge-e77b4205.js";import"./TextField-87aff65f.js";import"./Sort-421bbb76.js";import"./LockListContext-42f28104.js";import"./CircularProgress-939dcb6b.js";import"./Launch-23e2d06e.js";import"./PhotoCamera-fbfdd2ea.js";import"./Autocomplete-28193734.js";import"./DialogContent-0f4aa00d.js";import"./ListItem-2dc58bbf.js";import"./Dialog-8722e445.js";import"./VideocamOutlined-8ffb97cb.js";import"./FormGroup-364e1909.js";import"./Checkbox-43653c0d.js";import"./LoadingDisplaySmall-4a91d7c6.js";const ie="Alpama",de="Burnetb1",le="Cajunlockpick",me="deadhammer",fe="Dra9i",pe="EdMcBane",be="Gas Station Hotdog",ue="GeorgiaJim",xe="GravityKarma",he="HVLogic",ge="Justinmcslappy",ve="Lock_Picker_",ye="LockChuck",je="LockFumbler",ke="m.c.",Se="MGsecure",Ce="MoKdtex",De="Mow",Le="NiXXeD",Pe="PeaceWeapon",Re="Picksmith",Be="RedWanderer",Fe="Reinder",Me="retep",we="Reverend",Ae="Rxpert",Ie="Sidepicks",Ne="snow",Ge="SteveDynamics",Ee="Strix",Te="Syotos",We="Tarehjerne",Oe="TheGreenishOne",ze="threeraccoonsinacoat",He="Tonysansan",Je="TruckingLock",Ke="TypeRegal",k={59541391:"Crispix","5ee93ec3":"_least","851c7109":"-CK-","5bdf7301":"Affinity",b83f698e:ie,"65dabde3":"Angryducc","65a02185":"Armlock","5b25d107":"B1","8a432e9d":"BanditoBrandino","67c16b3b":"Birdie","9c62e0e1":"Boro",c6d4a4ea:de,ff1da1a0:le,"1a6bfad7":"Chestnut","47a0654c":"Clefmentine","5fd25111":"Craig3.0","89bf77bf":"CYP",f59f0924:me,"234bf337":"decent picker dude","313a181c":"Den Brass","37520ebc":"DigPicks","572aab15":"DoNotDuplicate","7be077d2":"DQ",fe69ed63:fe,"60e2ed54":"DrHogmaster","855b1f01":"Dromicete",d069bfda:pe,"33b17571":"Florida man picks locks",e6412ca5:be,"02882ec4":"Geoffry 005 McGary",a015d38c:ue,"7175bd6d":"Gexpro","0773ce0e":"GilliGainz",f88d2a15:xe,dfc228e0:he,"10cf17de":"IonaWest",bc34c803:ge,"98be0744":"L0ckJockey","18caf61f":"Ladylocks","8fdfc379":"Lemon",b611230f:ve,ec30142a:ye,ddc09876:je,"3627245f":"LockNoob","36c024fc":"Loose-Shirt",d5383587:ke,"85b505e2":"m0g","9dd38cc7":"Marson",c4838e56:Se,"7d40b8cc":"Mick Emhurt",c31354b6:Ce,ad5495d7:De,"6ea2e6c6":"MrBlack-Magic",ec58b469:Le,"97334d23":"pandafrog",f2b00685:Pe,c453d9dc:Re,"121ef739":"Plz7","581b107f":"RavenRules","405b4e23":"RC13",d8a1a279:Be,"19ea8968":"regen",fa20cac5:Fe,e19b8ac0:Me,ae258826:we,"7e52bea5":"Roo1","935e7a60":"Rusted Chevy",baae2413:Ae,"2da26ba5":"Seb",f278d443:Ie,"1b29c1f0":"Sir Paradise","2f3bf239":"skwiggledork","5ad5637e":"Skylerminer",e1b522de:Ne,bc01ce17:Ge,b7d8f610:Ee,d30d678c:Te,f889ded7:We,aaa549eb:Oe,a592a379:ze,c15c0f1c:He,e3fd6847:Je,"594262f8":"Two06",b0ceb7fb:Ke,"5c715b55":"Vinsanity0","36be2cf0":"wyte","09f2de32":"Yabende"};function Ue({owner:h,profile:i,tab:f,setTab:p}){const{admin:b}=t.useContext(N),{isMobile:d}=P(),u=d?"block":"flex",{visibleEntries:n=[]}=t.useContext(U),[o,x]=G(),[g,l]=t.useState(!1),c=t.useCallback(()=>l(!1),[]),v=t.useCallback(()=>l(!0),[]),y=t.useCallback(a=>{o.set("tab",a.target.value),x(o),p(a.target.value),c()},[c,o,x,p]),j=t.useMemo(()=>Object.keys(k).reduce((a,s)=>(a.push({name:k[s],id:s}),a),[]),[]);return e.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[b&&e.jsxs("div",{style:{display:"flex",padding:20,marginBottom:20,backgroundColor:"#800"},children:[e.jsx("div",{style:{fontWeight:700,fontSize:"1.5rem",marginRight:20},children:"ADMIN"}),e.jsx("div",{children:e.jsxs(_,{style:{marginBottom:10,minWidth:200,textAlign:"left"},size:"small",children:[e.jsx(q,{color:"info",children:"Choose Tab"}),e.jsx(Y,{value:f,name:"Choose Tab ",label:"Choose Tab ",open:g,onClose:c,onOpen:v,onChange:y,style:{fontWeight:400,color:"#eee"},color:"info",children:j.map((a,s)=>e.jsx(E,{value:a.id,children:a.name},s))})]})})]}),n.length>0&&e.jsx(R.Fragment,{children:d?e.jsxs("div",{style:{display:u,padding:"20px 8px 0px 16px"},children:[e.jsx(L,{}),e.jsx("div",{style:{marginRight:0,width:"95%"},children:e.jsx(D,{profile:i,entries:n})})]}):e.jsxs("div",{style:{display:u,padding:"30px 8px 0px 16px"},children:[e.jsx("div",{style:{marginRight:0,width:380},children:e.jsx(D,{profile:i,entries:n})}),e.jsx("div",{style:{flexGrow:1,marginRight:0},children:e.jsx(L,{})})]})}),e.jsx("div",{children:n.map((a,s)=>e.jsx(K,{owner:h,activity:a,expanded:!1,onExpand:void 0,merged:!1},s))})]})}function Na(){const{isMobile:h}=P(),i=T(),f=C({url:ce}),p=f.data?f.data.blackBeltOnly.listStats.recordedLocks.topItems:[],b=t.useMemo(()=>{const m=W.parse(i.search);return m.tab?m.tab:""},[i.search]),d=k[b],[u,n]=t.useState(b),{data:o,loading:x,error:g}=C({urls:Ve}),l=!!o&&!x&&!g,c=o==null?void 0:o.unclaimedEvidence,v=t.useMemo(()=>{let m=[];return c&&(m=Object.keys(c).reduce((S,I)=>{let r=c[I];return r.tabName===d&&S.push({date:r.evidenceCreatedAt,evidenceNotes:r.evidenceNotes,link:r.evidenceUrl,evidenceModifier:r.evidenceModifier,matchId:r.projectId,userId:r.tabName}),S},[])),m},[c,d]),{scoredActivity:y,bbCount:j,danPoints:a,eligibleDan:s,nextDanPoints:B,nextDanLocks:F}=O(v),M=e.jsxs(R.Fragment,{children:[e.jsx($,{label:"Scorecard",extraFilters:[{key:"tab",value:"search"}]}),e.jsx(ee,{sortValues:te}),e.jsx(ae,{extraFilters:[{key:"tab",value:"search"}]}),!h&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}})]}),w="",A="Preview";return document.title="LPU Belt Explorer - Preview Dan Import",e.jsx(V,{filterFields:X,children:e.jsx(Q,{cardActivity:y,cardBBCount:j,cardDanPoints:a,cardEligibleDan:s,cardNextDanPoints:B,cardNextDanLocks:F,popularLocks:p,children:e.jsx(Z,{children:e.jsxs(re,{adapterLocale:z.locale(),dateAdapter:ne,children:[e.jsx(H,{title:A,extras:M}),!l&&e.jsx(se,{}),l&&e.jsx(Ue,{tab:u,setTab:n}),e.jsx(J,{extras:w})]})})})})}const Ve={unclaimedEvidence:oe};export{Na as default};
