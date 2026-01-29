import{b as L,r as n,A as I,u as E,j as e,R as s,N as z,B as l,ba as B,h as F,T as D,bb as y}from"./index-ByhYnpmy.js";import{u as M}from"./usePageTitle-FQus4fxP.js";import{R as O}from"./RaffleHeader-BbbRcTMn.js";import{R as W}from"./RaffleSubHead-D60an2-7.js";import{A as H}from"./AdminToolButtons-BRniDIEF.js";import{S as N}from"./SignInDetect-CMV_YZOx.js";import{R as q}from"./RaffleContext-DjZxisTp.js";import{M as x}from"./index-B4gV0IvQ.js";import{r as b}from"./index-CPXRrRtC.js";import"./Cached-B6MvbvJr.js";import"./ExpandMore-HpuWa7tl.js";import"./CircularProgress-ZWpPLBHg.js";import"./dataUrls-DVxTtpO-.js";import"./index-B9ygI19o.js";import"./Box-BLa8fVZi.js";import"./AccordionSummary-Dn60bO3I.js";import"./Collapse-1QmS-qSv.js";import"./EmojiEvents-UHLNBOG_.js";import"./ScopedDialog-C0Y-VfL1.js";import"./Cancel-BEHuj470.js";import"./Dialog-gLI6kHWv.js";import"./Zoom-B0VGydhl.js";import"./useData-CZVu0kbx.js";import"./index-BMTIbjnl.js";import"./setDeep-J6HEwWhX.js";const G=`Everyone's favorite /r/lockpicking and LPU tradition is back! Welcome to the 2026 Lockpicking Charity Raffle.

**Ticket entries will be accepted from Monday, January 19th through February 15th, and the primary prize drawing will happen via livestream at 11 a.m. PDT on Monday, February 16th.**

----

`,_=`----

### How to participate

1. Select an [**approved charity**](/#/rafl/charities) to donate to. If there's too many to choose from, feel free to ask for suggestions.

2. Donate! Please take a screenshot of some proof that the donation was accepted and valid. That screenshot must include a visible date or it cannot be accepted!

3. Get an image hosting link to your screenshot by uploading it to https://imgur.com/ or similar.

4. Check out the [**list of prizes**](/#/rafl)

5. Go to the entry form to specify your charity, add the link to your screenshot, and [**allocate your tickets among the pots**](/#/rafl/entryform).

6. You’re done! A raffle organizer should contact you on your platform of choice to notify you that your submission was either approved or requires an adjustment.

----

### Rules

Each US dollar equivalent (rounded down) donated counts as one “ticket” in the drawing.

Members of the raffle team with access to internal info about donations are not allowed to participate. This is done to ensure that the process remains fair.

There is a maximum prize limit of 3 that can be won by a single individual. We love it when people donate big, but we also want to make sure that the field does not get swept by a small number of individuals.

### How the prize limit works:

Anyone can put as many tickets on as many different pots as they want.
The drawing will occur as normal with no changes.

Anyone who wins a number of pots above the limit will need to choose which ones they would like to keep.

All of the unkept pots will be placed back into circulation and redrawn in a second stream that will occur during the evening of Monday, February 16th.

Anyone who goes above the pot limit during the secondary stream will have until the end of the stream to specify what they would like to put back into circulation, or the last pot(s) they won will be redrawn by default.

### Shipping costs

Important: Take note of the origin locations and shipping notes next to each prize. Prizes that are not labeled as “international shipping included” will require any international shipping to be paid entirely or partially by the winner. Prizes listed as “Domestic only” will not be shipped internationally.

-----

An extra big thanks as well to the 49 prize contributors who made it possible for us to have nearly 70 prizes this year: 4550, AlmightyOx, Amvgaert, andrex66IT, Atti182, Badger, bask, blake, BurnB1, CollateralTech, CorrectJeans, Craig 3.0, decoder, Digs, downundermonkey, DWeb, elocksmith, emergent_layer, Fantasm Industries, galaxy1249, Granny, H.J, hunson, HVLogic, imaginary_unit, infinitelyExplosive, ishyladson, Kaiser, Kewltune, f-eq-ma, LawLockTools, Lockleisure, LockpickingDev, NickPicks, Nightmare, NoodleThumb, OnlyPins, Mugatu, PickSmith, Powhoundgabe, Ratyoke, RedWanderer, Sarius, SasPes, spoon, spy-c, Thegamingbug, TOOOL, knowthebird, Wild-Biliam, Wyte, Zak Attack!
`;function ge(){M("Enter the RAFL");const i=L(),{isLoggedIn:k}=n.useContext(I),{raffleAdminRole:w,raflState:v}=n.useContext(q),j=v!=="live"&&!w,[d,A]=n.useState(!1),[r,c]=n.useState(!1);n.useEffect(()=>{r&&(c(!1),d&&i("/rafl/entryform"))},[i,r,d]);const[h,p]=n.useState(()=>{}),R=!!h,C=n.useCallback(t=>{t.preventDefault(),t.stopPropagation(),A(!0),p(t.currentTarget)},[]),u=n.useCallback(t=>{t.preventDefault(),t.stopPropagation(),p(null)},[]),m=n.useCallback(t=>{t.preventDefault(),t.stopPropagation(),i("/rafl/entryform")},[i]),S=e.jsxs("div",{style:{width:"100%",padding:20,justifyItems:"center"},children:[e.jsx("div",{style:{textAlign:"center",fontSize:"1.2rem",marginBottom:15},children:e.jsx(y,{linkText:"Please sign in to enter the Raffle."})}),e.jsx("div",{style:{width:204},children:e.jsx(y,{})})]}),{isMobile:a}=E(),f=a?8:0,o={maxWidth:700,marginLeft:"auto",marginRight:"auto",paddingLeft:f,paddingRight:f},g=a?"0px 10px":"0px 20px",T=a?e.jsx("br",{}):" ",P=e.jsxs(s.Fragment,{children:[!a&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}}),e.jsx(H,{})]});return e.jsxs(s.Fragment,{children:[e.jsx(z,{title:"Enter the RAFL",extras:P}),e.jsxs("div",{style:o,children:[e.jsx(O,{page:"enter"}),e.jsx(W,{text:"About the Raffle"})]}),e.jsxs("div",{style:{...o,backgroundColor:"#222",minHeight:72,alignItems:"center",borderBottom:"1px #555 solid",padding:"20px 20px"},children:[e.jsx("div",{style:{padding:g},children:e.jsx(x,{rehypePlugins:[[b,{target:"_blank"}]],children:`${G}`})}),j?e.jsxs("div",{style:{...o,textAlign:"center",paddingTop:20,paddingBottom:20},children:[e.jsx("strong",{children:"RAFL isn't currently active."}),e.jsx("br",{}),e.jsx("br",{}),e.jsx(l,{variant:"contained",color:"success",disabled:!0,onClick:m,children:"Click here to enter the RAFL"})]}):e.jsxs("div",{style:{...o,textAlign:"center",paddingTop:20,paddingBottom:20},children:["Once you've read the rules and",T,"made your donation",e.jsx("br",{}),e.jsx("br",{}),k?e.jsx(l,{variant:"contained",color:"success",onClick:m,children:"Click here to enter the RAFL"}):e.jsxs(s.Fragment,{children:[e.jsx(l,{variant:"contained",color:"info",onClick:C,children:"Click here to enter the RAFL"}),e.jsx(B,{open:R,anchorEl:h,onClose:u,anchorOrigin:{vertical:"bottom",horizontal:"left"},children:e.jsx("div",{style:{display:"flex",fontSize:"1.2rem",padding:30,width:300,placeItems:"center"},onClick:u,children:S})})]})]}),e.jsx("div",{style:o,children:e.jsx("div",{style:{padding:g},children:e.jsx(x,{rehypePlugins:[[b,{target:"_blank"}]],children:`${_}`})})})]}),e.jsx("div",{style:{height:32}}),e.jsx(F,{}),e.jsx(D,{feature:"raflEnterAbout"}),e.jsx(N,{newSignIn:r,setNewSignIn:c,required:!1,dialog:!1})]})}export{ge as default};
