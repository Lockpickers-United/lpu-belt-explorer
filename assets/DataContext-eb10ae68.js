import{aK as vr,aL as tr,R as sr}from"./index-358cf55c.js";var W={exports:{}};(function(q){((G,B)=>{q.exports?q.exports=B():G.fuzzysort=B()})(vr,G=>{var B=(a,r)=>{if(a=="farzher")return{target:"farzher was here (^-^*)/",score:0,_indexes:[0]};if(!a||!r)return g;var n=J(a);y(r)||(r=I(r));var i=n.bitflags;return(i&r._bitflags)!==i?g:z(n,r)},Y=(a,r,n)=>{if(a=="farzher")return[{target:"farzher was here (^-^*)/",score:0,_indexes:[0],obj:r?r[0]:g}];if(!a)return n&&n.all?j(a,r,n):V;var i=J(a),f=i.bitflags;i.containsSpace;var v=n&&n.threshold||k,t=n&&n.limit||K,e=0,l=0,s=r.length;if(n&&n.key)for(var o=n.key,u=0;u<s;++u){var x=r[u],c=N(x,o);if(c&&(y(c)||(c=I(c)),(f&c._bitflags)===f)){var _=z(i,c);_!==g&&(_.score<v||(_={target:_.target,_targetLower:"",_targetLowerCodes:g,_nextBeginningIndexes:g,_bitflags:0,score:_.score,_indexes:_._indexes,obj:x},e<t?(w.add(_),++e):(++l,_.score>w.peek().score&&w.replaceTop(_))))}}else if(n&&n.keys)for(var S=n.scoreFn||nr,A=n.keys,P=A.length,u=0;u<s;++u){for(var x=r[u],h=new Array(P),L=0;L<P;++L){var o=A[L],c=N(x,o);if(!c){h[L]=g;continue}y(c)||(c=I(c)),(f&c._bitflags)!==f?h[L]=g:h[L]=z(i,c)}h.obj=x;var d=S(h);d!==g&&(d<v||(h.score=d,e<t?(w.add(h),++e):(++l,d>w.peek().score&&w.replaceTop(h))))}else for(var u=0;u<s;++u){var c=r[u];if(c&&(y(c)||(c=I(c)),(f&c._bitflags)===f)){var _=z(i,c);_!==g&&(_.score<v||(e<t?(w.add(_),++e):(++l,_.score>w.peek().score&&w.replaceTop(_))))}}if(e===0)return V;for(var C=new Array(e),u=e-1;u>=0;--u)C[u]=w.poll();return C.total=e+l,C},Z=(a,r,n)=>{if(typeof r=="function")return U(a,r);if(a===g)return g;r===void 0&&(r="<b>"),n===void 0&&(n="</b>");var i="",f=0,v=!1,t=a.target,e=t.length,l=a._indexes;l=l.slice(0,l.len).sort((u,x)=>u-x);for(var s=0;s<e;++s){var o=t[s];if(l[f]===s){if(++f,v||(v=!0,i+=r),f===l.length){i+=o+n+t.substr(s+1);break}}else v&&(v=!1,i+=n);i+=o}return i},U=(s,r)=>{if(s===g)return g;var n=s.target,i=n.length,f=s._indexes;f=f.slice(0,f.len).sort((x,c)=>x-c);for(var v="",t=0,e=0,l=!1,s=[],o=0;o<i;++o){var u=n[o];if(f[e]===o){if(++e,l||(l=!0,s.push(v),v=""),e===f.length){v+=u,s.push(r(v,t++)),v="",s.push(n.substr(o+1));break}}else l&&(l=!1,s.push(r(v,t++)),v="");v+=u}return s},O=a=>a._indexes.slice(0,a._indexes.len).sort((r,n)=>r-n),F=a=>{typeof a!="string"&&(a="");var r=M(a);return{target:a,_targetLower:r._lower,_targetLowerCodes:r.lowerCodes,_nextBeginningIndexes:g,_bitflags:r.bitflags,score:g,_indexes:[0],obj:g}},H=a=>{typeof a!="string"&&(a=""),a=a.trim();var r=M(a),n=[];if(r.containsSpace){var i=a.split(/\s+/);i=[...new Set(i)];for(var f=0;f<i.length;f++)if(i[f]!==""){var v=M(i[f]);n.push({lowerCodes:v.lowerCodes,_lower:i[f].toLowerCase(),containsSpace:!1})}}return{lowerCodes:r.lowerCodes,bitflags:r.bitflags,containsSpace:r.containsSpace,_lower:r._lower,spaceSearches:n}},I=a=>{if(a.length>999)return F(a);var r=D.get(a);return r!==void 0||(r=F(a),D.set(a,r)),r},J=a=>{if(a.length>999)return H(a);var r=E.get(a);return r!==void 0||(r=H(a),E.set(a,r)),r},j=(a,r,n)=>{var i=[];i.total=r.length;var f=n&&n.limit||K;if(n&&n.key)for(var v=0;v<r.length;v++){var t=r[v],e=N(t,n.key);if(e){y(e)||(e=I(e)),e.score=k,e._indexes.len=0;var l=e;if(l={target:l.target,_targetLower:"",_targetLowerCodes:g,_nextBeginningIndexes:g,_bitflags:0,score:e.score,_indexes:g,obj:t},i.push(l),i.length>=f)return i}}else if(n&&n.keys)for(var v=0;v<r.length;v++){for(var t=r[v],s=new Array(n.keys.length),o=n.keys.length-1;o>=0;--o){var e=N(t,n.keys[o]);if(!e){s[o]=g;continue}y(e)||(e=I(e)),e.score=k,e._indexes.len=0,s[o]=e}if(s.obj=t,s.score=k,i.push(s),i.length>=f)return i}else for(var v=0;v<r.length;v++){var e=r[v];if(e&&(y(e)||(e=I(e)),e.score=k,e._indexes.len=0,i.push(e),i.length>=f))return i}return i},z=(a,r,n=!1)=>{if(n===!1&&a.containsSpace)return R(a,r);for(var i=a._lower,f=a.lowerCodes,v=f[0],t=r._targetLowerCodes,e=f.length,l=t.length,x=0,s=0,o=0;;){var u=v===t[s];if(u){if(m[o++]=s,++x,x===e)break;v=f[x]}if(++s,s>=l)return g}var x=0,c=!1,_=0,S=r._nextBeginningIndexes;S===g&&(S=r._nextBeginningIndexes=er(r.target)),s=m[0]===0?0:S[m[0]-1];var A=0;if(s!==l)for(;;)if(s>=l){if(x<=0||(++A,A>200))break;--x;var P=T[--_];s=S[P]}else{var u=f[x]===t[s];if(u){if(T[_++]=s,++x,x===e){c=!0;break}++s}else s=S[s]}var h=r._targetLower.indexOf(i,m[0]),L=~h;if(L&&!c)for(var d=0;d<o;++d)m[d]=h+d;var C=!1;L&&(C=r._nextBeginningIndexes[h-1]===h);{if(c)var b=T,X=_;else var b=m,X=o;for(var p=0,Q=0,d=1;d<e;++d)b[d]-b[d-1]!==1&&(p-=b[d],++Q);var fr=b[e-1]-b[0]-(e-1);if(p-=(12+fr)*Q,b[0]!==0&&(p-=b[0]*b[0]*.2),!c)p*=1e3;else{for(var $=1,d=S[0];d<l;d=S[d])++$;$>24&&(p*=($-24)*10)}L&&(p/=1+e*e*1),C&&(p/=1+e*e*1),p-=l-e,r.score=p;for(var d=0;d<X;++d)r._indexes[d]=b[d];return r._indexes.len=X,r}},R=(a,r)=>{for(var n=new Set,i=0,f=g,v=0,t=a.spaceSearches,o=0;o<t.length;++o){var e=t[o];if(f=z(e,r),f===g)return g;i+=f.score,f._indexes[0]<v&&(i-=v-f._indexes[0]),v=f._indexes[0];for(var l=0;l<f._indexes.len;++l)n.add(f._indexes[l])}var s=z(a,r,!0);if(s!==g&&s.score>i)return s;f.score=i;var o=0;for(let u of n)f._indexes[o++]=u;return f._indexes.len=o,f},M=a=>{for(var r=a.length,n=a.toLowerCase(),i=[],f=0,v=!1,t=0;t<r;++t){var e=i[t]=n.charCodeAt(t);if(e===32){v=!0;continue}var l=e>=97&&e<=122?e-97:e>=48&&e<=57?26:e<=127?30:31;f|=1<<l}return{lowerCodes:i,bitflags:f,containsSpace:v,_lower:n}},rr=a=>{for(var r=a.length,n=[],i=0,f=!1,v=!1,t=0;t<r;++t){var e=a.charCodeAt(t),l=e>=65&&e<=90,s=l||e>=97&&e<=122||e>=48&&e<=57,o=l&&!f||!v||!s;f=l,v=s,o&&(n[i++]=t)}return n},er=a=>{for(var r=a.length,n=rr(a),i=[],f=n[0],v=0,t=0;t<r;++t)f>t?i[t]=f:(f=n[++v],i[t]=f===void 0?r:f);return i},ar=()=>{D.clear(),E.clear(),m=[],T=[]},D=new Map,E=new Map,m=[],T=[],nr=a=>{for(var r=k,n=a.length,i=0;i<n;++i){var f=a[i];if(f!==g){var v=f.score;v>r&&(r=v)}}return r===k?g:r},N=(a,r)=>{var n=a[r];if(n!==void 0)return n;var i=r;Array.isArray(r)||(i=r.split("."));for(var f=i.length,v=-1;a&&++v<f;)a=a[i[v]];return a},y=a=>typeof a=="object",K=1/0,k=-K,V=[];V.total=0;var g=null,ir=a=>{var r=[],n=0,i={},f=v=>{for(var t=0,e=r[t],l=1;l<n;){var s=l+1;t=l,s<n&&r[s].score<r[l].score&&(t=s),r[t-1>>1]=r[t],l=1+(t<<1)}for(var o=t-1>>1;t>0&&e.score<r[o].score;o=(t=o)-1>>1)r[t]=r[o];r[t]=e};return i.add=v=>{var t=n;r[n++]=v;for(var e=t-1>>1;t>0&&v.score<r[e].score;e=(t=e)-1>>1)r[t]=r[e];r[t]=v},i.poll=v=>{if(n!==0){var t=r[0];return r[0]=r[--n],f(),t}},i.peek=v=>{if(n!==0)return r[0]},i.replaceTop=v=>{r[0]=v,f()},i},w=ir();return{single:B,go:Y,highlight:Z,prepare:F,indexes:O,cleanup:ar}})})(W);var lr=W.exports;const gr=tr(lr),cr=sr.createContext({});export{cr as D,gr as f};
