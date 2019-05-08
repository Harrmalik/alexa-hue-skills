var express = require('express');
var app = express();
var path = require('path');
var http = require('http').Server(app);
var fs = require('fs');
var fetch = require('node-fetch');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
var cors = require('cors');
// var _ = require('lodash');

app.use(cors())

var hueIP = 'http://192.168.0.18';
var hueUser = 'gDiIztNg3YZOQF3ASNLHlrDj7SppTwLT-12-C-cs';
var apiUrl = `${hueIP}/api/${hueUser}`
var activatedLights = [];

// var getHueIP = function() {
//     $.get( "https://www.meethue.com/api/nupnp", function( body ) {
//         var ip = body[0] ? body[0].internalipaddress : '0.0.0.0';
//         hueIP = ip;
//         $('#ipText').val(ip);
//     });
// }

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + 'public/index.html'));
});

app.get('/getLights', (req, res) => {
    let light = req.query.light ? req.query.light : ''

    const getData = async url => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json);
        return res.json(json)
      } catch (error) {
        console.log(error);
      }
    };
    getData(`${apiUrl}/lights/${light}`);
})

app.get('/getGroups', (req, res) => {
    let group = req.query.group ? req.query.group : ''

    const getData = async url => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json);
        return res.json(json)
      } catch (error) {
        console.log(error);
      }
    };
    getData(`${apiUrl}/groups/${group}`);
})

app.get('/getSensors', (req, res) => {
    let sensor = req.query.sensor ? req.query.sensor : ''

    const getData = async url => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        // console.log(json);
        return res.json(json)
      } catch (error) {
        console.log(error);
      }
    };
    getData(`${apiUrl}/sensors/${sensor}`);
})

app.put('/updateLight/:light', (req, res) => {
    let light = req.params.light ? req.params.light : ''

    console.log(req.body);
    const getData = async url => {
      try {
        const response = await fetch(url, {
            method: 'put',
            body: JSON.stringify(req.body)
        });
        const json = await response.json();
        console.log(json);
        return res.json(json)
      } catch (error) {
        console.log(error);
      }
    };
    getData(`${apiUrl}/lights/${light}/state`);
})

app.put('/updateGroup/:group', (req, res) => {
    let group = req.params.group ? req.params.group : ''

    const getData = async url => {
      try {
        const response = await fetch(url, {
            method: 'put',
            body: JSON.stringify(req.body)
        });
        const json = await response.json();
        console.log(json);
        return res.json(json)
      } catch (error) {
        console.log(error);
      }
    };
    getData(`${apiUrl}/groups/${group}/action`);
})


http.listen(3001, function(){
  console.log('listening on *:3001');
});
