'use strict';
console.log('Loading function');
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
//const {CustomErrorTranscribeFailed} = require ('./errors');
const transcribeservice = new AWS.TranscribeService();
 
// exports.submit = (event, context, callback) => {
//     callback("customErrorTranscribeFailed");
// };

function CustomErrorTranscribeFailed(message) {
    this.name = "CustomErrorTranscribeFailed";
    this.message = message;
}

exports.submit = async (event) => {
    console.log(`event: ${JSON.stringify(event)}`);

    const doFail = event.transcribe && event.transcribe.fail;
    console.log('doFail:' + doFail);
    const params = {
        "TranscriptionJobName": event.jobName,
        "LanguageCode": "en-US",
        "MediaSampleRateHertz": 44100,
        "MediaFormat": "mp3",
        "Media": {
            "MediaFileUri": "s3://mk-transcribe/recording-cc.mp3"
        }
    }
 
    if (doFail) {
        return Promise.reject(new Error('error in transcribe')).then( () => {
            console.log('resolved');
        }, () => {
            console.log('dummy error');  
            CustomErrorTranscribeFailed.prototype = new Error();
            const error = new CustomErrorTranscribeFailed("custom transcribe failure");
            throw error;
        });
    }

    // const invokeTranscribeService = (transcribeservice, params) => new Promise((resolve, reject) => {
    //     transcribeservice.startTranscriptionJob(params, (error, data) => {
    //             if (error) {
    //                 reject(error);
    //             } else {
    //                 resolve(data);
    //             }
    //         });
    //     });
    
    // try {
    //     const result = await invokeTranscribeService(transcribeservice, params);

    //     console.log('Success!');
    //     console.log(result); 
    //     return result;
    // }
    // catch(err) {
    //     console.log(`err : ${err}`);
    // }; 
};

exports.check = async (event) => {
    console.log(`event: ${JSON.stringify(event)}`); 

    const params = {
        "TranscriptionJobName": event.TranscriptionJob.TranscriptionJobName
    }

    const checkTranscribeJobStatus = (transcribeservice, params) => new Promise((resolve, reject) => {
        transcribeservice.getTranscriptionJob(params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    
    try {
        const result = await checkTranscribeJobStatus(transcribeservice, params);
        console.log('Success!');
        console.log(result);
        const status = result.TranscriptionJob.TranscriptionJobStatus;
        //const status = 'COMPLETED';

        console.log(`status is : ${status}`);
        if(event.transcribeStatus == undefined || event.transcribeStatus == null)
            event.transcribeStatus = {count: 0};

        const retVal = {
            "count": event.transcribeStatus.count + 1,
            "status": status
        };

        console.log(`count is : ${event.transcribeStatus.count}`);
        if (status == 'COMPLETED') {
            console.log(`status is : COMPLETED`);
            retVal.fileUrl = result.TranscriptionJob.Transcript.TranscriptFileUri;
        }            
        return retVal;
        
    }
    catch(err) {
        console.log(`err : ${err}`);
    };
};

exports.process = async (event) => {
    console.log(`event: ${JSON.stringify(event)}`);
};
    
