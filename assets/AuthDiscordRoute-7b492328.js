import{r as o,D as k,j as O,l as x}from"./index-ea8f6fb1.js";import{I as V}from"./ImportPreview-8de766ed.js";import"./dataUrls-be64ffd8.js";import"./filterFields-f3c4d6a9.js";import"./ScorecardListContext-66f91e91.js";import"./index-57b19fe8.js";import"./LoadingDisplay-2068cd50.js";import"./Box-9c432a68.js";import"./CircularProgress-4efbd7d6.js";import"./useData-7a10a936.js";import"./ScorecardRow-4704b32c.js";import"./FieldValue-2ba902af.js";import"./BeltStripe-50be94a6.js";import"./BeltIcon-a6222101.js";import"./Launch-c1e4cc48.js";import"./PhotoCamera-b59b5cfc.js";import"./Autocomplete-c1ed67f3.js";import"./Select-5c0d24aa.js";import"./Chip-46d89911.js";import"./TextField-131661f7.js";import"./index-b6bdbc7b.js";import"./DialogContent-62fcefe1.js";import"./ListItem-68b92f60.js";import"./Dialog-f66637f2.js";import"./VideocamOutlined-0cc48a07.js";import"./FormGroup-f3deee07.js";import"./Checkbox-35dd82b9.js";import"./LoadingDisplaySmall-5cc5f344.js";import"./entryName-9787531e.js";import"./Link-8f3912f5.js";import"./AccordionSummary-59fe983f.js";import"./Link-b34cf41c.js";import"./usePageTitle-bcc499b0.js";import"./useDocumentTitle-f708685e.js";function lt(){const{setDiscordUserInfo:l,peekAtDiscordAwards:u}=o.useContext(k),{VITE_DISCORD_CLIENT_ID:E,VITE_DISCORD_CLIENT_SECRET:_}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLScEbAUcDHUMhJjS-EFujSB4bE7WO7XxpuqcfYFoH-g2OBUY7w",VITE_RAFL_STATE:"preview",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},f=window.location.href.match(/\?code=([^#]+)#/),d=f?f[1]:null,I=window.location.href.match(/\?error=([^&]+)&error_description/),h=I?I[1]:null,[c,A]=o.useState(null),[D,C]=o.useState({}),[R,e]=o.useState(!1),w=o.useRef(!1),y=R||(Object.keys(D).length>0?"complete":!1);return o.useEffect(()=>{async function p(){let a=null;try{a=await fetch("https://discord.com/api/oauth2/token",{method:"POST",body:new URLSearchParams({grant_type:"authorization_code",code:d,redirect_uri:`${location.origin}/#/auth/discord`}).toString(),headers:{Authorization:"Basic "+btoa(E+":"+_),"Content-Type":"application/x-www-form-urlencoded"}})}catch{e("token_failed");return}if(a.status===200){const s=await a.json();A({token:s.access_token,type:s.token_type})}else a.status===400?e("token_expired"):e("token_failed")}d&&!w.current?(w.current=!0,p()):h&&e("access_denied")},[d,h,E,_]),o.useEffect(()=>{async function p(a,s){let m=null;try{m=await fetch("https://discord.com/api/users/@me",{headers:{authorization:`${a} ${s}`}})}catch{e("data_failed");return}if(m.status===200){const i=await m.json(),T=(await u(i.id)).map(r=>{var t,S;return{matchId:x((t=r.discordAwardName.match(/^(\w+) Belt/))==null?void 0:t[1],(S=r.discordAwardName.match(/^(\d+)/))==null?void 0:S[1],r.discordAwardName).id,awardedAt:r.awardCreatedAt.toDate().toUTCString(),link:r.awardUrl}});if(T.length>0){const r=Object.values(T.reduce((n,t)=>((!n[t.matchId]||new Date(t.awardedAt)<new Date(n[t.matchId].awardedAt))&&(n[t.matchId]=t),n),{}));await l(i.id,i.username),C({id:i.id,username:i.username,awards:r})}else e("none_found")}else e("data_failed")}c&&p(c.type,c.token)},[c,l,u]),O.jsx(V,{syncStatus:y,syncResult:D,service:"Discord"})}export{lt as default};
