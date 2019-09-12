var https = require('https');

const apiKeySid = 'SKjTjLjc8CS4pltKkRlXKomi8MNv5dg9z';
const apiKeySecret = "eEFjbnVNUEp6TjJSTXRUR3NhRDZuVjRjSXhSdTlScHA=";


function getAccessToken() {
    var now = Math.floor(Date.now() / 1000);
    var exp = now + 3600;

    var header = { cty: "stringee-api;v=1" };
    var payload = {
        jti: apiKeySid + "-" + now,
        iss: apiKeySid,
        exp: exp,
        rest_api: 1
    };

    var jwt = require('jsonwebtoken');
    var token = jwt.sign(payload, apiKeySecret, { algorithm: 'HS256', header: header })
    return token;
}


const sendSMS = function (sms) {
    var options = {
        hostname: 'api.stringee.com',
        port: 443,
        path: '/v1/sms',
        method: 'POST',
        headers: {
            'X-STRINGEE-AUTH': getAccessToken(),
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    };

    var postData = JSON.stringify(
        {
            "sms": sms
        }
    );

    var req = https.request(options, function (res) {
        console.log('STATUS:', res.statusCode);
        console.log('HEADERS:', JSON.stringify(res.headers));
        res.setEncoding('utf8');

        res.on('data', function (chunk) {
            console.log('BODY:', chunk);
        });

        res.on('end', function () {
            console.log('No more data in response.');
        });
    });

    req.on('error', function (e) {
        console.log('Problem with request:', e.message);
    });

    req.write(postData);
    req.end();
}

const SmsServices = {
    sendSMS,
}


export default SmsServices;
