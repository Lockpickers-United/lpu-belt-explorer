import{b as L,r as D,j as e,u as B,L as v,R as l,an as C,O,e as U,a9 as q,N as z,h as E,T as F}from"./index-C21eoqnz.js";import{u as M}from"./usePageTitle-CMpVr-KG.js";import{B as _}from"./BeltStripeMini-DydBU4g9.js";import"./filterEntriesAdvanced-AeF_iH3-.js";import{D as W}from"./DataContext-DBzYkb1c.js";import"./index-DiZzTbej.js";import{e as G}from"./entryName-BL9IKMoO.js";import{M as R}from"./index-2tkzJ69m.js";import{r as K}from"./index-BX4sNQty.js";import{r as N}from"./index-Bd-tYDFO.js";import{B as H}from"./Box-DTQm99PE.js";import{D as Y}from"./LockDataProvider-B5ZxsLVB.js";import{l as V}from"./filterFields-D71fGQGm.js";import"./collectionStatsById-DY1NVZ7h.js";import"./useData-86Ia4QCU.js";import"./dataUrls-CThgH6Wi.js";import"./setDeep-J6HEwWhX.js";import"./stringUtils-BsiQ3MZ5.js";function J({page:c={}}){c!=null&&c.title&&M("Path to Black: "+(c==null?void 0:c.title));const I=L(),{getEntryFromId:p}=D.useContext(W),x=m=>{I(`/locks?id=${m}`)},S=({idChildren:m,descriptions:f=[]})=>{var j,P;const w=l.Children.toArray(m).map(g=>{var A;return typeof g=="string"?g:((A=g==null?void 0:g.props)==null?void 0:A.children)??""}).flat().join("").trim(),o=p(String(w))||{},y=G(o,"any",{includeVersion:!1}),a=o!=null&&o.belt?o.belt==="Unranked"?"Unranked:":o.belt.replace(/ \d/,"")+" Belt:":"",s=(o==null?void 0:o.media)||[{}],h={color:"#ddd",textDecoration:"underline",cursor:"pointer","&:hover":{color:"#fff"}},{isMobile:r}=B(),n=r?85:150,i="1.0rem",t=r?"1.1rem":"1.2rem",d=r?"6px 16px 0px 0":"6px 24px 0px 0";return e.jsx(l.Fragment,{children:e.jsxs("div",{style:{...k,display:"flex",alignItems:"stretch",position:"relative",backgroundColor:"#222",padding:"16px 32px"},children:[e.jsx(_,{value:o==null?void 0:o.belt,style:{position:"absolute",top:0,left:0,bottom:0}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"stretch",position:"relative"},children:[e.jsxs("div",{style:{fontWeight:600,fontSize:t,marginBottom:8},children:[a," ",e.jsx(v,{onClick:()=>{x(o.id)},sx:h,children:y})]}),e.jsxs("div",{style:{display:"flex"},children:[!r&&((j=s[0])==null?void 0:j.thumbnailUrl)&&e.jsx("div",{style:{margin:d},children:e.jsx(v,{onClick:()=>{x(o.id)},children:e.jsx("img",{style:{width:n},src:(P=s[0])==null?void 0:P.thumbnailUrl,alt:y})})}),e.jsx("div",{children:f.map((g,A)=>e.jsx("div",{style:{marginBottom:8,fontSize:i},children:g},A))})]})]})]})})},T=({idChildren:m,descriptions:f=[]})=>{const w=l.Children.toArray(m).map(s=>{var h;return typeof s=="string"?s:((h=s==null?void 0:s.props)==null?void 0:h.children)??""}).flat().join("").trim(),o=p(String(w))||{},{isMobile:y}=B(),a="1.0rem";return e.jsx(l.Fragment,{children:e.jsxs("div",{style:{...k,display:"flex",alignItems:"stretch",position:"relative",backgroundColor:"#222",padding:"16px 32px"},children:[e.jsx(_,{value:o==null?void 0:o.belt,style:{position:"absolute",top:0,left:0,bottom:0}}),e.jsx("div",{style:{display:"flex",flexDirection:"column",alignItems:"stretch",position:"relative"},children:e.jsx("div",{style:{display:"flex"},children:e.jsx("div",{children:f.map((s,h)=>e.jsx("div",{style:{marginBottom:8,fontSize:a},children:s},h))})})})]})})};function u({markdown:m}){const{isMobile:f}=B(),w="1.0rem",o=f?"1.5rem":"1.7rem",y={fontWeight:400,color:"#888",textDecoration:"none",cursor:"pointer","&:hover":{textDecoration:"underline",color:"#fff"}};return e.jsx(R,{components:{ul:({children:a})=>{const s=i=>l.Children.toArray(i).map(t=>{var d;return typeof t=="string"?t:((d=t==null?void 0:t.props)==null?void 0:d.children)??""}).flat().join("").trim(),h=l.Children.toArray(a).filter(l.isValidElement),r=[];let n=null;return h.forEach(i=>{const t=s(i.props.children);if(!!p(String(t)))n&&r.push(n),n={idChildren:i.props.children,descriptions:[]};else{if(!n)return;n.descriptions.push(i.props.children)}}),n&&r.push(n),e.jsx(e.Fragment,{children:r.map((i,t)=>e.jsx(S,{idChildren:i.idChildren,descriptions:i.descriptions},`ld-${t}`))})},ol:({children:a})=>{const s=i=>l.Children.toArray(i).map(t=>{var d;return typeof t=="string"?t:((d=t==null?void 0:t.props)==null?void 0:d.children)??""}).flat().join("").trim(),h=l.Children.toArray(a).filter(l.isValidElement),r=[];let n=null;return h.forEach(i=>{const t=s(i.props.children);if(!!p(String(t)))n&&r.push(n),n={idChildren:i.props.children,descriptions:[]};else{if(!n)return;n.descriptions.push(i.props.children)}}),n&&r.push(n),e.jsx(e.Fragment,{children:r.map((i,t)=>e.jsx(T,{idChildren:i.idChildren,descriptions:i.descriptions},`ld-${t}`))})},blockquote:({children:a})=>e.jsx("div",{style:{...k,fontSize:w,alignItems:"stretch",position:"relative",backgroundColor:"#2a2a2a",borderBottom:"1px solid #000",padding:"12px 18px 6px 18px"},children:a}),p:({children:a})=>e.jsx("div",{style:{marginBottom:12,lineHeight:"1.5em"},children:a}),h1:({children:a})=>e.jsxs("div",{style:{...k,fontSize:o,fontWeight:700,backgroundColor:"#2a2a2a",padding:"8px 0 0 18px",borderBottom:"none"},children:[e.jsxs(H,{component:"span",style:{fontWeight:400,color:"#666",fontSize:"1.2rem"},children:[e.jsx(v,{sx:y,onClick:()=>{I("/pathtoblack")},children:"path to black"})," > "]}),e.jsx("nobr",{children:a})]}),h6:({children:a})=>e.jsx("div",{style:{...k,textAlign:"right",fontSize:"0.85rem",padding:"8px 8px 0 18px",borderBottom:"none"},children:a})},remarkPlugins:[N],rehypePlugins:[[K,{target:"_blank",rel:["nofollow","noopener","noreferrer"]}]],children:m})}const k={maxWidth:700,marginLeft:"auto",marginRight:"auto",padding:"6px 20px",borderBottom:"1px solid #333",borderRadius:0};return e.jsx("div",{style:{margin:6},children:e.jsx(u,{markdown:c.content})})}const X=`# mgsecure

>Another list from the LPUbelts team. Here’s a slightly different take than the path I actually took, focusing on [dimple locks](/#/locks?tab=search&lockingMechanisms=Dimple). I did use them from Purple to Black and they are a fascinating and challenging switch from “traditional” pin-tumbler locks.
>
>For those who might want to start exploring picking dimples, here’s an [overview of major dimple flag sets](https://www.reddit.com/r/lockpicking/comments/teonid/dimple_lock_pick_set_info_comparison_multipick/) I put together a bit back. I use the Multipick flags, and included some tool selection notes below.
>
>Dimple lock availability can be a real issue in the US but I’ve tried to select some of the more common ones. I largely rely on #lock-bazaar on the [LPU Discord server](https://discord.com/invite/lockpicking) for higher belt locks. You can browse/search/filter dimple lock listings from most of the major sellers at: [lpulocks.com/#/lockbazaar](https://lpulocks.com/#/lockbazaar?lockingMechanisms=Dimple&sort=belt)

- 171f76e9
- Unfortunately for us in the States, entry-level dimple locks are hard to come by. The [Burg Wächter Boccia](/#/locks?id=171f76e9) is a nice, if pricey, option. UK folks might consider the [Master Lock 1145 - 1165EURD](/#/locks?id=237f29c9) series.
- I recommend learning with the affordable [Gaab six pin dimple lock](/#/locks?id=cd5acff8) available from UHS Hardware in the US. It's unranked, but I put it's difficulty at Orange. 

- 7ec79663
- Kenaurd is a house brand at UHS Hardware and this lock doesn’t contain spooled or serrated outer pins. Their 1” mortice lock has four pins while 1 1/8” and longer come with five. Pin-in-Pin "sounds" scary' at first but they’re really not that much harder than standard pins.
- I use the Multipick #7 and small #10 which were designed for PIP locks but a standard flag works well too. The [ABUS D6](/#/locks?id=f97700ff&name=ABUS_D6) seems like a popular option in the UK.  (I actually submitted the pin-tumbler [ABUS 72/40](/#/locks?id=74a00ae3&name=ABUS_72_40).)

- b91162e7
- Another house brand from UHS, though any [HQ High Security Interactive clone](/#/locks?id=c1d09460&name=Any_HQ_High_Security_Interactive_clone) will do. This is a step up from the Kenaurd in that it contains PIP spooled security pins. I generally prefer security pins for the feedback they give and this lock has decently deep spools. Again with the MP #7 and 10. You could also go with a four pin [Mul-T-Lock Classic/Interactive](/#/locks?id=aec0c82d&name=MulTLock_Classic) or an [ ABUS 75/50](/#/locks?id=9ec8706c&name=ABUS_75_50) padlock for Blue. (I actually submitted the [American Lock 1100](/#/locks?id=2ae1e0b8&name=American_Lock_1100___A1100) which used to be Blue.)

- 3335df97
- Starting at Purple, you need to submit **two** different locks for each belt. My second one was the [**DeGuard Interactive clone**](/#/locks?id=db4de1bb). They are similar, five pin-in-pin stack locks. The MTL locks definitely have tighter tolerances and the Junior is a good introduction to them. There are a lot of other [Purple Belt dimple locks](/#/locks?tab=Purple&lockingMechanisms=Dimple) if these aren't available in your area.

- 7194cc26
- And the [**Mul-T-Lock Interactive**](/#/locks?id=5c5701d7&name=MulTLock_Classic) (serrated driver pins). MTL locks are tougher with serrated drivers but not dramatically harder. The Japanese GOAL D9 however, is a real big shift in approach and difficulty. This cute little lock has three rows of pins with three pins each and is a great introduction to so-called "High Pin Count" (HPC) locks.
- Progressive pinning is a really great way to learn these, I start with the pins in the back and add in groups of three. Trying with just one full row is also a good way to get a feel for things. The [WEST 916](/#/locks?id=18e1f45b&name=WEST_916) is another good Brown Belt HPC lock. It has two rows of six pins each on both sides.

- eed91da5
- And [**ABUS EC700/EC800**](/#/locks?id=b29a8b44&name=ABUS_EC700). The MIWA JN has four rows of pins, two on the sides and two coming in diagonally from the bottom. It is capable of having up to 21 pins but counts for Red with 14. It's similar to other HPC locks like the [GOAL v18](/#/locks?id=9f613c4a) but doesn't have over-milling in the core. I use the same curved flag approach here.

- 109531f4
- And the [**WEST 917**](/#/locks?id=23437955&name=WEST_917). The V18 is a beast of a lock with three rows of pins and up to 19 active pin stacks. It has over-milling in the core that creates overset traps if you aren't careful. It is Black Belt with 14-16 pins and BB2 with all 19. Under some peer pressure, I picked it with 19 :-) Patience is key and progressive pinning really helped me tackle it. I can't keep track of all 19 pins at once, so I broke it down into zones like "back left" and "front right" to help me picture it.

>**Black Belt: Epic Quests**
>
>My quests were manipulating the [S&G 6730](/#/dials?id=ae84d433&name=Sargent__Greenleaf_6730) safe lock & community contributions, here's my [original belt request](https://www.reddit.com/r/mgsecure/comments/107iei3/black_belt_request/) with details.

###### *Originally published Sept. 21, 2023*`,Q=`# NiXXeD

>This is the beginning of what we plan to be a series of posts sharing a "Path to Black" from an experienced picker. Here's one approach I put together that only uses traditional pin-tumbler locks, the first of a few lists by folks on the LPUbelts team.

- 3653f376
- This is a great padlock to practice with early on. It's repinnable, so you can buy security pins and practice just like the Sparrows practice locks, except this one has real lock feedback. Default pinning is going to be light serrated in stack 1 and the rest spools. After you're bored with the core, you can swap any standard KIK into this and pick in hand!

- 2ae1e0b8
- The classic. This comes highly recommended for good reason. Great tension and jiggle test practice to warm you up for blue.

- 331c9d36
- Australian classic. Five thin lipped spools for a really fun pick. This should help round out your tension practice for purple!

- 45e3cde7
- Barrels are rough, but without a sidebar this is doable! Progressive pin will be your friend here and up, and you'll see why barrels are so effective at 3-4+ stacks.

- a1233156
- Fun spools and gins to start to really challenge you. Not many PTs make it to this belt level without a secondary locking mechanism. This will warm you up for red.

- 937eb7a8
- A red belted Goal Z is just one pin from a Black lock! Amazing tolerances, different shaped spools, and gins with matching milling. Round that off with overmilling as well for a big challenge. You likely can get an extra pin to make this black as well!

- f133510b
- The classic PT Black experience. Shoot for the ideal pinning if possible, should be tapers in 3/5/7, with 2+ trees and rest gins. If you can get it grubbed, do it! It makes the gutting/PP experience much safer and basically unbrickable.

###### *Originally published Sept. 19, 2023*`,$=`# PeaceWeapon

>Hello **Peace** Lovers, today it’s my turn to suggest a possible Path to Black.
>
>This Path will be including some of the locks I used to get to Black belt, but not always at the same belt level, one of the main reasons being some have changed belts in the meanwhile – yes I might be getting a bit ancient…
>
>I mostly spend my time on the Lockpickers United Discord, that's associated with this sub, and where most of these locks can be found for very accessible prices from other lockpickers and sellers on the Bazaar Forum channel.
>
>As a quick disclaimer – *cough cough* and *cough* shameless *cough* promo *cough cough* – this path includes some of the locks I usually have available in the box to blue I put together for new pickers, but I also added a few other alternatives that I feel can be good choices for the different belts and different picking preferences. I’ll keep mostly to pin tumblers and dimples, though.

- 2455f0ae
- I actually skipped yellow, and went straight to orange belt, but the small 4 pin [Master Lock 140](/#/locks?id=2455f0ae) is a great option for a beginner looking to learn pick positioning with forgiving tolerances. Some of these padlocks have only standard drivers, but lately they have been found having 3 spools and a lighly serrated driver pin, making it also great to learn how to pick spools.

- 632f4069
- Assuming you learned how to pick spools already, [Abus 55/50](/#/locks?id=632f4069) is a 5 pin padlock that will add better tolerances to an extra pin. If you get the paracentric “yale” style keyway, that challenge is even greater. Many other Abus padlocks would make good alternatives, like the [65/40](/#/locks?id=a0e50505). Just avoid the 55/40 with “yale” keyway, it’s too restrictive for most tools a beginner usually has access to. Speaking of Yale, the [Yale Y110/40](/#/locks?id=98a2ba2d) is also a great choice, considering you have proper tools.
- The option I went with when I started was the [Master Lock 150](/#/locks?id=efc01233). At the time, very shallow spools didn’t make for an interesting pick, but I’ve heard newer versions are a bit better, and the wide keyway is great for pickers with thicker tools.

- 2ae1e0b8
- The [American Lock 1100](/#/locks?id=2ae1e0b8) is a lock that will bring you a different type of challenge compared to the other ones. The 1100 forces a picker to learn how to pick serrated pins. In my personal path, the 1100 was my blue lock, and, although it was downgraded, it still is one of the most interesting widely available green belt locks to pick.
- The [ABUS 72/40](/#/locks?id=74a00ae3) is also a fun and challenging - albeit sometimes frustrating - lock, with great tolerances, and widely available.
- Another good alternative is the [Master Lock 410 LOTO](/#/locks?id=c942490e), which I used for my green belt application, but not being guttable - unless in a destructive way - precludes it from being the best choice for this belt. Both this and the 1100 are harder to find outside of North America than the Abus.

- 779e7dcb
- As I said above, the lock I used for my blue belt application is no longer an option for this belt. In my opinion, it’s at this level that one must expand the horizons to different security mechanisms and systems. So I’ll give you different options. The [Yale 500](/#/locks?id=779e7dcb) stays with the “spools and good tolerances” motif, but the added overmilling can be annoying if you don’t understand the feedback properly.
- The [DOM Plura](/#/locks?id=96591a8f) takes it to another level with evil pins that have been cursed to keep you guessing what that feedback means. [ASSA 500](/#/locks?id=f8445741) with barrel drivers introduces a new feedback for a very effective anti-pick system. And for those entering the world of dimple locks, try [DOM IX 5KG](/#/locks?id=eec4bd4a), very fun lock with the most interesting driver pins.

- 826c31e0
- [Medeco Biaxial or Original](/#/locks?id=826c31e0), doesn’t really matter on this case, it introduces the double locking mechanism as a special challenge, and it can be so fun when you finally understand how it works! I strongly recommend trying it, learning how the keypins rotate and how to check when the sidebar is in the correct gate. Love this lock!
- My second purple lock was a [Yale Superior](/#/locks?id=ebe9ee59) with 7 pins. It's usually a fairly easy lock with lowsy feedback. Wouldn't recommend it if you want to have fun. 
- If you haven’t had the opportunity to try barrel drivers yet, find an [ASSA 600](/#/locks?id=45e3cde7) or equivalent, this lock will teach much about feedback. As a dimple option, a Mul-t-lock with spooled drivers is popular and can be a very nice pick, but personally, I would prefer to pick the annoying [TESA TX80](/#/locks?id=3f49ccc1) or the super fun [Lockman Megacross](/#/locks?id=9982c0eb).

- e39885f3
- [DOM ix 10](/#/locks?id=e39885f3) with fins was my brown lock at the time and was an interesting change. Although it’s mostly composed of standard pins, the weak feedback and tapered action pose a challenge that’s enough for it to be called brown belt, but is usually still a very accessible lock to pick. Just don’t be surprised you need to “gorilla tension” it, so make sure you have a strong tensioner.
- If you want a fun lock, I’d recommend getting a [Goal D9](/#/locks?id=7194cc26) or a [Goal P](/#/locks?id=a1233156). The former being fairly straightforward and fun pick for a high pin count lock, the latter a pin tumbler with good tolerances and a bunch of plug modifications, that relies very much on your ability to interpret the feedback and control the tension. Also, the "wrong" bitting can make it really hard to pick.

- 6b06f591
- In my own path to black, I used [ASSA 700](/#/locks?id=f133510b) as my red belt lock. It was since upgraded to black belt, so the next best one I would suggest, and a logical follow-up to the DOM ix 10, is the [DOM ix Saturn](/#/locks?id=6b06f591). I would consider it a low level red belt lock, but still interesting and fun to pick. It adds torpedoes and spools to a good tolerance 10 pin lock.
- If you want something more challenging, I would definitely suggest something like the [Corbin Russwin Emhart](/#/locks?id=c4f942f0) or the [ASSA 600](/#/locks?id=29ab2852) with gin drivers, the latter a nice, hard intro to float picking. As for the Emhart, the beautiful interlocked drivers and keypins make picking it an experience like none other, but you might have some trouble finding one – they are also great collector material.

- f133510b
- For many lockpickers, [ASSA 700](/#/locks?id=f133510b) might be the first experience of float picking, and it can be a real pain to pick. The tapered pins can be very tricky to set and keep up, as you try to go for the trees and gins. To be a black belt, it must have at least 2 tree driver pins, which are dependent on bitting. One tip: either grub it, or never forget to use a shim, as the gin heads can get stuck in the anti-drill holes if you’re not careful when gutting and reassembling.
- Other great choices for Black belt locks come from the ASSA Twin family of locks (example: [ASSA Twin 6000](/#/locks?id=104776ef) with gin spools or [ASSA Twin Combi](/#/locks?id=fb51b475), that I used to get to black belt). The double locking mechanism can be very tricky to pick, depending on the model, but also very fun and very satisfying to get open.
- In case you’re more of a dimple picker, [DOM ix Twinstar](/#/locks?id=3c73c705) is the perfect follow-up for the Saturn. If you’re a determined masochist… [EVVA ICS](/#/locks?id=8ea170d2) might be for you. Just make sure you get very a snug tensioner to pick it. Both of these were also essential to my Black belt application.

> Looking back, I might have exaggerated with the suggestions.... Nevertheless, hope this will help you choose your own path, and always remember to have fun picking your way to Black Belt!

###### *Originally published Nov. 30, 2023*`,Z=`# Dynamic

>Back in the day when I started to pick locks, I stumbled upon some great reddit posts: the ‘Path to Black’ series from various black belt pickers. The series gave me a general idea of which type of locks I should try out to progress more, which ultimately led me to try and finally earn my black belt.
>
>I live in South Korea. If you did not know, locksport is not known very well in this place, which limited me on getting both tools and locks to play around. I only had cheap Aliexpress picks that were made in China, and CI picks. It was all I’ve got, and I got up to red belt using only those tools.
>
>As for locks, I’ve bought and got many more locks to try out after I got my black belt. I’ll be using that knowledge to suggest as many options for each belt based on my picking experience. One side note, I originally wanted to add 1 or 2 dimple locks on the list, but I've picked those locks after I got black belt and acquired new tools, so I’ve excluded them for now.

- 2455f0ae
- I skipped low-belts and started straight at blue, but I did pick low belt locks before I got any belt! But you can skip yellow if you would like to. [Master Lock 140/141](/#/locks?id=2455f0ae) is a pretty good starter lock in my opinion, just to get the general feel of everything. It has 4 pins and a wide open keyway, so picking it open shouldn’t be a big problem if you know the basic process of picking locks. The old pinning seems to have 3 spools and 1 lightly serrated pin which made it a good learning lock, but afaik the new locks come with 4 standard pins which also was my case.

- 9ca2c109
- Also not a mandatory belt in my opinion, but it will definitely help you on future picks if you do try.
- [Master Lock 570/575](/#/locks?id=9ca2c109&name=Master_Lock_570_575_576) is a good upgrade from the 140s. We are introduced by warding on the keyway, which will be a good challenge for inexperienced pickers. The pin count is increased to 5, but all are standard pins. The 575 I own has a brass body, and a dead core. This means the core of the padlock is not sprung, and this teaches you good tension control(of not using too much tension) which is a good and required skill to have if you want to progress more.
- [Alpha 1000](/#/locks?id=bac43ba7&name=ALPHA_1000) is a Japanese 5 pin padlock. This might be tricky to get in your hands depending on where you live. Keyway is pretty wide open but the tolerances make it a surprisingly interesting pick. It has standards and spools, the feedback is really clear. If you happen to get one of these, definitely try them out.

- 2ae1e0b8
- This is where things get interesting. Security pins are more common starting from here and up, occasionally pin counts are also pumped up. Ideally you should polish your basic skills on this belt.
- [American Lock 1100](/#/locks?id=2ae1e0b8&name=American_Lock_1100___A1100) is a classic green belt lock. It has 5 pins, with mixed serrated and spool driver pins. It really teaches you to master your jiggle test skills, along with picking serrated pins. The core kinda wobbles inside the padlock body which adds a challenge.
- [ABUS 72/40](/#/locks?id=74a00ae3&name=ABUS_72_40) and [Brady 71/40 LOTO](/#/locks?id=9da8ebe0&name=ABUS_Brady_71_40_LOTO_Lock_Out_Tag_Out) locks are both good locks from ABUS. The 72/40 has a metallic body and a pretty challenging keyway for inexperienced pickers. The 71/40 has a plastic body with the ‘ABUS’ keyway, which looks intimidating but in fact a wide open keyway. Both locks are pinned the same way, 1 standard pin and 5 spools. These 2 locks will teach you well on picking spools, tension control while counter-rotating and more.

- 96591a8f
- The real fun begins! This is also where you should introduce yourself to the discord bazaar in my opinion, as locks from this belt and above will not be easy to grab from Amazon or your local hardware store.
- [DOM Plura](/#/locks?id=96591a8f&name=DOM_Plura) is a nasty lock. Even I spent a few days opening this lock, it puts up surprisingly well. The keyway looks intimidating but is wide open in the middle so it’s not a real issue. It introduces you into tapered pins, which can be exhausting to pick them. It also has some real crispy spools. This lock really tests you if you have your jiggle test skills well mastered, if you can pick this, you can consider yourself as a proud picker!
- The [DOM RS Sigma](/#/locks?id=1dd28bf9&name=DOM_RS_Sigma) is similar to the Plura, just with a different keyway. The pinning is also similar with tapers and spools so acquire either of these locks to your preference.
- [GOAL S](/#/locks?id=959a6b9d&name=GOAL_S) is a 5 pin Japanese lock, some people from the bazaar have these locks in hold. It has thin lipped spools that give very clear feedback. It’s a smooth pick, I highly recommend trying it out.
- [Lockwood 334B45](/#/locks?id=331c9d36&name=Lockwood_334B45_356S63_214A40_215A40_270S70) is an Australian classic. It has a bit of a challenging keyway to navigate through, and 5 really fat lockwood spools. These spools give real crisp and clear feedback, it’s such a fun lock to pick. Quite some people recommend the Paclock 90A Pro, but I personally don’t. It usually doesn’t come in great quality which makes it not fun to pick. The wobbling core also decreases the fun.

- 45e3cde7
- New features are introduced in this belt. A new type of security pins, milling, secondary locking mechanism and sidebars... you name it. Introduction of barrel pins and matching milling on the core. Learning how to pick barrels will be essential on higher belt locks, so you gotta practice! It could be challenging at first, try learning how the picking process goes.
- [Medeco Original/Biaxial](/#/locks?id=826c31e0&name=Medeco_Original_Biaxial_M3) introduces you to a secondary locking mechanism linked with a sidebar. Not only do you have to lift pins to a certain height, you also gotta rotate pins to a certain degree! This lock requires you to learn a new skill of rotating pins, which to be honest will only be used on a few certain locks. But it still is a fun and interesting lock to try out, I recommend it.

- 1459e2c6
- This is where some of the most wacky but fun locks dwell. Many wonders have the brown belt assigned to themselves…
- [ASSA Desmo](/#/locks?id=1459e2c6&name=ASSA_Desmo) is one of my favorite locks. Locks I’ve mentioned so far are all pin tumbler locks, but the Desmo is an exception. Desmo is a slider lock with 4 sliders on each side associated with a sidebar. It’s a unique lock and is pickable with standard pin tumbler tools(Tension tools and hooks), I really recommend this lock. Some principles you’ll learn while picking this lock can be used later on some black belt locks that I’m about to recommend.
- [GOAL P](/#/locks?id=a1233156&name=GOAL_P) is a Japanese wonder. It has 6 pins, drivers are thin lipped gin spools, and the key pins are torpedo shaped overset traps. The core also has matching milling for the driver pins, and the lock has great tolerances making it fairly tricky to pick. The installed ball bearing centers the core so it assists while picking the pins, so you need some good tension control and good jiggle test skills to pick open this lock. This lock also is a somewhat powered down version of a black belt lock I’ll mention later, so this will be good practice preparing for it.

- 29ab2852
- This is the final step before getting black belt. Most red belt locks are essentially powered down black belt locks, but there are some unique locks that are worth trying. I’ll try to keep the recommendations as preparation for the upcoming black locks.
- [ASSA 600 (Gin Spools)](/#/locks?id=29ab2852&name=ASSA_600___Ruko_600) is a good introduction to gin spool pins. When we mention gins, we are most likely referring to ASSA gins. They have a unique shape and matching milling which makes it an interesting pick. You’ll have to learn a technique called float picking, where you precisely control the rotation of the core to set the gin spools. It’s really fun once you get the hang of it, and picking gins will prepare you for picking more advanced black belt locks.
- [Robur 2391 Safe Deposit Lock](/#/locks?id=9da7a5f2&name=Robur_2391_Safe_Deposit_Lock) (Both Barrels and Gins) is the real preparation for the black belt options I’m about to mention. These locks have 5 pins and 4 sidepins with a sidebar. Drivers come with either gins or barrels, and each version has its own matching milling. Sidepins are like the desmo sliders, but these are sprung. Again, this will be a good preparation for the upcoming black belt locks.

- 55053299
- The final belt that awaits you. Black belt locks are a black belt for a reason. But do not be afraid, if you learned and mastered your skills enough while climbing up until here, you’ll eventually open these locks.
- [ASSA Twin 6000 (Both Barrels and Gins)](/#/locks?id=55053299&name=ASSA_Twin_Exclusive_Twin_6000) is one of my favorite lock series. It has 6 pin stacks, drivers are either gins or barrels with matching milling. Addition to that there also are 5 sidepins that interact with the sidebar. The Robur mentioned at the red belt is essentially a weaker version of this lock. The principle is simple, you just pick the central pins and the sidepins and the lock shall open. But easier said than done, this lock is no joke. It has good tolerances, and sidepins combined with other security pins is gonna be tricky at first. The sidebar will assist a bit on floating so if you get used to the feeling, you’ll be able to open them. The sidepins are also pickable using normal hooks like flags, so that’s that. They are shaped like desmo sliders, and pick generally the same way.
- [Bilock](/#/locks?id=e3058619&name=Australian_Lock_Co_BiLock) is another Australian classic. It has a total of 12 sliders, 6 on each side. While these are technically classified as sliders, they are sprung and work like normal pins. They just have to be lifted to a certain height, and will bind up when needed to be lifted just like normal pins. You can’t jiggle test them like normal pins though, you need to scrub the pins to see if they have any motion. If you get the general hang of this, the Bilock will be no problem to you.
- [GOAL Z](/#/locks?id=5103e650&name=GOAL_Z) is the ultimate Japanese monster. Upgraded from the GOAL P, it has 7 pin stacks, matching milling and thin lipped spool drivers, torpedo key pins. The amazing tolerances this lock has, combined with all the other security features make this lock a true beast, hard to defeat. There is a reason this 7 pin not-special-looking lock is in fact a black belt lock. Depending on who you get this lock, you might be able to get both a red and black pinned version, with the only difference being the number of standard drivers. My personal suggestion is just go straight to the black version, and work your way through.
- [ASSA 700](/#/locks?id=f133510b&name=ASSA_700) is another beast, but with its own characteristics. Similar to the Goal Z, this lock has matching milling on the core, torpedo key pins. Drivers consist of tapered pins, gins, and tree pins, which makes this lock special. The number of trees make the belt level of this lock vary from red to black also. Once you solve the puzzle of setting trees and gins, you’ll be able to open this lock at last. Float picking and gin picking principles that you’ve learned throughout the journey will finally pay off.

>And that’s about it. Just for your information, my route to black consists of the following:
>1. Lockwood 334B45 for Blue (I started from blue as mentioned earlier)
>2. Medeco Biaxial and ASSA Desmo for Purple (The desmo was a brown lock, but I used for purple)
>3. BEST SFIC with security pinning and ASSA Desmo for Brown (Reused the desmo. SFIC was used because that was what I only had back then, but I don’t recommend using it for belts)
>4. ASSA Twin 6000 with barrels and milling and Bilock with unmastered 12 sliders for Red and Black (Used same video for both red and black, difference is that black also includes 2 quests that I did, but this part is not important for this writing)
>
>Looking back what I’ve written, I may have gone a little bit heavy on information lol. If you have any general questions about the recommendations, or lock specific questions (how to pick this and stuff like that), ask me on the LPU discord anytime.
>
>**Thanks for reading!**

###### *Originally published Jan. 17, 2025*`,ee=`# Five is Binding

>*Editors note: Not a Path to Black, but a **six** lock Black Belt submission from back in the day when those were rare. Five is Binding may no longer be active, but his all ASSA Twin request is legendary. Keep in mind that each lock needs to be from it's own line/entry in the ranking list! I've put this together from his request and posts on Discord.*
>
> **005's Assa Twin Difficulty Ranking** (based on my experience with one example of each lock).
> 
> From hardest to less hardest:

- c8694f3a
- [V-10 w/ gins](/#/locks?id=c8694f3a) - It didn't isolate sides. Complicated learning to partially set the sidebar, push up gins, finish sidebar, float remaining gins. Also, a more restrictive keyway.

- 104776ef
- [6k w/gins](/#/locks?id=104776ef) - Did isolate sides. The 6k sidebar sometimes requires carefully backing off tension to lift the sidepins to the next gate. Setting gin spools without dropping sidepins required a lot of precision and practice.

- 7168d463
- [Twin Combi](/#/locks?id=7168d463) - Mine isolated but I hear many do not. The finger pins gave good feedback for determining the pin states. Required some tension finesse to turn the finger pins when they were binding hard. Keyway allowed for a .025 pick to set the barrels.

- 55053299
- [Twin 6k (barrels)](/#/locks?id=55053299) - Isolated sides. This was less hard than the gin version because dropping barrels while setting the sidebar wasn't a problem. The sidebar is still trickier to execute than the V-10 or the Baltic versions.

- 3f73d2ce
- [Twin V-10 (barrels)](/#/locks?id=3f73d2ce) - Isolated sides. The sidepins can be pushed up without having to back off tension much like the 6k. The keyway is more restrictive making the barrels more challenging to pick than the Baltic.

- f7ad4c89
- [Baltic Twin Exclusive](/#/locks?id=f7ad4c89) - Isolated sides. The sidebar picked similar to the V-10, perhaps requiring a bit more tension variation. But the keyway is more open and allowed for a .025 pick, making for a less hard time picking the barrels.

###### *Original request Mar. 11, 2023*`,te=`# SkylerMiner

>Hello! I started completely fresh to lock picking in December 2023 after a gift of a CI genesis kit with practice lock after expressing some interest in it. Otherwise, I was in the middle of finishing my degree with just about 1 year left till I was done, so this didn’t get my absolute full attention.

- b22bdd44
- The only lock that I did for this was really my CI practice lock trainer. And, well, I wouldn’t recommend it knowing what I do now it did make it really approachable to try pinning and get the initial feel of a lock. In this I practiced until I could do 5–6 pins with serrated and spools and mixtures within the first couple days of having my kit.

1. c7d2eca1
2. (I skipped Yellow Belt.)

- efc01233
- My first "actual" lock was the good ol' ML150. Nothing but good spools in here with a standard. I did this around a day or two after getting my practice lock. This lock really cemented what I was “guessing” about spools from the practice lock, and I think I got it open within the first 1 or 2 days that I played with it, cementing my first submitted belt to the discord

- 2ae1e0b8
- I did three locks for this with my first being the American Lock 1100. This lock was my first green belt lock that I immediately started to try to tackle after the ML150. It greeted me warmly with an open in the first 30 minutes which I then got promptly punished with all future attempts taking 1–2 hours. This really cemented spools, but otherwise I was “feeling” but not really understanding the nuances of the pin states. It also was the first lock I bricked completely during reassembly, teaching me a valuable lesson. After picking this lock, I promptly ordered multiple replacement cores, an ABUS 72/40 and multiple used Master Lock 410s.
- [**ABUS 72/40**](/#/locks?id=74a00ae3): Extremely fun lock to play with giving great spool feedback with some generosity on setting order of the spools. At this point I was cycling through multiple AL1100 and the ML410s, so while fun, it didn’t teach me anything new at this point.
- [**Master Lock 410 LOTO**](/#/locks?id=c942490e): This lock I received was used and gunky but extremely cheap. This lock put up quite a fight being dirty and gave subtle feedback and extremely deep sets for the spools. Paired with a tighter keyway than I was used to at this point made this one of the harder locks I had at the time. I had three that I cycled through until I could get them consistently.

- fb5a9eb7
- This lock can also be referenced as the big cousin to the AL1100. Nothing new learned, but at this point I understood what set vs. unset was and consistently identifying that in locks I was picking. That made this lock a good challenge. I think it took me a few hours to get open the day that I picked it up.

- 06ddb074
- First, I tried to apply direct sidebar tension through the change key port, but that I find is much harder than shimming, but was the first lock that required me to build a tool for. For this lock if you build a shim, you can get away with memorizing where you should place the sliders and the shim will then insert further. At this point I didn’t really understand slider feedback as I was just reacting to shim/tension feedback. (I have since revisited this lock and GenI/II since I enjoy sliders and found it much, much easier) 

- 826c31e0
- This lock took me a few weeks with me really enjoying CCW feedback and getting my ass kicked by a front barrel that would drop all the previous stacks. This lock was my first foray into actually understanding slider feedback by way of the sidebar mechanism, with the top stacks being difficult but not overly so.

- a1233156
- This lock is fun. That being said, I love using heavy tension, but my lock really preferred extremely light tension. This lock required a light touch and gave great feedback and really gave me a run for my money. As well as losing the small ball bearings, I would recommend this lock to anybody who wants an extremely pure PT experience without the cost of multiple days of their sanity. This lock is where it finally cemented pin states and what I was feeling in the lock while picking. This lock was extremely fun to pick.

- 1459e2c6
- I picked this lock up keyless as I thought it would be a fun challenge and worked on it on/off during getting my brown/purple belt. (I didn’t record it, so I didn’t use it to submit for brown). This lock taught me a ton about sliders, and I would recommend it to anybody who eventually wants to do things like ASSA 6k, Assa V10 or multilock. This lock ate up many hours of frustration because I couldn’t PP the lock. Eventually getting it open made me feel less like a fraud (I could actually open a difficult lock without the key.) It was a completely different mechanism to what I was familiar with at this point.

- 29ab2852
- I skipped Red, but I did pick one unrecorded for prep for my black belt locks. No, I did not enjoy this lock I had to PP it to open it once, then I had to PP it again to open it another time. I do not enjoy this lock, but it did somewhat cement gin states into my head, and it also taught me I like sliders better than the nonsense PT is at BB levels. That aside, it is a great lock to learn gins on, and it does not hold back at all and really makes you work for open you get on it. I would recommend it for learning, but it's not a lock I like coming back to.

1. 5103e650
2. I picked four black belt locks for my application, you’ll probably notice a slight trend in what type of lock I tackled with hopefully the previous Brown/Red painting a picture. With one quest which was safecracking which has a completely separate writeup which is ok to link here that said let's get into the locks.

- 55053299
- This lock was my first black belt lock picked\\! In this I had to progressively pick both elements of the lock so sidebar and top stack separately, taking I think 2–3 weeks to get my first open. The sidebar is slider-based and extremely tight tolerances. It has similar feedback to the Desmo for pin state luckily my top/side stack isolated to once I got my bearing on barrels and the sidebar, this actually wasn’t too bad of a lock to pick. My first recorded open was 1+ hours that needed a refilm that I shaved down to 13 minutes.  This lock is fun if you like the sidebar mechanism and don’t mind getting past the barrels.

- 104776ef
- This lock was my second Black Belt lock. At this point I only needed to progressively pin the top stack as I understood the sidebar mechanism at this point. After that it was actually a relatively fun pick with some mixed sidebar/top stack picking. If you’re unfamiliar, this lock picks in three states. First, setting the gins into their milling → setting the sidebar → setting the gin heads. Mine didn’t isolate perfectly, so I would have to tackle the sidebar again after dropping some sidepins while setting gin heads. This was a fun lock and doesn’t require true floating as the sidebar has a spring\\!. If you understand gins and don’t mind the difficulty of the sidebar, this is a fun pick.

- 3f73d2ce
- By now you may have seen a pattern in the sidebar mechanism I got comfortable with. This was my fastest open and required no PP. Nothing really new learned here, and this lock is easier than the ASSA 6k twin barrels as the top stack is extremely similar and the sidebar doesn’t require any precise float picking to secure an open. If you like the previous two locks, this one is easy to pop open.

- 5103e650
- This lock was a quite fun challenge requiring me to take a step back and really cement in feeling set vs spool feedback as the torpedo keypins are killer in this lock. You can still set some top stacks after getting set in a torpedo, which can result in a loop you can’t pick out of. This lock is also a lot of small ping-ponging the pin up past the milling and was quite a relief to get into as I was trying to get everything recorded. 

1. 5103e650
2. I will say anytime you get a first open while recording these black belt locks is extremely nerve-wracking and refilms are not fun and sometimes take longer than the initial filming. It is a rush to get the open and finally be able to use it for the BB app.

>This whole journey to Black Belt was from Christmas 2023 through May 24th 2024. I will say if you’re worried about price, the journey I took was specifically made with that in mind (poor college student.) The priciest lock being Goal Z (70$) at the time of purchase, which I sold back to buy more new locks with most locks purple+ averaging around 30$ a lock. Which is on the cheaper side for BB locks. After I got BB I have branched out into some HPC dimples (I don’t enjoy them as much). DD locks (Quite fun but need a toolmaking station) and tackled more slider-based locks including Multilock and Miwa U9. If you need U9 help, feel free to DM me on Discord. It is probably my favorite lock at this point.

`,oe=`# TonySanSan

>Let me tell you about a little-known problem in locksport. Some of us find it hard to resist filling up our workspace with drawers full of tools and buckets overflowing with locks, eliciting fear from our bank accounts and alarm from our loved ones. The LPU Belt System came to my rescue, with one simple additional rule: I vowed to only buy new lock stuff upon being granted the next belt. This led to some interesting lock choices over the course of my journey, which I now present for your entertainment.

- 2455f0ae
- I’m glad I put my gritty white belt [Master Lock #1](/#/locks?id=5a91e6a5) aside for the [Master Lock 140](/#/locks?id=2455f0ae). What a perfect first lock. Although I didn’t know any better at the time, I got one with standard driver pins (look for the 1234BC stamp). Clear, crisp feedback that taught me the basics. My tools were junk, but as I acquired more, I would always go back to my 140 to try out a new pick or tensioner. 

- 632f4069
- I got my first legit pick set from Law Lock Tools, with some TOK pry bars that I soon grew to love. The [ABUS 55/40](/#/locks?id=632f4069) is a gentle introduction to spools. I learned about true binding order as I worked out how to pick this lock while avoiding false sets.

- 74a00ae3
- Two things were bothering me. First, I wasn’t able to take any of my locks apart to see how they work. And second, I couldn’t understand why folks cared about pick thickness. The [ABUS 72/40](/#/locks?id=74a00ae3) is both a challenging first reassemble (long springs) and has a tight keyway that encourages thinner pick choices. Of course, I needed to acquire all the gutting tools and a whole new set of picks to really get to the bottom of this thickness thing.

- f97700ff
- Locks are starting to look weirder, and I was eager to see what dimples were all about. The [ABUS D6](/#/locks?id=74a00ae3) was ranked blue at the time, but more importantly it was easy to acquire. I needed flags, so my whole green belt reward budget went to the epic MultiPick set. Buy once and cry once... these flags have stayed with me for my whole journey.

- 41f9efa2
- Because the MP flags set me back so much, I kept it on the cheap for purple, as these locks are easy to come by in the US. While not strictly necessary, I learned to float pick on the [Kwikset SmartKey Gen 1](/#/locks?id=41f9efa2), which proved to be a valuable skill for the future. And I made my first tool (sidebar shim) for the [Kwikset SmartKey Gen 3](/#/locks?id=06ddb074), which gave me some confidence in thinking outside the box -- and which failed to impress me with how powerful a reverse sidebar can be when implemented correctly.

- 5329b0f3
- Magnets! While it doesn’t require much skill to glue a magnet onto a piece of metal, this was my first custom pick.  And the [Ankerslot Infinity K](/#/locks?id=5329b0f3) that I used it on was my first euro cylinder, so I learned the joy of segmented followers (related to the joy of bricking). The [Mako M-2 SFIC](/#/locks?id=b13f4b57) was a great bit of fun working both shear lines with all the crazy driver pins in there. And my biggest lesson in humility didn’t make my belt request: I had bought a [LIPS Octro](/#/locks?id=514c7ec4) high pin count lock, but botched the gutting so badly that I had to come back to it later. 

- b8350901
- I realized I’ve been avoiding things that rotate, like discs and pins. And I really wanted to get my toolmaking game on. So, enter the [ABUS Plus (with butterflies!)](/#/locks?id=b8350901), for which I stocked up on hardware and made a custom nose for the Sparrows disc detainer pick. And welcome the [Corbin Russwin Emhart](/#/locks?id=c4f942f0), for which I played with all sorts of notched picks (stock and custom) to turn those pins.

- 104776ef
- Close to black, I was feeling self-conscious about my gaps, so I found 4 locks to cover some bases. I chose the [ASSA Twin 6000](/#/locks?id=104776ef) for the infamous gin drivers, [Abloy Sentry](/#/locks?id=2ae6a691) so I could make a custom disc detainer pick, [EVVA 3KS](/#/locks?id=f7452b9f) for a real slider lock (very different than Kwikset), and the [Tann Detector](/#/locks?id=69668831) for my first lever lock. So it was that at the end of my belt journey, I found my favorite lock. I have since picked every lever lock I could get my hands on, and the hundred fancy picks I’ve acquired sit in drawers as I make my tools from cheap piano wire. It turns out I don’t have a good solution for the drawers and the buckets. But for me the lesson is that if you steer towards things that are new and interesting, you may be surprised by what goodness you find. Good luck on your journey!  

>**Black Belt Epic Quest**
>
>They didn’t let me into the dojo with just 4 black belt locks. I also cracked the [S&G 6741](/#/dials?id=8a2dc6e5&name=Sargent__Greenleaf_6741) combination lock. It’s a bit mind blowing to a pick a lock with graph paper.

>**Beyond Black Belt**
>
>We rank black belt locks by five levels, and the engineering marvels that are the [Black Belt 5 locks](#/locks?tab=search&filterBelts=Black+5) have both fun to offer and patience to teach. See how crossing a disc detainer with a pump lock gives you the [Fichet F3D](/#/locks?id=c0af45f4). Put a reverse sidebar to good use by overpowering the springs for a dozen sliders in the [Yuema 750](/#/locks?id=0b604114). And there are so many of my favorite lever locks, with all the tricks they can do... Share a leaf spring across levers so one requires great force and its neighbor will overset when you brush against it ([Western Electric 30B](/#/locks?id=e718b140)), or employ a blocker that locks the levers in place before their gates can be tested ([Western Electric 30C](/#/locks?id=5a4310d5)). The NATO Mersey takes the opposite approach, locking everything up for applying too much tension, requiring creative compression and tilting to either avoid brutal false gates ([10 lever Mersey](/#/locks?id=4f2ed774)) or to herd all the levers in place without dropping any ([14 lever Mersey](/#/locks?id=f29a212f)). And then we have the Kromer Protector, where touching anything can impact everything else, and even the simpler models ([non-BP55K Kromer Protector](/#/locks?id=50a463eb)) are formidable. Throw in some curtains and a lot more split wafers and you have the [BP55K Kromer Protector](/#/locks?id=f87db705), which in my experience is the hardest lock to pick out of all the currently ranked BB5s. So there is good news ahead -- the road surely does not end at black! 
`,b={nixxed:{content:Q,title:"NiXXeD",description:"A classic pin-tumbler path to black. First of the series from lpubelts founder NiXXeD."},mgsecure:{content:X,title:"mgsecure",description:"A path to black comprising all dimple locks from another founding member of the lpubelts team."},peace:{content:$,title:"PeaceWeapon",description:"Path to black filled with recommendations from our eloquent, if sometimes verbose, dear friend Peace."},dynamic:{content:Z,title:"Dynamic",description:"Another take with tons of recommendations from South Korean Black Belt Dynamic."},fiveisbinding:{content:ee,title:"Five is Binding",description:"Not a full path, but a *six* lock, all ASSA Twin Black Belt submission."},skylerminer:{content:te,title:"SkylerMiner",description:"Lots of details from their zippy path to Black Belt."},tonysansan:{content:oe,title:"TonySanSan",description:"LPU guru TonySanSan takes us on a journey, not just to Black Belt, but to the Kromer Protector -- one of the most difficult locks in the world."}};function ie(){const c=L(),I=C(),{pageId:p}=O.parse(I.search),x=u=>{const k=window.open(u,"_blank","noopener,noreferrer");k&&(k.opener=null)},S={maxWidth:700,marginLeft:"auto",marginRight:"auto",padding:"6px 20px",borderRadius:0},T={color:"#eee",textDecoration:"underline",cursor:"pointer","&:hover":{color:"#fff",textDecoration:"underline"}};return e.jsxs("div",{style:{margin:8,paddingBottom:32,marginLeft:"auto",marginRight:"auto",marginTop:16,marginBottom:16},children:[!b[p]&&e.jsx(l.Fragment,{children:e.jsxs("div",{style:S,children:[e.jsx("div",{style:{marginBottom:24},children:`We've asked advanced pickers to share their view of a "Path to Black", tracing the steps of rising through the LPU Belt Rankings. Some have shared the actual locks they submitted along the way while other have taken the opportunity to explore options around a specific theme. Most include an array of recommendations for each belt.`}),Object.keys(b).map(u=>e.jsxs("div",{style:{marginTop:16,maxWidth:650},children:[e.jsx(v,{onClick:()=>{c(`/pathtoblack?pageId=${u}`)},style:{fontWeight:600,fontSize:"1.1rem"},sx:T,children:b[u].title}),e.jsx("br",{}),b[u].description]},u)),e.jsxs("div",{style:{marginTop:30,borderTop:"1px solid #fff",paddingTop:16,fontSize:"0.95rem"},children:["A great source for higher-belt locks is the #lock-bazaar channel on the LPU discord. You can browse/search/filter listings from most of the major sellers at: ",e.jsx(v,{onClick:()=>x("https://lpulocks.com/#/lockbazaar"),sx:T,children:"lpulocks.com/#/lockbazaar"})]})]})}),b[p]&&e.jsx(J,{page:b[p]})]})}function Ie(){M("Path To Black");const c=e.jsx(l.Fragment,{});return e.jsx(U,{filterFields:V,children:e.jsxs(Y,{allEntries:q,children:[e.jsx(z,{title:"Path To Black",extras:c}),e.jsx(ie,{}),e.jsx(E,{}),e.jsx(F,{feature:"pathtoblack"})]})})}export{Ie as default};
