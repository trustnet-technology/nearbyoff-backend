
module.exports=async function queue(req, res) {
const AWS = require('aws-sdk');
AWS.config.update({

});
const sqs = new AWS.SQS({apiVersion: '2012-11-05'});
try{
const accountId = req.accountId;
const queueName = req.queueName;
const params = {
  MessageBody: req.body,
  QueueUrl: `https://sqs.us-east-1.amazonaws.com/${accountId}/${queueName}`
  
};
await sqs.sendMessage(params).promise();
console.log('success')
return "Success"
}
catch(err)
{
console.log(err)
return err;
}
};
