const inputCheck = require('./inputCheck')()
const ocr = require('./ocr')

const idealH = 480
const idealW = 640

var rotate180 = false

const imageContrast = require('image-filter-contrast');
const imageGrayscale = require('image-filter-grayscale');
const imageBrightness = require('image-filter-brightness');
const imageFilterCore = require('image-filter-core');

var rp = require('request-promise');


//const camera = require('./camera')()

const canvas = document.createElement('canvas');
const video = document.querySelector('#live-video');
const startButton = document.querySelector('#start-button')
const rotateButton = document.querySelector('#rotate-button')
const screenshotImage = document.querySelector('#screenshot-image')

const constraints = {
  video: {
    //width: { min: 640, ideal: 1280, max: 1920 },
    //height: { min: 480, ideal: 720, max: 1080 }
    width: { min: 640, ideal: idealW, max: 1920 },
    height: { min: 480, ideal: idealH, max: 1080 }
  }
};

navigator.mediaDevices.getUserMedia(constraints)
.then((stream) => {video.srcObject = stream});


const capture = async function() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  var ctx = canvas.getContext('2d')
  if (rotate180) {
    ctx.rotate(Math.PI);
    ctx.translate(-video.videoWidth, -video.videoHeight)
  }
  ctx.drawImage(video, 0, 0);
  const imageData = ctx.getImageData(0, 0, idealW, idealH);
  
  var filtered = await imageGrayscale(imageData, 1)
  //filtered = await imageContrast(filtered, { contrast: 70 })
  //filtered = await imageBrightness(filtered, { adjustment: 30} )
  
  // Other browsers will fall back to image/png
  //const image = filtered.toDataURL('image/webp');
  const image = imageFilterCore.convertImageDataToCanvasURL(filtered)
  screenshotImage.src = image
  const ocrResults = await ocr(image, filtered)
  const text = ocrResults.text
  console.log("* * ", text)
  const textH2 = document.getElementById("text")
  textH2.innerHTML = text
  
  const trimText = text.trim()
  
  if (trimText.substring(trimText.length - 4, trimText.length).toLowerCase() === 'send') {
    console.log("SENDING")
    textH2.innerHTML = 'Sent: ' + (await rp({
      method: 'POST',
      uri: 'https://ocr-email-dev.glitch.me/ocr',
      body: {
        imageUrl: image
      },
      json: true
    })).text
    
  } else {
    console.log("NOT SENDING")
    console.log('|' + trimText.substring(trimText.length - 4, trimText.length).toLowerCase() + '|')
    setTimeout(capture, 300)
  }
  
};

startButton.onclick = capture
rotateButton.onclick = () => rotate180 = !rotate180

function handleSuccess(stream) {
  //screenshotButton.disabled = false;
  //video.srcObject = stream;
}

function handleError(error) {
  alert ("Error: " + error)
}




