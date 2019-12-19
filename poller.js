'use strict';
console.log('Loading function');
const aws = require('aws-sdk');
const stepfunctions = new aws.StepFunctions();
exports.check = (event, context, callback) => {
    
    var taskParams = {
        activityArn: 'arn:aws:states:us-east-1:287758680514:activity:get-greeting'
    };
    
    stepfunctions.getActivityTask(taskParams, function(err, data) {
        if (err) {
            console.log(err, err.stack);
            context.fail('An error occured while calling getActivityTask.');
        } else {
            if (data === null) {
                // No activities scheduled
                context.succeed('No activities received after 60 seconds.');
            } else {
                var input = JSON.parse(data.input);
                var token = data.taskToken;

                console.log('input :' + input);
                console.log('token :' + token); 
            }
        }
    });
};