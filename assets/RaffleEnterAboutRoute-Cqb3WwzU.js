import{b as A,r as n,A as C,u as T,j as e,R as s,N as B,B as f,ba as D,h as L,T as I,bb as g}from"./index-BcsbBaWq.js";import{u as z}from"./usePageTitle-BXB0yJWv.js";import{R as E}from"./RaffleHeader-4zhEy25R.js";import{R as M}from"./RaffleSubHead-BIZ6vhiD.js";import{A as F}from"./AdminToolsButton-BgC5OXgV.js";import{R as W}from"./RaffleNotLiveDialog-DG4CSJ2X.js";import{S as H}from"./SignInDetect-D0TWL8fA.js";import{M as y}from"./index-l_H5oUuw.js";import{r as k}from"./index-LdvOVa5t.js";import"./RaffleContext-z1N32g71.js";import"./useData-CnIO-QdO.js";import"./dataUrls-CThgH6Wi.js";import"./index-D8sgtJIo.js";import"./setDeep-J6HEwWhX.js";import"./Cached-BZ_-V-T9.js";import"./ExpandMore-D5zHml8N.js";import"./CircularProgress-DXIKtQzy.js";import"./Box-yFgoGL2L.js";import"./AccordionSummary-dk9hylid.js";import"./Collapse-B6X5b5oj.js";import"./EmojiEvents-Cv5mcMuK.js";import"./Dialog-cnihh_p5.js";import"./ScopedDialog-DVtHLjPu.js";import"./Cancel-DRNBQ8Cf.js";import"./Zoom-C5wZ8S3-.js";const N=`Everyone's favorite /r/lockpicking and LPU tradition is back! Welcome to the 2026 Lockpicking Charity Raffle.

**Ticket entries will be accepted from Thursday, January 1st through January 31, and the primary prize drawing will happen via livestream at 11 a.m. PDT on Sunday, February 1st.**

----

`,G=`----

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

All of the unkept pots will be placed back into circulation and redrawn in a second stream that will occur on Monday, February 2.

Anyone who goes above the pot limit during the secondary stream will have until the end of the stream to specify what they would like to put back into circulation, or the last pot(s) they won will be redrawn by default.

### Shipping costs

Important: Take note of the origin locations and shipping notes next to each prize. Prizes that are not labelled as “international shipping included” will require any international shipping to be paid entirely or partially by the winner. Prizes listed as “Domestic only” will not be shipped internationally.

-----

An extra big thanks as well to the 59 prize contributors who made it possible for us to have **70** prizes this year: 44 Delta, 4550, amvgaert, Badger, banditobrandino07, Bare Bones Lock Picking, Bonx, BurnB1, CollateralTech, CorrectJeans, Craig 3.0, D.Q, Pudes, Deadhammer, Doktor Weasel, Don, DWeb, elocksmith, escape goat, f-eq-ma, fabianoh130, Fireshaper, Gorg the Blacksmith, Granny, H.J, hunson, HVLogic, imaginary_unit, Joey69692568, kiridashii, knowthebird, lockpickersbench.com, LockpickingDev, Lockpickwebwinkel.nl, locksmitharmy, LPUbelts.com Team, MarkUK, MelBrooksKA, Moki, Mugatu, NCR, NKT, PeaceWeapon, PickSmith, Pyrolock, RakSMT, Ratyoke, Reckedx, rwb yan, Sarius, SasPes, Sidepicks, thatonenottrollguy, todd, Tsubaki, V Pinball, ViceGrip, Wyte, Yabende, and Yagias!
`;function me(){z("Enter the RAFL");const o=A(),{isLoggedIn:b}=n.useContext(C),[l,x]=n.useState(!1),[r,c]=n.useState(!1);n.useEffect(()=>{r&&(c(!1),l&&o("/rafl/entryform"))},[o,r,l]);const[d,h]=n.useState(()=>{}),w=!!d,v=n.useCallback(t=>{t.preventDefault(),t.stopPropagation(),x(!0),h(t.currentTarget)},[]),p=n.useCallback(t=>{t.preventDefault(),t.stopPropagation(),h(null)},[]),j=n.useCallback(t=>{t.preventDefault(),t.stopPropagation(),o("/rafl/entryform")},[o]),R=e.jsxs("div",{style:{width:"100%",padding:20,justifyItems:"center"},children:[e.jsx("div",{style:{textAlign:"center",fontSize:"1.2rem",marginBottom:15},children:e.jsx(g,{linkText:"Please sign in to enter the Raffle."})}),e.jsx("div",{style:{width:204},children:e.jsx(g,{})})]}),{isMobile:a}=T(),m=a?8:0,i={maxWidth:700,marginLeft:"auto",marginRight:"auto",paddingLeft:m,paddingRight:m},u=a?"0px 10px":"0px 20px",S=a?e.jsx("br",{}):" ",P=e.jsxs(s.Fragment,{children:[!a&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}}),e.jsx(F,{})]});return e.jsxs(s.Fragment,{children:[e.jsx(B,{title:"Enter the RAFL",extras:P}),e.jsxs("div",{style:i,children:[e.jsx(E,{page:"enter"}),e.jsx(M,{text:"About the Raffle"})]}),e.jsxs("div",{style:{...i,backgroundColor:"#222",minHeight:72,alignItems:"center",borderBottom:"1px #555 solid",padding:"20px 20px"},children:[e.jsx("div",{style:{padding:u},children:e.jsx(y,{rehypePlugins:[[k,{target:"_blank"}]],children:`${N}`})}),e.jsxs("div",{style:{...i,textAlign:"center",paddingTop:20,paddingBottom:20},children:["Once you've read the rules and",S,"made your donation",e.jsx("br",{}),e.jsx("br",{}),b?e.jsx(f,{variant:"contained",color:"success",onClick:j,children:"Click here to enter the RAFL"}):e.jsxs(s.Fragment,{children:[e.jsx(f,{variant:"contained",color:"info",onClick:v,children:"Click here to enter the RAFL"}),e.jsx(D,{open:w,anchorEl:d,onClose:p,anchorOrigin:{vertical:"bottom",horizontal:"left"},children:e.jsx("div",{style:{display:"flex",fontSize:"1.2rem",padding:30,width:300,placeItems:"center"},onClick:p,children:R})})]})]}),e.jsx("div",{style:i,children:e.jsx("div",{style:{padding:u},children:e.jsx(y,{rehypePlugins:[[k,{target:"_blank"}]],children:`${G}`})})})]}),e.jsx("div",{style:{height:32}}),e.jsx(L,{}),e.jsx(I,{feature:"raflEnterAbout"}),e.jsx(H,{newSignIn:r,setNewSignIn:c,required:!1,dialog:!1}),e.jsx(W,{})]})}export{me as default};
