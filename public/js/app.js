// iife tab
(function() {
  // ### Initialize variables ###
  var startButton = $('#start');
  var breakButton = $('#break');
  var pauseButton = $('#pause');
  var resetButton = $('#reset');
  var timerButton = $('#set-timer');
  var options = $('#options');
  var seconds = $('#seconds');
  var minutes = $('#minutes');
  var docTitle = $(document).find('title');
  var timerLog = $('#timer-log');
  var curTime = new Date().toLocaleString();
  var buttonStrings = [startButton.attr('title'), breakButton.attr('title'), timerButton.attr('title'), 'Unavailable while running.'];
  var logCount = 0;
  var pTag;
  var lastButton = '';
  var timerInterval;
  var isOnBreak = false;
  var timerMinutes = '25';
  var timerSeconds = '00';
  var breakMinutes = '05';
  var breakSeconds = '00';

  // ### Document element behaviors ###
  startButton.on('click', startTimer);
  breakButton.on('click', startBreak);
  pauseButton.on('click', pauseTimer);
  resetButton.on('click', resetTimer);
  timerButton.on('click', setTimer);

  // ### Main Function definitions ###
  console.log(buttonStrings);
  function startBreak() {
    // set isOnBreak true
    isOnBreak = true;
    // set the break minutes and seconds
    minutes.text(breakMinutes);
    seconds.text(breakSeconds);
    // hide the break button and start the timer
    // breakButton.hide();
    startTimer();
  }

  function startTimer() {
    if (logCount === 0 && minutes.text() === timerMinutes && seconds.text() === timerSeconds) {
      // Records the timer settings the first time the timer is run
      logEvent('setTimer');
    }
    if (!timerInterval) {
      lastButton = 'work';
      setDocTitle();
      logEvent('began');
      if (isOnBreak) {
        breakButton.attr('disabled', true);
        breakButton.attr('title', buttonStrings[3]);
      } else {
        startButton.attr('disabled', true);
        timerButton.attr('disabled', true);
        startButton.attr('title', buttonStrings[3]);
        timerButton.attr('title', buttonStrings[3]);
      }
      timerInterval = setInterval(countdown, 1000);
    }
  }

  function pauseTimer() {
    lastButton = 'pause';
    clearInterval(timerInterval);
    timerInterval = null;
    logEvent('was paused with '+minutes.text()+':'+seconds.text()+' left');
    startButton.attr('disabled', false);
    startButton.attr('title', buttonStrings[0]);
  }

  function resetTimer() {
    if (lastButton === 'pause') { logCount--; }
    lastButton = 'reset';
    clearInterval(timerInterval);
    timerInterval = null;
    logEvent('was reset with '+minutes.text()+':'+seconds.text()+' left');
    minutes.text(timerMinutes);
    seconds.text(timerSeconds);
    startButton.attr('disabled', false);
    timerButton.attr('disabled', false);
    startButton.attr('title', buttonStrings[0]);
    timerButton.attr('title', buttonStrings[2]);
  }

  function setTimer() {
    var minutesEnteredAsText = prompt('How many minutes do you want to set for WORK?', '25');
    var minutesEnteredAsNumber = parseInt(minutesEnteredAsText);
    if ( minutesEnteredAsNumber < 4*60 ) {
      timerMinutes = pad(minutesEnteredAsNumber);
      timerSeconds = '00';
      minutes.text(timerMinutes);
      seconds.text(timerSeconds);
      minutesEnteredAsText = prompt('How many minutes to you want to set for your BREAK?', '5');
      minutesEnteredAsNumber = parseInt(minutesEnteredAsText);
      if ( minutesEnteredAsNumber < 4*60 ) {
        breakMinutes = pad(minutesEnteredAsNumber);
        breakSeconds = '00';
        logEvent('setTimer');
      } else {
        logEvent('setTimer');
        alertUser('BREAK time');
      }
    } else {
      alertUser('WORK or BREAK times');
    }
    function alertUser(varsNotChanged) {
      alert('No changes made to '+varsNotChanged+'. Time entered was either invalid or for 4 hours or more. Please try again.');
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
      logEvent('ended');
      if (!isOnBreak) {
        // hide the start button
        startButton.hide();
        startButton.attr('disabled', false);
        startButton.attr('title', buttonStrings[0]);
        //unhide the break button
        breakButton.show();
        options.hide();
        docTitle.text("Time for a break ;>)");
      } else {
        isOnBreak = false;
        startButton.show();
        timerButton.attr('disabled', false);
        timerButton.attr('title', buttonStrings[2]);
        breakButton.hide();
        breakButton.attr('disabled', false);
        breakButton.attr('title', buttonStrings[1]);
        minutes.text(timerMinutes);
        seconds.text(timerSeconds);
        options.show();
        docTitle.text("Ready to resume? :>)");
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
    setDocTitle();
  }

  // ### Helper function definitions ###
  function pad(num) {
    if (num < 10) {
      // spit out the number with a leading zero
      return "0" + num;
    } else {
      // spit out the original number
      return "" + num;
    }
  }

  function setDocTitle() {
    if (isOnBreak) {
      docTitle.text( minutes.text()+':'+seconds.text()+' left (On Break)' );
    } else {
      docTitle.text( minutes.text()+':'+seconds.text()+' left (Working)' );
    }
  }

  function logEvent(startEnd) {
    curTime = new Date().toLocaleString();
    if (startEnd === 'began') {
      pTag = document.createElement('P');
      pTag.id = logCount;
      if (isOnBreak) {
        pTag.appendChild( document.createTextNode( 'Break timer began: '+curTime ) );

      } else {
        pTag.appendChild( document.createTextNode( 'Work timer started: '+curTime ) );
      }
      document.body.appendChild( pTag );
    } else if (startEnd === 'setTimer') {
      pTag = document.createElement('P');
      pTag.id = logCount;
      var logText = 'Timer settings: '+timerMinutes+':'+timerSeconds+' for work, ';
      logText += breakMinutes+':'+breakSeconds+' for your break.';
      pTag.appendChild( document.createTextNode( logText ) );
      document.body.appendChild( pTag );
      logCount++;
    } else {
      pTag = $('#'+logCount);
      pTag.text( pTag.text()+' ..... and '+startEnd+': '+curTime );
      logCount++;
    }
  }
}());
