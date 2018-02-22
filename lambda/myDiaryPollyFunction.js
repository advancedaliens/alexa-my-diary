var Alexa = require('alexa-sdk');

exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context);


    alexa.registerHandlers(handlers);
    alexa.execute();
};

var handlers = {
    'LaunchRequest': function () {
        this.emit('GetNewFactIntent');
    },

    'GetNewFactIntent': function () {
        var say = 'Hello Alien! Here is a note from your Diary!' + getFact();
        this.emit(':tell', say );
    },

    'AMAZON.HelpIntent': function () {
         this.emit(':ask', 'Learn everything you need to know about Amazon Web Services to pass your exam by listening to your very own study notes. You can start by saying, Ryan help me study.', 'try again');
     },

     'AMAZON.CancelIntent': function () {
         this.emit(':tell', 'Goodbye Cloud Gurus');
     },

     'AMAZON.StopIntent': function () {
         this.emit(':tell', 'Goodbye Cloud Gurus');
     }
};

//  helper functions  ===================================================================


function getFact() {
    var myFacts = [
    '<audio src=\"https://s3.amazonaws.com/aa-diary-mp3s/586ebc66-f2b3-43cd-aabc-b87e5a99f94c.mp3" />\'',
    '<audio src=\"https://s3.amazonaws.com/aa-diary-mp3s/bcee978e-84f7-4ee7-b58e-af5b0b164c4b.mp3" />\'',
    '<audio src=\"https://s3.amazonaws.com/aa-diary-mp3s/951242e9-f689-40b8-b97f-b661eaba2298.mp3" />\'',
    '<audio src=\"https://s3.amazonaws.com/aa-diary-mp3s/be4d1787-ae6f-4b30-bda6-75089dba93ea.mp3" />\''
        ]

    var newFact = randomPhrase(myFacts);

    return newFact;
}

function randomPhrase(array) {
    // the argument is an array [] of words or phrases
    var i = 0;
    i = Math.floor(Math.random() * array.length);
    return(array[i]);
}
