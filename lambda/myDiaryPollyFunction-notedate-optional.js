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
        var say = 'Hello Alien! Here is a note from your Diary!' + getFact();
        
        console.log("in the function GetNewFactIntent.....", say)
        
        const { slots } = this.event.request.intent;
        
        console.log("got the slot for username:" + slots.username.value);
        console.log("got the slot for notedate:" + slots.notedate.value);
        
        
        var userVal = 'user3';
	var timeVal = '2018-02-14';
	
	console.log("value1 = " + userVal);
	console.log("value1 = " + timeVal);
	

	
	if (timeVal) {
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
	} else {
					var filterConditionsData = '(#username = :username)';
					var expressionAttributeNamesData = {
    				'#s3url': "url",
   				 '#username':"user"
					};

					var expressionAttributeValuesData = {
					    ':username' : userVal
					};
	}
	
	
	var params = {
		TableName : process.env.TABLE_NAME,
		ProjectionExpression: '#s3url',
		ExpressionAttributeNames: expressionAttributeNamesData,
   FilterExpression: filterConditionsData,
   ExpressionAttributeValues: expressionAttributeValuesData
	};
        
        
        readDynamoItem(params, myResult=>{
            var saySow = 'before assigning';

			console.log("before:", saySow);
            saySow = myResult[0].url;
            console.log("after:", saySow);
});
        
        
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


function readDynamoItem(params, callback) {

    var AWS = require('aws-sdk');

    var docClient = new AWS.DynamoDB.DocumentClient();

    console.log('reading item from DynamoDB table');

    docClient.scan(params, (err, data) => {
        if (err) {
            console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
        } else {
            console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
            callback(data.Items);  
        }
    });
}


function getFact(user, time) {

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