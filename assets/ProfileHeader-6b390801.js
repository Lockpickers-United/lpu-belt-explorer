import{ae as h,p as k,r as N,j as a,R as v}from"./index-878fa120.js";import{u as j}from"./useWindowSize-f8a395d0.js";import{C as b}from"./CopyProfileLinkButton-45ef28e5.js";import{T as C,a as i}from"./ToggleButtonGroup-3fe1e616.js";const A="/assets/mycollection-8a0b4848.png";function P({profile:s={},page:e}){const{userId:o}=h(),d=k(),n=(s.privacyAnonymous||!(s!=null&&s.displayName)?"anonymous":s==null?void 0:s.displayName).replace(/\s/g,"_"),l="/profile/"+o+"?name="+n,r="/profile/"+o+"/safelocks?name="+n,m="/profile/"+o+"/scorecard?name="+n;let t=e.charAt(0).toUpperCase()+e.slice(1);t=t.replace("Safelocks","Safe Locks");const c=N.useCallback(g=>{d(g)},[d]),x=s.privacyAnonymous?"Anonymous":s.displayName?s.displayName.toLowerCase().endsWith("s")?`${s.displayName}'`:`${s.displayName}'s`:"No Name",u=o?`${x} ${t}`:"My "+t,{isMobile:y}=j(),p=y?{maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0,display:"block",padding:16,fontSize:"1.5rem",backgroundColor:"#202020",width:"100%"}:{maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0,display:"flex",padding:16,fontSize:"1.5rem",backgroundColor:"#202020",width:"100%"};return a.jsxs(v.Fragment,{children:[a.jsxs("div",{style:p,children:[a.jsxs("div",{style:{marginTop:6,display:"flex"},children:[a.jsx("div",{children:u}),a.jsx("div",{style:{marginTop:-2},children:a.jsx(b,{page:e,safeName:n})})]}),a.jsx("div",{style:{flexGrow:1,textAlign:"right"},children:a.jsxs(C,{variant:"outlined",size:"large",children:[a.jsx(i,{onClick:()=>c(l),selected:e==="collection",disabled:e==="collection",value:"collection",style:{padding:"2px 12px 2px 12px"},children:"Locks"}),a.jsx(i,{onClick:()=>c(r),selected:e==="safelocks",disabled:e==="safelocks",value:"safelocks",style:{padding:"2px 12px 2px 12px"},children:"Safes"}),a.jsx(i,{onClick:()=>c(m),selected:e==="scorecard",disabled:e==="scorecard",value:"scorecard",style:{padding:"2px 12px 2px 12px"},children:"Scorecard"})]})})]}),!s.privacyAnonymous&&!(s!=null&&s.displayName)&&!1]})}export{P,A as m};
