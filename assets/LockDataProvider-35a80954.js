import{r as d,ag as y,a1 as f,af as x,ai as U,ao as j,j as D}from"./index-83934d36.js";import{F as C,r as g,f as M,D as I}from"./BeltStripe-dee6c3df.js";function w({children:h,allEntries:i,profile:u}){const{filters:k}=d.useContext(C),{search:n,id:F,tab:N,name:P,sort:a,image:R,...m}=k,p=d.useMemo(()=>i.map(t=>{var o,c,r;return{...t,makes:t.makeModels.map(({make:e})=>e),fuzzy:g(t.makeModels.map(({make:e,model:s})=>[e,s]).flat().filter(e=>e).concat([t.version,t.notes,t.belt]).join(",")),content:[(o=t.media)!=null&&o.some(e=>!e.fullUrl.match(/youtube\.com/))?"Has Images":"No Images",(c=t.media)!=null&&c.some(e=>e.fullUrl.match(/youtube\.com/))?"Has Video":"No Video",((r=t.links)==null?void 0:r.length)>0?"Has Links":"No Links",y[t.belt].danPoints>0?"Worth Dan Points":void 0,f(t.lastUpdated).isAfter(f().subtract(1,"days"))?"Updated Recently":void 0,t.belt.startsWith("Black")?"Is Black":void 0,t.belt!=="Unranked"?"Is Ranked":void 0].flat().filter(e=>e),collection:x.locks.map.map(e=>u&&u[e.key]&&u[e.key].includes(t.id)?e.label:"Not "+e.label),simpleBelt:t.belt.replace(/\s\d/g,"")}}),[i,u]),b=d.useMemo(()=>{const t=Object.keys(m).map(e=>{const s=m[e];return Array.isArray(s)?s.map(l=>({key:e,value:l})):{key:e,value:s}}).flat(),o=p.filter(e=>t.every(({key:s,value:l})=>Array.isArray(e[s])?e[s].includes(l):e[s]===l)),c=n&&o.find(e=>e.id===n);let r=o;return c?r=[c]:n&&(r=M.go(g(n),o,{keys:B,threshold:-25e3}).map(e=>({...e.obj,score:e.score}))),a?r.sort((e,s)=>{if(a==="popularity")return s.views-e.views;if(a==="recentlyUpdated"){const l=f(e.lastUpdated),z=f(s.lastUpdated);if(l.isAfter(z))return-1;if(z.isAfter(l))return 1}else{if(a==="beltAscending")return U(e.belt,s.belt);if(a==="beltDescending")return j(e.belt,s.belt);if(a==="alphaAscending")return e.fuzzy.localeCompare(s.fuzzy);if(a==="alphaDescending")return s.fuzzy.localeCompare(e.fuzzy)}}):r},[m,p,n,a]),v=d.useCallback(t=>i.find(o=>o.id===t),[i]),A=d.useMemo(()=>({allEntries:i,visibleEntries:b,getEntryFromId:v}),[i,v,b]);return D.jsx(I.Provider,{value:A,children:h})}const B=["fuzzy"];export{w as D};
