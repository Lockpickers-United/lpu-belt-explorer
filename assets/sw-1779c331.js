import{aN as n,bs as u,aM as l}from"./index-f91a49a2.js";function d(r,i){for(var o=0;o<i.length;o++){const e=i[o];if(typeof e!="string"&&!Array.isArray(e)){for(const a in e)if(a!=="default"&&!(a in r)){const s=Object.getOwnPropertyDescriptor(e,a);s&&Object.defineProperty(r,a,s.get?s:{enumerable:!0,get:()=>e[a]})}}}return Object.freeze(Object.defineProperty(r,Symbol.toStringTag,{value:"Module"}))}var m={exports:{}};(function(r,i){(function(o,e){r.exports=e(u)})(l,function(o){function e(t){return t&&typeof t=="object"&&"default"in t?t:{default:t}}var a=e(o),s={name:"sw",weekdays:"Jumapili_Jumatatu_Jumanne_Jumatano_Alhamisi_Ijumaa_Jumamosi".split("_"),weekdaysShort:"Jpl_Jtat_Jnne_Jtan_Alh_Ijm_Jmos".split("_"),weekdaysMin:"J2_J3_J4_J5_Al_Ij_J1".split("_"),months:"Januari_Februari_Machi_Aprili_Mei_Juni_Julai_Agosti_Septemba_Oktoba_Novemba_Desemba".split("_"),monthsShort:"Jan_Feb_Mac_Apr_Mei_Jun_Jul_Ago_Sep_Okt_Nov_Des".split("_"),weekStart:1,ordinal:function(t){return t},relativeTime:{future:"%s baadaye",past:"tokea %s",s:"hivi punde",m:"dakika moja",mm:"dakika %d",h:"saa limoja",hh:"masaa %d",d:"siku moja",dd:"masiku %d",M:"mwezi mmoja",MM:"miezi %d",y:"mwaka mmoja",yy:"miaka %d"},formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"}};return a.default.locale(s,null,!0),s})})(m);var _=m.exports;const p=n(_),M=d({__proto__:null,default:p},[_]);export{M as s};