import{r as u,X as A,ai as M,u as N,j as e,R as T,a0 as D,a2 as P,b as E,a3 as H,B as U,a1 as z,J as G,N as O,K as V,O as Y}from"./index-d31357c5.js";import{B as q,u as J,L as K,D as X,I as $,j as Q,S as Z,f as _,d as ee,l as te,g as ie,h as se,i as oe}from"./sortFields-1171eef8.js";import{C as ne,E as re,b as ae,T as de,D as le}from"./data-1959fa41.js";import{u as ce,L as he}from"./useData-428dd641.js";import{u as v}from"./useWindowSize-6cb6a7c8.js";import{C as pe}from"./CopyProfileLinkButton-9728ce9c.js";import"./dayjs.min-14254b4a.js";import{B as F}from"./nivo-bar.es-5cdcea24.js";import{p as W}from"./chartDefaults-e88ecc0b.js";import"./ImageViewer-c929b8be.js";import"./Link-cd47a814.js";import"./LinearProgress-77143f42.js";import"./Search-75450346.js";import"./InputLabel-9db7cd94.js";import"./Sort-13554c71.js";import"./TextField-662ec48e.js";import"./index-5a07594d.js";import"./index-518d1010.js";import"./LPU-c3fa7122.js";import"./nivo-legends.es-e83bf2ca.js";const xe="/assets/mycollection-8a0b4848.png";function me(){const{user:i}=u.useContext(A),{userId:c}=M(),p=N(),{isMobile:d}=v(),s=d?{marginTop:-32,maxWidth:700,marginLeft:8,marginRight:8,borderRadius:0}:{marginTop:-32,maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0},n=c===(i==null?void 0:i.uid),r=n?e.jsxs(T.Fragment,{children:[e.jsxs("span",{children:["There are no locks in your collection.",e.jsx("br",{}),'Browse the site and use the "My Collection" button to track locks that you own, picked, recorded, or wish to buy.',e.jsx("br",{})]}),e.jsx("img",{alt:"My Collection",src:xe})]}):"There are no locks in this collection.",m=n?"Explore":"Go Home",t=u.useCallback(()=>{p("/locks")},[p]);return e.jsx(q,{alignContent:"center",children:e.jsxs(D,{style:s,children:[e.jsx(P,{children:e.jsx(E,{variant:"h6",align:"center",children:r})}),e.jsxs(H,{children:[e.jsx("div",{style:{width:"100%"}}),e.jsx(U,{variant:"outlined",color:"secondary",onClick:t,style:{whiteSpace:"nowrap"},children:m})]})]})})}function ge(){const i={marginTop:16,maxWidth:350,marginLeft:"auto",marginRight:"auto",borderRadius:0};return e.jsxs(D,{style:i,children:[e.jsx(z,{title:"Profile Not Found!"}),e.jsx(P,{children:e.jsx(E,{variant:"h6",align:"center",children:"This profile was not found."})})]})}function ue({lockCollection:i,userText:c,collectionBarHeight:p}){const d=i.own?i.own.length:0,s=i.picked?i.picked.length:0,n=i.recorded?i.recorded.length:0,r=i.wishlist?i.wishlist.length:0,t=d+s+n+r?{own:d,picked:s,recorded:n,wishlist:r}:{own:0,picked:0,recorded:0,wishlist:0},o={own:14,picked:11,recorded:11,wishlist:8},a={own:250,picked:280,recorded:260,wishlist:100},l={own:Math.min(o.own,t.own),picked:Math.min(o.picked,t.picked),recorded:Math.min(o.recorded,t.recorded),wishlist:Math.min(o.wishlist,t.wishlist)},x={own:t.own>o.own?0:o.own-l.own,picked:t.picked>o.picked?0:o.picked-l.picked,recorded:t.recorded>o.recorded?0:o.recorded-l.recorded,wishlist:t.wishlist>o.wishlist?0:o.wishlist-l.wishlist},g={own:2,picked:2,recorded:2,wishlist:2},R={own:Math.max(t.own-(l.own+x.own+g.own),0),picked:Math.max(t.picked-(l.picked+x.picked+g.picked),0),recorded:Math.max(t.recorded-(l.recorded+x.recorded+g.recorded),0),wishlist:Math.max(t.wishlist-(l.wishlist+x.wishlist+g.wishlist),0)},y={own:Math.min(a.own-t.own,a.own-o.own-g.own),picked:Math.min(a.picked-t.picked,a.picked-o.picked-g.picked),recorded:Math.min(a.recorded-t.recorded,a.recorded-o.recorded-g.recorded),wishlist:Math.min(a.wishlist-t.wishlist,a.wishlist-o.wishlist-g.wishlist)},b=["own","picked","recorded","wishlist"],B=b.map((w,j)=>({row:b[j],"Average A":l[w],"Average B":x[w],Average:g[w],USER:R[w],"Top 10":y[w]})),{width:C}=v(),S=C<=560,L=p,k=S?{top:10,right:20,bottom:50,left:55}:{top:10,right:20,bottom:50,left:55},h=["#3c90c5","#aaa","#000","#3c90c5","#aaa"],f=i?[{title:c,color:"#3c90c5",width:"14px"}]:[];f.push({title:"Average",color:"#000",width:"35px"},{title:"Top 10 Average",color:"#aaaaaa",width:"120px"});const I=({items:w})=>e.jsxs("div",{className:"chart-legend",style:{display:"flex",fontSize:".9rem",color:"#ddd",marginTop:13},children:[e.jsx("div",{style:{width:"100%"}}),w.map(j=>e.jsxs("div",{style:{display:"flex",padding:"0px 18px 24px 18px"},children:[e.jsx("div",{style:{backgroundColor:j.color,height:15,width:15,margin:"2px 6px 0px 0px",border:"1px solid #555"}}),e.jsx("div",{style:{textAlign:"left",width:j.width},children:j.title})]},j.title)),e.jsx("div",{style:{width:"100%"}})]});return e.jsxs(T.Fragment,{children:[e.jsx("div",{style:{height:L},children:e.jsx(F,{data:B,keys:["Average A","Average B","Average","USER","Top 10"],theme:W,indexBy:"row",margin:k,padding:.2,valueScale:{type:"linear"},colors:h,enableLabel:!1,axisLeft:{tickSize:5,tickPadding:5,tickRotation:0,tickValues:5,format:"00",legend:"Saves",legendPosition:"middle",legendOffset:-45,legendOpacity:.9},axisBottom:{tickRotation:-45},enableGridY:!1,isInteractive:!1,animate:!1})}),e.jsx(I,{items:f})]})}function we({beltData:i}){const{width:c}=v(),p=c<=360,d=c<=560,s=p?190:d?200:175,n=d?{top:0,right:20,bottom:50,left:20}:{top:0,right:10,bottom:60,left:10},r=["#d5d5d5","#d8d801","#ed7d01","#389700","#0090de","#634b9f","#9d5918","#ba0303","#000","#373737"],m=["#000","#000","#000","#000","#000","#000","#000","#000","#ddd","#ddd"];return e.jsxs("div",{style:{height:s,padding:"0px 8px 0px 8px",width:"100%"},children:[e.jsx(F,{data:i,margin:n,padding:.15,colors:t=>r[t.index%r.length],animate:!0,axisBottom:{tickRotation:-45},axisLeft:null,enableGridY:!1,theme:W,isInteractive:!1,enableLabel:!0,label:t=>t.data.count,labelSkipWidth:12,labelSkipHeight:12,labelTextColor:t=>m[t.index%m.length]}),e.jsx("div",{className:"chart-legend",style:{fontSize:".9rem",color:"#ddd",textAlign:"center",width:"100%",marginTop:"3px"},children:"Belt Distribution"})]},"bar")}function fe({profile:i,entries:c}){const{userId:p}=M(),{user:d}=u.useContext(A),s=p===(d==null?void 0:d.uid)?"You":"User",n=u.useMemo(()=>{const L=J.concat("Unranked"),k=c.map(({belt:h})=>h.includes("Black")?"Black":h).reduce((h,f)=>(h[f]||(h[f]=0),h[f]++,h),{});return L.map(h=>({id:h,label:h,count:k[h]||0,value:k[h]||0}))},[c]),{isMobile:r}=v(),m=r?{maxWidth:700,borderRadius:0}:{maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0},{width:t}=v(),o=t<=360,a=t<=395,l=t<=428,x=t<=560,y={...{width:"100%",padding:"0px",marginBottom:12,alignItems:"center",marginLeft:"auto",marginRight:"auto"},...x?{}:{display:"flex"}},b=x?"100%":"50%",B=x?"100%":"50%",C=o?200:x?210:180,S=170;return e.jsx(D,{style:m,sx:{paddingBottom:5},children:e.jsx(P,{style:{paddingTop:0,paddingLeft:8},children:e.jsx("div",{style:{textAlign:"center"},children:e.jsxs("div",{style:y,children:[e.jsx("div",{style:{width:b,verticalAlign:"top",height:C},children:e.jsx(ue,{lockCollection:i,userText:s,collectionBarHeight:170})}),e.jsx("div",{style:{width:B,height:S,marginTop:"0px"},children:e.jsx(we,{beltData:n})})]})})})})}function je({profile:i}){const{compact:c,expanded:p,setExpanded:d}=u.useContext(K),{visibleEntries:s=[]}=u.useContext(X),n=u.useDeferredValue(p);return e.jsxs("div",{style:{margin:8,paddingBottom:32},children:[e.jsx($,{profile:i}),e.jsx(fe,{profile:i,entries:s}),c?e.jsx(ne,{entries:s}):s.map(r=>e.jsx(re,{entry:r,expanded:r.id===n,onExpand:d},r.id))]})}function Ue(){const{userId:i}=M(),{getProfile:c}=u.useContext(G),{isMobile:p}=v(),d=u.useCallback(async()=>{try{const a=await c(i);return document.title=`LPU Belt Explorer - ${a.displayName}'s Profile`,a}catch(a){return console.error("Error loading profile.",a),null}},[c,i]),{data:s={},loading:n,error:r}=ce({loadFn:d}),m=u.useMemo(()=>{if(n||!s)return[];const a=new Set(Q.flatMap(({key:l})=>s[l]));return ae.filter(l=>a.has(l.id))},[s,n]),t=e.jsxs(T.Fragment,{children:[e.jsx(Z,{label:"Collection"}),e.jsx(_,{}),e.jsx(ee,{sortValues:te}),!p&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}}),e.jsx(de,{}),e.jsx(pe,{})]}),o=n?"Loading...":"Profile";return e.jsx(ie,{filterFields:se,children:e.jsx(le,{allEntries:m,profile:s,children:e.jsxs(oe,{children:[e.jsx(O,{title:o,extras:t}),n&&e.jsx(he,{}),!n&&s&&!r&&e.jsx(je,{profile:s}),!n&&s&&!r&&m.length===0&&e.jsx(me,{}),!n&&(!s||r)&&e.jsx(ge,{}),e.jsx(V,{}),e.jsx(Y,{feature:"profile"})]})})})}export{Ue as default};
