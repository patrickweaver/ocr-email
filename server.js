var enabled = false;

var express = require('express');
var app = express();
var nodemailer = require('nodemailer');

app.use(express.static('public'));

var sender = process.env.SENDER;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: sender,
    pass: process.env.PASSWORD
  }
});

app.get("/send", async function (request, response) {
  
  console.log(request.query)
  
  if (enabled){
    var text = request.query.text;
    var subject = request.query.subject;
    
    var recipient = process.env.RECIPIENT
    if (request.query.recipient) {
      recipient = request.query.recipient
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
    response.redirect('/')
  }
  
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
