import{r as d,ae as y,a1 as f,ad as x,ag as U,as as j,j as D}from"./index-5aed8077.js";import{F as C,r as g,f as M,D as I}from"./index-4631fc0d.js";function w({children:h,allEntries:i,profile:u}){const{filters:k}=d.useContext(C),{search:n,id:F,tab:N,name:P,sort:a,image:R,...m}=k,p=d.useMemo(()=>i.map(s=>{var o,c,r;return{...s,makes:s.makeModels.map(({make:e})=>e),fuzzy:g(s.makeModels.map(({make:e,model:t})=>[e,t]).flat().filter(e=>e).concat([s.version,s.notes,s.belt]).join(",")),content:[(o=s.media)!=null&&o.some(e=>!e.fullUrl.match(/youtube\.com/))?"Has Images":"No Images",(c=s.media)!=null&&c.some(e=>e.fullUrl.match(/youtube\.com/))?"Has Video":"No Video",((r=s.links)==null?void 0:r.length)>0?"Has Links":"No Links",y[s.belt].danPoints>0?"Worth Dan Points":void 0,f(s.lastUpdated).isAfter(f().subtract(1,"days"))?"Updated Recently":void 0,s.belt.startsWith("Black")?"Is Black":void 0,s.belt!=="Unranked"?"Is Ranked":void 0].flat().filter(e=>e),collection:x.locks.map.map(e=>u&&u[e.key]&&u[e.key].includes(s.id)?e.label:"Not "+e.label),simpleBelt:s.belt.replace(/\s\d/g,"")}}),[i,u]),b=d.useMemo(()=>{const s=Object.keys(m).map(e=>{const t=m[e];return Array.isArray(t)?t.map(l=>({key:e,value:l})):{key:e,value:t}}).flat(),o=p.filter(e=>s.every(({key:t,value:l})=>Array.isArray(e[t])?e[t].includes(l):e[t]===l)),c=n&&o.find(e=>e.id===n);let r=o;return c?r=[c]:n&&(r=M.go(g(n),o,{keys:B,threshold:-25e3}).map(e=>({...e.obj,score:e.score}))),a?r.sort((e,t)=>{if(a==="popularity")return t.views-e.views;if(a==="recentlyUpdated"){const l=f(e.lastUpdated),z=f(t.lastUpdated);if(l.isAfter(z))return-1;if(z.isAfter(l))return 1}else{if(a==="beltAscending")return U(e.belt,t.belt);if(a==="beltDescending")return j(e.belt,t.belt);if(a==="alphaAscending")return e.fuzzy.localeCompare(t.fuzzy);if(a==="alphaDescending")return t.fuzzy.localeCompare(e.fuzzy)}}):r},[m,p,n,a]),v=d.useCallback(s=>i.find(o=>o.id===s),[i]),A=d.useMemo(()=>({allEntries:i,visibleEntries:b,getEntryFromId:v}),[i,v,b]);return D.jsx(I.Provider,{value:A,children:h})}const B=["fuzzy"];export{w as D};
