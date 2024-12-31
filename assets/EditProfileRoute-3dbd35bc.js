import{r as i,D as j,X as G,a2 as Q,b as q,A as v,u as H,H as c,j as e,R as g,B as n,a9 as X,N as J,F as K,T as Z}from"./index-ea8f6fb1.js";import{u as ee}from"./useDocumentTitle-f708685e.js";import{l as te}from"./LPU-c3fa7122.js";import{C as ae}from"./CopyProfileLinkButton-6e3a68ea.js";import{L as ie}from"./LoadingDisplay-2068cd50.js";import{T as D}from"./TextField-131661f7.js";import{P as ne}from"./MustBeLoggedIn-d12925ce.js";import{L as re}from"./LinearProgress-021612b9.js";import"./Link-8f3912f5.js";import"./Box-9c432a68.js";import"./CircularProgress-4efbd7d6.js";import"./Select-5c0d24aa.js";function se(){const{lockCollection:t,updateProfileDisplayName:o,deleteAllUserData:p,oauthState:d,removeServiceAuth:I}=i.useContext(j),{beta:S}=i.useContext(G),[w]=Q(),A=w.get("debug"),[r,_]=i.useState(t.displayName||""),[y,E]=i.useState(null),[L,T]=i.useState(!1),f=q(),{user:s}=i.useContext(v),{isMobile:b}=H(),F=i.useCallback(a=>{const{value:l}=a.target;_(l)},[]),N=i.useCallback(a=>a.target.select(),[]),V=i.useCallback(async()=>{try{await o(r),c("Profile updated")}catch(a){console.error("Error while updating profile",a),c("Error while updating profile")}},[o,r]),O=i.useCallback(async()=>{try{await o(null),_(""),c("Display Name cleared")}catch(a){console.error("Error while updating profile",a),c("Error while updating profile")}},[o]),U=i.useCallback(()=>{f(`/profile/${s.uid}`)},[f,s.uid]),B=i.useCallback(a=>{a.preventDefault(),a.stopPropagation(),E(a.currentTarget)},[]),R=i.useCallback(async a=>{await I(a),c(`${a} account removed.`)},[I]),P=i.useCallback(()=>{const{VITE_DISCORD_CLIENT_ID:a}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLScEbAUcDHUMhJjS-EFujSB4bE7WO7XxpuqcfYFoH-g2OBUY7w",VITE_RAFL_STATE:"preview",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},l=encodeURIComponent("identify"),m=encodeURIComponent(`${location.origin}/#/auth/discord`),h=`https://discord.com/oauth2/authorize?client_id=${a}&response_type=code&redirect_uri=${m}&scope=${l}`;window.location.assign(h)},[]),W=i.useCallback(async()=>{const{VITE_REDDIT_CLIENT_ID:a}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLScEbAUcDHUMhJjS-EFujSB4bE7WO7XxpuqcfYFoH-g2OBUY7w",VITE_RAFL_STATE:"preview",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},l=await d(s.uid),m=encodeURIComponent("identity flair privatemessages"),h=encodeURIComponent(`${location.origin}/#/auth/reddit`),x=`https://www.reddit.com/api/v1/authorize?client_id=${a}&response_type=code&state=${l}&redirect_uri=${h}&duration=temporary&scope=${m}`;window.location.assign(x)},[d,s]),k=i.useCallback(async()=>{const{VITE_REDDIT_CLIENT_ID:a}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLScEbAUcDHUMhJjS-EFujSB4bE7WO7XxpuqcfYFoH-g2OBUY7w",VITE_RAFL_STATE:"preview",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},l="DEBUG_DOWNLOAD"+await d(s.uid),m=encodeURIComponent("identity flair privatemessages"),h=encodeURIComponent(`${location.origin}/#/auth/reddit`),x=`https://www.reddit.com/api/v1/authorize?client_id=${a}&response_type=code&state=${l}&redirect_uri=${h}&duration=temporary&scope=${m}`;window.location.assign(x)},[d,s.uid]),$=i.useCallback(async()=>{T(!0),await p(s.uid),E(null),T(!1),c("All data has been deleted")},[p,s]),u=r.length>0&&!oe.test(r.toString()),M=r.length===0||r===(t==null?void 0:t.displayName),Y=u?"Display name must only include A-Z, 0-9, _ and -.":"",z=r.length>0?` (${r}) `:"",C=b?"block":"flex";return e.jsx("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:L?e.jsx(ie,{}):e.jsxs(g.Fragment,{children:[e.jsxs("div",{style:{display:C,padding:16},children:[t!=null&&t.displayName?e.jsxs("div",{style:{marginBottom:10,marginRight:20,maxWidth:325},children:[e.jsxs("span",{style:{fontSize:"1.2rem",fontWeight:500},children:["Display Name",e.jsx("br",{})]}),"Your display name ",z," shows up on the leaderboard and your profile can be shared with others.",e.jsx("br",{}),e.jsx("br",{}),"Your Google login information will never be displayed to other users."]}):e.jsxs("div",{style:{marginBottom:10,marginRight:20,maxWidth:325},children:[e.jsxs("span",{style:{fontSize:"1.2rem",fontWeight:500},children:["Display Name",e.jsx("br",{})]}),"Your display name will show up on the leaderboard and your profile can be shared with others.",e.jsx("br",{}),e.jsx("br",{}),"Your Google login information will never be displayed to other users."]}),e.jsxs("div",{style:{width:"100%",marginTop:40},children:[e.jsx(D,{error:u,variant:"outlined",color:"secondary",label:"Display Name",helperText:Y,value:r||"",onChange:F,onFocus:N,inputProps:{maxLength:32},size:"small",style:{width:220}}),e.jsx(n,{variant:"outlined",color:u?void 0:"success",onClick:V,disabled:u||M,style:{marginLeft:16,marginRight:0,marginBottom:10,height:40},children:"Save"}),e.jsxs("div",{style:{width:"100%",textAlign:"left",margin:"10px 0px 28px 0px"},children:[(t==null?void 0:t.displayName)&&e.jsx(n,{variant:"outlined",color:"info",onClick:O,disabled:u,style:{marginBottom:10,color:"#4972ab",padding:"5px 10px"},children:"Clear Display Name"}),e.jsx(n,{variant:"outlined",color:"info",onClick:U,style:{marginLeft:15,marginBottom:10,padding:"5px 10px"},children:"View Profile"})]})]})]}),S&&e.jsxs("div",{style:{display:C,padding:16},children:[e.jsxs("div",{style:{marginBottom:10,marginRight:20,maxWidth:325},children:[e.jsxs("span",{style:{fontSize:"1.2rem",fontWeight:500},children:["Linked Accounts",e.jsx("br",{})]}),"Linked accounts are used to import your approved Belt and Dan Rankings. Rankings from Discord will update automatically as long as your account is linked. You will need to re-authorize with Reddit to update new approved belts."]}),e.jsxs("div",{style:{width:"100%",marginTop:40},children:[t!=null&&t.discordUsername?e.jsxs("div",{style:{width:"100%",marginBottom:10},children:[e.jsx(D,{variant:"outlined",label:"Discord Username",value:(t==null?void 0:t.discordUsername)||"",inputProps:{maxLength:32,readOnly:!0},size:"small",style:{width:200},color:"warning"}),e.jsx(n,{variant:"outlined",color:"warning",onClick:()=>R("Discord"),disabled:!(t!=null&&t.discordUsername),style:{marginLeft:16,marginRight:0,marginBottom:10,height:40},children:"Remove"})]}):e.jsx(n,{variant:"outlined",color:"warning",style:{marginBottom:16,height:40},onClick:P,children:"LINK DISCORD ACCOUNT"}),t!=null&&t.redditUsername?e.jsxs("div",{style:{width:"100%",padding:"8px 0px"},children:[e.jsx(D,{variant:"outlined",label:"Reddit Username",value:(t==null?void 0:t.redditUsername)||"",inputProps:{maxLength:32,readOnly:!0},size:"small",style:{width:200},color:"warning",readOnly:!0}),e.jsx(n,{variant:"outlined",color:"warning",onClick:()=>R("Reddit"),disabled:!(t!=null&&t.redditUsername),style:{marginLeft:16,marginRight:0,marginBottom:10,height:40},children:"Remove"})]}):e.jsx(n,{variant:"outlined",color:"warning",style:{marginBottom:16,height:40},onClick:W,children:"LINK REDDIT ACCOUNT"}),A&&e.jsx(n,{variant:"contained",color:"warning",style:{marginBottom:16,marginTop:10,height:40},onClick:k,children:"DEBUG REDDIT ACCOUNT"})]})]}),e.jsxs("div",{style:{width:"100%",textAlign:"center",margin:"10px 0px 10px 0px"},children:[e.jsx(n,{variant:"outlined",color:"error",onClick:B,style:{marginBottom:10,color:"#d31f1f",padding:"5px 110px"},children:"Delete All Data"}),e.jsxs(X,{anchorEl:y,open:!!y,onClose:()=>E(null),children:[e.jsxs("div",{style:{padding:20,textAlign:"center"},children:["This will permanently delete all of your data.",e.jsx("br",{}),"Are you sure?"]}),e.jsx("div",{style:{textAlign:"center"},children:e.jsx(n,{style:{marginBottom:10,color:"#000"},variant:"contained",onClick:$,edge:"start",color:"error",children:"Delete"})})]})]}),e.jsx("div",{style:{height:20}})]})})}const oe=/^[\sa-zA-Z0-9_-]{1,32}$/;function _e(){const{authLoaded:t,isLoggedIn:o}=i.useContext(v),{dbLoaded:p}=i.useContext(j);ee("LPU Belt Explorer - Edit Profile");const d=e.jsx(g.Fragment,{children:e.jsx(ae,{page:"collection"})});return e.jsxs(g.Fragment,{children:[e.jsx(J,{title:"Edit Profile",extras:d}),(!t||!p)&&e.jsxs(g.Fragment,{children:[e.jsx(re,{variant:"indeterminate",color:"secondary"}),e.jsx("img",{alt:"Loading",src:te,style:{marginLeft:"auto",marginRight:"auto",display:"block"}})]}),t&&!o&&e.jsx(ne,{}),t&&o&&p&&e.jsx(se,{}),e.jsx(K,{}),e.jsx(Z,{feature:"editprofile"})]})}export{_e as default};