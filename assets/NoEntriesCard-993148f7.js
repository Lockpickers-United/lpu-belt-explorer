import{r as e,j as t,V as d,W as h,w as u,a8 as m,t as x}from"./index-83934d36.js";import{L as g}from"./LockListContext-8f51c496.js";function C({label:r}){const{tab:i,setDisplayAll:s}=e.useContext(g),n=e.useDeferredValue(i),o={marginTop:16,maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0},a=n==="search",c=a?"No search or filter criteria selected.":t.jsxs("span",{children:["No matching ",r," were found.",t.jsx("br",{}),"Try adjusting filters, search, or tab."]}),l=e.useCallback(()=>{setTimeout(()=>s(!0),50)},[s]);return t.jsxs(d,{style:o,children:[t.jsx(h,{style:{paddingBottom:8},children:t.jsx(u,{variant:"h6",align:"center",children:c})}),a&&t.jsx(m,{style:{paddingBottom:16},children:t.jsx(x,{variant:"outlined",color:"inherit",onClick:l,style:{minWidth:160,margin:"auto"},children:"View all locks"})})]})}export{C as N};
