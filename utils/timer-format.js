function timerFormatMs(time) {
  const totalSeconds = Math.ceil(time / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${seconds}s`;
}


module.exports = timerFormatMs;