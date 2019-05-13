const express = require('express');
const app = express();
const path = require('path');
const http = require('http').Server(app);
const fs = require('fs');
const fetch = require('node-fetch');
const cors = require('cors');
const map = require('lodash/map');
const https = require("https");
const moment = require("moment");
// Variables
const hueIP = 'http://192.168.0.18';
const hueUser = 'gDiIztNg3YZOQF3ASNLHlrDj7SppTwLT-12-C-cs';
const apiUrl = `${hueIP}/api/${hueUser}`
let activatedLights = [];
let sensedPresence = false;

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json())
app.use(cors())


// Routes
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + 'public/index.html'));
});

app.get('/getLights', (req, res) => {
    let light = req.query.light ? req.query.light : ''

    const getData = async url => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        activatedLights = map(json, (l,i) => {
            return {
                name: l.name,
                id: i
            }
        })
        console.log(activatedLights);
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

app.get('/updateLight/:light', (req, res) => {
    let light = req.params.light ? req.params.light : '',
        paramKeys = Object.keys(req.query),
        lightbulb = activatedLights.find(l => l.name.toLowerCase() == light)

    // Cleans data for hue api
    for (var i = 0; i < paramKeys.length; i++) {
        let param = req.query[paramKeys[i]]
        if (paramKeys[i].match(/hue|sat|bri|^ct$/))
            req.query[paramKeys[i]] = parseInt(req.query[paramKeys[i]])

        if (param === 'true')
            req.query[paramKeys[i]] = true

        if (param === 'false')
            req.query[paramKeys[i]] = false
    }

    if (lightbulb) {
        light = lightbulb.id
    }

    const getData = async url => {
      try {
          console.log('start');
        await timeout(alexaTimeConversion(req.query.time));
        console.log('timeout');
        const response = await fetch(url, {
            method: 'put',
            body: JSON.stringify(req.query)
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

app.get('/checkWhosHome', (req, res) => {
    const getData = async url => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        console.log(json);
        return res.json({
            malik: json.state.presence
        })
      } catch (error) {
        console.log(error);
      }
    };
    getData(`${apiUrl}/sensors/10`);
})

app.put('/updateLight/:light', (req, res) => {
    let light = req.params.light ? req.params.light : ''

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

setInterval(() => {
    const getData = async url => {
      try {
        const response = await fetch(url);
        const json = await response.json();
        sensedPresence = json.state.presence
        //TODO: Do something when motion sensor is activated
      } catch (error) {
        console.log(error);
      }
    };
    getData(`${apiUrl}/sensors/3/`);
},10000)


function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

let alexaTimeConversion = time => {
    let delay = time.split('PT')[1]
    if (!delay) {
        return 0
    } else {
        if (delay.match(/H/))
            return delay.split('H')[0] * 3600000;

        if (delay.match(/M/))
            return delay.split('M')[0] * 60000;

        if (delay.match(/S/))
            return delay.split('S')[0] * 1000;
    }
}

http.listen(3001, function(){

  console.log('listening on *:3001');
});
