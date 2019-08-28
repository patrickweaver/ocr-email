const gcpApiUrl = 'https://vision.googleapis.com/v1/images:annotate?'
const GCP_API_KEY = process.env.GOOGLE_CLOUD_API_KEY;

var rp = require('request-promise');
const b64req = rp.defaults({
  encoding: 'base64'
})

async function getGcpOptions(imageUrl) {
  /*let imageData = await b64req({uri: imageUrl})
  .catch(error => {
    console.log("Error");
    console.log(error);
  });
  */
  
  return {
    method: 'POST',
    uri: gcpApiUrl + 'key=' + GCP_API_KEY,
    body: {
      "requests":[
        {
          "image":{
            content: imageUrl
          },
          "features":[
            {
              "type": "TEXT_DETECTION"
            }
          ]
        }
      ]
    },
    json: true // Automatically stringifies the body to JSON
  }
}

async function askGoogleVision(imagePath) {
  return new Promise(async function(resolve, reject) {
    let gcpVisionOptions = await getGcpOptions(imagePath);
    let gvGuess = await rp(gcpVisionOptions);
    if (gvGuess) {
      //data.gvGuess = gvGuess;
      //resolve(data);
      resolve({text: gvGuess.responses[0].textAnnotations[0].description});
    } else {
      reject(Error("No response from Google Vision"));
    }
  });
}

module.exports = {
  googleVisionTextDetection: askGoogleVision
}