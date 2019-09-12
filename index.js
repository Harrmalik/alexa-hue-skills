/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk');
const https = require("https");
const url = 'https://d2dc9193.ngrok.io';

const WelcomeHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    // DO STUFF HERE

    return handlerInput.responseBuilder
      .speak('welcome dawg')
      .withSimpleCard(SKILL_NAME, 'Playing with lights')
      .getResponse();
  },
};

const OnHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'OnIntent');
  },
  handle(handlerInput) {
    console.log(handlerInput.requestEnvelope.request.intent);
    const lightSlot = handlerInput.requestEnvelope.request.intent.slots.light;
    const colorSlot = handlerInput.requestEnvelope.request.intent.slots.color;
    const timeSlot = handlerInput.requestEnvelope.request.intent.slots.time;
    let light,color,colorParam = '',timeParam = '';

    if (lightSlot) {
      light = lightSlot.value;
    }

    if (colorSlot) {
      let colorInfo = colors.find(c => c.color == colorSlot.value);
      if (colorInfo) {
        color = colorInfo.hue;
        colorParam = `&hue=${color}`;
      }
    }

    if (timeSlot) {
      timeParam = `&time=${timeSlot.value}`;
    }

    console.log(colorParam);
    console.log(timeParam);

    https.get(`${url}/updateLight/${light}?on=true${colorParam}${timeParam}`, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => {
        body += data;
      });
      res.on("end", () => {
        body = JSON.parse(body);
        console.log(body);
      });
    });

    return handlerInput.responseBuilder
      .speak(`
<speak>
    Welcome to Car-Fu.
    <audio src="soundbank://soundlibrary/transportation/amzn_sfx_car_accelerate_01" />
    You can order a ride, or request a fare estimate.
    Which will it be?
</speak>
      `)
      .withSimpleCard(light, `Turned on ${light}`)
      .getResponse();
  },
};

const OffHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return (request.type === 'IntentRequest'
        && request.intent.name === 'OffIntent');
  },
  handle(handlerInput) {
    console.log(handlerInput.requestEnvelope.request.intent);
    const light = handlerInput.requestEnvelope.request.intent.slots.light.value;
    const timeSlot = handlerInput.requestEnvelope.request.intent.slots.time;
    let timeParam = '';

    if (timeSlot) {
      timeParam = `&time=${timeSlot.value}`;
    }

    https.get(`${url}/updateLight/${light}?on=false${timeParam}`, res => {
      res.setEncoding("utf8");
      let body = "";
      res.on("data", data => {
        body += data;
      });
      res.on("end", () => {
        body = JSON.parse(body);
        console.log(body);
      });
    });

    return handlerInput.responseBuilder
      .speak(`Turned off ${light}`)
      .reprompt('Will that be all for today sir.')
      .withSimpleCard(light, `Turned off ${light}`)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'Hue App Demo';
const HELP_MESSAGE = 'You can turn on or off lights by saying turn on table';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const colors = [
  { color: 'blue', hue: 43237},
  { color: 'green', hue: 25000},
  { color: 'yellow', hue: 10911},
  { color: 'purple', hue: 50000},
  { color: 'orange', hue: 7266},
  { color: 'pink', hue: 60000},
  { color: 'red', hue: 70000},
  { color: 'white', hue: 41283}
];

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    WelcomeHandler,
    OnHandler,
    OffHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

