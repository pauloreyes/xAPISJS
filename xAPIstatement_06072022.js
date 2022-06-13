//Initial Declaration

let player = GetPlayer();
let jsname;
let jsemail;
let statementsHolder = 'No data query';

//Timer function

var courseTimer = 1; //tracks how much time the user spends taking the course
var slideTimer = 0; //tracks how much time the user spends in one slide
var activityTimer = 0; //tracks how muct time the user spends in an activity
var inactiveWindowTimer = 0; //tracks how long the user's window has been inactive (this tells us if the learner left the elearning)
var xDuration; //Reports the tracked duration to the LRS. It can only hole one value (course, slide, or activity) at a time. As such, it is only updated and retrieved when a report needs to be sent to the LRS.

var courseActiveState = false;
var slideActiveState = false;
var activityActiveState = false;
var windowInactiveState = false;

var timeControl = () => {
  if (courseActiveState === true) {
    courseTimer += 1;
    player.SetVar('CourseTimer', courseTimer);
  }
  if (slideActiveState === true) {
    slideTimer += 1;
    player.SetVar('SlideTimer', slideTimer);
  }
  if (activityActiveState === true) {
    activityTimer += 1;
    player.SetVar('ActivityTimer', activityTimer);
  }
  if (windowInactiveState === true) {
    inactiveWindowTimer += 1;
    player.SetVar('InactivityTimer', inactiveWindowTimer);
  }
};

const timeManager = {
  course: {
    start: () => {
      courseActiveState = true;
      console.log('Course Timer Active');
    },
    stop: () => {
      courseActiveState = false;
      console.log('Course Timer Deactivated');
    },
    reset: () => {
      courseTimer = 0;
      player.SetVar('CourseTimer', courseTimer);
      console.log('Course Timer Reset');
    },
  },
  slide: {
    start: () => {
      slideActiveState = true;
      console.log('Slide Timer Active');
    },
    stop: () => {
      slideActiveState = false;
      console.log('Slide Timer Deactivated');
    },
    reset: () => {
      slideTimer = 0;
      player.SetVar('SlideTimer', slideTimer);
      console.log('Slide Timer Reset');
    },
  },
  activity: {
    start: () => {
      activityActiveState = true;
      console.log('Activity Timer Active');
    },
    stop: () => {
      activityActiveState = false;
      console.log('Activity Timer Deactivated');
    },
    reset: () => {
      activityTimer = 0;
      player.SetVar('ActivityTimer', activityTimer);
      console.log('Activity Timer Reset');
    },
  },
  inactivity: {
    start: () => {
      windowInactiveState = true;
    },
    stop: () => {
      windowInactiveState = false;
    },
    reset: () => {
      inactiveWindowTimer = 0;
    },
  },
};

window.setInterval(timeControl, 1000);

document.addEventListener('visibilitychange', function () {
  if (document.visibilityState === 'visible') {
    console.log('The window is active.');
    if (windowInactiveState === true) {
      timeManager.inactivity.stop();
      sendXAPI(
        'http://id.tincanapi.com/verb/unfocused',
        'Unfocused',
        'The browser',
        "The browser's window",
        "The e-learning window was put on the background. It's possible that the learner did something else.",
        jsemail,
        jsname,
        'inactivity',
        false,
        false,
        '',
        0,
        0,
        0
      );
      timeManager.inactivity.reset();
    }
  } else {
    timeManager.inactivity.start();
    console.log('The window is inactive.');
  }
});

//Start of the xAPI Statement function ------------------------------------------>
let sendXAPI = (
  verbID,
  verbDisplay,
  objId,
  objDisplay,
  objDescription,
  email,
  uname,
  timeMeasured,
  successStatus,
  completionStatus,
  submittedResponse,
  scoreNum,
  scoreMax
) => {
  const conf = {
    endpoint: 'https://xapi-test99.lrs.io/xapi/',
    auth: 'Basic ' + btoa('tolaha:muzojs'),
  };
  let scorePercent = scoreNum / scoreMax;

  ADL.XAPIWrapper.changeConfig(conf);

  let convertToIso = (secondsVar) => {
    let seconds = secondsVar;
    if (seconds > 60) {
      if (seconds > 3600) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        seconds = (seconds % 3600) % 60;
        return `PT${hours}H${minutes}M${seconds}S`;
      } else {
        const minutes = Math.floor(seconds / 60);
        seconds %= 60;
        return `PT${minutes}M${seconds}S`;
      }
    } else {
      return `PT${seconds}S`;
    }
  };

  switch (timeMeasured.toLowerCase()) {
    case 'course':
      xDuration = convertToIso(courseTimer);
      break;
    case 'slide':
      xDuration = convertToIso(slideTimer);
      break;
    case 'activity':
      xDuration = convertToIso(activityTimer);
      break;
    case 'inactivity':
      xDuration = convertToIso(inactiveWindowTimer);
      break;
    default:
      xDuration = 'No duration tracked';
      console.log('Error encountered while determining what to convert');
  }

  const xAPIstatement = {
    actor: {
      mbox: email,
      name: uname,
      objectType: 'Agent',
    },
    verb: {
      id: verbID,
      display: {
        'en-US': verbDisplay,
      },
    },
    object: {
      id: objId,
      definition: {
        name: {
          'en-US': objDisplay,
        },
        description: {
          'en-US': objDescription,
        },
      },
      objectType: 'Activity',
    },
    result: {
      score: {
        scaled: scorePercent,
        raw: scoreNum,
        min: 0,
        max: scoreMax,
      },
      success: successStatus,
      completion: completionStatus,
      response: submittedResponse,
      duration: xDuration,
    },
  };
  const result = ADL.XAPIWrapper.sendStatement(xAPIstatement);
  console.log('Function executed');
};

let queryXAPIData = (queryBy, queryInput) => {
  if (queryBy === 'agent') {
    queryInput = `"mbox": "mailto":${queryInput}`;
  }

  const conf = {
    endpoint: 'https://xapi-test99.lrs.io/xapi/',
    auth: 'Basic ' + btoa('tolaha:muzojs'),
  };

  ADL.XAPIWrapper.changeConfig(conf);

  const params = ADL.XAPIWrapper.searchParams();
  params[`'${queryBy}'`] = `'${queryInput}'`;
  let xAPIQuery = ADL.XAPIWrapper.getStatements(params);
  statementsHolder = xAPIQuery.statements;
  console.log(statementsHolder);
};

//countdown timer functionality
let countDownStatus = false;
let cdTime = player.GetVar('CountDown');

let countDownTimer = () => {
  if (countDownStatus === true && cdTime > 0) {
    cdTime -= 1;
    player.SetVar('CountDown', cdTime);
    console.log(cdTime);
    console.log(countDownStatus);
  } else {
    countDownStatus = false;
    console.log('CD Stopped');
    stopCD();
    player.SetVar('CountDown', cdTime);
  }
};

let intervalCDMgr;

let startCD = () => {
  if (player.GetVar('ALScore') === 0) {
    countDownStatus = true;
    intervalCDMgr = window.setInterval(countDownTimer, 1000);
  }
};

let stopCD = () => {
  clearInterval(intervalCDMgr);
};
