import{b as c,u as p,j as e,R as i,N as u,B as m,F as f,T as g}from"./index-46ede401.js";import{u as y}from"./usePageTitle-250871b9.js";import{R as b}from"./RaffleHeader-0aa067e7.js";import{R as w}from"./RaffleSubHead-61fd8f89.js";import{R as k,A as x}from"./AdminRoleButton-785b5d74.js";import{R as v}from"./RaffleNotLiveDialog-37a692b7.js";import{M as r}from"./index-a7d410c1.js";import{r as s}from"./index-f29309b9.js";import"./useDocumentTitle-126737f4.js";import"./RaffleContext-eb99cb15.js";import"./useData-42116965.js";import"./dataUrls-b0d1ea1b.js";import"./index-0dd34951.js";import"./Dialog-8dddd057.js";import"./Link-ffa5e725.js";const j=`Everyone's favorite /r/lockpicking and LPU tradition is back! Welcome to the 2025 Lockpicking Charity Raffle, it's going to be a riot as always. Every year the community pulls out their crafting tools and digs into their collections to put up some amazing prizes that are winnable only through a combination of charity donations and good luck! The past couple of years we have gotten perilously close to hitting the $50k mark, and I've got a feeling we just might pass it this time around.

**Ticket entries will be accepted through January 31, and the primary prize drawing will happen via livestream on Thursday, February 1 (evening PST, exact time TBD).**

----

`,R=`----

### How to participate

1. Select an [**approved charity**](/#/rafl/charities) to donate to. If there's too many to choose from, feel free to ask for suggestions.

2. Donate! Please take a screenshot of some proof that the donation was accepted and valid. That screenshot must include a visible date or it cannot be accepted!

3. Get an image hosting link to your screenshot by uploading it to https://imgur.com/ or similar.

4. Check out the [**list of prizes**](/#/rafl)

5. Go to the form below to specify your charity, add the link to your screenshot, and [**allocate your tickets among the pots**](/#/rafl/entryform).

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

All of the unkept pots will be placed back into circulation and redrawn in a second stream that will occur on Saturday, February 4.

Anyone who goes above the pot limit during the secondary stream will have until the end of the stream to specify what they would like to put back into circulation, or the last pot(s) they won will be redrawn by default.

### Shipping costs

Important: Take note of the origin locations and shipping notes next to each prize. Prizes that are not labelled as “international shipping included” will require any international shipping to be paid entirely or partially by the winner. Prizes listed as “Domestic only” will not be shipped internationally.

### Approved Charities

Unfortunately, we will not be accepting new charities to this list this year, but there is a [**huge assortment**](/#/rafl/charities) to choose from already!

----

### Ticket Tracker

Totals and breakdowns shown on the site may be delayed by up to 10 minutes. Live tracking of total donations, tickets, and charity breakdowns can be found here:
[https://docs.google.com/spreadsheets/d/1bhKCakkZc8hzUdI-xS_Bi5ftfAo62f359CePe3hta2s](https://docs.google.com/spreadsheets/d/1bhKCakkZc8hzUdI-xS_Bi5ftfAo62f359CePe3hta2s)

### Raffle Entry Form
Adding this another time for maximum visibility. Thanks for reading all the way down, now go here to enter the raffle!

[**https://lpubelts.com/#/rafl/entryform**](https://forms.gle/cqwJ84DeXGayhuYA9)

-----

Big thanks to the people who have helped with the pre-raffle organization and infrastructure this year -- LoganIsOnDiscord has been instrumental in building the charity list, mgsecure and the LPUbelts team created the wesite, PandaFrog created the infrastructure, and Naswek both created our extensive spreadsheet system, and this year has freed us from under the thumb of Mathworks in creating a new drawing program.

An extra big thanks as well to the 40 prize contributors who made it possible for us to have 41 prizes this year: 7woZ3RO51x, amvgaert, banditobrandino07, Bonx, Clefmentine, CollateralTech, CorrectJeans, Craig 3.0, Deadhammer (Cronolock), Devo, Don, Downundermonkey, EdMcBane, elocksmith, f-eq-ma, Gullinbursti, H.J, Hazzert (Nosu), HVLogic, imaginary_unit, ipaidmyrentman, JayDee, knowthebird, MelBrooksKA, Mick777Oz, Moki, Mugatu, Peaceweapon, qikom, ravenrules99, Red Wanderer, SasPes, SgrA8, Sisko, thatonenottrollguy, ThomasH, Trucking Lock, Wyte, Yabende, and Yagias!
`;function q(){y("Enter the RAFL");const l=c(),{isMobile:t}=p(),o=t?8:0,n={maxWidth:700,marginLeft:"auto",marginRight:"auto",paddingLeft:o,paddingRight:o},a=t?"0px 10px":"0px 20px",h=t?e.jsx("br",{}):" ",d=e.jsxs(i.Fragment,{children:[!t&&e.jsx("div",{style:{flexGrow:1,minWidth:"10px"}}),e.jsx(k,{}),e.jsx(x,{})]});return e.jsxs(i.Fragment,{children:[e.jsx(u,{title:"Enter the RAFL",extras:d}),e.jsxs("div",{style:n,children:[e.jsx(b,{page:"enter"}),e.jsx(w,{text:"About the Raffle"})]}),e.jsxs("div",{style:{...n,backgroundColor:"#222",minHeight:72,alignItems:"center",borderBottom:"1px #555 solid",padding:"20px 20px"},children:[e.jsx("div",{style:{padding:a},children:e.jsx(r,{rehypePlugins:[[s,{target:"_blank"}]],children:`${j}`})}),e.jsxs("div",{style:{...n,textAlign:"center",paddingTop:20,paddingBottom:20},children:["Once you've read the rules and",h,"made your donation",e.jsx("br",{}),e.jsx("br",{}),e.jsx(m,{variant:"contained",color:"success",onClick:()=>l("/rafl/entryform"),children:"Click here to enter the RAFL"})]}),e.jsx("div",{style:n,children:e.jsx("div",{style:{padding:a},children:e.jsx(r,{rehypePlugins:[[s,{target:"_blank"}]],children:`${R}`})})})]}),e.jsx("div",{style:{height:32}}),e.jsx(f,{}),e.jsx(g,{feature:"raflEnterAbout"}),e.jsx(v,{})]})}export{q as default};
