let sendXAPI = (verbID, verbDisplay, objId, objDisplay, objDescription, email, uname, durTime) => {
  //const player = GetPlayer();
  //let jsname = player.GetVar('uName');
  //let jsemail = player.GetVar('uEmail');

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
        "duration": durTime
    }
}
    const result = ADL.XAPIWrapper.sendStatement(xAPIstatement);
    console.log('Function executed');
};
