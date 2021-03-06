// iife tab
(function() {
  // ### Initialize variables ###
  var startButton = $('#start');
  var breakButton = $('#break');
  var pauseButton = $('#pause');
  var resetButton = $('#reset');
  var timerButton = $('#set_timer');
  var options = $('#options');
  var seconds = $('#seconds');
  var minutes = $('#minutes');
  var docTitle = $(document).find('title');
  var timerLog = $('#timer-log');
  var curTime = new Date().toLocaleString();
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
  function startBreak() {
    // set isOnBreak true
    isOnBreak = true;
    // start the timer
    startTimer();
  }

  function startTimer() {
    if (logCount === 0 && minutes.text() === timerMinutes && seconds.text() === timerSeconds) {
      // Records the timer settings the first time the timer is run
      logEvent('setTimer');
    }
    if (!timerInterval) {
      // if the timer isn't already running, set the tab text and initialize the session log
      lastButton = 'work';
      setDocTitle();
      logEvent('began');
      // use isOnBreak to decide which buttons to disable and adjust the title's
      if (isOnBreak) {
        buttonDisabled(breakButton, true);
      } else {
        buttonDisabled(startButton, true);
        buttonDisabled(timerButton, true);
        buttonDisabled(pauseButton, false);
        buttonDisabled(resetButton, false);
      }
      // start the countdown intervals every second
      timerInterval = setInterval(countdown, 1000);
    }
  }

  function pauseTimer() {
    // stop the countdown, session-log the pause, and re-enable the start button
    lastButton = 'pause';
    clearInterval(timerInterval);
    timerInterval = null;
    logEvent('was paused with '+minutes.text()+':'+seconds.text()+' left');
    buttonDisabled(startButton, false);
  }

  function resetTimer() {
    // stop the countdown, check that we haven't already paused the timer for the session log logic
    if (lastButton === 'pause') { logCount -= 1; }
    lastButton = 'reset';
    clearInterval(timerInterval);
    timerInterval = null;
    logEvent('was reset with '+minutes.text()+':'+seconds.text()+' left');
    // now adust the timer back to the last timer settings,
    // and re-enable the Start and timer settings buttons
    minutes.text(timerMinutes);
    seconds.text(timerSeconds);
    buttonDisabled(startButton, false);
    buttonDisabled(timerButton, false);
  }

  function setTimer() {
    // first ask the user for the desired work minutes and convert to a number
    var minutesEnteredAsText = prompt('How many minutes do you want to set for WORK?', '25');
    var minutesEnteredAsNumber = parseInt(minutesEnteredAsText);
    // now test that the user entered valid input for the work minutes, if not alert and close
    if ( minutesEnteredAsNumber < 4*60 ) {
      // now pad what the user entered, and change the work timer default for minutes and seconds
      timerMinutes = pad(minutesEnteredAsNumber);
      timerSeconds = '00';
      minutes.text(timerMinutes);
      seconds.text(timerSeconds);
      // now ask the user for the desired break minutes, and covert it to a number
      minutesEnteredAsText = prompt('How many minutes to you want to set for your BREAK?', '5');
      minutesEnteredAsNumber = parseInt(minutesEnteredAsText);
      if ( minutesEnteredAsNumber < 4*60 ) {
        // now do the same things for the break timer minutes and seconds
        breakMinutes = pad(minutesEnteredAsNumber);
        breakSeconds = '00';
        // now record the changed settings
        logEvent('setTimer');
      } else {
        // since minutes changed, we still record the changed settings
        logEvent('setTimer');
        alertUser('BREAK time');
      }
    } else {
      alertUser('WORK or BREAK times');
    }
    function alertUser(varsNotChanged) {
      // alerts the user to what, if anything, was changed.
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
        buttonDisabled(startButton, false);
        buttonDisabled(timerButton, false);
        //unhide the break button
        breakButton.show();
        options.hide();
        // set the break minutes and seconds
        minutes.text(breakMinutes);
        seconds.text(breakSeconds);
        // alert the user to take a break in the tab text
        docTitle.text("Time for a break ;>)");
      } else {
        // take off break, enable the startButton and disable the break button
        isOnBreak = false;
        startButton.show();
        buttonDisabled(timerButton, false);
        breakButton.hide();
        buttonDisabled(breakButton, false);
        buttonDisabled(pauseButton, true);
        buttonDisabled(resetButton, true);
        // set the work minutes and seconds
        minutes.text(timerMinutes);
        seconds.text(timerSeconds);
        options.show();
        // alert the user to begin work via the tab text
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
    // decide which label to append to the timer text in the browser tab
    if (isOnBreak) {
      docTitle.text( minutes.text()+':'+seconds.text()+' left (On Break)' );
    } else {
      docTitle.text( minutes.text()+':'+seconds.text()+' left (Working)' );
    }
  }

  function logEvent(startEnd) {
    // collect the current time from the server
    curTime = new Date().toLocaleString();
    if (startEnd === 'began') {
      // append the event text for the work/break beginning to the bottom the webpage
      pTag = document.createElement('P');
      // give each session log paragraph an id tag with the current paragraph number
      pTag.id = logCount;
      if (isOnBreak) {
        pTag.appendChild( document.createTextNode( 'Break timer began: '+curTime ) );

      } else {
        pTag.appendChild( document.createTextNode( 'Work timer started: '+curTime ) );
      }
      document.body.appendChild( pTag );
    } else if (startEnd === 'setTimer') {
      // append any log for changed work/break times to the log as a new paragraph
      pTag = document.createElement('P');
      pTag.id = logCount;
      var logText = 'Timer settings: '+timerMinutes+':'+timerSeconds+' for work, ';
      logText += breakMinutes+':'+breakSeconds+' for your break.';
      pTag.appendChild( document.createTextNode( logText ) );
      document.body.appendChild( pTag );
      // increment the paragraph count
      logCount += 1;
    } else {
      // for pauses and resets, append the event to the start-event paragraph
      pTag = $('#'+logCount);
      pTag.text( pTag.text()+' ..... and '+startEnd+': '+curTime );
      // increment the paragraph count
      logCount++;
    }
  }
  function buttonDisabled(button, isDisabled) {
    /* This function helps enable/disable all the timer buttons, and change
     the titles/tooltips to reflect help user understand the timer functions. */
    var buttonTitles = {
      start: "Click to start the work timer.", break: "Click to start the work timer.",
      set_timer: "Click to change the work/break timer durations in minutes.",
      pause: "Click to pause the timer.", reset: "Click to reset the timer.",
      running: "Unavailable while running.", idle: "Unavailable while timer is idle."
    };

    button.attr("disabled", isDisabled); // enables/disables the button passed in.
    var bid = button.attr("id");
    if (isDisabled) {
      // if disabled && the button is the pause or reset button, use the idle title.
      if (bid === "pause" || bid === "reset") {
        button.attr("title", buttonTitles.idle);
      } else {
        button.attr("title", buttonTitles.running); // else use the running title.
      }
    } else { // if not disabled, reset the button title to describe its function.
      button.attr("title", buttonTitles[bid]);
    }
  }
}());
