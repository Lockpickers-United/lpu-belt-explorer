import{b as A,p as b,q as a}from"./index-293cde6c.js";const m=function(t){if(t==null)return R;if(typeof t=="string")return x(t);if(typeof t=="object")return d(t);if(typeof t=="function")return u(t);throw new Error("Expected function, string, or array as `test`")};function d(t){const e=[];let r=-1;for(;++r<t.length;)e[r]=m(t[r]);return u(o);function o(...i){let n=-1;for(;++n<e.length;)if(e[n].apply(this,i))return!0;return!1}}function x(t){return u(e);function e(r){return r.tagName===t}}function u(t){return e;function e(r,o,i){return!!(k(r)&&t.call(this,r,typeof o=="number"?o:void 0,i||void 0))}}function R(t){return!!(t&&typeof t=="object"&&"type"in t&&t.type==="element"&&"tagName"in t&&typeof t.tagName=="string")}function k(t){return t!==null&&typeof t=="object"&&"type"in t&&"tagName"in t}const O=/^[a-zA-Z][a-zA-Z\d+\-.]*?:/,j=/^[a-zA-Z]:\\/;function L(t){if(typeof t!="string")throw new TypeError(`Expected a \`string\`, got \`${typeof t}\``);return j.test(t)?!1:O.test(t)}const _=["http","https"],z=["nofollow"],B={};function P(t){const e=t||B,r=e.protocols||_,o=m(e.test);return function(i){A(i,"element",function(n,E,N){if(n.tagName==="a"&&typeof n.properties.href=="string"&&o(n,E,N)){const c=n.properties.href;if(L(c)?r.includes(c.slice(0,c.indexOf(":"))):c.startsWith("//")){const f=s(e.content,n),l=f&&!Array.isArray(f)?[f]:f,p=s(e.rel,n)||z,y=typeof p=="string"?b(p):p,g=s(e.target,n),h=s(e.properties,n);if(h&&Object.assign(n.properties,a(h)),y.length>0&&(n.properties.rel=[...y]),g&&(n.properties.target=g),l){const w=s(e.contentProperties,n)||{};n.children.push({type:"element",tagName:"span",properties:a(w),children:a(l)})}}}})}}function s(t,e){return typeof t=="function"?t(e):t}export{P as r};
