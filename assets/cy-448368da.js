import{aH as i,bm as l,aG as u}from"./index-c20bd96b.js";function y(n,o){for(var a=0;a<o.length;a++){const e=o[a];if(typeof e!="string"&&!Array.isArray(e)){for(const r in e)if(r!=="default"&&!(r in n)){const d=Object.getOwnPropertyDescriptor(e,r);d&&Object.defineProperty(n,r,d.get?d:{enumerable:!0,get:()=>e[r]})}}}return Object.freeze(Object.defineProperty(n,Symbol.toStringTag,{value:"Module"}))}var _={exports:{}};(function(n,o){(function(a,e){n.exports=e(l)})(u,function(a){function e(t){return t&&typeof t=="object"&&"default"in t?t:{default:t}}var r=e(a),d={name:"cy",weekdays:"Dydd Sul_Dydd Llun_Dydd Mawrth_Dydd Mercher_Dydd Iau_Dydd Gwener_Dydd Sadwrn".split("_"),months:"Ionawr_Chwefror_Mawrth_Ebrill_Mai_Mehefin_Gorffennaf_Awst_Medi_Hydref_Tachwedd_Rhagfyr".split("_"),weekStart:1,weekdaysShort:"Sul_Llun_Maw_Mer_Iau_Gwe_Sad".split("_"),monthsShort:"Ion_Chwe_Maw_Ebr_Mai_Meh_Gor_Aws_Med_Hyd_Tach_Rhag".split("_"),weekdaysMin:"Su_Ll_Ma_Me_Ia_Gw_Sa".split("_"),ordinal:function(t){return t},formats:{LT:"HH:mm",LTS:"HH:mm:ss",L:"DD/MM/YYYY",LL:"D MMMM YYYY",LLL:"D MMMM YYYY HH:mm",LLLL:"dddd, D MMMM YYYY HH:mm"},relativeTime:{future:"mewn %s",past:"%s yn ôl",s:"ychydig eiliadau",m:"munud",mm:"%d munud",h:"awr",hh:"%d awr",d:"diwrnod",dd:"%d diwrnod",M:"mis",MM:"%d mis",y:"blwyddyn",yy:"%d flynedd"}};return r.default.locale(d,null,!0),d})})(_);var s=_.exports;const f=i(s),m=y({__proto__:null,default:f},[s]);export{m as c};
