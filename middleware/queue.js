
module.exports=async function queue(req, res) {
const AWS = require('aws-sdk');
AWS.config.update({
region: 'us-east-1',
accessKeyId: "AKIAXUHOSHA44HHJ5JBE",
secretAccessKey: "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",
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