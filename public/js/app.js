// var age = prompt("How old are you?");
(function() {
  //initialize variables
  var startButton = $('#start');
  var breakButton = $('#break');
  var seconds = $('#seconds');
  var minutes = $('#minutes');
  var timerInterval;
  var isOnBreak = false;

  //main functionality
  startButton.on('click', startTimer);
  breakButton.on('click', startBreak);

  //function definitions
  function startBreak() {
    // set isOnBreak true
    isOnBreak = true;
    // set the minutes to 5 and seconds to 0
    minutes.text('05');
    seconds.text('00');
    // hide the break button and start the timer
    breakButton.hide();
    startTimer();
  }
  function startTimer() {
    if (!timerInterval) {
      timerInterval = setInterval(countdown, 1000);
    }
  }
  function countdown(){
    var secondsText = seconds.text();
    var secondsTextAsNumber = parseInt(secondsText);
    var minutesText = minutes.text();
    var minutesTextAsNumber = parseInt(minutesText);
    if (minutesTextAsNumber === 0 && secondsTextAsNumber === 0) {
      // stop the timer and decide if isOnBreak or not what to show/hide
      clearInterval(timerInterval);
      timerInterval = null;
      if (!isOnBreak) {
        // disable the start button
        startButton.attr('disabled', true);
        //unhide the break button
        breakButton.show();
      } else {
        isOnBreak = false;
        startButton.attr('disabled', false);
        minutes.text('25');
        seconds.text('00');
      }
      return;
    }
    if (secondsTextAsNumber === 0) {
      // then change seconds text to 59 otherwise keep going
      if (minutesTextAsNumber !== 0) {
        var decreaseMinutesTextAsNumberByOne = minutesTextAsNumber - 1;
        var padMinutesTextAsNumber = pad(decreaseMinutesTextAsNumberByOne);
        minutes.text(padMinutesTextAsNumber);
        seconds.text("59");
      }

    } else {
      var decreaseSecondsAsNumberByOne = secondsTextAsNumber - 1;
      var padSecondsTextAsNumber = pad(decreaseSecondsAsNumberByOne);
      seconds.text(padSecondsTextAsNumber);
    }
    // var secondsValue = parseInt(seconds.text());
    // seconds.text( pad( secondsValue - 1 ) );
  }

  function pad(num) {
    if (num < 10) {
      // spit out the number with a leading zero
      return "0" + num;
    } else {
      // spit out the original number
      return num;
    }
  }
}());
