import{j as e}from"./index-2ac54035.js";import{P as l}from"./nivo-line.es-9a8182c9.js";import{u as r}from"./useWindowSize-c79bb0f9.js";const h=["#d5d5d5","#d8d801","#ed7d01","#389700","#0090de","#634b9f","#9d5918","#ba0303","#1a1a1a","#373737"],x={text:{fontSize:11,fill:"#f00",outlineWidth:0,outlineColor:"transparent"},tooltip:{container:{backgroundColor:"#222",color:"#ccc",fontSize:13}},axis:{domain:{line:{stroke:"#777",strokeWidth:1}},ticks:{line:{stroke:"#666",strokeWidth:1},text:{fill:"#ccc",fontSize:"0.83rem"}},grid:{line:{stroke:"#444",strokeWidth:1}},legend:{text:{fill:"#ccc"}}}},v={axis:{ticks:{text:{fill:"#999",fontSize:"0.83rem"}}}},D={tooltip:{container:{backgroundColor:"#222",color:"#ccc",fontSize:13}},domain:{line:{stroke:"#777",strokeWidth:1}},ticks:{line:{stroke:"#666",strokeWidth:1},text:{fill:"#aaa",fontSize:"0.83rem"}},grid:{line:{stroke:"#444",strokeWidth:1}},legend:{text:{fill:"#ccc"}},labels:{text:{fill:"#ccc",fontSize:"0.75rem",fontWeight:700}}},y=[{Date:"2024-01-01",Visitors:513,Visits:852,"Lock Views":3528},{Date:"2024-01-02",Visitors:608,Visits:1051,"Lock Views":3983},{Date:"2024-01-03",Visitors:561,Visits:929,"Lock Views":3257},{Date:"2024-01-04",Visitors:522,Visits:834,"Lock Views":3489},{Date:"2024-01-05",Visitors:460,Visits:686,"Lock Views":2171},{Date:"2024-01-06",Visitors:569,Visits:887,"Lock Views":3694},{Date:"2024-01-07",Visitors:465,Visits:829,"Lock Views":3408},{Date:"2024-01-08",Visitors:472,Visits:734,"Lock Views":2982},{Date:"2024-01-09",Visitors:463,Visits:729,"Lock Views":3287},{Date:"2024-01-10",Visitors:412,Visits:600,"Lock Views":2667},{Date:"2024-01-11",Visitors:436,Visits:647,"Lock Views":2359},{Date:"2024-01-12",Visitors:431,Visits:662,"Lock Views":2959},{Date:"2024-01-13",Visitors:440,Visits:679,"Lock Views":2735},{Date:"2024-01-14",Visitors:407,Visits:627,"Lock Views":3091},{Date:"2024-01-15",Visitors:429,Visits:658,"Lock Views":2533},{Date:"2024-01-16",Visitors:564,Visits:761,"Lock Views":2304},{Date:"2024-01-17",Visitors:543,Visits:726,"Lock Views":2625},{Date:"2024-01-18",Visitors:457,Visits:632,"Lock Views":2257},{Date:"2024-01-19",Visitors:454,Visits:664,"Lock Views":2424},{Date:"2024-01-20",Visitors:424,Visits:653,"Lock Views":2463},{Date:"2024-01-21",Visitors:377,Visits:528,"Lock Views":2046},{Date:"2024-01-22",Visitors:402,Visits:655,"Lock Views":2661},{Date:"2024-01-23",Visitors:432,Visits:676,"Lock Views":2406},{Date:"2024-01-24",Visitors:481,Visits:727,"Lock Views":2233},{Date:"2024-01-25",Visitors:462,Visits:869,"Lock Views":2117},{Date:"2024-01-26",Visitors:360,Visits:1062,"Lock Views":2146},{Date:"2024-01-27",Visitors:423,Visits:1174,"Lock Views":2288},{Date:"2024-01-28",Visitors:376,Visits:979,"Lock Views":2013}],c={platform:[{label:"Android",value:"70955",id:"Android"},{label:"Win10.0",id:"Win10.0",value:"60210"},{value:"51336",id:"iOS",label:"iOS"},{label:"Mac OS X",value:"14066",id:"Mac OS X"},{label:"Linux",id:"Linux",value:"6542"},{label:"Other",id:"Other",value:1202}],browser:[{id:"Chrome",value:"104607",label:"Chrome"},{label:"Safari",id:"Safari",value:"49518"},{label:"Firefox",id:"Firefox",value:"36798"},{id:"Edge",value:"5212",label:"Edge"},{label:"Samsung",id:"Samsung",value:"4164"},{value:"2525",id:"Opera",label:"Opera"},{label:"Other",id:"Other",value:1487}]},n=[{data:[{y:"23605",x:"midnight"},{x:"1 am",y:"16539"},{x:"2 am",y:"11439"},{x:"3 am",y:"10077"},{y:"9758",x:"4 am"},{y:"14224",x:"5 am"},{y:"21229",x:"6 am"},{x:"7 am",y:"27473"},{y:"36257",x:"8 am"},{x:"9 am",y:"38831"},{y:"40018",x:"10 am"},{y:"43095",x:"11 am"},{x:"noon",y:"44490"},{y:"47696",x:"1 pm"},{x:"2 pm",y:"46217"},{x:"3 pm",y:"45125"},{y:"46837",x:"4 pm"},{x:"5 pm",y:"50557"},{x:"6 pm",y:"54031"},{y:"55611",x:"7 pm"},{x:"8 pm",y:"61182"},{x:"9 pm",y:"53418"},{x:"10 pm",y:"46396"},{x:"11 pm",y:"32545"}],id:"User Time"},{data:[{y:"26425",x:"midnight"},{y:"22691",x:"1 am"},{x:"2 am",y:"22704"},{y:"22698",x:"3 am"},{x:"4 am",y:"23811"},{x:"5 am",y:"26718"},{x:"6 am",y:"30661"},{y:"33976",x:"7 am"},{y:"38198",x:"8 am"},{y:"40196",x:"9 am"},{x:"10 am",y:"40469"},{y:"44021",x:"11 am"},{x:"noon",y:"46943"},{y:"49193",x:"1 pm"},{x:"2 pm",y:"47092"},{x:"3 pm",y:"45885"},{x:"4 pm",y:"45376"},{y:"42066",x:"5 pm"},{y:"42795",x:"6 pm"},{x:"7 pm",y:"43831"},{y:"42150",x:"8 pm"},{x:"9 pm",y:"39379"},{x:"10 pm",y:"31163"},{x:"11 pm",y:"28211"}],id:"Server Time"}],V={description:"Daily Averages",data:[{value:462,label:"Visitors"},{value:768,label:"Visits"},{value:2719,label:"Lock Views"}]},d={description:"Lock Views By Belt",data:[{value:.124,id:"White",label:"White"},{id:"Yellow",value:.121,label:"Yellow"},{value:.135,id:"Orange",label:"Orange"},{label:"Green",id:"Green",value:.164},{label:"Blue",value:.123,id:"Blue"},{label:"Purple",id:"Purple",value:.092},{value:.051,id:"Brown",label:"Brown"},{label:"Red",id:"Red",value:.044},{value:.129,id:"Black",label:"Black"},{id:"Unranked",value:.014,label:"Unranked"}]},m={description:"Since Launch",data:[{label:"Site Vists",value:204311},{value:495504,label:"Lock Views"},{value:129,label:"Countries"}]},k=[{id:"Lock Views",data:[{y:"694",x:"2023-02-20"},{y:"3780",x:"2023-02-27"},{y:"1671",x:"2023-03-06"},{y:"6183",x:"2023-03-13"},{y:"6113",x:"2023-03-20"},{x:"2023-03-27",y:"5944"},{y:"6011",x:"2023-04-03"},{x:"2023-04-10",y:"5754"},{x:"2023-04-17",y:"5921"},{y:"6839",x:"2023-04-24"},{x:"2023-05-01",y:"6947"},{x:"2023-05-08",y:"6101"},{x:"2023-05-15",y:"5711"},{y:"7429",x:"2023-05-22"},{x:"2023-05-29",y:"9031"},{x:"2023-06-05",y:"7186"},{y:"7482",x:"2023-06-12"},{y:"9302",x:"2023-06-19"},{y:"8745",x:"2023-06-26"},{y:"9805",x:"2023-07-03"},{x:"2023-07-10",y:"10168"},{x:"2023-07-17",y:"8071"},{x:"2023-07-24",y:"7838"},{x:"2023-07-31",y:"10908"},{y:"9942",x:"2023-08-07"},{y:"9007",x:"2023-08-14"},{x:"2023-08-21",y:"11107"},{x:"2023-08-28",y:"9536"},{y:"9710",x:"2023-09-04"},{x:"2023-09-11",y:"10547"},{x:"2023-09-18",y:"10158"},{x:"2023-09-25",y:"7938"},{x:"2023-10-02",y:"9066"},{x:"2023-10-09",y:"8602"},{x:"2023-10-16",y:"8456"},{x:"2023-10-23",y:"10046"},{y:"11906",x:"2023-10-30"},{y:"14700",x:"2023-11-06"},{y:"14551",x:"2023-11-13"},{x:"2023-11-20",y:"15229"},{y:"21625",x:"2023-11-27"},{x:"2023-12-04",y:"14545"},{y:"14514",x:"2023-12-11"},{x:"2023-12-18",y:"13703"},{x:"2023-12-25",y:"20856"},{x:"2024-01-01",y:"23530"},{x:"2024-01-08",y:"20080"},{x:"2024-01-15",y:"16652"},{x:"2024-01-22",y:"15864"}]}],u={traffic28days:y,trafficTotals:c,hourlyRequests:n,dailyAverages:V,lockViewsByBelt:d,totals:m,lockViews:k};function g(){const s=u.lockViews,{width:i}=r(),t=i<=360,a=i<=560,o=t?260:a?300:350;return e.jsx("div",{style:{height:o},children:e.jsx(l,{theme:w,data:s,colors:["#4fa720"],lineWidth:3,margin:{top:10,right:20,bottom:50,left:55},xScale:{type:"time",format:"%Y-%m-%d"},xFormat:"time:%m/%d/%y",yScale:{type:"linear",min:"auto",max:"auto",stacked:!0,reverse:!1},curve:"natural",axisBottom:{format:"%b",tickValues:"every 1 month",legendOffset:-12},axisLeft:{tickSize:0,tickPadding:5,tickRotation:0,format:","},enableGridX:!1,enablePoints:!1,useMesh:!0,isInteractive:!1})})}const f={grid:{line:{stroke:"#333",strokeWidth:1}}},w={...x,...f};export{g as L,D as a,h as b,v as l,x as p,u as s};
