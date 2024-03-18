import{r,J as x,u as F,X as y,e as d,j as e,a0 as f,a1 as b,a2 as j,B as c,a3 as D,b as A,R as u,N as Y,K as G,O as V}from"./index-5716d32b.js";import{l as W}from"./LPU-c3fa7122.js";import{C as $}from"./CopyProfileLinkButton-56a1eb58.js";import{T as z}from"./TextField-6af6a159.js";import{L as I}from"./LinearProgress-0c80ebdc.js";import"./Link-9a85c542.js";import"./InputLabel-06e461f2.js";function Z(){const{lockCollection:a,updateProfileVisibility:s,clearProfile:n}=r.useContext(x),[t,p]=r.useState(a.displayName||""),[m]=r.useState(!0),h=F(),{user:g}=r.useContext(y),o=a!=null&&a.displayName?a!=null&&a.public?"public":"private":"none",v=r.useCallback(i=>{const{value:S}=i.target;p(S)},[]),w=r.useCallback(i=>i.target.select(),[]),C=r.useCallback(async()=>{try{await s(m,t),d("Profile updated")}catch(i){console.error("Error while updating profile",i),d("Error while updating profile")}},[s,m,t]),P=r.useCallback(async()=>{try{await n(),p(""),d("Display Name cleared")}catch(i){console.error("Error while updating profile",i),d("Error while updating profile")}},[n]),L=r.useCallback(()=>{h(`/profile/${g.uid}`)},[h,g.uid]),l=t.length>0&&!_.test(t.toString()),N=t.length===0||t===(a==null?void 0:a.displayName)&&o!=="private",B=l?"Display name must only include A-Z, 0-9, _ and -.":"",T=t.length>0?"Edit Profile":"Create Profile",k=t.length>0?` (${t}) `:"",E=o==="private"?"Save Public":"Save",R=o==="private"?200:260;return e.jsxs(f,{style:{maxWidth:380,marginLeft:"auto",marginRight:"auto",marginTop:16,marginBottom:46},children:[e.jsx(b,{title:T,action:null}),e.jsxs(j,{children:[o==="none"&&e.jsxs("div",{style:{marginBottom:10},children:["Your display name will show up on the leaderboard and your profile can be shared with others.",e.jsx("br",{}),e.jsx("br",{}),"Your Google login information will never be displayed to other users."]}),o==="public"&&e.jsxs("div",{style:{marginBottom:10},children:["Your display name ",k," shows up on the leaderboard and your profile can be shared by clicking the link icon above.",e.jsx("br",{}),e.jsx("br",{}),"Your Google login information will never be displayed to other users."]}),o==="private"&&e.jsxs("div",{style:{marginBottom:10},children:["Private profiles are going away soon. Click Save to make your profile public or Clear to remove your display name. Public profiles can be shared and will appear on the leaderboard.",e.jsx("br",{}),e.jsx("br",{}),"No matter what you choose, your Google login information will never be displayed to other users."]}),e.jsx("br",{}),e.jsxs("div",{style:{width:"100%"},children:[e.jsx(z,{error:l,variant:"outlined",color:"secondary",label:"Display Name",helperText:B,value:t||"",onChange:v,onFocus:w,inputProps:{maxLength:32},size:"small",style:{width:R}}),e.jsx(c,{variant:"outlined",color:l?void 0:"success",onClick:C,disabled:l||N,style:{marginLeft:16,marginRight:0,marginBottom:10,height:40},children:E})]})]}),e.jsx(D,{children:e.jsxs("div",{style:{width:"100%",textAlign:"center",margin:"10px 0px 10px 0px"},children:[(a==null?void 0:a.displayName)&&e.jsx(c,{variant:"outlined",color:"info",onClick:P,disabled:l,style:{marginBottom:10,color:"#4972ab",padding:"5px 19px"},children:"Clear Display Name"}),e.jsx(c,{variant:"outlined",color:"info",onClick:L,style:{marginLeft:15,marginBottom:10,color:"#4972ab",padding:"5px 19px"},children:"View Profile"})]})})]})}const _=/^[\sa-zA-Z0-9_-]{1,32}$/;function q(){const a={marginTop:16,maxWidth:350,marginLeft:"auto",marginRight:"auto",borderRadius:0};return e.jsxs(f,{style:a,children:[e.jsx(b,{title:"Log In!"}),e.jsx(j,{children:e.jsx(A,{variant:"h6",align:"center",children:"You must be logged in to edit your profile."})})]})}function U(){const{authLoaded:a,isLoggedIn:s}=r.useContext(y),{dbLoaded:n}=r.useContext(x),t=e.jsx(u.Fragment,{children:e.jsx($,{})});return e.jsxs(u.Fragment,{children:[e.jsx(Y,{title:"Edit Profile",extras:t}),(!a||!n)&&e.jsxs(u.Fragment,{children:[e.jsx(I,{variant:"indeterminate",color:"secondary"}),e.jsx("img",{alt:"Loading",src:W,style:{marginLeft:"auto",marginRight:"auto",display:"block"}})]}),a&&!s&&e.jsx(q,{}),a&&s&&n&&e.jsx(Z,{}),e.jsx(G,{}),e.jsx(V,{feature:"editprofile"})]})}export{U as default};
