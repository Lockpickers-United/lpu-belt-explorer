import{aH as f,bm as m,aG as l}from"./index-c20bd96b.js";function d(_,i){for(var s=0;s<i.length;s++){const o=i[s];if(typeof o!="string"&&!Array.isArray(o)){for(const a in o)if(a!=="default"&&!(a in _)){const u=Object.getOwnPropertyDescriptor(o,a);u&&Object.defineProperty(_,a,u.get?u:{enumerable:!0,get:()=>o[a]})}}}return Object.freeze(Object.defineProperty(_,Symbol.toStringTag,{value:"Module"}))}var p={exports:{}};(function(_,i){(function(s,o){_.exports=o(m)})(l,function(s){function o(t){return t&&typeof t=="object"&&"default"in t?t:{default:t}}var a=o(s),u={name:"hu",weekdays:"vasárnap_hétfő_kedd_szerda_csütörtök_péntek_szombat".split("_"),weekdaysShort:"vas_hét_kedd_sze_csüt_pén_szo".split("_"),weekdaysMin:"v_h_k_sze_cs_p_szo".split("_"),months:"január_február_március_április_május_június_július_augusztus_szeptember_október_november_december".split("_"),monthsShort:"jan_feb_márc_ápr_máj_jún_júl_aug_szept_okt_nov_dec".split("_"),ordinal:function(t){return t+"."},weekStart:1,relativeTime:{future:"%s múlva",past:"%s",s:function(t,e,n,r){return"néhány másodperc"+(r||e?"":"e")},m:function(t,e,n,r){return"egy perc"+(r||e?"":"e")},mm:function(t,e,n,r){return t+" perc"+(r||e?"":"e")},h:function(t,e,n,r){return"egy "+(r||e?"óra":"órája")},hh:function(t,e,n,r){return t+" "+(r||e?"óra":"órája")},d:function(t,e,n,r){return"egy "+(r||e?"nap":"napja")},dd:function(t,e,n,r){return t+" "+(r||e?"nap":"napja")},M:function(t,e,n,r){return"egy "+(r||e?"hónap":"hónapja")},MM:function(t,e,n,r){return t+" "+(r||e?"hónap":"hónapja")},y:function(t,e,n,r){return"egy "+(r||e?"év":"éve")},yy:function(t,e,n,r){return t+" "+(r||e?"év":"éve")}},formats:{LT:"H:mm",LTS:"H:mm:ss",L:"YYYY.MM.DD.",LL:"YYYY. MMMM D.",LLL:"YYYY. MMMM D. H:mm",LLLL:"YYYY. MMMM D., dddd H:mm"}};return a.default.locale(u,null,!0),u})})(p);var c=p.exports;const h=f(c),y=d({__proto__:null,default:h},[c]);export{y as h};
