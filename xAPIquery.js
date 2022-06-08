const conf = {
    "endpoint" : "https://xapi-test99.lrs.io/xapi/",
    "auth" : "Basic " + toBase64("tolaha:muzojs")
  };
  
  ADL.XAPIWrapper.changeConfig(conf);