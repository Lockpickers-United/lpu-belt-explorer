import{an as v,b as N,r as j,u as C,j as a,R as b}from"./index-dc14f103.js";import{C as L}from"./CopyProfileLinkButton-eca7079a.js";import{T as f,a as d}from"./ToggleButtonGroup-50d48bb3.js";import{L as A}from"./Link-03346f93.js";function P({profile:s={},page:e,owner:l,mostPopular:r}){const{userId:o}=v(),t=N(),n=(s.privacyAnonymous||!(s!=null&&s.displayName)?"anonymous":s==null?void 0:s.displayName).replace(/\s/g,"_"),m="/profile/"+o+"?name="+n,x="/profile/"+o+"/safelocks?name="+n,y="/profile/"+o+"/scorecard?name="+n;let i=e.charAt(0).toUpperCase()+e.slice(1);i=i.replace("Safelocks","Safe Locks");const c=j.useCallback(g=>{t(g)},[t]),u=s.displayName&&!s.privacyAnonymous?s.displayName.toLowerCase().endsWith("s")?`${s.displayName}'`:`${s.displayName}'s`:l&&!s.privacyAnonymous?"No Name":"Anonymous",p=o?`${u} ${i}`:"My "+i,{isMobile:k}=C(),h=k?{maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0,display:"block",padding:16,fontSize:"1.5rem",backgroundColor:"#202020",width:"100%"}:{maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0,display:"flex",padding:16,fontSize:"1.5rem",backgroundColor:"#202020",width:"100%"};return a.jsxs(b.Fragment,{children:[a.jsxs("div",{style:h,children:[a.jsxs("div",{style:{marginTop:6,display:"flex"},children:[a.jsx("div",{children:p}),a.jsx("div",{style:{marginTop:-2},children:a.jsx(L,{page:e,safeName:n,mostPopular:r})})]}),a.jsx("div",{style:{flexGrow:1,textAlign:"right"},children:a.jsxs(f,{variant:"outlined",size:"large",children:[a.jsx(d,{onClick:()=>c(m),selected:e==="collection",disabled:e==="collection",value:"collection",style:{padding:"2px 12px 2px 12px"},children:"Locks"}),a.jsx(d,{onClick:()=>c(x),selected:e==="safelocks",disabled:e==="safelocks",value:"safelocks",style:{padding:"2px 12px 2px 12px"},children:"Safes"}),a.jsx(d,{onClick:()=>c(y),selected:e==="scorecard",disabled:e==="scorecard",value:"scorecard",style:{padding:"2px 12px 2px 12px"},children:"Scorecard"})]})})]}),!s.privacyAnonymous&&!(s!=null&&s.displayName)&&l&&a.jsxs("div",{style:{backgroundColor:"#202020",padding:"0px 0px 20px 16px"},children:["Looks like you haven't set your Display Name yet. To set it now, ",a.jsx(A,{onClick:()=>t("/profile/edit"),style:{color:"#0a0"},children:"click here."})]})]})}export{P};
