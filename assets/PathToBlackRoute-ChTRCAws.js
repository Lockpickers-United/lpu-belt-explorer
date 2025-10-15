import{b as j,r as P,j as e,u as _,L as m,R as d,an as D,O as M,e as O,a8 as U,N as C,h as z,T as q}from"./index-C8JhLQMS.js";import{u as L}from"./usePageTitle-Bsqu3bvE.js";import{B as E}from"./BeltStripeMini-CIW384S5.js";import{D as F}from"./DataContext-DtyHY-ya.js";import"./index-DTPTfajd.js";import{e as R}from"./entryName-vfkDiRQM.js";import{M as W}from"./index-BtCCvJdJ.js";import{r as G}from"./index-BZ11CLj1.js";import{r as N}from"./index-C7dEbtfc.js";import{B as H}from"./Box-CVEEJ3yz.js";import{D as J}from"./LockDataProvider-CybvRXZl.js";import{l as K}from"./filterFields-5nGkCWxa.js";import"./collectionStatsById-DY1NVZ7h.js";import"./useData-D3hwABwS.js";import"./dataUrls-DkJe4Pqg.js";import"./filterEntriesAdvanced-B_LinbMH.js";function Y({page:o={}}){o!=null&&o.title&&L("Path to Black: "+(o==null?void 0:o.title));const g=j(),{getEntryFromId:p}=P.useContext(F),f=c=>{g(`/locks?id=${c}`)},x=({idChildren:c,descriptions:y=[]})=>{var S,B;const A=d.Children.toArray(c).map(h=>{var I;return typeof h=="string"?h:((I=h==null?void 0:h.props)==null?void 0:I.children)??""}).flat().join("").trim(),t=p(String(A))||{},w=R(t,"any",{includeVersion:!1}),n=t!=null&&t.belt?t.belt==="Unranked"?"Unranked:":t.belt.replace(/ \d/,"")+" Belt:":"",v=(t==null?void 0:t.media)||[{}],T={color:"#ddd",textDecoration:"underline",cursor:"pointer","&:hover":{color:"#fff"}},{isMobile:r}=_(),l=r?85:150,s="1.0rem",a=r?"1.1rem":"1.2rem",k=r?"6px 16px 0px 0":"6px 24px 0px 0";return e.jsx(d.Fragment,{children:e.jsxs("div",{style:{...i,display:"flex",alignItems:"stretch",position:"relative",backgroundColor:"#222",padding:"16px 32px"},children:[e.jsx(E,{value:t==null?void 0:t.belt,style:{position:"absolute",top:0,left:0,bottom:0}}),e.jsxs("div",{style:{display:"flex",flexDirection:"column",alignItems:"stretch",position:"relative"},children:[e.jsxs("div",{style:{fontWeight:600,fontSize:a,marginBottom:8},children:[n," ",e.jsx(m,{onClick:()=>{f(t.id)},sx:T,children:w})]}),e.jsxs("div",{style:{display:"flex"},children:[!r&&((S=v[0])==null?void 0:S.thumbnailUrl)&&e.jsx("div",{style:{margin:k},children:e.jsx(m,{onClick:()=>{f(t.id)},children:e.jsx("img",{style:{width:l},src:(B=v[0])==null?void 0:B.thumbnailUrl,alt:w})})}),e.jsx("div",{children:y.map((h,I)=>e.jsx("div",{style:{marginBottom:8,fontSize:s},children:h},I))})]})]})]})})};function b({markdown:c}){const{isMobile:y}=_(),A="1.0rem",t=y?"1.5rem":"1.7rem",w={fontWeight:400,color:"#888",textDecoration:"none",cursor:"pointer","&:hover":{textDecoration:"underline",color:"#fff"}};return e.jsx(W,{components:{ul:({children:n})=>{const v=s=>d.Children.toArray(s).map(a=>{var k;return typeof a=="string"?a:((k=a==null?void 0:a.props)==null?void 0:k.children)??""}).flat().join("").trim(),T=d.Children.toArray(n).filter(d.isValidElement),r=[];let l=null;return T.forEach(s=>{const a=v(s.props.children);if(!!p(String(a)))l&&r.push(l),l={idChildren:s.props.children,descriptions:[]};else{if(!l)return;l.descriptions.push(s.props.children)}}),l&&r.push(l),e.jsx(e.Fragment,{children:r.map((s,a)=>e.jsx(x,{idChildren:s.idChildren,descriptions:s.descriptions},`ld-${a}`))})},blockquote:({children:n})=>e.jsx("div",{style:{...i,fontSize:A,alignItems:"stretch",position:"relative",backgroundColor:"#2a2a2a",borderBottom:"1px solid #000",padding:"12px 18px 6px 18px"},children:n}),p:({children:n})=>e.jsx("div",{style:{marginBottom:12,lineHeight:"1.5em"},children:n}),h1:({children:n})=>e.jsxs("div",{style:{...i,fontSize:t,fontWeight:700,backgroundColor:"#2a2a2a",padding:"8px 0 0 18px",borderBottom:"none"},children:[e.jsxs(H,{component:"span",style:{fontWeight:400,color:"#666",fontSize:"1.2rem"},children:[e.jsx(m,{sx:w,onClick:()=>{g("/pathtoblack")},children:"path to black"})," > "]}),e.jsx("nobr",{children:n})]}),h6:({children:n})=>e.jsx("div",{style:{...i,textAlign:"right",fontSize:"0.85rem",padding:"8px 8px 0 18px",borderBottom:"none"},children:n})},remarkPlugins:[N],rehypePlugins:[[G,{target:"_blank",rel:["nofollow","noopener","noreferrer"]}]],children:c})}const i={maxWidth:700,marginLeft:"auto",marginRight:"auto",padding:"6px 20px",borderBottom:"1px solid #333",borderRadius:0};return e.jsx("div",{style:{margin:6},children:e.jsx(b,{markdown:o.content})})}const V=`# mgsecure

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

###### *Originally published Sept. 21, 2023*`,X=`# NiXXeD

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

###### *Originally published Sept. 19, 2023*`,Q=`# PeaceWeapon

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

###### *Originally published Jan. 17, 2025*`,$=`# Five is Binding

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

###### *Original request Mar. 11, 2023*`,u={nixxed:{content:X,title:"NiXXeD",description:"A classic pin-tumbler path to black. First of the series from lpubelts founder NiXXeD."},mgsecure:{content:V,title:"mgsecure",description:"A path to black comprising all dimple locks from another founding member of the lpubelts team."},peace:{content:Q,title:"PeaceWeapon",description:"Path to black filled with recommendations from our eloquent, if sometimes verbose, dear friend Peace."},dynamic:{content:Z,title:"Dynamic",description:"Another take with tons of recommendations from South Korean Black Belt Dynamic."},fiveisbinding:{content:$,title:"Five is Binding",description:"Not a full path, but a *six* lock, all ASSA Twin Black Belt submission."}};function ee(){const o=j(),g=D(),{pageId:p}=M.parse(g.search),f=i=>{const c=window.open(i,"_blank","noopener,noreferrer");c&&(c.opener=null)},x={maxWidth:700,marginLeft:"auto",marginRight:"auto",padding:"6px 20px",borderRadius:0},b={color:"#eee",textDecoration:"underline",cursor:"pointer","&:hover":{color:"#fff",textDecoration:"underline"}};return e.jsxs("div",{style:{margin:8,paddingBottom:32,marginLeft:"auto",marginRight:"auto",marginTop:16,marginBottom:16},children:[!u[p]&&e.jsx(d.Fragment,{children:e.jsxs("div",{style:x,children:[e.jsx("div",{style:{marginBottom:24},children:`We've asked advanced pickers to share their view of a "Path to Black", tracing the steps of rising through the LPU Belt Rankings. Some have shared the actual locks they submitted along the way while other have taken the opportunity to explore options around a specific theme. Most include an array of recommendations for each belt.`}),Object.keys(u).map(i=>e.jsxs("div",{style:{marginTop:16,maxWidth:500},children:[e.jsx(m,{onClick:()=>{o(`/pathtoblack?pageId=${i}`)},style:{fontWeight:600,fontSize:"1.2rem"},sx:b,children:u[i].title}),e.jsx("br",{}),u[i].description]},i)),e.jsxs("div",{style:{marginTop:30,borderTop:"1px solid #fff",paddingTop:16,fontSize:"0.95rem"},children:["A great source for higher-belt locks is the #lock-bazaar channel on the LPU discord. You can browse/search/filter listings from most of the major sellers at: ",e.jsx(m,{onClick:()=>f("https://lpulocks.com/#/lockbazaar"),sx:b,children:"lpulocks.com/#/lockbazaar"})]})]})}),u[p]&&e.jsx(Y,{page:u[p]})]})}function fe(){L("Path To Black");const o=e.jsx(d.Fragment,{});return e.jsx(O,{filterFields:K,children:e.jsxs(J,{allEntries:U,children:[e.jsx(C,{title:"Path To Black",extras:o}),e.jsx(ee,{}),e.jsx(z,{}),e.jsx(q,{feature:"pathtoblack"})]})})}export{fe as default};
