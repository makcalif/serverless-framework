'use strict';
console.log('Loading function');
const aws = require('aws-sdk');
const stepfunctions = new aws.StepFunctions();

exports.resume = (event, context, callback) => {
    console.log("event:" + JSON.stringify(event));
    
    console.log("prep task param");
  var taskParams = {
    output: JSON.stringify({
        mk : "dummy"
      }),
    taskToken: event.taskToken
   };
   
   console.log('before calling send ' + taskParams.taskToken);

  stepfunctions.sendTaskSuccess(taskParams, function(err, data) {
    if (err) {
        console.log(err, err.stack);
        context.fail('An error occured while calling sendTaskSuccess.');
    } else {
        console.log('send complete:' + data);
        if (data !== null) {  
            console.log('data :' + data);  
        }
    }
});

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
