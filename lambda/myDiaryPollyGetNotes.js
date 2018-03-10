'use strict';

var AWS = require('aws-sdk'),
documentClient = new AWS.DynamoDB.DocumentClient(); 

console.log("entered getNotes 2")

let getNotes  = function getNotes(event, context, callback) {
	
	var userVal = event.user;
	var timeVal = event.time;
	
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
	documentClient.scan(params, function(err, data){
		if(err){
		    callback(err, null);
		}else{
		    /*data.Items.forEach(function(item) {
            console.log("The url of the item is:", item.url);
        });*/
		    callback(null, data.Items);
		}
	});
}

exports.handler = getNotes;