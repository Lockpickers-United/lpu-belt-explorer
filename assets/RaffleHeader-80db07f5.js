import{bg as $,r as U,b as H,u as q,j as a,R as Y,G as A,B as P}from"./index-e55a35db.js";import{a as z}from"./RaffleContext-421c8333.js";import{C as K}from"./Collapse-f0ef2a10.js";var _={},D=function(){return D=Object.assign||function(i){for(var t,n=1,r=arguments.length;n<r;n++)for(var e in t=arguments[n])Object.prototype.hasOwnProperty.call(t,e)&&(i[e]=t[e]);return i},D.apply(this,arguments)},Z=function(){function i(t,n,r){var e=this;this.endVal=n,this.options=r,this.version="2.8.0",this.defaults={startVal:0,decimalPlaces:0,duration:2,useEasing:!0,useGrouping:!0,useIndianSeparators:!1,smartEasingThreshold:999,smartEasingAmount:333,separator:",",decimal:".",prefix:"",suffix:"",enableScrollSpy:!1,scrollSpyDelay:200,scrollSpyOnce:!1},this.finalEndVal=null,this.useEasing=!0,this.countDown=!1,this.error="",this.startVal=0,this.paused=!0,this.once=!1,this.count=function(s){e.startTime||(e.startTime=s);var u=s-e.startTime;e.remaining=e.duration-u,e.useEasing?e.countDown?e.frameVal=e.startVal-e.easingFn(u,0,e.startVal-e.endVal,e.duration):e.frameVal=e.easingFn(u,e.startVal,e.endVal-e.startVal,e.duration):e.frameVal=e.startVal+(e.endVal-e.startVal)*(u/e.duration);var o=e.countDown?e.frameVal<e.endVal:e.frameVal>e.endVal;e.frameVal=o?e.endVal:e.frameVal,e.frameVal=Number(e.frameVal.toFixed(e.options.decimalPlaces)),e.printValue(e.frameVal),u<e.duration?e.rAF=requestAnimationFrame(e.count):e.finalEndVal!==null?e.update(e.finalEndVal):e.options.onCompleteCallback&&e.options.onCompleteCallback()},this.formatNumber=function(s){var u,o,l,c,d=s<0?"-":"";u=Math.abs(s).toFixed(e.options.decimalPlaces);var g=(u+="").split(".");if(o=g[0],l=g.length>1?e.options.decimal+g[1]:"",e.options.useGrouping){c="";for(var x=3,y=0,v=0,b=o.length;v<b;++v)e.options.useIndianSeparators&&v===4&&(x=2,y=1),v!==0&&y%x==0&&(c=e.options.separator+c),y++,c=o[b-v-1]+c;o=c}return e.options.numerals&&e.options.numerals.length&&(o=o.replace(/[0-9]/g,function(p){return e.options.numerals[+p]}),l=l.replace(/[0-9]/g,function(p){return e.options.numerals[+p]})),d+e.options.prefix+o+l+e.options.suffix},this.easeOutExpo=function(s,u,o,l){return o*(1-Math.pow(2,-10*s/l))*1024/1023+u},this.options=D(D({},this.defaults),r),this.formattingFn=this.options.formattingFn?this.options.formattingFn:this.formatNumber,this.easingFn=this.options.easingFn?this.options.easingFn:this.easeOutExpo,this.startVal=this.validateValue(this.options.startVal),this.frameVal=this.startVal,this.endVal=this.validateValue(n),this.options.decimalPlaces=Math.max(this.options.decimalPlaces),this.resetDuration(),this.options.separator=String(this.options.separator),this.useEasing=this.options.useEasing,this.options.separator===""&&(this.options.useGrouping=!1),this.el=typeof t=="string"?document.getElementById(t):t,this.el?this.printValue(this.startVal):this.error="[CountUp] target is null or undefined",typeof window<"u"&&this.options.enableScrollSpy&&(this.error?console.error(this.error,t):(window.onScrollFns=window.onScrollFns||[],window.onScrollFns.push(function(){return e.handleScroll(e)}),window.onscroll=function(){window.onScrollFns.forEach(function(s){return s()})},this.handleScroll(this)))}return i.prototype.handleScroll=function(t){if(t&&window&&!t.once){var n=window.innerHeight+window.scrollY,r=t.el.getBoundingClientRect(),e=r.top+window.pageYOffset,s=r.top+r.height+window.pageYOffset;s<n&&s>window.scrollY&&t.paused?(t.paused=!1,setTimeout(function(){return t.start()},t.options.scrollSpyDelay),t.options.scrollSpyOnce&&(t.once=!0)):(window.scrollY>s||e>n)&&!t.paused&&t.reset()}},i.prototype.determineDirectionAndSmartEasing=function(){var t=this.finalEndVal?this.finalEndVal:this.endVal;this.countDown=this.startVal>t;var n=t-this.startVal;if(Math.abs(n)>this.options.smartEasingThreshold&&this.options.useEasing){this.finalEndVal=t;var r=this.countDown?1:-1;this.endVal=t+r*this.options.smartEasingAmount,this.duration=this.duration/2}else this.endVal=t,this.finalEndVal=null;this.finalEndVal!==null?this.useEasing=!1:this.useEasing=this.options.useEasing},i.prototype.start=function(t){this.error||(this.options.onStartCallback&&this.options.onStartCallback(),t&&(this.options.onCompleteCallback=t),this.duration>0?(this.determineDirectionAndSmartEasing(),this.paused=!1,this.rAF=requestAnimationFrame(this.count)):this.printValue(this.endVal))},i.prototype.pauseResume=function(){this.paused?(this.startTime=null,this.duration=this.remaining,this.startVal=this.frameVal,this.determineDirectionAndSmartEasing(),this.rAF=requestAnimationFrame(this.count)):cancelAnimationFrame(this.rAF),this.paused=!this.paused},i.prototype.reset=function(){cancelAnimationFrame(this.rAF),this.paused=!0,this.resetDuration(),this.startVal=this.validateValue(this.options.startVal),this.frameVal=this.startVal,this.printValue(this.startVal)},i.prototype.update=function(t){cancelAnimationFrame(this.rAF),this.startTime=null,this.endVal=this.validateValue(t),this.endVal!==this.frameVal&&(this.startVal=this.frameVal,this.finalEndVal==null&&this.resetDuration(),this.finalEndVal=null,this.determineDirectionAndSmartEasing(),this.rAF=requestAnimationFrame(this.count))},i.prototype.printValue=function(t){var n;if(this.el){var r=this.formattingFn(t);!((n=this.options.plugin)===null||n===void 0)&&n.render?this.options.plugin.render(this.el,r):this.el.tagName==="INPUT"?this.el.value=r:this.el.tagName==="text"||this.el.tagName==="tspan"?this.el.textContent=r:this.el.innerHTML=r}},i.prototype.ensureNumber=function(t){return typeof t=="number"&&!isNaN(t)},i.prototype.validateValue=function(t){var n=Number(t);return this.ensureNumber(n)?n:(this.error="[CountUp] invalid start or end value: ".concat(t),null)},i.prototype.resetDuration=function(){this.startTime=null,this.duration=1e3*Number(this.options.duration),this.remaining=this.duration},i}();const J=Object.freeze(Object.defineProperty({__proto__:null,CountUp:Z},Symbol.toStringTag,{value:"Module"})),Q=$(J);Object.defineProperty(_,"__esModule",{value:!0});var f=U,X=Q;function tt(i,t){var n=i==null?null:typeof Symbol<"u"&&i[Symbol.iterator]||i["@@iterator"];if(n!=null){var r,e,s,u,o=[],l=!0,c=!1;try{if(s=(n=n.call(i)).next,t===0){if(Object(n)!==n)return;l=!1}else for(;!(l=(r=s.call(n)).done)&&(o.push(r.value),o.length!==t);l=!0);}catch(d){c=!0,e=d}finally{try{if(!l&&n.return!=null&&(u=n.return(),Object(u)!==u))return}finally{if(c)throw e}}return o}}function M(i,t){var n=Object.keys(i);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(i);t&&(r=r.filter(function(e){return Object.getOwnPropertyDescriptor(i,e).enumerable})),n.push.apply(n,r)}return n}function I(i){for(var t=1;t<arguments.length;t++){var n=arguments[t]!=null?arguments[t]:{};t%2?M(Object(n),!0).forEach(function(r){it(i,r,n[r])}):Object.getOwnPropertyDescriptors?Object.defineProperties(i,Object.getOwnPropertyDescriptors(n)):M(Object(n)).forEach(function(r){Object.defineProperty(i,r,Object.getOwnPropertyDescriptor(n,r))})}return i}function et(i,t){if(typeof i!="object"||!i)return i;var n=i[Symbol.toPrimitive];if(n!==void 0){var r=n.call(i,t||"default");if(typeof r!="object")return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return(t==="string"?String:Number)(i)}function nt(i){var t=et(i,"string");return typeof t=="symbol"?t:String(t)}function it(i,t,n){return t=nt(t),t in i?Object.defineProperty(i,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):i[t]=n,i}function N(){return N=Object.assign?Object.assign.bind():function(i){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(i[r]=n[r])}return i},N.apply(this,arguments)}function rt(i,t){if(i==null)return{};var n={},r=Object.keys(i),e,s;for(s=0;s<r.length;s++)e=r[s],!(t.indexOf(e)>=0)&&(n[e]=i[e]);return n}function k(i,t){if(i==null)return{};var n=rt(i,t),r,e;if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(i);for(e=0;e<s.length;e++)r=s[e],!(t.indexOf(r)>=0)&&Object.prototype.propertyIsEnumerable.call(i,r)&&(n[r]=i[r])}return n}function at(i,t){return st(i)||tt(i,t)||ot(i,t)||lt()}function st(i){if(Array.isArray(i))return i}function ot(i,t){if(i){if(typeof i=="string")return L(i,t);var n=Object.prototype.toString.call(i).slice(8,-1);if(n==="Object"&&i.constructor&&(n=i.constructor.name),n==="Map"||n==="Set")return Array.from(i);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return L(i,t)}}function L(i,t){(t==null||t>i.length)&&(t=i.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=i[n];return r}function lt(){throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`)}var ut=typeof window<"u"&&typeof window.document<"u"&&typeof window.document.createElement<"u"?f.useLayoutEffect:f.useEffect;function R(i){var t=f.useRef(i);return ut(function(){t.current=i}),f.useCallback(function(){for(var n=arguments.length,r=new Array(n),e=0;e<n;e++)r[e]=arguments[e];return t.current.apply(void 0,r)},[])}var ct=function(t,n){var r=n.decimal,e=n.decimals,s=n.duration,u=n.easingFn,o=n.end,l=n.formattingFn,c=n.numerals,d=n.prefix,g=n.separator,x=n.start,y=n.suffix,v=n.useEasing,b=n.useGrouping,p=n.useIndianSeparators,w=n.enableScrollSpy,h=n.scrollSpyDelay,V=n.scrollSpyOnce,j=n.plugin;return new X.CountUp(t,o,{startVal:x,duration:s,decimal:r,decimalPlaces:e,easingFn:u,formattingFn:l,numerals:c,separator:g,prefix:d,suffix:y,plugin:j,useEasing:v,useIndianSeparators:p,useGrouping:b,enableScrollSpy:w,scrollSpyDelay:h,scrollSpyOnce:V})},dt=["ref","startOnMount","enableReinitialize","delay","onEnd","onStart","onPauseResume","onReset","onUpdate"],ft={decimal:".",separator:",",delay:null,prefix:"",suffix:"",duration:2,start:0,decimals:0,startOnMount:!0,enableReinitialize:!0,useEasing:!0,useGrouping:!0,useIndianSeparators:!1},W=function(t){var n=Object.fromEntries(Object.entries(t).filter(function(S){var C=at(S,2),T=C[1];return T!==void 0})),r=f.useMemo(function(){return I(I({},ft),n)},[t]),e=r.ref,s=r.startOnMount,u=r.enableReinitialize,o=r.delay,l=r.onEnd,c=r.onStart,d=r.onPauseResume,g=r.onReset,x=r.onUpdate,y=k(r,dt),v=f.useRef(),b=f.useRef(),p=f.useRef(!1),w=R(function(){return ct(typeof e=="string"?e:e.current,y)}),h=R(function(S){var C=v.current;if(C&&!S)return C;var T=w();return v.current=T,T}),V=R(function(){var S=function(){return h(!0).start(function(){l==null||l({pauseResume:j,reset:m,start:O,update:E})})};o&&o>0?b.current=setTimeout(S,o*1e3):S(),c==null||c({pauseResume:j,reset:m,update:E})}),j=R(function(){h().pauseResume(),d==null||d({reset:m,start:O,update:E})}),m=R(function(){h().el&&(b.current&&clearTimeout(b.current),h().reset(),g==null||g({pauseResume:j,start:O,update:E}))}),E=R(function(S){h().update(S),x==null||x({pauseResume:j,reset:m,start:O})}),O=R(function(){m(),V()}),F=R(function(S){s&&(S&&m(),V())});return f.useEffect(function(){p.current?u&&F(!0):(p.current=!0,F())},[u,p,F,o,t.start,t.suffix,t.prefix,t.duration,t.separator,t.decimals,t.decimal,t.formattingFn]),f.useEffect(function(){return function(){m()}},[m]),{start:O,pauseResume:j,reset:m,update:E,getCountUp:h}},ht=["className","redraw","containerProps","children","style"],pt=function(t){var n=t.className,r=t.redraw,e=t.containerProps,s=t.children,u=t.style,o=k(t,ht),l=f.useRef(null),c=f.useRef(!1),d=W(I(I({},o),{},{ref:l,startOnMount:typeof s!="function"||t.delay===0,enableReinitialize:!1})),g=d.start,x=d.reset,y=d.update,v=d.pauseResume,b=d.getCountUp,p=R(function(){g()}),w=R(function(j){t.preserveValue||x(),y(j)}),h=R(function(){if(typeof t.children=="function"&&!(l.current instanceof Element)){console.error(`Couldn't find attached element to hook the CountUp instance into! Try to attach "containerRef" from the render prop to a an Element, eg. <span ref={containerRef} />.`);return}b()});f.useEffect(function(){h()},[h]),f.useEffect(function(){c.current&&w(t.end)},[t.end,w]);var V=r&&t;return f.useEffect(function(){r&&c.current&&p()},[p,r,V]),f.useEffect(function(){!r&&c.current&&p()},[p,r,t.start,t.suffix,t.prefix,t.duration,t.separator,t.decimals,t.decimal,t.className,t.formattingFn]),f.useEffect(function(){c.current=!0},[]),typeof s=="function"?s({countUpRef:l,start:g,reset:x,update:y,pauseResume:v,getCountUp:b}):f.createElement("span",N({className:n,ref:l,style:u},e),typeof t.start<"u"?b().formattingFn(t.start):"")},mt=_.default=pt;_.useCountUp=W;function bt({page:i}){const{live:t,raffleAdminRole:n}=U.useContext(z),r=H(),{summaryStats:e,displayStats:s,toggleStats:u,animateTotal:o,setAnimateTotal:l}=U.useContext(z),c=e&&e[0].donors,d=e&&e[0].donationsTotal,g=e&&new Intl.NumberFormat().format(e[0].donationsTotal),x=e&&Math.floor(e[0].donationsTotal/c),y=300,v=e&&e[0].donationsDiscord/(e[0].donationsDiscord+e[0].donationsReddit)*y,b=e&&e[0].donationsReddit/(e[0].donationsDiscord+e[0].donationsReddit)*y,p=U.useCallback(()=>{u()},[u]),w=U.useCallback(B=>{r(B),l(!1)},[r,l]),{isMobile:h,flexStyle:V}=q(),j=h?0:4,m=h?"1.0rem":"1.03rem",E=h?"10px 10px 16px 10px":"14px 20px 12px 20px",O=h?"center":"left",F={maxWidth:700,marginLeft:"auto",marginRight:"auto",marginTop:10,padding:"14px 0px 0px 0px",fontWeight:700,display:V},S={border:"1px solid #ccc",borderTopLeftRadius:10,borderBottomLeftRadius:10},C={border:"1px solid #ccc",borderTopRightRadius:10,borderBottomRightRadius:10},T=t||n?"PRIZES":"PRIZE PREVIEW",G=s?"Hide Real-time Stats":"Show Real-time Stats";return a.jsxs(Y.Fragment,{children:[a.jsxs("div",{style:F,children:[a.jsx("div",{style:{flexGrow:1,fontSize:"1.7rem",marginTop:0},children:"LPU Annual Raffle"}),a.jsxs("div",{style:{marginTop:j,justifyItems:"right"},children:[a.jsx("div",{style:{flexGrow:1}}),a.jsx(A,{title:"Raffle Prizes",arrow:!0,disableFocusListener:!0,style:{},children:a.jsx("span",{children:a.jsx(P,{onClick:()=>w("/rafl"),style:{marginRight:10,color:i==="pots"?"#fff":"#ccc",fontSize:m},disabled:i==="pots",children:T})})}),!t&&!n&&a.jsx(A,{title:"Call For Contributions",arrow:!0,disableFocusListener:!0,style:{},children:a.jsx("span",{children:a.jsx(P,{onClick:()=>w("/rafl/announce"),style:{marginRight:10,color:i==="announce"?"#fff":"#ccc",fontSize:m},disabled:i==="announce",children:"CONTRIBUTE"})})}),(t||n)&&a.jsx(A,{title:"Approved Charities",arrow:!0,disableFocusListener:!0,style:{},children:a.jsx("span",{children:a.jsx(P,{onClick:()=>w("/rafl/charities"),style:{marginRight:10,color:i==="charities"?"#fff":"#ccc",fontSize:m},disabled:i==="charities",children:"CHARITIES"})})}),(t||n)&&a.jsx(A,{title:"Enter the RAFL",arrow:!0,disableFocusListener:!0,style:{},children:a.jsx("span",{children:a.jsx(P,{onClick:()=>w("/rafl/enter"),style:{marginRight:10,color:i==="enter"?"#fff":"#ccc",fontSize:m},children:"ENTER"})})}),(t||n)&&a.jsx(A,{title:G,arrow:!0,disableFocusListener:!0,style:{},children:a.jsx("span",{children:a.jsx(P,{onClick:p,style:{marginRight:0,color:s?"#96ace5":"#ccc",fontSize:m},children:"STATS"})})})]})]}),s&&a.jsx(K,{in:s,style:{padding:"0px 12px"},children:a.jsxs("div",{style:{...F,border:"1px solid #aaa",borderRadius:8,marginBottom:20,padding:E,textAlign:O},children:[a.jsxs("div",{style:{flexGrow:1,marginTop:0,marginBottom:8},children:[a.jsxs("div",{style:{marginBottom:5},children:["Total Donations   ",d>1e3&&o?a.jsxs("span",{style:{fontSize:"1.8rem"},children:["$",a.jsx(mt,{end:d,duration:1.5})]}):a.jsxs("span",{style:{fontSize:"1.8rem"},children:["$",g]})]}),a.jsxs("div",{children:[a.jsx("span",{style:{fontWeight:400,color:"#ddd"},children:"Donors"})," ",c,"    ",a.jsx("span",{style:{fontWeight:400,color:"#ddd"},children:"Average Donation"})," $",x]})]}),a.jsxs("div",{style:{width:y,display:"block",textAlign:"center",marginTop:2},children:[!h&&a.jsx("span",{style:{fontWeight:400},children:"Source"}),a.jsxs("div",{style:{display:"flex",textAlign:"left"},children:[a.jsx("div",{style:{flexGrow:1,paddingLeft:8},children:"Discord"}),a.jsx("div",{style:{paddingRight:8},children:"Reddit"})]}),a.jsxs("div",{style:{display:"flex"},children:[a.jsx("div",{style:{...S,width:v,backgroundColor:"#2d52b0",height:20}}),a.jsx("div",{style:{...C,width:b,backgroundColor:"#587ee6",height:20}})]})]})]})}),a.jsx("div",{style:{height:8}})]})}export{bt as R};