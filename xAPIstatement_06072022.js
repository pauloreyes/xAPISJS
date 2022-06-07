//Timer function

var courseTimer = 0;//tracks how much time the user spends taking the course
var slideTimer = 0;//tracks how much time the user spends in one slide
var activityTimer = 0;//tracks how muct time the user spends in an activity

var xDuration;

var courseActiveState = false;
var slideActiveState = false;
var activityActiveState = false;

var timeControl = () => {
    if (courseActiveState === true) {
        courseTimer += 1;
    };
    if (slideActiveState === true) {
        slideTimer += 1;
    };
    if (activityActiveState === true) {
        activityTimer += 1;
    };
};

const timeManager = {
    "course" : {
        "start": () => {courseActiveState = true},
        "stop" : () => {courseActiveState = false},
        "reset": () => {courseTimer = 0},
    },
    "slide" : {
        "start": () => {slideActiveState = true},
        "stop" : () => {slideActiveState = false},
        "reset": () => {courseTimer = 0},
    },
    "activity" : {
        "start": () => {activityActiveState = true},
        "stop" : () => {activityActiveState = false},
        "reset": () => {activityTimer = 0},
    },
};

window.setInterval(timeControl, 1000);

let timeConverter = (timeInSeconds) => {
        let seconds = timeInSeconds;
            if (seconds > 60) {
                if (seconds > 3600) {
                const hours = Math.floor(seconds / 3600);
                const minutes = Math.floor((seconds % 3600) / 60);
                seconds = (seconds % 3600) % 60;
                xDuration = `PT${hours}H${minutes}M${seconds}S`;
                } else {
                const minutes = Math.floor(seconds / 60);
                seconds %= 60;
                xDuration = `PT${minutes}M${seconds}S`;
                console.log(xDuration);
                }
            } else {
                xDuration = `PT${seconds}S`;
                console.log(xDuration);
            };
        };

//xAPI Statement
let sendXAPI = (verbID, verbDisplay, objId, objDisplay, objDescription, email, uname, convertedTime) => {
  const player = GetPlayer();
  let jsname = player.GetVar('uName');
  let jsemail = player.GetVar('uEmail');

  let conf = {
    "endpoint" : "https://xapi-test99.lrs.io/xapi/",
    "auth" : "Basic " + toBase64("tolaha:muzojs")
  };
  
  ADL.XAPIWrapper.changeConfig(conf);

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
        "duration": convertedTime
    }
}
    const result = ADL.XAPIWrapper.sendStatement(xAPIstatement);
    console.log('Function executed');
};
