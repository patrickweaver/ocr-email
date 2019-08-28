module.exports = () => {

  function hasGetUserMedia() {
    return !!(navigator.mediaDevices &&
      navigator.mediaDevices.getUserMedia);
  }

  if (hasGetUserMedia()) {
    // Good to go!
  } else {
    alert('Webcam is not supported by your browser');
  }
  
  return
}