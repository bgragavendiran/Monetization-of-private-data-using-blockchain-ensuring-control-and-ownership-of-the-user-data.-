const StreamrClient = require('streamr-client')
const http = require('http')
const fs = require('fs')
const publicIp = require('public-ip');
var express = require("express");
var geoip = require('geoip-lite');
const rp = require('request-promise');
const cheerio = require('cheerio');
var resultData;
//use the application off of express.
var app = express();
var selfip;
app.use(express.static("public"));
app.get("/", function (request, response){
    response.sendFile("./Testindex.html", { root: __dirname });
});
app.set("view engine", "ejs");

// EDIT YOUR LOCATION HERE
app.set('views', 'G:\\Downloads\\Final\\Final\\REACT\\views');


app.get("/getemail", function (request, response){
    var firstname = request.query.firstname;
    var ipd,lt,lg,dn;
    publicIp.v4().then(ip => {
        var geo = geoip.lookup(ip);
        console.log("your public ip address", ip);
        console.log(geo.ll);
        lt=geo.ll[0];
        lg=geo.ll[1];
        ipd=ip;
      });
    rp("https://viewdns.info/propagation/?domain="+firstname).then(function(data){
        //success!
    //    response.send(data)

        let $ = cheerio.load(data);
        let count = $("#null > tbody > tr:nth-child(3) > td > font > table > tbody > tr").length
        var dataArray = []
        var ipArray = []
        for (let i = 1; i < count; i++) {
            dataArray.push($(`#null > tbody > tr:nth-child(3) > td > font > table > tbody > tr:nth-child(${i+1}) > td:nth-child(1)`).text());
            ipArray.push($(`#null > tbody > tr:nth-child(3) > td > font > table > tbody > tr:nth-child(${i+1}) > td:nth-child(2)`).html().split('<br>'));
            // dataArray.push($(`#r > div:nth-child(${i+1}) > div.flex > div.mr-1 > div.text-sm`).text() + " " + $(`#r > div:nth-child(${i+1}) > div.flex > div.mr-1 > div.text-gray-700`).text())
            // ipArray.push($(`#r > div:nth-child(${i+1}) > code`).text())
        }
    //    console.log($("#r > div:nth-child(2) > div.flex > div.mr-1 > div.text-sm").text())
    //    console.log($("#r > div:nth-child(2) > div.flex > div.mr-1 > div.text-gray-700").text())
        console.log(dataArray);
        console.log(ipArray);
        
        dn=[dataArray,ipArray];
        publishData(lt,lg,ipd,firstname,dn);
      })
      .catch(function(err){
        //handle error
      });
      subs()
  
});

app.get("/result", (req, res) => {
    console.log(resultData.site)
    var site = resultData.site
    res.render("result", {name: resultData});
    
})

app.listen(3000);
 
 console.log("Something awesome to happen at http://localhost:3000");
const client = new StreamrClient({
    auth: {
        privateKey: '4decab5e4da56c76167db02a0fc0a991eaf00463dbfb452880f5b456ee6de81c',
    }
})

//publishData();
var l=1;
async function publishData(lat,lng,ip,sitename,dnsprop){

    var streamrData;
    streamrData={
        'ip':ip,
        'lat':lat,
        'lng':lng,
        'site':sitename,
        'dns':dnsprop
    }
console.log(streamrData);
client.publish('0xe01b4f574ff0b2f5393a4a934e473db2c894ea45/webstream_userdata', streamrData);
console.log("Streamr data push Done");
}

async function subs() {

const sub = await client.subscribe({
    stream: '0xe01b4f574ff0b2f5393a4a934e473db2c894ea45/webstream_userdata',
    partition: 0,
}, (msg, metadata) => {
    //console.log( "subs da", msg.dns, msg.site, msg.lat, msg.lng)
    resultData = msg
    console.log("subscribed")
})
}