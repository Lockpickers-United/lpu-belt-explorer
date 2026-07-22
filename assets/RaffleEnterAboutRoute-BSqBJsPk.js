import{a as e}from"./chunk-Cyuzqnbw.js";import{Lt as t,yt as n}from"./DefaultPropsProvider-D_RySoZB.js";import{t as r}from"./Button-Bxub9_ZD.js";import{t as i}from"./AuthContext-y2nHlyeR.js";import{o as a}from"./dist-CeM1kz9g.js";import{n as o}from"./Menu-CHW7u8vu.js";import{F as s,o as c,p as l,s as u,u as d}from"./index-CZ2qndn6.js";import{t as f}from"./usePageTitle-B60FALhQ.js";import{t as p}from"./lib-r5y6fxna.js";import{t as m}from"./lib-5JHqdfWO.js";import{t as h}from"./RaffleContext-CiUaFQuf.js";import{t as g}from"./AdminToolButtons-0GO543LA.js";import{t as _}from"./RaffleHeader-DZFpQ9fW.js";import{t as v}from"./RaffleSubHead-B_AeBBuu.js";import{t as y}from"./SignInDetect-2FKOgFAQ.js";var b=e(t(),1),x=`Everyone's favorite /r/lockpicking and LPU tradition is back! Welcome to the 2026 Lockpicking Charity Raffle.

**Ticket entries will be accepted from Monday, January 19th through February 15th, and the primary prize drawing will happen via livestream at 11 a.m. PDT on Monday, February 16th.**

----

`,S=`----

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
`,C=n();function w(){f(`Enter the RAFL`);let e=a(),{isLoggedIn:t}=(0,b.useContext)(i),{raffleAdminRole:n,raflState:w}=(0,b.useContext)(h),T=w!==`live`&&!n,[E,D]=(0,b.useState)(!1),[O,k]=(0,b.useState)(!1);(0,b.useEffect)(()=>{O&&(k(!1),E&&e(`/rafl/entryform`))},[e,O,E]);let[A,j]=(0,b.useState)(()=>void 0),M=!!A,N=(0,b.useCallback)(e=>{e.preventDefault(),e.stopPropagation(),D(!0),j(e.currentTarget)},[]),P=(0,b.useCallback)(e=>{e.preventDefault(),e.stopPropagation(),j(null)},[]),F=(0,b.useCallback)(t=>{t.preventDefault(),t.stopPropagation(),e(`/rafl/entryform`)},[e]),I=(0,C.jsxs)(`div`,{style:{width:`100%`,padding:20,justifyItems:`center`},children:[(0,C.jsx)(`div`,{style:{textAlign:`center`,fontSize:`1.2rem`,marginBottom:15},children:(0,C.jsx)(l,{linkText:`Please sign in to enter the Raffle.`})}),(0,C.jsx)(`div`,{style:{width:204},children:(0,C.jsx)(l,{})})]}),{isMobile:L}=d(),R=L?8:0,z={maxWidth:700,marginLeft:`auto`,marginRight:`auto`,paddingLeft:R,paddingRight:R},B=L?`0px 10px`:`0px 20px`,V=L?(0,C.jsx)(`br`,{}):` `,H=(0,C.jsxs)(b.Fragment,{children:[!L&&(0,C.jsx)(`div`,{style:{flexGrow:1,minWidth:`10px`}}),(0,C.jsx)(g,{})]});return(0,C.jsxs)(b.Fragment,{children:[(0,C.jsx)(u,{title:`Enter the RAFL`,extras:H}),(0,C.jsxs)(`div`,{style:z,children:[(0,C.jsx)(_,{page:`enter`}),(0,C.jsx)(v,{text:`About the Raffle`})]}),(0,C.jsxs)(`div`,{style:{...z,backgroundColor:`#222`,minHeight:72,alignItems:`center`,borderBottom:`1px #555 solid`,padding:`20px 20px`},children:[(0,C.jsx)(`div`,{style:{padding:B},children:(0,C.jsx)(p,{rehypePlugins:[[m,{target:`_blank`}]],children:`${x}`})}),T?(0,C.jsxs)(`div`,{style:{...z,textAlign:`center`,paddingTop:20,paddingBottom:20},children:[(0,C.jsx)(`strong`,{children:`RAFL isn't currently active.`}),(0,C.jsx)(`br`,{}),(0,C.jsx)(`br`,{}),(0,C.jsx)(r,{variant:`contained`,color:`success`,disabled:!0,onClick:F,children:`Click here to enter the RAFL`})]}):(0,C.jsxs)(`div`,{style:{...z,textAlign:`center`,paddingTop:20,paddingBottom:20},children:[`Once you've read the rules and`,V,`made your donation`,(0,C.jsx)(`br`,{}),(0,C.jsx)(`br`,{}),t?(0,C.jsx)(r,{variant:`contained`,color:`success`,onClick:F,children:`Click here to enter the RAFL`}):(0,C.jsxs)(b.Fragment,{children:[(0,C.jsx)(r,{variant:`contained`,color:`info`,onClick:N,children:`Click here to enter the RAFL`}),(0,C.jsx)(o,{open:M,anchorEl:A,onClose:P,anchorOrigin:{vertical:`bottom`,horizontal:`left`},children:(0,C.jsx)(`div`,{style:{display:`flex`,fontSize:`1.2rem`,padding:30,width:300,placeItems:`center`},onClick:P,children:I})})]})]}),(0,C.jsx)(`div`,{style:z,children:(0,C.jsx)(`div`,{style:{padding:B},children:(0,C.jsx)(p,{rehypePlugins:[[m,{target:`_blank`}]],children:`${S}`})})})]}),(0,C.jsx)(`div`,{style:{height:32}}),(0,C.jsx)(s,{}),(0,C.jsx)(c,{feature:`raflEnterAbout`}),(0,C.jsx)(y,{newSignIn:O,setNewSignIn:k,required:!1,dialog:!1})]})}export{w as default};