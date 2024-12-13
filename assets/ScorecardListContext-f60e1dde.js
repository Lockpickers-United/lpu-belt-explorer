import{r as s,ac as E,b0 as A,g as Y,Z as L,j as P,d as r,az as z,ak as w,R as T}from"./index-ac2599d6.js";import{F as y,D as U,f as W}from"./filterFields-890bd53f.js";import{r as B}from"./index-4ec4603a.js";function K({children:v,cardActivity:n,cardBBCount:o,cardDanPoints:c,cardEligibleDan:d,cardNextDanPoints:l,cardNextDanLocks:p,popularLocks:i}){const{filters:e}=s.useContext(y),{search:t,id:m,tab:k,name:f,sort:h,image:V,locks:Z,...M}=e,g=s.useMemo(()=>n.map(a=>{const u=E(a.matchId),O=A(a.matchId),I=Y(a.matchId),S=I?"Belt":O?"Project":"Lock";return{...a,...u,...O,...I,id:a.id,type:S}}),[n]),b=s.useMemo(()=>g.reduce((a,u)=>(a[u.matchId]=u,a),{}),[g]),D=s.useMemo(()=>i.map(a=>({...E(a.lockID),...b[a.lockID],popularityRank:a.rank,userCount:a.count})),[i,b]),x=s.useMemo(()=>Object.keys(M).map(a=>{const u=M[a];return Array.isArray(u)?u.map(O=>({key:a,value:O})):{key:a,value:u}}).flat(),[M]),C=s.useMemo(()=>F(g,x,t,h),[g,x,t,h]),j=s.useMemo(()=>F(D,x.concat({key:"exceptionType",value:void 0}),t,"popular"),[D,x,t]),R=s.useMemo(()=>({allEntries:L,cardActivity:n,cardBBCount:o,cardDanPoints:c,cardEligibleDan:d,cardNextDanPoints:l,cardNextDanLocks:p,visibleEntries:C,popularEntries:j,getEntryFromId:E,getProjectEntryFromId:A,getAwardEntryFromId:Y}),[n,o,c,d,l,p,C,j]);return P.jsx(U.Provider,{value:R,children:v})}function F(v,n,o,c){const l=v.map(e=>{var t,m,k;return{...e,makes:(t=e==null?void 0:e.makeModels)==null?void 0:t.map(({make:f})=>f),fuzzy:B(((m=e==null?void 0:e.makeModels)==null?void 0:m.map(({make:f,model:h})=>[f,h]).flat().filter(f=>f).concat([e.version,e.notes,e.belt]).join(","))+" "),documentation:[e.exceptionType==="badlink"?"Bad Link":"Valid Link",e.date?"Valid Date":"No Date"],scoring:[(()=>{switch(e.exceptionType){case"nomatch":return"Unmatched";case"badlink":return"Bad Link";case"duplicate":return"Duplicate";case"upgraded":return"Upgraded"}switch(e.belt){case"White":case"Yellow":case"Orange":case"Green":return"Low Level";case"Unranked":return"Unranked"}switch(e.awardType){case"belt":case"dan":return"Belts & Dans"}return"Worth Points"})()],simpleBelt:(k=e==null?void 0:e.belt)==null?void 0:k.replace(/\s\d/g,"")}}).filter(e=>n.every(({key:t,value:m})=>Array.isArray(e[t])?e[t].includes(m):e[t]===m)),p=o?W.go(B(o),l,{keys:["fuzzy"],threshold:-25e3}).map(e=>({...e.obj,score:e.score})):l,i=(()=>{switch(c){case"popular":return(e,t)=>e.popularityRank-t.popularityRank||e.fuzzy.localeCompare(t.fuzzy);case"danPointsAscending":return(e,t)=>e.points-t.points||w(e.belt,t.belt)||r(t.date).valueOf()-r(e.date).valueOf();case"danPointsDescending":return(e,t)=>t.points-e.points||z(e.belt,t.belt)||r(t.date).valueOf()-r(e.date).valueOf();case"dateAscending":return(e,t)=>r(e.date).valueOf()-r(t.date).valueOf()||z(e.simpleBelt,t.simpleBelt);case"dateDescending":return(e,t)=>r(t.date).valueOf()-r(e.date).valueOf()||z(e.simpleBelt,t.simpleBelt);case"beltAscending":return(e,t)=>w(e.belt,t.belt)||r(t.date).valueOf()-r(e.date).valueOf();case"beltDescending":return(e,t)=>z(e.belt,t.belt)||r(t.date).valueOf()-r(e.date).valueOf();case"alphaAscending":return(e,t)=>e.fuzzy.localeCompare(t.fuzzy)||t.points-e.points;case"alphaDescending":return(e,t)=>t.fuzzy.localeCompare(e.fuzzy)||t.points-e.points;default:return(e,t)=>r(r(t.date).format("YYYY-MM-DD")).valueOf()-r(r(e.date).format("YYYY-MM-DD")).valueOf()||z(e.belt,t.belt)||e.fuzzy.localeCompare(t.fuzzy)}})();return p.sort(i)}const G=T.createContext({});function Q({children:v}){const{filters:n,addFilters:o,removeFilters:c}=s.useContext(y),d=n.id,l=s.useCallback(i=>{i?o([{key:"id",value:i}],!0):c(["id"])},[o,c]),p=s.useMemo(()=>({expanded:d,setExpanded:l}),[d,l]);return P.jsx(G.Provider,{value:p,children:v})}export{G as S,K as a,Q as b};
