import{ac as v,p as N,r as j,j as a,R as C}from"./index-b4a073ec.js";import{u as L}from"./useWindowSize-7d42790c.js";import{C as b}from"./CopyProfileLinkButton-bc95eaaa.js";import{T as f,a as d}from"./ToggleButtonGroup-430a7d63.js";import{L as A}from"./Link-306a9ec2.js";function W({profile:s={},page:e,owner:l,mostPopular:r}){const{userId:o}=v(),t=N(),n=(s.privacyAnonymous||!(s!=null&&s.displayName)?"anonymous":s==null?void 0:s.displayName).replace(/\s/g,"_"),m="/profile/"+o+"?name="+n,x="/profile/"+o+"/safelocks?name="+n,y="/profile/"+o+"/scorecard?name="+n;let i=e.charAt(0).toUpperCase()+e.slice(1);i=i.replace("Safelocks","Safe Locks");const c=j.useCallback(g=>{t(g)},[t]),u=s.displayName&&!s.privacyAnonymous?s.displayName.toLowerCase().endsWith("s")?`${s.displayName}'`:`${s.displayName}'s`:l&&!s.privacyAnonymous?"No Name":"Anonymous",p=o?`${u} ${i}`:"My "+i,{isMobile:k}=L(),h=k?{maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0,display:"block",padding:16,fontSize:"1.5rem",backgroundColor:"#202020",width:"100%"}:{maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0,display:"flex",padding:16,fontSize:"1.5rem",backgroundColor:"#202020",width:"100%"};return a.jsxs(C.Fragment,{children:[a.jsxs("div",{style:h,children:[a.jsxs("div",{style:{marginTop:6,display:"flex"},children:[a.jsx("div",{children:p}),a.jsx("div",{style:{marginTop:-2},children:a.jsx(b,{page:e,safeName:n,mostPopular:r})})]}),a.jsx("div",{style:{flexGrow:1,textAlign:"right"},children:a.jsxs(f,{variant:"outlined",size:"large",children:[a.jsx(d,{onClick:()=>c(m),selected:e==="collection",disabled:e==="collection",value:"collection",style:{padding:"2px 12px 2px 12px"},children:"Locks"}),a.jsx(d,{onClick:()=>c(x),selected:e==="safelocks",disabled:e==="safelocks",value:"safelocks",style:{padding:"2px 12px 2px 12px"},children:"Safes"}),a.jsx(d,{onClick:()=>c(y),selected:e==="scorecard",disabled:e==="scorecard",value:"scorecard",style:{padding:"2px 12px 2px 12px"},children:"Scorecard"})]})})]}),!s.privacyAnonymous&&!(s!=null&&s.displayName)&&l&&a.jsxs("div",{style:{backgroundColor:"#202020",padding:"0px 0px 20px 16px"},children:["Looks like you haven't set your Display Name yet. To set it now, ",a.jsx(A,{onClick:()=>t("/profile/edit"),style:{color:"#0a0"},children:"click here."})]})]})}export{W as P};
