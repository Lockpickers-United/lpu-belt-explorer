import{r as n,H as i,j as o,G as c,I as l}from"./index-8af2e99a.js";import{d as u}from"./ContentCopy-eb0e9c85.js";function d({entry:a}){const r=n.useCallback(async()=>{const s=a.makeModels.map(({make:t,model:e})=>t&&t!==e?`${t} ${e}`:e).join(`
`);await navigator.clipboard.writeText(s),i("Make/Model text copied to clipboard.")},[a.makeModels]);return o.jsx(c,{title:"Copy Make/Model Text",arrow:!0,disableFocusListener:!0,children:o.jsx(l,{onClick:r,children:o.jsx(u,{})})})}export{d as C};
