let sendStatement= (verbID, verbDisplay, objId, objDisplay) => {
    const player = GetPlayer();
    let jsname = player.GetVar('uName');
    let jsemail = player.GetVar('uEmail');

    let conf = {
        "endpoint": "https://romenatan-samplelrs.lrs.io/xapi/",
        "auth": "Basic " + toBase64("rusebl:bigufv")
    };
  
    ADL.XAPIWrapper.changeConfig(conf);

    const xAPIstatement = {
        "actor": {
            "name":jsname,
            "openid": "http://suth.com/712082",
        },
        "verb": {
            "id": verbID,
            "display": {"en-us":verbDisplay},
        },
        "object": {
            "id":objId,
            "definition": {
                "name": {"en-us":objDisplay}
            }
        },
    };
    const result = ADL.XAPIWrapper.sendStatement(xAPIstatement);
    console.log('Function executed');
};
