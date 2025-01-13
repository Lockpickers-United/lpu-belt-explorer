import{K as W,M as $,j as s,r as P,ak as Y,I as K,bg as J,u as Q,R as X}from"./index-96a4be6e.js";import{c as Z,d as tt,T as et,a as N,b as z,e as nt}from"./TableRow-23d37e00.js";import{L as rt}from"./Link-6e2886df.js";import{R as it}from"./AdminRoleButton-bbde2c5d.js";var U={},at=$;Object.defineProperty(U,"__esModule",{value:!0});var q=U.default=void 0,st=at(W()),ot=s;q=U.default=(0,st.default)((0,ot.jsx)("path",{d:"m7 14 5-5 5 5z"}),"ArrowDropUp");var I={},lt=$;Object.defineProperty(I,"__esModule",{value:!0});var B=I.default=void 0,ut=lt(W()),dt=s;B=I.default=(0,ut.default)((0,dt.jsx)("path",{d:"m7 10 5 5 5-5z"}),"ArrowDropDown");const Ut=({tableData:e,tableWidth:t,tableHeight:n,fontSize:i,wrap:r,sortable:o,sort:l,setSort:u,ascending:d,setAscending:c,linkFunction:f})=>{const y=r?"inherit":"nowrap";e.columns.filter(a=>(a==null?void 0:a.id)&&(a==null?void 0:a.align));const[p,b]=P.useState(!1);e.columns.map(a=>(a==null?void 0:a.id)==="dateString"&&!p?b(!0):null),e.columns=p?e.columns.filter(a=>a.id!=="date"):e.columns;const g=P.useCallback(a=>{a!==l?(u(a),c(!0)):c(!d)},[d,c,u,l]),v=d?s.jsx(q,{}):s.jsx(B,{});return s.jsxs("div",{children:[s.jsx("div",{style:{fontSize:"1.3rem",margin:"10px"},children:e.title}),s.jsx(Z,{id:"statsTable",style:{padding:"0px 0px 0px 4px",width:t,marginLeft:"auto",marginRight:"auto",height:n},component:Y,elevation:2,children:s.jsxs(tt,{size:"small",stickyHeader:!!n,children:[s.jsx(et,{children:s.jsx(N,{children:e.columns.map((a,x)=>s.jsx(z,{sx:{textAlign:a.align,fontSize:i,lineHeight:"1.1rem",padding:"6px 2px",backgroundColor:"#111",color:"#fff"},component:"th",scope:"row",children:o&&a.id!=="index"&&s.jsxs("div",{style:{display:"flex",alignItems:"center"},children:[a.align==="center"?s.jsx("div",{style:{width:24}}):s.jsx("div",{style:{width:6}}),s.jsx(rt,{onClick:()=>g(a.id),style:{color:l===a.id?"#fff":"#bbb"},children:s.jsx("nobr",{children:a.name})}),l===a.id?s.jsx(K,{onClick:()=>g(a.id),style:{padding:0},children:v}):s.jsx("div",{style:{width:24}})]})||s.jsx("div",{children:a.name})},x+1))})}),s.jsx(nt,{children:e.data.map((a,x)=>s.jsx(N,{index:x,sx:{"&:nth-of-type(even) td, &:nth-of-type(even) th":{backgroundColor:"#191919"},"td, th":{}},children:e.columns.map((h,j)=>s.jsx(z,{sx:{textAlign:h.align,fontSize:i,whiteSpace:y,padding:"8px",border:0,color:"#eee"},component:"th",scope:"row",children:f(h.id,a[h.id]?a[h.id].toLocaleString():"")},j+1))},x))})]})})]})};var M={},F=function(){return F=Object.assign||function(e){for(var t,n=1,i=arguments.length;n<i;n++)for(var r in t=arguments[n])Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r]);return e},F.apply(this,arguments)},ct=function(){function e(t,n,i){var r=this;this.endVal=n,this.options=i,this.version="2.8.0",this.defaults={startVal:0,decimalPlaces:0,duration:2,useEasing:!0,useGrouping:!0,useIndianSeparators:!1,smartEasingThreshold:999,smartEasingAmount:333,separator:",",decimal:".",prefix:"",suffix:"",enableScrollSpy:!1,scrollSpyDelay:200,scrollSpyOnce:!1},this.finalEndVal=null,this.useEasing=!0,this.countDown=!1,this.error="",this.startVal=0,this.paused=!0,this.once=!1,this.count=function(o){r.startTime||(r.startTime=o);var l=o-r.startTime;r.remaining=r.duration-l,r.useEasing?r.countDown?r.frameVal=r.startVal-r.easingFn(l,0,r.startVal-r.endVal,r.duration):r.frameVal=r.easingFn(l,r.startVal,r.endVal-r.startVal,r.duration):r.frameVal=r.startVal+(r.endVal-r.startVal)*(l/r.duration);var u=r.countDown?r.frameVal<r.endVal:r.frameVal>r.endVal;r.frameVal=u?r.endVal:r.frameVal,r.frameVal=Number(r.frameVal.toFixed(r.options.decimalPlaces)),r.printValue(r.frameVal),l<r.duration?r.rAF=requestAnimationFrame(r.count):r.finalEndVal!==null?r.update(r.finalEndVal):r.options.onCompleteCallback&&r.options.onCompleteCallback()},this.formatNumber=function(o){var l,u,d,c,f=o<0?"-":"";l=Math.abs(o).toFixed(r.options.decimalPlaces);var y=(l+="").split(".");if(u=y[0],d=y.length>1?r.options.decimal+y[1]:"",r.options.useGrouping){c="";for(var p=3,b=0,g=0,v=u.length;g<v;++g)r.options.useIndianSeparators&&g===4&&(p=2,b=1),g!==0&&b%p==0&&(c=r.options.separator+c),b++,c=u[v-g-1]+c;u=c}return r.options.numerals&&r.options.numerals.length&&(u=u.replace(/[0-9]/g,function(a){return r.options.numerals[+a]}),d=d.replace(/[0-9]/g,function(a){return r.options.numerals[+a]})),f+r.options.prefix+u+d+r.options.suffix},this.easeOutExpo=function(o,l,u,d){return u*(1-Math.pow(2,-10*o/d))*1024/1023+l},this.options=F(F({},this.defaults),i),this.formattingFn=this.options.formattingFn?this.options.formattingFn:this.formatNumber,this.easingFn=this.options.easingFn?this.options.easingFn:this.easeOutExpo,this.startVal=this.validateValue(this.options.startVal),this.frameVal=this.startVal,this.endVal=this.validateValue(n),this.options.decimalPlaces=Math.max(this.options.decimalPlaces),this.resetDuration(),this.options.separator=String(this.options.separator),this.useEasing=this.options.useEasing,this.options.separator===""&&(this.options.useGrouping=!1),this.el=typeof t=="string"?document.getElementById(t):t,this.el?this.printValue(this.startVal):this.error="[CountUp] target is null or undefined",typeof window<"u"&&this.options.enableScrollSpy&&(this.error?console.error(this.error,t):(window.onScrollFns=window.onScrollFns||[],window.onScrollFns.push(function(){return r.handleScroll(r)}),window.onscroll=function(){window.onScrollFns.forEach(function(o){return o()})},this.handleScroll(this)))}return e.prototype.handleScroll=function(t){if(t&&window&&!t.once){var n=window.innerHeight+window.scrollY,i=t.el.getBoundingClientRect(),r=i.top+window.pageYOffset,o=i.top+i.height+window.pageYOffset;o<n&&o>window.scrollY&&t.paused?(t.paused=!1,setTimeout(function(){return t.start()},t.options.scrollSpyDelay),t.options.scrollSpyOnce&&(t.once=!0)):(window.scrollY>o||r>n)&&!t.paused&&t.reset()}},e.prototype.determineDirectionAndSmartEasing=function(){var t=this.finalEndVal?this.finalEndVal:this.endVal;this.countDown=this.startVal>t;var n=t-this.startVal;if(Math.abs(n)>this.options.smartEasingThreshold&&this.options.useEasing){this.finalEndVal=t;var i=this.countDown?1:-1;this.endVal=t+i*this.options.smartEasingAmount,this.duration=this.duration/2}else this.endVal=t,this.finalEndVal=null;this.finalEndVal!==null?this.useEasing=!1:this.useEasing=this.options.useEasing},e.prototype.start=function(t){this.error||(this.options.onStartCallback&&this.options.onStartCallback(),t&&(this.options.onCompleteCallback=t),this.duration>0?(this.determineDirectionAndSmartEasing(),this.paused=!1,this.rAF=requestAnimationFrame(this.count)):this.printValue(this.endVal))},e.prototype.pauseResume=function(){this.paused?(this.startTime=null,this.duration=this.remaining,this.startVal=this.frameVal,this.determineDirectionAndSmartEasing(),this.rAF=requestAnimationFrame(this.count)):cancelAnimationFrame(this.rAF),this.paused=!this.paused},e.prototype.reset=function(){cancelAnimationFrame(this.rAF),this.paused=!0,this.resetDuration(),this.startVal=this.validateValue(this.options.startVal),this.frameVal=this.startVal,this.printValue(this.startVal)},e.prototype.update=function(t){cancelAnimationFrame(this.rAF),this.startTime=null,this.endVal=this.validateValue(t),this.endVal!==this.frameVal&&(this.startVal=this.frameVal,this.finalEndVal==null&&this.resetDuration(),this.finalEndVal=null,this.determineDirectionAndSmartEasing(),this.rAF=requestAnimationFrame(this.count))},e.prototype.printValue=function(t){var n;if(this.el){var i=this.formattingFn(t);!((n=this.options.plugin)===null||n===void 0)&&n.render?this.options.plugin.render(this.el,i):this.el.tagName==="INPUT"?this.el.value=i:this.el.tagName==="text"||this.el.tagName==="tspan"?this.el.textContent=i:this.el.innerHTML=i}},e.prototype.ensureNumber=function(t){return typeof t=="number"&&!isNaN(t)},e.prototype.validateValue=function(t){var n=Number(t);return this.ensureNumber(n)?n:(this.error="[CountUp] invalid start or end value: ".concat(t),null)},e.prototype.resetDuration=function(){this.startTime=null,this.duration=1e3*Number(this.options.duration),this.remaining=this.duration},e}();const ft=Object.freeze(Object.defineProperty({__proto__:null,CountUp:ct},Symbol.toStringTag,{value:"Module"})),pt=J(ft);Object.defineProperty(M,"__esModule",{value:!0});var m=P,ht=pt;function mt(e,t){var n=e==null?null:typeof Symbol<"u"&&e[Symbol.iterator]||e["@@iterator"];if(n!=null){var i,r,o,l,u=[],d=!0,c=!1;try{if(o=(n=n.call(e)).next,t===0){if(Object(n)!==n)return;d=!1}else for(;!(d=(i=o.call(n)).done)&&(u.push(i.value),u.length!==t);d=!0);}catch(f){c=!0,r=f}finally{try{if(!d&&n.return!=null&&(l=n.return(),Object(l)!==l))return}finally{if(c)throw r}}return u}}function k(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter(function(r){return Object.getOwnPropertyDescriptor(e,r).enumerable})),n.push.apply(n,i)}return n}function D(e){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?k(Object(n),!0).forEach(function(i){vt(e,i,n[i])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):k(Object(n)).forEach(function(i){Object.defineProperty(e,i,Object.getOwnPropertyDescriptor(n,i))})}return e}function gt(e,t){if(typeof e!="object"||!e)return e;var n=e[Symbol.toPrimitive];if(n!==void 0){var i=n.call(e,t||"default");if(typeof i!="object")return i;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(e)}function yt(e){var t=gt(e,"string");return typeof t=="symbol"?t:String(t)}function vt(e,t,n){return t=yt(t),t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function _(){return _=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var i in n)Object.prototype.hasOwnProperty.call(n,i)&&(e[i]=n[i])}return e},_.apply(this,arguments)}function bt(e,t){if(e==null)return{};var n={},i=Object.keys(e),r,o;for(o=0;o<i.length;o++)r=i[o],!(t.indexOf(r)>=0)&&(n[r]=e[r]);return n}function G(e,t){if(e==null)return{};var n=bt(e,t),i,r;if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)i=o[r],!(t.indexOf(i)>=0)&&Object.prototype.propertyIsEnumerable.call(e,i)&&(n[i]=e[i])}return n}function xt(e,t){return wt(e)||mt(e,t)||jt(e,t)||St()}function wt(e){if(Array.isArray(e))return e}function jt(e,t){if(e){if(typeof e=="string")return L(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);if(n==="Object"&&e.constructor&&(n=e.constructor.name),n==="Map"||n==="Set")return Array.from(e);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return L(e,t)}}function L(e,t){(t==null||t>e.length)&&(t=e.length);for(var n=0,i=new Array(t);n<t;n++)i[n]=e[n];return i}function St(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var Vt=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u"?m.useLayoutEffect:m.useEffect;function S(e){var t=m.useRef(e);return Vt(function(){t.current=e}),m.useCallback(function(){for(var n=arguments.length,i=new Array(n),r=0;r<n;r++)i[r]=arguments[r];return t.current.apply(void 0,i)},[])}var Rt=function(t,n){var i=n.decimal,r=n.decimals,o=n.duration,l=n.easingFn,u=n.end,d=n.formattingFn,c=n.numerals,f=n.prefix,y=n.separator,p=n.start,b=n.suffix,g=n.useEasing,v=n.useGrouping,a=n.useIndianSeparators,x=n.enableScrollSpy,h=n.scrollSpyDelay,j=n.scrollSpyOnce,w=n.plugin;return new ht.CountUp(t,u,{startVal:p,duration:o,decimal:i,decimalPlaces:r,easingFn:l,formattingFn:d,numerals:c,separator:y,prefix:f,suffix:b,plugin:w,useEasing:g,useIndianSeparators:a,useGrouping:v,enableScrollSpy:x,scrollSpyDelay:h,scrollSpyOnce:j})},Et=["ref","startOnMount","enableReinitialize","delay","onEnd","onStart","onPauseResume","onReset","onUpdate"],Ot={decimal:".",separator:",",delay:null,prefix:"",suffix:"",duration:2,start:0,decimals:0,startOnMount:!0,enableReinitialize:!0,useEasing:!0,useGrouping:!0,useIndianSeparators:!1},H=function(t){var n=Object.fromEntries(Object.entries(t).filter(function(V){var C=xt(V,2),A=C[1];return A!==void 0})),i=m.useMemo(function(){return D(D({},Ot),n)},[t]),r=i.ref,o=i.startOnMount,l=i.enableReinitialize,u=i.delay,d=i.onEnd,c=i.onStart,f=i.onPauseResume,y=i.onReset,p=i.onUpdate,b=G(i,Et),g=m.useRef(),v=m.useRef(),a=m.useRef(!1),x=S(function(){return Rt(typeof r=="string"?r:r.current,b)}),h=S(function(V){var C=g.current;if(C&&!V)return C;var A=x();return g.current=A,A}),j=S(function(){var V=function(){return h(!0).start(function(){d==null||d({pauseResume:w,reset:R,start:O,update:E})})};u&&u>0?v.current=setTimeout(V,u*1e3):V(),c==null||c({pauseResume:w,reset:R,update:E})}),w=S(function(){h().pauseResume(),f==null||f({reset:R,start:O,update:E})}),R=S(function(){h().el&&(v.current&&clearTimeout(v.current),h().reset(),y==null||y({pauseResume:w,start:O,update:E}))}),E=S(function(V){h().update(V),p==null||p({pauseResume:w,reset:R,start:O})}),O=S(function(){R(),j()}),T=S(function(V){o&&(V&&R(),j())});return m.useEffect(function(){a.current?l&&T(!0):(a.current=!0,T())},[l,a,T,u,t.start,t.suffix,t.prefix,t.duration,t.separator,t.decimals,t.decimal,t.formattingFn]),m.useEffect(function(){return function(){R()}},[R]),{start:O,pauseResume:w,reset:R,update:E,getCountUp:h}},Ct=["className","redraw","containerProps","children","style"],At=function(t){var n=t.className,i=t.redraw,r=t.containerProps,o=t.children,l=t.style,u=G(t,Ct),d=m.useRef(null),c=m.useRef(!1),f=H(D(D({},u),{},{ref:d,startOnMount:typeof o!="function"||t.delay===0,enableReinitialize:!1})),y=f.start,p=f.reset,b=f.update,g=f.pauseResume,v=f.getCountUp,a=S(function(){y()}),x=S(function(w){t.preserveValue||p(),b(w)}),h=S(function(){if(typeof t.children=="function"&&!(d.current instanceof Element)){console.error(`Couldn't find attached element to hook the CountUp instance into! Try to attach "containerRef" from the render prop to a an Element, eg. <span ref={containerRef} />.`);return}v()});m.useEffect(function(){h()},[h]),m.useEffect(function(){c.current&&x(t.end)},[t.end,x]);var j=i&&t;return m.useEffect(function(){i&&c.current&&a()},[a,i,j]),m.useEffect(function(){!i&&c.current&&a()},[a,i,t.start,t.suffix,t.prefix,t.duration,t.separator,t.decimals,t.decimal,t.className,t.formattingFn]),m.useEffect(function(){c.current=!0},[]),typeof o=="function"?o({countUpRef:d,start:y,reset:p,update:b,pauseResume:g,getCountUp:v}):m.createElement("span",_({className:n,ref:d,style:l},r),typeof t.start<"u"?v().formattingFn(t.start):"")},Pt=M.default=At;M.useCountUp=H;function It(){var j,w;const{raflSummaryStats:e,animateTotal:t}=P.useContext(it),n=e&&e.uniqueDonors||0,i=e&&e.totalDonations||0,r=e&&new Intl.NumberFormat().format(i),o=e&&Math.floor(i/n)||0,l=300,u=e&&((j=e.platformDonations)==null?void 0:j.Discord)||0,d=e&&((w=e.platformDonations)==null?void 0:w.Reddit)||0,c=e&&u+d,f=e&&u/c*l,y=e&&d/c*l,{isMobile:p,flexStyle:b}=Q(),g=p?"10px 10px 16px 10px":"14px 20px 12px 20px",v=p?"center":"left",a={maxWidth:700,marginLeft:"auto",marginRight:"auto",marginTop:10,padding:"14px 0px 0px 0px",fontWeight:700,display:b},x={border:"1px solid #ccc",borderTopLeftRadius:10,borderBottomLeftRadius:10},h={border:"1px solid #ccc",borderTopRightRadius:10,borderBottomRightRadius:10};return s.jsxs(X.Fragment,{children:[s.jsxs("div",{style:{...a,border:"1px solid #aaa",borderRadius:8,marginBottom:20,padding:g,textAlign:v,justifyItems:"center"},children:[s.jsxs("div",{style:{flexGrow:1,marginTop:0,marginBottom:8},children:[s.jsxs("div",{style:{marginBottom:5},children:["Total Donations   ",i>1e3&&t?s.jsxs("span",{style:{fontSize:"1.8rem"},children:["$",s.jsx(Pt,{end:i,duration:1.5})]}):s.jsxs("span",{style:{fontSize:"1.8rem"},children:["$",r]})]}),s.jsxs("div",{children:[s.jsx("span",{style:{fontWeight:400,color:"#ddd"},children:"Donors"})," ",n,"    ",s.jsx("span",{style:{fontWeight:400,color:"#ddd"},children:"Average Donation"})," $",o]})]}),s.jsxs("div",{style:{width:l,textAlign:"center",marginTop:2},children:[!p&&s.jsx("span",{style:{fontWeight:700,fontSize:"1.1rem"},children:"Source"}),s.jsxs("div",{style:{display:"flex",textAlign:"left",fontSize:"0.95rem"},children:[s.jsx("div",{style:{flexGrow:1,paddingLeft:8},children:"Discord"}),s.jsx("div",{style:{paddingRight:8},children:"Reddit"})]}),s.jsxs("div",{style:{display:"flex"},children:[s.jsx("div",{style:{...x,width:f||0,backgroundColor:"#587ee6",height:20}}),s.jsx("div",{style:{...h,width:y||0,backgroundColor:"#2d52b0",height:20}})]})]})]}),s.jsx("div",{style:{height:8}})]})}export{Ut as A,It as R};
