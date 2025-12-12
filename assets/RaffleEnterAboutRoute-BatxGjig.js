import{b as B,r as n,A as L,u as D,j as e,R as s,N as I,B as l,ba as z,h as E,T as F,bb as y}from"./index-Cg88Al5F.js";import{u as M}from"./usePageTitle-B0xLmN8j.js";import{R as W}from"./RaffleHeader-otLQmGvl.js";import{R as H}from"./RaffleSubHead-DKbxT7rw.js";import{A as G}from"./AdminToolButtons-DkCvRDGO.js";import{S as N}from"./SignInDetect-C7Vg-l6T.js";import{R as q}from"./RaffleContext-D-Y6m1-T.js";import{M as b}from"./index-e-cU2rPl.js";import{r as k}from"./index-C-hsoY0C.js";import"./Cached-BbcmXBAl.js";import"./ExpandMore-BaBVkQbT.js";import"./CircularProgress-D-BkZP7W.js";import"./dataUrls-1xDVM400.js";import"./index-C0RmN517.js";import"./Box-CiSub7PV.js";import"./AccordionSummary-z8-fs1XL.js";import"./Collapse-D1xWrp5f.js";import"./EmojiEvents-CET-vgpb.js";import"./ScopedDialog-BKfNYYzb.js";import"./Cancel-BL8i8AT4.js";import"./Dialog-Cvgo_vfr.js";import"./Zoom-B94VrzUn.js";import"./useData-Dis15-3g.js";import"./index-D59xo8pZ.js";import"./setDeep-J6HEwWhX.js";const J=`Everyone's favorite /r/lockpicking and LPU tradition is back! Welcome to the 2026 Lockpicking Charity Raffle.

**Ticket entries will be accepted from Thursday, January 1st through January 31, and the primary prize drawing will happen via livestream at 11 a.m. PDT on Sunday, February 1st.**

----

`,O=`----

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
`;function ge(){M("Enter the RAFL");const a=B(),{isLoggedIn:x}=n.useContext(L),{raffleAdminRole:w,raflState:v}=n.useContext(q),j=v!=="live"&&!w,[c,R]=n.useState(!1),[r,d]=n.useState(!1);n.useEffect(()=>{r&&(d(!1),c&&a("/rafl/entryform"))},[a,r,c]);const[h,p]=n.useState(()=>{}),S=!!h,A=n.useCallback(t=>{t.preventDefault(),t.stopPropagation(),R(!0),p(t.currentTarget)},[]),u=n.useCallback(t=>{t.preventDefault(),t.stopPropagation(),p(null)},[]),m=n.useCallback(t=>{t.preventDefault(),t.stopPropagation(),a("/rafl/entryform")},[a]),C=e.jsxs("div",{style:{width:"100%",padding:20,justifyItems:"center"},children:[e.jsx("div",{style:{textAlign:"center",fontSize:"1.2rem",marginBottom:15},children:e.jsx(y,{linkText:"Please sign in to enter the Raffle."})}),e.jsx("div",{style:{width:204},children:e.jsx(y,{})})]}),{isMobile:i}=D(),f=i?8:0,o={maxWidth:700,marginLeft:"auto",marginRight:"auto",paddingLeft:f,paddingRight:f},g=i?"0px 10px":"0px 20px",P=i?e.jsx("br",{}):" ",T=e.jsxs(s.Fragment,{children:[!i&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}}),e.jsx(G,{})]});return e.jsxs(s.Fragment,{children:[e.jsx(I,{title:"Enter the RAFL",extras:T}),e.jsxs("div",{style:o,children:[e.jsx(W,{page:"enter"}),e.jsx(H,{text:"About the Raffle"})]}),e.jsxs("div",{style:{...o,backgroundColor:"#222",minHeight:72,alignItems:"center",borderBottom:"1px #555 solid",padding:"20px 20px"},children:[e.jsx("div",{style:{padding:g},children:e.jsx(b,{rehypePlugins:[[k,{target:"_blank"}]],children:`${J}`})}),j?e.jsxs("div",{style:{...o,textAlign:"center",paddingTop:20,paddingBottom:20},children:[e.jsx("strong",{children:"RAFL isn't currently active."}),e.jsx("br",{}),e.jsx("br",{}),e.jsx(l,{variant:"contained",color:"success",disabled:!0,onClick:m,children:"Click here to enter the RAFL"})]}):e.jsxs("div",{style:{...o,textAlign:"center",paddingTop:20,paddingBottom:20},children:["Once you've read the rules and",P,"made your donation",e.jsx("br",{}),e.jsx("br",{}),x?e.jsx(l,{variant:"contained",color:"success",onClick:m,children:"Click here to enter the RAFL"}):e.jsxs(s.Fragment,{children:[e.jsx(l,{variant:"contained",color:"info",onClick:A,children:"Click here to enter the RAFL"}),e.jsx(z,{open:S,anchorEl:h,onClose:u,anchorOrigin:{vertical:"bottom",horizontal:"left"},children:e.jsx("div",{style:{display:"flex",fontSize:"1.2rem",padding:30,width:300,placeItems:"center"},onClick:u,children:C})})]})]}),e.jsx("div",{style:o,children:e.jsx("div",{style:{padding:g},children:e.jsx(b,{rehypePlugins:[[k,{target:"_blank"}]],children:`${O}`})})})]}),e.jsx("div",{style:{height:32}}),e.jsx(E,{}),e.jsx(F,{feature:"raflEnterAbout"}),e.jsx(N,{newSignIn:r,setNewSignIn:d,required:!1,dialog:!1})]})}export{ge as default};
