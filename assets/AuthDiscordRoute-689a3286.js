import{r as o,D as k,j as x,l as O}from"./index-a14b0937.js";import{I as V}from"./ImportPreview-4f74c883.js";import"./dataUrls-315ac0c0.js";import"./filterFields-d044ca1e.js";import"./ScorecardListContext-3301a513.js";import"./LoadingDisplay-1e77bcb2.js";import"./Box-5a2e166f.js";import"./useData-790f9b31.js";import"./ScorecardRow-bcf5648d.js";import"./FieldValue-cc234fef.js";import"./Select-2cbde9cc.js";import"./BeltStripe-0d7c7793.js";import"./BeltIcon-b547bc57.js";import"./Launch-9831309d.js";import"./PhotoCamera-3de1863e.js";import"./Autocomplete-5a684bfb.js";import"./Chip-50115d67.js";import"./TextField-3462f1d9.js";import"./index-b4ad3c33.js";import"./Dialog-b0686b23.js";import"./ListItem-40ced2db.js";import"./VideocamOutlined-8fccb77d.js";import"./FormGroup-016082cd.js";import"./entryName-ca45fb51.js";import"./Link-dbe435c4.js";import"./AccordionSummary-62410a8c.js";import"./Link-ca0a0043.js";import"./usePageTitle-7ea5d479.js";import"./useDocumentTitle-66e4a122.js";function nt(){const{setDiscordUserInfo:u,peekAtDiscordAwards:m}=o.useContext(k),{VITE_DISCORD_CLIENT_ID:f,VITE_DISCORD_CLIENT_SECRET:_}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},E=window.location.href.match(/\?code=([^#]+)#/),d=E?E[1]:null,h=window.location.href.match(/\?error=([^&]+)&error_description/),I=h?h[1]:null,[c,S]=o.useState(null),[D,y]=o.useState({}),[A,e]=o.useState(!1),w=o.useRef(!1),R=A||(Object.keys(D).length>0?"complete":!1);return o.useEffect(()=>{async function l(){let a=null;try{a=await fetch("https://discord.com/api/oauth2/token",{method:"POST",body:new URLSearchParams({grant_type:"authorization_code",code:d,redirect_uri:`${location.origin}/#/auth/discord`}).toString(),headers:{Authorization:"Basic "+btoa(f+":"+_),"Content-Type":"application/x-www-form-urlencoded"}})}catch{e("token_failed");return}if(a.status===200){const i=await a.json();S({token:i.access_token,type:i.token_type})}else a.status===400?e("token_expired"):e("token_failed")}d&&!w.current?(w.current=!0,l()):I&&e("access_denied")},[d,I,f,_]),o.useEffect(()=>{async function l(a,i){let p=null;try{p=await fetch("https://discord.com/api/users/@me",{headers:{authorization:`${a} ${i}`}})}catch{e("data_failed");return}if(p.status===200){const s=await p.json(),T=(await m(s.id)).map(r=>{var t,C;return{matchId:O((t=r.discordAwardName.match(/^(\w+) Belt/))==null?void 0:t[1],(C=r.discordAwardName.match(/^(\d+)/))==null?void 0:C[1],r.discordAwardName).id,awardedAt:r.awardCreatedAt.toDate().toUTCString(),link:r.awardUrl}});if(T.length>0){const r=Object.values(T.reduce((n,t)=>((!n[t.matchId]||new Date(t.awardedAt)<new Date(n[t.matchId].awardedAt))&&(n[t.matchId]=t),n),{}));await u(s.id,s.username),y({id:s.id,username:s.username,awards:r})}else e("none_found")}else e("data_failed")}c&&l(c.type,c.token)},[c,u,m]),x.jsx(V,{syncStatus:R,syncResult:D,service:"Discord"})}export{nt as default};
