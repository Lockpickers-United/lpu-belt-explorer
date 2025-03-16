import{K as N,M as W,j as t,r as u,G as z,I as V,u as j,R as D,ap as E,A as F,a0 as q,a1 as _,Y as U,D as G,aq as O,Z as Y,N as $,F as K,T as Z}from"./index-86150f4f.js";import{D as J,a as Q,l as X}from"./filterFields-38247da4.js";import{l as tt}from"./sortFields-588a06b5.js";import{F as et,S as it}from"./SortButton-571b62cd.js";import{D as ot}from"./LockDataProvider-13292760.js";import{L as R,a as rt}from"./LockListContext-6605c04f.js";import{S as st}from"./SearchBox-d177f50f.js";import{L as at}from"./LoadingDisplay-7ba7fff9.js";import{u as nt}from"./useData-e4b95ed0.js";import{N as dt}from"./NoProfileData-d559708c.js";import{P as lt}from"./ProfileNotFound-08853542.js";import{C as ct,E as pt,a as mt}from"./ExportButton-5f9ff038.js";import{I as ht}from"./InlineFilterDisplay-5ffdd780.js";import"./index-0b67024b.js";import{B as T}from"./nivo-bar.es-6eab836a.js";import{p as I}from"./chartDefaults-9fc07b21.js";import{P as xt}from"./ProfileHeader-014b7c25.js";import"./Badge-02501b18.js";import"./Chip-dbd9aaeb.js";import"./Select-38bd4751.js";import"./Box-12f38a11.js";import"./Sort-9d973c65.js";import"./entryName-dc5404a1.js";import"./Search-74fb0354.js";import"./TextField-4e5443c2.js";import"./LPU-c3fa7122.js";import"./LinearProgress-28b471af.js";import"./mycollection-0ec86312.js";import"./BeltStripe-6a123533.js";import"./EvidenceForm-3376e22f.js";import"./Launch-c1e82f97.js";import"./PhotoCamera-86b05092.js";import"./Autocomplete-05c77235.js";import"./index-6ead52fb.js";import"./DialogContent-f18ce98b.js";import"./ListItem-f5d074c1.js";import"./Dialog-6e8616d5.js";import"./VideocamOutlined-826bed59.js";import"./FormGroup-c2f00869.js";import"./Checkbox-1aef1161.js";import"./LoadingDisplay-f395dd7e.js";import"./CircularProgress-62e10e19.js";import"./LoadingDisplaySmall-eaadd537.js";import"./ExpandMore-7518f889.js";import"./FieldValue-c3fa2357.js";import"./BeltIcon-72e96cc1.js";import"./CopyEntryTextButton-8ad7b671.js";import"./Link-1ed8dad6.js";import"./ContentCopy-d8ba35fa.js";import"./AccordionSummary-127f0dce.js";import"./Collapse-28175f23.js";import"./index-4d994744.js";import"./index-d1996db9.js";import"./AccordionActions-5b9a23bc.js";import"./download-99ea1bff.js";import"./List-9bcdf171.js";import"./ImageViewer-0521a21f.js";import"./Link-833bdd66.js";import"./ImageListItem-552633ca.js";import"./nivo-legends.es-99f5fda0.js";import"./CopyProfileLinkButton-9216c6aa.js";import"./ToggleButtonGroup-0c56bda5.js";var P={},ut=W;Object.defineProperty(P,"__esModule",{value:!0});var H=P.default=void 0,gt=ut(N()),wt=t;H=P.default=(0,gt.default)((0,wt.jsx)("path",{d:"M3 14h4v-4H3zm0 5h4v-4H3zM3 9h4V5H3zm5 5h13v-4H8zm0 5h13v-4H8zM8 5v4h13V5z"}),"ViewList");function ft(){const{compact:i,setCompact:n,setExpanded:p}=u.useContext(R),d=u.useCallback(()=>{n(!i),p(null)},[i,n,p]);return t.jsx(z,{title:"Toggle Compact View",arrow:!0,disableFocusListener:!0,children:t.jsx(V,{onClick:d,children:t.jsx(H,{color:i?"secondary":"inherit"})})})}function vt({lockCollection:i,userText:n,collectionBarHeight:p}){const d=i.own?i.own.length:0,g=i.picked?i.picked.length:0,s=i.recordedLocks?i.recordedLocks.length:0,a=i.wishlist?i.wishlist.length:0,e=d+g+s+a?{own:d,picked:g,recorded:s,wishlist:a}:{own:0,picked:0,recorded:0,wishlist:0},r={own:14,picked:11,recorded:11,wishlist:8},x={own:250,picked:280,recorded:260,wishlist:100},h={own:Math.min(r.own,e.own),picked:Math.min(r.picked,e.picked),recorded:Math.min(r.recorded,e.recorded),wishlist:Math.min(r.wishlist,e.wishlist)},o={own:e.own>r.own?0:r.own-h.own,picked:e.picked>r.picked?0:r.picked-h.picked,recorded:e.recorded>r.recorded?0:r.recorded-h.recorded,wishlist:e.wishlist>r.wishlist?0:r.wishlist-h.wishlist},c={own:2,picked:2,recorded:2,wishlist:2},A={own:Math.max(e.own-(h.own+o.own+c.own),0),picked:Math.max(e.picked-(h.picked+o.picked+c.picked),0),recorded:Math.max(e.recorded-(h.recorded+o.recorded+c.recorded),0),wishlist:Math.max(e.wishlist-(h.wishlist+o.wishlist+c.wishlist),0)},y={own:Math.min(x.own-e.own,x.own-r.own-c.own),picked:Math.min(x.picked-e.picked,x.picked-r.picked-c.picked),recorded:Math.min(x.recorded-e.recorded,x.recorded-r.recorded-c.recorded),wishlist:Math.min(x.wishlist-e.wishlist,x.wishlist-r.wishlist-c.wishlist)},k=["own","picked","recorded","wishlist"],S=k.map((w,f)=>({row:k[f],"Average A":h[w],"Average B":o[w],Average:c[w],USER:A[w],"Top 10":y[w]})),{width:B}=j(),C=B<=560,L=p,M=C?{top:10,right:20,bottom:50,left:55}:{top:10,right:20,bottom:50,left:55},b=["#3c90c5","#aaa","#000","#3c90c5","#aaa"],l=i?[{title:n,color:"#3c90c5",width:"14px"}]:[];l.push({title:"Average",color:"#000",width:"35px"},{title:"Top 10 Average",color:"#aaaaaa",width:"120px"});const v=({items:w})=>t.jsxs("div",{className:"chart-legend",style:{display:"flex",fontSize:".9rem",color:"#ddd",marginTop:13},children:[t.jsx("div",{style:{width:"100%"}}),w.map(f=>t.jsxs("div",{style:{display:"flex",padding:"0px 18px 24px 18px"},children:[t.jsx("div",{style:{backgroundColor:f.color,height:15,width:15,margin:"2px 6px 0px 0px",border:"1px solid #555"}}),t.jsx("div",{style:{textAlign:"left",width:f.width},children:f.title})]},f.title)),t.jsx("div",{style:{width:"100%"}})]});return t.jsxs(D.Fragment,{children:[t.jsx("div",{style:{height:L},children:t.jsx(T,{data:S,keys:["Average A","Average B","Average","USER","Top 10"],theme:I,indexBy:"row",margin:M,padding:.2,valueScale:{type:"linear"},colors:b,enableLabel:!1,axisLeft:{tickSize:5,tickPadding:5,tickRotation:0,tickValues:5,format:"00",legend:"Saves",legendPosition:"middle",legendOffset:-45,legendOpacity:.9},axisBottom:{tickRotation:-45},enableGridY:!1,isInteractive:!1,animate:!1})}),t.jsx(v,{items:l})]})}function jt({beltData:i}){const{width:n}=j(),p=n<=360,d=n<=560,g=175,s=d?{top:15,right:20,bottom:60,left:20}:{top:0,right:10,bottom:60,left:10},a=["#d5d5d5","#d8d801","#ed7d01","#389700","#0090de","#634b9f","#9d5918","#ba0303","#000","#373737"],m=["#000","#000","#000","#000","#000","#000","#000","#000","#ddd","#ddd"];return t.jsxs("div",{style:{height:g,padding:"0px 8px 0px 8px",width:"100%"},children:[t.jsx(T,{data:i,margin:s,padding:.15,colors:e=>a[e.index%a.length],animate:!0,axisBottom:{tickRotation:-45},axisLeft:null,enableGridY:!1,theme:I,isInteractive:!1,enableLabel:!0,label:e=>e.data.count,labelSkipWidth:12,labelSkipHeight:12,labelTextColor:e=>m[e.index%m.length]}),t.jsx("div",{className:"chart-legend",style:{fontSize:".9rem",color:"#ddd",textAlign:"center",width:"100%",marginTop:"3px"},children:"Belt Distribution"})]},"bar")}function kt({profile:i,entries:n}){const{userId:p}=E(),{user:d}=u.useContext(F),g=p===(d==null?void 0:d.uid)?"You":"User",s=u.useMemo(()=>{const M=U.concat("Unranked"),b=n.map(({belt:l})=>l.includes("Black")?"Black":l).reduce((l,v)=>(l[v]||(l[v]=0),l[v]++,l),{});return M.map(l=>({id:l,label:l,count:b[l]||0,value:b[l]||0}))},[n]),{isMobile:a}=j(),m=a?{maxWidth:700,borderRadius:0}:{maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0},{width:e}=j(),r=e<=360,x=e<=395,h=e<=428,o=e<=560,y={...{width:"100%",padding:"0px",marginBottom:12,alignItems:"center",marginLeft:"auto",marginRight:"auto"},...o?{}:{display:"flex"}},k=o?"100%":"50%",S=o?"100%":"50%",B=r?200:o?210:180,C=o?160:170,L=r?150:170;return t.jsx(q,{style:m,sx:{paddingBottom:5},children:t.jsx(_,{style:{paddingTop:0,paddingLeft:8},children:t.jsx("div",{style:{textAlign:"center"},children:t.jsxs("div",{style:y,children:[t.jsx("div",{style:{width:k,verticalAlign:"top",height:B},children:t.jsx(vt,{lockCollection:i,userText:g,collectionBarHeight:C})}),t.jsx("div",{style:{width:S,height:L,marginTop:"0px"},children:t.jsx(jt,{beltData:s})})]})})})})}function bt({profile:i,owner:n}){const{compact:p}=u.useContext(R),[d,g]=u.useState(!1),{visibleEntries:s=[]}=u.useContext(J),a=u.useDeferredValue(d);return t.jsx(D.Fragment,{children:t.jsxs("div",{style:{maxWidth:700,padding:0,backgroundColor:"#222",marginLeft:"auto",marginRight:"auto",marginTop:16},children:[t.jsx(xt,{profile:i,page:"collection",owner:n}),t.jsx(ht,{profile:i,collectionType:"locks"}),t.jsx(kt,{profile:i,entries:s}),p?t.jsx(ct,{entries:s}):s.map(m=>t.jsx(pt,{entry:m,expanded:m.id===a,onExpand:g},m.id))]})})}function Ae(){const{user:i}=u.useContext(F),{userId:n}=E(),{getProfile:p}=u.useContext(G),{isMobile:d}=j(),g=u.useCallback(async()=>{try{const o=await p(n);if(o){const c=o.displayName?o.displayName.toLowerCase().endsWith("s")?`${o.displayName}'`:`${o.displayName}'s`:"Anonymous";document.title=`LPU Belt Explorer - ${c} Profile`}return o}catch(o){return console.error("Error loading profile.",o),null}},[p,n]),{data:s={},loading:a,error:m}=nt({loadFn:g}),e=u.useMemo(()=>{if(a||!s)return[];const o=new Set(O.locks.getCollected(s));return Y.filter(c=>o.has(c.id))},[s,a]),r=t.jsxs(D.Fragment,{children:[t.jsx(st,{label:"Collection"}),t.jsx(et,{}),t.jsx(it,{sortValues:tt}),!d&&t.jsx("div",{style:{flexGrow:1,minWidth:"10px"}}),t.jsx(ft,{})]}),x=a?"Loading...":"Profile",h=t.jsx("div",{style:{margin:"30px 0px"},children:t.jsx(mt,{text:!0})});return t.jsx(Q,{filterFields:X,children:t.jsx(ot,{allEntries:e,profile:s,children:t.jsxs(rt,{children:[t.jsx($,{title:x,extras:r}),a&&t.jsx(at,{}),!a&&s&&!m&&t.jsx(bt,{profile:s,owner:i&&i.uid===n}),!a&&s&&!m&&e.length===0&&t.jsx(dt,{}),!a&&(!s||m)&&t.jsx(lt,{}),t.jsx(K,{before:h}),t.jsx(Z,{feature:"profile"})]})})})}export{Ae as default};
