import{r as a,j as e,R as d}from"./index-e5421be4.js";import{n as c,N as p,F as m}from"./Nav-943f0dbe.js";import{I as u,A as f,a as y,b,F as l,c as k}from"./ImageGallery-82653d6a.js";import"./useWindowSize-58585cc3.js";import"./LinearProgress-3b6942bd.js";const g=[{term:"Actuator",definition:"A component at the back of the plug that throws the bolt or unlocks the shackle when the plug is turned."},{term:"Anti-drill element",definition:"Components in a lock made of hardened steel to slow down or prevent drilling attacks. Can be parts of the lock body itself, pin inserts in the lock body or plug, or in the pins, or the pins themselves."},{term:"Ball bearing locking mechanism (padlocks)",definition:"Unshimmable mechanism in padlocks where ball bearings are pushed into the shackle to prevent opening."},{term:"Barrel driver pin",definition:"Name given to any driver pin with a shape similar to a “barrel”, having a portion near the extremities with a reduction in diameter, then flaring out at the end. Usually referring to the ASSA version, can also be used for other varieties like the DOM barrels."},{term:"Barrel key / Pin key",definition:"A key for a lever lock where the shaft of the key is a solid cylinder."},{term:"Bible",definition:"The part of a pin tumbler lock where the driver pins and springs reside."},{term:"Bible Cover",definition:"A cover plate that is sometimes on top of the bible. Can be removed for gutting."},{term:"Binding",definition:"The resistance to motion of an unset pin due to friction, usually against the sides of the bible chamber, when tensioning."},{term:"Bitting",definition:"The unique cuts in a key that move tumblers to specified places when inserted."},{term:"Bitting Code",definition:"An alphanumeric code that can be provided to a locksmith to cut a key to a desired shape. Some codes may be found on the keys themselves, other times in key cards that are obtained along with the lock."},{term:"BOK",definition:"(1) Bottom Of the Keyway - the area of the keyway opposite to the pins in a normal pin tumbler; corresponds to the inferior area of the keyway when the bible is upwards; in regular euro cylinder installation, with the bible downwards, will be the top part of the keyway. (2) BOK (tensioners): name colloquially given for tensioners used in the bottom of the keyway"},{term:"Dimple (Lock)",definition:"Generally used to identify a certain subtype of pin tumblers in which the coding is marked on the key mainly on the flat side; this distinction is useful from a tool choice perspective; although used to refer to the lock type itself, this isn’t technically correct, as the word “dimple” actually designates the round markings on the wide face of the key where the keypins make contact.",media:[{title:"By: mgsecure",subtitle:"CC BY-NC-SA 4.0",thumbnailUrl:"https://live.staticflickr.com/65535/52862175263_ce628c2aa1_w_d.jpg",fullUrl:"https://www.flickr.com/photos/lpubeltapp/52862175263/in/album-72177720306544616/"}]},{term:"Driver Pin",definition:"The pins that sit usually at shearline in a pin tumbler lock, preventing the rotation of the plug, and sit between a keypin and a spring. They must be fully lifted into the bible to open the lock. Also known as top pin when bible is upwards. Can include security features."},{term:"Fingerpin",definition:"Subtype of sidepin with extended prong that interacts with the key, and vertical rotational as well as vertical lift coding (must be lifted and rotated). Generally associated to a sidebar."},{term:"HPC",definition:'(1) High Pin Count (locks) - although the use can be flexible, one acceptable definition is "a lock with 8 or more active and independent pin stacks, from at least 2 different rows from different directions". (2) brand of picks sold mainly in USA',media:[{title:"By: mgsecure",subtitle:"CC BY-NC-SA 4.0",thumbnailUrl:"https://live.staticflickr.com/65535/52861838937_a7b9b4ecd9_w_d.jpg",fullUrl:"https://www.flickr.com/photos/lpubeltapp/52861838937/in/album-72177720306824854/"}]},{term:"Key Pin (or Keypin)",definition:"The pins in the plug in a pin tumbler lock, that are lifted by the key to lift the driver pins. Their size corresponds to the code for a key cut. When a key with the correct cut size in that position is inserted, the keypin lifts the driver pin just above the shear line. Also known as bottom pin when the bible is upwards. Can include security features."},{term:"Lever",definition:"(1) Coding element shaped like a flat piece of metal, that rotates about one point, interacting with the locking elements, which can be, for example. a sidebar or a talon, depending on the type of lever lock. (2) Italian levers (and silmilar types) are technically not lever locks as they don't rotate about one point, but are traditionally called levers."},{term:"Pin Tumbler",definition:"Any lock using stacks of pins composed by a coding keypin and a driver pin. Although generally used for locks with vertical keyways with pins coming from the bible side, and opened with vertical keys coded on one edge, the group technically includes also the so-called dimple locks."},{term:"Sidepin",definition:"Pin or pin-like element that works as a secondary locking mechanism. Can include various pin types like fingerpins, sliders, active and passive pin elements, among others with no specific designation."},{term:"Slider",definition:"Element that moves in only one direction in the lock, usually without pushing directly other pins or elements, and is kept rotationally locked to maintain correct contact with the functional elements it interacts with. It can be the main or secondary locking mechanism of a lock. Can be Sprung or Unsprung.",media:[{title:"By: mgsecure",subtitle:"CC BY-NC-SA 4.0",thumbnailUrl:"https://live.staticflickr.com/65535/52847751511_e442452434_w_d.jpg",fullUrl:"https://www.flickr.com/photos/lpubeltapp/52847751511/in/album-72177720307797162/"}]},{term:"TOK",definition:"(1) Top Of the Keyway - the area of the keyway on the same side of the pins in a normal pin tumbler; corresponds to the superior area of the keyway when the bible is upwards; in regular euro cylinder installation, with the bible downwards, will be the bottom part of the keyway. (2) TOK (tensioners): name colloquially given for tensioners used in the top of the keyway"},{term:"Wafer",definition:"A flat and wide coding element of a lock that slides in one direction, interacting with the locking elements, generally the lock body and the key."}];function w({entry:t}){const[o,n]=a.useState(),i=a.useCallback(r=>{n(r)},[]),s=a.useCallback(()=>{n(!1)},[]);return e.jsx(u,{columns:2,media:t.media,initiallyOpen:!1,openIndex:o,onOpenImage:i,onCloseImage:s})}function v({entry:t,expanded:o,onExpand:n}){var r;const i=a.useCallback((C,h)=>{n(h?t.term:!1)},[t.term,n]),s={maxWidth:500,marginLeft:"auto",marginRight:"auto"};return e.jsxs(f,{expanded:o,onChange:i,style:s,children:[e.jsx(y,{expandIcon:e.jsx(c,{}),children:t.term}),o&&e.jsxs(d.Fragment,{children:[e.jsxs(b,{sx:{padding:"8px 16px 0px 16px"},children:[e.jsx(l,{value:t.definition}),!!((r=t.media)!=null&&r.length)&&e.jsx(l,{value:e.jsx(w,{entry:t})})]}),e.jsx(k,{disableSpacing:!0})]})]})}function x(){const[t,o]=a.useState(),n=a.useCallback(i=>o(i),[]);return e.jsx("div",{style:{margin:8,paddingBottom:32},children:g.map(i=>{const s=t===i.term;return e.jsx(v,{entry:i,expanded:s,onExpand:n},i.term)})})}function T(){return e.jsxs(d.Fragment,{children:[e.jsx(p,{title:"Glossary of LPU Terms"}),e.jsx(x,{}),e.jsx(m,{})]})}export{T as default};
