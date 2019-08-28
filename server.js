var enabled = false;

const express = require('express');
const app = express();
const bodyParser = require('body-parser')
app.use(bodyParser.json({limit: '50mb'}))
app.use(express.static('public'));

const rp = require('request-promise')
const base64 = require('node-base64-image')

const gvocr = require('./googleVision').googleVisionTextDetection

const nodemailer = require('nodemailer');
const sender = process.env.SENDER;
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: sender,
    pass: process.env.PASSWORD
  }
});



app.get("/", function(req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


app.post("/ocr", async function(req, res) {
  console.log("OCR")
  const imageUrl = req.body.imageUrl
  const gvResponse = await gvocr(imageUrl.substring(22, imageUrl.length))
  var text = gvResponse.text
  
  // Remove 'send' command
  text = text.trim()
  text = text.substring(0, text.length - 4)
  
  console.log("***")
  console.log(gvResponse.text)
  console.log("***")
  
  
  
  var recipient = false;
  var subject = text.substring(0, text.indexOf('\n'))
  var rest = text.substring(text.indexOf('\n') + 1, text.length).trim()
  if (subject.indexOf('@') > 0) {
    recipient = subject
    subject = rest.substring(0, rest.indexOf('\n'))
    rest = rest.substring(rest.indexOf('\n'), rest.length).trim()
  }
  const body = rest
  
  var sendOptions = {
    method: 'GET',
    uri: process.env.PROJECT_URL + 'send',
    qs: {
      subject: subject,
      text: body
    }
  }
  if (recipient) {
    sendOptions.qs.recipient = recipient
  }
  
  const status = await rp(sendOptions)
  
  
  res.json(gvResponse)
})

app.get("/send", async function (req, res) {
  
  console.log('Send Query:')
  console.log(req.query)
  
  if (enabled){
    var text = req.query.text;
    var subject = req.query.subject;
    
    var recipient = process.env.RECIPIENT
    if (req.query.recipient) {
      recipient = req.query.recipient
    }
    

    var mailOptions = {
      from: sender,
      to: recipient,
      subject: subject,
      text: text
    };
       
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log("ERROR:")
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    }); 
    res.json({status: 'sent'})
  } else {
    res.json({status: 'not sent'})
  }
  
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
