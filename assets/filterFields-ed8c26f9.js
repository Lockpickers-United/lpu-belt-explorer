import{R as ie,a4 as ge,r as M,j as he,aO as xe,aP as te,al as le}from"./index-0570dab5.js";const me=ie.createContext({});function Se({children:E,filterFields:T=[]}){const[u,I]=ge(),C=M.useMemo(()=>Array.from(u.keys()).reduce((m,b)=>{const p=u.getAll(b);return m[b]=p.length===1?p[0]:p,m},{}),[u]),X=M.useCallback(h=>{Object.keys(h).forEach(m=>{h[m]||delete h[m]}),I(h)},[I]),V=M.useCallback((h,m)=>{h.forEach(({key:b,value:p})=>{!p&&m?u.delete(b):p?m?Array.isArray(p)?(u.delete(b),p.forEach(y=>u.append(b,y))):u.set(b,p):u.has(b)?u.append(b,p):u.set(b,p):p||u.delete(b)}),I(u)},[u,I]),Y=M.useCallback((h,m,b)=>V([{key:h,value:m}],b),[V]),G=M.useCallback(h=>{h.forEach(m=>u.delete(m)),I(u)},[u,I]),N=M.useCallback((h,m)=>{const b=u.getAll(h);u.delete(h),Array.isArray(b)&&b.length>1&&b.filter(y=>y!==m).forEach(y=>u.append(h,y)),I(u)},[u,I]),H=M.useCallback(()=>{const{tab:h,sort:m}=C;X({tab:h,sort:m})},[C,X]),K=M.useMemo(()=>Array.from(u.keys()).filter(m=>!be.includes(m)).length,[u]),O=!!(C!=null&&C.search),R=M.useMemo(()=>({filters:C,filterCount:K,addFilter:Y,addFilters:V,removeFilter:N,removeFilters:G,setFilters:X,clearFilters:H,filterFields:T,filterFieldsByFieldName:T.reduce((h,m)=>({...h,[m.fieldName]:m}),{id:{label:"ID"}}),isSearch:O}),[Y,V,H,K,C,N,G,X,T,O]);return he.jsx(me.Provider,{value:R,children:E})}const be=["id","name","search","tab","sort","image","locks","debug"];var se={exports:{}};(function(E){((T,u)=>{E.exports?E.exports=u():T.fuzzysort=u()})(xe,T=>{var u=(a,e)=>{if(a=="farzher")return{target:"farzher was here (^-^*)/",score:0,_indexes:[0]};if(!a||!e)return c;var n=H(a);B(e)||(e=N(e));var i=n.bitflags;return(i&e._bitflags)!==i?c:O(n,e)},I=(a,e,n)=>{if(a=="farzher")return[{target:"farzher was here (^-^*)/",score:0,_indexes:[0],obj:e?e[0]:c}];if(!a)return n&&n.all?K(a,e,n):ee;var i=H(a),t=i.bitflags;i.containsSpace;var l=n&&n.threshold||P,s=n&&n.limit||j,r=0,o=0,f=e.length;if(n&&n.key)for(var v=n.key,g=0;g<f;++g){var _=e[g],d=Z(_,v);if(d&&(B(d)||(d=N(d)),(t&d._bitflags)===t)){var A=O(i,d);A!==c&&(A.score<l||(A={target:A.target,_targetLower:"",_targetLowerCodes:c,_nextBeginningIndexes:c,_bitflags:0,score:A.score,_indexes:A._indexes,obj:_},r<s?(S.add(A),++r):(++o,A.score>S.peek().score&&S.replaceTop(A))))}}else if(n&&n.keys)for(var U=n.scoreFn||ce,W=n.keys,q=W.length,g=0;g<f;++g){for(var _=e[g],w=new Array(q),L=0;L<q;++L){var v=W[L],d=Z(_,v);if(!d){w[L]=c;continue}B(d)||(d=N(d)),(t&d._bitflags)!==t?w[L]=c:w[L]=O(i,d)}w.obj=_;var x=U(w);x!==c&&(x<l||(w.score=x,r<s?(S.add(w),++r):(++o,x>S.peek().score&&S.replaceTop(w))))}else for(var g=0;g<f;++g){var d=e[g];if(d&&(B(d)||(d=N(d)),(t&d._bitflags)===t)){var A=O(i,d);A!==c&&(A.score<l||(r<s?(S.add(A),++r):(++o,A.score>S.peek().score&&S.replaceTop(A))))}}if(r===0)return ee;for(var D=new Array(r),g=r-1;g>=0;--g)D[g]=S.poll();return D.total=r+o,D},C=(a,e,n)=>{if(typeof e=="function")return X(a,e);if(a===c)return c;e===void 0&&(e="<b>"),n===void 0&&(n="</b>");var i="",t=0,l=!1,s=a.target,r=s.length,o=a._indexes;o=o.slice(0,o.len).sort((g,_)=>g-_);for(var f=0;f<r;++f){var v=s[f];if(o[t]===f){if(++t,l||(l=!0,i+=e),t===o.length){i+=v+n+s.substr(f+1);break}}else l&&(l=!1,i+=n);i+=v}return i},X=(f,e)=>{if(f===c)return c;var n=f.target,i=n.length,t=f._indexes;t=t.slice(0,t.len).sort((_,d)=>_-d);for(var l="",s=0,r=0,o=!1,f=[],v=0;v<i;++v){var g=n[v];if(t[r]===v){if(++r,o||(o=!0,f.push(l),l=""),r===t.length){l+=g,f.push(e(l,s++)),l="",f.push(n.substr(v+1));break}}else o&&(o=!1,f.push(e(l,s++)),l="");l+=g}return f},V=a=>a._indexes.slice(0,a._indexes.len).sort((e,n)=>e-n),Y=a=>{typeof a!="string"&&(a="");var e=h(a);return{target:a,_targetLower:e._lower,_targetLowerCodes:e.lowerCodes,_nextBeginningIndexes:c,_bitflags:e.bitflags,score:c,_indexes:[0],obj:c}},G=a=>{typeof a!="string"&&(a=""),a=a.trim();var e=h(a),n=[];if(e.containsSpace){var i=a.split(/\s+/);i=[...new Set(i)];for(var t=0;t<i.length;t++)if(i[t]!==""){var l=h(i[t]);n.push({lowerCodes:l.lowerCodes,_lower:i[t].toLowerCase(),containsSpace:!1})}}return{lowerCodes:e.lowerCodes,bitflags:e.bitflags,containsSpace:e.containsSpace,_lower:e._lower,spaceSearches:n}},N=a=>{if(a.length>999)return Y(a);var e=y.get(a);return e!==void 0||(e=Y(a),y.set(a,e)),e},H=a=>{if(a.length>999)return G(a);var e=$.get(a);return e!==void 0||(e=G(a),$.set(a,e)),e},K=(a,e,n)=>{var i=[];i.total=e.length;var t=n&&n.limit||j;if(n&&n.key)for(var l=0;l<e.length;l++){var s=e[l],r=Z(s,n.key);if(r){B(r)||(r=N(r)),r.score=P,r._indexes.len=0;var o=r;if(o={target:o.target,_targetLower:"",_targetLowerCodes:c,_nextBeginningIndexes:c,_bitflags:0,score:r.score,_indexes:c,obj:s},i.push(o),i.length>=t)return i}}else if(n&&n.keys)for(var l=0;l<e.length;l++){for(var s=e[l],f=new Array(n.keys.length),v=n.keys.length-1;v>=0;--v){var r=Z(s,n.keys[v]);if(!r){f[v]=c;continue}B(r)||(r=N(r)),r.score=P,r._indexes.len=0,f[v]=r}if(f.obj=s,f.score=P,i.push(f),i.length>=t)return i}else for(var l=0;l<e.length;l++){var r=e[l];if(r&&(B(r)||(r=N(r)),r.score=P,r._indexes.len=0,i.push(r),i.length>=t))return i}return i},O=(a,e,n=!1)=>{if(n===!1&&a.containsSpace)return R(a,e);for(var i=a._lower,t=a.lowerCodes,l=t[0],s=e._targetLowerCodes,r=t.length,o=s.length,_=0,f=0,v=0;;){var g=l===s[f];if(g){if(z[v++]=f,++_,_===r)break;l=t[_]}if(++f,f>=o)return c}var _=0,d=!1,A=0,U=e._nextBeginningIndexes;U===c&&(U=e._nextBeginningIndexes=b(e.target)),f=z[0]===0?0:U[z[0]-1];var W=0;if(f!==o)for(;;)if(f>=o){if(_<=0||(++W,W>200))break;--_;var q=Q[--A];f=U[q]}else{var g=t[_]===s[f];if(g){if(Q[A++]=f,++_,_===r){d=!0;break}++f}else f=U[f]}var w=e._targetLower.indexOf(i,z[0]),L=~w;if(L&&!d)for(var x=0;x<v;++x)z[x]=w+x;var D=!1;L&&(D=e._nextBeginningIndexes[w-1]===w);{if(d)var k=Q,re=A;else var k=z,re=v;for(var F=0,ne=0,x=1;x<r;++x)k[x]-k[x-1]!==1&&(F-=k[x],++ne);var de=k[r-1]-k[0]-(r-1);if(F-=(12+de)*ne,k[0]!==0&&(F-=k[0]*k[0]*.2),!d)F*=1e3;else{for(var ae=1,x=U[0];x<o;x=U[x])++ae;ae>24&&(F*=(ae-24)*10)}L&&(F/=1+r*r*1),D&&(F/=1+r*r*1),F-=o-r,e.score=F;for(var x=0;x<re;++x)e._indexes[x]=k[x];return e._indexes.len=re,e}},R=(a,e)=>{for(var n=new Set,i=0,t=c,l=0,s=a.spaceSearches,v=0;v<s.length;++v){var r=s[v];if(t=O(r,e),t===c)return c;i+=t.score,t._indexes[0]<l&&(i-=l-t._indexes[0]),l=t._indexes[0];for(var o=0;o<t._indexes.len;++o)n.add(t._indexes[o])}var f=O(a,e,!0);if(f!==c&&f.score>i)return f;t.score=i;var v=0;for(let g of n)t._indexes[v++]=g;return t._indexes.len=v,t},h=a=>{for(var e=a.length,n=a.toLowerCase(),i=[],t=0,l=!1,s=0;s<e;++s){var r=i[s]=n.charCodeAt(s);if(r===32){l=!0;continue}var o=r>=97&&r<=122?r-97:r>=48&&r<=57?26:r<=127?30:31;t|=1<<o}return{lowerCodes:i,bitflags:t,containsSpace:l,_lower:n}},m=a=>{for(var e=a.length,n=[],i=0,t=!1,l=!1,s=0;s<e;++s){var r=a.charCodeAt(s),o=r>=65&&r<=90,f=o||r>=97&&r<=122||r>=48&&r<=57,v=o&&!t||!l||!f;t=o,l=f,v&&(n[i++]=s)}return n},b=a=>{for(var e=a.length,n=m(a),i=[],t=n[0],l=0,s=0;s<e;++s)t>s?i[s]=t:(t=n[++l],i[s]=t===void 0?e:t);return i},p=()=>{y.clear(),$.clear(),z=[],Q=[]},y=new Map,$=new Map,z=[],Q=[],ce=a=>{for(var e=P,n=a.length,i=0;i<n;++i){var t=a[i];if(t!==c){var l=t.score;l>e&&(e=l)}}return e===P?c:e},Z=(a,e)=>{var n=a[e];if(n!==void 0)return n;var i=e;Array.isArray(e)||(i=e.split("."));for(var t=i.length,l=-1;a&&++l<t;)a=a[i[l]];return a},B=a=>typeof a=="object",j=1/0,P=-j,ee=[];ee.total=0;var c=null,ue=a=>{var e=[],n=0,i={},t=l=>{for(var s=0,r=e[s],o=1;o<n;){var f=o+1;s=o,f<n&&e[f].score<e[o].score&&(s=f),e[s-1>>1]=e[s],o=1+(s<<1)}for(var v=s-1>>1;s>0&&r.score<e[v].score;v=(s=v)-1>>1)e[s]=e[v];e[s]=r};return i.add=l=>{var s=n;e[n++]=l;for(var r=s-1>>1;s>0&&l.score<e[r].score;r=(s=r)-1>>1)e[s]=e[r];e[s]=l},i.poll=l=>{if(n!==0){var s=e[0];return e[0]=e[--n],t(),s}},i.peek=l=>{if(n!==0)return e[0]},i.replaceTop=l=>{e[0]=l,t()},i},S=ue();return{single:u,go:I,highlight:C,prepare:Y,indexes:V,cleanup:p}})})(se);var _e=se.exports;const Le=te(_e),ke=ie.createContext({});var J={exports:{}},fe={À:"A",Á:"A",Â:"A",Ã:"A",Ä:"A",Å:"A",Ấ:"A",Ắ:"A",Ẳ:"A",Ẵ:"A",Ặ:"A",Æ:"AE",Ầ:"A",Ằ:"A",Ȃ:"A",Ả:"A",Ạ:"A",Ẩ:"A",Ẫ:"A",Ậ:"A",Ç:"C",Ḉ:"C",È:"E",É:"E",Ê:"E",Ë:"E",Ế:"E",Ḗ:"E",Ề:"E",Ḕ:"E",Ḝ:"E",Ȇ:"E",Ẻ:"E",Ẽ:"E",Ẹ:"E",Ể:"E",Ễ:"E",Ệ:"E",Ì:"I",Í:"I",Î:"I",Ï:"I",Ḯ:"I",Ȋ:"I",Ỉ:"I",Ị:"I",Ð:"D",Ñ:"N",Ò:"O",Ó:"O",Ô:"O",Õ:"O",Ö:"O",Ø:"O",Ố:"O",Ṍ:"O",Ṓ:"O",Ȏ:"O",Ỏ:"O",Ọ:"O",Ổ:"O",Ỗ:"O",Ộ:"O",Ờ:"O",Ở:"O",Ỡ:"O",Ớ:"O",Ợ:"O",Ù:"U",Ú:"U",Û:"U",Ü:"U",Ủ:"U",Ụ:"U",Ử:"U",Ữ:"U",Ự:"U",Ý:"Y",à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",ấ:"a",ắ:"a",ẳ:"a",ẵ:"a",ặ:"a",æ:"ae",ầ:"a",ằ:"a",ȃ:"a",ả:"a",ạ:"a",ẩ:"a",ẫ:"a",ậ:"a",ç:"c",ḉ:"c",è:"e",é:"e",ê:"e",ë:"e",ế:"e",ḗ:"e",ề:"e",ḕ:"e",ḝ:"e",ȇ:"e",ẻ:"e",ẽ:"e",ẹ:"e",ể:"e",ễ:"e",ệ:"e",ì:"i",í:"i",î:"i",ï:"i",ḯ:"i",ȋ:"i",ỉ:"i",ị:"i",ð:"d",ñ:"n",ò:"o",ó:"o",ô:"o",õ:"o",ö:"o",ø:"o",ố:"o",ṍ:"o",ṓ:"o",ȏ:"o",ỏ:"o",ọ:"o",ổ:"o",ỗ:"o",ộ:"o",ờ:"o",ở:"o",ỡ:"o",ớ:"o",ợ:"o",ù:"u",ú:"u",û:"u",ü:"u",ủ:"u",ụ:"u",ử:"u",ữ:"u",ự:"u",ý:"y",ÿ:"y",Ā:"A",ā:"a",Ă:"A",ă:"a",Ą:"A",ą:"a",Ć:"C",ć:"c",Ĉ:"C",ĉ:"c",Ċ:"C",ċ:"c",Č:"C",č:"c",C̆:"C",c̆:"c",Ď:"D",ď:"d",Đ:"D",đ:"d",Ē:"E",ē:"e",Ĕ:"E",ĕ:"e",Ė:"E",ė:"e",Ę:"E",ę:"e",Ě:"E",ě:"e",Ĝ:"G",Ǵ:"G",ĝ:"g",ǵ:"g",Ğ:"G",ğ:"g",Ġ:"G",ġ:"g",Ģ:"G",ģ:"g",Ĥ:"H",ĥ:"h",Ħ:"H",ħ:"h",Ḫ:"H",ḫ:"h",Ĩ:"I",ĩ:"i",Ī:"I",ī:"i",Ĭ:"I",ĭ:"i",Į:"I",į:"i",İ:"I",ı:"i",Ĳ:"IJ",ĳ:"ij",Ĵ:"J",ĵ:"j",Ķ:"K",ķ:"k",Ḱ:"K",ḱ:"k",K̆:"K",k̆:"k",Ĺ:"L",ĺ:"l",Ļ:"L",ļ:"l",Ľ:"L",ľ:"l",Ŀ:"L",ŀ:"l",Ł:"l",ł:"l",Ḿ:"M",ḿ:"m",M̆:"M",m̆:"m",Ń:"N",ń:"n",Ņ:"N",ņ:"n",Ň:"N",ň:"n",ŉ:"n",N̆:"N",n̆:"n",Ō:"O",ō:"o",Ŏ:"O",ŏ:"o",Ő:"O",ő:"o",Œ:"OE",œ:"oe",P̆:"P",p̆:"p",Ŕ:"R",ŕ:"r",Ŗ:"R",ŗ:"r",Ř:"R",ř:"r",R̆:"R",r̆:"r",Ȓ:"R",ȓ:"r",Ś:"S",ś:"s",Ŝ:"S",ŝ:"s",Ş:"S",Ș:"S",ș:"s",ş:"s",Š:"S",š:"s",Ţ:"T",ţ:"t",ț:"t",Ț:"T",Ť:"T",ť:"t",Ŧ:"T",ŧ:"t",T̆:"T",t̆:"t",Ũ:"U",ũ:"u",Ū:"U",ū:"u",Ŭ:"U",ŭ:"u",Ů:"U",ů:"u",Ű:"U",ű:"u",Ų:"U",ų:"u",Ȗ:"U",ȗ:"u",V̆:"V",v̆:"v",Ŵ:"W",ŵ:"w",Ẃ:"W",ẃ:"w",X̆:"X",x̆:"x",Ŷ:"Y",ŷ:"y",Ÿ:"Y",Y̆:"Y",y̆:"y",Ź:"Z",ź:"z",Ż:"Z",ż:"z",Ž:"Z",ž:"z",ſ:"s",ƒ:"f",Ơ:"O",ơ:"o",Ư:"U",ư:"u",Ǎ:"A",ǎ:"a",Ǐ:"I",ǐ:"i",Ǒ:"O",ǒ:"o",Ǔ:"U",ǔ:"u",Ǖ:"U",ǖ:"u",Ǘ:"U",ǘ:"u",Ǚ:"U",ǚ:"u",Ǜ:"U",ǜ:"u",Ứ:"U",ứ:"u",Ṹ:"U",ṹ:"u",Ǻ:"A",ǻ:"a",Ǽ:"AE",ǽ:"ae",Ǿ:"O",ǿ:"o",Þ:"TH",þ:"th",Ṕ:"P",ṕ:"p",Ṥ:"S",ṥ:"s",X́:"X",x́:"x",Ѓ:"Г",ѓ:"г",Ќ:"К",ќ:"к",A̋:"A",a̋:"a",E̋:"E",e̋:"e",I̋:"I",i̋:"i",Ǹ:"N",ǹ:"n",Ồ:"O",ồ:"o",Ṑ:"O",ṑ:"o",Ừ:"U",ừ:"u",Ẁ:"W",ẁ:"w",Ỳ:"Y",ỳ:"y",Ȁ:"A",ȁ:"a",Ȅ:"E",ȅ:"e",Ȉ:"I",ȉ:"i",Ȍ:"O",ȍ:"o",Ȑ:"R",ȑ:"r",Ȕ:"U",ȕ:"u",B̌:"B",b̌:"b",Č̣:"C",č̣:"c",Ê̌:"E",ê̌:"e",F̌:"F",f̌:"f",Ǧ:"G",ǧ:"g",Ȟ:"H",ȟ:"h",J̌:"J",ǰ:"j",Ǩ:"K",ǩ:"k",M̌:"M",m̌:"m",P̌:"P",p̌:"p",Q̌:"Q",q̌:"q",Ř̩:"R",ř̩:"r",Ṧ:"S",ṧ:"s",V̌:"V",v̌:"v",W̌:"W",w̌:"w",X̌:"X",x̌:"x",Y̌:"Y",y̌:"y",A̧:"A",a̧:"a",B̧:"B",b̧:"b",Ḑ:"D",ḑ:"d",Ȩ:"E",ȩ:"e",Ɛ̧:"E",ɛ̧:"e",Ḩ:"H",ḩ:"h",I̧:"I",i̧:"i",Ɨ̧:"I",ɨ̧:"i",M̧:"M",m̧:"m",O̧:"O",o̧:"o",Q̧:"Q",q̧:"q",U̧:"U",u̧:"u",X̧:"X",x̧:"x",Z̧:"Z",z̧:"z",й:"и",Й:"И",ё:"е",Ё:"Е"},oe=Object.keys(fe).join("|"),Ae=new RegExp(oe,"g"),pe=new RegExp(oe,"");function we(E){return fe[E]}var ve=function(E){return E.replace(Ae,we)},Ee=function(E){return!!E.match(pe)};J.exports=ve;J.exports.has=Ee;J.exports.remove=ve;var Ie=J.exports;const Ce=te(Ie),Oe=[{label:"Make",fieldName:"makes"},{label:"Locking Mechanism",fieldName:"lockingMechanisms"},{label:"Belt",fieldName:"belt",sort:le},{label:"Features",fieldName:"features"},{label:"Content",fieldName:"content"},{label:"Collection",fieldName:"collection",userBased:!0}],ye=[{label:"Make",fieldName:"make"},{label:"Wheels",fieldName:"wheels"},{label:"UL Group",fieldName:"group"},{label:"Quest Tier",fieldName:"tier"},{label:"Fence Type",fieldName:"fence"},{label:"Digits",fieldName:"digits"},{label:"Features",fieldName:"features"},{label:"Content",fieldName:"content"},{label:"Collection",fieldName:"collection",userBased:!0}],Ue=[{label:"Type",fieldName:"type"},{label:"Make",fieldName:"makes"},{label:"Locking Mechanism",fieldName:"lockingMechanisms"},{label:"Belt",fieldName:"belt",sort:le},{label:"Features",fieldName:"features"},{label:"Documentation",fieldName:"documentation"},{label:"Scoring",fieldName:"scoring"}];export{ke as D,me as F,Se as a,ye as d,Le as f,Oe as l,Ce as r,Ue as s};
