import boto3
import os
import uuid

def lambda_handler(event, context):
    
    recordId = str(uuid.uuid4())
    voice = event["voice"]
    user = event["user"]
    time = event["time"]
    text = event["text"]

    print('Generating new DynamoDB record, with ID: ' + recordId)
    print('Input Text: ' + text)
    print('Selected voice: ' + voice)
    print('Selected user: ' + user)
    print('Selected time: ' + time)
    
    #Creating new record in DynamoDB table
    dynamodb = boto3.resource('dynamodb')
    table = dynamodb.Table(os.environ['DB_TABLE_NAME'])
    table.put_item(
        Item={
            'id' : recordId,
            'user': user,
            'time': time,
            'text' : text,
            'voice' : voice,
            'status' : 'PROCESSING'
        }
    )
    
    #Sending notification about new post to SNS
    client = boto3.client('sns')
    client.publish(
        TopicArn = os.environ['SNS_TOPIC'],
        Message = recordId
    )
    
    return recordId

# add environment variables - DB_TABLE_NAME=posts   SNS_TOPIC=arn:aws:sns:us-east-1:225124381250:new_posts

# python 2.7
