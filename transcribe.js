'use strict';
console.log('Loading function');
const AWS = require('aws-sdk');
const lambda = new AWS.Lambda();
const transcribeservice = new AWS.TranscribeService();
 
exports.submit = async (event) => {
    console.log(`event: ${JSON.stringify(event)}`);
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
        return result;
    }
    catch(err) {
        console.log(`err : ${err}`);
    };

        // return {
        //     TranscriptionJob: {
        //         TranscriptionJobName: 'lambda1',
        //         TranscriptionJobStatus: 'IN_PROGRESS',
        //         LanguageCode: 'en-US',
        //         MediaSampleRateHertz: 44100,
        //         MediaFormat: 'mp3',
        //         Media: { MediaFileUri: 's3://mk-transcribe/recording-cc.mp3' }                 
        //     }
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
    
