const conf = {
    "endpoint": "https://xapi-test99.lrs.io/xapi/",
    "auth": "Basic " + btoa("tolaha:muzojs")
};

ADL.XAPIWrapper.changeConfig(conf);

const params = ADL.XAPIWrapper.searchParams();

params['agent'] = '{"mbox": "mailto:paulo.reyes@gmail.com}';
params['verb'] = 'https://clicked.com';
params['activity'] = 'https://object.com';

const xAPIQuery = ADL.XAPIWrapper.getStatements(params);