import{aL as Y,bn as h,aK as L}from"./index-72e7306a.js";function k(u,m){for(var s=0;s<m.length;s++){const t=m[s];if(typeof t!="string"&&!Array.isArray(t)){for(const e in t)if(e!=="default"&&!(e in u)){const a=Object.getOwnPropertyDescriptor(t,e);a&&Object.defineProperty(u,e,a.get?a:{enumerable:!0,get:()=>t[e]})}}}return Object.freeze(Object.defineProperty(u,Symbol.toStringTag,{value:"Module"}))}var d={exports:{}};(function(u,m){(function(s,t){u.exports=t(h)})(L,function(s){function t(_){return _&&typeof _=="object"&&"default"in _?_:{default:_}}var e=t(s),a="січня_лютого_березня_квітня_травня_червня_липня_серпня_вересня_жовтня_листопада_грудня".split("_"),p="січень_лютий_березень_квітень_травень_червень_липень_серпень_вересень_жовтень_листопад_грудень".split("_"),y=/D[oD]?(\[[^[\]]*\]|\s)+MMMM?/;function r(_,o,l){var n,i;return l==="m"?o?"хвилина":"хвилину":l==="h"?o?"година":"годину":_+" "+(n=+_,i={ss:o?"секунда_секунди_секунд":"секунду_секунди_секунд",mm:o?"хвилина_хвилини_хвилин":"хвилину_хвилини_хвилин",hh:o?"година_години_годин":"годину_години_годин",dd:"день_дні_днів",MM:"місяць_місяці_місяців",yy:"рік_роки_років"}[l].split("_"),n%10==1&&n%100!=11?i[0]:n%10>=2&&n%10<=4&&(n%100<10||n%100>=20)?i[1]:i[2])}var f=function(_,o){return y.test(o)?a[_.month()]:p[_.month()]};f.s=p,f.f=a;var M={name:"uk",weekdays:"неділя_понеділок_вівторок_середа_четвер_п’ятниця_субота".split("_"),weekdaysShort:"ндл_пнд_втр_срд_чтв_птн_сбт".split("_"),weekdaysMin:"нд_пн_вт_ср_чт_пт_сб".split("_"),months:f,monthsShort:"січ_лют_бер_квіт_трав_черв_лип_серп_вер_жовт_лист_груд".split("_"),weekStart:1,relativeTime:{future:"за %s",past:"%s тому",s:"декілька секунд",m:r,mm:r,h:r,hh:r,d:"день",dd:r,M:"місяць",MM:r,y:"рік",yy:r},ordinal:function(_){return _},formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD.MM.YYYY",LL:"D MMMM YYYY р.",LLL:"D MMMM YYYY р., HH:mm",LLLL:"dddd, D MMMM YYYY р., HH:mm"}};return e.default.locale(M,null,!0),M})})(d);var c=d.exports;const b=Y(c),v=k({__proto__:null,default:b},[c]);export{v as u};