import{K as N,M as W,j as e,r as u,G as z,I as V,u as j,R as D,an as E,A as F,a0 as _,a1 as q,Y as U,D as G,ao as O,Z as Y,N as $,F as K,T as Z}from"./index-a89c4977.js";import{D as J,a as Q,l as X}from"./filterFields-93ccd4d4.js";import{l as ee}from"./sortFields-cf9bc377.js";import{F as te,S as ie}from"./SortButton-8abc28d2.js";import{D as oe}from"./LockDataProvider-2d2e9280.js";import{L as R,a as re}from"./LockListContext-cd3be00f.js";import{S as se}from"./SearchBox-06031ddc.js";import{L as ae}from"./LoadingDisplay-f8ea520d.js";import{u as ne}from"./useData-5378f6a1.js";import{N as de}from"./NoProfileData-9cd53276.js";import{P as le}from"./ProfileNotFound-53dd6c96.js";import{C as ce,E as pe,a as me}from"./ExportButton-f4c160bc.js";import{I as he}from"./InlineFilterDisplay-5e2eb830.js";import"./index-dc278bd4.js";import{B as T}from"./nivo-bar.es-a18063f0.js";import{p as I}from"./chartDefaults-9fc07b21.js";import{P as xe}from"./ProfileHeader-ea88d374.js";import"./Badge-63e09a6a.js";import"./Chip-ff4c90cf.js";import"./Select-c934e749.js";import"./Box-9a903a78.js";import"./Sort-5bdb278a.js";import"./entryName-7ebc8faf.js";import"./Search-e110497a.js";import"./TextField-096c22fe.js";import"./LPU-c3fa7122.js";import"./LinearProgress-1d597dc8.js";import"./mycollection-0ec86312.js";import"./BeltStripe-ff6c7754.js";import"./BeltIcon-ed56ed28.js";import"./Launch-066de9f4.js";import"./PhotoCamera-ecb038b3.js";import"./Autocomplete-385ec614.js";import"./index-30f51821.js";import"./DialogContent-d5010e4c.js";import"./ListItem-c26ef6b4.js";import"./Dialog-95a1459b.js";import"./VideocamOutlined-04b2793d.js";import"./FormGroup-66199ccd.js";import"./Checkbox-6a5b2fd8.js";import"./LoadingDisplay-537f09da.js";import"./LoadingDisplaySmall-86e2ae17.js";import"./FieldValue-c30ae55a.js";import"./CopyEntryTextButton-b927c9b6.js";import"./Link-5fe324d6.js";import"./ContentCopy-2e24f5cc.js";import"./AccordionSummary-c20bcfba.js";import"./index-2f35114e.js";import"./index-ab9e2ba3.js";import"./AccordionActions-a401ec6a.js";import"./download-d1aa1a0b.js";import"./ImageViewer-b20d6a6e.js";import"./Link-8d133c4d.js";import"./nivo-legends.es-bdc93e02.js";import"./CopyProfileLinkButton-4037cabe.js";import"./ToggleButtonGroup-ce72776a.js";var P={},ue=W;Object.defineProperty(P,"__esModule",{value:!0});var H=P.default=void 0,ge=ue(N()),we=e;H=P.default=(0,ge.default)((0,we.jsx)("path",{d:"M3 14h4v-4H3zm0 5h4v-4H3zM3 9h4V5H3zm5 5h13v-4H8zm0 5h13v-4H8zM8 5v4h13V5z"}),"ViewList");function fe(){const{compact:i,setCompact:n,setExpanded:p}=u.useContext(R),d=u.useCallback(()=>{n(!i),p(null)},[i,n,p]);return e.jsx(z,{title:"Toggle Compact View",arrow:!0,disableFocusListener:!0,children:e.jsx(V,{onClick:d,children:e.jsx(H,{color:i?"secondary":"inherit"})})})}function ve({lockCollection:i,userText:n,collectionBarHeight:p}){const d=i.own?i.own.length:0,g=i.picked?i.picked.length:0,s=i.recordedLocks?i.recordedLocks.length:0,a=i.wishlist?i.wishlist.length:0,t=d+g+s+a?{own:d,picked:g,recorded:s,wishlist:a}:{own:0,picked:0,recorded:0,wishlist:0},r={own:14,picked:11,recorded:11,wishlist:8},x={own:250,picked:280,recorded:260,wishlist:100},h={own:Math.min(r.own,t.own),picked:Math.min(r.picked,t.picked),recorded:Math.min(r.recorded,t.recorded),wishlist:Math.min(r.wishlist,t.wishlist)},o={own:t.own>r.own?0:r.own-h.own,picked:t.picked>r.picked?0:r.picked-h.picked,recorded:t.recorded>r.recorded?0:r.recorded-h.recorded,wishlist:t.wishlist>r.wishlist?0:r.wishlist-h.wishlist},c={own:2,picked:2,recorded:2,wishlist:2},A={own:Math.max(t.own-(h.own+o.own+c.own),0),picked:Math.max(t.picked-(h.picked+o.picked+c.picked),0),recorded:Math.max(t.recorded-(h.recorded+o.recorded+c.recorded),0),wishlist:Math.max(t.wishlist-(h.wishlist+o.wishlist+c.wishlist),0)},y={own:Math.min(x.own-t.own,x.own-r.own-c.own),picked:Math.min(x.picked-t.picked,x.picked-r.picked-c.picked),recorded:Math.min(x.recorded-t.recorded,x.recorded-r.recorded-c.recorded),wishlist:Math.min(x.wishlist-t.wishlist,x.wishlist-r.wishlist-c.wishlist)},k=["own","picked","recorded","wishlist"],S=k.map((w,f)=>({row:k[f],"Average A":h[w],"Average B":o[w],Average:c[w],USER:A[w],"Top 10":y[w]})),{width:B}=j(),C=B<=560,L=p,M=C?{top:10,right:20,bottom:50,left:55}:{top:10,right:20,bottom:50,left:55},b=["#3c90c5","#aaa","#000","#3c90c5","#aaa"],l=i?[{title:n,color:"#3c90c5",width:"14px"}]:[];l.push({title:"Average",color:"#000",width:"35px"},{title:"Top 10 Average",color:"#aaaaaa",width:"120px"});const v=({items:w})=>e.jsxs("div",{className:"chart-legend",style:{display:"flex",fontSize:".9rem",color:"#ddd",marginTop:13},children:[e.jsx("div",{style:{width:"100%"}}),w.map(f=>e.jsxs("div",{style:{display:"flex",padding:"0px 18px 24px 18px"},children:[e.jsx("div",{style:{backgroundColor:f.color,height:15,width:15,margin:"2px 6px 0px 0px",border:"1px solid #555"}}),e.jsx("div",{style:{textAlign:"left",width:f.width},children:f.title})]},f.title)),e.jsx("div",{style:{width:"100%"}})]});return e.jsxs(D.Fragment,{children:[e.jsx("div",{style:{height:L},children:e.jsx(T,{data:S,keys:["Average A","Average B","Average","USER","Top 10"],theme:I,indexBy:"row",margin:M,padding:.2,valueScale:{type:"linear"},colors:b,enableLabel:!1,axisLeft:{tickSize:5,tickPadding:5,tickRotation:0,tickValues:5,format:"00",legend:"Saves",legendPosition:"middle",legendOffset:-45,legendOpacity:.9},axisBottom:{tickRotation:-45},enableGridY:!1,isInteractive:!1,animate:!1})}),e.jsx(v,{items:l})]})}function je({beltData:i}){const{width:n}=j(),p=n<=360,d=n<=560,g=175,s=d?{top:15,right:20,bottom:60,left:20}:{top:0,right:10,bottom:60,left:10},a=["#d5d5d5","#d8d801","#ed7d01","#389700","#0090de","#634b9f","#9d5918","#ba0303","#000","#373737"],m=["#000","#000","#000","#000","#000","#000","#000","#000","#ddd","#ddd"];return e.jsxs("div",{style:{height:g,padding:"0px 8px 0px 8px",width:"100%"},children:[e.jsx(T,{data:i,margin:s,padding:.15,colors:t=>a[t.index%a.length],animate:!0,axisBottom:{tickRotation:-45},axisLeft:null,enableGridY:!1,theme:I,isInteractive:!1,enableLabel:!0,label:t=>t.data.count,labelSkipWidth:12,labelSkipHeight:12,labelTextColor:t=>m[t.index%m.length]}),e.jsx("div",{className:"chart-legend",style:{fontSize:".9rem",color:"#ddd",textAlign:"center",width:"100%",marginTop:"3px"},children:"Belt Distribution"})]},"bar")}function ke({profile:i,entries:n}){const{userId:p}=E(),{user:d}=u.useContext(F),g=p===(d==null?void 0:d.uid)?"You":"User",s=u.useMemo(()=>{const M=U.concat("Unranked"),b=n.map(({belt:l})=>l.includes("Black")?"Black":l).reduce((l,v)=>(l[v]||(l[v]=0),l[v]++,l),{});return M.map(l=>({id:l,label:l,count:b[l]||0,value:b[l]||0}))},[n]),{isMobile:a}=j(),m=a?{maxWidth:700,borderRadius:0}:{maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0},{width:t}=j(),r=t<=360,x=t<=395,h=t<=428,o=t<=560,y={...{width:"100%",padding:"0px",marginBottom:12,alignItems:"center",marginLeft:"auto",marginRight:"auto"},...o?{}:{display:"flex"}},k=o?"100%":"50%",S=o?"100%":"50%",B=r?200:o?210:180,C=o?160:170,L=r?150:170;return e.jsx(_,{style:m,sx:{paddingBottom:5},children:e.jsx(q,{style:{paddingTop:0,paddingLeft:8},children:e.jsx("div",{style:{textAlign:"center"},children:e.jsxs("div",{style:y,children:[e.jsx("div",{style:{width:k,verticalAlign:"top",height:B},children:e.jsx(ve,{lockCollection:i,userText:g,collectionBarHeight:C})}),e.jsx("div",{style:{width:S,height:L,marginTop:"0px"},children:e.jsx(je,{beltData:s})})]})})})})}function be({profile:i,owner:n}){const{compact:p}=u.useContext(R),[d,g]=u.useState(!1),{visibleEntries:s=[]}=u.useContext(J),a=u.useDeferredValue(d);return e.jsx(D.Fragment,{children:e.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[e.jsx(xe,{profile:i,page:"collection",owner:n}),e.jsx(he,{profile:i,collectionType:"locks"}),e.jsx(ke,{profile:i,entries:s}),p?e.jsx(ce,{entries:s}):s.map(m=>e.jsx(pe,{entry:m,expanded:m.id===a,onExpand:g},m.id))]})})}function Bt(){const{user:i}=u.useContext(F),{userId:n}=E(),{getProfile:p}=u.useContext(G),{isMobile:d}=j(),g=u.useCallback(async()=>{try{const o=await p(n);if(o){const c=o.displayName?o.displayName.toLowerCase().endsWith("s")?`${o.displayName}'`:`${o.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${c} Profile`}return o}catch(o){return console.error("Error loading profile.",o),null}},[p,n]),{data:s={},loading:a,error:m}=ne({loadFn:g}),t=u.useMemo(()=>{if(a||!s)return[];const o=new Set(O.locks.getCollected(s));return Y.filter(c=>o.has(c.id))},[s,a]),r=e.jsxs(D.Fragment,{children:[e.jsx(se,{label:"Collection"}),e.jsx(te,{}),e.jsx(ie,{sortValues:ee}),!d&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}}),e.jsx(fe,{})]}),x=a?"Loading...":"Profile",h=e.jsx("div",{style:{margin:"30px 0px"},children:e.jsx(me,{text:!0})});return e.jsx(Q,{filterFields:X,children:e.jsx(oe,{allEntries:t,profile:s,children:e.jsxs(re,{children:[e.jsx($,{title:x,extras:r}),a&&e.jsx(ae,{}),!a&&s&&!m&&e.jsx(be,{profile:s,owner:i&&i.uid===n}),!a&&s&&!m&&t.length===0&&e.jsx(de,{}),!a&&(!s||m)&&e.jsx(le,{}),e.jsx(K,{before:h}),e.jsx(Z,{feature:"profile"})]})})})}export{Bt as default};
