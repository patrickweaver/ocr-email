var w = 640;
var h = 480;
Webcam.set({
  // live preview size
  width: '100%',
  height: '100%',

  // device capture size
  dest_width: w,
  dest_height: h,

  // final cropped size
  crop_width: w,
  crop_height: h,

  // format and quality
  image_format: 'jpeg',
  jpeg_quality: 90
});

Webcam.attach( '#my-camera' );

function takeSnapshot() {
  // take snapshot and get image data
  Webcam.snap( function(data_uri) {
    // display results in page
    document.getElementById('results').innerHTML =  
      '<img src="' + data_uri + '"/>';
    document.getElementById('download-button').innerHTML =
      '<a class="download-link" href="' + data_uri + '" download>Download Image</a>';
    
    const { TesseractWorker } = Tesseract;
    const worker = new TesseractWorker();

    worker
      .recognize(data_uri, 'eng')
      .progress((p) => {
        //console.log('progress', p);
      })
      .then(({ text }) => {
        console.log('Text: ' + text);
      
        var htmlText = text.split('\n').join('<br/>');
      
        document.getElementById('ocrh1').innerHTML = htmlText;
        
        worker.terminate();
      
        //console.log("'" + text.substring(text.length - 5, text.length) + "'", text.substring(text.length - 5, text.length) === 'send\n')
        if (text.substring(text.length - 5, text.length).toLowerCase() === 'send\n') {
          
          var recipient = false;
          
          
          var subject = text.substring(0, text.indexOf('\n'))
          var body = text.substring(text.indexOf('\n') + 1, text.length - 5)
          
          if (subject.indexOf('@') > 0) {
            recipient = text.substring(0, text.indexOf('\n'))
            var rest = text.substring(text.indexOf('\n') + 1, text.length - 5)
            while (rest.substring(0, 1) === '\n') {
              rest = rest.substring(1, rest.length)
            }
            subject = rest.substring(0, rest.indexOf('\n'))
            body = rest.substring(rest.indexOf('\n') + 1, rest.length)
            while (body.substring(0, 1) === '\n') {
              body = body.substring(1, body.length)
            }
            
          }
          
          var sendUrl = 'https://ocr-email.glitch.me/send?subject=' + subject + '&text=' + body
          
          if (recipient) {
            sendUrl += '&recipient=' + recipient
          }
          
          window.location = sendUrl
        }
        
      
        countdown()
      });
    
  } );
  
  setTimeout(function() {
    var n = document.getElementById('countdown');
    n.style.background = 'none';
    n.style.display = 'none';
    n.innerHTML = '3';
  }, 40);

  
}

// This was hastily remixed from a photobooth app, which is why this countdown function is here 

function countdown() {
  document.getElementById('results').innerHTML = '';
  var sb = document.getElementById('shutter-button');
  sb.blur();
  var n = document.getElementById('countdown');
  n.style.display = 'block';
  var current = parseInt(n.innerHTML);
  setTimeout(function() {
    if (current > 1) {
      n.innerHTML = current - 1;
      countdown();
    } else {
      n.innerHTML = '';
      n.style.background = 'rgba(255, 255, 255, 0.8)';
      setTimeout(takeSnapshot, 40);
    }
  }, 10)
}



