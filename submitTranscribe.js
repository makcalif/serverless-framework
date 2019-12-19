'use strict';
console.log('Loading function');
const aws = require('aws-sdk');
const lambda = new AWS.Lambda();

exports.submit = async (event) => {
 
    // call dummy transcribe lambda
    var params = {
        FunctionName: 'transcribe-dev-dummyTranscribe', /* required */
        Payload: JSON.stringify({"ucid": event.ucid})
      };
      
    const invokeLambda = (lambda, params) => new Promise((resolve, reject) => {
    lambda.invoke(params, (error, data) => {
            if (error) {
            reject(error);
            } else {
            resolve(data);
            }
        });
    });

    try {
        const result = await invokeLambda(lambda, params);

        console.log('Success!');
        console.log(result);
    }
    catch(err) {
        console.log(`err : ${err}`);
    };
}