# OCR Email

This is a proof of concept hastily remixed from a photobooth app so it's a little bit of a mess, sorry!

```public/script.js``` Does this:

1. Press Start
2. Uses [tesseract.js](https://github.com/naptha/tesseract.js) to OCR the text coming from the camera.
3. Splits by new lines into
  - If first line contains '@'
    1. Recipient
    2. Subject
    3. until 'send' is Body
  - Else:
    1. Subject
    3. until 'send' is Body
    
Send your message by writing 'send' at the end.


Sending actually happens on the backend using [Nodemailer](https://nodemailer.com/about/), it's disabled on this app, but you can remix!

Send messages by GET request to ```/send``` with query strings:
  - recipient: email@example.com
  - subject: Hello
  - body: Go home from work now!
  
  ```/send?recipient=email@example.com&subject=hello&body=Go home from work now!```
  
  See ```.env``` for the credentials you will need for sending to work, only works with Gmail for now.