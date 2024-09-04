import{j as e,R as M,ae as A,r as u,U as E,V as R,W,H as N,J as I,af as H,K as U,N as z,O,P as V}from"./index-03f7f184.js";import{D as G,a as Y,l as $}from"./BeltStripe-92be6882.js";import{S as q,F as J,a as K,l as Q}from"./sortFields-2dfc02c5.js";import{D as X}from"./LockDataProvider-66ea82a2.js";import{L as Z,a as _}from"./LockListContext-8528a58e.js";import{C as ee,E as te,T as ie}from"./ToggleCompactButton-ad77848d.js";import{L as oe}from"./LoadingDisplay-b11c1229.js";import{u as se}from"./useData-50cd3b3b.js";import{u as j}from"./useWindowSize-ca99ee8d.js";import{N as re}from"./NoProfileData-21cdc61a.js";import{P as ae}from"./ProfileNotFound-7369bba5.js";import{I as ne}from"./InlineFilterDisplay-c6004115.js";import{B as F}from"./nivo-bar.es-6859e706.js";import{p as T}from"./chartDefaults-9fc07b21.js";import{P as de}from"./ProfileHeader-3f4554a6.js";import"./Select-7cd51ee9.js";import"./LoadingDisplay-fbea82b9.js";import"./Search-3c4fee4f.js";import"./Sort-9571245a.js";import"./TextField-11e81479.js";import"./CollectionButton-be90487c.js";import"./PhotoCamera-73e14337.js";import"./Dialog-3ff9c834.js";import"./Autocomplete-202ac5ca.js";import"./index-ade5c727.js";import"./ListItem-181bd844.js";import"./index-e6ce98a9.js";import"./index-232b21aa.js";import"./LPU-c3fa7122.js";import"./LinearProgress-d3c0a794.js";import"./ImageViewer-000b3f20.js";import"./Link-4f6cb35f.js";import"./ContentCopy-3e11d357.js";import"./nivo-legends.es-60f354a5.js";import"./CopyProfileLinkButton-50cee6cf.js";import"./ToggleButtonGroup-9178fab3.js";import"./Link-8c78cef7.js";function le({lockCollection:s,userText:l,collectionBarHeight:h}){const c=s.own?s.own.length:0,x=s.picked?s.picked.length:0,r=s.recordedLocks?s.recordedLocks.length:0,a=s.wishlist?s.wishlist.length:0,t=c+x+r+a?{own:c,picked:x,recorded:r,wishlist:a}:{own:0,picked:0,recorded:0,wishlist:0},o={own:14,picked:11,recorded:11,wishlist:8},m={own:250,picked:280,recorded:260,wishlist:100},i={own:Math.min(o.own,t.own),picked:Math.min(o.picked,t.picked),recorded:Math.min(o.recorded,t.recorded),wishlist:Math.min(o.wishlist,t.wishlist)},n={own:t.own>o.own?0:o.own-i.own,picked:t.picked>o.picked?0:o.picked-i.picked,recorded:t.recorded>o.recorded?0:o.recorded-i.recorded,wishlist:t.wishlist>o.wishlist?0:o.wishlist-i.wishlist},g={own:2,picked:2,recorded:2,wishlist:2},P={own:Math.max(t.own-(i.own+n.own+g.own),0),picked:Math.max(t.picked-(i.picked+n.picked+g.picked),0),recorded:Math.max(t.recorded-(i.recorded+n.recorded+g.recorded),0),wishlist:Math.max(t.wishlist-(i.wishlist+n.wishlist+g.wishlist),0)},y={own:Math.min(m.own-t.own,m.own-o.own-g.own),picked:Math.min(m.picked-t.picked,m.picked-o.picked-g.picked),recorded:Math.min(m.recorded-t.recorded,m.recorded-o.recorded-g.recorded),wishlist:Math.min(m.wishlist-t.wishlist,m.wishlist-o.wishlist-g.wishlist)},k=["own","picked","recorded","wishlist"],S=k.map((w,f)=>({row:k[f],"Average A":i[w],"Average B":n[w],Average:g[w],USER:P[w],"Top 10":y[w]})),{width:B}=j(),L=B<=560,C=h,D=L?{top:10,right:20,bottom:50,left:55}:{top:10,right:20,bottom:50,left:55},b=["#3c90c5","#aaa","#000","#3c90c5","#aaa"],d=s?[{title:l,color:"#3c90c5",width:"14px"}]:[];d.push({title:"Average",color:"#000",width:"35px"},{title:"Top 10 Average",color:"#aaaaaa",width:"120px"});const v=({items:w})=>e.jsxs("div",{className:"chart-legend",style:{display:"flex",fontSize:".9rem",color:"#ddd",marginTop:13},children:[e.jsx("div",{style:{width:"100%"}}),w.map(f=>e.jsxs("div",{style:{display:"flex",padding:"0px 18px 24px 18px"},children:[e.jsx("div",{style:{backgroundColor:f.color,height:15,width:15,margin:"2px 6px 0px 0px",border:"1px solid #555"}}),e.jsx("div",{style:{textAlign:"left",width:f.width},children:f.title})]},f.title)),e.jsx("div",{style:{width:"100%"}})]});return e.jsxs(M.Fragment,{children:[e.jsx("div",{style:{height:C},children:e.jsx(F,{data:S,keys:["Average A","Average B","Average","USER","Top 10"],theme:T,indexBy:"row",margin:D,padding:.2,valueScale:{type:"linear"},colors:b,enableLabel:!1,axisLeft:{tickSize:5,tickPadding:5,tickRotation:0,tickValues:5,format:"00",legend:"Saves",legendPosition:"middle",legendOffset:-45,legendOpacity:.9},axisBottom:{tickRotation:-45},enableGridY:!1,isInteractive:!1,animate:!1})}),e.jsx(v,{items:d})]})}function ce({beltData:s}){const{width:l}=j(),h=l<=360,c=l<=560,x=175,r=c?{top:15,right:20,bottom:60,left:20}:{top:0,right:10,bottom:60,left:10},a=["#d5d5d5","#d8d801","#ed7d01","#389700","#0090de","#634b9f","#9d5918","#ba0303","#000","#373737"],p=["#000","#000","#000","#000","#000","#000","#000","#000","#ddd","#ddd"];return e.jsxs("div",{style:{height:x,padding:"0px 8px 0px 8px",width:"100%"},children:[e.jsx(F,{data:s,margin:r,padding:.15,colors:t=>a[t.index%a.length],animate:!0,axisBottom:{tickRotation:-45},axisLeft:null,enableGridY:!1,theme:T,isInteractive:!1,enableLabel:!0,label:t=>t.data.count,labelSkipWidth:12,labelSkipHeight:12,labelTextColor:t=>p[t.index%p.length]}),e.jsx("div",{className:"chart-legend",style:{fontSize:".9rem",color:"#ddd",textAlign:"center",width:"100%",marginTop:"3px"},children:"Belt Distribution"})]},"bar")}function pe({profile:s,entries:l}){const{userId:h}=A(),{user:c}=u.useContext(E),x=h===(c==null?void 0:c.uid)?"You":"User",r=u.useMemo(()=>{const D=N.concat("Unranked"),b=l.map(({belt:d})=>d.includes("Black")?"Black":d).reduce((d,v)=>(d[v]||(d[v]=0),d[v]++,d),{});return D.map(d=>({id:d,label:d,count:b[d]||0,value:b[d]||0}))},[l]),{isMobile:a}=j(),p=a?{maxWidth:700,borderRadius:0}:{maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0},{width:t}=j(),o=t<=360,m=t<=395,i=t<=428,n=t<=560,y={...{width:"100%",padding:"0px",marginBottom:12,alignItems:"center",marginLeft:"auto",marginRight:"auto"},...n?{}:{display:"flex"}},k=n?"100%":"50%",S=n?"100%":"50%",B=o?200:n?210:180,L=n?160:170,C=o?150:170;return e.jsx(R,{style:p,sx:{paddingBottom:5},children:e.jsx(W,{style:{paddingTop:0,paddingLeft:8},children:e.jsx("div",{style:{textAlign:"center"},children:e.jsxs("div",{style:y,children:[e.jsx("div",{style:{width:k,verticalAlign:"top",height:B},children:e.jsx(le,{lockCollection:s,userText:x,collectionBarHeight:L})}),e.jsx("div",{style:{width:S,height:C,marginTop:"0px"},children:e.jsx(ce,{beltData:r})})]})})})})}function me({profile:s,owner:l}){const{compact:h}=u.useContext(Z),[c,x]=u.useState(!1),{visibleEntries:r=[]}=u.useContext(G),a=u.useDeferredValue(c);return e.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[e.jsx(de,{profile:s,page:"collection",owner:l}),e.jsx(ne,{profile:s,collectionType:"locks"}),e.jsx(pe,{profile:s,entries:r}),h?e.jsx(ee,{entries:r}):r.map(p=>e.jsx(te,{entry:p,expanded:p.id===a,onExpand:x},p.id))]})}function Qe(){const{user:s}=u.useContext(E),{userId:l}=A(),{getProfile:h}=u.useContext(I),{isMobile:c}=j(),x=u.useCallback(async()=>{try{const i=await h(l);if(i){const n=i.displayName?i.displayName.toLowerCase().endsWith("s")?`${i.displayName}'`:`${i.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${n} Profile`}return i}catch(i){return console.error("Error loading profile.",i),null}},[h,l]),{data:r={},loading:a,error:p}=se({loadFn:x}),t=u.useMemo(()=>{if(a||!r)return[];const i=new Set(H.locks.getCollected(r));return U.filter(n=>i.has(n.id))},[r,a]),o=e.jsxs(M.Fragment,{children:[e.jsx(q,{label:"Collection"}),e.jsx(J,{}),e.jsx(K,{sortValues:Q}),!c&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}}),e.jsx(ie,{})]}),m=a?"Loading...":"Profile";return e.jsx(Y,{filterFields:$,children:e.jsx(X,{allEntries:t,profile:r,children:e.jsxs(_,{children:[e.jsx(z,{title:m,extras:o}),a&&e.jsx(oe,{}),!a&&r&&!p&&e.jsx(me,{profile:r,owner:s&&s.uid===l}),!a&&r&&!p&&t.length===0&&e.jsx(re,{}),!a&&(!r||p)&&e.jsx(ae,{}),e.jsx(O,{}),e.jsx(V,{feature:"profile"})]})})})}export{Qe as default};
