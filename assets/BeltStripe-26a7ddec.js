import{ai as ve,bk as be,aH as le,aG as Ae,R as ae,U as we,r as Y,j as re,ag as ce}from"./index-c20bd96b.js";const $e=[{label:"Make",fieldName:"makes"},{label:"Locking Mechanism",fieldName:"lockingMechanisms"},{label:"Belt",fieldName:"belt",sort:ve},{label:"Features",fieldName:"features"},{label:"Content",fieldName:"content"},{label:"Collection",fieldName:"collection",userBased:!0}],Ve=[{label:"Make",fieldName:"make"},{label:"Wheels",fieldName:"wheels"},{label:"UL Group",fieldName:"group"},{label:"Quest Tier",fieldName:"tier"},{label:"Fence Type",fieldName:"fence"},{label:"Digits",fieldName:"digits"},{label:"Features",fieldName:"features"},{label:"Content",fieldName:"content"},{label:"Collection",fieldName:"collection",userBased:!0}],qe=[{label:"Make",fieldName:"makes"},{label:"Locking Mechanism",fieldName:"lockingMechanisms"},{label:"Belt",fieldName:"belt",sort:ve},{label:"Features",fieldName:"features"},{label:"Documentation",fieldName:"documentation"},{label:"Scoring",fieldName:"scoring"}];var ne={exports:{}};const H=new Uint32Array(65536),_e=(v,A)=>{const f=v.length,p=A.length,w=1<<f-1;let g=-1,b=0,E=f,u=f;for(;u--;)H[v.charCodeAt(u)]|=1<<u;for(u=0;u<p;u++){let m=H[A.charCodeAt(u)];const I=m|b;m|=(m&g)+g^g,b|=~(m|g),g&=m,b&w&&E++,g&w&&E--,b=b<<1|1,g=g<<1|~(I|b),b&=I}for(u=f;u--;)H[v.charCodeAt(u)]=0;return E},ke=(v,A)=>{const f=A.length,p=v.length,w=[],g=[],b=Math.ceil(f/32),E=Math.ceil(p/32);for(let t=0;t<b;t++)g[t]=-1,w[t]=0;let u=0;for(;u<E-1;u++){let t=0,d=-1;const _=u*32,U=Math.min(32,p)+_;for(let C=_;C<U;C++)H[v.charCodeAt(C)]|=1<<C;for(let C=0;C<f;C++){const V=H[A.charCodeAt(C)],B=g[C/32|0]>>>C&1,P=w[C/32|0]>>>C&1,J=V|t,K=((V|P)&d)+d^d|V|P;let T=t|~(K|d),W=d&K;T>>>31^B&&(g[C/32|0]^=1<<C),W>>>31^P&&(w[C/32|0]^=1<<C),T=T<<1|B,W=W<<1|P,d=W|~(J|T),t=T&J}for(let C=_;C<U;C++)H[v.charCodeAt(C)]=0}let m=0,I=-1;const M=u*32,O=Math.min(32,p-M)+M;for(let t=M;t<O;t++)H[v.charCodeAt(t)]|=1<<t;let k=p;for(let t=0;t<f;t++){const d=H[A.charCodeAt(t)],_=g[t/32|0]>>>t&1,U=w[t/32|0]>>>t&1,C=d|m,V=((d|U)&I)+I^I|d|U;let B=m|~(V|I),P=I&V;k+=B>>>p-1&1,k-=P>>>p-1&1,B>>>31^_&&(g[t/32|0]^=1<<t),P>>>31^U&&(w[t/32|0]^=1<<t),B=B<<1|_,P=P<<1|U,I=P|~(C|B),m=B&C}for(let t=M;t<O;t++)H[v.charCodeAt(t)]=0;return k},ue=(v,A)=>{if(v.length<A.length){const f=A;A=v,v=f}return A.length===0?v.length:v.length<=32?_e(v,A):ke(v,A)},Ce=(v,A)=>{let f=1/0,p=0;for(let w=0;w<A.length;w++){const g=ue(v,A[w]);g<f&&(f=g,p=w)}return A[p]},Ne=Object.freeze(Object.defineProperty({__proto__:null,closest:Ce,distance:ue},Symbol.toStringTag,{value:"Module"})),Ee=be(Ne);ne.exports;(function(v,A){(function(){var f;try{f=typeof Intl<"u"&&typeof Intl.Collator<"u"?Intl.Collator("generic",{sensitivity:"base"}):null}catch{console.log("Collator could not be initialized and wouldn't be used")}var p=Ee,w=[],g=[],b={get:function(E,u,m){var I=m&&f&&m.useCollator;if(I){var M=E.length,O=u.length;if(M===0)return O;if(O===0)return M;var k,t,d,_,U;for(d=0;d<O;++d)w[d]=d,g[d]=u.charCodeAt(d);w[O]=O;var C;for(d=0;d<M;++d){for(t=d+1,_=0;_<O;++_)k=t,C=f.compare(E.charAt(d),String.fromCharCode(g[_]))===0,t=w[_]+(C?0:1),U=k+1,t>U&&(t=U),U=w[_+1]+1,t>U&&(t=U),w[_]=k;w[_]=t}return t}return p.distance(E,u)}};v!==null&&v.exports===A?v.exports=b:typeof self<"u"&&typeof self.postMessage=="function"&&typeof self.importScripts=="function"?self.Levenshtein=b:typeof window<"u"&&window!==null&&(window.Levenshtein=b)})()})(ne,ne.exports);var Ie=ne.exports;const Se=le(Ie);function Xe(v,A="short",f={}){let p=v.makeModels;const w=f.includeVersion&&v.version?" ("+v.version+")":"";if(f.matchTo){const g=f.matchTo.match(/^([&/\w\s+.'-]+)/),b=g?g[1]:f.matchTo,E=p.reduce((u,{make:m,model:I})=>{let M=I;m&&m!==I&&(M=m.concat(" ").concat(I));const O=Se.get(b.toLowerCase(),M.toLowerCase());return u.min===void 0||O<u.min?(u.min=O,u.winners=[{make:m,model:I}]):O===u.min&&(u.winners=[...u.winners,{make:m,model:I}]),u},{});if(E.winners.length===1){const{make:u,model:m}=E.winners[0];return u&&u!==m?u.concat(" ").concat(m):m}}if(A==="long")return p.map(b=>b.make+" "+b.model).join(" / ")+w;if(A==="data"){const g=p.map(E=>E.make).join(","),b=p.map(E=>E.model).join(",");return`${g}	${b}`+w}else return A==="array"?[p.map(g=>g.make).join(","),p.map(g=>g.model).join(",")]:A==="dial"?v.make&&v.model?`${v.make} ${v.model}`:v.model:p.reduce((b,{make:E,model:u})=>{var O;const m=E||u,I=E?u:"";let M=`${m} ${I}`;return((O=b.last)==null?void 0:O.group)===m?M=`, ${I}`:b.last&&(M=" / "+M),{lockName:b.lockName+M,last:{group:m,item:I}}},{lockName:""}).lockName+w}var de={exports:{}};(function(v){((A,f)=>{v.exports?v.exports=f():A.fuzzysort=f()})(Ae,A=>{var f=(n,e)=>{if(n=="farzher")return{target:"farzher was here (^-^*)/",score:0,_indexes:[0]};if(!n||!e)return N;var a=I(n);T(e)||(e=m(e));var i=a.bitflags;return(i&e._bitflags)!==i?N:O(a,e)},p=(n,e,a)=>{if(n=="farzher")return[{target:"farzher was here (^-^*)/",score:0,_indexes:[0],obj:e?e[0]:N}];if(!n)return a&&a.all?M(n,e,a):ie;var i=I(n),s=i.bitflags;i.containsSpace;var o=a&&a.threshold||Q,l=a&&a.limit||W,r=0,h=0,c=e.length;if(a&&a.key)for(var x=a.key,y=0;y<c;++y){var F=e[y],S=K(F,x);if(S&&(T(S)||(S=m(S)),(s&S._bitflags)===s)){var z=O(i,S);z!==N&&(z.score<o||(z={target:z.target,_targetLower:"",_targetLowerCodes:N,_nextBeginningIndexes:N,_bitflags:0,score:z.score,_indexes:z._indexes,obj:F},r<l?(q.add(z),++r):(++h,z.score>q.peek().score&&q.replaceTop(z))))}}else if(a&&a.keys)for(var j=a.scoreFn||J,Z=a.keys,ee=Z.length,y=0;y<c;++y){for(var F=e[y],$=new Array(ee),X=0;X<ee;++X){var x=Z[X],S=K(F,x);if(!S){$[X]=N;continue}T(S)||(S=m(S)),(s&S._bitflags)!==s?$[X]=N:$[X]=O(i,S)}$.obj=F;var L=j($);L!==N&&(L<o||($.score=L,r<l?(q.add($),++r):(++h,L>q.peek().score&&q.replaceTop($))))}else for(var y=0;y<c;++y){var S=e[y];if(S&&(T(S)||(S=m(S)),(s&S._bitflags)===s)){var z=O(i,S);z!==N&&(z.score<o||(r<l?(q.add(z),++r):(++h,z.score>q.peek().score&&q.replaceTop(z))))}}if(r===0)return ie;for(var R=new Array(r),y=r-1;y>=0;--y)R[y]=q.poll();return R.total=r+h,R},w=(n,e,a)=>{if(typeof e=="function")return g(n,e);if(n===N)return N;e===void 0&&(e="<b>"),a===void 0&&(a="</b>");var i="",s=0,o=!1,l=n.target,r=l.length,h=n._indexes;h=h.slice(0,h.len).sort((y,F)=>y-F);for(var c=0;c<r;++c){var x=l[c];if(h[s]===c){if(++s,o||(o=!0,i+=e),s===h.length){i+=x+a+l.substr(c+1);break}}else o&&(o=!1,i+=a);i+=x}return i},g=(c,e)=>{if(c===N)return N;var a=c.target,i=a.length,s=c._indexes;s=s.slice(0,s.len).sort((F,S)=>F-S);for(var o="",l=0,r=0,h=!1,c=[],x=0;x<i;++x){var y=a[x];if(s[r]===x){if(++r,h||(h=!0,c.push(o),o=""),r===s.length){o+=y,c.push(e(o,l++)),o="",c.push(a.substr(x+1));break}}else h&&(h=!1,c.push(e(o,l++)),o="");o+=y}return c},b=n=>n._indexes.slice(0,n._indexes.len).sort((e,a)=>e-a),E=n=>{typeof n!="string"&&(n="");var e=t(n);return{target:n,_targetLower:e._lower,_targetLowerCodes:e.lowerCodes,_nextBeginningIndexes:N,_bitflags:e.bitflags,score:N,_indexes:[0],obj:N}},u=n=>{typeof n!="string"&&(n=""),n=n.trim();var e=t(n),a=[];if(e.containsSpace){var i=n.split(/\s+/);i=[...new Set(i)];for(var s=0;s<i.length;s++)if(i[s]!==""){var o=t(i[s]);a.push({lowerCodes:o.lowerCodes,_lower:i[s].toLowerCase(),containsSpace:!1})}}return{lowerCodes:e.lowerCodes,bitflags:e.bitflags,containsSpace:e.containsSpace,_lower:e._lower,spaceSearches:a}},m=n=>{if(n.length>999)return E(n);var e=C.get(n);return e!==void 0||(e=E(n),C.set(n,e)),e},I=n=>{if(n.length>999)return u(n);var e=V.get(n);return e!==void 0||(e=u(n),V.set(n,e)),e},M=(n,e,a)=>{var i=[];i.total=e.length;var s=a&&a.limit||W;if(a&&a.key)for(var o=0;o<e.length;o++){var l=e[o],r=K(l,a.key);if(r){T(r)||(r=m(r)),r.score=Q,r._indexes.len=0;var h=r;if(h={target:h.target,_targetLower:"",_targetLowerCodes:N,_nextBeginningIndexes:N,_bitflags:0,score:r.score,_indexes:N,obj:l},i.push(h),i.length>=s)return i}}else if(a&&a.keys)for(var o=0;o<e.length;o++){for(var l=e[o],c=new Array(a.keys.length),x=a.keys.length-1;x>=0;--x){var r=K(l,a.keys[x]);if(!r){c[x]=N;continue}T(r)||(r=m(r)),r.score=Q,r._indexes.len=0,c[x]=r}if(c.obj=l,c.score=Q,i.push(c),i.length>=s)return i}else for(var o=0;o<e.length;o++){var r=e[o];if(r&&(T(r)||(r=m(r)),r.score=Q,r._indexes.len=0,i.push(r),i.length>=s))return i}return i},O=(n,e,a=!1)=>{if(a===!1&&n.containsSpace)return k(n,e);for(var i=n._lower,s=n.lowerCodes,o=s[0],l=e._targetLowerCodes,r=s.length,h=l.length,F=0,c=0,x=0;;){var y=o===l[c];if(y){if(B[x++]=c,++F,F===r)break;o=s[F]}if(++c,c>=h)return N}var F=0,S=!1,z=0,j=e._nextBeginningIndexes;j===N&&(j=e._nextBeginningIndexes=_(e.target)),c=B[0]===0?0:j[B[0]-1];var Z=0;if(c!==h)for(;;)if(c>=h){if(F<=0||(++Z,Z>200))break;--F;var ee=P[--z];c=j[ee]}else{var y=s[F]===l[c];if(y){if(P[z++]=c,++F,F===r){S=!0;break}++c}else c=j[c]}var $=e._targetLower.indexOf(i,B[0]),X=~$;if(X&&!S)for(var L=0;L<x;++L)B[L]=$+L;var R=!1;X&&(R=e._nextBeginningIndexes[$-1]===$);{if(S)var G=P,se=z;else var G=B,se=x;for(var D=0,fe=0,L=1;L<r;++L)G[L]-G[L-1]!==1&&(D-=G[L],++fe);var pe=G[r-1]-G[0]-(r-1);if(D-=(12+pe)*fe,G[0]!==0&&(D-=G[0]*G[0]*.2),!S)D*=1e3;else{for(var oe=1,L=j[0];L<h;L=j[L])++oe;oe>24&&(D*=(oe-24)*10)}X&&(D/=1+r*r*1),R&&(D/=1+r*r*1),D-=h-r,e.score=D;for(var L=0;L<se;++L)e._indexes[L]=G[L];return e._indexes.len=se,e}},k=(n,e)=>{for(var a=new Set,i=0,s=N,o=0,l=n.spaceSearches,x=0;x<l.length;++x){var r=l[x];if(s=O(r,e),s===N)return N;i+=s.score,s._indexes[0]<o&&(i-=o-s._indexes[0]),o=s._indexes[0];for(var h=0;h<s._indexes.len;++h)a.add(s._indexes[h])}var c=O(n,e,!0);if(c!==N&&c.score>i)return c;s.score=i;var x=0;for(let y of a)s._indexes[x++]=y;return s._indexes.len=x,s},t=n=>{for(var e=n.length,a=n.toLowerCase(),i=[],s=0,o=!1,l=0;l<e;++l){var r=i[l]=a.charCodeAt(l);if(r===32){o=!0;continue}var h=r>=97&&r<=122?r-97:r>=48&&r<=57?26:r<=127?30:31;s|=1<<h}return{lowerCodes:i,bitflags:s,containsSpace:o,_lower:a}},d=n=>{for(var e=n.length,a=[],i=0,s=!1,o=!1,l=0;l<e;++l){var r=n.charCodeAt(l),h=r>=65&&r<=90,c=h||r>=97&&r<=122||r>=48&&r<=57,x=h&&!s||!o||!c;s=h,o=c,x&&(a[i++]=l)}return a},_=n=>{for(var e=n.length,a=d(n),i=[],s=a[0],o=0,l=0;l<e;++l)s>l?i[l]=s:(s=a[++o],i[l]=s===void 0?e:s);return i},U=()=>{C.clear(),V.clear(),B=[],P=[]},C=new Map,V=new Map,B=[],P=[],J=n=>{for(var e=Q,a=n.length,i=0;i<a;++i){var s=n[i];if(s!==N){var o=s.score;o>e&&(e=o)}}return e===Q?N:e},K=(n,e)=>{var a=n[e];if(a!==void 0)return a;var i=e;Array.isArray(e)||(i=e.split("."));for(var s=i.length,o=-1;n&&++o<s;)n=n[i[o]];return n},T=n=>typeof n=="object",W=1/0,Q=-W,ie=[];ie.total=0;var N=null,xe=n=>{var e=[],a=0,i={},s=o=>{for(var l=0,r=e[l],h=1;h<a;){var c=h+1;l=h,c<a&&e[c].score<e[h].score&&(l=c),e[l-1>>1]=e[l],h=1+(l<<1)}for(var x=l-1>>1;l>0&&r.score<e[x].score;x=(l=x)-1>>1)e[l]=e[x];e[l]=r};return i.add=o=>{var l=a;e[a++]=o;for(var r=l-1>>1;l>0&&o.score<e[r].score;r=(l=r)-1>>1)e[l]=e[r];e[l]=o},i.poll=o=>{if(a!==0){var l=e[0];return e[0]=e[--a],s(),l}},i.peek=o=>{if(a!==0)return e[0]},i.replaceTop=o=>{e[0]=o,s()},i},q=xe();return{single:f,go:p,highlight:w,prepare:E,indexes:b,cleanup:U}})})(de);var ye=de.exports;const Ge=le(ye),Ye=ae.createContext({}),Oe=ae.createContext({});function je({children:v,filterFields:A=[]}){const[f,p]=we(),w=Y.useMemo(()=>Array.from(f.keys()).reduce((t,d)=>{const _=f.getAll(d);return t[d]=_.length===1?_[0]:_,t},{}),[f]),g=Y.useCallback(k=>{Object.keys(k).forEach(t=>{k[t]||delete k[t]}),p(k)},[p]),b=Y.useCallback((k,t)=>{k.forEach(({key:d,value:_})=>{!_&&t?f.delete(d):_?t?Array.isArray(_)?(f.delete(d),_.forEach(U=>f.append(d,U))):f.set(d,_):f.has(d)?f.append(d,_):f.set(d,_):_||f.delete(d)}),p(f)},[f,p]),E=Y.useCallback((k,t,d)=>b([{key:k,value:t}],d),[b]),u=Y.useCallback(k=>{k.forEach(t=>f.delete(t)),p(f)},[f,p]),m=Y.useCallback((k,t)=>{const d=f.getAll(k);f.delete(k),Array.isArray(d)&&d.length>1&&d.filter(U=>U!==t).forEach(U=>f.append(k,U)),p(f)},[f,p]),I=Y.useCallback(()=>{const{tab:k,sort:t}=w;g({tab:k,sort:t})},[w,g]),M=Y.useMemo(()=>Array.from(f.keys()).filter(t=>!Le.includes(t)).length,[f]),O=Y.useMemo(()=>({filters:w,filterCount:M,addFilter:E,addFilters:b,removeFilter:m,removeFilters:u,setFilters:g,clearFilters:I,filterFields:A,filterFieldsByFieldName:A.reduce((k,t)=>({...k,[t.fieldName]:t}),{id:{label:"ID"}})}),[E,b,I,M,w,m,u,g,A]);return re.jsx(Oe.Provider,{value:O,children:v})}const Le=["id","name","search","tab","sort","image"];var te={exports:{}},he={À:"A",Á:"A",Â:"A",Ã:"A",Ä:"A",Å:"A",Ấ:"A",Ắ:"A",Ẳ:"A",Ẵ:"A",Ặ:"A",Æ:"AE",Ầ:"A",Ằ:"A",Ȃ:"A",Ả:"A",Ạ:"A",Ẩ:"A",Ẫ:"A",Ậ:"A",Ç:"C",Ḉ:"C",È:"E",É:"E",Ê:"E",Ë:"E",Ế:"E",Ḗ:"E",Ề:"E",Ḕ:"E",Ḝ:"E",Ȇ:"E",Ẻ:"E",Ẽ:"E",Ẹ:"E",Ể:"E",Ễ:"E",Ệ:"E",Ì:"I",Í:"I",Î:"I",Ï:"I",Ḯ:"I",Ȋ:"I",Ỉ:"I",Ị:"I",Ð:"D",Ñ:"N",Ò:"O",Ó:"O",Ô:"O",Õ:"O",Ö:"O",Ø:"O",Ố:"O",Ṍ:"O",Ṓ:"O",Ȏ:"O",Ỏ:"O",Ọ:"O",Ổ:"O",Ỗ:"O",Ộ:"O",Ờ:"O",Ở:"O",Ỡ:"O",Ớ:"O",Ợ:"O",Ù:"U",Ú:"U",Û:"U",Ü:"U",Ủ:"U",Ụ:"U",Ử:"U",Ữ:"U",Ự:"U",Ý:"Y",à:"a",á:"a",â:"a",ã:"a",ä:"a",å:"a",ấ:"a",ắ:"a",ẳ:"a",ẵ:"a",ặ:"a",æ:"ae",ầ:"a",ằ:"a",ȃ:"a",ả:"a",ạ:"a",ẩ:"a",ẫ:"a",ậ:"a",ç:"c",ḉ:"c",è:"e",é:"e",ê:"e",ë:"e",ế:"e",ḗ:"e",ề:"e",ḕ:"e",ḝ:"e",ȇ:"e",ẻ:"e",ẽ:"e",ẹ:"e",ể:"e",ễ:"e",ệ:"e",ì:"i",í:"i",î:"i",ï:"i",ḯ:"i",ȋ:"i",ỉ:"i",ị:"i",ð:"d",ñ:"n",ò:"o",ó:"o",ô:"o",õ:"o",ö:"o",ø:"o",ố:"o",ṍ:"o",ṓ:"o",ȏ:"o",ỏ:"o",ọ:"o",ổ:"o",ỗ:"o",ộ:"o",ờ:"o",ở:"o",ỡ:"o",ớ:"o",ợ:"o",ù:"u",ú:"u",û:"u",ü:"u",ủ:"u",ụ:"u",ử:"u",ữ:"u",ự:"u",ý:"y",ÿ:"y",Ā:"A",ā:"a",Ă:"A",ă:"a",Ą:"A",ą:"a",Ć:"C",ć:"c",Ĉ:"C",ĉ:"c",Ċ:"C",ċ:"c",Č:"C",č:"c",C̆:"C",c̆:"c",Ď:"D",ď:"d",Đ:"D",đ:"d",Ē:"E",ē:"e",Ĕ:"E",ĕ:"e",Ė:"E",ė:"e",Ę:"E",ę:"e",Ě:"E",ě:"e",Ĝ:"G",Ǵ:"G",ĝ:"g",ǵ:"g",Ğ:"G",ğ:"g",Ġ:"G",ġ:"g",Ģ:"G",ģ:"g",Ĥ:"H",ĥ:"h",Ħ:"H",ħ:"h",Ḫ:"H",ḫ:"h",Ĩ:"I",ĩ:"i",Ī:"I",ī:"i",Ĭ:"I",ĭ:"i",Į:"I",į:"i",İ:"I",ı:"i",Ĳ:"IJ",ĳ:"ij",Ĵ:"J",ĵ:"j",Ķ:"K",ķ:"k",Ḱ:"K",ḱ:"k",K̆:"K",k̆:"k",Ĺ:"L",ĺ:"l",Ļ:"L",ļ:"l",Ľ:"L",ľ:"l",Ŀ:"L",ŀ:"l",Ł:"l",ł:"l",Ḿ:"M",ḿ:"m",M̆:"M",m̆:"m",Ń:"N",ń:"n",Ņ:"N",ņ:"n",Ň:"N",ň:"n",ŉ:"n",N̆:"N",n̆:"n",Ō:"O",ō:"o",Ŏ:"O",ŏ:"o",Ő:"O",ő:"o",Œ:"OE",œ:"oe",P̆:"P",p̆:"p",Ŕ:"R",ŕ:"r",Ŗ:"R",ŗ:"r",Ř:"R",ř:"r",R̆:"R",r̆:"r",Ȓ:"R",ȓ:"r",Ś:"S",ś:"s",Ŝ:"S",ŝ:"s",Ş:"S",Ș:"S",ș:"s",ş:"s",Š:"S",š:"s",Ţ:"T",ţ:"t",ț:"t",Ț:"T",Ť:"T",ť:"t",Ŧ:"T",ŧ:"t",T̆:"T",t̆:"t",Ũ:"U",ũ:"u",Ū:"U",ū:"u",Ŭ:"U",ŭ:"u",Ů:"U",ů:"u",Ű:"U",ű:"u",Ų:"U",ų:"u",Ȗ:"U",ȗ:"u",V̆:"V",v̆:"v",Ŵ:"W",ŵ:"w",Ẃ:"W",ẃ:"w",X̆:"X",x̆:"x",Ŷ:"Y",ŷ:"y",Ÿ:"Y",Y̆:"Y",y̆:"y",Ź:"Z",ź:"z",Ż:"Z",ż:"z",Ž:"Z",ž:"z",ſ:"s",ƒ:"f",Ơ:"O",ơ:"o",Ư:"U",ư:"u",Ǎ:"A",ǎ:"a",Ǐ:"I",ǐ:"i",Ǒ:"O",ǒ:"o",Ǔ:"U",ǔ:"u",Ǖ:"U",ǖ:"u",Ǘ:"U",ǘ:"u",Ǚ:"U",ǚ:"u",Ǜ:"U",ǜ:"u",Ứ:"U",ứ:"u",Ṹ:"U",ṹ:"u",Ǻ:"A",ǻ:"a",Ǽ:"AE",ǽ:"ae",Ǿ:"O",ǿ:"o",Þ:"TH",þ:"th",Ṕ:"P",ṕ:"p",Ṥ:"S",ṥ:"s",X́:"X",x́:"x",Ѓ:"Г",ѓ:"г",Ќ:"К",ќ:"к",A̋:"A",a̋:"a",E̋:"E",e̋:"e",I̋:"I",i̋:"i",Ǹ:"N",ǹ:"n",Ồ:"O",ồ:"o",Ṑ:"O",ṑ:"o",Ừ:"U",ừ:"u",Ẁ:"W",ẁ:"w",Ỳ:"Y",ỳ:"y",Ȁ:"A",ȁ:"a",Ȅ:"E",ȅ:"e",Ȉ:"I",ȉ:"i",Ȍ:"O",ȍ:"o",Ȑ:"R",ȑ:"r",Ȕ:"U",ȕ:"u",B̌:"B",b̌:"b",Č̣:"C",č̣:"c",Ê̌:"E",ê̌:"e",F̌:"F",f̌:"f",Ǧ:"G",ǧ:"g",Ȟ:"H",ȟ:"h",J̌:"J",ǰ:"j",Ǩ:"K",ǩ:"k",M̌:"M",m̌:"m",P̌:"P",p̌:"p",Q̌:"Q",q̌:"q",Ř̩:"R",ř̩:"r",Ṧ:"S",ṧ:"s",V̌:"V",v̌:"v",W̌:"W",w̌:"w",X̌:"X",x̌:"x",Y̌:"Y",y̌:"y",A̧:"A",a̧:"a",B̧:"B",b̧:"b",Ḑ:"D",ḑ:"d",Ȩ:"E",ȩ:"e",Ɛ̧:"E",ɛ̧:"e",Ḩ:"H",ḩ:"h",I̧:"I",i̧:"i",Ɨ̧:"I",ɨ̧:"i",M̧:"M",m̧:"m",O̧:"O",o̧:"o",Q̧:"Q",q̧:"q",U̧:"U",u̧:"u",X̧:"X",x̧:"x",Z̧:"Z",z̧:"z",й:"и",Й:"И",ё:"е",Ё:"Е"},ge=Object.keys(he).join("|"),Ue=new RegExp(ge,"g"),Me=new RegExp(ge,"");function Fe(v){return he[v]}var me=function(v){return v.replace(Ue,Fe)},ze=function(v){return!!v.match(Me)};te.exports=me;te.exports.has=ze;te.exports.remove=me;var Be=te.exports;const De=le(Be);function Pe({value:v}){const{color:A}=ce[v]||{},f={width:8,height:"100%",position:"absolute",left:0,top:0,backgroundColor:A},{lineColor:p}=ce[v]||{},w=Y.useMemo(()=>{const[g]=v.match(/\d/)||[0],b=+g;if(b>1)return Array(b).fill(0).map((E,u)=>re.jsx("span",{style:{width:8,height:2,position:"absolute",left:0,top:18+u*6,backgroundColor:p}},u))},[v,p]);return v==="Unranked"?null:re.jsxs(ae.Fragment,{children:[re.jsx("span",{style:f}),w]})}const He=ae.memo(Pe);export{He as B,Ye as D,Oe as F,je as a,Ve as d,Xe as e,Ge as f,$e as l,De as r,qe as s};
