var yoctolib = require('yoctolib');
var request = require('request');
var _ = require('lodash');

var YAPI = yoctolib.YAPI;
var YServo = yoctolib.YServo;

var jenkinsUrl = 'http://buildtools.vital-it.ch/jenkins/api/json' + '/api/json';

// Setup the API to use local VirtualHub
var res = YAPI.RegisterHub('http://127.0.0.1:4444/');


var servoModule = YServo.FirstServo();
if (servoModule === undefined) {
    console.error('No YoctoServo connected!');
    process.exit(1);
}
var target = servoModule.get_module().get_serialNumber();

servo = {
    running: YServo.FindServo(target + ".servo1"),
    error: YServo.FindServo(target + ".servo2")
};

var lastRunning, lastError;

var jenkinsStatus = function () {
    var data = '';

    request({
        url: jenkinsUrl,
        json: true
    }, function (error, response, body) {
        if(!servo.running.isOnline()){
            servo.running.move(500, 1000);
            servo.error.move(500, 1000);
            lastRunning = undefined;
            lastError = undefined;
            return;
        }
        if (error) {
            console.error('ERROR');
            servo.running.move(0, 1000);
            servo.error.move(0, 1000);
            return;
        }

        var status = _.chain(body.jobs)
            .map('color')
            .filter(function (c) {
                return c !== 'disabled';
            })
            .uniq()
            .value();

        var isRunning = _.some(status, function (s) {
            return s.indexOf('anime') >= 0;
        });
        var isError = _.some(status, function (s) {
            return s.indexOf('red') >= 0;
        });
        if (lastRunning !== isRunning) {
            servo.running.move(isRunning ? -1000 : 1000, 1000);
            lastRunning = isRunning;
        }
        if (lastError !== isError) {
            var alpha = isError ? 1000 : -1000;
            servo.error.move(alpha, isError ? 50 : 1000);
            lastError = isError;
        }
    });

};

setInterval(jenkinsStatus, 10000);



