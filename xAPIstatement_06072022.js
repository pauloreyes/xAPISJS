//Initial Declaration
const player = GetPlayer();
var jsname;
var jsemail;

//Timer function

var courseTimer = 1;//tracks how much time the user spends taking the course
var slideTimer = 0;//tracks how much time the user spends in one slide
var activityTimer = 0;//tracks how muct time the user spends in an activity

var xDuration;

var courseActiveState = false;
var slideActiveState = false;
var activityActiveState = false;

var timeControl = () => {
    if (courseActiveState === true) {
        courseTimer += 1;
        player.SetVar('CourseTimer', courseTimer);
    };
    if (slideActiveState === true) {
        slideTimer += 1;
        player.SetVar('SlideTimer', slideTimer);
    };
    if (activityActiveState === true) {
        activityTimer += 1;
        player.SetVar('ActivityTimer', activityTimer);
    };
};

const timeManager = {
    "course" : {
        "start": () => {courseActiveState = true; console.log('Course Timer Active')},
        "stop" : () => {courseActiveState = false; console.log('Course Timer Deactivated')},
        "reset": () => {courseTimer = 0; player.SetVar('CourseTimer', courseTimer);},
    },
    "slide" : {
        "start": () => {slideActiveState = true; console.log('Slide Timer Active')},
        "stop" : () => {slideActiveState = false; ; console.log('Slide Timer Deactivated')},
        "reset": () => {slideTimer = 0; player.SetVar('SlideTimer', slideTimer);},
    },
    "activity" : {
        "start": () => {activityActiveState = true; console.log('Activity Timer Active')},
        "stop" : () => {activityActiveState = false; console.log('Activity Timer Deactivated')},
        "reset": () => {activityTimer = 0; player.SetVar('ActivityTimer', activityTimer);},
    },
};

window.setInterval(timeControl, 1000);

//xAPI Statement
let sendXAPI = (verbID, verbDisplay, objId, objDisplay, objDescription, email, uname, timeMeasured, successStatus, completionStatus, submittedResponse, scorePercent, scoreNum, scoreMax) => {
    const player = GetPlayer();
    var jsname = player.GetVar('uName');
    var jsemail = 'mailto:' + player.GetVar('uEmail');
    
    const conf = {
    "endpoint" : "https://xapi-test99.lrs.io/xapi/",
    "auth" : "Basic " + btoa("tolaha:muzojs")
  };
  
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
    default:
        console.log('Error encountered while determining what to convert');
  }

  const xAPIstatement = {

    "actor": {
        "mbox": email,
        "name": uname,
        "objectType": "Agent"
    },
    "verb": {
        "id": verbID,
        "display": {
            "en-US": verbDisplay
        }
    },
    "object": {
        "id": objId,
        "definition": {
            "name": {
                "en-US": objDisplay
            },
            "description": {
                "en-US": objDescription
            }
        },
        "objectType": "Activity"
    },
    "result": {
        "score": {
            "scaled": scorePercent,
            "raw": scoreNum,
            "min": 0,
            "max": scoreMax
        },
        "success": successStatus,
        "completion": completionStatus,
        "response": submittedResponse,
        "duration": xDuration
    }
}
    const result = ADL.XAPIWrapper.sendStatement(xAPIstatement);
    console.log('Function executed');
};

let queryFunction = () => {
    ADL.XAPIWrapper.changeConfig(conf);
    const params = ADL.XAPIWrapper.searchParams();

    params['agent'] = '{"mbox": "mailto:paulo.reyes@gmail.com}';
    params['verb'] = 'https://clicked.com';
    params['activity'] = 'https://object.com';

    const xAPIQuery = ADL.XAPIWrapper.getStatements(params);
};