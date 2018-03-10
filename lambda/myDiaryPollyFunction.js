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
        var say = 'Hello Alien!';
         
        const { slots } = this.event.request.intent;
        
        console.log("got the slot for username:" + slots.username.value);
        console.log("got the slot for notedate:" + slots.notedate.value);
             
        var userVal = slots.username.value;
		var timeVal = slots.notedate.value;
	
		console.log("value1 = " + userVal);
		console.log("value1 = " + timeVal);
	
		if (!(userVal && timeVal)) {
			console.log("gdg either userVal or timeVal or both are unavailable");
			say = 'Hello Alien! You need to enter both user name and date to get the note from your diary.';
			this.emit(':tell', say );
		} else {
		
			var filterConditionsData = '(#username = :username) AND contains (#notetime, :notetime)';
			var expressionAttributeNamesData = {
							    '#s3url': "url",
							    '#username':"user",
							    '#notetime':"time"
		};
			
		var expressionAttributeValuesData = {
			    ':username' : userVal,
			    ':notetime' : timeVal
		};
	
	
	var params = {
		TableName : process.env.TABLE_NAME,
		ProjectionExpression: '#s3url',
		ExpressionAttributeNames: expressionAttributeNamesData,
   FilterExpression: filterConditionsData,
   ExpressionAttributeValues: expressionAttributeValuesData
	};
        
        
        getNote(params, myResult=>{
        
        	if (myResult && myResult[0] &&myResult[0].url) {
        		say = say + '<audio src=\"' + myResult[0].url + '" />\'';
        	} else {
        		say = say + ' No note available for ' + userVal + ' on ' + timeVal;
        	} 
            
            console.log("after:", say);
            
             this.emit(':tell', say );          
});
		}    
       
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