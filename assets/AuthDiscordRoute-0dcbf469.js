import{r as o,D as k,j as x,l as V}from"./index-4ae4bfb0.js";import{I as L}from"./ImportPreview-1617ad99.js";import"./dataUrls-cb3c99ff.js";import"./filterFields-165c2368.js";import"./ScorecardListContext-05a0a79c.js";import"./index-e8cb67d3.js";import"./LoadingDisplay-8ae45fa5.js";import"./Box-58d3dbb1.js";import"./CircularProgress-f598c7cb.js";import"./useData-4ad2101c.js";import"./ScorecardRow-cbdad31f.js";import"./FieldValue-138ac50d.js";import"./BeltStripe-51427405.js";import"./BeltIcon-79e5a61b.js";import"./Launch-9b6f736f.js";import"./PhotoCamera-0863cee2.js";import"./Autocomplete-81b77e17.js";import"./Select-f6d61f71.js";import"./Chip-87b15f72.js";import"./TextField-0f11ab2d.js";import"./index-73c56a4a.js";import"./DialogContent-54689c29.js";import"./ListItem-80cdd3db.js";import"./Dialog-dfa9a08a.js";import"./VideocamOutlined-4c3bcc0e.js";import"./FormGroup-fc90e11c.js";import"./Checkbox-36de7944.js";import"./LoadingDisplaySmall-db794b3f.js";import"./entryName-2445267a.js";import"./Link-d5457ad6.js";import"./AccordionSummary-c0b10de7.js";import"./Link-e1a46b2e.js";import"./usePageTitle-4d01f4f9.js";import"./useDocumentTitle-969ebc01.js";function mt(){const{setDiscordUserInfo:m,peekAtDiscordAwards:u}=o.useContext(k),{VITE_DISCORD_CLIENT_ID:_,VITE_DISCORD_CLIENT_SECRET:E}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLScjl1ZZ2FHBhMHQjw-8-T8Tgh7SvhDIc1H4uxyXZPRheI159Q",VITE_RAFL_STATE:"preview",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},I=window.location.href.match(/\?code=([^#]+)#/),d=I?I[1]:null,f=window.location.href.match(/\?error=([^&]+)&error_description/),h=f?f[1]:null,[c,A]=o.useState(null),[D,R]=o.useState({}),[C,e]=o.useState(!1),w=o.useRef(!1),y=C||(Object.keys(D).length>0?"complete":!1);return o.useEffect(()=>{async function p(){let a=null;try{a=await fetch("https://discord.com/api/oauth2/token",{method:"POST",body:new URLSearchParams({grant_type:"authorization_code",code:d,redirect_uri:`${location.origin}/#/auth/discord`}).toString(),headers:{Authorization:"Basic "+btoa(_+":"+E),"Content-Type":"application/x-www-form-urlencoded"}})}catch{e("token_failed");return}if(a.status===200){const s=await a.json();A({token:s.access_token,type:s.token_type})}else a.status===400?e("token_expired"):e("token_failed")}d&&!w.current?(w.current=!0,p()):h&&e("access_denied")},[d,h,_,E]),o.useEffect(()=>{async function p(a,s){let l=null;try{l=await fetch("https://discord.com/api/users/@me",{headers:{authorization:`${a} ${s}`}})}catch{e("data_failed");return}if(l.status===200){const i=await l.json(),T=(await u(i.id)).map(r=>{var t,S;return{matchId:V((t=r.discordAwardName.match(/^(\w+) Belt/))==null?void 0:t[1],(S=r.discordAwardName.match(/^(\d+)/))==null?void 0:S[1],r.discordAwardName).id,awardedAt:r.awardCreatedAt.toDate().toUTCString(),link:r.awardUrl}});if(T.length>0){const r=Object.values(T.reduce((n,t)=>((!n[t.matchId]||new Date(t.awardedAt)<new Date(n[t.matchId].awardedAt))&&(n[t.matchId]=t),n),{}));await m(i.id,i.username),R({id:i.id,username:i.username,awards:r})}else e("none_found")}else e("data_failed")}c&&p(c.type,c.token)},[c,m,u]),x.jsx(L,{syncStatus:y,syncResult:D,service:"Discord"})}export{mt as default};
