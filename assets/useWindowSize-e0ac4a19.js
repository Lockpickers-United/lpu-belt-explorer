import{r as n}from"./index-f91a49a2.js";function s(){let e,i=!1,o=250;function t(){e=window.innerWidth}return window.addEventListener("resize",function(){clearTimeout(i),i=setTimeout(t,o)}),t(),n.useMemo(()=>({width:e,isMobile:e<650}),[e])}export{s as u};