'use strict';
console.log('Loading function');
const aws = require('aws-sdk'); 

exports.handle = async (event) => {
 
    if (!event.ucid) {
        throw (new Error('missing ucid'));
    } 
    // write to cloud watch
    console.log(`transcribe complete for ucid: ${ucid}`)
}