// var age = prompt("How old are you?");
(function() {
  //initialize variables
  var startButton = $('#start');
  var breakButton = $('#break');
  var pauseButton = $('#pause');
  var resetButton = $('#reset');
  var options = $('#options');
  var seconds = $('#seconds');
  var minutes = $('#minutes');
  var docTitle = $(document).find('title');
  var timerInterval;
  var isOnBreak = false;
  var timerMinutes = '00';
  var timerSeconds = '05';
  var breakMinutes = '00';
  var breakSeconds = '03';

  //main functionality
  startButton.on('click', startTimer);
  breakButton.on('click', startBreak);
  pauseButton.on('click', pauseTimer);
  resetButton.on('click', resetTimer);

  //function definitions
  function startBreak() {
    // set isOnBreak true
    isOnBreak = true;
    // set the break minutes and seconds
    minutes.text(breakMinutes);
    seconds.text(breakSeconds);
    // hide the break button and start the timer
    breakButton.hide();
    startTimer();
  }
  function startTimer() {
    if (!timerInterval) {
      setDocTitle();
      timerInterval = setInterval(countdown, 1000);
    }
  }
  function pauseTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    startButton.attr('disabled', false);
  }
  function resetTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    minutes.text(timerMinutes);
    seconds.text(timerSeconds);
    startTimer();
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
        options.hide();
        docTitle.text("Time for a break ;>)");
      } else {
        isOnBreak = false;
        startButton.attr('disabled', false);
        minutes.text(timerMinutes);
        seconds.text(timerSeconds);
        options.show();
        docTitle.text("Ready to resume? :>)");
      }
      return;
    }
    if (minutes.text() == minutesTextAsNumber) { startButton.attr('disabled', true); }
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
    setDocTitle();
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

  function setDocTitle() {
    if (isOnBreak) {
      docTitle.text( 'OnBreak: '+minutes.text()+':'+seconds.text() );
    } else {
      docTitle.text( 'Working: '+minutes.text()+':'+seconds.text() );
    }
  }
}());
