import{R as g,ae as F,r as a,j as L}from"./index-c20bd96b.js";import{D as q,F as S,e as T}from"./BeltStripe-26a7ddec.js";const j=g.createContext({});function R({children:f}){const{userId:r}=F(),{allEntries:d,getEntryFromId:i}=a.useContext(q),{filters:t,addFilters:s,removeFilters:n}=a.useContext(S),o=t.id,u=a.useCallback((e,l)=>{const c=i(e);if(e&&e!=="beltreqs"){const E=(c?T(c):"").replace(/[\s/]/g,"_").replace(/\W/g,""),h=t.tab==="search"&&!l?"search":c.belt.replace(/\s\d/g,"");s([{key:"id",value:e},{key:"name",value:E},{key:"tab",value:r?void 0:h}],!0)}else e==="beltreqs"?s([{key:"id",value:e},{key:"name",value:void 0}],!0):n(["id","name"])},[s,t.tab,i,n,r]),m=a.useCallback(()=>{n(["id","name"])},[n]),b=a.useCallback(e=>{s([{key:"tab",value:e},{key:"id",value:o==="beltreqs"?"beltreqs":void 0},{key:"name",value:void 0}],!0),setTimeout(()=>v(!1),0)},[s,o]),[p,v]=a.useState(!1),[x,k]=a.useState(!1),y=a.useMemo(()=>{if(!t.tab&&!r){if(t.id){const e=d.find(l=>t.id===l.id);if(e)return e.belt.replace(/\s\d/g,"")}return"White"}return t.tab},[d,t,r]),C=a.useMemo(()=>({compact:x,tab:y,setTab:b,expanded:o,setExpanded:u,clearExpanded:m,displayAll:p&&t.tab==="search",setDisplayAll:v,setCompact:k}),[x,p,o,t.tab,m,u,b,y]);return L.jsx(j.Provider,{value:C,children:f})}export{j as L,R as a};