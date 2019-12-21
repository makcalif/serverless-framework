'use strict';
console.log('Loading function');
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
const transcribeservice = new AWS.TranscribeService();
 
exports.submit = async (event) => {
  
    const params = {
        "TranscriptionJobName": event.jobName,
        "LanguageCode": "en-US",
        "MediaSampleRateHertz": 44100,
        "MediaFormat": "mp3",
        "Media": {
            "MediaFileUri": "s3://mk-transcribe/recording-cc.mp3"
        }
    }

/* response example
                        TranscriptionJob: {
                            TranscriptionJobName: 'lambda1',
                            TranscriptionJobStatus: 'IN_PROGRESS',
                            LanguageCode: 'en-US',
                            MediaSampleRateHertz: 44100,
                            MediaFormat: 'mp3',
                            Media: { MediaFileUri: 's3://mk-transcribe/recording-cc.mp3' },
                            CreationTime: 2019-12-20T05:51:49.423Z
                        }
*/
    const invokeTranscribeService = (transcribeservice, params) => new Promise((resolve, reject) => {
        transcribeservice.startTranscriptionJob(params, (error, data) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(data);
                }
            });
        });
    
    try {
        const result = await invokeTranscribeService(transcribeservice, params);

        console.log('Success!');
        console.log(result);
    }
    catch(err) {
        console.log(`err : ${err}`);
    }; 
    
}