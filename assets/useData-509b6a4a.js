import{r as a,v as w,j as m,t as j}from"./index-c20bd96b.js";function E({url:o,urls:t,loadFn:r}){const[c,n]=a.useState(!0),[i,p]=a.useState(null),[l,u]=a.useState(!1),s=a.useCallback(async()=>{try{n(!0);let e;if(o)e=await(await fetch(o,{cache:"no-store"})).json();else if(t){e={};const f=Object.keys(t).map(async d=>{const h=await fetch(t[d],{cache:"no-store"});e[d]=await h.json()});await Promise.all(f)}else r&&(e=await r());p(e),n(!1),u(!1)}catch(e){console.error("Error loading data.",e),w("Error loading data. Please reload the page.",{autoHideDuration:null,action:m.jsx(j,{color:"secondary",onClick:()=>window.location.reload(),children:"Refresh"})}),n(!1),u(!0)}},[o,t,r]);return a.useEffect(()=>{s()},[s]),a.useMemo(()=>({loading:c,data:i,error:l,refresh:s}),[i,l,s,c])}export{E as u};
