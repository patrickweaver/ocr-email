var Tesseract = require('tesseract.js')

module.exports = async function(imageUrl, imageData) {
  const t = await Tesseract.recognize(imageUrl, 'eng')
  return t
}