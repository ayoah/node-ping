var ping = require('../lib/f-ping'),
    num  = require('../lib/cli-commander')();

var i = 1;
var pingHandler = ping(true);
while (i < num) {

    pingHandler = pingHandler.then(function(ret) {
        return ping(false);
    });

    i++;
}