import{ar as Je,as as Ze,r as a,at as et,au as tt,m as J,j as o,_ as O,o as q,ah as rt,af as Pe,R as Z,P as nt,ak as Re,k as ee,h as oe,s as z,ab as ot,l as se,a8 as st,p as ae,av as at,w as it,u as lt,M as ct,c as ue,a6 as dt,am as ut,x as Y,T as be,I as Ce,S as Ee,f as Oe,i as _e,B as Te,a0 as ft,a1 as gt,a2 as mt,aw as pt,ax as vt,ay as xt,X as ht,ad as yt,v as Lt,az as bt,q as Be,b as Ct}from"./index-bc9dae95.js";import"./dayjs.min-8f12240a.js";import{g as At,I as It,l as wt,b as St}from"./ImageViewer-0e73cc0f.js";import{C as Ae}from"./Chip-d0238e0e.js";import{u as Ie}from"./useWindowSize-02de5907.js";import{F as De,S as Ne,I as kt}from"./InputLabel-8bde0900.js";import{B as Bt}from"./Badge-506ec81c.js";const jt=["className","component"];function Mt(e={}){const{themeId:t,defaultTheme:n,defaultClassName:i="MuiBox-root",generateClassName:h}=e,m=Je("div",{shouldForwardProp:u=>u!=="theme"&&u!=="sx"&&u!=="as"})(Ze);return a.forwardRef(function(d,S){const j=et(n),A=tt(d),{className:y,component:v="div"}=A,b=J(A,jt);return o.jsx(m,O({as:v,ref:S,className:q(y,h?h(i):i),theme:t&&j[t]||j},b))})}const Pt={White:{color:"#eee",danPoints:0},Yellow:{color:"#d3d31c",danPoints:0},Orange:{color:"#d95b27",danPoints:0},Green:{color:"#43833e",danPoints:0},Blue:{color:"#3768b1",danPoints:1},Purple:{color:"#6a4b9d",danPoints:3},Brown:{color:"#624e38",danPoints:6},Red:{color:"#b92121",danPoints:10},Black:{color:"#000000",lineColor:"#494949",danPoints:18},"Black 1":{color:"#000000",lineColor:"#494949",danPoints:18},"Black 2":{color:"#000000",lineColor:"#494949",danPoints:24},"Black 3":{color:"#000000",lineColor:"#494949",danPoints:30},"Black 4":{color:"#000000",lineColor:"#494949",danPoints:36},"Black 5":{color:"#000000",lineColor:"#494949",danPoints:50},Unranked:{color:"#000000",lineColor:"#d3d31c",danPoints:0}},Le=Object.keys(Pt),me=[...Le].reverse();me.push(me.shift());const ln=["White","Yellow","Orange","Green","Blue","Purple","Brown","Red","Black"],cn=(e,t)=>Le.indexOf(e)-Le.indexOf(t),dn=(e,t)=>me.indexOf(e)-me.indexOf(t);var Fe={exports:{}};(function(e){((t,n)=>{e.exports?e.exports=n():t.fuzzysort=n()})(rt,t=>{var n=(l,r)=>{if(l=="farzher")return{target:"farzher was here (^-^*)/",score:0,_indexes:[0]};if(!l||!r)return E;var c=j(l);re(r)||(r=S(r));var f=c.bitflags;return(f&r._bitflags)!==f?E:y(c,r)},i=(l,r,c)=>{if(l=="farzher")return[{target:"farzher was here (^-^*)/",score:0,_indexes:[0],obj:r?r[0]:E}];if(!l)return c&&c.all?A(l,r,c):xe;var f=j(l),g=f.bitflags;f.containsSpace;var p=c&&c.threshold||ne,x=c&&c.limit||ve,s=0,B=0,C=r.length;if(c&&c.key)for(var P=c.key,T=0;T<C;++T){var F=r[T],_=X(F,P);if(_&&(re(_)||(_=S(_)),(g&_._bitflags)===g)){var $=y(f,_);$!==E&&($.score<p||($={target:$.target,_targetLower:"",_targetLowerCodes:E,_nextBeginningIndexes:E,_bitflags:0,score:$.score,_indexes:$._indexes,obj:F},s<x?(V.add($),++s):(++B,$.score>V.peek().score&&V.replaceTop($))))}}else if(c&&c.keys)for(var Q=c.scoreFn||ie,de=c.keys,fe=de.length,T=0;T<C;++T){for(var F=r[T],U=new Array(fe),G=0;G<fe;++G){var P=de[G],_=X(F,P);if(!_){U[G]=E;continue}re(_)||(_=S(_)),(g&_._bitflags)!==g?U[G]=E:U[G]=y(f,_)}U.obj=F;var D=Q(U);D!==E&&(D<p||(U.score=D,s<x?(V.add(U),++s):(++B,D>V.peek().score&&V.replaceTop(U))))}else for(var T=0;T<C;++T){var _=r[T];if(_&&(re(_)||(_=S(_)),(g&_._bitflags)===g)){var $=y(f,_);$!==E&&($.score<p||(s<x?(V.add($),++s):(++B,$.score>V.peek().score&&V.replaceTop($))))}}if(s===0)return xe;for(var le=new Array(s),T=s-1;T>=0;--T)le[T]=V.poll();return le.total=s+B,le},h=(l,r,c)=>{if(typeof r=="function")return m(l,r);if(l===E)return E;r===void 0&&(r="<b>"),c===void 0&&(c="</b>");var f="",g=0,p=!1,x=l.target,s=x.length,B=l._indexes;B=B.slice(0,B.len).sort((T,F)=>T-F);for(var C=0;C<s;++C){var P=x[C];if(B[g]===C){if(++g,p||(p=!0,f+=r),g===B.length){f+=P+c+x.substr(C+1);break}}else p&&(p=!1,f+=c);f+=P}return f},m=(C,r)=>{if(C===E)return E;var c=C.target,f=c.length,g=C._indexes;g=g.slice(0,g.len).sort((F,_)=>F-_);for(var p="",x=0,s=0,B=!1,C=[],P=0;P<f;++P){var T=c[P];if(g[s]===P){if(++s,B||(B=!0,C.push(p),p=""),s===g.length){p+=T,C.push(r(p,x++)),p="",C.push(c.substr(P+1));break}}else B&&(B=!1,C.push(r(p,x++)),p="");p+=T}return C},I=l=>l._indexes.slice(0,l._indexes.len).sort((r,c)=>r-c),u=l=>{typeof l!="string"&&(l="");var r=b(l);return{target:l,_targetLower:r._lower,_targetLowerCodes:r.lowerCodes,_nextBeginningIndexes:E,_bitflags:r.bitflags,score:E,_indexes:[0],obj:E}},d=l=>{typeof l!="string"&&(l=""),l=l.trim();var r=b(l),c=[];if(r.containsSpace){var f=l.split(/\s+/);f=[...new Set(f)];for(var g=0;g<f.length;g++)if(f[g]!==""){var p=b(f[g]);c.push({lowerCodes:p.lowerCodes,_lower:f[g].toLowerCase(),containsSpace:!1})}}return{lowerCodes:r.lowerCodes,bitflags:r.bitflags,containsSpace:r.containsSpace,_lower:r._lower,spaceSearches:c}},S=l=>{if(l.length>999)return u(l);var r=N.get(l);return r!==void 0||(r=u(l),N.set(l,r)),r},j=l=>{if(l.length>999)return d(l);var r=k.get(l);return r!==void 0||(r=d(l),k.set(l,r)),r},A=(l,r,c)=>{var f=[];f.total=r.length;var g=c&&c.limit||ve;if(c&&c.key)for(var p=0;p<r.length;p++){var x=r[p],s=X(x,c.key);if(s){re(s)||(s=S(s)),s.score=ne,s._indexes.len=0;var B=s;if(B={target:B.target,_targetLower:"",_targetLowerCodes:E,_nextBeginningIndexes:E,_bitflags:0,score:s.score,_indexes:E,obj:x},f.push(B),f.length>=g)return f}}else if(c&&c.keys)for(var p=0;p<r.length;p++){for(var x=r[p],C=new Array(c.keys.length),P=c.keys.length-1;P>=0;--P){var s=X(x,c.keys[P]);if(!s){C[P]=E;continue}re(s)||(s=S(s)),s.score=ne,s._indexes.len=0,C[P]=s}if(C.obj=x,C.score=ne,f.push(C),f.length>=g)return f}else for(var p=0;p<r.length;p++){var s=r[p];if(s&&(re(s)||(s=S(s)),s.score=ne,s._indexes.len=0,f.push(s),f.length>=g))return f}return f},y=(l,r,c=!1)=>{if(c===!1&&l.containsSpace)return v(l,r);for(var f=l._lower,g=l.lowerCodes,p=g[0],x=r._targetLowerCodes,s=g.length,B=x.length,F=0,C=0,P=0;;){var T=p===x[C];if(T){if(R[P++]=C,++F,F===s)break;p=g[F]}if(++C,C>=B)return E}var F=0,_=!1,$=0,Q=r._nextBeginningIndexes;Q===E&&(Q=r._nextBeginningIndexes=L(r.target)),C=R[0]===0?0:Q[R[0]-1];var de=0;if(C!==B)for(;;)if(C>=B){if(F<=0||(++de,de>200))break;--F;var fe=W[--$];C=Q[fe]}else{var T=g[F]===x[C];if(T){if(W[$++]=C,++F,F===s){_=!0;break}++C}else C=Q[C]}var U=r._targetLower.indexOf(f,R[0]),G=~U;if(G&&!_)for(var D=0;D<P;++D)R[D]=U+D;var le=!1;G&&(le=r._nextBeginningIndexes[U-1]===U);{if(_)var H=W,he=$;else var H=R,he=P;for(var K=0,ke=0,D=1;D<s;++D)H[D]-H[D-1]!==1&&(K-=H[D],++ke);var Ye=H[s-1]-H[0]-(s-1);if(K-=(12+Ye)*ke,H[0]!==0&&(K-=H[0]*H[0]*.2),!_)K*=1e3;else{for(var ye=1,D=Q[0];D<B;D=Q[D])++ye;ye>24&&(K*=(ye-24)*10)}G&&(K/=1+s*s*1),le&&(K/=1+s*s*1),K-=B-s,r.score=K;for(var D=0;D<he;++D)r._indexes[D]=H[D];return r._indexes.len=he,r}},v=(l,r)=>{for(var c=new Set,f=0,g=E,p=0,x=l.spaceSearches,P=0;P<x.length;++P){var s=x[P];if(g=y(s,r),g===E)return E;f+=g.score,g._indexes[0]<p&&(f-=p-g._indexes[0]),p=g._indexes[0];for(var B=0;B<g._indexes.len;++B)c.add(g._indexes[B])}var C=y(l,r,!0);if(C!==E&&C.score>f)return C;g.score=f;var P=0;for(let T of c)g._indexes[P++]=T;return g._indexes.len=P,g},b=l=>{for(var r=l.length,c=l.toLowerCase(),f=[],g=0,p=!1,x=0;x<r;++x){var s=f[x]=c.charCodeAt(x);if(s===32){p=!0;continue}var B=s>=97&&s<=122?s-97:s>=48&&s<=57?26:s<=127?30:31;g|=1<<B}return{lowerCodes:f,bitflags:g,containsSpace:p,_lower:c}},w=l=>{for(var r=l.length,c=[],f=0,g=!1,p=!1,x=0;x<r;++x){var s=l.charCodeAt(x),B=s>=65&&s<=90,C=B||s>=97&&s<=122||s>=48&&s<=57,P=B&&!g||!p||!C;g=B,p=C,P&&(c[f++]=x)}return c},L=l=>{for(var r=l.length,c=w(l),f=[],g=c[0],p=0,x=0;x<r;++x)g>x?f[x]=g:(g=c[++p],f[x]=g===void 0?r:g);return f},M=()=>{N.clear(),k.clear(),R=[],W=[]},N=new Map,k=new Map,R=[],W=[],ie=l=>{for(var r=ne,c=l.length,f=0;f<c;++f){var g=l[f];if(g!==E){var p=g.score;p>r&&(r=p)}}return r===ne?E:r},X=(l,r)=>{var c=l[r];if(c!==void 0)return c;var f=r;Array.isArray(r)||(f=r.split("."));for(var g=f.length,p=-1;l&&++p<g;)l=l[f[p]];return l},re=l=>typeof l=="object",ve=1/0,ne=-ve,xe=[];xe.total=0;var E=null,Xe=l=>{var r=[],c=0,f={},g=p=>{for(var x=0,s=r[x],B=1;B<c;){var C=B+1;x=B,C<c&&r[C].score<r[B].score&&(x=C),r[x-1>>1]=r[x],B=1+(x<<1)}for(var P=x-1>>1;x>0&&s.score<r[P].score;P=(x=P)-1>>1)r[x]=r[P];r[x]=s};return f.add=p=>{var x=c;r[c++]=p;for(var s=x-1>>1;x>0&&p.score<r[s].score;s=(x=s)-1>>1)r[x]=r[s];r[x]=p},f.poll=p=>{if(c!==0){var x=r[0];return r[0]=r[--c],g(),x}},f.peek=p=>{if(c!==0)return r[0]},f.replaceTop=p=>{r[0]=p,g()},f},V=Xe();return{single:n,go:i,highlight:h,prepare:u,indexes:I,cleanup:M}})})(Fe);var Rt=Fe.exports;const un=Pe(Rt),$e=Z.createContext({}),Et=e=>[...new Set([...(e==null?void 0:e.own)||[],...(e==null?void 0:e.picked)||[],...(e==null?void 0:e.recorded)||[],...(e==null?void 0:e.wishlist)||[]])],te=Z.createContext({});function fn({children:e,filterFields:t}){const[n,i]=nt(),h=a.useMemo(()=>Object.fromEntries(n.entries()),[n]),m=a.useCallback(v=>{Object.keys(v).forEach(b=>{v[b]||delete v[b]}),i(v)},[i]),I=a.useCallback((v,b)=>{v.forEach(({key:w,value:L})=>{(b||!L)&&n.delete(w),L&&n.set(w,L)}),i(n)},[n,i]),u=a.useCallback((v,b,w)=>I([{key:v,value:b}],w),[I]),d=a.useCallback(v=>{const b=v.reduce((w,L)=>{const{[L]:M,...N}=w;return N},h);m(b)},[h,m]),S=a.useCallback((v,b)=>{const w=h[v];if(Array.isArray(w)&&w.length>1){const L=w.filter(M=>M!==b);m({...h,[v]:L})}else{const{[v]:L,...M}=h;m(M)}},[h,m]),j=a.useCallback(()=>{const{tab:v}=h;m({tab:v})},[h,m]),A=a.useMemo(()=>Array.from(n.keys()).filter(b=>!Ot.includes(b)).length,[n]),y=a.useMemo(()=>({filters:h,filterCount:A,addFilter:u,addFilters:I,removeFilter:S,removeFilters:d,setFilters:m,clearFilters:j,filterFields:t,filterFieldsByFieldName:t.reduce((v,b)=>({...v,[b.fieldName]:b}),{id:{label:"ID"}})}),[u,I,j,A,h,S,d,m,t]);return o.jsx(te.Provider,{value:y,children:e})}const Ot=["id","name","search","tab","sort","image"];var pe={exports:{}},We={À:"A",Á:"A",Â:"A",Ã:"A",Ä:"A",Å:"A",Ấ:"A",Ắ:"A",Ẳ:"A",Ẵ:"A",Ặ:"A",Æ:"AE",Ầ:"A",Ằ:"A",Ȃ:"A",Ả:"A",Ạ:"A",Ẩ:"A",Ẫ:"A",Ậ:"A",Ç:"C",Ḉ:"C",È:"E",É:"E",Ê:"E",Ë:"E",Ế:"E",Ḗ:"E",Ề:"E",Ḕ:"E",Ḝ:"E",Ȇ:"E",Ẻ:"E",Ẽ:"E",Ẹ:"E",Ể:"E",Ễ:"E",Ệ:"E",Ì:"I",Í:"I",Î:"I",Ï:"I",Ḯ:"I",Ȋ:"I",Ỉ:"I",Ị:"I",Ð:"D",Ñ:"N",Ò:"O",Ó:"O",Ô:"O",Õ:"O",Ö:"O",Ø:"O",Ố:"O",Ṍ:"O",Ṓ:"O",Ȏ:"O",Ỏ:"O",Ọ:"O",Ổ:"O",Ỗ:"O",Ộ:"O",Ờ:"O",Ở:"O",Ỡ:"O",Ớ:"O",Ợ:"O",Ù:"U",Ú:"U",Û:"U",Ü:"U",Ủ:"U",Ụ:"U",Ử:"U",Ữ:"U",Ự:"U",Ý:"Y",à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",ấ:"a",ắ:"a",ẳ:"a",ẵ:"a",ặ:"a",æ:"ae",ầ:"a",ằ:"a",ȃ:"a",ả:"a",ạ:"a",ẩ:"a",ẫ:"a",ậ:"a",ç:"c",ḉ:"c",è:"e",é:"e",ê:"e",ë:"e",ế:"e",ḗ:"e",ề:"e",ḕ:"e",ḝ:"e",ȇ:"e",ẻ:"e",ẽ:"e",ẹ:"e",ể:"e",ễ:"e",ệ:"e",ì:"i",í:"i",î:"i",ï:"i",ḯ:"i",ȋ:"i",ỉ:"i",ị:"i",ð:"d",ñ:"n",ò:"o",ó:"o",ô:"o",õ:"o",ö:"o",ø:"o",ố:"o",ṍ:"o",ṓ:"o",ȏ:"o",ỏ:"o",ọ:"o",ổ:"o",ỗ:"o",ộ:"o",ờ:"o",ở:"o",ỡ:"o",ớ:"o",ợ:"o",ù:"u",ú:"u",û:"u",ü:"u",ủ:"u",ụ:"u",ử:"u",ữ:"u",ự:"u",ý:"y",ÿ:"y",Ā:"A",ā:"a",Ă:"A",ă:"a",Ą:"A",ą:"a",Ć:"C",ć:"c",Ĉ:"C",ĉ:"c",Ċ:"C",ċ:"c",Č:"C",č:"c",C̆:"C",c̆:"c",Ď:"D",ď:"d",Đ:"D",đ:"d",Ē:"E",ē:"e",Ĕ:"E",ĕ:"e",Ė:"E",ė:"e",Ę:"E",ę:"e",Ě:"E",ě:"e",Ĝ:"G",Ǵ:"G",ĝ:"g",ǵ:"g",Ğ:"G",ğ:"g",Ġ:"G",ġ:"g",Ģ:"G",ģ:"g",Ĥ:"H",ĥ:"h",Ħ:"H",ħ:"h",Ḫ:"H",ḫ:"h",Ĩ:"I",ĩ:"i",Ī:"I",ī:"i",Ĭ:"I",ĭ:"i",Į:"I",į:"i",İ:"I",ı:"i",Ĳ:"IJ",ĳ:"ij",Ĵ:"J",ĵ:"j",Ķ:"K",ķ:"k",Ḱ:"K",ḱ:"k",K̆:"K",k̆:"k",Ĺ:"L",ĺ:"l",Ļ:"L",ļ:"l",Ľ:"L",ľ:"l",Ŀ:"L",ŀ:"l",Ł:"l",ł:"l",Ḿ:"M",ḿ:"m",M̆:"M",m̆:"m",Ń:"N",ń:"n",Ņ:"N",ņ:"n",Ň:"N",ň:"n",ŉ:"n",N̆:"N",n̆:"n",Ō:"O",ō:"o",Ŏ:"O",ŏ:"o",Ő:"O",ő:"o",Œ:"OE",œ:"oe",P̆:"P",p̆:"p",Ŕ:"R",ŕ:"r",Ŗ:"R",ŗ:"r",Ř:"R",ř:"r",R̆:"R",r̆:"r",Ȓ:"R",ȓ:"r",Ś:"S",ś:"s",Ŝ:"S",ŝ:"s",Ş:"S",Ș:"S",ș:"s",ş:"s",Š:"S",š:"s",Ţ:"T",ţ:"t",ț:"t",Ț:"T",Ť:"T",ť:"t",Ŧ:"T",ŧ:"t",T̆:"T",t̆:"t",Ũ:"U",ũ:"u",Ū:"U",ū:"u",Ŭ:"U",ŭ:"u",Ů:"U",ů:"u",Ű:"U",ű:"u",Ų:"U",ų:"u",Ȗ:"U",ȗ:"u",V̆:"V",v̆:"v",Ŵ:"W",ŵ:"w",Ẃ:"W",ẃ:"w",X̆:"X",x̆:"x",Ŷ:"Y",ŷ:"y",Ÿ:"Y",Y̆:"Y",y̆:"y",Ź:"Z",ź:"z",Ż:"Z",ż:"z",Ž:"Z",ž:"z",ſ:"s",ƒ:"f",Ơ:"O",ơ:"o",Ư:"U",ư:"u",Ǎ:"A",ǎ:"a",Ǐ:"I",ǐ:"i",Ǒ:"O",ǒ:"o",Ǔ:"U",ǔ:"u",Ǖ:"U",ǖ:"u",Ǘ:"U",ǘ:"u",Ǚ:"U",ǚ:"u",Ǜ:"U",ǜ:"u",Ứ:"U",ứ:"u",Ṹ:"U",ṹ:"u",Ǻ:"A",ǻ:"a",Ǽ:"AE",ǽ:"ae",Ǿ:"O",ǿ:"o",Þ:"TH",þ:"th",Ṕ:"P",ṕ:"p",Ṥ:"S",ṥ:"s",X́:"X",x́:"x",Ѓ:"Г",ѓ:"г",Ќ:"К",ќ:"к",A̋:"A",a̋:"a",E̋:"E",e̋:"e",I̋:"I",i̋:"i",Ǹ:"N",ǹ:"n",Ồ:"O",ồ:"o",Ṑ:"O",ṑ:"o",Ừ:"U",ừ:"u",Ẁ:"W",ẁ:"w",Ỳ:"Y",ỳ:"y",Ȁ:"A",ȁ:"a",Ȅ:"E",ȅ:"e",Ȉ:"I",ȉ:"i",Ȍ:"O",ȍ:"o",Ȑ:"R",ȑ:"r",Ȕ:"U",ȕ:"u",B̌:"B",b̌:"b",Č̣:"C",č̣:"c",Ê̌:"E",ê̌:"e",F̌:"F",f̌:"f",Ǧ:"G",ǧ:"g",Ȟ:"H",ȟ:"h",J̌:"J",ǰ:"j",Ǩ:"K",ǩ:"k",M̌:"M",m̌:"m",P̌:"P",p̌:"p",Q̌:"Q",q̌:"q",Ř̩:"R",ř̩:"r",Ṧ:"S",ṧ:"s",V̌:"V",v̌:"v",W̌:"W",w̌:"w",X̌:"X",x̌:"x",Y̌:"Y",y̌:"y",A̧:"A",a̧:"a",B̧:"B",b̧:"b",Ḑ:"D",ḑ:"d",Ȩ:"E",ȩ:"e",Ɛ̧:"E",ɛ̧:"e",Ḩ:"H",ḩ:"h",I̧:"I",i̧:"i",Ɨ̧:"I",ɨ̧:"i",M̧:"M",m̧:"m",O̧:"O",o̧:"o",Q̧:"Q",q̧:"q",U̧:"U",u̧:"u",X̧:"X",x̧:"x",Z̧:"Z",z̧:"z",й:"и",Й:"И",ё:"е",Ё:"Е"},Ue=Object.keys(We).join("|"),_t=new RegExp(Ue,"g"),Tt=new RegExp(Ue,"");function Dt(e){return We[e]}var ze=function(e){return e.replace(_t,Dt)},Nt=function(e){return!!e.match(Tt)};pe.exports=ze;pe.exports.has=Nt;pe.exports.remove=ze;var Ft=pe.exports;const gn=Pe(Ft),$t=Z.createContext({});function mn({children:e}){const{userId:t}=Re(),{allEntries:n,getEntryFromId:i,getNameFromId:h}=a.useContext($e),{filters:m,addFilter:I,addFilters:u,removeFilters:d}=a.useContext(te),S=m.id,j=a.useCallback((k,R)=>{const W=i(k),ie=h(k);if(k&&k!=="beltreqs"){const X=m.tab==="search"&&!R?"search":W.belt.replace(/\s\d/g,"");u([{key:"id",value:k},{key:"name",value:ie},{key:"tab",value:t?void 0:X}],!0)}else k==="beltreqs"?u([{key:"id",value:k},{key:"name",value:void 0}],!0):d(["id","name"])},[u,m.tab,i,h,d,t]),A=a.useCallback(()=>{d(["id","name"])},[d]),y=a.useCallback(k=>{u([{key:"tab",value:k},{key:"id",value:S==="beltreqs"?"beltreqs":void 0},{key:"name",value:void 0}],!0),setTimeout(()=>b(!1),0)},[u,S]),[v,b]=a.useState(!1),[w,L]=a.useState(!1),M=a.useMemo(()=>{if(!m.tab){const{id:k}=m;if(k&&!m.tab){const R=n.find(W=>k===W.id);if(R){const W=R.belt.replace(/\s\d/g,"");return I("tab",W),W}}return"White"}return m.tab},[I,n,m]),N=a.useMemo(()=>({compact:w,tab:M,setTab:y,expanded:S,setExpanded:j,clearExpanded:A,displayAll:v&&m.tab==="search",setDisplayAll:b,setCompact:L}),[w,v,S,m.tab,A,j,y,M]);return o.jsx($t.Provider,{value:N,children:e})}const pn=[{key:"own",label:"Own"},{key:"picked",label:"Picked"},{key:"recorded",label:"Recorded"},{key:"wishlist",label:"Wishlist"}],Wt=["Own","Picked","Recorded","Wishlist"],Ut=a.createContext({}),Ve=Ut;function zt(e){return oe("MuiAccordion",e)}const Vt=ee("MuiAccordion",["root","rounded","expanded","disabled","gutters","region"]),ge=Vt,Gt=["children","className","defaultExpanded","disabled","disableGutters","expanded","onChange","square","TransitionComponent","TransitionProps"],Ht=e=>{const{classes:t,square:n,expanded:i,disabled:h,disableGutters:m}=e;return ae({root:["root",!n&&"rounded",i&&"expanded",h&&"disabled",!m&&"gutters"],region:["region"]},zt,t)},qt=z(ot,{name:"MuiAccordion",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[{[`& .${ge.region}`]:t.region},t.root,!n.square&&t.rounded,!n.disableGutters&&t.gutters]}})(({theme:e})=>{const t={duration:e.transitions.duration.shortest};return{position:"relative",transition:e.transitions.create(["margin"],t),overflowAnchor:"none","&::before":{position:"absolute",left:0,top:-1,right:0,height:1,content:'""',opacity:1,backgroundColor:(e.vars||e).palette.divider,transition:e.transitions.create(["opacity","background-color"],t)},"&:first-of-type":{"&::before":{display:"none"}},[`&.${ge.expanded}`]:{"&::before":{opacity:0},"&:first-of-type":{marginTop:0},"&:last-of-type":{marginBottom:0},"& + &":{"&::before":{display:"none"}}},[`&.${ge.disabled}`]:{backgroundColor:(e.vars||e).palette.action.disabledBackground}}},({theme:e,ownerState:t})=>O({},!t.square&&{borderRadius:0,"&:first-of-type":{borderTopLeftRadius:(e.vars||e).shape.borderRadius,borderTopRightRadius:(e.vars||e).shape.borderRadius},"&:last-of-type":{borderBottomLeftRadius:(e.vars||e).shape.borderRadius,borderBottomRightRadius:(e.vars||e).shape.borderRadius,"@supports (-ms-ime-align: auto)":{borderBottomLeftRadius:0,borderBottomRightRadius:0}}},!t.disableGutters&&{[`&.${ge.expanded}`]:{margin:"16px 0"}})),Qt=a.forwardRef(function(t,n){const i=se({props:t,name:"MuiAccordion"}),{children:h,className:m,defaultExpanded:I=!1,disabled:u=!1,disableGutters:d=!1,expanded:S,onChange:j,square:A=!1,TransitionComponent:y=at,TransitionProps:v}=i,b=J(i,Gt),[w,L]=st({controlled:S,default:I,name:"Accordion",state:"expanded"}),M=a.useCallback(X=>{L(!w),j&&j(X,!w)},[w,j,L]),[N,...k]=a.Children.toArray(h),R=a.useMemo(()=>({expanded:w,disabled:u,disableGutters:d,toggle:M}),[w,u,d,M]),W=O({},i,{square:A,disabled:u,disableGutters:d,expanded:w}),ie=Ht(W);return o.jsxs(qt,O({className:q(ie.root,m),ref:n,ownerState:W,square:A},b,{children:[o.jsx(Ve.Provider,{value:R,children:N}),o.jsx(y,O({in:w,timeout:"auto"},v,{children:o.jsx("div",{"aria-labelledby":N.props.id,id:N.props["aria-controls"],role:"region",className:ie.region,children:k})}))]}))}),vn=Qt;function Kt(e){return oe("MuiAccordionDetails",e)}ee("MuiAccordionDetails",["root"]);const Xt=["className"],Yt=e=>{const{classes:t}=e;return ae({root:["root"]},Kt,t)},Jt=z("div",{name:"MuiAccordionDetails",slot:"Root",overridesResolver:(e,t)=>t.root})(({theme:e})=>({padding:e.spacing(1,2,2)})),Zt=a.forwardRef(function(t,n){const i=se({props:t,name:"MuiAccordionDetails"}),{className:h}=i,m=J(i,Xt),I=i,u=Yt(I);return o.jsx(Jt,O({className:q(u.root,h),ref:n,ownerState:I},m))}),xn=Zt;function er(e){return oe("MuiAccordionSummary",e)}const tr=ee("MuiAccordionSummary",["root","expanded","focusVisible","disabled","gutters","contentGutters","content","expandIconWrapper"]),ce=tr,rr=["children","className","expandIcon","focusVisibleClassName","onClick"],nr=e=>{const{classes:t,expanded:n,disabled:i,disableGutters:h}=e;return ae({root:["root",n&&"expanded",i&&"disabled",!h&&"gutters"],focusVisible:["focusVisible"],content:["content",n&&"expanded",!h&&"contentGutters"],expandIconWrapper:["expandIconWrapper",n&&"expanded"]},er,t)},or=z(it,{name:"MuiAccordionSummary",slot:"Root",overridesResolver:(e,t)=>t.root})(({theme:e,ownerState:t})=>{const n={duration:e.transitions.duration.shortest};return O({display:"flex",minHeight:48,padding:e.spacing(0,2),transition:e.transitions.create(["min-height","background-color"],n),[`&.${ce.focusVisible}`]:{backgroundColor:(e.vars||e).palette.action.focus},[`&.${ce.disabled}`]:{opacity:(e.vars||e).palette.action.disabledOpacity},[`&:hover:not(.${ce.disabled})`]:{cursor:"pointer"}},!t.disableGutters&&{[`&.${ce.expanded}`]:{minHeight:64}})}),sr=z("div",{name:"MuiAccordionSummary",slot:"Content",overridesResolver:(e,t)=>t.content})(({theme:e,ownerState:t})=>O({display:"flex",flexGrow:1,margin:"12px 0"},!t.disableGutters&&{transition:e.transitions.create(["margin"],{duration:e.transitions.duration.shortest}),[`&.${ce.expanded}`]:{margin:"20px 0"}})),ar=z("div",{name:"MuiAccordionSummary",slot:"ExpandIconWrapper",overridesResolver:(e,t)=>t.expandIconWrapper})(({theme:e})=>({display:"flex",color:(e.vars||e).palette.action.active,transform:"rotate(0deg)",transition:e.transitions.create("transform",{duration:e.transitions.duration.shortest}),[`&.${ce.expanded}`]:{transform:"rotate(180deg)"}})),ir=a.forwardRef(function(t,n){const i=se({props:t,name:"MuiAccordionSummary"}),{children:h,className:m,expandIcon:I,focusVisibleClassName:u,onClick:d}=i,S=J(i,rr),{disabled:j=!1,disableGutters:A,expanded:y,toggle:v}=a.useContext(Ve),b=M=>{v&&v(M),d&&d(M)},w=O({},i,{expanded:y,disabled:j,disableGutters:A}),L=nr(w);return o.jsxs(or,O({focusRipple:!1,disableRipple:!0,disabled:j,component:"div","aria-expanded":y,className:q(L.root,m),focusVisibleClassName:q(L.focusVisible,u),onClick:b,ref:n,ownerState:w},S,{children:[o.jsx(sr,{className:L.content,ownerState:w,children:h}),I&&o.jsx(ar,{className:L.expandIconWrapper,ownerState:w,children:I})]}))}),hn=ir;function lr({name:e,value:t,last:n,style:i,headerStyle:h={},textStyle:m={}}){const I=n?{marginLeft:5,...i}:{marginLeft:5,marginBottom:8,...i},u={color:"#666",fontSize:"0.85rem",...h},d={marginLeft:5,...m};return o.jsxs("div",{style:I,children:[o.jsx("div",{style:u,children:e}),o.jsx("div",{style:d,children:t})]})}const cr=Z.memo(lr);function yn({field:e,value:t,...n}){const i=lt(),[h,m]=a.useState(!1),{addFilter:I}=a.useContext(te),u=a.useCallback(y=>{y.preventDefault(),y.stopPropagation(),m(!1)},[]),d=a.useCallback(y=>{y.preventDefault(),y.stopPropagation(),m(!1),I(e,t),window.scrollTo({top:0,behavior:"smooth"})},[I,e,t]),S=a.useCallback(y=>{y.preventDefault(),y.stopPropagation(),m(y.target)},[]),j=a.useCallback(y=>{y.stopPropagation(),m(!1);const v=encodeURI(t);setTimeout(()=>i(`/glossary?term=${v}`),0)},[i,t]),A=a.useMemo(()=>!!At.find(y=>y.term.toLowerCase()===t.toLowerCase()),[t]);return o.jsxs(Z.Fragment,{children:[o.jsx(Ae,{clickable:!0,variant:"outlined",label:t,style:{marginRight:4,marginBottom:4},onClick:S,...n}),o.jsxs(ct,{open:!!h,anchorEl:h,anchorOrigin:{horizontal:"right",vertical:"bottom"},onClose:u,children:[o.jsxs(ue,{disabled:!0,children:["Term: ",t]}),o.jsx(dt,{}),o.jsx(ue,{onClick:d,children:"Add Filter"}),o.jsx(ue,{onClick:j,disabled:!A,children:"Go to Glossary"})]})]})}function dr(e){return oe("MuiAccordionActions",e)}ee("MuiAccordionActions",["root","spacing"]);const ur=["className","disableSpacing"],fr=e=>{const{classes:t,disableSpacing:n}=e;return ae({root:["root",!n&&"spacing"]},dr,t)},gr=z("div",{name:"MuiAccordionActions",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,!n.disableSpacing&&t.spacing]}})(({ownerState:e})=>O({display:"flex",alignItems:"center",padding:8,justifyContent:"flex-end"},!e.disableSpacing&&{"& > :not(style) ~ :not(style)":{marginLeft:8}})),mr=a.forwardRef(function(t,n){const i=se({props:t,name:"MuiAccordionActions"}),{className:h,disableSpacing:m=!1}=i,I=J(i,ur),u=O({},i,{disableSpacing:m}),d=fr(u);return o.jsx(gr,O({className:q(d.root,h),ref:n,ownerState:u},I))}),Ln=mr;function pr(e){return oe("MuiImageList",e)}ee("MuiImageList",["root","masonry","quilted","standard","woven"]);const vr=a.createContext({}),Ge=vr,xr=["children","className","cols","component","rowHeight","gap","style","variant"],hr=e=>{const{classes:t,variant:n}=e;return ae({root:["root",n]},pr,t)},yr=z("ul",{name:"MuiImageList",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,t[n.variant]]}})(({ownerState:e})=>O({display:"grid",overflowY:"auto",listStyle:"none",padding:0,WebkitOverflowScrolling:"touch"},e.variant==="masonry"&&{display:"block"})),Lr=a.forwardRef(function(t,n){const i=se({props:t,name:"MuiImageList"}),{children:h,className:m,cols:I=2,component:u="ul",rowHeight:d="auto",gap:S=4,style:j,variant:A="standard"}=i,y=J(i,xr),v=a.useMemo(()=>({rowHeight:d,gap:S,variant:A}),[d,S,A]);a.useEffect(()=>{},[]);const b=A==="masonry"?O({columnCount:I,columnGap:S},j):O({gridTemplateColumns:`repeat(${I}, 1fr)`,gap:S},j),w=O({},i,{component:u,gap:S,rowHeight:d,variant:A}),L=hr(w);return o.jsx(yr,O({as:u,className:q(L.root,L[A],m),ref:n,style:b,ownerState:w},y,{children:o.jsx(Ge.Provider,{value:v,children:h})}))}),br=Lr;function Cr(e){return oe("MuiImageListItem",e)}const Ar=ee("MuiImageListItem",["root","img","standard","woven","masonry","quilted"]),je=Ar,Ir=["children","className","cols","component","rows","style"],wr=e=>{const{classes:t,variant:n}=e;return ae({root:["root",n],img:["img"]},Cr,t)},Sr=z("li",{name:"MuiImageListItem",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[{[`& .${je.img}`]:t.img},t.root,t[n.variant]]}})(({ownerState:e})=>O({display:"block",position:"relative"},e.variant==="standard"&&{display:"flex",flexDirection:"column"},e.variant==="woven"&&{height:"100%",alignSelf:"center","&:nth-of-type(even)":{height:"70%"}},{[`& .${je.img}`]:O({objectFit:"cover",width:"100%",height:"100%",display:"block"},e.variant==="standard"&&{height:"auto",flexGrow:1})})),kr=a.forwardRef(function(t,n){const i=se({props:t,name:"MuiImageListItem"}),{children:h,className:m,cols:I=1,component:u="li",rows:d=1,style:S}=i,j=J(i,Ir),{rowHeight:A="auto",gap:y,variant:v}=a.useContext(Ge);let b="auto";v==="woven"?b=void 0:A!=="auto"&&(b=A*d+y*(d-1));const w=O({},i,{cols:I,component:u,gap:y,rowHeight:A,rows:d,variant:v}),L=wr(w);return o.jsx(Sr,O({as:u,className:q(L.root,L[v],m),ref:n,style:O({height:b,gridColumnEnd:v!=="masonry"?`span ${I}`:void 0,gridRowEnd:v!=="masonry"?`span ${d}`:void 0,marginBottom:v==="masonry"?y:void 0,breakInside:v==="masonry"?"avoid":void 0},S),ownerState:w},j,{children:a.Children.map(h,M=>a.isValidElement(M)?M.type==="img"||ut(M,["Image"])?a.cloneElement(M,{className:q(L.img,M.props.className)}):M:null)}))}),Br=kr;function jr(e){return oe("MuiImageListItemBar",e)}ee("MuiImageListItemBar",["root","positionBottom","positionTop","positionBelow","titleWrap","titleWrapBottom","titleWrapTop","titleWrapBelow","titleWrapActionPosLeft","titleWrapActionPosRight","title","subtitle","actionIcon","actionIconActionPosLeft","actionIconActionPosRight"]);const Mr=["actionIcon","actionPosition","className","subtitle","title","position"],Pr=e=>{const{classes:t,position:n,actionIcon:i,actionPosition:h}=e,m={root:["root",`position${Y(n)}`],titleWrap:["titleWrap",`titleWrap${Y(n)}`,i&&`titleWrapActionPos${Y(h)}`],title:["title"],subtitle:["subtitle"],actionIcon:["actionIcon",`actionIconActionPos${Y(h)}`]};return ae(m,jr,t)},Rr=z("div",{name:"MuiImageListItemBar",slot:"Root",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.root,t[`position${Y(n.position)}`]]}})(({theme:e,ownerState:t})=>O({position:"absolute",left:0,right:0,background:"rgba(0, 0, 0, 0.5)",display:"flex",alignItems:"center",fontFamily:e.typography.fontFamily},t.position==="bottom"&&{bottom:0},t.position==="top"&&{top:0},t.position==="below"&&{position:"relative",background:"transparent",alignItems:"normal"})),Er=z("div",{name:"MuiImageListItemBar",slot:"TitleWrap",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.titleWrap,t[`titleWrap${Y(n.position)}`],n.actionIcon&&t[`titleWrapActionPos${Y(n.actionPosition)}`]]}})(({theme:e,ownerState:t})=>O({flexGrow:1,padding:"12px 16px",color:(e.vars||e).palette.common.white,overflow:"hidden"},t.position==="below"&&{padding:"6px 0 12px",color:"inherit"},t.actionIcon&&t.actionPosition==="left"&&{paddingLeft:0},t.actionIcon&&t.actionPosition==="right"&&{paddingRight:0})),Or=z("div",{name:"MuiImageListItemBar",slot:"Title",overridesResolver:(e,t)=>t.title})(({theme:e})=>({fontSize:e.typography.pxToRem(16),lineHeight:"24px",textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"})),_r=z("div",{name:"MuiImageListItemBar",slot:"Subtitle",overridesResolver:(e,t)=>t.subtitle})(({theme:e})=>({fontSize:e.typography.pxToRem(12),lineHeight:1,textOverflow:"ellipsis",overflow:"hidden",whiteSpace:"nowrap"})),Tr=z("div",{name:"MuiImageListItemBar",slot:"ActionIcon",overridesResolver:(e,t)=>{const{ownerState:n}=e;return[t.actionIcon,t[`actionIconActionPos${Y(n.actionPosition)}`]]}})(({ownerState:e})=>O({},e.actionPosition==="left"&&{order:-1})),Dr=a.forwardRef(function(t,n){const i=se({props:t,name:"MuiImageListItemBar"}),{actionIcon:h,actionPosition:m="right",className:I,subtitle:u,title:d,position:S="bottom"}=i,j=J(i,Mr),A=O({},i,{position:S,actionPosition:m}),y=Pr(A);return o.jsxs(Rr,O({ownerState:A,className:q(y.root,I),ref:n},j,{children:[o.jsxs(Er,{ownerState:A,className:y.titleWrap,children:[o.jsx(Or,{className:y.title,children:d}),u?o.jsx(_r,{className:y.subtitle,children:u}):null]}),h?o.jsx(Tr,{ownerState:A,className:y.actionIcon,children:h}):null]}))}),Nr=Dr,Fr="data:image/png;base64,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";function bn(e){const{columns:t,media:n,initiallyOpen:i,openIndex:h,onOpenImage:m,onCloseImage:I,onBackButton:u,shareParams:d}=e,{isMobile:S}=Ie(),[j,A]=a.useState(i),y=a.useCallback(L=>()=>window.open(L,"_blank","noopener,noreferrer"),[]),v=a.useCallback(L=>()=>{m(L),A(!0)},[m]),b=a.useCallback(()=>{I(),A(!1)},[I]);a.useEffect(()=>{const L=()=>{if(u){const M=u();return A(M)}return A(!1)};return addEventListener("hashchange",L),()=>removeEventListener("hashchange",L)});const w=t??(S?2:3);return o.jsxs(Z.Fragment,{children:[j&&o.jsx(It,{media:n,openIndex:h,onOpenImage:m,onClose:b,shareParams:d}),o.jsx(br,{variant:"masonry",cols:w,sx:{marginTop:2},children:n.map(({title:L,subtitle:M,thumbnailUrl:N,fullUrl:k,subtitleUrl:R},W)=>o.jsxs(Br,{style:{marginBottom:8},children:[o.jsx("img",{src:N,alt:L,style:{paddingBottom:M?60:48,cursor:"pointer"},onClick:v(W)}),(k==null?void 0:k.match(/youtube\.com/))&&o.jsx("img",{src:Fr,alt:L,style:{alignItems:"center",position:"absolute",top:"calc(50% - 65px)",left:"calc(50% - 40px)",width:80,height:80,cursor:"pointer"},onClick:y(k)}),o.jsx(Nr,{title:L,subtitle:M&&o.jsx("a",{href:R||wt[M],target:"_blank",rel:"noopener noreferrer",children:M}),actionIcon:k&&o.jsx(be,{title:"View Full Size",arrow:!0,disableFocusListener:!0,children:o.jsx(Ce,{href:k,style:{color:"rgba(255, 255, 255, 0.5)"},target:"_blank",rel:"noopener noreferrer",children:o.jsx(St,{})})})})]},W))})]})}function $r(){const{filters:e,filterCount:t,removeFilter:n,filterFieldsByFieldName:i}=a.useContext(te),h=a.useCallback((u,d)=>()=>{n(u,d)},[n]),m=a.useMemo(()=>{const{search:u,id:d,tab:S,name:j,sort:A,image:y,...v}=e;return Object.keys(v).map(b=>{const w=e[b];return Array.isArray(w)?w.map(L=>({key:b,value:L})):{key:b,value:w}}).flat()},[e]),I=a.useCallback((u,d)=>u==="Belt"?d==="Unranked"?u:d.includes("Black")?d.replace(/(Black)\s(\d+)/,"$1 Belt $2"):d+" Belt":u==="UL Group"?"Group "+d:u==="Wheels"?`${d} Wheels`:d,[]);return t===0?null:o.jsx(cr,{name:"Current Filters",style:{marginBottom:0},value:o.jsx(Ee,{direction:"row",spacing:0,sx:{flexWrap:"wrap"},style:{marginRight:-24},children:m.map(({key:u,value:d},S)=>{var j;return o.jsx(Ae,{label:`${I((j=i[u])==null?void 0:j.label,d)}`,variant:"outlined",style:{marginRight:4,marginBottom:4},onDelete:h(u,d)},S)})})})}var we={},Wr=_e;Object.defineProperty(we,"__esModule",{value:!0});var He=we.default=void 0,Ur=Wr(Oe()),zr=o;He=we.default=(0,Ur.default)((0,zr.jsx)("path",{d:"M5 13h14v-2H5zm-2 4h14v-2H3zM7 7v2h14V7z"}),"ClearAll");function qe({forceText:e}){const{isMobile:t}=Ie(),{filterCount:n,clearFilters:i}=a.useContext(te);return n===0?null:t&&!e?o.jsx(be,{title:"Clear Filters",arrow:!0,disableFocusListener:!0,children:o.jsx(Ce,{onClick:i,children:o.jsx(He,{})})}):o.jsx(Te,{variant:"outlined",color:"inherit",onClick:i,style:{minWidth:120},children:"Clear Filters"})}function Cn({profile:e={}}){const{userId:t}=Re(),{filters:n,filterCount:i,addFilter:h}=a.useContext(te),[m,I]=Z.useState(!1),u=a.useMemo(()=>Et(e),[e]),{collection:d=t&&i===0?"Any":null}=n,{isMobile:S}=Ie(),j=S?{maxWidth:700,borderRadius:0}:{maxWidth:700,marginLeft:"auto",marginRight:"auto",borderRadius:0};let A="";d&&(typeof d=="string"?A=d:A=d[0]);const y=a.useCallback(()=>I(!1),[]),v=a.useCallback(()=>I(!0),[]),b=a.useCallback(N=>{h("collection",N.target.value)},[h]);if(!i&&!t)return null;const w=typeof d=="string"&&(Me.includes(d)||d==="Any")&&i<2,L=e.displayName?e.displayName.toLowerCase().endsWith("s")?`${e.displayName}'`:`${e.displayName}'s`:"Private",M=t?`${L} Collection`:w?"My Collection":"Filters";return o.jsxs(ft,{style:j,sx:{paddingBottom:0,paddingTop:0},children:[o.jsx(gt,{title:M,action:o.jsx(qe,{})}),o.jsxs(mt,{style:{paddingTop:0,paddingLeft:8},children:[w&&o.jsx(De,{fullWidth:!0,size:"small",sx:{marginLeft:"8px",minWidth:80,maxWidth:300},children:o.jsx(Ne,{open:m,onClose:y,onOpen:v,value:A,onChange:b,style:{backgroundColor:"#222",fontSize:"1.1rem",fontWeight:500},children:Me.map((N,k)=>{var R;return o.jsxs(ue,{value:N,children:[N," (",N==="Any"?u.length:((R=e[N.toLowerCase()])==null?void 0:R.length)||0,")"]},k)})})}),!w&&o.jsx($r,{})]})]})}const Me=["Any",...Wt],Vr=ee("MuiBox",["root"]),Gr=Vr,Hr=pt(),qr=Mt({themeId:vt,defaultTheme:Hr,defaultClassName:Gr.root,generateClassName:xt.generate}),Qe=qr;var Se={},Qr=_e;Object.defineProperty(Se,"__esModule",{value:!0});var Ke=Se.default=void 0,Kr=Qr(Oe()),Xr=o;Ke=Se.default=(0,Kr.default)((0,Xr.jsx)("path",{d:"M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39c.51-.66.04-1.61-.79-1.61H5.04c-.83 0-1.3.95-.79 1.61"}),"FilterAlt");function Yr({label:e,fieldName:t,onFilter:n,sort:i}){const{visibleEntries:h}=a.useContext($e),{filters:m}=a.useContext(te),[I,u]=a.useState(!1),d=a.useCallback(L=>{u(!1),setTimeout(()=>n(t,L.target.value,!0),0),setTimeout(()=>document.activeElement.blur())},[t,n]),S=a.useCallback(()=>{u(!1),setTimeout(()=>document.activeElement.blur())},[]),j=a.useCallback(()=>u(!0),[]),{counts:A,options:y}=a.useMemo(()=>{const L=h.map(k=>k[t]).flat().filter(k=>k),M=L.reduce((k,R)=>(k[R]||(k[R]=0),k[R]++,k),{}),N=[...new Set(L)].sort((k,R)=>{if(i)return i(k,R);if(typeof k=="string"&&typeof R=="string")return k.localeCompare(R);if(Number.isInteger(k)&&Number.isInteger(R))return k-R});return{counts:M,options:N}},[t,h,i]),v=a.useDeferredValue(m),b=v[t],w=Array.isArray(b)?v[t]:b?[b]:[];return o.jsxs(De,{style:{minWidth:120,maxWidth:300,marginTop:4},fullWidth:!0,children:[o.jsx(kt,{id:`filter-${t}`,children:e}),o.jsx(Ne,{multiple:!0,label:e,labelId:`filter-${t}`,value:w,onChange:d,style:{marginBottom:8},open:I,onClose:S,onOpen:j,onBlur:S,MenuProps:{PaperProps:{style:{maxHeight:Jr*8+Zr}}},renderValue:L=>o.jsx(Qe,{sx:{display:"flex",flexWrap:"wrap",gap:.5},children:L.map(M=>o.jsx(Ae,{label:M},M))}),children:y.map((L,M)=>o.jsx(ue,{value:L,children:`${L} (${A[L]||0})`},M))})]})}const Jr=48,Zr=8;function An({onFiltersChanged:e,extraFilters:t=[]}){const{isLoggedIn:n}=a.useContext(ht),{beta:i}=a.useContext(yt),{filterCount:h,addFilters:m,filterFields:I}=a.useContext(te),[u,d]=a.useState(!1),S=a.useCallback(()=>d(!u),[u]);Lt("f",S);const j=a.useCallback(()=>d(!0),[]),A=a.useCallback(()=>d(!1),[]),y=a.useCallback((v,b)=>{m([{key:v,value:b},{key:"id",value:void 0},{key:"name",value:void 0},...t],!0),e&&e()},[m,e,t]);return o.jsxs(Z.Fragment,{children:[o.jsx(be,{title:"Filter",arrow:!0,disableFocusListener:!0,children:o.jsx(Ce,{color:"inherit",onClick:j,children:o.jsx(Bt,{badgeContent:h,color:"secondary",overlap:"circular",anchorOrigin:{vertical:"bottom",horizontal:"right"},children:o.jsx(Ke,{})})})}),o.jsxs(bt,{anchor:"right",open:u,onClose:A,children:[o.jsx(Be,{variant:"dense",onClick:A,children:o.jsx(Ct,{variant:"h6",children:"Filters"})}),o.jsx(Qe,{margin:1,children:o.jsx(Ee,{direction:"column",style:{minWidth:250},children:I.filter(v=>(!v.beta||i)&&(!v.userBased||n)).map((v,b)=>o.jsx(Yr,{...v,onFilter:y},b))})}),o.jsxs(Be,{variant:"dense",children:[o.jsx(qe,{forceText:!0,style:{marginRight:8}}),o.jsx(Te,{variant:"outlined",color:"inherit",onClick:A,children:"Done"})]})]})]})}export{vn as A,Qe as B,$e as D,te as F,Cn as I,$t as L,hn as a,xn as b,Ln as c,An as d,fn as e,mn as f,pn as g,Et as h,Pt as i,un as j,cn as k,dn as l,bn as m,cr as n,yn as o,gn as r,ln as u};
