import{r as s,H as i,j as e,G as c,I as l}from"./index-a08903d0.js";import{d as p}from"./Link-3d1a2546.js";import{e as u}from"./entryName-6a27208f.js";import{d as x}from"./ContentCopy-3b79d818.js";function f({entry:t,nameType:a}){const n=s.useCallback(async()=>{const o=u(t,a).replace(/[\s/]/g,"_").replace(/\W/g,""),d=`https://share.lpubelts.com/?id=${t.id}&name=${o}`;await navigator.clipboard.writeText(d),i("Link to entry copied to clipboard.")},[t,a]);return e.jsx(c,{title:"Copy Link to Entry",arrow:!0,disableFocusListener:!0,children:e.jsx(l,{onClick:n,children:e.jsx(p,{})})})}function j({entry:t}){const a=s.useCallback(async()=>{const n=t.makeModels.map(({make:r,model:o})=>r&&r!==o?`${r} ${o}`:o).join(`
`);await navigator.clipboard.writeText(n),i("Make/Model text copied to clipboard.")},[t.makeModels]);return e.jsx(c,{title:"Copy Make/Model Text",arrow:!0,disableFocusListener:!0,children:e.jsx(l,{onClick:a,children:e.jsx(x,{})})})}export{j as C,f as a};
