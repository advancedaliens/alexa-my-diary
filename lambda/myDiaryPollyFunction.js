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
        this.emit('GetNewFactIntent');
    },

    'GetNewFactIntent': function () {
        
        console.log("this.event.request.dialogState:", this.event.request.dialogState);
        
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
             var say = 'Hello Alien!';
         
        const { slots } = this.event.request.intent;
        
        console.log("got the slot for username:" + slots.username.value);
        console.log("got the slot for notedate:" + slots.notedate.value);
             
        var userVal = slots.username.value;
        var timeVal = slots.notedate.value;
        
        userVal = userVal.toLowerCase();
    
        console.log("value1 = " + userVal);
        console.log("value1 = " + timeVal);
    
        if (!(userVal && timeVal)) {
            console.log("either userVal or timeVal or both are unavailable");
            say = 'Hello Alien! You need to enter both user name and date to get the note from your diary.';
            this.emit(':tell', say );
        } else {
            
            var filterConditionsData = '(#username = :username) AND contains (#notetime, :notetime)';
            var expressionAttributeNamesData = {
                                '#noteText': "text",
                                '#username':"user",
                                '#notetime':"time"
        };
            
        var expressionAttributeValuesData = {
                ':username' : userVal,
                ':notetime' : timeVal
        };
    
    
    var params = {
        TableName : process.env.TABLE_NAME,
        ProjectionExpression: '#noteText',
        ExpressionAttributeNames: expressionAttributeNamesData,
   FilterExpression: filterConditionsData,
   ExpressionAttributeValues: expressionAttributeValuesData
    };
        
        
        getNote(params, myResult=>{
        
            if (myResult) {
                
                console.log("Number of notes available:", myResult.length);
                
                if (myResult.length > 1) {
                    say = say + "There are " + myResult.length + " notes available";
                    
                    for (var i=0; i<myResult.length; i++ ) {
                        say = say + "Note:" + i + ": " + myResult[i].text;
                    }
                    
                } else {
                    say = say + myResult[0].text;
                }
                
            } else {
                say = say + ' No note available for ' + userVal + ' on ' + timeVal;
            } 
            
            console.log("after:", say);
            
             this.emit(':tell', say );          
});
        }    
        }
       
    },

    'AMAZON.HelpIntent': function () {
         this.emit(':ask', 'Ask my diary to get the notes from your journal. You can specify an user and date to get notes', 'try again');
     },

     'AMAZON.CancelIntent': function () {
         this.emit(':tell', 'Goodbye Advanced Alien!');
     },

     'AMAZON.StopIntent': function () {
         this.emit(':tell', 'Goodbye Advanced Alien!');
     }
};

//  helper functions  ===================================================================


function getNote(params, callback) {

    var AWS = require('aws-sdk');

    var docClient = new AWS.DynamoDB.DocumentClient();

    console.log('reading note from DynamoDB table');

    docClient.scan(params, (err, data) => {
        if (err) {
            console.error("Unable to read note. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("getNote succeeded:", JSON.stringify(data, null, 2));
            callback(data.Items);  
        }
    });
}