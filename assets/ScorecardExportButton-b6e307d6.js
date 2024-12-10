import{r as t,H as m,d as T,j as e,R as $,G as f,B as g,I as y,a9 as z,aa as c,as as d,U as x}from"./index-e55a35db.js";import{d as v,a as h,b as B,c as L}from"./download-f00f655c.js";import{e as E}from"./entryName-aa037302.js";import{d as F}from"./ContentCopy-5097af62.js";import{D as _}from"./filterFields-00c2c2e4.js";function q({text:C}){const[b,k]=t.useState(null),S=!!b,u=t.useCallback(a=>k(a.currentTarget),[]),n=t.useCallback(()=>k(null),[]),{visibleEntries:l=[]}=t.useContext(_),I=t.useCallback(()=>{const a=JSON.stringify(l);n(),v("scorecardData.json",a),m("Current Scorecard entries downloaded as scorecardData.json")},[n,l]),w=t.useCallback(()=>{const p=l.map(s=>({id:s.id,make:s.makeModels.map(i=>i.make).join(","),model:s.makeModels.map(i=>i.model).join(","),version:s.version,belt:s.belt,name:E(s),versionText:s.version?" ("+s.version+")":""})).map(s=>"* "+s.name+s.versionText).join(`
`);n(),navigator.clipboard.writeText(p),m("Current scorecard entries copied to clipboard.")},[n,l]),D=t.useCallback(()=>{const a=["id","name","version","belt","modifier","points","date","link"],p=l.map(o=>({id:o.matchId,make:o.makeModels.map(r=>r.make).join(","),model:o.makeModels.map(r=>r.model).join(","),version:o.version,belt:o.belt,link:o.link,modifier:o.evidenceModifier,points:o.points,date:o.date?T(o.date).format("L"):"",name:E(o)})),s=a.join(","),i=p.map(o=>a.map(r=>o[r]).map(r=>{const j=`${r??""}`.replace(/"/g,'""');return/(\s|,|")/.test(j)?`"${j}"`:j}).join(",")).join(`
`),M=`${s}
${i}`;n(),v("scorecardData.csv",M),m("Current Scorecard entries downloaded as scorecardData.csv")},[n,l]);return e.jsxs($.Fragment,{children:[C?e.jsx(f,{title:"Export",arrow:!0,disableFocusListener:!0,children:e.jsx(g,{variant:"outlined",size:"small",onClick:u,style:{color:"#ddd",borderColor:"#aaa"},startIcon:e.jsx(h,{}),children:"Export"})}):e.jsx(f,{title:"Export",arrow:!0,disableFocusListener:!0,children:e.jsx(y,{onClick:u,children:e.jsx(h,{})})}),e.jsxs(z,{anchorEl:b,open:S,onClose:n,children:[!C&&e.jsxs(c,{disabled:!0,children:[e.jsx(d,{children:e.jsx(h,{fontSize:"small"})}),e.jsx(x,{children:"Export"})]}),e.jsxs(c,{onClick:w,children:[e.jsx(d,{children:e.jsx(F,{fontSize:"small"})}),e.jsx(x,{children:"Copy to clipboard"})]}),e.jsxs(c,{onClick:D,children:[e.jsx(d,{children:e.jsx(B,{fontSize:"small"})}),e.jsx(x,{children:"CSV"})]}),e.jsxs(c,{onClick:I,children:[e.jsx(d,{children:e.jsx(L,{fontSize:"small"})}),e.jsx(x,{children:"JSON"})]})]})]})}export{q as E};