import{r as i,D as C,X as Z,a2 as G,b as H,A as j,u as Y,H as c,j as e,R as g,B as n,a9 as q,N as X,F as K,T as J}from"./index-4ae4bfb0.js";import{u as ee}from"./useDocumentTitle-969ebc01.js";import{l as te}from"./LPU-c3fa7122.js";import{C as ae}from"./CopyProfileLinkButton-398f8986.js";import{L as ie}from"./LoadingDisplay-8ae45fa5.js";import{T as I}from"./TextField-0f11ab2d.js";import{P as ne}from"./MustBeLoggedIn-e5b00b68.js";import{L as re}from"./LinearProgress-51ee7cf2.js";import"./Link-d5457ad6.js";import"./Box-58d3dbb1.js";import"./CircularProgress-f598c7cb.js";import"./Select-f6d61f71.js";function se(){const{lockCollection:t,updateProfileDisplayName:o,deleteAllUserData:h,oauthState:d,removeServiceAuth:D}=i.useContext(C),{beta:w}=i.useContext(Z),[S]=G(),L=S.get("debug"),[r,_]=i.useState(t.displayName||""),[y,x]=i.useState(null),[A,T]=i.useState(!1),R=H(),{user:s}=i.useContext(j),{isMobile:b}=Y(),N=i.useCallback(a=>{const{value:l}=a.target;_(l)},[]),V=i.useCallback(a=>a.target.select(),[]),F=i.useCallback(async()=>{try{await o(r),c("Profile updated")}catch(a){console.error("Error while updating profile",a),c("Error while updating profile")}},[o,r]),O=i.useCallback(async()=>{try{await o(null),_(""),c("Display Name cleared")}catch(a){console.error("Error while updating profile",a),c("Error while updating profile")}},[o]),P=i.useCallback(()=>{R(`/profile/${s.uid}`)},[R,s.uid]),B=i.useCallback(a=>{a.preventDefault(),a.stopPropagation(),x(a.currentTarget)},[]),f=i.useCallback(async a=>{await D(a),c(`${a} account removed.`)},[D]),U=i.useCallback(()=>{const{VITE_DISCORD_CLIENT_ID:a}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLScjl1ZZ2FHBhMHQjw-8-T8Tgh7SvhDIc1H4uxyXZPRheI159Q",VITE_RAFL_STATE:"preview",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},l=encodeURIComponent("identify"),u=encodeURIComponent(`${location.origin}/#/auth/discord`),m=`https://discord.com/oauth2/authorize?client_id=${a}&response_type=code&redirect_uri=${u}&scope=${l}`;window.location.assign(m)},[]),k=i.useCallback(async()=>{const{VITE_REDDIT_CLIENT_ID:a}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLScjl1ZZ2FHBhMHQjw-8-T8Tgh7SvhDIc1H4uxyXZPRheI159Q",VITE_RAFL_STATE:"preview",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},l=await d(s.uid),u=encodeURIComponent("identity flair privatemessages"),m=encodeURIComponent(`${location.origin}/#/auth/reddit`),E=`https://www.reddit.com/api/v1/authorize?client_id=${a}&response_type=code&state=${l}&redirect_uri=${m}&duration=temporary&scope=${u}`;window.location.assign(E)},[d,s]),W=i.useCallback(async()=>{const{VITE_REDDIT_CLIENT_ID:a}={VITE_LOCAL_DATA:"false",VITE_DISCORD_CLIENT_ID:"1271550138929774725",VITE_DISCORD_CLIENT_SECRET:"CoecO8cx2SyhMq2k3WdWNp-lavxYkeS-",VITE_REDDIT_CLIENT_ID:"i_lvEF-IFPalom2BR_lVjg",VITE_REDDIT_CLIENT_SECRET:"09PAhQfve1tysFh3jQAtmFaG5pWG0A",VITE_DEV_FIRESTORE:"false",VITE_RAFL_VIEW_FORM_ID:"1FAIpQLScjl1ZZ2FHBhMHQjw-8-T8Tgh7SvhDIc1H4uxyXZPRheI159Q",VITE_RAFL_STATE:"preview",BASE_URL:"/",MODE:"production",DEV:!1,PROD:!0,SSR:!1},l="DEBUG_DOWNLOAD"+await d(s.uid),u=encodeURIComponent("identity flair privatemessages"),m=encodeURIComponent(`${location.origin}/#/auth/reddit`),E=`https://www.reddit.com/api/v1/authorize?client_id=${a}&response_type=code&state=${l}&redirect_uri=${m}&duration=temporary&scope=${u}`;window.location.assign(E)},[d,s.uid]),$=i.useCallback(async()=>{T(!0),await h(s.uid),x(null),T(!1),c("All data has been deleted")},[h,s]),p=r.length>0&&!oe.test(r.toString()),Q=r.length===0||r===(t==null?void 0:t.displayName),M=p?"Display name must only include A-Z, 0-9, _ and -.":"",z=r.length>0?` (${r}) `:"",v=b?"block":"flex";return e.jsx("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:A?e.jsx(ie,{}):e.jsxs(g.Fragment,{children:[e.jsxs("div",{style:{display:v,padding:16},children:[t!=null&&t.displayName?e.jsxs("div",{style:{marginBottom:10,marginRight:20,maxWidth:325},children:[e.jsxs("span",{style:{fontSize:"1.2rem",fontWeight:500},children:["Display Name",e.jsx("br",{})]}),"Your display name ",z," shows up on the leaderboard and your profile can be shared with others.",e.jsx("br",{}),e.jsx("br",{}),"Your Google login information will never be displayed to other users."]}):e.jsxs("div",{style:{marginBottom:10,marginRight:20,maxWidth:325},children:[e.jsxs("span",{style:{fontSize:"1.2rem",fontWeight:500},children:["Display Name",e.jsx("br",{})]}),"Your display name will show up on the leaderboard and your profile can be shared with others.",e.jsx("br",{}),e.jsx("br",{}),"Your Google login information will never be displayed to other users."]}),e.jsxs("div",{style:{width:"100%",marginTop:40},children:[e.jsx(I,{error:p,variant:"outlined",color:"secondary",label:"Display Name",helperText:M,value:r||"",onChange:N,onFocus:V,inputProps:{maxLength:32},size:"small",style:{width:220}}),e.jsx(n,{variant:"outlined",color:p?void 0:"success",onClick:F,disabled:p||Q,style:{marginLeft:16,marginRight:0,marginBottom:10,height:40},children:"Save"}),e.jsxs("div",{style:{width:"100%",textAlign:"left",margin:"10px 0px 28px 0px"},children:[(t==null?void 0:t.displayName)&&e.jsx(n,{variant:"outlined",color:"info",onClick:O,disabled:p,style:{marginBottom:10,color:"#4972ab",padding:"5px 10px"},children:"Clear Display Name"}),e.jsx(n,{variant:"outlined",color:"info",onClick:P,style:{marginLeft:15,marginBottom:10,padding:"5px 10px"},children:"View Profile"})]})]})]}),w&&e.jsxs("div",{style:{display:v,padding:16},children:[e.jsxs("div",{style:{marginBottom:10,marginRight:20,maxWidth:325},children:[e.jsxs("span",{style:{fontSize:"1.2rem",fontWeight:500},children:["Linked Accounts",e.jsx("br",{})]}),"Linked accounts are used to import your approved Belt and Dan Rankings. Rankings from Discord will update automatically as long as your account is linked. You will need to re-authorize with Reddit to update new approved belts."]}),e.jsxs("div",{style:{width:"100%",marginTop:40},children:[t!=null&&t.discordUsername?e.jsxs("div",{style:{width:"100%",marginBottom:10},children:[e.jsx(I,{variant:"outlined",label:"Discord Username",value:(t==null?void 0:t.discordUsername)||"",inputProps:{maxLength:32,readOnly:!0},size:"small",style:{width:200},color:"warning"}),e.jsx(n,{variant:"outlined",color:"warning",onClick:()=>f("Discord"),disabled:!(t!=null&&t.discordUsername),style:{marginLeft:16,marginRight:0,marginBottom:10,height:40},children:"Remove"})]}):e.jsx(n,{variant:"outlined",color:"warning",style:{marginBottom:16,height:40},onClick:U,children:"LINK DISCORD ACCOUNT"}),t!=null&&t.redditUsername?e.jsxs("div",{style:{width:"100%",padding:"8px 0px"},children:[e.jsx(I,{variant:"outlined",label:"Reddit Username",value:(t==null?void 0:t.redditUsername)||"",inputProps:{maxLength:32,readOnly:!0},size:"small",style:{width:200},color:"warning",readOnly:!0}),e.jsx(n,{variant:"outlined",color:"warning",onClick:()=>f("Reddit"),disabled:!(t!=null&&t.redditUsername),style:{marginLeft:16,marginRight:0,marginBottom:10,height:40},children:"Remove"})]}):e.jsx(n,{variant:"outlined",color:"warning",style:{marginBottom:16,height:40},onClick:k,children:"LINK REDDIT ACCOUNT"}),L&&e.jsx(n,{variant:"contained",color:"warning",style:{marginBottom:16,marginTop:10,height:40},onClick:W,children:"DEBUG REDDIT ACCOUNT"})]})]}),e.jsxs("div",{style:{width:"100%",textAlign:"center",margin:"10px 0px 10px 0px"},children:[e.jsx(n,{variant:"outlined",color:"error",onClick:B,style:{marginBottom:10,color:"#d31f1f",padding:"5px 110px"},children:"Delete All Data"}),e.jsxs(q,{anchorEl:y,open:!!y,onClose:()=>x(null),children:[e.jsxs("div",{style:{padding:20,textAlign:"center"},children:["This will permanently delete all of your data.",e.jsx("br",{}),"Are you sure?"]}),e.jsx("div",{style:{textAlign:"center"},children:e.jsx(n,{style:{marginBottom:10,color:"#000"},variant:"contained",onClick:$,edge:"start",color:"error",children:"Delete"})})]})]}),e.jsx("div",{style:{height:20}})]})})}const oe=/^[\sa-zA-Z0-9_-]{1,32}$/;function _e(){const{authLoaded:t,isLoggedIn:o}=i.useContext(j),{dbLoaded:h}=i.useContext(C);ee("LPU Belt Explorer - Edit Profile");const d=e.jsx(g.Fragment,{children:e.jsx(ae,{page:"collection"})});return e.jsxs(g.Fragment,{children:[e.jsx(X,{title:"Edit Profile",extras:d}),(!t||!h)&&e.jsxs(g.Fragment,{children:[e.jsx(re,{variant:"indeterminate",color:"secondary"}),e.jsx("img",{alt:"Loading",src:te,style:{marginLeft:"auto",marginRight:"auto",display:"block"}})]}),t&&!o&&e.jsx(ne,{}),t&&o&&h&&e.jsx(se,{}),e.jsx(K,{}),e.jsx(J,{feature:"editprofile"})]})}export{_e as default};
