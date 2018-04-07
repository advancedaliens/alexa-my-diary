var Alexa = require('alexa-sdk');
var AWS = require("aws-sdk");
var documentClient = new AWS.DynamoDB.DocumentClient();

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context, callback);
    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        //this.emit(':tell', 'Welcome to AlienFacts. Wha would like to do?');
         this.emit('GetAlienFactIntent');
    },

    'GetAlienFactIntent': function () {
        
        var factResponse='';
         var city = '';
        
        const { slots } = this.event.request.intent;
        
        
            if (this.event.request.dialogState == "STARTED" || this.event.request.dialogState == "IN_PROGRESS"){
            this.context.succeed({
                "response": {
                    "directives": [
                        {
                            "type": "Dialog.Delegate"
                        }
                    ],
                    "shouldEndSession": false
                },
                "sessionAttributes": {}
            });
        } else {
           
            if (slots) {
                console.log("slot value for city:" + slots.city.value);
             var city = slots.city.value;
            }
        
             if (city) {
                factResponse = "People in " + city + " are funny";
             } else {
                factResponse = "not sure of the city";
            }
        }
        
        
        
        
        
        
       this.emit(':tell', factResponse);
    },

    'AMAZON.HelpIntent': function () {
         this.emit(':ask', 'In HelpIntent of AlienFacts');
     },

     'AMAZON.CancelIntent': function () {
         this.emit(':ask', 'In CancelIntent of AlienFacts');
     },

     'AMAZON.StopIntent': function () {
         this.emit(':ask', 'In StopIntent of AlienFacts');
     }
};