import{r as i,D as v,X as z,a2 as G,b as X,A as j,u as K,H as c,j as e,R as g,B as n,a9 as q,N as H,F as Z,T as J}from"./index-d5272593.js";import{u as ee}from"./useDocumentTitle-98d34f06.js";import{l as te}from"./LPU-c3fa7122.js";import{C as ae}from"./CopyProfileLinkButton-fa798689.js";import{L as ie}from"./LoadingDisplay-9e4e0f37.js";import{T as D}from"./TextField-84fbfb10.js";import{P as ne}from"./MustBeLoggedIn-4673282c.js";import{L as re}from"./LinearProgress-1e93ad60.js";import"./Link-64a31cd2.js";import"./Box-b67710a6.js";import"./CircularProgress-df569432.js";import"./Select-2d7e75de.js";function se(){const{lockCollection:t,updateProfileDisplayName:o,deleteAllUserData:u,oauthState:d,removeServiceAuth:_}=i.useContext(v),{beta:L}=i.useContext(z),[w]=G(),S=w.get("debug"),[r,I]=i.useState(t.displayName||""),[y,E]=i.useState(null),[A,T]=i.useState(!1),R=X(),{user:s}=i.useContext(j),{isMobile:b}=K(),N=i.useCallback(a=>{const{value:l}=a.target;I(l)},[]),V=i.useCallback(a=>a.target.select(),[]),F=i.useCallback(async()=>{try{await o(r),c("Profile updated")}catch(a){console.error("Error while updating profile",a),c("Error while updating profile")}},[o,r]),O=i.useCallback(async()=>{try{await o(null),I(""),c("Display Name cleared")}catch(a){console.error("Error while updating profile",a),c("Error while updating profile")}},[o]),P=i.useCallback(()=>{R(`/profile/${s.uid}`)},[R,s.uid]),B=i.useCallback(a=>{a.preventDefault(),a.stopPropagation(),E(a.currentTarget)},[]),f=i.useCallback(async a=>{await _(a),c(`${a} account removed.`)},[_]),U=i.useCallback(()=>{const{VITE_DISCORD_CLIENT_ID:a}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLSf_PQ6XXDYy0cTn_2MeDCwikTOYLRtncPKluFRK-QEYHX0qug",VITE_RAFL_STATE:"live",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},l=encodeURIComponent("identify"),m=encodeURIComponent(`${location.origin}/#/auth/discord`),h=`https://discord.com/oauth2/authorize?client_id=${a}&response_type=code&redirect_uri=${m}&scope=${l}`;window.location.assign(h)},[]),k=i.useCallback(async()=>{const{VITE_REDDIT_CLIENT_ID:a}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLSf_PQ6XXDYy0cTn_2MeDCwikTOYLRtncPKluFRK-QEYHX0qug",VITE_RAFL_STATE:"live",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},l=await d(s.uid),m=encodeURIComponent("identity flair privatemessages"),h=encodeURIComponent(`${location.origin}/#/auth/reddit`),x=`https://www.reddit.com/api/v1/authorize?client_id=${a}&response_type=code&state=${l}&redirect_uri=${h}&duration=temporary&scope=${m}`;window.location.assign(x)},[d,s]),W=i.useCallback(async()=>{const{VITE_REDDIT_CLIENT_ID:a}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLSf_PQ6XXDYy0cTn_2MeDCwikTOYLRtncPKluFRK-QEYHX0qug",VITE_RAFL_STATE:"live",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},l="DEBUG_DOWNLOAD"+await d(s.uid),m=encodeURIComponent("identity flair privatemessages"),h=encodeURIComponent(`${location.origin}/#/auth/reddit`),x=`https://www.reddit.com/api/v1/authorize?client_id=${a}&response_type=code&state=${l}&redirect_uri=${h}&duration=temporary&scope=${m}`;window.location.assign(x)},[d,s.uid]),$=i.useCallback(async()=>{T(!0),await u(s.uid),E(null),T(!1),c("All data has been deleted")},[u,s]),p=r.length>0&&!oe.test(r.toString()),Y=r.length===0||r===(t==null?void 0:t.displayName),Q=p?"Display name must only include A-Z, 0-9, _ and -.":"",M=r.length>0?` (${r}) `:"",C=b?"block":"flex";return e.jsx("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:A?e.jsx(ie,{}):e.jsxs(g.Fragment,{children:[e.jsxs("div",{style:{display:C,padding:16},children:[t!=null&&t.displayName?e.jsxs("div",{style:{marginBottom:10,marginRight:20,maxWidth:325},children:[e.jsxs("span",{style:{fontSize:"1.2rem",fontWeight:500},children:["Display Name",e.jsx("br",{})]}),"Your display name ",M," shows up on the leaderboard and your profile can be shared with others.",e.jsx("br",{}),e.jsx("br",{}),"Your Google login information will never be displayed to other users."]}):e.jsxs("div",{style:{marginBottom:10,marginRight:20,maxWidth:325},children:[e.jsxs("span",{style:{fontSize:"1.2rem",fontWeight:500},children:["Display Name",e.jsx("br",{})]}),"Your display name will show up on the leaderboard and your profile can be shared with others.",e.jsx("br",{}),e.jsx("br",{}),"Your Google login information will never be displayed to other users."]}),e.jsxs("div",{style:{width:"100%",marginTop:40},children:[e.jsx(D,{error:p,variant:"outlined",color:"secondary",label:"Display Name",helperText:Q,value:r||"",onChange:N,onFocus:V,inputProps:{maxLength:32},size:"small",style:{width:220}}),e.jsx(n,{variant:"outlined",color:p?void 0:"success",onClick:F,disabled:p||Y,style:{marginLeft:16,marginRight:0,marginBottom:10,height:40},children:"Save"}),e.jsxs("div",{style:{width:"100%",textAlign:"left",margin:"10px 0px 28px 0px"},children:[(t==null?void 0:t.displayName)&&e.jsx(n,{variant:"outlined",color:"info",onClick:O,disabled:p,style:{marginBottom:10,color:"#4972ab",padding:"5px 10px"},children:"Clear Display Name"}),e.jsx(n,{variant:"outlined",color:"info",onClick:P,style:{marginLeft:15,marginBottom:10,padding:"5px 10px"},children:"View Profile"})]})]})]}),L&&e.jsxs("div",{style:{display:C,padding:16},children:[e.jsxs("div",{style:{marginBottom:10,marginRight:20,maxWidth:325},children:[e.jsxs("span",{style:{fontSize:"1.2rem",fontWeight:500},children:["Linked Accounts",e.jsx("br",{})]}),"Linked accounts are used to import your approved Belt and Dan Rankings. Rankings from Discord will update automatically as long as your account is linked. You will need to re-authorize with Reddit to update new approved belts."]}),e.jsxs("div",{style:{width:"100%",marginTop:40},children:[t!=null&&t.discordUsername?e.jsxs("div",{style:{width:"100%",marginBottom:10},children:[e.jsx(D,{variant:"outlined",label:"Discord Username",value:(t==null?void 0:t.discordUsername)||"",inputProps:{maxLength:32,readOnly:!0},size:"small",style:{width:200},color:"warning"}),e.jsx(n,{variant:"outlined",color:"warning",onClick:()=>f("Discord"),disabled:!(t!=null&&t.discordUsername),style:{marginLeft:16,marginRight:0,marginBottom:10,height:40},children:"Remove"})]}):e.jsx(n,{variant:"outlined",color:"warning",style:{marginBottom:16,height:40},onClick:U,children:"LINK DISCORD ACCOUNT"}),t!=null&&t.redditUsername?e.jsxs("div",{style:{width:"100%",padding:"8px 0px"},children:[e.jsx(D,{variant:"outlined",label:"Reddit Username",value:(t==null?void 0:t.redditUsername)||"",inputProps:{maxLength:32,readOnly:!0},size:"small",style:{width:200},color:"warning",readOnly:!0}),e.jsx(n,{variant:"outlined",color:"warning",onClick:()=>f("Reddit"),disabled:!(t!=null&&t.redditUsername),style:{marginLeft:16,marginRight:0,marginBottom:10,height:40},children:"Remove"})]}):e.jsx(n,{variant:"outlined",color:"warning",style:{marginBottom:16,height:40},onClick:k,children:"LINK REDDIT ACCOUNT"}),S&&e.jsx(n,{variant:"contained",color:"warning",style:{marginBottom:16,marginTop:10,height:40},onClick:W,children:"DEBUG REDDIT ACCOUNT"})]})]}),e.jsxs("div",{style:{width:"100%",textAlign:"center",margin:"10px 0px 10px 0px"},children:[e.jsx(n,{variant:"outlined",color:"error",onClick:B,style:{marginBottom:10,color:"#d31f1f",padding:"5px 110px"},children:"Delete All Data"}),e.jsxs(q,{anchorEl:y,open:!!y,onClose:()=>E(null),children:[e.jsxs("div",{style:{padding:20,textAlign:"center"},children:["This will permanently delete all of your data.",e.jsx("br",{}),"Are you sure?"]}),e.jsx("div",{style:{textAlign:"center"},children:e.jsx(n,{style:{marginBottom:10,color:"#000"},variant:"contained",onClick:$,edge:"start",color:"error",children:"Delete"})})]})]}),e.jsx("div",{style:{height:20}})]})})}const oe=/^[\sa-zA-Z0-9_-]{1,32}$/;function Ie(){const{authLoaded:t,isLoggedIn:o}=i.useContext(j),{dbLoaded:u}=i.useContext(v);ee("LPU Belt Explorer - Edit Profile");const d=e.jsx(g.Fragment,{children:e.jsx(ae,{page:"collection"})});return e.jsxs(g.Fragment,{children:[e.jsx(H,{title:"Edit Profile",extras:d}),(!t||!u)&&e.jsxs(g.Fragment,{children:[e.jsx(re,{variant:"indeterminate",color:"secondary"}),e.jsx("img",{alt:"Loading",src:te,style:{marginLeft:"auto",marginRight:"auto",display:"block"}})]}),t&&!o&&e.jsx(ne,{}),t&&o&&u&&e.jsx(se,{}),e.jsx(Z,{}),e.jsx(J,{feature:"editprofile"})]})}export{Ie as default};
