import{r as o,D as k,j as L,l as O}from"./index-69d6758e.js";import{I as V}from"./ImportPreview-35abbe8c.js";import"./dataUrls-24d17a9a.js";import"./filterFields-d8d5f0aa.js";import"./ScorecardListContext-d1c2660e.js";import"./index-a71cfd47.js";import"./LoadingDisplay-a0e08267.js";import"./Box-47833220.js";import"./CircularProgress-3dc17b85.js";import"./useData-33b346be.js";import"./ScorecardRow-dd26694f.js";import"./FieldValue-84312f6c.js";import"./BeltStripe-8faa33e0.js";import"./BeltIcon-aac27b47.js";import"./Launch-8115a7e8.js";import"./PhotoCamera-dec2a3aa.js";import"./Autocomplete-3a52102f.js";import"./Select-fe19cc1c.js";import"./Chip-b8b19e93.js";import"./TextField-c12495fd.js";import"./index-f6ad8219.js";import"./DialogContent-558b1838.js";import"./ListItem-a5904b8b.js";import"./Dialog-4082fbe0.js";import"./VideocamOutlined-b42eba81.js";import"./FormGroup-1f2febde.js";import"./Checkbox-69613267.js";import"./LoadingDisplaySmall-0d6a2a21.js";import"./entryName-e40ff0cc.js";import"./Link-b44db7d3.js";import"./AccordionSummary-776d1257.js";import"./Link-c2b81ded.js";import"./usePageTitle-9e304d0f.js";import"./useDocumentTitle-82cc5f34.js";function mt(){const{setDiscordUserInfo:m,peekAtDiscordAwards:u}=o.useContext(k),{VITE_DISCORD_CLIENT_ID:_,VITE_DISCORD_CLIENT_SECRET:E}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLSf_PQ6XXDYy0cTn_2MeDCwikTOYLRtncPKluFRK-QEYHX0qug",VITE_RAFL_STATE:"preview",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},f=window.location.href.match(/\?code=([^#]+)#/),d=f?f[1]:null,I=window.location.href.match(/\?error=([^&]+)&error_description/),D=I?I[1]:null,[c,S]=o.useState(null),[h,A]=o.useState({}),[C,e]=o.useState(!1),w=o.useRef(!1),y=C||(Object.keys(h).length>0?"complete":!1);return o.useEffect(()=>{async function p(){let a=null;try{a=await fetch("https://discord.com/api/oauth2/token",{method:"POST",body:new URLSearchParams({grant_type:"authorization_code",code:d,redirect_uri:`${location.origin}/#/auth/discord`}).toString(),headers:{Authorization:"Basic "+btoa(_+":"+E),"Content-Type":"application/x-www-form-urlencoded"}})}catch{e("token_failed");return}if(a.status===200){const s=await a.json();S({token:s.access_token,type:s.token_type})}else a.status===400?e("token_expired"):e("token_failed")}d&&!w.current?(w.current=!0,p()):D&&e("access_denied")},[d,D,_,E]),o.useEffect(()=>{async function p(a,s){let l=null;try{l=await fetch("https://discord.com/api/users/@me",{headers:{authorization:`${a} ${s}`}})}catch{e("data_failed");return}if(l.status===200){const i=await l.json(),T=(await u(i.id)).map(r=>{var t,R;return{matchId:O((t=r.discordAwardName.match(/^(\w+) Belt/))==null?void 0:t[1],(R=r.discordAwardName.match(/^(\d+)/))==null?void 0:R[1],r.discordAwardName).id,awardedAt:r.awardCreatedAt.toDate().toUTCString(),link:r.awardUrl}});if(T.length>0){const r=Object.values(T.reduce((n,t)=>((!n[t.matchId]||new Date(t.awardedAt)<new Date(n[t.matchId].awardedAt))&&(n[t.matchId]=t),n),{}));await m(i.id,i.username),A({id:i.id,username:i.username,awards:r})}else e("none_found")}else e("data_failed")}c&&p(c.type,c.token)},[c,m,u]),L.jsx(V,{syncStatus:y,syncResult:h,service:"Discord"})}export{mt as default};
